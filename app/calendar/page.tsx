"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  BookOpen,
  Award,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import EmptyState from "@/components/shared/EmptyState";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export default function CalendarPage() {
  const [selectedTerm, setSelectedTerm] = useState("Term 1");

  const terms = [
    {
      id: "Term 1",
      name: "First Academic Term (April – September)",
      events: [
        { title: "Commencement of Academic Session", type: "Academic", timing: "Beginning of Session", note: "Standard CBSE Term Onset" },
        { title: "Periodic Assessment 1 Cycle", type: "Examination", timing: "Mid-Term Assessment", note: "Classes I – X" },
        { title: "Independence Day Observance", type: "National Celebration", timing: "August National Day", note: "Campus Ceremony" },
        { title: "Parent-Teacher Consultation (PTM)", type: "PTM", timing: "Quarterly Session", note: "Evaluation Review" },
        { title: "Mid-Term Summative Assessment", type: "Examination", timing: "September Term End", note: "Half-Yearly Evaluations" },
      ],
    },
    {
      id: "Term 2",
      name: "Second Academic Term (October – March)",
      events: [
        { title: "Resumption of Second Term Classes", type: "Academic", timing: "Post-Autumn Cycle", note: "Syllabus Progression" },
        { title: "Annual Athletic & Sports Day", type: "Co-Curricular", timing: "Winter Term", note: "Track & Field Meets" },
        { title: "Science & Mathematics Exhibition", type: "Academic", timing: "Mid-Winter", note: "Laboratory Showcase" },
        { title: "Republic Day Observance", type: "National Celebration", timing: "January National Day", note: "Flag Hoisting & March" },
        { title: "CBSE Pre-Board & Annual Examinations", type: "Examination", timing: "February / March", note: "Annual Board Cycles" },
      ],
    },
  ];

  const currentTermData = terms.find((t) => t.id === selectedTerm) || terms[0];

  return (
    <>
      <PageHeader
        title="Annual School Calendar"
        subtitle="Curricular milestones, examination windows, and institutional activities."
        badge="Session Framework"
        breadcrumbs={[{ label: "Calendar" }]}
      />

      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <SectionHeader
            tag="Academic Schedules"
            title="Institutional Term & Examination Calendar"
            description="Preview of annual term cycles adhering to CBSE calendar regulations."
          />

          {/* Integrity Disclaimer */}
          <div
            style={{
              backgroundColor: "var(--color-surface-alt)",
              border: "1px solid var(--color-border)",
              borderLeft: "4px solid var(--color-gold)",
              borderRadius: "var(--radius-md)",
              padding: "1rem 1.25rem",
              marginBottom: "2.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <Info size={18} style={{ color: "var(--color-gold-dark)", flexShrink: 0 }} />
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
              <strong>Calendar Data State:</strong> Below is a structural outline of standard institutional term phases. Precise calendar dates for exams, vacations, and PTMs are published by school administration at session commencement.
            </div>
          </div>

          {/* Term Switcher */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.75rem",
              marginBottom: "2.5rem",
            }}
          >
            {terms.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTerm(t.id)}
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid",
                  backgroundColor: selectedTerm === t.id ? "var(--color-primary)" : "var(--color-surface)",
                  color: selectedTerm === t.id ? "#ffffff" : "var(--color-primary)",
                  borderColor: selectedTerm === t.id ? "var(--color-primary)" : "var(--color-border)",
                  transition: "all var(--transition-fast)",
                }}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Term Events Outline */}
          <div
            style={{
              maxWidth: "880px",
              margin: "0 auto 3.5rem auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {currentTermData.events.map((evt, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  padding: "1.25rem 1.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      width: "2.75rem",
                      height: "2.75rem",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: evt.type === "Examination"
                        ? "rgba(225, 29, 72, 0.08)"
                        : "rgba(14, 42, 71, 0.06)",
                      color: evt.type === "Examination" ? "#e11d48" : "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CalendarIcon size={20} />
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          backgroundColor: "var(--color-surface-alt)",
                          color: "var(--color-gold-dark)",
                          padding: "0.1rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          textTransform: "uppercase",
                        }}
                      >
                        {evt.type}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {evt.note}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.05rem", color: "var(--color-primary)", margin: "0.2rem 0 0 0" }}>
                      {evt.title}
                    </h3>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "var(--color-surface-alt)",
                    padding: "0.35rem 0.85rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {evt.timing}
                </div>
              </div>
            ))}
          </div>

          {/* Download Academic Calendar Empty State */}
          <EmptyState
            title="Detailed Gazetted Calendar PDF"
            description="The administrative department uploads the certified session academic calendar with day-by-day dates prior to term reopening."
            note="Visit Download Center to check for future calendar releases"
          />
        </div>
      </section>
    </>
  );
}
