import Link from "next/link";
import { BookOpen, UserPlus, ShieldAlert, CheckCircle2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getTeachersList } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminTeachersPage() {
  const res = await getTeachersList();
  const teachers = res.teachers || [];

  return (
    <>
      <AdminHeader
        title="Teacher & Faculty Management"
        subtitle="Verified institutional teaching faculty roster and digital portal credentials."
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
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
              Verified Faculty Members: <strong>{teachers.length}</strong> (Source: CBSE Institutional Disclosure)
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
              Roster includes Principal and 18 teachers with verified designations and qualifications.
            </div>
          </div>

          <Link
            href="/admin/users"
            className="btn btn-primary"
            style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <UserPlus size={16} /> Provision Teacher Account
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
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Qualification</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Institutional Status</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Portal Account Status</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t: any, idx: number) => {
                const hasProfile = Boolean(t.profile_id && t.profile);
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            backgroundColor: t.designation === "PRINCIPAL" ? "rgba(212, 175, 55, 0.2)" : "rgba(14, 42, 71, 0.08)",
                            color: t.designation === "PRINCIPAL" ? "var(--color-accent-dark)" : "var(--color-primary)",
                          }}
                        >
                          {t.designation}
                        </span>
                        <span>#{idx + 1}</span>
                      </div>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>
                      {t.qualification}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          backgroundColor: t.status === "active" ? "rgba(22, 101, 52, 0.1)" : "rgba(185, 28, 28, 0.1)",
                          color: t.status === "active" ? "var(--color-success)" : "var(--color-error)",
                          textTransform: "capitalize",
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      {hasProfile ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--color-success)", fontWeight: 600, fontSize: "0.8rem" }}>
                          <CheckCircle2 size={16} />
                          <span>{t.profile.full_name} ({t.profile.email})</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                          No portal account linked
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                      <Link
                        href="/admin/users"
                        className="btn btn-outline"
                        style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}
                      >
                        Provision / Link
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
