import Link from "next/link";
import Image from "next/image";
import { Users, Award, GraduationCap, ArrowRight, ShieldCheck } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { TEACHERS_ROSTER } from "@/lib/data/school-data";

export default function FacultyPreview() {
  // Show first 6 educators from verified roster on the homepage
  const previewTeachers = TEACHERS_ROSTER.slice(0, 6);

  return (
    <section className="section" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container">
        <SectionHeader
          tag="Teaching Staff"
          title="Experienced Educators & Leadership"
          description="Dedicated faculty guiding students across primary, middle, and secondary academic levels."
        />

        <div className="grid-3" style={{ marginBottom: "2.5rem" }}>
          {previewTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "1.25rem",
                padding: "1.25rem 1.5rem",
              }}
            >
              {/* Profile Avatar / Photo */}
              <div
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "var(--radius-full)",
                  overflow: "hidden",
                  backgroundColor: teacher.designation === "PRINCIPAL"
                    ? "var(--color-primary)"
                    : "rgba(14, 42, 71, 0.08)",
                  color: teacher.designation === "PRINCIPAL" ? "#ffdf85" : "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  position: "relative",
                  border: teacher.designation === "PRINCIPAL" ? "2px solid var(--color-gold)" : "none",
                }}
              >
                {teacher.designation === "PRINCIPAL" ? (
                  <Image
                    src="/images/Principal.jpeg"
                    alt="Avadhes Kumar Chaurasaia, Principal of R.P. Memorial Public School"
                    fill
                    sizes="56px"
                    style={{ objectFit: "cover", objectPosition: "center 15%" }}
                  />
                ) : (
                  teacher.name.charAt(0)
                )}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      backgroundColor: teacher.designation === "PRINCIPAL"
                        ? "rgba(200, 147, 39, 0.2)"
                        : "var(--color-surface-alt)",
                      color: teacher.designation === "PRINCIPAL"
                        ? "var(--color-gold-dark)"
                        : "var(--color-primary)",
                      padding: "0.1rem 0.5rem",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {teacher.designation}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "0.975rem",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={teacher.name}
                >
                  {teacher.name}
                </h3>

                <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", margin: 0 }}>
                  Qualification: <strong>{teacher.qualification}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Directory Footer Action & Discrepancy Integrity Notice */}
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Link href="/faculty" className="btn btn-primary">
            <span>View Full Faculty Directory (All 19 Listed Staff)</span>
            <ArrowRight size={16} />
          </Link>

          <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", margin: 0, maxWidth: "600px" }}>
            * Faculty credentials verified from CBSE mandatory disclosure records without fabricated photographs or biographies.
          </p>
        </div>
      </div>
    </section>
  );
}
