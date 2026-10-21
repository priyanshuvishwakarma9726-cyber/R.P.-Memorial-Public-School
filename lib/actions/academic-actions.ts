"use server";

import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canManageAcademicStructure } from "@/lib/supabase/permissions";
import type {
  AcademicYear,
  ClassRoom,
  Section,
  Subject,
  Enrollment,
  Profile,
} from "@/lib/supabase/types";

type AcademicYearUpdate = Partial<Omit<AcademicYear, "id">>;
type ClassUpdate = Partial<Omit<ClassRoom, "id">>;
type SectionUpdate = Partial<Omit<Section, "id">>;
type SubjectUpdate = Partial<Omit<Subject, "id">>;
type EnrollmentUpdate = Partial<Omit<Enrollment, "id">>;

// =====================================================================
// SECURITY HANDSHAKE HELPER
// =====================================================================

interface CallerContext {
  userId: string;
  profile: Profile;
  schoolId: string;
}

async function getAuthorizedAcademicCaller(): Promise<
  { success: true; caller: CallerContext } | { success: false; error: string }
> {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return { success: false, error: "Database service unavailable." };
  }

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return { success: false, error: "Authentication required. Please log in." };
  }

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

  if (!canManageAcademicStructure(profile.role)) {
    return { success: false, error: "Access denied. Insufficient academic administrative privileges." };
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

async function writeAuditEntry(params: {
  schoolId: string;
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string | null;
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
}) {
  const admin = createAdminClient();
  if (!admin) return;

  try {
    await admin.from("audit_logs").insert({
      school_id: params.schoolId,
      actor_user_id: params.actorUserId,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      old_data: params.oldData || null,
      new_data: params.newData || null,
    });
  } catch (err) {
    console.error("Failed to write academic audit log:", err);
  }
}

// =====================================================================
// 1. ACADEMIC STRUCTURE DASHBOARD METRICS
// =====================================================================

export async function getAcademicDashboardMetrics() {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const schoolId = auth.caller.schoolId;

    // 1. Current Academic Year
    const { data: currentYear } = await admin
      .from("academic_years")
      .select("*")
      .eq("school_id", schoolId)
      .eq("is_current", true)
      .maybeSingle();

    // 2. Total Academic Years
    const { count: totalYears } = await admin
      .from("academic_years")
      .select("*", { count: "exact", head: true })
      .eq("school_id", schoolId);

    // 3. Active Classes
    const { count: activeClasses } = await admin
      .from("classes")
      .select("*", { count: "exact", head: true })
      .eq("school_id", schoolId)
      .eq("is_active", true);

    // 4. Active Sections
    const { count: activeSections } = await admin
      .from("sections")
      .select("*", { count: "exact", head: true })
      .eq("school_id", schoolId)
      .eq("is_active", true);

    // 5. Active Subjects
    const { count: activeSubjects } = await admin
      .from("subjects")
      .select("*", { count: "exact", head: true })
      .eq("school_id", schoolId)
      .eq("is_active", true);

    // 6. Total Enrolled Students (in current academic year if configured)
    let enrolledInCurrentYear = 0;
    if (currentYear) {
      const { count: currentEnrollmentCount } = await admin
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("academic_year_id", currentYear.id)
        .eq("status", "active");
      enrolledInCurrentYear = currentEnrollmentCount || 0;
    }

    // 7. Total Active Students in School
    const { count: totalActiveStudents } = await admin
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("school_id", schoolId)
      .eq("status", "active");

    const studentsWithoutCurrentEnrollment = Math.max(
      0,
      (totalActiveStudents || 0) - enrolledInCurrentYear
    );

    return {
      success: true,
      metrics: {
        currentAcademicYear: currentYear ? (currentYear as unknown as AcademicYear) : null,
        totalAcademicYears: totalYears || 0,
        activeClasses: activeClasses || 0,
        activeSections: activeSections || 0,
        activeSubjects: activeSubjects || 0,
        studentsWithCurrentEnrollment: enrolledInCurrentYear,
        studentsWithoutCurrentEnrollment,
        totalActiveStudents: totalActiveStudents || 0,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load academic metrics.",
    };
  }
}

// =====================================================================
// 2. ACADEMIC YEARS MANAGEMENT
// =====================================================================

export async function getAcademicYearsList() {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { data, error } = await admin
      .from("academic_years")
      .select("*")
      .eq("school_id", auth.caller.schoolId)
      .order("start_date", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      academicYears: (data || []) as unknown as AcademicYear[],
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load academic years.",
    };
  }
}

