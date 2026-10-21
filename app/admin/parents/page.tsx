import Link from "next/link";
import { HeartHandshake, UserPlus, Phone, Mail } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getParentsList } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminParentsPage() {
  const res = await getParentsList();
  const parents = res.parents || [];
  const linkages = res.linkages || [];

  const getLinkedChildren = (parentId: string) => {
    return linkages.filter((l: any) => l.parent_id === parentId);
  };

  return (
    <>
      <AdminHeader
        title="Parent Management"
        subtitle="Manage registered parents, guardians, and linked student relationships."
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
            Total Registered Parents: <strong>{parents.length}</strong>
          </div>

          <Link
            href="/admin/users"
            className="btn btn-primary"
            style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <UserPlus size={16} /> Provision Parent Account
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
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Parent Name</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Contact Info</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Linked Students</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Account Status</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parents.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                    No parent accounts provisioned yet. Use the User Management tab to provision parent accounts.
                  </td>
                </tr>
              ) : (
                parents.map((p: any) => {
                  const children = getLinkedChildren(p.id);
                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>
                        {p.profile?.full_name || "Parent Account"}
                      </td>
                      <td style={{ padding: "0.85rem 1rem", color: "var(--color-text-secondary)" }}>
                        <div>{p.profile?.email || "No email"}</div>
                        {p.profile?.phone && (
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                            {p.profile.phone}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        {children.length === 0 ? (
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                            0 children linked
                          </span>
                        ) : (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                            {children.map((c: any, idx: number) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: "0.75rem",
                                  backgroundColor: "rgba(14, 42, 71, 0.08)",
                                  color: "var(--color-primary)",
                                  padding: "0.2rem 0.5rem",
                                  borderRadius: "4px",
                                  fontWeight: 600,
                                }}
                              >
                                {c.student?.profile?.full_name || c.student?.admission_number || "Child"} ({c.relationship})
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            backgroundColor: p.status === "active" ? "rgba(22, 101, 52, 0.1)" : "rgba(185, 28, 28, 0.1)",
                            color: p.status === "active" ? "var(--color-success)" : "var(--color-error)",
                            textTransform: "capitalize",
                          }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                        <Link
                          href="/admin/students"
                          className="btn btn-outline"
                          style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}
                        >
                          Manage Links
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
