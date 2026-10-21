"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  PlusCircle,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Unlink,
  X,
  User,
  History,
} from "lucide-react";
import type { Student, Parent } from "@/lib/supabase/types";
import { linkParentStudent, unlinkParentStudent } from "@/lib/actions/admin-actions";

interface StudentsManagementViewProps {
  initialStudents: any[];
  initialParents: any[];
  initialLinkages: any[];
}

export default function StudentsManagementView({
  initialStudents,
  initialParents,
  initialLinkages,
}: StudentsManagementViewProps) {
  const [students, setStudents] = useState<any[]>(initialStudents);
  const [linkages, setLinkages] = useState<any[]>(initialLinkages);
  const [search, setSearch] = useState("");
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Link Parent Modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [relationship, setRelationship] = useState("father");
  const [isPrimary, setIsPrimary] = useState(true);
  const [canNotify, setCanNotify] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const filteredStudents = students.filter((s) => {
    const term = search.toLowerCase();
    const adm = s.admission_number?.toLowerCase() || "";
    const name = s.profile?.full_name?.toLowerCase() || "";
    return !search || adm.includes(term) || name.includes(term);
  });

  const getStudentParents = (studentId: string) => {
    return linkages.filter((l) => l.student_id === studentId);
  };

  const handleOpenLinkModal = (student: any) => {
    setSelectedStudent(student);
    setSelectedParentId(initialParents[0]?.id || "");
    setRelationship("father");
    setIsPrimary(true);
    setCanNotify(true);
    setModalError(null);
    setShowLinkModal(true);
  };

  const handleExecuteLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedParentId) return;

    setIsSubmitting(true);
    setModalError(null);

    const res = await linkParentStudent({
      studentId: selectedStudent.id,
      parentId: selectedParentId,
      relationship,
      isPrimary,
      canReceiveNotifications: canNotify,
    });

    setIsSubmitting(false);

    if (!res.success) {
      setModalError(res.error || "Failed to link parent.");
    } else {
      setShowLinkModal(false);
      setBannerSuccess(res.message || "Parent-Student relationship established.");
      // Refresh local linkage list
      const parentObj = initialParents.find((p) => p.id === selectedParentId);
      setLinkages([
        ...linkages.filter(
          (l) => !(l.student_id === selectedStudent.id && l.parent_id === selectedParentId)
        ),
        {
          student_id: selectedStudent.id,
          parent_id: selectedParentId,
          relationship,
          is_primary: isPrimary,
          parent: parentObj,
        },
      ]);
    }
  };

  const handleUnlink = async (studentId: string, parentId: string) => {
    if (!confirm("Are you sure you want to remove this parent-student relationship?")) return;

    const res = await unlinkParentStudent(studentId, parentId);
    if (res.success) {
      setLinkages(linkages.filter((l) => !(l.student_id === studentId && l.parent_id === parentId)));
      setBannerSuccess("Relationship successfully removed.");
    } else {
      alert(res.error || "Failed to unlink parent.");
    }
  };

  return (
    <div>
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

      {/* Search Header */}
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
          gap: "1rem",
        }}
      >
        <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
          <Search
            size={16}
            style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search by student name or admission no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: "2.25rem", fontSize: "0.85rem", height: "38px" }}
          />
        </div>

        <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
          Total Registered Students: <strong>{students.length}</strong>
        </div>
      </div>

      {/* Students Table */}
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
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Admission No.</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Student Name</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Linked Parents / Guardians</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>Status</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  No student records found in database. Use User Management to provision new student accounts.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => {
                const pList = getStudentParents(s.id);
                return (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>
                      {s.admission_number || "Awaiting Roll"}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>
                      {s.profile?.full_name || "Unlinked Profile"}
                      {s.profile?.email && (
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                          {s.profile.email}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      {pList.length === 0 ? (
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                          No linked parents
                        </span>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                          {pList.map((l: any, idx: number) => (
                            <span
                              key={idx}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                padding: "0.2rem 0.5rem",
                                borderRadius: "4px",
                                backgroundColor: "rgba(14, 42, 71, 0.08)",
                                color: "var(--color-primary)",
                                fontSize: "0.75rem",
                              }}
                            >
                              <span>
                                {l.parent?.profile?.full_name || "Parent"} ({l.relationship})
                              </span>
                              <button
                                onClick={() => handleUnlink(s.id, l.parent_id)}
                                title="Unlink parent"
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#dc2626",
                                  cursor: "pointer",
                                  padding: 0,
                                }}
                              >
                                &times;
                              </button>
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
                          backgroundColor: s.status === "active" ? "rgba(22, 101, 52, 0.1)" : "rgba(185, 28, 28, 0.1)",
                          color: s.status === "active" ? "var(--color-success)" : "var(--color-error)",
                          textTransform: "capitalize",
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <Link
                          href={`/admin/students/${s.id}`}
                          className="btn btn-outline"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.3rem 0.65rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            textDecoration: "none",
                            color: "#0369a1",
                          }}
                          title="View Academic History Timeline"
                        >
                          <History size={14} /> History
                        </Link>
                        <button
                          onClick={() => handleOpenLinkModal(s)}
                          className="btn btn-outline"
                          style={{ fontSize: "0.75rem", padding: "0.3rem 0.65rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        >
                          <HeartHandshake size={14} /> Link Parent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* LINK PARENT MODAL */}
      {showLinkModal && (
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
              maxWidth: "460px",
              width: "100%",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <HeartHandshake size={20} style={{ color: "var(--color-primary)" }} />
                <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary)", margin: 0, fontWeight: 700 }}>
                  Link Parent to Student
                </h3>
              </div>
              <button
                onClick={() => setShowLinkModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>
              Linking guardian for student: <strong>{selectedStudent?.profile?.full_name || selectedStudent?.admission_number}</strong>
            </p>

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

            <form onSubmit={handleExecuteLink}>
              <div className="form-group">
                <label className="form-label" htmlFor="parentSelect">Select Registered Parent *</label>
                {initialParents.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "#dc2626" }}>
                    No registered parents found in database. Please provision a parent first in User Management.
                  </p>
                ) : (
                  <select
                    id="parentSelect"
                    required
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="form-input"
                  >
                    {initialParents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.profile?.full_name || "Parent"} ({p.profile?.email || "No email"})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="relSelect">Relationship</label>
                <select
                  id="relSelect"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="form-input"
                >
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Legal Guardian</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                  />
                  <span>Designate as primary guardian</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={canNotify}
                    onChange={(e) => setCanNotify(e.target.checked)}
                  />
                  <span>Enable circular / alert notifications</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || initialParents.length === 0}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Linking..." : "Establish Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
