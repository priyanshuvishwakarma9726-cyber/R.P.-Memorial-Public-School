import Link from "next/link";
import {
  Users,
  GraduationCap,
  HeartHandshake,
  BookOpen,
  Briefcase,
  ShieldCheck,
  History,
  Building2,
  ArrowRight,
  UserCheck,
  UserX,
  PlusCircle,
  FileText,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getDashboardMetrics } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const res = await getDashboardMetrics();
  const data = res.data;

  return (
    <>
      <AdminHeader
        title="Admin Control Center"
        subtitle="Institutional operations, user roles, security audits, and school identity."
        callerName={data?.callerName || "Administrator"}
        callerRole={data?.callerRole || "admin"}
      />

      <main style={{ padding: "1.75rem", flex: 1 }}>
        {/* Welcome Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #07172c 0%, #13315c 100%)",
            color: "#ffffff",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem 2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 12px rgba(7, 23, 44, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "var(--color-accent-light)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "0.35rem",
              }}
            >
              <ShieldCheck size={16} /> Verified Production Control Center
            </div>
            <h2 style={{ fontSize: "1.5rem", margin: "0 0 0.35rem 0", fontWeight: 800 }}>
              R.P. MEMORIAL PUBLIC SCHOOL
            </h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
              School Code: 2134039 &bull; Main Campus &bull; Maharajganj, Uttar Pradesh
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/admin/users"
              className="btn"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-primary-dark)",
                fontWeight: 700,
                fontSize: "0.825rem",
                padding: "0.6rem 1.1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <PlusCircle size={16} /> Provision User
            </Link>
            <Link
              href="/admin/audit-logs"
              className="btn btn-outline"
              style={{
                borderColor: "rgba(255,255,255,0.25)",
                color: "#ffffff",
                fontSize: "0.825rem",
                padding: "0.6rem 1.1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <History size={16} /> Audit Trail
            </Link>
          </div>
        </div>

        {/* METRIC CARDS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          {/* Total Students */}
          <div className="admin-stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">Total Students</div>
                <div className="stat-value">{data?.totalStudents ?? 0}</div>
              </div>
              <div className="stat-icon-wrap" style={{ backgroundColor: "rgba(14, 42, 71, 0.08)", color: "var(--color-primary)" }}>
                <GraduationCap size={22} />
              </div>
            </div>
            <Link href="/admin/students" className="stat-link">
              Manage students <ArrowRight size={14} />
            </Link>
          </div>

          {/* Total Parents */}
          <div className="admin-stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">Total Parents</div>
                <div className="stat-value">{data?.totalParents ?? 0}</div>
              </div>
              <div className="stat-icon-wrap" style={{ backgroundColor: "rgba(22, 101, 52, 0.08)", color: "var(--color-success)" }}>
                <HeartHandshake size={22} />
              </div>
            </div>
            <Link href="/admin/parents" className="stat-link">
              Manage parents <ArrowRight size={14} />
            </Link>
          </div>

          {/* Total Teachers */}
          <div className="admin-stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">Faculty Roster</div>
                <div className="stat-value">{data?.totalTeachers ?? 19}</div>
              </div>
              <div className="stat-icon-wrap" style={{ backgroundColor: "rgba(212, 175, 55, 0.12)", color: "var(--color-accent-dark)" }}>
                <BookOpen size={22} />
              </div>
            </div>
            <Link href="/admin/teachers" className="stat-link">
              Verified faculty <ArrowRight size={14} />
            </Link>
          </div>

          {/* Total Staff */}
          <div className="admin-stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">Administrative Staff</div>
                <div className="stat-value">{data?.totalStaff ?? 0}</div>
              </div>
              <div className="stat-icon-wrap" style={{ backgroundColor: "rgba(99, 102, 241, 0.08)", color: "#6366f1" }}>
                <Briefcase size={22} />
              </div>
            </div>
            <Link href="/admin/staff" className="stat-link">
              Manage staff <ArrowRight size={14} />
            </Link>
          </div>

          {/* Active Users */}
          <div className="admin-stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">Active Portal Accounts</div>
                <div className="stat-value">{data?.activeUsers ?? 0}</div>
              </div>
              <div className="stat-icon-wrap" style={{ backgroundColor: "rgba(22, 101, 52, 0.08)", color: "var(--color-success)" }}>
                <UserCheck size={22} />
              </div>
            </div>
            <Link href="/admin/users?status=active" className="stat-link">
              Active users <ArrowRight size={14} />
            </Link>
          </div>

          {/* Inactive / Suspended */}
          <div className="admin-stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">Inactive Accounts</div>
                <div className="stat-value">{data?.inactiveUsers ?? 0}</div>
              </div>
              <div className="stat-icon-wrap" style={{ backgroundColor: "rgba(185, 28, 28, 0.08)", color: "var(--color-error)" }}>
                <UserX size={22} />
              </div>
            </div>
            <Link href="/admin/users?status=inactive" className="stat-link">
              Review inactive <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* TWO-PANEL ACTIVITY & ACCOUNTS SECTION */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
          {/* Recent Audit Logs */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <History size={18} style={{ color: "var(--color-primary)" }} />
                <h3 style={{ fontSize: "1.05rem", color: "var(--color-primary)", margin: 0, fontWeight: 700 }}>
                  Recent Audit Activity
                </h3>
              </div>
              <Link href="/admin/audit-logs" style={{ fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 600 }}>
                View All
              </Link>
            </div>

            {(!data?.recentAudits || data.recentAudits.length === 0) ? (
              <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                No recent audit activity recorded yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {data.recentAudits.map((a: any) => (
                  <div
                    key={a.id}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      fontSize: "0.825rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: 700, color: "var(--color-primary)", textTransform: "capitalize" }}>
                        {a.action.replace(/_/g, " ")}
                      </span>
                      <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                        {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ color: "var(--color-text-secondary)", fontSize: "0.78rem" }}>
                      Target: {a.entity_type} {a.entity_id ? `(${a.entity_id.slice(0, 8)}...)` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Provisioned Accounts */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Users size={18} style={{ color: "var(--color-primary)" }} />
                <h3 style={{ fontSize: "1.05rem", color: "var(--color-primary)", margin: 0, fontWeight: 700 }}>
                  Recently Created Users
                </h3>
              </div>
              <Link href="/admin/users" style={{ fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 600 }}>
                Manage Users
              </Link>
            </div>

            {(!data?.recentUsers || data.recentUsers.length === 0) ? (
              <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                No user profiles created yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {data.recentUsers.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      fontSize: "0.825rem",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--color-primary)" }}>{u.full_name}</div>
                      <div style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>{u.email}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          backgroundColor: "rgba(14, 42, 71, 0.08)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {u.role}
                      </span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          backgroundColor: u.status === "active" ? "rgba(22, 101, 52, 0.1)" : "rgba(185, 28, 28, 0.1)",
                          color: u.status === "active" ? "var(--color-success)" : "var(--color-error)",
                        }}
                      >
                        {u.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
