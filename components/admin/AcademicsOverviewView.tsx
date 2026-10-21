"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Calendar,
  School,
  Layers,
  BookMarked,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getAcademicDashboardMetrics } from "@/lib/actions/academic-actions";
import type { AcademicYear } from "@/lib/supabase/types";

interface AcademicMetrics {
  currentAcademicYear: AcademicYear | null;
  totalAcademicYears: number;
  activeClasses: number;
  activeSections: number;
  activeSubjects: number;
  studentsWithCurrentEnrollment: number;
  studentsWithoutCurrentEnrollment: number;
  totalActiveStudents: number;
}

export default function AcademicsOverviewView() {
  const [metrics, setMetrics] = useState<AcademicMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    setLoading(true);
    startTransition(async () => {
      const res = await getAcademicDashboardMetrics();
      if (res.success && res.metrics) {
        setMetrics(res.metrics);
        setError(null);
      } else {
        setError(res.error || "Failed to load academic metrics.");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #07172c 0%, #0d2847 100%)",
          borderRadius: "16px",
          padding: "2rem",
          color: "white",
          boxShadow: "0 10px 25px -5px rgba(7, 23, 44, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                backgroundColor: "rgba(217, 119, 6, 0.2)",
                color: "#fbbf24",
                border: "1px solid rgba(251, 191, 36, 0.3)",
                marginBottom: "0.75rem",
              }}
            >
              Academic Control Center
            </span>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              Academic Structure & Enrollment
            </h1>
            <p style={{ margin: "0.5rem 0 0", color: "#94a3b8", fontSize: "0.95rem" }}>
              Manage curriculum foundations, academic cycles, class hierarchies, sections, and official student enrollments.
            </p>
          </div>

          {/* Current Academic Year Indicator */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              minWidth: "220px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <Clock size={16} color="#fbbf24" />
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8" }}>
                Active Session
              </span>
            </div>
            {loading ? (
              <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#cbd5e1" }}>Loading...</div>
            ) : metrics?.currentAcademicYear ? (
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#38bdf8" }}>
                  {metrics.currentAcademicYear.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                  {metrics.currentAcademicYear.start_date || "—"} to {metrics.currentAcademicYear.end_date || "—"}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 600, color: "#f87171" }}>
                  No Active Year
                </div>
                <Link
                  href="/admin/academic-years"
                  style={{ fontSize: "0.75rem", color: "#fbbf24", textDecoration: "underline", marginTop: "0.25rem", display: "inline-block" }}
                >
                  Configure Academic Year →
                </Link>
              </div>
            )}
          </div>
        </div>
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

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {/* Metric 1: Academic Years */}
        <div className="admin-stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>Academic Years</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "#eff6ff", color: "#2563eb" }}>
              <Calendar size={18} />
            </div>
          </div>
          <div className="stat-value">{loading ? "—" : metrics?.totalAcademicYears ?? 0}</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem" }}>
            {metrics?.currentAcademicYear ? "1 active current session" : "No active session set"}
          </div>
        </div>

        {/* Metric 2: Active Classes */}
        <div className="admin-stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>Active Classes</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "#f0fdf4", color: "#16a34a" }}>
              <School size={18} />
            </div>
          </div>
          <div className="stat-value">{loading ? "—" : metrics?.activeClasses ?? 0}</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem" }}>
            Primary through Senior Secondary
          </div>
        </div>

        {/* Metric 3: Active Sections */}
        <div className="admin-stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>Active Sections</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "#faf5ff", color: "#9333ea" }}>
              <Layers size={18} />
            </div>
          </div>
          <div className="stat-value">{loading ? "—" : metrics?.activeSections ?? 0}</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem" }}>
            Assigned across active classes
          </div>
        </div>

        {/* Metric 4: Active Subjects */}
        <div className="admin-stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>Active Subjects</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "#fff7ed", color: "#ea580c" }}>
              <BookMarked size={18} />
            </div>
          </div>
          <div className="stat-value">{loading ? "—" : metrics?.activeSubjects ?? 0}</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem" }}>
            CBSE curriculum catalog
          </div>
        </div>

        {/* Metric 5: Students with Current Enrollment */}
        <div className="admin-stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>Currently Enrolled</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "#ecfdf5", color: "#059669" }}>
              <UserCheck size={18} />
            </div>
          </div>
          <div className="stat-value">{loading ? "—" : metrics?.studentsWithCurrentEnrollment ?? 0}</div>
          <div style={{ fontSize: "0.75rem", color: "#059669", marginTop: "0.5rem" }}>
            Enrolled in active session
          </div>
        </div>

        {/* Metric 6: Students Pending Enrollment */}
        <div className="admin-stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>Awaiting Enrollment</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "#fef2f2", color: "#dc2626" }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="stat-value">{loading ? "—" : metrics?.studentsWithoutCurrentEnrollment ?? 0}</div>
          <div style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: "0.5rem" }}>
            Students not enrolled in active session
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0f172a", marginBottom: "1rem" }}>
          Academic Management Modules
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {/* Card 1: Academic Years */}
          <Link
            href="/admin/academic-years"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              border: "1px solid #e2e8f0",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#eff6ff", color: "#2563eb" }}>
                <Calendar size={22} />
              </div>
              <ArrowRight size={18} color="#94a3b8" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0f172a", margin: "0 0 0.25rem" }}>
                Academic Years
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                Configure school academic sessions, date spans, and set the single active session with atomic DB protection.
              </p>
            </div>
          </Link>

          {/* Card 2: Classes */}
          <Link
            href="/admin/classes"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              border: "1px solid #e2e8f0",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#f0fdf4", color: "#16a34a" }}>
                <School size={22} />
              </div>
              <ArrowRight size={18} color="#94a3b8" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0f172a", margin: "0 0 0.25rem" }}>
                Classes
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                Establish class hierarchy (Nursery to 12th), configure display ordering, and preserve historical enrollments.
              </p>
            </div>
          </Link>

          {/* Card 3: Sections */}
          <Link
            href="/admin/sections"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              border: "1px solid #e2e8f0",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#faf5ff", color: "#9333ea" }}>
                <Layers size={22} />
              </div>
              <ArrowRight size={18} color="#94a3b8" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0f172a", margin: "0 0 0.25rem" }}>
                Sections
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                Organize sections (A, B, C) linked to specific classes with case-insensitive duplication prevention.
              </p>
            </div>
          </Link>

          {/* Card 4: Subjects */}
          <Link
            href="/admin/subjects"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              border: "1px solid #e2e8f0",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#fff7ed", color: "#ea580c" }}>
                <BookMarked size={22} />
              </div>
              <ArrowRight size={18} color="#94a3b8" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0f172a", margin: "0 0 0.25rem" }}>
                Subjects
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                Manage academic curriculum subjects with unique school-scoped course codes and active status management.
              </p>
            </div>
          </Link>

          {/* Card 5: Enrollments */}
          <Link
            href="/admin/enrollments"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              border: "1px solid #e2e8f0",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#ecfdf5", color: "#059669" }}>
                <UserCheck size={22} />
              </div>
              <ArrowRight size={18} color="#94a3b8" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0f172a", margin: "0 0 0.25rem" }}>
                Student Enrollments
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                Enroll students into academic years, classes, and sections with full historical timeline tracking.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
