import AdminHeader from "@/components/admin/AdminHeader";
import UserManagementView from "@/components/admin/UserManagementView";
import { getUsersList } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const res = await getUsersList({ limit: 50 });
  const users = res.users || [];

  return (
    <>
      <AdminHeader
        title="User & Identity Management"
        subtitle="Manage institutional profiles, provision accounts, and configure access permissions."
      />

      <main style={{ padding: "1.75rem", flex: 1 }}>
        <UserManagementView
          initialUsers={users}
          callerRole="admin"
        />
      </main>
    </>
  );
}
