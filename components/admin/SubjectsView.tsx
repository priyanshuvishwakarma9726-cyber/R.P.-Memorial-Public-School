"use client";

import { useEffect, useState, useTransition } from "react";
import {
  BookMarked,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Hash,
} from "lucide-react";
import {
  getSubjectsList,
  createSubject,
  updateSubject,
} from "@/lib/actions/academic-actions";
import ConfirmDialog from "./ConfirmDialog";
import type { Subject } from "@/lib/supabase/types";

export default function SubjectsView() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Edit Modal
  const [editTarget, setEditTarget] = useState<Subject | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [editError, setEditError] = useState<string | null>(null);

  // Archive Confirm
  const [archiveTarget, setArchiveTarget] = useState<Subject | null>(null);

  const loadData = () => {
    setLoading(true);
    startTransition(async () => {
      const res = await getSubjectsList({
        search: searchTerm,
        status: statusFilter,
      });

      if (res.success && res.subjects) {
        setSubjects(res.subjects);
        setError(null);
      } else {
        setError(res.error || "Failed to load subjects.");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, statusFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Subject name is required (e.g., Mathematics, Science).");
      return;
    }

    const res = await createSubject({
      name: formName.trim(),
      code: formCode.trim() || null,
      is_active: true,
    });

    if (res.success) {
      setSuccessMsg(`Subject "${formName}" added successfully.`);
      setIsCreateModalOpen(false);
      setFormName("");
      setFormCode("");
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setFormError(res.error || "Failed to create subject.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditError(null);

    if (!editName.trim()) {
      setEditError("Subject name cannot be empty.");
      return;
    }

    const res = await updateSubject(editTarget.id, {
      name: editName.trim(),
      code: editCode.trim() || null,
      is_active: editActive,
    });

    if (res.success) {
      setSuccessMsg(`Subject updated successfully.`);
      setEditTarget(null);
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setEditError(res.error || "Failed to update subject.");
    }
  };

  const handleArchiveToggle = async () => {
    if (!archiveTarget) return;

    const newActive = !archiveTarget.is_active;
    const res = await updateSubject(archiveTarget.id, {
      is_active: newActive,
    });

    if (res.success) {
      setSuccessMsg(
        newActive
          ? `Subject "${archiveTarget.name}" activated.`
          : `Subject "${archiveTarget.name}" archived.`
      );
      setArchiveTarget(null);
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setError(res.error || "Failed to update subject status.");
      setArchiveTarget(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
            Subject Catalog
          </h1>
          <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.95rem" }}>
            Curriculum subject catalog for R.P. Memorial Public School.
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
          Add Subject
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

      {/* Search & Filter Bar */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
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
            placeholder="Search subjects by name or course code..."
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "white",
            fontSize: "0.85rem",
            outline: "none",
            color: "#334155",
          }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Archived Only</option>
        </select>

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
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Subject Name</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Subject Code</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Status</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    Loading subjects...
                  </td>
                </tr>
              ) : subjects.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", backgroundColor: "#f1f5f9", marginBottom: "1rem" }}>
                      <BookMarked size={32} color="#94a3b8" />
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.5rem" }}>
                      No subjects have been added.
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                      Database starts with zero subjects until official curriculum subjects are added by administration.
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
                      Add First Subject
                    </button>
                  </td>
                </tr>
              ) : (
                subjects.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{sub.name}</div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#475569" }}>
                      {sub.code ? (
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontWeight: 600,
                            backgroundColor: "#f1f5f9",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                          }}
                        >
                          {sub.code}
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      {sub.is_active ? (
                        <span style={{ color: "#16a34a", fontWeight: 600, fontSize: "0.85rem" }}>
                          Active
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                          Archived
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => {
                            setEditTarget(sub);
                            setEditName(sub.name);
                            setEditCode(sub.code || "");
                            setEditActive(sub.is_active);
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
                        <button
                          onClick={() => setArchiveTarget(sub)}
                          style={{
                            padding: "0.35rem 0.75rem",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: sub.is_active ? "#fff1f2" : "#f0fdf4",
                            color: sub.is_active ? "#be123c" : "#166534",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          {sub.is_active ? "Archive" : "Activate"}
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
              maxWidth: "440px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#0f172a" }}>
              Add New Subject
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 1.25rem" }}>
              Enter official subject name and optional course code.
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
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Mathematics, English Core, Physics"
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

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Subject Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., MATH-041, ENG-301"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                  }}
                />
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  If provided, codes must be unique across the school.
                </span>
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
                  Create Subject
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
              maxWidth: "440px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#0f172a" }}>
              Edit Subject
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
                  Subject Name *
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

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Subject Code
                </label>
                <input
                  type="text"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <input
                  type="checkbox"
                  id="subjectActiveToggle"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  style={{ width: "16px", height: "16px" }}
                />
                <label htmlFor="subjectActiveToggle" style={{ fontSize: "0.85rem", color: "#334155", cursor: "pointer" }}>
                  Subject is active
                </label>
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
                  Update Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM ARCHIVE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(archiveTarget)}
        title={archiveTarget?.is_active ? "Archive Subject" : "Activate Subject"}
        message={
          archiveTarget?.is_active
            ? `Are you sure you want to archive "${archiveTarget.name}"?`
            : `Are you sure you want to re-activate "${archiveTarget?.name}"?`
        }
        confirmText={archiveTarget?.is_active ? "Archive Subject" : "Activate Subject"}
        cancelText="Cancel"
        isDestructive={archiveTarget?.is_active}
        onConfirm={handleArchiveToggle}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  );
}
