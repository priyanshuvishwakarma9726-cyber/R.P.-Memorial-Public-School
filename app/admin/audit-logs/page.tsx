import AdminHeader from "@/components/admin/AdminHeader";
import AuditLogsView from "@/components/admin/AuditLogsView";
import { getAuditLogsList } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const res = await getAuditLogsList({ limit: 50 });
  const logs = res.logs || [];
  const totalCount = res.totalCount || 0;

  return (
    <>
      <AdminHeader
        title="Security & System Audit Logs"
        subtitle="Immutable append-only record of administrative actions, user mutations, and permission changes."
      />

      <main style={{ padding: "1.75rem", flex: 1 }}>
        <AuditLogsView initialLogs={logs} totalCount={totalCount} />
      </main>
    </>
  );
}
