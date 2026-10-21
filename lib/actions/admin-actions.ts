"use server";

import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canAccessAdmin, canManageAdmins, canEditSchoolProfile } from "@/lib/supabase/permissions";
import type { UserRole, ProfileStatus, Profile, School, Student, Parent, Teacher, Staff, AuditLog } from "@/lib/supabase/types";

// =====================================================================
// AUTHENTICATED CALLER CONTEXT & AUTHORIZATION
// =====================================================================

interface CallerContext {
  userId: string;
  profile: Profile;
  schoolId: string;
}

async function getAuthorizedCaller(): Promise<{ success: boolean; caller?: CallerContext; error?: string }> {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return { success: false, error: "Server Supabase client is not available." };
  }

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return { success: false, error: "Authentication required. Please log in." };
  }

  // Get caller profile
  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profErr || !profile) {
    return { success: false, error: "Institutional profile not found for authenticated user." };
  }

  // Enforce strictly active account status (rejects pending, inactive, suspended)
  if (profile.status !== "active") {
    return { success: false, error: "Account is not active." };
  }

  if (!canAccessAdmin(profile.role)) {
    return { success: false, error: "Access denied. Insufficient administrative privileges." };
  }

  const schoolId = profile.school_id || "a1000000-0000-0000-0000-000000000001";

  return {
    success: true,
    caller: {
      userId: user.id,
      profile: profile as unknown as Profile,
      schoolId,
    },
  };
}

