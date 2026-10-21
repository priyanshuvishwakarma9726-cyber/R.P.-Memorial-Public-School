import Link from "next/link";
import Image from "next/image";
import { UserCheck, Award, GraduationCap, ArrowRight, BookOpen } from "lucide-react";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export default function PrincipalSection() {
  return (
    <section className="section" style={{ backgroundColor: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
      <div className="container">
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            backgroundColor: "var(--color-bg)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border)",
            padding: "3rem 2.5rem",
            boxShadow: "var(--shadow-card)",
          }}
          className="principal-card-wrap"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2.5rem",
              alignItems: "center",
            }}
            className="principal-grid"
          >
            {/* Left: Authentic Principal Photograph */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "200px",
                  height: "230px",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "4px solid var(--color-gold)",
                  margin: "0 auto 1.25rem auto",
                  position: "relative",
                  boxShadow: "var(--shadow-elevated)",
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

              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "var(--color-surface)",
                  padding: "0.35rem 0.95rem",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                Head of Institution
              </div>
            </div>

            {/* Right: Principal Information Details */}
            <div>
              <span
                style={{
                  color: "var(--color-gold-dark)",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                  display: "inline-block",
                }}
              >
                Office of the Principal
              </span>

              <h2
                style={{
                  fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)",
                  fontWeight: 800,
                  color: "var(--color-primary)",
                  marginBottom: "0.35rem",
                }}
              >
                {SCHOOL_INFO.principal.name}
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginBottom: "1.25rem",
                }}
              >
                <span
                  style={{
                    backgroundColor: "rgba(14, 42, 71, 0.08)",
                    color: "var(--color-primary)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    padding: "0.2rem 0.65rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid rgba(14, 42, 71, 0.15)",
                  }}
                >
                  Principal
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <Award size={16} style={{ color: "var(--color-gold-dark)" }} />
                  Qualification: <strong>{SCHOOL_INFO.principal.qualification}</strong>
                </span>
              </div>

              <p style={{ fontSize: "0.975rem", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Leading <strong>{SCHOOL_INFO.name}</strong> with a steadfast dedication to educational rigor, discipline, and student empowerment. Under his academic leadership, the school coordinates CBSE curriculum delivery, teacher mentorship, and institutional operations adhering to the highest standards of safety and student enrichment.
              </p>

              <div
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderLeft: "3px solid var(--color-gold)",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                  marginBottom: "1.5rem",
                  border: "1px solid var(--color-border)",
                  borderLeftWidth: "3px",
                  fontSize: "0.875rem",
                  color: "var(--color-text-muted)",
                }}
              >
                <strong>Administrative Note:</strong> All academic decisions, examination guidelines, and institutional communications are officially issued under the authority of the Principal&apos;s Desk.
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <Link href="/principal" className="btn btn-primary btn-sm">
                  View Full Principal Desk <ArrowRight size={15} />
                </Link>
                <Link href="/faculty" className="btn btn-outline btn-sm">
                  View Faculty Directory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
}
