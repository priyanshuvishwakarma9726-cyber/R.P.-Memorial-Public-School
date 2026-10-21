import Link from "next/link";
import { Briefcase, UserPlus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getStaffList } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const res = await getStaffList();
  const staff = res.staff || [];

  return (
    <>
      <AdminHeader
        title="Administrative & Support Staff"
        subtitle="Manage school office personnel, administrative assistants, and operational staff."
      />

      <main style={{ padding: "1.75rem", flex: 1 }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
            Registered Administrative Personnel: <strong>{staff.length}</strong>
          </div>

          <Link
            href="/admin/users"
            className="btn btn-primary"
            style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <UserPlus size={16} /> Provision Staff Account
          </Link>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Designation</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Staff Name</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Email</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                    No staff records found in database. Provision administrative staff in User Management.
                  </td>
                </tr>
              ) : (
                staff.map((s: any) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>
                      {s.designation}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>
                      {s.profile?.full_name || "Unlinked"}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", color: "var(--color-text-secondary)" }}>
                      {s.profile?.email || "—"}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          backgroundColor: s.status === "active" ? "rgba(22, 101, 52, 0.1)" : "rgba(185, 28, 28, 0.1)",
                          color: s.status === "active" ? "var(--color-success)" : "var(--color-error)",
                          textTransform: "capitalize",
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