// Helper to write an audit log entry
async function logAuditEvent(
  caller: CallerContext,
  action: string,
  entityType: string,
  entityId?: string | null,
  oldData?: Record<string, unknown> | null,
  newData?: Record<string, unknown> | null
) {
  const admin = createAdminClient();
  if (!admin) return;

  try {
    await admin.from("audit_logs").insert({
      school_id: caller.schoolId,
      actor_user_id: caller.userId,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      old_data: oldData || null,
      new_data: newData || null,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

// =====================================================================
// 1. DASHBOARD METRICS
// =====================================================================

export async function getDashboardMetrics() {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const schoolId = auth.caller.schoolId;

    // Real DB Counts
    const [
      { count: totalStudents },
      { count: totalParents },
      { count: totalTeachers },
      { count: totalStaff },
      { count: activeUsers },
      { count: inactiveUsers },
      { data: recentAudits },
      { data: recentUsers },
    ] = await Promise.all([
      admin.from("students").select("*", { count: "exact", head: true }).eq("school_id", schoolId),
      admin.from("parents").select("*", { count: "exact", head: true }).eq("school_id", schoolId),
      admin.from("teachers").select("*", { count: "exact", head: true }).eq("school_id", schoolId),
      admin.from("staff").select("*", { count: "exact", head: true }).eq("school_id", schoolId),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("school_id", schoolId).eq("status", "active"),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("school_id", schoolId).neq("status", "active"),
      admin.from("audit_logs").select("*").eq("school_id", schoolId).order("created_at", { ascending: false }).limit(6),
      admin.from("profiles").select("*").eq("school_id", schoolId).order("created_at", { ascending: false }).limit(6),
    ]);

    return {
      success: true,
      data: {
        totalStudents: totalStudents || 0,
        totalParents: totalParents || 0,
        totalTeachers: totalTeachers || 0,
        totalStaff: totalStaff || 0,
        activeUsers: activeUsers || 0,
        inactiveUsers: inactiveUsers || 0,
        recentAudits: recentAudits || [],
        recentUsers: (recentUsers as unknown as Profile[]) || [],
        callerRole: auth.caller.profile.role,
        callerName: auth.caller.profile.full_name,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load dashboard metrics.";
    return { success: false, error: msg };
  }
}

// =====================================================================
// 2. USER MANAGEMENT
// =====================================================================

export async function getUsersList(params?: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = admin
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("school_id", auth.caller.schoolId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (params?.role && params.role !== "all") {
      query = query.eq("role", params.role as UserRole);
    }
    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status as ProfileStatus);
    }
    if (params?.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`;
      query = query.or(`full_name.ilike.${q},email.ilike.${q},phone.ilike.${q}`);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      success: true,
      users: (data as unknown as Profile[]) || [],
      totalCount: count || 0,
      page,
      limit,
    };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch users." };
  }
}

export async function provisionNewUser(data: {
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  initialPassword?: string;
}) {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  // Strict: Only admin can create another admin
  if (data.role === "admin" && !canManageAdmins(auth.caller.profile.role)) {
    return { success: false, error: "Only super administrators can provision admin accounts." };
  }

  // Validate inputs
  if (!data.full_name?.trim()) return { success: false, error: "Full name is required." };
  if (!data.email?.trim() || !data.email.includes("@")) return { success: false, error: "Valid email is required." };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const password = data.initialPassword?.trim() || `RPM_${Math.random().toString(36).slice(-8)}!2026`;

    // 1. Create Auth user
    const { data: authData, error: authErr } = await admin.auth.admin.createUser({
      email: data.email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name: data.full_name.trim(),
        role: data.role,
      },
    });

    if (authErr) {
      return { success: false, error: `Auth creation failed: ${authErr.message}` };
    }

    const userId = authData.user.id;

    // 2. Insert Profile
    const { error: profErr } = await admin.from("profiles").upsert({
      id: userId,
      school_id: auth.caller.schoolId,
      full_name: data.full_name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      role: data.role,
      status: "active",
    });

    if (profErr) {
      return { success: false, error: `Profile creation failed: ${profErr.message}` };
    }

    // 3. Create domain record if student, parent, teacher, or staff
    if (data.role === "student") {
      await admin.from("students").insert({
        school_id: auth.caller.schoolId,
        profile_id: userId,
        status: "active",
      });
    } else if (data.role === "parent") {
      await admin.from("parents").insert({
        school_id: auth.caller.schoolId,
        profile_id: userId,
        status: "active",
      });
    } else if (data.role === "teacher") {
      await admin.from("teachers").insert({
        school_id: auth.caller.schoolId,
        profile_id: userId,
        designation: "TEACHER",
        qualification: "B.Ed",
        status: "active",
      });
    } else if (data.role === "staff") {
      await admin.from("staff").insert({
        school_id: auth.caller.schoolId,
        profile_id: userId,
        designation: "Staff",
        status: "active",
      });
    }

    // 4. Audit Log
    await logAuditEvent(
      auth.caller,
      "user_provisioned",
      "profile",
      userId,
      null,
      { full_name: data.full_name, email: data.email, role: data.role }
    );

    return {
      success: true,
      message: `User ${data.full_name} (${data.role}) successfully provisioned.`,
      userId,
    };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to provision user." };
  }
}

export async function updateUserStatus(userId: string, newStatus: ProfileStatus) {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  // Cannot modify own status
  if (auth.caller.userId === userId) {
    return { success: false, error: "Administrators cannot deactivate their own account." };
  }

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    // Get old profile
    const { data: oldProf } = await admin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .eq("school_id", auth.caller.schoolId)
      .single();

    if (!oldProf) return { success: false, error: "User not found in current school." };

    // Update
    const { error: updErr } = await admin
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", userId);

    if (updErr) throw updErr;

    // Log Audit
    await logAuditEvent(
      auth.caller,
      "user_status_changed",
      "profile",
      userId,
      { status: oldProf.status },
      { status: newStatus }
    );

    return { success: true, message: `Account status updated to ${newStatus}.` };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update status." };
  }
}

export async function updateUserRole(userId: string, newRole: UserRole) {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  // Only admin can change roles
  if (!canManageAdmins(auth.caller.profile.role)) {
    return { success: false, error: "Only administrators can modify roles." };
  }

  if (auth.caller.userId === userId) {
    return { success: false, error: "Administrators cannot change their own role." };
  }

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { data: oldProf } = await admin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .eq("school_id", auth.caller.schoolId)
      .single();

    if (!oldProf) return { success: false, error: "User not found in school." };

    const { error: updErr } = await admin
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (updErr) throw updErr;

    // Also update auth user metadata
    await admin.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole },
    });

    await logAuditEvent(
      auth.caller,
      "user_role_changed",
      "profile",
      userId,
      { role: oldProf.role },
      { role: newRole }
    );

    return { success: true, message: `User role updated to ${newRole}.` };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update role." };
  }
}

// =====================================================================
// 3. STUDENT MANAGEMENT & RELATIONSHIPS
// =====================================================================

export async function getStudentsList(params?: { search?: string; status?: string }) {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    let query = admin
      .from("students")
      .select("*, profile:profiles(*)")
      .eq("school_id", auth.caller.schoolId)
      .order("created_at", { ascending: false });

    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status as Student["status"]);
    }
    if (params?.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`;
      query = query.or(`admission_number.ilike.${q}`);
    }

    const { data: students, error } = await query;
    if (error) throw error;

    const studentList = (students || []) as unknown as (Student & { profile?: Profile | null })[];
    // Get linked parents for each student
    const studentIds = studentList.map((s) => s.id);
    let linkages: Record<string, unknown>[] = [];
    if (studentIds.length > 0) {
      const { data: rels } = await admin
        .from("student_parents")
        .select("*, parent:parents(*, profile:profiles(*))")
        .in("student_id", studentIds);
      linkages = (rels as unknown as Record<string, unknown>[]) || [];
    }

    return {
      success: true,
      students: studentList,
      linkages,
    };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load students." };
  }
}

export async function getParentsList(params?: { search?: string }) {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { data: parents, error } = await admin
      .from("parents")
      .select("*, profile:profiles(*)")
      .eq("school_id", auth.caller.schoolId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const parentList = (parents || []) as unknown as (Parent & { profile?: Profile | null })[];
    // Get linked children
    const parentIds = parentList.map((p) => p.id);
    let linkages: Record<string, unknown>[] = [];
    if (parentIds.length > 0) {
      const { data: rels } = await admin
        .from("student_parents")
        .select("*, student:students(*, profile:profiles(*))")
        .in("parent_id", parentIds);
      linkages = (rels as unknown as Record<string, unknown>[]) || [];
    }

    return {
      success: true,
      parents: parentList,
      linkages,
    };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load parents." };
  }
}

export async function linkParentStudent(data: {
  studentId: string;
  parentId: string;
  relationship: string;
  isPrimary?: boolean;
  canReceiveNotifications?: boolean;
}) {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    // Validate student and parent belong to caller's school
    const [{ data: s }, { data: p }] = await Promise.all([
      admin.from("students").select("id").eq("id", data.studentId).eq("school_id", auth.caller.schoolId).single(),
      admin.from("parents").select("id").eq("id", data.parentId).eq("school_id", auth.caller.schoolId).single(),
    ]);

    if (!s || !p) {
      return { success: false, error: "Student or parent record not found in this school." };
    }

    const { error } = await admin.from("student_parents").upsert({
      student_id: data.studentId,
      parent_id: data.parentId,
      relationship: data.relationship || "parent",
      is_primary: Boolean(data.isPrimary),
      can_receive_notifications: data.canReceiveNotifications !== false,
    });

    if (error) throw error;

    await logAuditEvent(
      auth.caller,
      "parent_student_linked",
      "student_parents",
      `${data.studentId}_${data.parentId}`,
      null,
      { relationship: data.relationship, isPrimary: data.isPrimary }
    );

    return { success: true, message: "Parent-Student relationship established." };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to link relationship." };
  }
}

export async function unlinkParentStudent(studentId: string, parentId: string) {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { error } = await admin
      .from("student_parents")
      .delete()
      .eq("student_id", studentId)
      .eq("parent_id", parentId);

    if (error) throw error;

    await logAuditEvent(
      auth.caller,
      "parent_student_unlinked",
      "student_parents",
      `${studentId}_${parentId}`
    );

    return { success: true, message: "Parent-Student link removed." };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to unlink relationship." };
  }
}

// =====================================================================
// 4. TEACHERS & STAFF MANAGEMENT
// =====================================================================

export async function getTeachersList(params?: { search?: string }) {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    let query = admin
      .from("teachers")
      .select("*, profile:profiles(*)")
      .eq("school_id", auth.caller.schoolId)
      .order("created_at", { ascending: true });

    if (params?.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`;
      query = query.or(`designation.ilike.${q},qualification.ilike.${q}`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, teachers: data || [] };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load teachers." };
  }
}

export async function getStaffList() {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { data, error } = await admin
      .from("staff")
      .select("*, profile:profiles(*)")
      .eq("school_id", auth.caller.schoolId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return { success: true, staff: data || [] };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load staff." };
  }
}

// =====================================================================
// 5. AUDIT LOGS VIEWER
// =====================================================================

export async function getAuditLogsList(params?: {
  search?: string;
  action?: string;
  page?: number;
  limit?: number;
}) {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const page = params?.page || 1;
    const limit = params?.limit || 25;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = admin
      .from("audit_logs")
      .select("*", { count: "exact" })
      .eq("school_id", auth.caller.schoolId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (params?.action && params.action !== "all") {
      query = query.eq("action", params.action);
    }
    if (params?.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`;
      query = query.or(`action.ilike.${q},entity_type.ilike.${q},entity_id.ilike.${q}`);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      success: true,
      logs: (data as unknown as AuditLog[]) || [],
      totalCount: count || 0,
      page,
      limit,
    };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load audit logs." };
  }
}

