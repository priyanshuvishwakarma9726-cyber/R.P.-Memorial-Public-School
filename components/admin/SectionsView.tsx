"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Users,
  Filter,
} from "lucide-react";
import {
  getSectionsList,
  createSection,
  updateSection,
  getClassesList,
} from "@/lib/actions/academic-actions";
import ConfirmDialog from "./ConfirmDialog";
import type { Section, ClassRoom } from "@/lib/supabase/types";

interface EnhancedSection extends Section {
  class?: ClassRoom | null;
  activeEnrollmentCount: number;
}

export default function SectionsView() {
  const [sections, setSections] = useState<EnhancedSection[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formClassId, setFormClassId] = useState("");
  const [formName, setFormName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Edit Modal
  const [editTarget, setEditTarget] = useState<EnhancedSection | null>(null);
  const [editName, setEditName] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [editError, setEditError] = useState<string | null>(null);

  // Archive Confirm
  const [archiveTarget, setArchiveTarget] = useState<EnhancedSection | null>(null);

  const loadData = () => {
    setLoading(true);
    startTransition(async () => {
      const [secRes, classRes] = await Promise.all([
        getSectionsList({ class_id: selectedClassId }),
        getClassesList(),
      ]);

      if (secRes.success && secRes.sections) {
        setSections(secRes.sections as EnhancedSection[]);
        setError(null);
      } else {
        setError(secRes.error || "Failed to load sections.");
      }

      if (classRes.success && classRes.classes) {
        setClasses(classRes.classes);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [selectedClassId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formClassId) {
      setFormError("Please select a class for this section.");
      return;
    }

    if (!formName.trim()) {
      setFormError("Section name is required (e.g., A, B, Rose).");
      return;
    }

    const res = await createSection({
      class_id: formClassId,
      name: formName.trim(),
      is_active: true,
    });

    if (res.success) {
      setSuccessMsg(`Section "${formName}" created successfully.`);
      setIsCreateModalOpen(false);
      setFormName("");
      setFormClassId("");
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setFormError(res.error || "Failed to create section.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditError(null);

    if (!editName.trim()) {
      setEditError("Section name cannot be empty.");
      return;
    }

    const res = await updateSection(editTarget.id, {
      name: editName.trim(),
      is_active: editActive,
    });

    if (res.success) {
      setSuccessMsg(`Section updated successfully.`);
      setEditTarget(null);
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setEditError(res.error || "Failed to update section.");
    }
  };

  const handleArchiveToggle = async () => {
    if (!archiveTarget) return;

    const newActive = !archiveTarget.is_active;
    const res = await updateSection(archiveTarget.id, {
      is_active: newActive,
    });

    if (res.success) {
      setSuccessMsg(
        newActive
          ? `Section "${archiveTarget.name}" activated.`
          : `Section "${archiveTarget.name}" archived.`
      );
      setArchiveTarget(null);
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setError(res.error || "Failed to update section status.");
      setArchiveTarget(null);
    }
  };

  const filtered = sections.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.class?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
            Section Management
          </h1>
          <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.95rem" }}>
            Configure class sections with database-enforced case-insensitive uniqueness.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            if (classes.length > 0 && !formClassId) {
              setFormClassId(classes[0].id);
            }
            setIsCreateModalOpen(true);
          }}
          disabled={classes.length === 0}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: classes.length === 0 ? "#94a3b8" : "#07172c",
            color: "white",
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: classes.length === 0 ? "not-allowed" : "pointer",
            boxShadow: "0 2px 4px rgba(7, 23, 44, 0.15)",
          }}
        >
          <Plus size={18} />
          Add Section
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

      {/* Filter & Search Bar */}
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
            placeholder="Search sections or class..."
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

        {/* Class Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={16} color="#64748b" />
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
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
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Section</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Class</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Active Enrollments</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Status</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    Loading sections...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", backgroundColor: "#f1f5f9", marginBottom: "1rem" }}>
                      <Layers size={32} color="#94a3b8" />
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.5rem" }}>
                      No sections found.
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                      {classes.length === 0
                        ? "Please add a class first before creating sections."
                        : "Create sections (e.g., Section A, B, C) linked to active classes."}
                    </p>
                    {classes.length > 0 && (
                      <button
                        onClick={() => {
                          setFormClassId(classes[0].id);
                          setIsCreateModalOpen(true);
                        }}
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
                        Add First Section
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>Section {s.name}</div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#334155" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "6px",
                          backgroundColor: "#eff6ff",
                          color: "#1d4ed8",
                          fontWeight: 500,
                          fontSize: "0.8rem",
                        }}
                      >
                        {s.class?.name || "Unassigned"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#334155" }}>
                        <Users size={15} color="#059669" />
                        <span>{s.activeEnrollmentCount}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      {s.is_active ? (
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
                            setEditTarget(s);
                            setEditName(s.name);
                            setEditActive(s.is_active);
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
                          onClick={() => setArchiveTarget(s)}
                          style={{
                            padding: "0.35rem 0.75rem",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: s.is_active ? "#fff1f2" : "#f0fdf4",
                            color: s.is_active ? "#be123c" : "#166534",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          {s.is_active ? "Archive" : "Activate"}
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
              Add New Section
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 1.25rem" }}>
              Assign a section to a class. Duplicate names (case-insensitive) are rejected by the database.
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
                  Class *
                </label>
                <select
                  required
                  value={formClassId}
                  onChange={(e) => setFormClassId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="">Select Class...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Section Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., A, B, or Lotus"
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
                  Create Section
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
              Edit Section
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
                  Class
                </label>
                <input
                  type="text"
                  disabled
                  value={editTarget.class?.name || "Class"}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    fontSize: "0.9rem",
                    color: "#64748b",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Section Name *
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

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <input
                  type="checkbox"
                  id="sectionActiveToggle"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  style={{ width: "16px", height: "16px" }}
                />
                <label htmlFor="sectionActiveToggle" style={{ fontSize: "0.85rem", color: "#334155", cursor: "pointer" }}>
                  Section is active
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
                  Update Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM ARCHIVE / ACTIVATE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(archiveTarget)}
        title={archiveTarget?.is_active ? "Archive Section" : "Activate Section"}
        message={
          archiveTarget?.is_active
            ? `Are you sure you want to archive Section "${archiveTarget.name}"? Historical student enrollments will remain strictly preserved.`
            : `Are you sure you want to re-activate Section "${archiveTarget?.name}"?`
        }
        confirmText={archiveTarget?.is_active ? "Archive Section" : "Activate Section"}
        cancelText="Cancel"
        isDestructive={archiveTarget?.is_active}
        onConfirm={handleArchiveToggle}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  );
}