export async function createAcademicYear(data: {
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
}) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  const name = data.name?.trim();
  if (!name) return { success: false, error: "Academic year name is required." };

  // Validate dates
  if (data.start_date && data.end_date) {
    const start = new Date(data.start_date).getTime();
    const end = new Date(data.end_date).getTime();
    if (start >= end) {
      return { success: false, error: "Start date must be strictly before end date." };
    }
  }

  try {
    // If setting as current, atomically deactivate existing current years
    if (data.is_current) {
      await admin
        .from("academic_years")
        .update({ is_current: false })
        .eq("school_id", auth.caller.schoolId)
        .eq("is_current", true);
    }

    const { data: created, error } = await admin
      .from("academic_years")
      .insert({
        school_id: auth.caller.schoolId,
        name,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        is_current: Boolean(data.is_current),
      })
      .select()
      .single();

    if (error) throw error;

    await writeAuditEntry({
      schoolId: auth.caller.schoolId,
      actorUserId: auth.caller.userId,
      action: "ACADEMIC_YEAR_CREATED",
      entityType: "academic_years",
      entityId: created.id,
      newData: created as unknown as Record<string, unknown>,
    });

    return {
      success: true,
      academicYear: created as unknown as AcademicYear,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create academic year.",
    };
  }
}

export async function updateAcademicYear(
  id: string,
  data: {
    name?: string;
    start_date?: string | null;
    end_date?: string | null;
    is_current?: boolean;
  }
) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    // Verify target belongs to school
    const { data: existing, error: fetchErr } = await admin
      .from("academic_years")
      .select("*")
      .eq("id", id)
      .eq("school_id", auth.caller.schoolId)
      .single();

    if (fetchErr || !existing) {
      return { success: false, error: "Academic year not found or cross-school access denied." };
    }

    const updatePayload: AcademicYearUpdate = {};
    if (data.name !== undefined) {
      const name = data.name.trim();
      if (!name) return { success: false, error: "Academic year name cannot be empty." };
      updatePayload.name = name;
    }

    const newStart = data.start_date !== undefined ? data.start_date : existing.start_date;
    const newEnd = data.end_date !== undefined ? data.end_date : existing.end_date;
    if (newStart && newEnd) {
      if (new Date(newStart).getTime() >= new Date(newEnd).getTime()) {
        return { success: false, error: "Start date must be strictly before end date." };
      }
    }

    if (data.start_date !== undefined) updatePayload.start_date = data.start_date;
    if (data.end_date !== undefined) updatePayload.end_date = data.end_date;

    if (data.is_current === true) {
      // Atomically unset other current years
      await admin
        .from("academic_years")
        .update({ is_current: false })
        .eq("school_id", auth.caller.schoolId)
        .eq("is_current", true)
        .neq("id", id);
      updatePayload.is_current = true;
    } else if (data.is_current === false) {
      updatePayload.is_current = false;
    }

    const { data: updated, error: updErr } = await admin
      .from("academic_years")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updErr) throw updErr;

    await writeAuditEntry({
      schoolId: auth.caller.schoolId,
      actorUserId: auth.caller.userId,
      action: "ACADEMIC_YEAR_UPDATED",
      entityType: "academic_years",
      entityId: id,
      oldData: existing as unknown as Record<string, unknown>,
      newData: updated as unknown as Record<string, unknown>,
    });

    return {
      success: true,
      academicYear: updated as unknown as AcademicYear,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update academic year.",
    };
  }
}

