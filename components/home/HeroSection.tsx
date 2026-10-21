"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  PhoneCall,
  Award,
  BookOpen,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/data/school-data";
import EnquiryFormModal from "@/components/admissions/EnquiryFormModal";

export default function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        style={{
          position: "relative",
          background: "linear-gradient(135deg, #071526 0%, #0e2a47 60%, #153e66 100%)",
          color: "var(--color-text-inverse)",
          overflow: "hidden",
          paddingTop: "4rem",
          paddingBottom: "4.5rem",
          borderBottom: "4px solid var(--color-gold)",
        }}
        aria-label="Welcome to R.P. Memorial Public School"
      >
        {/* Subtle geometric academic background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
            backgroundSize: "100px 100px",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Left Content Column */}
            <div>
              {/* Institutional Affiliation Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "rgba(200, 147, 39, 0.15)",
                  border: "1px solid rgba(200, 147, 39, 0.35)",
                  borderRadius: "var(--radius-full)",
                  padding: "0.35rem 0.95rem",
                  fontSize: "0.8125rem",
                  color: "#ffdf85",
                  fontWeight: 600,
                  marginBottom: "1.25rem",
                }}
              >
                <Award size={15} style={{ color: "var(--color-gold)" }} />
                <span>School Code: {SCHOOL_INFO.schoolCode} &bull; Established: 2011</span>
              </div>

              {/* Official School Logo Branding Badge */}
              <div className="hero-logo-badge">
                <div className="hero-logo-wrapper">
                  <Image
                    src="/images/school-logo.png"
                    alt={`${SCHOOL_INFO.name} logo`}
                    width={64}
                    height={64}
                    priority
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div>
                  <div className="hero-logo-title">
                    R.P. MEMORIAL PUBLIC SCHOOL
                  </div>
                  <div className="hero-logo-tagline">
                    {SCHOOL_INFO.tagline}
                  </div>
                </div>
              </div>

              <h1
                style={{
                  color: "#ffffff",
                  fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  marginBottom: "1rem",
                }}
              >
                {SCHOOL_INFO.name}
              </h1>

              {/* Official Tagline */}
              <p
                style={{
                  fontSize: "clamp(1.15rem, 2vw, 1.4rem)",
                  fontWeight: 600,
                  color: "#ffdf85",
                  fontStyle: "italic",
                  marginBottom: "1.25rem",
                  letterSpacing: "-0.01em",
                }}
              >
                &ldquo;{SCHOOL_INFO.tagline}&rdquo;
              </p>

              {/* Institution verified summary copy */}
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "rgba(255, 255, 255, 0.88)",
                  lineHeight: 1.65,
                  maxWidth: "600px",
                  marginBottom: "2rem",
                }}
              >
                Fostering intellectual vigor, moral discipline, and academic excellence in Maharajganj, Uttar Pradesh since 2011. Equipped with a modern 8,130 sq. meter campus, 50 spacious classrooms, and specialized laboratories.
              </p>

              {/* Strong CTAs */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "0.85rem",
                  marginBottom: "2.5rem",
                }}
              >
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn btn-gold btn-lg"
                  style={{ boxShadow: "var(--shadow-gold)" }}
                >
                  <GraduationCap size={20} />
                  Admission Enquiry
                </button>

                <Link href="/about" className="btn btn-outline-white btn-lg">
                  <BookOpen size={18} />
                  Explore School
                </Link>

                <Link href="/contact" className="btn btn-outline-white btn-lg">
                  <PhoneCall size={18} />
                  Contact School
                </Link>
              </div>

              {/* Quick Verified Institutional Badges */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                  fontSize: "0.85rem",
                  color: "rgba(255, 255, 255, 0.75)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--color-gold)" }} />
                  <span>8,130 sq. m Campus</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--color-gold)" }} />
                  <span>50 Classrooms</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--color-gold)" }} />
                  <span>6 Dedicated Labs</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <MapPin size={16} style={{ color: "var(--color-gold)" }} />
                  <span>Maharajganj (PIN 273301)</span>
                </div>
              </div>
            </div>

            {/* Right Media Column: Real Campus Entrance Image */}
            <div style={{ position: "relative" }} className="hero-image-wrap">
              <div
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
                  border: "2px solid rgba(255, 255, 255, 0.15)",
                  height: "440px",
                  width: "100%",
                }}
              >
                <Image
                  src="/images/campus-entrance.jpg"
                  alt="R.P. Memorial Public School Campus Entrance"
                  fill
                  priority
                  sizes="(min-width: 1024px) 500px, 100vw"
                  style={{ objectFit: "cover" }}
                />

                {/* Subtle gradient overlay at bottom */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 55%, rgba(10, 25, 45, 0.85) 100%)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: "1.25rem",
                    left: "1.25rem",
                    right: "1.25rem",
                    color: "#ffffff",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      backgroundColor: "var(--color-gold)",
                      color: "#1a1708",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "var(--radius-sm)",
                      textTransform: "uppercase",
                    }}
                  >
                    Campus Entrance
                  </span>
                  <h3 style={{ color: "#ffffff", fontSize: "1.1rem", marginTop: "0.35rem" }}>
                    R.P. Memorial Public School Campus
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.8)", margin: 0 }}>
                    Partawal Bazar, Maharajganj &bull; Established 2011
                  </p>
                </div>
              </div>

              {/* Floated Trust Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "-1rem",
                  right: "-1rem",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-primary)",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-elevated)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                }}
                className="floating-hero-badge"
              >
                <div
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "var(--color-gold-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-gold-dark)",
                  }}
                >
                  <Award size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>School Code</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-primary)" }}>
                    {SCHOOL_INFO.schoolCode}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </section>

      {/* Modal for admissions enquiry */}
      <EnquiryFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
