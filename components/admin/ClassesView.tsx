"use client";

import { useEffect, useState, useTransition } from "react";
import {
  School,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Archive,
  RefreshCw,
  Layers,
  Users,
} from "lucide-react";
import {
  getClassesList,
  createClass,
  updateClass,
} from "@/lib/actions/academic-actions";
import ConfirmDialog from "./ConfirmDialog";
import type { ClassRoom } from "@/lib/supabase/types";

interface EnhancedClass extends ClassRoom {
  sectionCount: number;
  activeEnrollmentCount: number;
}

export default function ClassesView() {
  const [classes, setClasses] = useState<EnhancedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formOrder, setFormOrder] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit Modal
  const [editTarget, setEditTarget] = useState<EnhancedClass | null>(null);
  const [editName, setEditName] = useState("");
  const [editOrder, setEditOrder] = useState<number>(0);
  const [editActive, setEditActive] = useState(true);
  const [editError, setEditError] = useState<string | null>(null);

  // Archive Confirm
  const [archiveTarget, setArchiveTarget] = useState<EnhancedClass | null>(null);

  const loadData = () => {
    setLoading(true);
    startTransition(async () => {
      const res = await getClassesList();
      if (res.success && res.classes) {
        setClasses(res.classes as EnhancedClass[]);
        setError(null);
      } else {
        setError(res.error || "Failed to load classes.");
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
      setFormError("Class name is required (e.g., Class 10).");
      return;
    }

    const res = await createClass({
      name: formName.trim(),
      display_order: Number(formOrder) || 0,
      is_active: true,
    });

    if (res.success) {
      setSuccessMsg(`Class "${formName}" created successfully.`);
      setIsCreateModalOpen(false);
      setFormName("");
      setFormOrder(0);
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setFormError(res.error || "Failed to create class.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditError(null);

    if (!editName.trim()) {
      setEditError("Class name cannot be empty.");
      return;
    }

    const res = await updateClass(editTarget.id, {
      name: editName.trim(),
      display_order: Number(editOrder) || 0,
      is_active: editActive,
    });

    if (res.success) {
      setSuccessMsg(`Class updated successfully.`);
      setEditTarget(null);
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setEditError(res.error || "Failed to update class.");
    }
  };

  const handleArchiveToggle = async () => {
    if (!archiveTarget) return;

    const newActiveState = !archiveTarget.is_active;
    const res = await updateClass(archiveTarget.id, {
      is_active: newActiveState,
    });

    if (res.success) {
      setSuccessMsg(
        newActiveState
          ? `Class "${archiveTarget.name}" activated.`
          : `Class "${archiveTarget.name}" archived. Historical records remain intact.`
      );
      setArchiveTarget(null);
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setError(res.error || "Failed to update class status.");
      setArchiveTarget(null);
    }
  };

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
            Class Management
          </h1>
          <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.95rem" }}>
            Maintain institutional class standards. Archiving preserves historical student enrollments.
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
          Add Class
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

      {/* Search & Actions */}
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
            placeholder="Search classes by name (e.g., Class 10)..."
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
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Class Name</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Display Order</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Active Sections</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Active Enrollments</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Status</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    Loading classes...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", backgroundColor: "#f1f5f9", marginBottom: "1rem" }}>
                      <School size={32} color="#94a3b8" />
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.5rem" }}>
                      No classes have been added.
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                      Configure classes (such as Nursery, KG, Class 1 to Class 12) for R.P. Memorial Public School.
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
                      Add First Class
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{c.name}</div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#64748b" }}>
                      {c.display_order}
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#334155" }}>
                        <Layers size={15} color="#9333ea" />
                        <span>{c.sectionCount}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#334155" }}>
                        <Users size={15} color="#059669" />
                        <span>{c.activeEnrollmentCount}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      {c.is_active ? (
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
                            setEditTarget(c);
                            setEditName(c.name);
                            setEditOrder(c.display_order);
                            setEditActive(c.is_active);
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
                          onClick={() => setArchiveTarget(c)}
                          style={{
                            padding: "0.35rem 0.75rem",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: c.is_active ? "#fff1f2" : "#f0fdf4",
                            color: c.is_active ? "#be123c" : "#166534",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          {c.is_active ? "Archive" : "Activate"}
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
              Add New Class
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 1.25rem" }}>
              Specify the class name and order priority for report sorting.
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
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Class 10"
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
                  Display Order
                </label>
                <input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                  }}
                />
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  Lower numbers display first (e.g., Nursery = 0, KG = 1, Class 1 = 2)
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
                  Create Class
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
              Edit Class
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
                  Class Name *
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
                  Display Order
                </label>
                <input
                  type="number"
                  value={editOrder}
                  onChange={(e) => setEditOrder(Number(e.target.value))}
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
                  id="classActiveToggle"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  style={{ width: "16px", height: "16px" }}
                />
                <label htmlFor="classActiveToggle" style={{ fontSize: "0.85rem", color: "#334155", cursor: "pointer" }}>
                  Class is active
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
                  Update Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM ARCHIVE / ACTIVATE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(archiveTarget)}
        title={archiveTarget?.is_active ? "Archive Class" : "Activate Class"}
        message={
          archiveTarget?.is_active
            ? `Are you sure you want to archive "${archiveTarget.name}"? Archiving hides the class from active selections while strictly preserving all historical enrollments.`
            : `Are you sure you want to re-activate "${archiveTarget?.name}"?`
        }
        confirmText={archiveTarget?.is_active ? "Archive Class" : "Activate Class"}
        cancelText="Cancel"
        isDestructive={archiveTarget?.is_active}
        onConfirm={handleArchiveToggle}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  );
}