export async function setCurrentAcademicYear(academicYearId: string) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    // 1. Verify target exists and belongs to school
    const { data: target, error: targetErr } = await admin
      .from("academic_years")
      .select("*")
      .eq("id", academicYearId)
      .eq("school_id", auth.caller.schoolId)
      .single();

    if (targetErr || !target) {
      return { success: false, error: "Academic year not found or cross-school access denied." };
    }

    // 2. Fetch old current year
    const { data: oldCurrent } = await admin
      .from("academic_years")
      .select("*")
      .eq("school_id", auth.caller.schoolId)
      .eq("is_current", true)
      .maybeSingle();

    // 3. Atomically switch: unset previous current year
    await admin
      .from("academic_years")
      .update({ is_current: false })
      .eq("school_id", auth.caller.schoolId)
      .eq("is_current", true);

    // 4. Set requested year as current
    const { data: newCurrent, error: switchErr } = await admin
      .from("academic_years")
      .update({ is_current: true })
      .eq("id", academicYearId)
      .select()
      .single();

    if (switchErr) throw switchErr;

    // 5. Write audit log
    await writeAuditEntry({
      schoolId: auth.caller.schoolId,
      actorUserId: auth.caller.userId,
      action: "CURRENT_ACADEMIC_YEAR_CHANGED",
      entityType: "academic_years",
      entityId: academicYearId,
      oldData: oldCurrent ? (oldCurrent as unknown as Record<string, unknown>) : null,
      newData: newCurrent as unknown as Record<string, unknown>,
    });

    return {
      success: true,
      academicYear: newCurrent as unknown as AcademicYear,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to set current academic year.",
    };
  }
}

// =====================================================================
// 3. CLASS MANAGEMENT
// =====================================================================

export async function getClassesList() {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { data: classes, error } = await admin
      .from("classes")
      .select("*")
      .eq("school_id", auth.caller.schoolId)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    // Fetch section counts and enrollment counts for each class
    const classList = (classes || []) as unknown as ClassRoom[];
    const classIds = classList.map((c) => c.id);

    const sectionCounts: Record<string, number> = {};
    const enrollmentCounts: Record<string, number> = {};

    if (classIds.length > 0) {
      const { data: sections } = await admin
        .from("sections")
        .select("id, class_id")
        .in("class_id", classIds);

      (sections || []).forEach((sec) => {
        sectionCounts[sec.class_id] = (sectionCounts[sec.class_id] || 0) + 1;
      });

      const { data: enrollments } = await admin
        .from("enrollments")
        .select("id, class_id")
        .in("class_id", classIds)
        .eq("status", "active");

      (enrollments || []).forEach((enr) => {
        enrollmentCounts[enr.class_id] = (enrollmentCounts[enr.class_id] || 0) + 1;
      });
    }

    const enhanced = classList.map((c) => ({
      ...c,
      sectionCount: sectionCounts[c.id] || 0,
      activeEnrollmentCount: enrollmentCounts[c.id] || 0,
    }));

    return {
      success: true,
      classes: enhanced,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load classes.",
    };
  }
}

export async function createClass(data: {
  name: string;
  display_order?: number;
  is_active?: boolean;
}) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  const name = data.name?.trim();
  if (!name) return { success: false, error: "Class name is required." };

  try {
    // Check case-insensitive duplicate within school
    const { data: existing } = await admin
      .from("classes")
      .select("id, name")
      .eq("school_id", auth.caller.schoolId)
      .ilike("name", name);

    if (existing && existing.length > 0) {
      return { success: false, error: `Class with name "${name}" already exists.` };
    }

    const { data: created, error } = await admin
      .from("classes")
      .insert({
        school_id: auth.caller.schoolId,
        name,
        display_order: Number.isInteger(data.display_order) ? data.display_order! : 0,
        is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      })
      .select()
      .single();

    if (error) throw error;

    await writeAuditEntry({
      schoolId: auth.caller.schoolId,
      actorUserId: auth.caller.userId,
      action: "CLASS_CREATED",
      entityType: "classes",
      entityId: created.id,
      newData: created as unknown as Record<string, unknown>,
    });

    return {
      success: true,
      classItem: created as unknown as ClassRoom,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create class.",
    };
  }
}

