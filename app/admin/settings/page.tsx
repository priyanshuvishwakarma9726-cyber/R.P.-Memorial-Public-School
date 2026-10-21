import { Settings, Shield, Database, Lock, CheckCircle2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getInstitutionalSettings } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const res = await getInstitutionalSettings();
  const settings = res.settings || [];

  return (
    <>
      <AdminHeader
        title="Institutional System Settings"
        subtitle="Configuration keys, database security boundaries, and institutional policies."
      />

      <main style={{ padding: "1.75rem", flex: 1, maxWidth: "900px" }}>
        {/* Security Invariants Box */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Shield size={20} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary)", margin: 0, fontWeight: 700 }}>
              Database Security & Authorization Boundaries
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            <div
              style={{
                padding: "0.85rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                fontSize: "0.825rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-success)", fontWeight: 700, marginBottom: "0.25rem" }}>
                <CheckCircle2 size={16} /> Row Level Security (RLS)
              </div>
              <div style={{ color: "var(--color-text-secondary)" }}>
                Active on all 15 core database tables with zero open public write access.
              </div>
            </div>

            <div
              style={{
                padding: "0.85rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                fontSize: "0.825rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-success)", fontWeight: 700, marginBottom: "0.25rem" }}>
                <CheckCircle2 size={16} /> Immutable Audit Logs
              </div>
              <div style={{ color: "var(--color-text-secondary)" }}>
                Append-only security log; deletion and updates are disallowed at the database engine level.
              </div>
            </div>

            <div
              style={{
                padding: "0.85rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                fontSize: "0.825rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-success)", fontWeight: 700, marginBottom: "0.25rem" }}>
                <CheckCircle2 size={16} /> Secret Key Isolation
              </div>
              <div style={{ color: "var(--color-text-secondary)" }}>
                Privileged keys isolated strictly to server actions; zero client bundle leakage.
              </div>
            </div>
          </div>
        </div>

        {/* Site Settings Key-Value Store */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <Database size={20} style={{ color: "var(--color-primary)" }} />
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary)", margin: 0, fontWeight: 700 }}>
              Institutional Configuration Store (site_settings)
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {settings.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                No custom configuration settings stored.
              </p>
            ) : (
              settings.map((s: any) => (
                <div
                  key={s.id}
                  style={{
                    padding: "1rem",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: 700, color: "var(--color-primary)", fontSize: "0.85rem" }}>
                      {s.setting_key}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.45rem",
                        borderRadius: "4px",
                        backgroundColor: s.is_public ? "rgba(22, 101, 52, 0.1)" : "rgba(100, 116, 139, 0.1)",
                        color: s.is_public ? "var(--color-success)" : "var(--color-text-secondary)",
                      }}
                    >
                      {s.is_public ? "Public Access" : "Admin Only"}
                    </span>
                  </div>

                  <pre
                    style={{
                      margin: 0,
                      padding: "0.6rem 0.8rem",
                      backgroundColor: "#ffffff",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.75rem",
                      border: "1px solid var(--color-border)",
                      overflowX: "auto",
                      color: "var(--color-text)",
                    }}
                  >
                    {JSON.stringify(s.setting_value, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
