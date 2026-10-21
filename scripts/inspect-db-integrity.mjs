import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envFile = fs.readFileSync(".env.local", "utf8");
function getEnv(key) {
  const match = envFile.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match ? match[1].trim() : "";
}

const SUPABASE_URL = getEnv("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_SECRET = getEnv("SUPABASE_SECRET_KEY");

const adminClient = createClient(SUPABASE_URL, SUPABASE_SECRET, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function inspectLiveDatabase() {
  console.log("==================================================================");
  console.log("LIVE SUPABASE POSTGRESQL INTEGRITY PROBE");
  console.log("Target Project:", SUPABASE_URL);
  console.log("==================================================================\n");

  const { data: schools } = await adminClient.from("schools").select("id").limit(1);
  const schoolId = schools[0].id;

  const results = {
    idx_academic_years_one_current: null,
    idx_classes_school_name_unique: null,
    idx_sections_class_name_active_unique: null,
    idx_subjects_school_code_unique: null,
    enrollments_unique_constraint: null,
    rpc_set_current_academic_year: null,
  };

  // 1. Probe idx_academic_years_one_current
  console.log("Probing 1: idx_academic_years_one_current...");
  const y1 = await adminClient.from("academic_years").insert({
    school_id: schoolId,
    name: "PROBE-AY-1",
    start_date: "2050-01-01",
    end_date: "2050-12-31",
    is_current: true,
  }).select().single();

  const y2 = await adminClient.from("academic_years").insert({
    school_id: schoolId,
    name: "PROBE-AY-2",
    start_date: "2051-01-01",
    end_date: "2051-12-31",
    is_current: true,
  }).select().single();

  if (y2.error) {
    results.idx_academic_years_one_current = {
      present: true,
      code: y2.error.code,
      message: y2.error.message,
    };
  } else {
    results.idx_academic_years_one_current = {
      present: false,
      detail: "Database engine permitted two rows with is_current = true for same school",
    };
  }
  if (y1.data?.id) await adminClient.from("academic_years").delete().eq("id", y1.data.id);
  if (y2.data?.id) await adminClient.from("academic_years").delete().eq("id", y2.data.id);

  // 2. Probe idx_classes_school_name_unique
  console.log("Probing 2: idx_classes_school_name_unique...");
  const c1 = await adminClient.from("classes").insert({
    school_id: schoolId,
    name: "Class X",
    display_order: 100,
    is_active: true,
  }).select().single();

  const c2 = await adminClient.from("classes").insert({
    school_id: schoolId,
    name: "class x",
    display_order: 101,
    is_active: true,
  }).select().single();

  if (c2.error) {
    results.idx_classes_school_name_unique = {
      present: true,
      code: c2.error.code,
      message: c2.error.message,
    };
  } else {
    results.idx_classes_school_name_unique = {
      present: false,
      detail: "Database engine permitted case-insensitive duplicate class names ('Class X' and 'class x')",
    };
  }
  if (c1.data?.id) await adminClient.from("classes").delete().eq("id", c1.data.id);
  if (c2.data?.id) await adminClient.from("classes").delete().eq("id", c2.data.id);

  // 3. Probe idx_sections_class_name_active_unique
  console.log("Probing 3: idx_sections_class_name_active_unique...");
  const probeClass = await adminClient.from("classes").insert({
    school_id: schoolId,
    name: "PROBE-CLASS-SEC",
    display_order: 102,
  }).select().single();

  if (probeClass.data) {
    const s1 = await adminClient.from("sections").insert({
      school_id: schoolId,
      class_id: probeClass.data.id,
      name: "A",
      is_active: true,
    }).select().single();

    const s2 = await adminClient.from("sections").insert({
      school_id: schoolId,
      class_id: probeClass.data.id,
      name: "a",
      is_active: true,
    }).select().single();

    if (s2.error) {
      results.idx_sections_class_name_active_unique = {
        present: true,
        code: s2.error.code,
        message: s2.error.message,
      };
    } else {
      results.idx_sections_class_name_active_unique = {
        present: false,
        detail: "Database engine permitted case-insensitive duplicate section names ('A' and 'a') in same class",
      };
    }

    if (s1.data?.id) await adminClient.from("sections").delete().eq("id", s1.data.id);
    if (s2.data?.id) await adminClient.from("sections").delete().eq("id", s2.data.id);
    await adminClient.from("classes").delete().eq("id", probeClass.data.id);
  }

  // 4. Probe idx_subjects_school_code_unique
  console.log("Probing 4: idx_subjects_school_code_unique...");
  const sub1 = await adminClient.from("subjects").insert({
    school_id: schoolId,
    name: "PROBE Physics 1",
    code: "PHY101",
    is_active: true,
  }).select().single();

  const sub2 = await adminClient.from("subjects").insert({
    school_id: schoolId,
    name: "PROBE Physics 2",
    code: "phy101",
    is_active: true,
  }).select().single();

  if (sub2.error) {
    results.idx_subjects_school_code_unique = {
      present: true,
      code: sub2.error.code,
      message: sub2.error.message,
    };
  } else {
    results.idx_subjects_school_code_unique = {
      present: false,
      detail: "Database engine permitted case-insensitive duplicate subject codes ('PHY101' and 'phy101')",
    };
  }
  if (sub1.data?.id) await adminClient.from("subjects").delete().eq("id", sub1.data.id);
  if (sub2.data?.id) await adminClient.from("subjects").delete().eq("id", sub2.data.id);

  // 5. Probe existing enrollments uniqueness constraint
  console.log("Probing 5: enrollments_student_id_academic_year_id_key...");
  const testEmail = "probe.enr.integrity@rpmps.test";
  const { data: authU } = await adminClient.auth.admin.createUser({
    email: testEmail,
    password: "ProbePassword99#",
    email_confirm: true,
  });

  if (authU?.user) {
    await adminClient.from("profiles").insert({
      id: authU.user.id,
      school_id: schoolId,
      email: testEmail,
      full_name: "Probe Enr Student",
      role: "student",
      status: "active",
    });

    const { data: std } = await adminClient.from("students").insert({
      school_id: schoolId,
      profile_id: authU.user.id,
      admission_number: "PROBE-ADM-ENR",
    }).select().single();

    const { data: yProbe } = await adminClient.from("academic_years").insert({
      school_id: schoolId,
      name: "PROBE-ENR-YEAR",
      start_date: "2055-01-01",
      end_date: "2055-12-31",
    }).select().single();

    const { data: cProbe } = await adminClient.from("classes").insert({
      school_id: schoolId,
      name: "PROBE-ENR-CLASS",
    }).select().single();

    if (std && yProbe && cProbe) {
      const e1 = await adminClient.from("enrollments").insert({
        student_id: std.id,
        academic_year_id: yProbe.id,
        class_id: cProbe.id,
        status: "active",
      }).select().single();

      const e2 = await adminClient.from("enrollments").insert({
        student_id: std.id,
        academic_year_id: yProbe.id,
        class_id: cProbe.id,
        status: "active",
      });

      if (e2.error) {
        results.enrollments_unique_constraint = {
          present: true,
          code: e2.error.code,
          message: e2.error.message,
          details: e2.error.details,
        };
      } else {
        results.enrollments_unique_constraint = {
          present: false,
          detail: "Database engine permitted duplicate student enrollment in same year",
        };
      }

      if (e1.data?.id) await adminClient.from("enrollments").delete().eq("id", e1.data.id);
      await adminClient.from("students").delete().eq("id", std.id);
      await adminClient.from("profiles").delete().eq("id", authU.user.id);
      await adminClient.auth.admin.deleteUser(authU.user.id);
      await adminClient.from("classes").delete().eq("id", cProbe.id);
      await adminClient.from("academic_years").delete().eq("id", yProbe.id);
    }
  }

  // 6. Probe public.set_current_academic_year() RPC
  console.log("Probing 6: public.set_current_academic_year() RPC...");
  const dummyUUID = "00000000-0000-0000-0000-000000000000";
  const rpcRes = await adminClient.rpc("set_current_academic_year", {
    p_academic_year_id: dummyUUID,
  });

  if (rpcRes.error && rpcRes.error.code === "PGRST202") {
    // PGRST202: Could not find the function in the schema cache
    results.rpc_set_current_academic_year = {
      present: false,
      code: rpcRes.error.code,
      message: rpcRes.error.message,
    };
  } else if (rpcRes.error) {
    // If function exists, it would fail on authorization or NOT FOUND, not PGRST202
    results.rpc_set_current_academic_year = {
      present: true,
      error: rpcRes.error.message,
    };
  } else {
    results.rpc_set_current_academic_year = {
      present: true,
      data: rpcRes.data,
    };
  }

  console.log("\n==================================================================");
  console.log("PROBE RESULTS SUMMARY");
  console.log("==================================================================");
  console.log(JSON.stringify(results, null, 2));
}

inspectLiveDatabase().catch(console.error);
