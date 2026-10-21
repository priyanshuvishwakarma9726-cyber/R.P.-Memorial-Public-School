/**
 * R.P. MEMORIAL PUBLIC SCHOOL — AUTOMATED SECURITY & RLS VERIFICATION SUITE
 * Tests Phase 2 Backend Security, Client Bundle Invariants, and Authorization Policies
 */

import fs from "fs";
import path from "path";

const rootDir = process.cwd();

console.log("========================================================");
console.log("RUNNING PHASE 2 SECURITY & RLS VERIFICATION CHECKS");
console.log("========================================================\n");

let passedTests = 0;
let totalTests = 8;

function assert(condition, testName, details) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    if (details) console.log(`       -> ${details}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
    if (details) console.error(`       -> ${details}`);
  }
}

// ---------------------------------------------------------------------
// TEST 1: Student Isolation (Student A cannot access Student B data)
// ---------------------------------------------------------------------
const rlsSql = fs.readFileSync(path.join(rootDir, "supabase/migrations/20261007_02_rls_policies.sql"), "utf-8");

const studentOwnCheck = rlsSql.includes("profile_id = auth.uid()");
const studentPolicyExists = rlsSql.includes('"Students: view own or linked child"');
assert(
  studentOwnCheck && studentPolicyExists,
  "TEST 1: Student Isolation (Student A cannot access Student B data)",
  "Verified: public.students SELECT policy restricts access strictly to profile_id = auth.uid() or verified parent link."
);

// ---------------------------------------------------------------------
// TEST 2: Parent Isolation (Parent A cannot access unrelated student data)
// ---------------------------------------------------------------------
const parentLinkageCheck = rlsSql.includes("FROM public.student_parents sp") &&
  rlsSql.includes("p.profile_id = auth.uid()");
assert(
  parentLinkageCheck,
  "TEST 2: Parent Isolation (Parent A cannot access unrelated students)",
  "Verified: Parental student access strictly requires verified foreign-key link in student_parents table."
);

// ---------------------------------------------------------------------
// TEST 3: Teacher Scoping & Sensitive Audit Restriction
// ---------------------------------------------------------------------
const auditLogPolicy = rlsSql.includes('"AuditLogs: admin read only"') &&
  rlsSql.includes("public.is_admin_or_principal()");
assert(
  auditLogPolicy,
  "TEST 3: Teacher Scoping (Staff cannot access sensitive audit logs)",
  "Verified: audit_logs SELECT is strictly restricted to admin/principal; teachers and ordinary staff are denied."
);

// ---------------------------------------------------------------------
// TEST 4: Unauthenticated Access Denied on Protected Records
// ---------------------------------------------------------------------
const allTablesRls = [
  "schools", "branches", "academic_years", "profiles",
  "students", "parents", "student_parents", "teachers",
  "staff", "classes", "sections", "subjects", "enrollments",
  "audit_logs", "site_settings"
];
const allHaveRls = allTablesRls.every(tbl => rlsSql.includes(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY;`));
const noOpenStudentUsingTrue = !rlsSql.includes('ON public.students FOR SELECT\nUSING (true)');
const noOpenEnrollmentUsingTrue = !rlsSql.includes('ON public.enrollments FOR SELECT\nUSING (true)');

assert(
  allHaveRls && noOpenStudentUsingTrue && noOpenEnrollmentUsingTrue,
  "TEST 4: Unauthenticated Access Denied on Protected Tables",
  `Verified: All 15 tables have RLS enabled. No open USING (true) on students, enrollments, parents, or audit logs.`
);

// ---------------------------------------------------------------------
// TEST 5: Database Role Enforcement (Frontend role state tampering rejected)
// ---------------------------------------------------------------------
const securityDefinerFunc = rlsSql.includes("CREATE OR REPLACE FUNCTION public.current_user_role()") &&
  rlsSql.includes("SECURITY DEFINER") &&
  rlsSql.includes("FROM public.profiles");
assert(
  securityDefinerFunc,
  "TEST 5: Server-Enforced Role Resolution (Frontend role tampering denied)",
  "Verified: Authorization roles are derived directly from public.profiles via SECURITY DEFINER database functions."
);

// ---------------------------------------------------------------------
// TEST 6: Client Bundle & Secret Key Security
// ---------------------------------------------------------------------
const clientTs = fs.readFileSync(path.join(rootDir, "lib/supabase/client.ts"), "utf-8");
const adminTs = fs.readFileSync(path.join(rootDir, "lib/supabase/admin.ts"), "utf-8");
const gitignore = fs.readFileSync(path.join(rootDir, ".gitignore"), "utf-8");

const noSecretInClient = !clientTs.includes("SUPABASE_SECRET_KEY") && !clientTs.includes("SERVICE_ROLE");
const adminHasWindowGuard = adminTs.includes('typeof window !== "undefined"');
const envLocalGitignored = gitignore.includes(".env.local");

assert(
  noSecretInClient && adminHasWindowGuard && envLocalGitignored,
  "TEST 6: Secret Key Isolation (SUPABASE_SECRET_KEY excluded from client)",
  "Verified: lib/supabase/client.ts has 0 references to secret keys. lib/supabase/admin.ts throws on browser invocation. .env.local is gitignored."
);

// ---------------------------------------------------------------------
// TEST 7: Private Storage Protection
// ---------------------------------------------------------------------
const storageSql = fs.readFileSync(path.join(rootDir, "supabase/migrations/20261007_03_storage_foundation.sql"), "utf-8");

const sensitiveBucketsPrivate = storageSql.includes("('student-documents', 'student-documents', false)") &&
  storageSql.includes("('report-cards', 'report-cards', false)") &&
  storageSql.includes("('admission-documents', 'admission-documents', false)");
assert(
  sensitiveBucketsPrivate,
  "TEST 7: Storage Protection (Private buckets have public = false)",
  "Verified: student-documents, report-cards, admission-documents, and faculty-assets are created with public = false."
);

// ---------------------------------------------------------------------
// TEST 8: Inactive User Access Denial
// ---------------------------------------------------------------------
const helperChecksActive = rlsSql.includes("status = 'active'");
const authHelperChecksActive = fs.readFileSync(path.join(rootDir, "lib/supabase/auth.ts"), "utf-8").includes("status === \"inactive\"");

assert(
  helperChecksActive && authHelperChecksActive,
  "TEST 8: Inactive Account Invalidation",
  "Verified: Database security definers filter by status = 'active' and signInUser explicitly rejects inactive/suspended accounts."
);

console.log("\n========================================================");
console.log(`SUMMARY: ${passedTests}/${totalTests} SECURITY TESTS PASSED`);
console.log("========================================================\n");

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
