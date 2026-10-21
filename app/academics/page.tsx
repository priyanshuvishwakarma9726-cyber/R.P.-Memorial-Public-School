import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  FileText,
  Users,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import EmptyState from "@/components/shared/EmptyState";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export const metadata: Metadata = {
  title: "Academics",
  description: `CBSE curriculum structure, examination assessment framework, and academic governance at ${SCHOOL_INFO.name}.`,
};

export default function AcademicsPage() {
  return (
    <>
      <PageHeader
        title="Academic Programs & Curriculum"
        subtitle="CBSE curriculum alignment, examination frameworks, and institutional governance at R.P. Memorial Public School."
        badge="Academic Structure"
        breadcrumbs={[{ label: "Academics" }]}
      />

      {/* Overview & Ratio Banner */}
      <section className="section" style={{ backgroundColor: "var(--color-surface)", paddingBottom: "2rem" }}>
        <div className="container">
          <div
            style={{
              backgroundColor: "var(--color-surface-alt)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border)",
              padding: "2.5rem",
              marginBottom: "3.5rem",
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2rem",
            }}
            className="academic-intro-grid"
          >
            <div>
              <span
                style={{
                  color: "var(--color-gold-dark)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.4rem",
                  display: "inline-block",
                }}
              >
                CBSE Alignment
              </span>
              <h2 style={{ fontSize: "1.75rem", color: "var(--color-primary)", marginBottom: "0.75rem" }}>
                Comprehensive Secondary Education
              </h2>
              <p style={{ fontSize: "1rem", color: "var(--color-text-secondary)", lineHeight: 1.65, margin: 0 }}>
                {SCHOOL_INFO.name} delivers education adhering to the Central Board of Secondary Education (CBSE) syllabus. The instructional model emphasizes regular classroom participation, practical scientific experiments in our 6 laboratories, and continuous periodic evaluation.
              </p>
            </div>

            {/* Verified Statistics Box */}
            <div
              style={{
                backgroundColor: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                border: "1px solid var(--color-border)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle2 size={18} style={{ color: "var(--color-success)" }} />
                <span style={{ fontSize: "0.9rem", color: "var(--color-text-primary)" }}>
                  Teacher-Section Ratio: <strong>{SCHOOL_INFO.academicsData.teacherSectionRatio}</strong>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle2 size={18} style={{ color: "var(--color-success)" }} />
                <span style={{ fontSize: "0.9rem", color: "var(--color-text-primary)" }}>
                  Special Educator: <strong>{SCHOOL_INFO.academicsData.specialEducator} Verified Staff</strong>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle2 size={18} style={{ color: "var(--color-success)" }} />
                <span style={{ fontSize: "0.9rem", color: "var(--color-text-primary)" }}>
                  Student Wellness Counsellor: <strong>{SCHOOL_INFO.academicsData.wellnessTeacher} Verified Staff</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Academic Stages UI */}
          <SectionHeader
            tag="Academic Levels"
            title="Class Groupings & Curricular Focus"
            description="Progressive learning stages designed to build conceptual mastery from primary through secondary classes."
          />

          <div className="grid-3" style={{ marginBottom: "3.5rem" }}>
            <div className="card card-accent-top">
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-gold-dark)", textTransform: "uppercase" }}>
                Classes I – V
              </span>
              <h3 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginTop: "0.25rem", marginBottom: "0.5rem" }}>
                Primary Wing
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
                Core focus on language mastery (Hindi &amp; English), basic numeracy, environmental studies, art, and values-based social habits.
              </p>
              <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "0.75rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                Core subjects: English, Hindi, Mathematics, EVS, General Knowledge.
              </div>
            </div>

            <div className="card card-accent-top">
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-gold-dark)", textTransform: "uppercase" }}>
                Classes VI – VIII
              </span>
              <h3 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginTop: "0.25rem", marginBottom: "0.5rem" }}>
                Middle Wing
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
                Disciplined transition to separated sciences (Physics, Chemistry, Biology), social studies, third language, and computer science fundamentals.
              </p>
              <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "0.75rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                Core subjects: Science, Mathematics, Social Science, Hindi, English, Sanskrit, IT.
              </div>
            </div>

            <div className="card card-accent-top">
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-gold-dark)", textTransform: "uppercase" }}>
                Classes IX – X
              </span>
              <h3 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginTop: "0.25rem", marginBottom: "0.5rem" }}>
                Secondary Wing
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
                Rigorous preparation under CBSE secondary board requirements, structured laboratory sessions, periodic unit assessments, and pre-board examinations.
              </p>
              <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "0.75rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                Core subjects: English, Hindi, Mathematics, Science, Social Science, Information Technology.
              </div>
            </div>
          </div>
        </div>

        
      </section>

      {/* Examination & Assessment Section */}
      <section className="section" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="container">
          <SectionHeader
            tag="Evaluations"
            title="Examination & Assessment System"
            description="Evaluation cycles conducted in accordance with Central Board of Secondary Education guidelines."
          />

          <div className="grid-2" style={{ maxWidth: "960px", margin: "0 auto 3rem auto" }}>
            <div className="card">
              <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                Continuous &amp; Periodic Assessments
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                Students participate in periodic unit tests, subject enrichment activities, portfolio reviews, and practical demonstrations throughout the academic session.
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                Term &amp; Annual Board Evaluations
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                Summative term-end assessments and CBSE board examinations are administered under strict academic invigilation and standardized marking schemes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Sections Verified by Source (Fee, Calendar, SMC, PTA) */}
      <section className="section" style={{ backgroundColor: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
        <div className="container">
          <SectionHeader
            tag="Administrative Declarations"
            title="Institutional Governance, Committees & Schedules"
            description="Mandatory disclosures confirmed by CBSE records; itemized records are updated administratively."
          />

          <div className="grid-2" style={{ gap: "2rem" }}>
            {/* Fee Structure */}
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-gold-subtle)", color: "var(--color-gold-dark)" }}>
                  <FileText size={22} />
                </div>
                <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary)", margin: 0 }}>
                  Fee Structure
                </h3>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                The school maintains a regulated fee schedule approved under CBSE administrative directives. Exact tuition fees, admission charges, and transport contributions for the current academic session are communicated directly via the school office.
              </p>
              <EmptyState
                title="Fee Schedule Notice"
                description="Exact class-wise fee schedules for the current session will be uploaded upon official circular issuance."
                note="Do not pay unverified amounts online • Contact school desk for official challan"
              />
            </div>

            {/* Annual Academic Calendar */}
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: "var(--radius-md)", backgroundColor: "rgba(14, 42, 71, 0.08)", color: "var(--color-primary)" }}>
                  <Calendar size={22} />
                </div>
                <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary)", margin: 0 }}>
                  Annual Academic Calendar
                </h3>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                The academic year follows the CBSE annual schedule from April to March. Major term holidays, assessment windows, and parent-teacher consultations are notified on the academic calendar.
              </p>
              <EmptyState
                title="Academic Calendar Schedule"
                description="Complete session calendar schedule outline will be uploaded under institutional downloads."
                note="Check the School Calendar tab for interactive dates"
              />
            </div>

            {/* School Management Committee (SMC) */}
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: "var(--radius-md)", backgroundColor: "rgba(14, 42, 71, 0.08)", color: "var(--color-primary)" }}>
                  <ShieldCheck size={22} />
                </div>
                <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary)", margin: 0 }}>
                  School Management Committee (SMC)
                </h3>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                The School Management Committee oversees institutional policies, infrastructure development, staff welfare, and student security according to CBSE bylaws.
              </p>
              <EmptyState
                title="SMC Members Register"
                description="Official member roster and committee meeting resolutions are maintained in institutional records."
                note="Source confirms SMC exists • Detailed member roster pending upload"
              />
            </div>

            {/* Parent Teacher Association (PTA) */}
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-gold-subtle)", color: "var(--color-gold-dark)" }}>
                  <Users size={22} />
                </div>
                <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary)", margin: 0 }}>
                  Parent Teacher Association (PTA)
                </h3>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                An active collaborative forum connecting parents and educators to support student academic performance, disciplinary etiquette, and extracurricular participation.
              </p>
              <EmptyState
                title="PTA Executive Body"
                description="PTA representatives and periodic meeting schedules will be published in official circulars."
                note="Source confirms PTA exists • Members register pending update"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