// =====================================================================
// 6. SCHOOL PROFILE & SETTINGS MANAGEMENT
// =====================================================================

export async function getSchoolProfile() {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { data, error } = await admin
      .from("schools")
      .select("*")
      .eq("id", auth.caller.schoolId)
      .single();

    if (error) throw error;

    return {
      success: true,
      school: data as unknown as School,
      canEdit: canEditSchoolProfile(auth.caller.profile.role),
    };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load school profile." };
  }
}

export async function updateSchoolProfile(data: {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}) {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  // Only admin can edit school profile
  if (!canEditSchoolProfile(auth.caller.profile.role)) {
    return { success: false, error: "Only administrators can modify the institutional profile." };
  }

  // Validate
  if (!data.name?.trim()) return { success: false, error: "School name is required." };
  if (!data.phone?.trim()) return { success: false, error: "Phone number is required." };
  if (!data.email?.trim()) return { success: false, error: "Email address is required." };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { data: oldSchool } = await admin
      .from("schools")
      .select("*")
      .eq("id", auth.caller.schoolId)
      .single();

    const { error } = await admin
      .from("schools")
      .update({
        name: data.name.trim(),
        tagline: data.tagline?.trim() || null,
        phone: data.phone.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
        city: data.city?.trim() || null,
        state: data.state?.trim() || null,
        pincode: data.pincode?.trim() || null,
      })
      .eq("id", auth.caller.schoolId);

    if (error) throw error;

    await logAuditEvent(
      auth.caller,
      "school_profile_updated",
      "school",
      auth.caller.schoolId,
      oldSchool,
      data
    );

    return { success: true, message: "Institutional profile updated successfully." };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update profile." };
  }
}

export async function getInstitutionalSettings() {
  const auth = await getAuthorizedCaller();
  if (!auth.success || !auth.caller) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { data, error } = await admin
      .from("site_settings")
      .select("*")
      .eq("school_id", auth.caller.schoolId);

    if (error) throw error;

    return { success: true, settings: data || [] };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load settings." };
  }
}
