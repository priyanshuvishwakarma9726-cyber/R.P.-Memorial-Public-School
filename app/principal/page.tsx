import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Award, CheckCircle2, ShieldCheck, Mail, Phone, ArrowRight } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export const metadata: Metadata = {
  title: "Principal's Profile",
  description: `Official administrative profile of Principal ${SCHOOL_INFO.principal.name} (${SCHOOL_INFO.principal.qualification}) at ${SCHOOL_INFO.name}.`,
};

export default function PrincipalPage() {
  return (
    <>
      <PageHeader
        title="Principal's Desk"
        subtitle="Institutional leadership and academic administration at R.P. Memorial Public School."
        badge="Academic Leadership"
        breadcrumbs={[
          { label: "About School", href: "/about" },
          { label: "Principal's Desk" },
        ]}
      />

      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <div
            style={{
              maxWidth: "880px",
              margin: "0 auto",
              backgroundColor: "var(--color-bg)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border)",
              padding: "3.5rem 3rem",
              boxShadow: "var(--shadow-card)",
            }}
            className="principal-card-detail"
          >
            {/* Top Identity Block */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2.5rem",
                flexWrap: "wrap",
                paddingBottom: "2.5rem",
                borderBottom: "1px solid var(--color-border)",
                marginBottom: "2.5rem",
              }}
            >
              {/* Authentic Principal Photograph */}
              <div
                style={{
                  width: "200px",
                  height: "230px",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "4px solid var(--color-gold)",
                  position: "relative",
                  boxShadow: "var(--shadow-elevated)",
                  flexShrink: 0,
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <Image
                  src="/images/Principal.jpeg"
                  alt="Avadhes Kumar Chaurasaia, Principal of R.P. Memorial Public School"
                  fill
                  sizes="200px"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center 15%",
                  }}
                  priority
                />
              </div>

              <div>
                <span
                  style={{
                    backgroundColor: "rgba(14, 42, 71, 0.08)",
                    color: "var(--color-primary)",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    padding: "0.2rem 0.65rem",
                    borderRadius: "var(--radius-sm)",
                    textTransform: "uppercase",
                    display: "inline-block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Principal &bull; Head of Institution
                </span>

                <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 800, color: "var(--color-primary)", marginBottom: "0.4rem" }}>
                  {SCHOOL_INFO.principal.name}
                </h2>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-secondary)", fontSize: "0.95rem", marginBottom: "0.75rem" }}>
                  <Award size={18} style={{ color: "var(--color-gold-dark)" }} />
                  <span>Educational Qualification: <strong>{SCHOOL_INFO.principal.qualification}</strong></span>
                </div>

                <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                  {SCHOOL_INFO.name} &bull; School Code: {SCHOOL_INFO.schoolCode}
                </div>
              </div>
            </div>

            {/* Academic Overview Text (Neutral, strictly un-fabricated) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", lineHeight: 1.75, color: "var(--color-text-secondary)", fontSize: "1rem" }}>
              <p>
                <strong>{SCHOOL_INFO.principal.name}</strong> serves as the Principal of <strong>{SCHOOL_INFO.name}</strong>, Maharajganj. With qualifications of <strong>M.A., B.Ed.</strong>, he oversees the institution&apos;s academic standards, teacher supervision, curriculum delivery, and student discipline in alignment with Central Board of Secondary Education guidelines.
              </p>

              <p>
                Under his stewardship, the school coordinates educational activities across 50 classrooms and 6 dedicated laboratory facilities on the 8,130 sq. meter Maharajganj campus. The administration places a strong emphasis on consistent classroom attendance, foundational conceptual clarity, student safety, and moral integrity.
              </p>

              <div
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border)",
                  borderLeft: "4px solid var(--color-gold)",
                  padding: "1.5rem",
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                  Institutional Directive: Read, Lead and Succeed
                </h3>
                <p style={{ fontSize: "0.925rem", color: "var(--color-text-secondary)", margin: 0 }}>
                  The administrative office maintains an open channel of communication with parents, teachers, and educational authorities to ensure that every student benefits from a secure, disciplined, and nurturing environment.
                </p>
              </div>

              {/* Verified Contact Details for Principal Office */}
              <div
                style={{
                  backgroundColor: "var(--color-surface-alt)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border)",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Official Correspondence
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-primary)" }}>
                    Administrative Desk: +91-{SCHOOL_INFO.contact.phone}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    Email: {SCHOOL_INFO.contact.email}
                  </div>
                </div>

                <Link href="/contact" className="btn btn-primary btn-sm">
                  Contact Office <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        
      </section>
    </>
  );
}
