"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Shield,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle2,
  Lock,
  RefreshCw,
  MoreVertical,
  X,
} from "lucide-react";
import type { Profile, UserRole, ProfileStatus } from "@/lib/supabase/types";
import { provisionNewUser, updateUserStatus, updateUserRole } from "@/lib/actions/admin-actions";
import ConfirmDialog from "./ConfirmDialog";

interface UserManagementViewProps {
  initialUsers: Profile[];
  callerRole: string;
}

export default function UserManagementView({
  initialUsers,
  callerRole,
}: UserManagementViewProps) {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create User Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [initialPassword, setInitialPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Status Change Dialog
  const [confirmTarget, setConfirmTarget] = useState<{ user: Profile; action: "deactivate" | "activate" | "suspend" } | null>(null);
  const [confirmRoleTarget, setConfirmRoleTarget] = useState<{ user: Profile; newRole: UserRole } | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    const res = await provisionNewUser({
      full_name: fullName,
      email,
      role,
      phone,
      initialPassword: initialPassword || undefined,
    });

    setIsSubmitting(false);

    if (!res.success) {
      setModalError(res.error || "Failed to provision user.");
    } else {
      setShowCreateModal(false);
      setFullName("");
      setEmail("");
      setPhone("");
      setInitialPassword("");
      setBannerSuccess(res.message || "User successfully provisioned.");
      // Add newly provisioned user to local list
      if (res.userId) {
        setUsers([
          {
            id: res.userId,
            full_name: fullName,
            email,
            phone,
            role,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          ...users,
        ]);
      }
    }
  };

  const handleExecuteStatusChange = async () => {
    if (!confirmTarget) return;
    setIsActionLoading(true);

    const newStatus: ProfileStatus = confirmTarget.action === "deactivate" ? "inactive" : confirmTarget.action === "suspend" ? "suspended" : "active";
    const res = await updateUserStatus(confirmTarget.user.id, newStatus);
    setIsActionLoading(false);

    if (res.success) {
      setUsers(
        users.map((u) => (u.id === confirmTarget.user.id ? { ...u, status: newStatus } : u))
      );
      setBannerSuccess(res.message || "Status updated.");
      setConfirmTarget(null);
    } else {
      alert(res.error || "Status update failed.");
      setConfirmTarget(null);
    }
  };

  const handleExecuteRoleChange = async () => {
    if (!confirmRoleTarget) return;
    setIsActionLoading(true);

    const res = await updateUserRole(confirmRoleTarget.user.id, confirmRoleTarget.newRole);
    setIsActionLoading(false);

    if (res.success) {
      setUsers(
        users.map((u) => (u.id === confirmRoleTarget.user.id ? { ...u, role: confirmRoleTarget.newRole } : u))
      );
      setBannerSuccess(res.message || "Role updated.");
      setConfirmRoleTarget(null);
    } else {
      alert(res.error || "Role update failed.");
      setConfirmRoleTarget(null);
    }
  };

  return (
    <div>
      {/* Banner message */}
      {bannerSuccess && (
        <div
          style={{
            backgroundColor: "var(--color-success-bg)",
            color: "var(--color-success)",
            padding: "0.85rem 1.25rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid rgba(22, 101, 52, 0.2)",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle2 size={18} />
            <span>{bannerSuccess}</span>
          </div>
          <button
            onClick={() => setBannerSuccess(null)}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Action Header & Search Controls */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: "260px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={16}
              style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "2.25rem", fontSize: "0.85rem", height: "38px" }}
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-input"
            style={{ width: "auto", fontSize: "0.85rem", height: "38px" }}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="parent">Parents</option>
            <option value="teacher">Teachers</option>
            <option value="staff">Staff</option>
            <option value="admin">Administrators</option>
            <option value="principal">Principals</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            style={{ width: "auto", fontSize: "0.85rem", height: "38px" }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
          style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <PlusCircle size={16} /> Provision User
        </button>
      </div>

      {/* Users Table */}
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
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Full Name</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Email Address</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Role</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Status</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Created</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  No user profiles match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    transition: "background-color var(--transition-fast)",
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: "0.85rem 1rem", fontWeight: 600, color: "var(--color-text)" }}>
                    {u.full_name}
                  </td>
                  <td style={{ padding: "0.85rem 1rem", color: "var(--color-text-secondary)" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "4px",
                        backgroundColor:
                          u.role === "admin"
                            ? "rgba(212, 175, 55, 0.15)"
                            : u.role === "teacher"
                            ? "rgba(14, 42, 71, 0.08)"
                            : "rgba(100, 116, 139, 0.1)",
                        color:
                          u.role === "admin"
                            ? "var(--color-accent-dark)"
                            : u.role === "teacher"
                            ? "var(--color-primary)"
                            : "var(--color-text)",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "capitalize",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "4px",
                        backgroundColor:
                          u.status === "active"
                            ? "rgba(22, 101, 52, 0.1)"
                            : "rgba(185, 28, 28, 0.1)",
                        color:
                          u.status === "active"
                            ? "var(--color-success)"
                            : "var(--color-error)",
                      }}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1rem", color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.35rem" }}>
                      {/* Activate / Deactivate Toggle */}
                      {u.status === "active" ? (
                        <button
                          onClick={() => setConfirmTarget({ user: u, action: "deactivate" })}
                          className="btn btn-outline"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.6rem",
                            color: "#dc2626",
                            borderColor: "rgba(220, 38, 38, 0.3)",
                          }}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmTarget({ user: u, action: "activate" })}
                          className="btn btn-outline"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.6rem",
                            color: "var(--color-success)",
                            borderColor: "rgba(22, 101, 52, 0.3)",
                          }}
                        >
                          Activate
                        </button>
                      )}

                      {/* Role selection dropdown if caller is admin */}
                      {callerRole === "admin" && (
                        <select
                          value={u.role}
                          onChange={(e) =>
                            setConfirmRoleTarget({ user: u, newRole: e.target.value as UserRole })
                          }
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.2rem 0.4rem",
                            borderRadius: "4px",
                            border: "1px solid var(--color-border)",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <option value="student">Student</option>
                          <option value="parent">Parent</option>
                          <option value="teacher">Teacher</option>
                          <option value="staff">Staff</option>
                          <option value="principal">Principal</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PROVISION USER MODAL */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <PlusCircle size={20} style={{ color: "var(--color-primary)" }} />
                <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary)", margin: 0, fontWeight: 700 }}>
                  Provision Institutional User
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div
                style={{
                  backgroundColor: "var(--color-error-bg)",
                  color: "var(--color-error)",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "1rem",
                  fontSize: "0.825rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <AlertCircle size={16} />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label className="form-label" htmlFor="provFullName">Full Name *</label>
                <input
                  id="provFullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="provEmail">Email Address *</label>
                <input
                  id="provEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ramesh@rpm.edu"
                  className="form-input"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="provRole">Role *</label>
                  <select
                    id="provRole"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="form-input"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                    {callerRole === "admin" && <option value="principal">Principal</option>}
                    {callerRole === "admin" && <option value="admin">Administrator</option>}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="provPhone">Contact Phone</label>
                  <input
                    id="provPhone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="provPassword">
                  Initial Temporary Password (Optional)
                </label>
                <input
                  id="provPassword"
                  type="password"
                  value={initialPassword}
                  onChange={(e) => setInitialPassword(e.target.value)}
                  placeholder="Auto-generated secure password if blank"
                  className="form-input"
                />
                <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                  If left blank, a random secure temporary password will be assigned.
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Provisioning..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deactivate / Activate Dialog */}
      <ConfirmDialog
        isOpen={Boolean(confirmTarget)}
        title={confirmTarget?.action === "deactivate" ? "Deactivate User Account" : "Activate User Account"}
        message={`Are you sure you want to ${confirmTarget?.action} the account for "${confirmTarget?.user.full_name}" (${confirmTarget?.user.email})?`}
        confirmLabel={confirmTarget?.action === "deactivate" ? "Deactivate" : "Activate"}
        isDestructive={confirmTarget?.action === "deactivate"}
        isLoading={isActionLoading}
        onConfirm={handleExecuteStatusChange}
        onCancel={() => setConfirmTarget(null)}
      />

      {/* Confirm Role Change Dialog */}
      <ConfirmDialog
        isOpen={Boolean(confirmRoleTarget)}
        title="Confirm Role Change"
        message={`Are you sure you want to change "${confirmRoleTarget?.user.full_name}" from "${confirmRoleTarget?.user.role}" to "${confirmRoleTarget?.newRole}"?`}
        confirmLabel="Update Role"
        isLoading={isActionLoading}
        onConfirm={handleExecuteRoleChange}
        onCancel={() => setConfirmRoleTarget(null)}
      />
    </div>
  );
}
