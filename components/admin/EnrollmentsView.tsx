"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  UserCheck,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Filter,
  History,
  Edit2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getEnrollmentsList,
  createEnrollment,
  updateEnrollment,
  getAcademicYearsList,
  getClassesList,
  getSectionsList,
} from "@/lib/actions/academic-actions";
import { getStudentsList } from "@/lib/actions/admin-actions";
import ConfirmDialog from "./ConfirmDialog";
import type {
  Enrollment,
  AcademicYear,
  ClassRoom,
  Section,
  Profile,
} from "@/lib/supabase/types";

interface EnhancedEnrollment extends Enrollment {
  student?: {
    id: string;
    admission_number?: string | null;
    profile?: Profile | null;
  } | null;
  academic_year?: AcademicYear | null;
  class?: ClassRoom | null;
  section?: Section | null;
}

interface StudentOption {
  id: string;
  admission_number?: string | null;
  profile?: Profile | null;
}

export default function EnrollmentsView() {
  const [enrollments, setEnrollments] = useState<EnhancedEnrollment[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);

  // Filters
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterSection, setFilterSection] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [formYearId, setFormYearId] = useState("");
  const [formClassId, setFormClassId] = useState("");
  const [formSectionId, setFormSectionId] = useState("");
  const [formRollNumber, setFormRollNumber] = useState("");
  const [formStatus, setFormStatus] = useState<Enrollment["status"]>("active");
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit Modal
  const [editTarget, setEditTarget] = useState<EnhancedEnrollment | null>(null);
  const [editClassId, setEditClassId] = useState("");
  const [editSectionId, setEditSectionId] = useState("");
  const [editRollNumber, setEditRollNumber] = useState("");
  const [editStatus, setEditStatus] = useState<Enrollment["status"]>("active");
  const [editError, setEditError] = useState<string | null>(null);

  // Change confirmation
  const [pendingUpdatePayload, setPendingUpdatePayload] = useState<{
    id: string;
    class_id: string;
    section_id: string | null;
    roll_number: string | null;
    status: Enrollment["status"];
    oldPlacement: string;
    newPlacement: string;
  } | null>(null);

  // Load auxiliary data on mount
  useEffect(() => {
    async function loadAux() {
      const [yearsRes, classesRes, secRes, studentsRes] = await Promise.all([
        getAcademicYearsList(),
        getClassesList(),
        getSectionsList(),
        getStudentsList(),
      ]);

      if (yearsRes.success && yearsRes.academicYears) {
        setAcademicYears(yearsRes.academicYears);
        const curr = yearsRes.academicYears.find((y) => y.is_current);
        if (curr) {
          setFilterYear(curr.id);
          setFormYearId(curr.id);
        } else if (yearsRes.academicYears.length > 0) {
          setFormYearId(yearsRes.academicYears[0].id);
        }
      }

      if (classesRes.success && classesRes.classes) {
        setClasses(classesRes.classes);
        if (classesRes.classes.length > 0) {
          setFormClassId(classesRes.classes[0].id);
        }
      }

      if (secRes.success && secRes.sections) {
        setSections(secRes.sections);
      }

      if (studentsRes.success && studentsRes.students) {
        setStudentOptions(studentsRes.students as StudentOption[]);
      }
    }
    loadAux();
  }, []);

  const loadEnrollments = () => {
    setLoading(true);
    startTransition(async () => {
      const res = await getEnrollmentsList({
        academic_year_id: filterYear,
        class_id: filterClass,
        section_id: filterSection,
        status: filterStatus,
        search: searchTerm,
        page,
        limit: 20,
      });

      if (res.success && res.enrollments) {
        setEnrollments(res.enrollments as EnhancedEnrollment[]);
        setTotalCount(res.totalCount || 0);
        setError(null);
      } else {
        setError(res.error || "Failed to load student enrollments.");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadEnrollments();
  }, [filterYear, filterClass, filterSection, filterStatus, searchTerm, page]);

  // Dynamic sections matching form selection
  const formMatchingSections = sections.filter(
    (s) => s.class_id === formClassId && s.is_active
  );

  const editMatchingSections = sections.filter(
    (s) => s.class_id === editClassId && s.is_active
  );

  // Filter students for creation
  const filteredStudents = studentOptions.filter((s) => {
    const q = studentSearch.toLowerCase();
    const adm = (s.admission_number || "").toLowerCase();
    const name = (s.profile?.full_name || "").toLowerCase();
    return adm.includes(q) || name.includes(q);
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!selectedStudentId) {
      setCreateError("Please select a student to enroll.");
      return;
    }
    if (!formYearId) {
      setCreateError("Please select an academic year.");
      return;
    }
    if (!formClassId) {
      setCreateError("Please select a class.");
      return;
    }

    const res = await createEnrollment({
      student_id: selectedStudentId,
      academic_year_id: formYearId,
      class_id: formClassId,
      section_id: formSectionId || null,
      roll_number: formRollNumber.trim() || null,
      status: formStatus,
    });

    if (res.success) {
      setSuccessMsg("Student enrolled successfully.");
      setIsCreateOpen(false);
      setSelectedStudentId("");
      setStudentSearch("");
      setFormRollNumber("");
      loadEnrollments();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setCreateError(res.error || "Failed to create enrollment.");
    }
  };

  const handleEditInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    const oldClassName = editTarget.class?.name || "Unassigned";
    const oldSectionName = editTarget.section?.name || "None";
    const targetClass = classes.find((c) => c.id === editClassId);
    const targetSec = sections.find((s) => s.id === editSectionId);
    const newClassName = targetClass?.name || oldClassName;
    const newSectionName = targetSec?.name || "None";

    const isPlacementChanged =
      editTarget.class_id !== editClassId ||
      (editTarget.section_id || "") !== (editSectionId || "");

    const payload = {
      id: editTarget.id,
      class_id: editClassId,
      section_id: editSectionId || null,
      roll_number: editRollNumber.trim() || null,
      status: editStatus,
      oldPlacement: `${oldClassName} - Sec ${oldSectionName}`,
      newPlacement: `${newClassName} - Sec ${newSectionName}`,
    };

    if (isPlacementChanged) {
      // Prompt confirmation dialog
      setPendingUpdatePayload(payload);
    } else {
      executeEnrollmentUpdate(payload);
    }
  };

  const executeEnrollmentUpdate = async (payload: {
    id: string;
    class_id: string;
    section_id: string | null;
    roll_number: string | null;
    status: Enrollment["status"];
  }) => {
    const res = await updateEnrollment(payload.id, {
      class_id: payload.class_id,
      section_id: payload.section_id,
      roll_number: payload.roll_number,
      status: payload.status,
    });

    if (res.success) {
      setSuccessMsg("Enrollment record updated successfully.");
      setEditTarget(null);
      setPendingUpdatePayload(null);
      loadEnrollments();
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setEditError(res.error || "Failed to update enrollment.");
      setPendingUpdatePayload(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
            Student Enrollments
          </h1>
          <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.95rem" }}>
            Assign students to academic sessions, classes, and sections with full historical records.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateError(null);
            setIsCreateOpen(true);
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
          New Enrollment
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

      {/* Filters Bar */}
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
            placeholder="Search student name or admission number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
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

        {/* Academic Year Filter */}
        <select
          value={filterYear}
          onChange={(e) => {
            setFilterYear(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "0.6rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "white",
            fontSize: "0.85rem",
            color: "#334155",
          }}
        >
          <option value="all">All Academic Years</option>
          {academicYears.map((ay) => (
            <option key={ay.id} value={ay.id}>
              {ay.name} {ay.is_current ? "(Current)" : ""}
            </option>
          ))}
        </select>

        {/* Class Filter */}
        <select
          value={filterClass}
          onChange={(e) => {
            setFilterClass(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "0.6rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "white",
            fontSize: "0.85rem",
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

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "0.6rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "white",
            fontSize: "0.85rem",
            color: "#334155",
          }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="withdrawn">Withdrawn</option>
          <option value="promoted">Promoted</option>
        </select>

        <button
          onClick={loadEnrollments}
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
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Student</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Adm. No</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Session</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Class & Section</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Roll No</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569" }}>Status</th>
                <th style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#475569", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    Loading enrollments...
                  </td>
                </tr>
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", backgroundColor: "#f1f5f9", marginBottom: "1rem" }}>
                      <UserCheck size={32} color="#94a3b8" />
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.5rem" }}>
                      No student enrollments found.
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                      Enroll students into active classes and sections to begin maintaining official academic records.
                    </p>
                    <button
                      onClick={() => setIsCreateOpen(true)}
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
                      Enroll First Student
                    </button>
                  </td>
                </tr>
              ) : (
                enrollments.map((enr) => (
                  <tr key={enr.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>
                        {enr.student?.profile?.full_name || "Student"}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#475569" }}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 600,
                          backgroundColor: "#f1f5f9",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {enr.student?.admission_number || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#334155" }}>
                      {enr.academic_year?.name || "—"}
                      {enr.academic_year?.is_current && (
                        <span style={{ fontSize: "0.75rem", color: "#16a34a", marginLeft: "0.35rem" }}>
                          (Current)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#0f172a", fontWeight: 500 }}>
                      {enr.class?.name || "—"}
                      {enr.section && (
                        <span style={{ color: "#64748b", marginLeft: "0.35rem" }}>
                          — Sec {enr.section.name}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#475569" }}>
                      {enr.roll_number || <span style={{ color: "#94a3b8" }}>—</span>}
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "999px",
                          backgroundColor:
                            enr.status === "active"
                              ? "#dcfce7"
                              : enr.status === "completed"
                              ? "#e0e7ff"
                              : enr.status === "promoted"
                              ? "#fef3c7"
                              : "#f1f5f9",
                          color:
                            enr.status === "active"
                              ? "#15803d"
                              : enr.status === "completed"
                              ? "#3730a3"
                              : enr.status === "promoted"
                              ? "#b45309"
                              : "#64748b",
                        }}
                      >
                        {enr.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <Link
                          href={`/admin/students/${enr.student_id}`}
                          title="View academic history"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            padding: "0.35rem 0.65rem",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: "white",
                            color: "#0369a1",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            textDecoration: "none",
                          }}
                        >
                          <History size={14} />
                          History
                        </Link>
                        <button
                          onClick={() => {
                            setEditTarget(enr);
                            setEditClassId(enr.class_id);
                            setEditSectionId(enr.section_id || "");
                            setEditRollNumber(enr.roll_number || "");
                            setEditStatus(enr.status);
                            setEditError(null);
                          }}
                          style={{
                            padding: "0.35rem 0.65rem",
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

        {/* Pagination footer */}
        {totalCount > 20 && (
          <div
            style={{
              padding: "0.75rem 1.25rem",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.85rem",
              color: "#64748b",
            }}
          >
            <span>
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, totalCount)} of {totalCount} records
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding: "0.35rem 0.65rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page * 20 >= totalCount}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "0.35rem 0.65rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  cursor: page * 20 >= totalCount ? "not-allowed" : "pointer",
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE ENROLLMENT MODAL */}
      {isCreateOpen && (
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
              maxWidth: "500px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#0f172a" }}>
              Enroll Student
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 1.25rem" }}>
              Assign a student to an academic year session, class, and section. Duplicate session enrollments are blocked.
            </p>

            {createError && (
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
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Student Picker */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Select Student *
                </label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="">Choose a student...</option>
                  {studentOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.profile?.full_name || "Unknown"} (Adm: {s.admission_number || "None"})
                    </option>
                  ))}
                </select>
                {studentOptions.length === 0 && (
                  <span style={{ fontSize: "0.75rem", color: "#b91c1c", marginTop: "0.25rem", display: "block" }}>
                    No students currently found in database. Create students in User/Student Management first.
                  </span>
                )}
              </div>

              {/* Academic Year Picker */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Academic Session *
                </label>
                <select
                  required
                  value={formYearId}
                  onChange={(e) => setFormYearId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="">Select session...</option>
                  {academicYears.map((ay) => (
                    <option key={ay.id} value={ay.id}>
                      {ay.name} {ay.is_current ? "★ Current Active Session" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Picker */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Class *
                </label>
                <select
                  required
                  value={formClassId}
                  onChange={(e) => {
                    setFormClassId(e.target.value);
                    setFormSectionId(""); // Reset section when class changes
                  }}
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

              {/* Dynamic Section Picker (Bound to selected Class) */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Section (Optional)
                </label>
                <select
                  value={formSectionId}
                  onChange={(e) => setFormSectionId(e.target.value)}
                  disabled={!formClassId || formMatchingSections.length === 0}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    backgroundColor: formMatchingSections.length === 0 ? "#f8fafc" : "white",
                  }}
                >
                  <option value="">No section / unassigned</option>
                  {formMatchingSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name}
                    </option>
                  ))}
                </select>
                {formClassId && formMatchingSections.length === 0 && (
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.25rem", display: "block" }}>
                    No active sections configured for this class yet.
                  </span>
                )}
              </div>

              {/* Roll Number */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Roll Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 01, 24"
                  value={formRollNumber}
                  onChange={(e) => setFormRollNumber(e.target.value)}
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
                  onClick={() => setIsCreateOpen(false)}
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
                  disabled={!selectedStudentId}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#07172c",
                    color: "white",
                    fontWeight: 600,
                    cursor: !selectedStudentId ? "not-allowed" : "pointer",
                  }}
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ENROLLMENT MODAL */}
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
              maxWidth: "500px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#0f172a" }}>
              Edit Enrollment
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 1.25rem" }}>
              Update class or section assignment for{" "}
              <strong>{editTarget.student?.profile?.full_name || "Student"}</strong>.
            </p>

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

            <form onSubmit={handleEditInitiate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Class *
                </label>
                <select
                  required
                  value={editClassId}
                  onChange={(e) => {
                    setEditClassId(e.target.value);
                    setEditSectionId("");
                  }}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    backgroundColor: "white",
                  }}
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Section
                </label>
                <select
                  value={editSectionId}
                  onChange={(e) => setEditSectionId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="">No section</option>
                  {editMatchingSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Roll Number
                </label>
                <input
                  type="text"
                  value={editRollNumber}
                  onChange={(e) => setEditRollNumber(e.target.value)}
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
                  Enrollment Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Enrollment["status"])}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="withdrawn">Withdrawn</option>
                  <option value="promoted">Promoted</option>
                </select>
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG FOR PLACEMENT CHANGES */}
      <ConfirmDialog
        isOpen={Boolean(pendingUpdatePayload)}
        title="Confirm Academic Placement Change"
        message={`Are you sure you want to change student placement from "${pendingUpdatePayload?.oldPlacement}" to "${pendingUpdatePayload?.newPlacement}"? This will materially modify the student's active academic assignment.`}
        confirmText="Confirm Placement Change"
        cancelText="Cancel"
        isDestructive={false}
        onConfirm={() => {
          if (pendingUpdatePayload) {
            executeEnrollmentUpdate(pendingUpdatePayload);
          }
        }}
        onCancel={() => setPendingUpdatePayload(null)}
      />
    </div>
  );
}
