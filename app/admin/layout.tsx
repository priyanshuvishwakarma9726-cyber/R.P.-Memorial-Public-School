import { redirect } from "next/navigation";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { canAccessAdmin } from "@/lib/supabase/permissions";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
import type { Profile } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();

  if (!supabase) {
    redirect("/login?error=supabase_unconfigured");
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile, error: profError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userProfile = profile as unknown as Profile | null;

  if (profError || !userProfile) {
    redirect("/login?error=profile_not_found");
  }

  // Enforce strictly active account status (rejects pending, inactive, suspended)
  if (userProfile.status !== "active") {
    redirect("/login?error=account_inactive");
  }

  if (!canAccessAdmin(userProfile.role)) {
    // Non-admin roles (student, parent, teacher) are strictly blocked from /admin
    redirect("/login?error=unauthorized_role");
  }

  return (
    <AdminLayoutShell
      callerRole={userProfile.role}
      callerName={userProfile.full_name}
    >
      {children}
    </AdminLayoutShell>
  );
}
