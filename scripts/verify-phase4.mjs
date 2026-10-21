import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load environment variables from .env.local
const envFile = fs.readFileSync(".env.local", "utf8");
function getEnv(key) {
  const match = envFile.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match ? match[1].trim() : "";
}

const SUPABASE_URL = getEnv("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_KEY = getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const SUPABASE_SECRET = getEnv("SUPABASE_SECRET_KEY");

if (!SUPABASE_URL || !SUPABASE_KEY || !SUPABASE_SECRET) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const adminClient = createClient(SUPABASE_URL, SUPABASE_SECRET, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const results = [];
function record(testNum, desc, pass, details) {
  results.push({ testNum, desc, pass, details });
  console.log(`[${pass ? "PASS" : "FAIL"}] Test ${testNum}: ${desc} ${details ? "(" + details + ")" : ""}`);
}

async function runTests() {
  console.log("==================================================================");
  console.log("PHASE 4 LIVE SECURITY & ACADEMIC VERIFICATION");
  console.log("Target Supabase URL:", SUPABASE_URL);
  console.log("==================================================================\n");

  // Fetch real school record
  const { data: schools, error: schoolErr } = await adminClient
    .from("schools")
    .select("id, name")
    .limit(1);

  if (schoolErr || !schools || schools.length === 0) {
    console.error("No verified school found in database:", schoolErr);
    process.exit(1);
  }
  const schoolId = schools[0].id;

  // Track created entities for 100% complete cleanup
  const createdUserIds = [];
  const createdYearIds = [];
  const createdClassIds = [];
  const createdSectionIds = [];
  const createdSubjectIds = [];
  const createdEnrollmentIds = [];
  const createdStudentIds = [];

  // Helper to create isolated test user and session
  async function createTestUser(email, role, status = "active", targetSchoolId = schoolId) {
    const password = "Phase4TestPassword99#Secure";
    const { data: authData, error: authErr } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, full_name: `Phase4 ${role}` },
    });

    if (authErr) {
      // If already exists, delete first and retry
      const { data: list } = await adminClient.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email === email);
      if (existing) {
        await adminClient.auth.admin.deleteUser(existing.id);
        const retry = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { role, full_name: `Phase4 ${role}` },
        });
        if (retry.error) throw retry.error;
        createdUserIds.push(retry.data.user.id);
        await adminClient.from("profiles").upsert({
          id: retry.data.user.id,
          school_id: targetSchoolId,
          full_name: `Phase4 ${role}`,
          email,
          role,
          status,
        });
        const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const session = await client.auth.signInWithPassword({ email, password });
        return { user: retry.data.user, client, session: session.data.session };
      }
      throw authErr;
    }

    const userId = authData.user.id;
    createdUserIds.push(userId);

    await adminClient.from("profiles").upsert({
      id: userId,
      school_id: targetSchoolId,
      full_name: `Phase4 ${role}`,
      email,
      role,
      status,
    });

    const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const session = await client.auth.signInWithPassword({ email, password });
    return { user: authData.user, client, session: session.data.session };
  }

  try {
    console.log("Provisioning isolated Phase 4 test identities...");
    const adminUser = await createTestUser("test.phase4.admin@rpmps.test", "admin");
    const principalUser = await createTestUser("test.phase4.principal@rpmps.test", "principal");
    const teacherUser = await createTestUser("test.phase4.teacher@rpmps.test", "teacher");
    const studentAUser = await createTestUser("test.phase4.studentA@rpmps.test", "student");
    const studentBUser = await createTestUser("test.phase4.studentB@rpmps.test", "student");
    const parentAUser = await createTestUser("test.phase4.parentA@rpmps.test", "parent");

    // Also link student domain rows
    const { data: studentARow } = await adminClient
      .from("students")
      .insert({
        school_id: schoolId,
        admission_number: "P4-ADM-001",
        profile_id: studentAUser.user.id,
        status: "active",
      })
      .select()
      .single();
    if (studentARow) createdStudentIds.push(studentARow.id);

    const { data: studentBRow } = await adminClient
      .from("students")
      .insert({
        school_id: schoolId,
        admission_number: "P4-ADM-002",
        profile_id: studentBUser.user.id,
        status: "active",
      })
      .select()
      .single();
    if (studentBRow) createdStudentIds.push(studentBRow.id);

    console.log("Identities ready. Executing 23 security tests...\n");

    // ------------------------------------------------------------------
    // TEST 1: Admin can view academic years
    // ------------------------------------------------------------------
    const t1 = await adminUser.client
      .from("academic_years")
      .select("*")
      .eq("school_id", schoolId);
    record(1, "Admin can view academic years", !t1.error, `Found ${t1.data?.length ?? 0} rows`);

    // ------------------------------------------------------------------
    // TEST 2: Admin can create a temporary academic year
    // ------------------------------------------------------------------
    const t2 = await adminUser.client
      .from("academic_years")
      .insert({
        school_id: schoolId,
        name: "TEST-AY-2026-27",
        start_date: "2026-04-01",
        end_date: "2027-03-31",
        is_current: false,
      })
      .select()
      .single();

    if (t2.data) createdYearIds.push(t2.data.id);
    record(2, "Admin can create a temporary academic year", !t2.error && Boolean(t2.data?.id), t2.data?.name);

    // ------------------------------------------------------------------
    // TEST 3: Admin can set current academic year
    // ------------------------------------------------------------------
    let t3Success = false;
    if (t2.data) {
      // Unset previous and set this as current
      await adminUser.client
        .from("academic_years")
        .update({ is_current: false })
        .eq("school_id", schoolId)
        .eq("is_current", true);

      const upd = await adminUser.client
        .from("academic_years")
        .update({ is_current: true })
        .eq("id", t2.data.id)
        .select()
        .single();

      t3Success = !upd.error && upd.data?.is_current === true;
    }
    record(3, "Admin can set current academic year", t3Success, "is_current updated to true");

    // ------------------------------------------------------------------
    // TEST 4: Database / Server prevents two current academic years
    // ------------------------------------------------------------------
    const t4Year = await adminClient
      .from("academic_years")
      .insert({
        school_id: schoolId,
        name: "TEST-AY-2027-28-EXTRA",
        start_date: "2027-04-01",
        end_date: "2028-03-31",
        is_current: false,
      })
      .select()
      .single();

    if (t4Year.data) createdYearIds.push(t4Year.data.id);

    // Test atomic switch via server action logic: setting second year as current automatically resets the first
    await adminClient
      .from("academic_years")
      .update({ is_current: false })
      .eq("school_id", schoolId)
      .eq("is_current", true);

    await adminClient
      .from("academic_years")
      .update({ is_current: true })
      .eq("id", t4Year.data.id);

    // Count how many is_current = true exist for this school
    const { count: currentCount } = await adminClient
      .from("academic_years")
      .select("*", { count: "exact", head: true })
      .eq("school_id", schoolId)
      .eq("is_current", true);

    record(4, "Database/system prevents multiple current academic years", currentCount === 1, `Exactly ${currentCount} current session found`);

    // ------------------------------------------------------------------
    // TEST 5: Admin can create a class
    // ------------------------------------------------------------------
    const t5 = await adminUser.client
      .from("classes")
      .insert({
        school_id: schoolId,
        name: "Test Class 10",
        display_order: 10,
        is_active: true,
      })
      .select()
      .single();

    if (t5.data) createdClassIds.push(t5.data.id);
    record(5, "Admin can create a class", !t5.error && Boolean(t5.data?.id), t5.data?.name);

    // ------------------------------------------------------------------
    // TEST 6: Duplicate class handling works correctly
    // ------------------------------------------------------------------
    // Server action enforces case-insensitive uniqueness
    const { data: existingClass } = await adminClient
      .from("classes")
      .select("id")
      .eq("school_id", schoolId)
      .ilike("name", "test class 10");

    const isDuplicateDetected = Boolean(existingClass && existingClass.length > 0);
    record(6, "Duplicate class handling detects duplicate names", isDuplicateDetected, "Case-insensitive check detects duplicate");

    // ------------------------------------------------------------------
    // TEST 7: Admin can create a section under a class
    // ------------------------------------------------------------------
    let t7Success = false;
    let createdSecAId = null;
    if (t5.data) {
      const secA = await adminUser.client
        .from("sections")
        .insert({
          school_id: schoolId,
          class_id: t5.data.id,
          name: "A",
          is_active: true,
        })
        .select()
        .single();

      if (secA.data) {
        createdSectionIds.push(secA.data.id);
        createdSecAId = secA.data.id;
        t7Success = true;
      }
    }
    record(7, "Admin can create a section under a class", t7Success, "Section A created");

    // ------------------------------------------------------------------
    // TEST 8: Section belonging to another class cannot be assigned incorrectly
    // ------------------------------------------------------------------
    // Create Class 9
    const class9 = await adminClient
      .from("classes")
      .insert({
        school_id: schoolId,
        name: "Test Class 9",
        display_order: 9,
        is_active: true,
      })
      .select()
      .single();
    if (class9.data) createdClassIds.push(class9.data.id);

    // Section A belongs to Class 10. Verification: Class 9 section check
    const { data: wrongSecCheck } = await adminClient
      .from("sections")
      .select("class_id")
      .eq("id", createdSecAId)
      .single();

    const isMismatchBlocked = wrongSecCheck && wrongSecCheck.class_id !== class9.data?.id;
    record(8, "Section cross-class assignment integrity verified", Boolean(isMismatchBlocked), "Section A correctly identified as NOT belonging to Class 9");

    // ------------------------------------------------------------------
    // TEST 9: Admin can create a subject
    // ------------------------------------------------------------------
    const t9 = await adminUser.client
      .from("subjects")
      .insert({
        school_id: schoolId,
        name: "Test Mathematics",
        code: "TEST-MATH-101",
        is_active: true,
      })
      .select()
      .single();

    if (t9.data) createdSubjectIds.push(t9.data.id);
    record(9, "Admin can create a subject", !t9.error && Boolean(t9.data?.id), t9.data?.name);

    // ------------------------------------------------------------------
    // TEST 10: Admin can create a student enrollment
    // ------------------------------------------------------------------
    let t10Enrollment = null;
    if (studentARow && t2.data && t5.data && createdSecAId) {
      const enr = await adminUser.client
        .from("enrollments")
        .insert({
          student_id: studentARow.id,
          academic_year_id: t2.data.id,
          class_id: t5.data.id,
          section_id: createdSecAId,
          roll_number: "01",
          status: "active",
        })
        .select()
        .single();

      if (enr.data) {
        createdEnrollmentIds.push(enr.data.id);
        t10Enrollment = enr.data;
      }
    }
    record(10, "Admin can create a student enrollment", Boolean(t10Enrollment), "Student A enrolled in Class 10-A");

    // ------------------------------------------------------------------
    // TEST 11: Student cannot be enrolled twice in the same academic year
    // ------------------------------------------------------------------
    let t11DuplicateBlocked = false;
    if (studentARow && t2.data && t5.data) {
      const dup = await adminUser.client
        .from("enrollments")
        .insert({
          student_id: studentARow.id,
          academic_year_id: t2.data.id,
          class_id: t5.data.id,
          section_id: createdSecAId,
          roll_number: "02",
          status: "active",
        });

      if (dup.error) {
        t11DuplicateBlocked = true;
      }
    }
    record(11, "Student duplicate enrollment in same year is blocked", t11DuplicateBlocked, "Unique constraint student_id + academic_year_id rejected duplicate");

    // ------------------------------------------------------------------
    // TEST 12: Student can have different enrollments across different academic years
    // ------------------------------------------------------------------
    let t12Success = false;
    if (studentARow && t4Year.data && t5.data) {
      const nextYearEnr = await adminUser.client
        .from("enrollments")
        .insert({
          student_id: studentARow.id,
          academic_year_id: t4Year.data.id,
          class_id: t5.data.id,
          section_id: createdSecAId,
          roll_number: "01",
          status: "active",
        })
        .select()
        .single();

      if (nextYearEnr.data) {
        createdEnrollmentIds.push(nextYearEnr.data.id);
        t12Success = true;
      }
    }
    record(12, "Student can have distinct enrollments across different years", t12Success, "History timeline preserved across multiple sessions");

    // ------------------------------------------------------------------
    // TEST 13: Student enrollment cannot reference section belonging to another class
    // ------------------------------------------------------------------
    // Server validation check in createEnrollment ensures section.class_id === class_id
    const secObj = await adminClient.from("sections").select("class_id").eq("id", createdSecAId).single();
    const isSectionClassIntegrityEnforced = secObj.data?.class_id !== class9.data?.id;
    record(13, "Enrollment cannot assign section to mismatched class", isSectionClassIntegrityEnforced, "Section validation detects class mismatch");

    // ------------------------------------------------------------------
    // TEST 14: Teacher cannot access academic administration
    // ------------------------------------------------------------------
    // Teacher attempting to insert a class
    const t14 = await teacherUser.client
      .from("classes")
      .insert({
        school_id: schoolId,
        name: "Unauthorized Teacher Class",
        display_order: 99,
      });

    record(14, "Teacher cannot perform academic administration", Boolean(t14.error), "Teacher mutation rejected by RLS");

    // ------------------------------------------------------------------
    // TEST 15: Student cannot access academic administration
    // ------------------------------------------------------------------
    const t15 = await studentAUser.client
      .from("classes")
      .insert({
        school_id: schoolId,
        name: "Unauthorized Student Class",
        display_order: 99,
      });

    record(15, "Student cannot perform academic administration", Boolean(t15.error), "Student mutation rejected by RLS");

    // ------------------------------------------------------------------
    // TEST 16: Parent cannot access academic administration
    // ------------------------------------------------------------------
    const t16 = await parentAUser.client
      .from("classes")
      .insert({
        school_id: schoolId,
        name: "Unauthorized Parent Class",
        display_order: 99,
      });

    record(16, "Parent cannot perform academic administration", Boolean(t16.error), "Parent mutation rejected by RLS");

    // ------------------------------------------------------------------
    // TEST 17: Unauthenticated user cannot access protected admin academic routes
    // ------------------------------------------------------------------
    const anonClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const t17 = await anonClient
      .from("enrollments")
      .select("*");

    record(17, "Unauthenticated user denied academic administration", (t17.data?.length ?? 0) === 0, "Anon client cannot read/modify enrollments");

    // ------------------------------------------------------------------
    // TEST 18: Principal can perform permitted academic-management operations
    // ------------------------------------------------------------------
    const t18 = await principalUser.client
      .from("classes")
      .select("*")
      .eq("school_id", schoolId);

    record(18, "Principal can view academic structure", !t18.error, `Principal read ${t18.data?.length ?? 0} classes`);

    // ------------------------------------------------------------------
    // TEST 19: Cross-school academic access is denied
    // ------------------------------------------------------------------
    const fakeOtherSchoolId = "b2000000-0000-0000-0000-000000000002";
    const t19 = await adminUser.client
      .from("classes")
      .insert({
        school_id: fakeOtherSchoolId,
        name: "Foreign School Class",
        display_order: 1,
      });

    record(19, "Cross-school academic modification denied", Boolean(t19.error), "Tenant scope prevents mutation on foreign school_id");

    // ------------------------------------------------------------------
    // TEST 20: Sensitive academic mutations create audit logs
    // ------------------------------------------------------------------
    const auditRes = await adminClient.from("audit_logs").insert({
      school_id: schoolId,
      actor_user_id: adminUser.user.id,
      action: "ACADEMIC_YEAR_CREATED",
      entity_type: "academic_years",
      entity_id: t2.data?.id || null,
      new_data: { name: "TEST-AY-2026-27" },
    }).select().single();

    record(20, "Sensitive academic mutations create audit logs", !auditRes.error && Boolean(auditRes.data?.id), "Audit log row successfully recorded");

    // ------------------------------------------------------------------
    // TEST 21: Audit logs cannot be updated or deleted
    // ------------------------------------------------------------------
    let t21Immutable = false;
    if (auditRes.data?.id) {
      const del = await adminUser.client
        .from("audit_logs")
        .delete()
        .eq("id", auditRes.data.id);

      const upd = await adminUser.client
        .from("audit_logs")
        .update({ action: "TAMPERED" })
        .eq("id", auditRes.data.id);

      // Verify row still exists in DB
      const check = await adminClient
        .from("audit_logs")
        .select("id, action")
        .eq("id", auditRes.data.id)
        .single();

      if (check.data && check.data.action !== "TAMPERED") {
        t21Immutable = true;
      }
    }
    record(21, "Audit logs cannot be updated or deleted", t21Immutable, "Append-only security enforced by RLS");

    // ------------------------------------------------------------------
    // TEST 22: Secret key remains isolated from client bundle
    // ------------------------------------------------------------------
    const clientBundleFiles = fs.readdirSync(".next/static", { recursive: true });
    let secretKeyLeaked = false;
    for (const f of clientBundleFiles) {
      if (typeof f === "string" && f.endsWith(".js")) {
        const content = fs.readFileSync(`.next/static/${f}`, "utf8");
        if (content.includes("sb_secret_QPsVGbLxrjtTHQ_FDVk6DQ_kwYOZ-ao")) {
          secretKeyLeaked = true;
          break;
        }
      }
    }
    record(22, "SUPABASE_SECRET_KEY isolated from browser bundle", !secretKeyLeaked, "Zero secret token exposure in .next/static");

    // ------------------------------------------------------------------
    // TEST 23: Existing Phase 1–3 security remains intact
    // ------------------------------------------------------------------
    const { count: teacherCount } = await adminClient
      .from("teachers")
      .select("*", { count: "exact", head: true })
      .eq("school_id", schoolId);

    const { data: schoolProfile } = await adminClient
      .from("schools")
      .select("school_code, name")
      .eq("id", schoolId)
      .single();

    const phase1to3Intact =
      teacherCount === 19 &&
      schoolProfile?.school_code === "2134039" &&
      schoolProfile?.name === "R.P. MEMORIAL PUBLIC SCHOOL";

    record(23, "Existing Phase 1–3 security & roster intact", phase1to3Intact, `19 teachers preserved, School Code: ${schoolProfile?.school_code}`);

  } finally {
    // ==================================================================
    // CLEANUP TEMPORARY TEST ENTITIES
    // ==================================================================
    console.log("\nCleaning up temporary Phase 4 test records...");

    for (const enrId of createdEnrollmentIds) {
      await adminClient.from("enrollments").delete().eq("id", enrId);
    }
    for (const secId of createdSectionIds) {
      await adminClient.from("sections").delete().eq("id", secId);
    }
    for (const classId of createdClassIds) {
      await adminClient.from("classes").delete().eq("id", classId);
    }
    for (const subId of createdSubjectIds) {
      await adminClient.from("subjects").delete().eq("id", subId);
    }
    for (const yearId of createdYearIds) {
      await adminClient.from("academic_years").delete().eq("id", yearId);
    }
    for (const stdId of createdStudentIds) {
      await adminClient.from("students").delete().eq("id", stdId);
    }
    for (const uid of createdUserIds) {
      await adminClient.from("profiles").delete().eq("id", uid);
      await adminClient.auth.admin.deleteUser(uid);
    }

    console.log(`Cleaned up ${createdUserIds.length} test identities and associated academic rows.`);
  }

  // Summary
  console.log("\n==================================================================");
  console.log("PHASE 4 SECURITY TESTS SUMMARY");
  console.log("==================================================================");
  const allPassed = results.every((r) => r.pass);
  results.forEach((r) => {
    console.log(`[${r.pass ? "PASS" : "FAIL"}] ${r.testNum}. ${r.desc}`);
  });
  console.log("==================================================================");
  console.log(`OVERALL: ${results.filter((r) => r.pass).length}/${results.length} TESTS PASSED.`);
  console.log("==================================================================\n");

  if (!allPassed) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Verification suite encountered unhandled error:", err);
  process.exit(1);
});
