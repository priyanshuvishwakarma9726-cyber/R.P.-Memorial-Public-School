"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowLeft,
  Calendar,
  School,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Hash,
} from "lucide-react";
import { getStudentAcademicHistory } from "@/lib/actions/academic-actions";
import type { Enrollment, AcademicYear, ClassRoom, Section, Profile } from "@/lib/supabase/types";

interface StudentHistoryProps {
  studentId: string;
}

interface HistoricalItem extends Enrollment {
  academic_year: AcademicYear | null;
  class: ClassRoom | null;
  section: Section | null;
}

export default function StudentHistoryView({ studentId }: StudentHistoryProps) {
  const [student, setStudent] = useState<{
    id: string;
    admission_number: string | null;
    status: string;
    profile: Profile | null;
  } | null>(null);
  const [history, setHistory] = useState<HistoricalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLoading(true);
    startTransition(async () => {
      const res = await getStudentAcademicHistory(studentId);
      if (res.success && res.student) {
        setStudent(res.student);
        setHistory((res.history || []) as HistoricalItem[]);
        setError(null);
      } else {
        setError(res.error || "Failed to load student academic history.");
      }
      setLoading(false);
    });
  }, [studentId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Back button */}
      <div>
        <Link
          href="/admin/students"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#64748b",
            fontSize: "0.85rem",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          Back to Students Directory
        </Link>
      </div>

      {error && (
        <div
          style={{
            padding: "1rem",
            borderRadius: "8px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
          Loading student history...
        </div>
      ) : student ? (
        <>
          {/* Student Profile Card */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "1.75rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#07172c",
                  color: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                {student.profile?.full_name ? student.profile.full_name[0].toUpperCase() : "S"}
              </div>
              <div>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                  {student.profile?.full_name || "Student"}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.35rem", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontWeight: 600,
                      backgroundColor: "#f1f5f9",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      color: "#334155",
                    }}
                  >
                    Adm: {student.admission_number || "Not assigned"}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      padding: "0.15rem 0.55rem",
                      borderRadius: "999px",
                      backgroundColor: student.status === "active" ? "#dcfce7" : "#f1f5f9",
                      color: student.status === "active" ? "#166534" : "#64748b",
                    }}
                  >
                    {student.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", color: "#64748b" }}>
              {student.profile?.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Mail size={15} />
                  <span>{student.profile.email}</span>
                </div>
              )}
              {student.profile?.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Phone size={15} />
                  <span>{student.profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Academic History Timeline */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "1.75rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                Academic Enrollment History
              </h2>
              <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                Complete chronological timeline of academic sessions, class progression, and section placements.
              </p>
            </div>

            {history.length === 0 ? (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
                <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", backgroundColor: "#f1f5f9", marginBottom: "1rem" }}>
                  <Calendar size={28} color="#94a3b8" />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.5rem" }}>
                  No enrollment records found.
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.85rem", maxWidth: "380px", margin: "0 auto 1.25rem" }}>
                  This student has not yet been assigned to an academic session.
                </p>
                <Link
                  href="/admin/enrollments"
                  style={{
                    backgroundColor: "#07172c",
                    color: "white",
                    padding: "0.55rem 1.1rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  Create Enrollment
                </Link>
              </div>
            ) : (
              <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
                {/* Timeline vertical bar */}
                <div
                  style={{
                    position: "absolute",
                    left: "8px",
                    top: "12px",
                    bottom: "12px",
                    width: "2px",
                    backgroundColor: "#e2e8f0",
                  }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {history.map((item, idx) => (
                    <div key={item.id} style={{ position: "relative" }}>
                      {/* Timeline dot */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-1.5rem",
                          top: "4px",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          backgroundColor: idx === 0 ? "#2563eb" : "#cbd5e1",
                          border: "3px solid white",
                          boxShadow: "0 0 0 1px #e2e8f0",
                        }}
                      />

                      {/* Content Card */}
                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          borderRadius: "10px",
                          padding: "1.25rem",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                                {item.academic_year?.name || "Session"}
                              </span>
                              {item.academic_year?.is_current && (
                                <span
                                  style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    padding: "0.1rem 0.45rem",
                                    borderRadius: "999px",
                                    backgroundColor: "#bbf7d0",
                                    color: "#166534",
                                  }}
                                >
                                  Current Session
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#475569", marginTop: "0.25rem" }}>
                              {item.class?.name || "Class"}
                              {item.section && ` — Section ${item.section.name}`}
                            </div>
                          </div>

                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              padding: "0.2rem 0.5rem",
                              borderRadius: "999px",
                              backgroundColor: item.status === "active" ? "#dcfce7" : "#f1f5f9",
                              color: item.status === "active" ? "#166534" : "#64748b",
                            }}
                          >
                            {item.status.toUpperCase()}
                          </span>
                        </div>

                        <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem", fontSize: "0.8rem", color: "#64748b" }}>
                          {item.roll_number && (
                            <div>
                              <strong style={{ color: "#475569" }}>Roll No:</strong> {item.roll_number}
                            </div>
                          )}
                          <div>
                            <strong style={{ color: "#475569" }}>Enrolled on:</strong>{" "}
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