export async function updateClass(
  id: string,
  data: {
    name?: string;
    display_order?: number;
    is_active?: boolean;
  }
) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { data: existing, error: fetchErr } = await admin
      .from("classes")
      .select("*")
      .eq("id", id)
      .eq("school_id", auth.caller.schoolId)
      .single();

    if (fetchErr || !existing) {
      return { success: false, error: "Class not found or cross-school access denied." };
    }

    const updatePayload: ClassUpdate = {};
    if (data.name !== undefined) {
      const name = data.name.trim();
      if (!name) return { success: false, error: "Class name cannot be empty." };
      // Check duplicate
      const { data: dupes } = await admin
        .from("classes")
        .select("id")
        .eq("school_id", auth.caller.schoolId)
        .ilike("name", name)
        .neq("id", id);
      if (dupes && dupes.length > 0) {
        return { success: false, error: `Another class named "${name}" already exists.` };
      }
      updatePayload.name = name;
    }

    if (data.display_order !== undefined) {
      updatePayload.display_order = data.display_order;
    }

    if (data.is_active !== undefined) {
      updatePayload.is_active = Boolean(data.is_active);
    }

    const { data: updated, error: updErr } = await admin
      .from("classes")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updErr) throw updErr;

    const action = data.is_active === false ? "CLASS_ARCHIVED" : "CLASS_UPDATED";

    await writeAuditEntry({
      schoolId: auth.caller.schoolId,
      actorUserId: auth.caller.userId,
      action,
      entityType: "classes",
      entityId: id,
      oldData: existing as unknown as Record<string, unknown>,
      newData: updated as unknown as Record<string, unknown>,
    });

    return {
      success: true,
      classItem: updated as unknown as ClassRoom,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update class.",
    };
  }
}

// =====================================================================
// 4. SECTION MANAGEMENT
// =====================================================================

export async function getSectionsList(params?: { class_id?: string }) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    let query = admin
      .from("sections")
      .select("*, class:classes(*)")
      .eq("school_id", auth.caller.schoolId)
      .order("name", { ascending: true });

    if (params?.class_id && params.class_id !== "all") {
      query = query.eq("class_id", params.class_id);
    }

    const { data, error } = await query;
    if (error) throw error;

    const sectionList = (data || []) as unknown as (Section & { class?: ClassRoom | null })[];

    // Fetch active enrollments count per section
    const secIds = sectionList.map((s) => s.id);
    const enrollmentCounts: Record<string, number> = {};
    if (secIds.length > 0) {
      const { data: enrs } = await admin
        .from("enrollments")
        .select("id, section_id")
        .in("section_id", secIds)
        .eq("status", "active");

      (enrs || []).forEach((e) => {
        if (e.section_id) {
          enrollmentCounts[e.section_id] = (enrollmentCounts[e.section_id] || 0) + 1;
        }
      });
    }

    const enhanced = sectionList.map((s) => ({
      ...s,
      activeEnrollmentCount: enrollmentCounts[s.id] || 0,
    }));

    return {
      success: true,
      sections: enhanced,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load sections.",
    };
  }
}

