import Link from "next/link";
import { BookOpen, CheckCircle2, ArrowRight, Award, Compass, Sparkles } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export default function AcademicsPreview() {
  const academicLevels = [
    {
      level: "Primary School",
      grades: "Classes I – V",
      focus: "Foundational Literacy, Numeracy & Environmental Awareness",
      desc: "Structured cognitive development, activity-based experiential learning, foundational science and communicative language skills.",
    },
    {
      level: "Middle School",
      grades: "Classes VI – VIII",
      focus: "Conceptual Inquiry, Laboratory Exploration & Discipline",
      desc: "Introduction to specialized sciences, mathematics, social studies, information technology, and language enrichment programs.",
    },
    {
      level: "Secondary School",
      grades: "Classes IX – X",
      focus: "CBSE Board Curriculum, Analytical Mastery & Assessment",
      desc: "Comprehensive preparation under Central Board of Secondary Education norms, regular periodic assessments, and laboratory practicals.",
    },
  ];

  return (
    <section className="section" style={{ backgroundColor: "var(--color-surface-alt)" }}>
      <div className="container">
        <SectionHeader
          tag="Curriculum Framework"
          title="Academic Programs & Pedagogy"
          description="Aligned with CBSE regulations to nurture analytical thinking, character, and discipline."
        />

        <div className="grid-3" style={{ marginBottom: "2.5rem" }}>
          {academicLevels.map((item, idx) => (
            <div
              key={idx}
              className="card card-accent-top"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--color-gold-dark)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {item.grades}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      backgroundColor: "rgba(14, 42, 71, 0.08)",
                      color: "var(--color-primary)",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: 600,
                    }}
                  >
                    CBSE Aligned
                  </span>
                </div>

                <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "0.35rem" }}>
                  {item.level}
                </h3>

                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "0.75rem" }}>
                  {item.focus}
                </p>

                <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>

              <div style={{ paddingTop: "1.25rem", borderTop: "1px solid var(--color-border-light)", marginTop: "1.5rem" }}>
                <Link
                  href="/academics"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                  }}
                >
                  <span>Explore Curriculum</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Academic Ratio Banner */}
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.25rem",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-gold-subtle)",
                color: "var(--color-gold-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Award size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: "1rem", color: "var(--color-primary)", marginBottom: "0.15rem" }}>
                Verified Teacher-Section Allocation Ratio: <strong>{SCHOOL_INFO.academicsData.teacherSectionRatio}</strong>
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0 }}>
                Includes designated Special Educator &amp; Student Wellness Counsellor on staff.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/academics" className="btn btn-outline btn-sm">
              Academic Details
            </Link>
            <Link href="/results" className="btn btn-primary btn-sm">
              Results &amp; Academics
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
