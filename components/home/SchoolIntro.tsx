import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Shield, Award, BookOpen, Compass } from "lucide-react";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export default function SchoolIntro() {
  return (
    <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3.5rem",
            alignItems: "center",
          }}
          className="intro-grid"
        >
          {/* Left: School Image / Real Campus Courtyard */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "relative",
                height: "440px",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "var(--shadow-elevated)",
                border: "1px solid var(--color-border)",
              }}
            >
              <Image
                src="/images/campus-courtyard.jpg"
                alt="R.P. Memorial Public School Courtyard and Academic Wing"
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                style={{ objectFit: "cover" }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "1.25rem",
                  left: "1.25rem",
                  right: "1.25rem",
                  backgroundColor: "rgba(14, 42, 71, 0.9)",
                  backdropFilter: "blur(4px)",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "var(--radius-md)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--color-gold-light)", fontWeight: 700, textTransform: "uppercase" }}>
                  Institutional Campus
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                  Inner Courtyard &amp; Classroom Corridors
                </div>
              </div>
            </div>

            {/* Accent Card */}
            <div
              style={{
                position: "absolute",
                top: "-1.25rem",
                left: "-1.25rem",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-card)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
              className="intro-floating-card"
            >
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--color-gold-subtle)",
                  color: "var(--color-gold-dark)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield size={20} />
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Established</div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--color-primary)" }}>
                  Since 2011
                </div>
              </div>
            </div>
          </div>

          {/* Right: Neutral verified institutional text */}
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
              About Our School
            </span>

            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.35rem)",
                fontWeight: 800,
                color: "var(--color-primary)",
                lineHeight: 1.25,
                marginBottom: "1rem",
              }}
            >
              A Disciplined Academic Environment In Maharajganj
            </h2>

            <p style={{ fontSize: "1.05rem", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              <strong>{SCHOOL_INFO.name}</strong> operates as a recognized secondary institution under the Central Board of Secondary Education (CBSE, Code: {SCHOOL_INFO.schoolCode}). Situated on an 8,130 sq. meter dedicated campus in Partawal Bazar, Maharajganj, the institution provides quality schooling grounded in discipline, intellectual inquiry, and character development.
            </p>

            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.65, marginBottom: "1.75rem" }}>
              With 50 dedicated classrooms, 6 equipped laboratory spaces, modern digital connectivity, and experienced educators under the guidance of Principal <strong>{SCHOOL_INFO.principal.name} ({SCHOOL_INFO.principal.qualification})</strong>, the school focuses on holistic student learning adhering to national educational standards.
            </p>

            {/* Core Pillars */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {[
                { title: "CBSE Curriculum", desc: "Structured secondary education framework" },
                { title: "Spacious Campus", desc: "8,130 sq. meters with 50 classrooms" },
                { title: "Science & Computer Labs", desc: "6 purpose-built laboratory units" },
                { title: "Student Well-Being", desc: "Special educator & wellness counsellor" },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    backgroundColor: "var(--color-surface-alt)",
                    padding: "0.85rem 1rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                  }}
                >
                  <CheckCircle2 size={16} style={{ color: "var(--color-gold-dark)", flexShrink: 0, marginTop: "0.15rem" }} />
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-primary)" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "0.775rem", color: "var(--color-text-muted)" }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/about" className="btn btn-primary">
                Read Full School Profile <ArrowRight size={16} />
              </Link>
              <Link href="/principal" className="btn btn-outline">
                Principal&apos;s Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
}