export async function createSection(data: {
  class_id: string;
  name: string;
  is_active?: boolean;
}) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  const name = data.name?.trim();
  if (!name) return { success: false, error: "Section name is required." };
  if (!data.class_id) return { success: false, error: "Class selection is required." };

  try {
    // Verify target class exists and belongs to school
    const { data: parentClass, error: classErr } = await admin
      .from("classes")
      .select("id, name, school_id")
      .eq("id", data.class_id)
      .eq("school_id", auth.caller.schoolId)
      .single();

    if (classErr || !parentClass) {
      return { success: false, error: "Target class not found or cross-school access denied." };
    }

    // Check case-insensitive duplicate within active sections for this class
    const { data: duplicates } = await admin
      .from("sections")
      .select("id, name")
      .eq("class_id", data.class_id)
      .eq("is_active", true)
      .ilike("name", name);

    if (duplicates && duplicates.length > 0) {
      return {
        success: false,
        error: `Active section "${name}" already exists for class "${parentClass.name}".`,
      };
    }

    const { data: created, error } = await admin
      .from("sections")
      .insert({
        school_id: auth.caller.schoolId,
        class_id: data.class_id,
        name,
        is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      })
      .select()
      .single();

    if (error) throw error;

    await writeAuditEntry({
      schoolId: auth.caller.schoolId,
      actorUserId: auth.caller.userId,
      action: "SECTION_CREATED",
      entityType: "sections",
      entityId: created.id,
      newData: created as unknown as Record<string, unknown>,
    });

    return {
      success: true,
      section: created as unknown as Section,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create section.",
    };
  }
}

export async function updateSection(
  id: string,
  data: {
    name?: string;
    is_active?: boolean;
  }
) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { data: existingData, error: fetchErr } = await admin
      .from("sections")
      .select("*, class:classes(name)")
      .eq("id", id)
      .eq("school_id", auth.caller.schoolId)
      .single();

    if (fetchErr || !existingData) {
      return { success: false, error: "Section not found or cross-school access denied." };
    }

    const existing = existingData as unknown as Section;
    const updatePayload: SectionUpdate = {};
    if (data.name !== undefined) {
      const name = data.name.trim();
      if (!name) return { success: false, error: "Section name cannot be empty." };

      // Check duplicates in class
      const { data: dupes } = await admin
        .from("sections")
        .select("id")
        .eq("class_id", existing.class_id)
        .eq("is_active", true)
        .ilike("name", name)
        .neq("id", id);

      if (dupes && dupes.length > 0) {
        return { success: false, error: `Another active section named "${name}" already exists in this class.` };
      }
      updatePayload.name = name;
    }

    if (data.is_active !== undefined) {
      updatePayload.is_active = Boolean(data.is_active);
    }

    const { data: updated, error: updErr } = await admin
      .from("sections")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updErr) throw updErr;

    const action = data.is_active === false ? "SECTION_ARCHIVED" : "SECTION_UPDATED";

    await writeAuditEntry({
      schoolId: auth.caller.schoolId,
      actorUserId: auth.caller.userId,
      action,
      entityType: "sections",
      entityId: id,
      oldData: existing as unknown as Record<string, unknown>,
      newData: updated as unknown as Record<string, unknown>,
    });

    return {
      success: true,
      section: updated as unknown as Section,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update section.",
    };
  }
}

// =====================================================================
// 5. SUBJECT MANAGEMENT
// =====================================================================

