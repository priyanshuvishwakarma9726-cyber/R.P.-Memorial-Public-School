"use client";

import { useState } from "react";
import {
  History,
  Search,
  Filter,
  Eye,
  FileCode,
  X,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { AuditLog } from "@/lib/supabase/types";

interface AuditLogsViewProps {
  initialLogs: AuditLog[];
  totalCount: number;
}

export default function AuditLogsView({ initialLogs, totalCount }: AuditLogsViewProps) {
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      !search ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entity_type.toLowerCase().includes(search.toLowerCase()) ||
      l.entity_id?.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes("created") || action.includes("provisioned") || action.includes("linked")) {
      return { bg: "rgba(22, 101, 52, 0.1)", color: "var(--color-success)" };
    }
    if (action.includes("unlinked") || action.includes("deactivate") || action.includes("delete")) {
      return { bg: "rgba(185, 28, 28, 0.1)", color: "var(--color-error)" };
    }
    return { bg: "rgba(14, 42, 71, 0.08)", color: "var(--color-primary)" };
  };

  return (
    <div>
      {/* Search and Filters */}
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
              placeholder="Search actions, entities, or IDs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "2.25rem", fontSize: "0.85rem", height: "38px" }}
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="form-input"
            style={{ width: "auto", fontSize: "0.85rem", height: "38px" }}
          >
            <option value="all">All Actions</option>
            <option value="user_provisioned">User Provisioned</option>
            <option value="user_status_changed">Status Changed</option>
            <option value="user_role_changed">Role Changed</option>
            <option value="parent_student_linked">Parent-Student Linked</option>
            <option value="parent_student_unlinked">Parent-Student Unlinked</option>
            <option value="school_profile_updated">School Profile Updated</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.825rem", color: "var(--color-text-muted)" }}>
          <ShieldCheck size={16} style={{ color: "var(--color-success)" }} />
          <span>Immutable Audit Log (Append-Only)</span>
        </div>
      </div>

      {/* Logs Table */}
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
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Timestamp</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Action</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Entity Type</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Entity ID</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Actor ID</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)", textAlign: "right" }}>Snapshot</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  No audit log entries found. Sensitive operations are recorded here automatically.
                </td>
              </tr>
            ) : (
              filteredLogs.map((l) => {
                const badge = getActionBadgeColor(l.action);
                return (
                  <tr key={l.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "0.85rem 1rem", color: "var(--color-text-secondary)", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                      {new Date(l.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "capitalize",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "4px",
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {l.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 600, color: "var(--color-primary)" }}>
                      {l.entity_type}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontFamily: "monospace", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                      {l.entity_id ? `${l.entity_id.slice(0, 12)}...` : "—"}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontFamily: "monospace", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                      {l.actor_user_id ? `${l.actor_user_id.slice(0, 8)}...` : "System"}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                      {(l.old_data || l.new_data) ? (
                        <button
                          onClick={() => setSelectedLog(l)}
                          className="btn btn-outline"
                          style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        >
                          <Eye size={14} /> View Diff
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Audit Detail Modal */}
      {selectedLog && (
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
              maxWidth: "600px",
              width: "100%",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--color-border)",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileCode size={20} style={{ color: "var(--color-primary)" }} />
                <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary)", margin: 0, fontWeight: 700 }}>
                  Audit Event Snapshot
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>
              <div><strong>Action:</strong> {selectedLog.action}</div>
              <div><strong>Entity:</strong> {selectedLog.entity_type} ({selectedLog.entity_id})</div>
              <div><strong>Recorded At:</strong> {new Date(selectedLog.created_at).toLocaleString()}</div>
            </div>

            {selectedLog.old_data && (
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#b91c1c", marginBottom: "0.35rem" }}>
                  Previous State (Old Data):
                </div>
                <pre
                  style={{
                    backgroundColor: "#fef2f2",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.75rem",
                    overflowX: "auto",
                    border: "1px solid rgba(185, 28, 28, 0.2)",
                  }}
                >
                  {JSON.stringify(selectedLog.old_data, null, 2)}
                </pre>
              </div>
            )}

            {selectedLog.new_data && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#15803d", marginBottom: "0.35rem" }}>
                  Updated State (New Data):
                </div>
                <pre
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.75rem",
                    overflowX: "auto",
                    border: "1px solid rgba(22, 101, 52, 0.2)",
                  }}
                >
                  {JSON.stringify(selectedLog.new_data, null, 2)}
                </pre>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSelectedLog(null)}
                className="btn btn-outline"
              >
                Close Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
