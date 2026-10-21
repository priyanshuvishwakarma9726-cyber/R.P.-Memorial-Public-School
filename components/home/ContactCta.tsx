"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Send, GraduationCap, CheckCircle2 } from "lucide-react";
import { SCHOOL_INFO } from "@/lib/data/school-data";
import EnquiryFormModal from "@/components/admissions/EnquiryFormModal";

export default function ContactCta() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)",
          color: "var(--color-text-inverse)",
          padding: "5rem 0",
          borderTop: "3px solid var(--color-gold)",
          position: "relative",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              alignItems: "center",
            }}
            className="contact-cta-grid"
          >
            {/* Left: Message */}
            <div>
              <span
                style={{
                  color: "#ffdf85",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                  display: "inline-block",
                }}
              >
                Connect With Us
              </span>

              <h2
                style={{
                  color: "#ffffff",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 800,
                  marginBottom: "1rem",
                  lineHeight: 1.25,
                }}
              >
                Begin Your Child&apos;s Journey of Excellence
              </h2>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "rgba(255, 255, 255, 0.85)",
                  lineHeight: 1.65,
                  maxWidth: "560px",
                  marginBottom: "2rem",
                }}
              >
                Our administrative helpdesk is available for student admission enquiries, campus visits, and academic queries. Speak directly with school representatives.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn btn-gold btn-lg"
                  style={{ boxShadow: "var(--shadow-gold)" }}
                >
                  <GraduationCap size={20} />
                  Admission Enquiry Form
                </button>

                <a
                  href={`tel:${SCHOOL_INFO.contact.phone}`}
                  className="btn btn-outline-white btn-lg"
                >
                  <Phone size={18} />
                  Call: +91-{SCHOOL_INFO.contact.phone}
                </a>
              </div>
            </div>

            {/* Right: Verified Contact Card */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "var(--radius-xl)",
                padding: "2.5rem 2rem",
                backdropFilter: "blur(6px)",
              }}
            >
              <h3
                style={{
                  color: "#ffffff",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                  paddingBottom: "0.75rem",
                }}
              >
                School Office Coordinates
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <MapPin size={22} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "0.2rem" }} />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase", fontWeight: 600 }}>
                      Campus Location
                    </div>
                    <div style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.95rem" }}>
                      {SCHOOL_INFO.name}
                    </div>
                    <div style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                      {SCHOOL_INFO.contact.address.line1} {SCHOOL_INFO.contact.address.line2}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <Phone size={22} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase", fontWeight: 600 }}>
                      Direct Telephone Line
                    </div>
                    <a
                      href={`tel:${SCHOOL_INFO.contact.phone}`}
                      style={{ color: "#ffdf85", fontWeight: 700, fontSize: "1.1rem", textDecoration: "none" }}
                    >
                      +91-{SCHOOL_INFO.contact.phone}
                    </a>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <Mail size={22} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase", fontWeight: 600 }}>
                      Official Correspondence
                    </div>
                    <a
                      href={`mailto:${SCHOOL_INFO.contact.email}`}
                      style={{ color: "#ffffff", fontSize: "0.95rem", textDecoration: "none" }}
                    >
                      {SCHOOL_INFO.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </section>

      <EnquiryFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
