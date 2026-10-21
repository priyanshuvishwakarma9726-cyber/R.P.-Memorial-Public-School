import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookOpen, AlertCircle, Clock, Info, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import EmptyState from "@/components/shared/EmptyState";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export const metadata: Metadata = {
  title: "Results & Academics",
  description: `Official CBSE Class X and Class XII examination results disclosure and academic records at ${SCHOOL_INFO.name}.`,
};

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        title="Results & Academic Performance"
        subtitle="CBSE Board examination performance records and annual academic assessments."
        badge="Board Examinations"
        breadcrumbs={[
          { label: "Academics", href: "/academics" },
          { label: "Results" },
        ]}
      />

      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <SectionHeader
            tag="Public Disclosure"
            title="CBSE Board Examination Records"
            description="Institutional performance records for Class X Secondary Examinations."
          />

          {/* Fact Integrity Notice */}
          <div
            style={{
              backgroundColor: "var(--color-surface-alt)",
              border: "1px solid var(--color-border)",
              borderLeft: "4px solid var(--color-gold)",
              borderRadius: "var(--radius-md)",
              padding: "1rem 1.25rem",
              marginBottom: "3rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <Info size={18} style={{ color: "var(--color-gold-dark)", flexShrink: 0, marginTop: "0.15rem" }} />
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
              <strong>Official Result Policy:</strong> In strict compliance with CBSE transparency regulations, the school does not publish unverified scores, estimated percentages, or simulated topper claims. Official results are updated upon administrative publication of certified board gazettes.
            </div>
          </div>

          {/* Results Sections Grid */}
          <div className="grid-2" style={{ gap: "2.5rem", marginBottom: "3.5rem" }}>
            {/* Class X Section */}
            <div className="card" style={{ padding: "2.5rem 2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(14, 42, 71, 0.08)",
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Award size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary)", margin: 0 }}>
                    Class X (Secondary) Results
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    CBSE Board Examination
                  </span>
                </div>
              </div>

              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Class X results for past academic years are maintained in the institutional registry. Certified tabulations will be updated following administrative digitization.
              </p>

              <EmptyState
                title="Class X Result Data Under Verification"
                description="Official board pass percentages and statistical figures will be updated upon administrative verification."
                note="School Code: 2134039 • Maharajganj"
              />
            </div>

            {/* Class XII Section */}
            <div className="card" style={{ padding: "2.5rem 2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-gold-subtle)",
                    color: "var(--color-gold-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BookOpen size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary)", margin: 0 }}>
                    Class XII (Senior Secondary) Results
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    CBSE Senior School Certificate Examination
                  </span>
                </div>
              </div>

              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Senior secondary stream-wise result summaries and grade statistics will be published following official board tabulation release.
              </p>

              <EmptyState
                title="Class XII Result Data Under Verification"
                description="Certified tabulations for senior secondary candidates will be uploaded by school administration."
                note="Official School Code: 2134039"
              />
            </div>
          </div>

          {/* Historical Result & Downloadable Tabulations UI */}
          <SectionHeader
            tag="Tabulation Records"
            title="Historical Performance Archives"
            description="Archive section for verified marksheets and gazette circulars."
          />

          <div
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem",
              textAlign: "center",
              maxWidth: "780px",
              margin: "0 auto",
            }}
          >
            <Clock size={36} style={{ color: "var(--color-gold-dark)", margin: "0 auto 1rem auto" }} />
            <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
              Archive Tabulations Pending Administrative Upload
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Parents or students requiring physical migration certificates, pass certificates, or character certificates may contact the administrative helpdesk in Maharajganj.
            </p>
            <Link href="/contact" className="btn btn-outline btn-sm">
              Contact Administrative Office
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
