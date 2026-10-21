"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit2,
  Check,
  RefreshCw,
} from "lucide-react";
import {
  getAcademicYearsList,
  createAcademicYear,
  updateAcademicYear,
  setCurrentAcademicYear,
} from "@/lib/actions/academic-actions";
import ConfirmDialog from "./ConfirmDialog";
import type { AcademicYear } from "@/lib/supabase/types";

export default function AcademicYearsView() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formIsCurrent, setFormIsCurrent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit Modal State
  const [editTarget, setEditTarget] = useState<AcademicYear | null>(null);
  const [editName, setEditName] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  // Set Current Year Dialog
  const [confirmCurrentTarget, setConfirmCurrentTarget] = useState<AcademicYear | null>(null);

  const loadData = () => {
    setLoading(true);
    startTransition(async () => {
      const res = await getAcademicYearsList();
      if (res.success && res.academicYears) {
        setAcademicYears(res.academicYears);
        setError(null);
      } else {
        setError(res.error || "Failed to load academic years.");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Please enter an academic year name (e.g., 2026-2027).");
      return;
    }

    if (formStartDate && formEndDate) {
      if (new Date(formStartDate).getTime() >= new Date(formEndDate).getTime()) {
        setFormError("Start date must be strictly before end date.");
        return;
      }
    }

    const res = await createAcademicYear({
      name: formName.trim(),
      start_date: formStartDate || null,
      end_date: formEndDate || null,
      is_current: formIsCurrent,
    });

    if (res.success) {
      setSuccessMsg(`Academic year "${formName}" created successfully.`);
      setIsCreateModalOpen(false);
      setFormName("");
      setFormStartDate("");
      setFormEndDate("");
      setFormIsCurrent(false);
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setFormError(res.error || "Failed to create academic year.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditError(null);

    if (!editName.trim()) {
      setEditError("Academic year name cannot be empty.");
      return;
    }

    if (editStartDate && editEndDate) {
      if (new Date(editStartDate).getTime() >= new Date(editEndDate).getTime()) {
        setEditError("Start date must be strictly before end date.");
        return;
      }
    }

    const res = await updateAcademicYear(editTarget.id, {
      name: editName.trim(),
      start_date: editStartDate || null,
      end_date: editEndDate || null,
    });

    if (res.success) {
      setSuccessMsg(`Academic year updated successfully.`);
      setEditTarget(null);
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setEditError(res.error || "Failed to update academic year.");
    }
  };

  const handleSetCurrent = async () => {
    if (!confirmCurrentTarget) return;

    const res = await setCurrentAcademicYear(confirmCurrentTarget.id);
    if (res.success) {
      setSuccessMsg(`"${confirmCurrentTarget.name}" is now the active academic session.`);
      setConfirmCurrentTarget(null);
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setError(res.error || "Failed to switch current academic year.");
      setConfirmCurrentTarget(null);
    }
  };

  const filtered = academicYears.filter((ay) =>
    ay.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
            Academic Years
          </h1>
          <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.95rem" }}>
            Configure and maintain school sessions. Exactly one session may be active at any time.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setIsCreateModalOpen(true);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#07172c",
            color: "white",
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(7, 23, 44, 0.15)",
          }}
        >
          <Plus size={18} />
          New Academic Year
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
          <input
            type="text"
            placeholder="Search academic years by name (e.g., 2026)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 1rem 0.6rem 2.5rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
        </div>
        <button
          onClick={loadData}
          disabled={loading || isPending}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.6rem 0.9rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "white",
            fontSize: "0.85rem",
            cursor: "pointer",
            color: "#475569",
          }}
        >
          <RefreshCw size={15} className={loading || isPending ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Session Name</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Start Date</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>End Date</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Session Status</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    Loading academic years...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", backgroundColor: "#f1f5f9", marginBottom: "1rem" }}>
                      <Calendar size={32} color="#94a3b8" />
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.5rem" }}>
                      No academic years configured yet.
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                      An administrator must enter the actual academic session dates. Database starts empty until real institutional dates are specified.
                    </p>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      style={{
                        backgroundColor: "#07172c",
                        color: "white",
                        padding: "0.6rem 1.25rem",
                        borderRadius: "8px",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        cursor: "pointer",
                      }}
                    >
                      Create First Academic Year
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((ay) => (
                  <tr
                    key={ay.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      backgroundColor: ay.is_current ? "#f0fdf4" : "transparent",
                    }}
                  >
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <span style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.95rem" }}>
                          {ay.name}
                        </span>
                        {ay.is_current && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              padding: "0.15rem 0.5rem",
                              borderRadius: "999px",
                              backgroundColor: "#bbf7d0",
                              color: "#166534",
                            }}
                          >
                            <Check size={12} />
                            Current Session
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#475569" }}>
                      {ay.start_date || "—"}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#475569" }}>
                      {ay.end_date || "—"}
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      {ay.is_current ? (
                        <span style={{ color: "#16a34a", fontWeight: 600, fontSize: "0.85rem" }}>
                          Active
                        </span>
                      ) : (
                        <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                          Past / Inactive
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        {!ay.is_current && (
                          <button
                            onClick={() => setConfirmCurrentTarget(ay)}
                            style={{
                              padding: "0.35rem 0.75rem",
                              borderRadius: "6px",
                              border: "1px solid #bbf7d0",
                              backgroundColor: "#f0fdf4",
                              color: "#166534",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Set Current
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditTarget(ay);
                            setEditName(ay.name);
                            setEditStartDate(ay.start_date || "");
                            setEditEndDate(ay.end_date || "");
                            setEditError(null);
                          }}
                          style={{
                            padding: "0.35rem 0.75rem",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: "white",
                            color: "#334155",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "14px",
              maxWidth: "480px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#0f172a" }}>
              New Academic Year
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 1.25rem" }}>
              Enter official academic session details according to the school calendar.
            </p>

            {formError && (
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "#fef2f2",
                  color: "#991b1b",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Session Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 2026-2027"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.25rem" }}>
                <input
                  type="checkbox"
                  id="setCurrentCheckbox"
                  checked={formIsCurrent}
                  onChange={(e) => setFormIsCurrent(e.target.checked)}
                  style={{ width: "16px", height: "16px" }}
                />
                <label htmlFor="setCurrentCheckbox" style={{ fontSize: "0.85rem", color: "#334155", cursor: "pointer" }}>
                  Set as Current Active Session (atomically unsets previous active session)
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{
                    padding: "0.6rem 1.1rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "white",
                    color: "#475569",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#07172c",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Save Academic Year
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "14px",
              maxWidth: "480px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#0f172a" }}>
              Edit Academic Year
            </h2>

            {editError && (
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "#fef2f2",
                  color: "#991b1b",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Session Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  style={{
                    padding: "0.6rem 1.1rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "white",
                    color: "#475569",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#07172c",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Update Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM SET CURRENT SESSION DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(confirmCurrentTarget)}
        title="Activate Academic Session"
        message={`Are you sure you want to set "${confirmCurrentTarget?.name}" as the active academic session? This will atomically deactivate the previous current session.`}
        confirmText="Activate Session"
        cancelText="Cancel"
        isDestructive={false}
        onConfirm={handleSetCurrent}
        onCancel={() => setConfirmCurrentTarget(null)}
      />
    </div>
  );
}