export async function getSubjectsList(params?: { search?: string; status?: string }) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    let query = admin
      .from("subjects")
      .select("*")
      .eq("school_id", auth.caller.schoolId)
      .order("name", { ascending: true });

    if (params?.status && params.status !== "all") {
      query = query.eq("is_active", params.status === "active");
    }

    if (params?.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`;
      query = query.or(`name.ilike.${q},code.ilike.${q}`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return {
      success: true,
      subjects: (data || []) as unknown as Subject[],
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load subjects.",
    };
  }
}

export async function createSubject(data: {
  name: string;
  code?: string | null;
  is_active?: boolean;
}) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  const name = data.name?.trim();
  if (!name) return { success: false, error: "Subject name is required." };

  const code = data.code?.trim() || null;

  try {
    // If code supplied, check uniqueness within school
    if (code) {
      const { data: codeDupes } = await admin
        .from("subjects")
        .select("id, name")
        .eq("school_id", auth.caller.schoolId)
        .ilike("code", code);

      if (codeDupes && codeDupes.length > 0) {
        return { success: false, error: `Subject code "${code}" is already in use by another subject.` };
      }
    }

    const { data: created, error } = await admin
      .from("subjects")
      .insert({
        school_id: auth.caller.schoolId,
        name,
        code,
        is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      })
      .select()
      .single();

    if (error) throw error;

    await writeAuditEntry({
      schoolId: auth.caller.schoolId,
      actorUserId: auth.caller.userId,
      action: "SUBJECT_CREATED",
      entityType: "subjects",
      entityId: created.id,
      newData: created as unknown as Record<string, unknown>,
    });

    return {
      success: true,
      subject: created as unknown as Subject,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create subject.",
    };
  }
}

export async function updateSubject(
  id: string,
  data: {
    name?: string;
    code?: string | null;
    is_active?: boolean;
  }
) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const { data: existing, error: fetchErr } = await admin
      .from("subjects")
      .select("*")
      .eq("id", id)
      .eq("school_id", auth.caller.schoolId)
      .single();

    if (fetchErr || !existing) {
      return { success: false, error: "Subject not found or cross-school access denied." };
    }

    const updatePayload: SubjectUpdate = {};
    if (data.name !== undefined) {
      const name = data.name.trim();
      if (!name) return { success: false, error: "Subject name cannot be empty." };
      updatePayload.name = name;
    }

    if (data.code !== undefined) {
      const code = data.code?.trim() || null;
      if (code) {
        const { data: dupes } = await admin
          .from("subjects")
          .select("id")
          .eq("school_id", auth.caller.schoolId)
          .ilike("code", code)
          .neq("id", id);

        if (dupes && dupes.length > 0) {
          return { success: false, error: `Subject code "${code}" is already in use.` };
        }
      }
      updatePayload.code = code;
    }

    if (data.is_active !== undefined) {
      updatePayload.is_active = Boolean(data.is_active);
    }

    const { data: updated, error: updErr } = await admin
      .from("subjects")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updErr) throw updErr;

    const action = data.is_active === false ? "SUBJECT_ARCHIVED" : "SUBJECT_UPDATED";

    await writeAuditEntry({
      schoolId: auth.caller.schoolId,
      actorUserId: auth.caller.userId,
      action,
      entityType: "subjects",
      entityId: id,
      oldData: existing as unknown as Record<string, unknown>,
      newData: updated as unknown as Record<string, unknown>,
    });

    return {
      success: true,
      subject: updated as unknown as Subject,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update subject.",
    };
  }
}

// =====================================================================
// 6. STUDENT ENROLLMENT MANAGEMENT
// =====================================================================

export async function getEnrollmentsList(params?: {
  academic_year_id?: string;
  class_id?: string;
  section_id?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    const page = Math.max(1, params?.page || 1);
    const limit = Math.min(100, Math.max(10, params?.limit || 20));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = admin
      .from("enrollments")
      .select(
        "*, student:students(*, profile:profiles(*)), academic_year:academic_years(*), class:classes(*), section:sections(*)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (params?.academic_year_id && params.academic_year_id !== "all") {
      query = query.eq("academic_year_id", params.academic_year_id);
    }

    if (params?.class_id && params.class_id !== "all") {
      query = query.eq("class_id", params.class_id);
    }

    if (params?.section_id && params.section_id !== "all") {
      query = query.eq("section_id", params.section_id);
    }

    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status as Enrollment["status"]);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    // Filter by student search term in memory if provided
    let results = (data || []) as unknown as (Enrollment & {
      student?: { admission_number?: string | null; profile?: Profile | null } | null;
      academic_year?: AcademicYear | null;
      class?: ClassRoom | null;
      section?: Section | null;
    })[];

    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      results = results.filter((r) => {
        const adm = (r.student?.admission_number || "").toLowerCase();
        const name = (r.student?.profile?.full_name || "").toLowerCase();
        return adm.includes(q) || name.includes(q);
      });
    }

    return {
      success: true,
      enrollments: results,
      totalCount: count || results.length,
      page,
      limit,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load enrollments.",
    };
  }
}

export async function createEnrollment(data: {
  student_id: string;
  academic_year_id: string;
  class_id: string;
  section_id?: string | null;
  roll_number?: string | null;
  status?: Enrollment["status"];
}) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  const schoolId = auth.caller.schoolId;

  try {
    // 1. Verify Student exists & belongs to school
    const { data: student, error: studentErr } = await admin
      .from("students")
      .select("id, school_id, status, profile:profiles(full_name)")
      .eq("id", data.student_id)
      .eq("school_id", schoolId)
      .single();

    if (studentErr || !student) {
      return { success: false, error: "Student not found or does not belong to your school." };
    }

    // 2. Verify Academic Year exists & belongs to school
    const { data: year, error: yearErr } = await admin
      .from("academic_years")
      .select("id, name, school_id")
      .eq("id", data.academic_year_id)
      .eq("school_id", schoolId)
      .single();

    if (yearErr || !year) {
      return { success: false, error: "Academic year not found or does not belong to your school." };
    }

    // 3. Verify Class exists & belongs to school
    const { data: classObj, error: classErr } = await admin
      .from("classes")
      .select("id, name, school_id, is_active")
      .eq("id", data.class_id)
      .eq("school_id", schoolId)
      .single();

    if (classErr || !classObj) {
      return { success: false, error: "Class not found or does not belong to your school." };
    }

    // 4 & 5. Verify Section (CRITICAL: Section MUST belong to selected class)
    let sectionId: string | null = null;
    if (data.section_id) {
      const { data: sectionObj, error: secErr } = await admin
        .from("sections")
        .select("id, name, class_id, school_id")
        .eq("id", data.section_id)
        .eq("school_id", schoolId)
        .single();

      if (secErr || !sectionObj) {
        return { success: false, error: "Selected section does not exist in your school." };
      }

      if (sectionObj.class_id !== data.class_id) {
        return {
          success: false,
          error: `Integrity Violation: Section "${sectionObj.name}" does not belong to Class "${classObj.name}".`,
        };
      }
      sectionId = sectionObj.id;
    }

    // 6. Verify enrollment uniqueness (no duplicate student + academic_year)
    const { data: existingEnr } = await admin
      .from("enrollments")
      .select("id")
      .eq("student_id", data.student_id)
      .eq("academic_year_id", data.academic_year_id)
      .maybeSingle();

    if (existingEnr) {
      return {
        success: false,
        error: `Student is already enrolled in academic year "${year.name}". Duplicate enrollment is forbidden.`,
      };
    }

    // 7. If roll number entered, validate uniqueness within class/section/year
    const rollNumber = data.roll_number?.trim() || null;
    if (rollNumber) {
      let rollQuery = admin
        .from("enrollments")
        .select("id")
        .eq("academic_year_id", data.academic_year_id)
        .eq("class_id", data.class_id)
        .eq("roll_number", rollNumber);

      if (sectionId) {
        rollQuery = rollQuery.eq("section_id", sectionId);
      }

      const { data: rollDupes } = await rollQuery;
      if (rollDupes && rollDupes.length > 0) {
        return {
          success: false,
          error: `Roll number "${rollNumber}" is already assigned to another student in this class/section.`,
        };
      }
    }

    const { data: created, error } = await admin
      .from("enrollments")
      .insert({
        student_id: data.student_id,
        academic_year_id: data.academic_year_id,
        class_id: data.class_id,
        section_id: sectionId,
        roll_number: rollNumber,
        status: data.status || "active",
      })
      .select()
      .single();

    if (error) throw error;

    await writeAuditEntry({
      schoolId,
      actorUserId: auth.caller.userId,
      action: "ENROLLMENT_CREATED",
      entityType: "enrollments",
      entityId: created.id,
      newData: created as unknown as Record<string, unknown>,
    });

    return {
      success: true,
      enrollment: created as unknown as Enrollment,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create enrollment.",
    };
  }
}

export async function updateEnrollment(
  id: string,
  data: {
    class_id?: string;
    section_id?: string | null;
    roll_number?: string | null;
    status?: Enrollment["status"];
  }
) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  const schoolId = auth.caller.schoolId;

  try {
    // 1. Fetch existing enrollment with joined class to verify school
    const { data: existingData, error: fetchErr } = await admin
      .from("enrollments")
      .select("*, class:classes(school_id, name)")
      .eq("id", id)
      .single();

    if (fetchErr || !existingData) {
      return { success: false, error: "Enrollment record not found." };
    }

    const existing = existingData as unknown as Enrollment;
    const existingClass = (existingData as Record<string, unknown>).class as { school_id?: string; name?: string } | null;
    if (existingClass?.school_id && existingClass.school_id !== schoolId) {
      return { success: false, error: "Cross-school enrollment modification denied." };
    }

    const targetClassId = data.class_id || existing.class_id;

    // 2. Validate section belongs to class
    let targetSectionId: string | null = existing.section_id || null;
    if (data.section_id !== undefined) {
      if (data.section_id) {
        const { data: sec, error: secErr } = await admin
          .from("sections")
          .select("id, name, class_id, school_id")
          .eq("id", data.section_id)
          .eq("school_id", schoolId)
          .single();

        if (secErr || !sec) {
          return { success: false, error: "Selected section does not exist." };
        }

        if (sec.class_id !== targetClassId) {
          return {
            success: false,
            error: `Integrity Violation: Section does not belong to the target class.`,
          };
        }
        targetSectionId = sec.id;
      } else {
        targetSectionId = null;
      }
    }

    const updatePayload: EnrollmentUpdate = {};
    if (data.class_id) updatePayload.class_id = data.class_id;
    if (data.section_id !== undefined) updatePayload.section_id = targetSectionId ?? null;
    if (data.roll_number !== undefined) updatePayload.roll_number = data.roll_number?.trim() || null;
    if (data.status) updatePayload.status = data.status;

    const { data: updated, error: updErr } = await admin
      .from("enrollments")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updErr) throw updErr;

    const action = data.status === "withdrawn" ? "ENROLLMENT_ARCHIVED" : "ENROLLMENT_UPDATED";

    await writeAuditEntry({
      schoolId,
      actorUserId: auth.caller.userId,
      action,
      entityType: "enrollments",
      entityId: id,
      oldData: existing as unknown as Record<string, unknown>,
      newData: updated as unknown as Record<string, unknown>,
    });

    return {
      success: true,
      enrollment: updated as unknown as Enrollment,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update enrollment.",
    };
  }
}

// =====================================================================
// 7. STUDENT ACADEMIC HISTORY TIMELINE
// =====================================================================

export async function getStudentAcademicHistory(studentId: string) {
  const auth = await getAuthorizedAcademicCaller();
  if (!auth.success) return { success: false, error: auth.error };

  const admin = createAdminClient();
  if (!admin) return { success: false, error: "Admin client unavailable." };

  try {
    // 1. Fetch student identity
    const { data: student, error: studentErr } = await admin
      .from("students")
      .select("*, profile:profiles(*)")
      .eq("id", studentId)
      .eq("school_id", auth.caller.schoolId)
      .single();

    if (studentErr || !student) {
      return { success: false, error: "Student not found or access denied." };
    }

    // 2. Fetch all historical enrollments
    const { data: enrollments, error: enrErr } = await admin
      .from("enrollments")
      .select("*, academic_year:academic_years(*), class:classes(*), section:sections(*)")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (enrErr) throw enrErr;

    return {
      success: true,
      student: student as unknown as {
        id: string;
        admission_number: string | null;
        status: string;
        profile: Profile | null;
      },
      history: (enrollments || []) as unknown as (Enrollment & {
        academic_year: AcademicYear | null;
        class: ClassRoom | null;
        section: Section | null;
      })[],
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load student history.",
    };
  }
}
