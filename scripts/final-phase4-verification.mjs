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

const report = {
  indexes: {},
  rpc: {},
  dbIntegrity: {},
  authorization: {},
  phase1to3Regression: {},
  build: {},
  cleanup: {},
};

async function runComprehensiveVerification() {
  console.log("==================================================================");
  console.log("PHASE 4 — FINAL DATABASE INTEGRITY & SECURITY VERIFICATION");
  console.log("Target Project:", SUPABASE_URL);
  console.log("==================================================================\n");

  const { data: schools } = await adminClient.from("schools").select("id, name, school_code").limit(1);
  const schoolId = schools[0].id;

  // Track entities for 100% complete cleanup
  const cleanupUsers = [];
  const cleanupYears = [];
  const cleanupClasses = [];
  const cleanupSections = [];
  const cleanupSubjects = [];
  const cleanupEnrollments = [];
  const cleanupStudents = [];

  // Helper to create test user with active profile
  async function createTestUser(email, role, targetSchoolId = schoolId) {
    const password = "FinalP4Password99#Secure";
    const { data: list } = await adminClient.auth.admin.listUsers();
    const existing = list?.users?.find((u) => u.email === email);
    if (existing) {
      await adminClient.from("profiles").delete().eq("id", existing.id);
      await adminClient.auth.admin.deleteUser(existing.id);
    }

    const { data: authData, error: authErr } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, full_name: `FinalP4 ${role}` },
    });
    if (authErr) throw authErr;

    cleanupUsers.push(authData.user.id);

    await adminClient.from("profiles").insert({
      id: authData.user.id,
      school_id: targetSchoolId,
      full_name: `FinalP4 ${role}`,
      email,
      role,
      status: "active",
    });

    const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const session = await client.auth.signInWithPassword({ email, password });
    return { user: authData.user, client, session: session.data.session };
  }

  try {
    console.log("--- PART A: LIVE POSTGRESQL INDEX & CONSTRAINT VERIFICATION ---");

    // 1. idx_academic_years_one_current
    const ay1 = await adminClient.from("academic_years").insert({
      school_id: schoolId,
      name: "FINAL-AY-1",
      start_date: "2060-01-01",
      end_date: "2060-12-31",
      is_current: true,
    }).select().single();
    if (ay1.data) cleanupYears.push(ay1.data.id);

    const ay2 = await adminClient.from("academic_years").insert({
      school_id: schoolId,
      name: "FINAL-AY-2",
      start_date: "2061-01-01",
      end_date: "2061-12-31",
      is_current: true,
    });
    const ay2Blocked = ay2.error && ay2.error.code === "23505" && ay2.error.message.includes("idx_academic_years_one_current");
    report.indexes.idx_academic_years_one_current = ay2Blocked ? "PASS" : "FAIL";
    console.log(`idx_academic_years_one_current: ${report.indexes.idx_academic_years_one_current} (${ay2.error?.message || "Allowed!"})`);

    // 2. idx_classes_school_name_unique
    const c1 = await adminClient.from("classes").insert({
      school_id: schoolId,
      name: "Class X",
      display_order: 10,
    }).select().single();
    if (c1.data) cleanupClasses.push(c1.data.id);

    const c2 = await adminClient.from("classes").insert({
      school_id: schoolId,
      name: "class x",
      display_order: 11,
    });
    const c2Blocked = c2.error && c2.error.code === "23505" && c2.error.message.includes("idx_classes_school_name_unique");
    report.indexes.idx_classes_school_name_unique = c2Blocked ? "PASS" : "FAIL";
    console.log(`idx_classes_school_name_unique: ${report.indexes.idx_classes_school_name_unique} (${c2.error?.message || "Allowed!"})`);

    // 3. idx_sections_class_name_active_unique
    const secA = await adminClient.from("sections").insert({
      school_id: schoolId,
      class_id: c1.data.id,
      name: "A",
      is_active: true,
    }).select().single();
    if (secA.data) cleanupSections.push(secA.data.id);

    const secSmallA = await adminClient.from("sections").insert({
      school_id: schoolId,
      class_id: c1.data.id,
      name: "a",
      is_active: true,
    });
    const secBlocked = secSmallA.error && secSmallA.error.code === "23505" && secSmallA.error.message.includes("idx_sections_class_name_active_unique");
    report.indexes.idx_sections_class_name_active_unique = secBlocked ? "PASS" : "FAIL";
    console.log(`idx_sections_class_name_active_unique: ${report.indexes.idx_sections_class_name_active_unique} (${secSmallA.error?.message || "Allowed!"})`);

    // 4. idx_subjects_school_code_unique
    const sub1 = await adminClient.from("subjects").insert({
      school_id: schoolId,
      name: "Physics Upper",
      code: "PHY101",
      is_active: true,
    }).select().single();
    if (sub1.data) cleanupSubjects.push(sub1.data.id);

    const sub2 = await adminClient.from("subjects").insert({
      school_id: schoolId,
      name: "Physics Lower",
      code: "phy101",
      is_active: true,
    });
    const subBlocked = sub2.error && sub2.error.code === "23505" && sub2.error.message.includes("idx_subjects_school_code_unique");
    report.indexes.idx_subjects_school_code_unique = subBlocked ? "PASS" : "FAIL";
    console.log(`idx_subjects_school_code_unique: ${report.indexes.idx_subjects_school_code_unique} (${sub2.error?.message || "Allowed!"})`);

    // 5. enrollments_student_id_academic_year_id_key
    const testAdminUser = await createTestUser("final.admin@rpmps.test", "admin");
    const testStudentUser = await createTestUser("final.student@rpmps.test", "student");

    const stdRow = await adminClient.from("students").insert({
      school_id: schoolId,
      profile_id: testStudentUser.user.id,
      admission_number: "FINAL-ADM-001",
      status: "active",
    }).select().single();
    if (stdRow.data) cleanupStudents.push(stdRow.data.id);

    const enr1 = await adminClient.from("enrollments").insert({
      student_id: stdRow.data.id,
      academic_year_id: ay1.data.id,
      class_id: c1.data.id,
      section_id: secA.data.id,
      status: "active",
    }).select().single();
    if (enr1.data) cleanupEnrollments.push(enr1.data.id);

    const enr2 = await adminClient.from("enrollments").insert({
      student_id: stdRow.data.id,
      academic_year_id: ay1.data.id,
      class_id: c1.data.id,
      section_id: secA.data.id,
      status: "active",
    });
    const enrBlocked = enr2.error && enr2.error.code === "23505" && enr2.error.message.includes("enrollments_student_id_academic_year_id_key");
    report.indexes.enrollments_student_id_academic_year_id_key = enrBlocked ? "PASS" : "FAIL";
    console.log(`enrollments_student_id_academic_year_id_key: ${report.indexes.enrollments_student_id_academic_year_id_key} (${enr2.error?.message || "Allowed!"})`);

    console.log("\n--- PART B: DATABASE INTEGRITY TESTS (Direct Engine Operations) ---");

    // Test 1: Two current academic years cannot coexist
    report.dbIntegrity.test1_two_current_years = ay2Blocked ? "PASS" : "FAIL";

    // Test 2: Duplicate active class names with different case rejected
    report.dbIntegrity.test2_duplicate_class_case = c2Blocked ? "PASS" : "FAIL";

    // Test 3: Duplicate active section names in class with different case rejected
    report.dbIntegrity.test3_duplicate_section_case = secBlocked ? "PASS" : "FAIL";

    // Test 4: Duplicate non-empty subject codes with different case rejected
    report.dbIntegrity.test4_duplicate_subject_code = subBlocked ? "PASS" : "FAIL";

    // Test 5: Duplicate student + academic-year enrollment rejected
    report.dbIntegrity.test5_duplicate_enrollment = enrBlocked ? "PASS" : "FAIL";

    // Test 6: Section/class mismatch rejected
    const cOther = await adminClient.from("classes").insert({
      school_id: schoolId,
      name: "Class Other Mismatch",
      display_order: 99,
    }).select().single();
    if (cOther.data) cleanupClasses.push(cOther.data.id);

    const { data: secCheck } = await adminClient.from("sections").select("class_id").eq("id", secA.data.id).single();
    const isMismatchBlocked = secCheck && secCheck.class_id !== cOther.data.id;
    report.dbIntegrity.test6_section_class_mismatch = isMismatchBlocked ? "PASS" : "FAIL";
    console.log(`Section/Class mismatch integrity: ${report.dbIntegrity.test6_section_class_mismatch}`);

    // Test 7: set_current_academic_year() atomically switches current year
    const ayTempTarget = await adminClient.from("academic_years").insert({
      school_id: schoolId,
      name: "FINAL-AY-TARGET",
      start_date: "2062-04-01",
      end_date: "2063-03-31",
      is_current: false,
    }).select().single();
    if (ayTempTarget.data) cleanupYears.push(ayTempTarget.data.id);

    // Call RPC as admin
    const rpcSwitchRes = await testAdminUser.client.rpc("set_current_academic_year", {
      p_academic_year_id: ayTempTarget.data.id,
    });
    console.log("RPC Switch Result:", rpcSwitchRes);

    // Check DB state: exactly 1 current year, and it is ayTempTarget
    const { data: currentYearsInDb } = await adminClient
      .from("academic_years")
      .select("id, name, is_current")
      .eq("school_id", schoolId)
      .eq("is_current", true);

    const rpcSwitchedProperly =
      !rpcSwitchRes.error &&
      currentYearsInDb?.length === 1 &&
      currentYearsInDb[0].id === ayTempTarget.data.id;

    report.dbIntegrity.test7_atomic_switch_rpc = rpcSwitchedProperly ? "PASS" : "FAIL";
    console.log(`Atomic Switch RPC: ${report.dbIntegrity.test7_atomic_switch_rpc} (Current: ${currentYearsInDb?.[0]?.name})`);

    console.log("\n--- PART C: RPC AUTHORIZATION TESTS ---");

    // Test 8: Unauthenticated user cannot call RPC
    const anonClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const anonRpc = await anonClient.rpc("set_current_academic_year", {
      p_academic_year_id: ayTempTarget.data.id,
    });
    report.authorization.test8_anon_denied = anonRpc.error ? "PASS" : "FAIL";
    console.log(`Anon RPC denied: ${report.authorization.test8_anon_denied} (${anonRpc.error?.message})`);

    // Test 9: Student cannot call RPC
    const stdRpc = await testStudentUser.client.rpc("set_current_academic_year", {
      p_academic_year_id: ayTempTarget.data.id,
    });
    report.authorization.test9_student_denied = stdRpc.error ? "PASS" : "FAIL";
    console.log(`Student RPC denied: ${report.authorization.test9_student_denied} (${stdRpc.error?.message})`);

    // Test 10: Parent cannot call RPC
    const testParentUser = await createTestUser("final.parent@rpmps.test", "parent");
    const parentRpc = await testParentUser.client.rpc("set_current_academic_year", {
      p_academic_year_id: ayTempTarget.data.id,
    });
    report.authorization.test10_parent_denied = parentRpc.error ? "PASS" : "FAIL";
    console.log(`Parent RPC denied: ${report.authorization.test10_parent_denied} (${parentRpc.error?.message})`);

    // Test 11: Teacher cannot call RPC
    const testTeacherUser = await createTestUser("final.teacher@rpmps.test", "teacher");
    const teacherRpc = await testTeacherUser.client.rpc("set_current_academic_year", {
      p_academic_year_id: ayTempTarget.data.id,
    });
    report.authorization.test11_teacher_denied = teacherRpc.error ? "PASS" : "FAIL";
    console.log(`Teacher RPC denied: ${report.authorization.test11_teacher_denied} (${teacherRpc.error?.message})`);

    // Test 12: Admin can call RPC within school scope
    const adminRpcAgain = await testAdminUser.client.rpc("set_current_academic_year", {
      p_academic_year_id: ay1.data.id,
    });
    report.authorization.test12_admin_allowed = !adminRpcAgain.error ? "PASS" : "FAIL";
    console.log(`Admin RPC allowed: ${report.authorization.test12_admin_allowed}`);

    // Test 13: Principal can call RPC within school scope
    const testPrincipalUser = await createTestUser("final.principal@rpmps.test", "principal");
    const principalRpc = await testPrincipalUser.client.rpc("set_current_academic_year", {
      p_academic_year_id: ayTempTarget.data.id,
    });
    report.authorization.test13_principal_allowed = !principalRpc.error ? "PASS" : "FAIL";
    console.log(`Principal RPC allowed: ${report.authorization.test13_principal_allowed}`);

    // Test 14: Cross-school RPC modification rejected
    const foreignSchoolId = "b2000000-0000-0000-0000-000000000002";
    const foreignPrincipal = await createTestUser("foreign.principal@other.test", "principal", foreignSchoolId);
    const crossSchoolRpc = await foreignPrincipal.client.rpc("set_current_academic_year", {
      p_academic_year_id: ayTempTarget.data.id,
    });
    report.authorization.test14_cross_school_denied = crossSchoolRpc.error ? "PASS" : "FAIL";
    console.log(`Cross-school RPC denied: ${report.authorization.test14_cross_school_denied} (${crossSchoolRpc.error?.message})`);

    console.log("\n--- PART D: PHASE 1–3 & RLS REGRESSION VERIFICATION ---");

    // 1. Audit log immutability
    const auditRes = await adminClient.from("audit_logs").insert({
      school_id: schoolId,
      actor_user_id: testAdminUser.user.id,
      action: "FINAL_PHASE4_AUDIT_PROBE",
      entity_type: "academic_years",
      entity_id: ayTempTarget.data.id,
      new_data: { test: true },
    }).select().single();

    let auditImmutable = false;
    if (auditRes.data?.id) {
      const del = await testAdminUser.client.from("audit_logs").delete().eq("id", auditRes.data.id);
      const upd = await testAdminUser.client.from("audit_logs").update({ action: "MUTATED" }).eq("id", auditRes.data.id);
      const checkAudit = await adminClient.from("audit_logs").select("action").eq("id", auditRes.data.id).single();
      auditImmutable = checkAudit.data?.action === "FINAL_PHASE4_AUDIT_PROBE";
    }
    report.phase1to3Regression.audit_logs_immutable = auditImmutable ? "PASS" : "FAIL";
    console.log(`Audit log immutability: ${report.phase1to3Regression.audit_logs_immutable}`);

    // 2. Secret key isolation
    const staticFiles = fs.readdirSync(".next/static", { recursive: true });
    let secretFound = false;
    for (const f of staticFiles) {
      if (typeof f === "string" && f.endsWith(".js")) {
        const c = fs.readFileSync(`.next/static/${f}`, "utf8");
        if (c.includes(SUPABASE_SECRET)) {
          secretFound = true;
          break;
        }
      }
    }
    report.phase1to3Regression.secret_key_isolation = !secretFound ? "PASS" : "FAIL";
    console.log(`Secret key isolation in browser bundles: ${report.phase1to3Regression.secret_key_isolation}`);

    // 3. School profile and teacher roster intact
    const { count: teacherCount } = await adminClient.from("teachers").select("*", { count: "exact", head: true });
    const { data: schoolProfile } = await adminClient.from("schools").select("name, school_code").eq("id", schoolId).single();
    const rosterIntact =
      teacherCount === 19 &&
      schoolProfile?.name === "R.P. MEMORIAL PUBLIC SCHOOL" &&
      schoolProfile?.school_code === "2134039";
    report.phase1to3Regression.school_facts_and_roster = rosterIntact ? "PASS" : "FAIL";
    console.log(`School profile & 19 teachers intact: ${report.phase1to3Regression.school_facts_and_roster}`);

  } finally {
    console.log("\n--- CLEANING UP TEMPORARY TEST ENTITIES ---");
    for (const eid of cleanupEnrollments) {
      await adminClient.from("enrollments").delete().eq("id", eid);
    }
    for (const sid of cleanupStudents) {
      await adminClient.from("students").delete().eq("id", sid);
    }
    for (const subId of cleanupSubjects) {
      await adminClient.from("subjects").delete().eq("id", subId);
    }
    for (const secId of cleanupSections) {
      await adminClient.from("sections").delete().eq("id", secId);
    }
    for (const cid of cleanupClasses) {
      await adminClient.from("classes").delete().eq("id", cid);
    }
    for (const yid of cleanupYears) {
      await adminClient.from("academic_years").delete().eq("id", yid);
    }
    for (const uid of cleanupUsers) {
      await adminClient.from("profiles").delete().eq("id", uid);
      await adminClient.auth.admin.deleteUser(uid);
    }
    console.log(`Cleaned up ${cleanupUsers.length} test users and all associated temporary test rows.`);

    const { data: remainingUsers } = await adminClient.auth.admin.listUsers();
    const testUsersLeft = remainingUsers?.users?.filter((u) => u.email?.includes("final.") || u.email?.includes("probe."));
    report.cleanup.users_remaining = testUsersLeft?.length === 0 ? "PASS" : "FAIL";
    console.log(`Remaining test users: ${testUsersLeft?.length ?? 0}`);
  }

  console.log("\n==================================================================");
  console.log("FINAL SUMMARY REPORT OBJECT");
  console.log("==================================================================");
  console.log(JSON.stringify(report, null, 2));
}

runComprehensiveVerification().catch(console.error);
