import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Award,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "var(--color-primary-dark)",
        color: "rgba(255, 255, 255, 0.8)",
        borderTop: "3px solid var(--color-gold)",
        paddingTop: "4rem",
        paddingBottom: "2rem",
        marginTop: "auto",
      }}
    >
      <div className="container">
        {/* Main Footer Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3.5rem",
          }}
        >
          {/* Column 1: School Identity & Logo */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  padding: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Image
                  src="/images/school-logo.png"
                  alt="R.P. Memorial Public School logo"
                  width={46}
                  height={46}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "1.05rem", lineHeight: 1.2 }}>
                  R.P. MEMORIAL
                </div>
                <div style={{ color: "rgba(255, 255, 255, 0.85)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.5px" }}>
                  PUBLIC SCHOOL
                </div>
              </div>
            </div>

            <p style={{
              color: "var(--color-gold)",
              fontWeight: 600,
              fontStyle: "italic",
              fontSize: "0.95rem",
              marginBottom: "0.25rem",
            }}>
              &ldquo;{SCHOOL_INFO.tagline}&rdquo;
            </p>

            <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.875rem", lineHeight: 1.6 }}>
              A co-educational secondary school committed to academic discipline, ethical leadership, and holistic student growth since 2011.
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.75rem",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                width: "fit-content",
                fontSize: "0.8125rem",
                color: "#ffdf85",
              }}
            >
              <Award size={14} style={{ color: "var(--color-gold)" }} />
              <span>School Code: <strong>{SCHOOL_INFO.schoolCode}</strong></span>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h3
              style={{
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
                position: "relative",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid var(--color-gold)",
                display: "inline-block",
              }}
            >
              Useful Links
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { label: "Academics", href: "/academics" },
                { label: "Admissions", href: "/admissions" },
                { label: "Faculty Directory", href: "/faculty" },
                { label: "Campus Infrastructure", href: "/infrastructure" },
                { label: "Notices & Circulars", href: "/notices" },
                { label: "School Events", href: "/events" },
                { label: "Campus Gallery", href: "/gallery" },
                { label: "Results & Academics", href: "/results" },
                { label: "Download Center", href: "/downloads" },
                { label: "Contact School", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      transition: "all var(--transition-fast)",
                    }}
                    className="footer-link"
                  >
                    <ChevronRight size={14} style={{ color: "var(--color-gold)" }} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Institutional Portals */}
          <div>
            <h3
              style={{
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
                position: "relative",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid var(--color-gold)",
                display: "inline-block",
              }}
            >
              Institutional Portal
            </h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)", marginBottom: "1rem" }}>
              Access entry gates for student records, academic tracking, staff dashboard, and administrative console.
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { label: "Student Portal", href: "/login?role=student" },
                { label: "Parent Portal", href: "/login?role=parent" },
                { label: "Teacher Portal", href: "/login?role=teacher" },
                { label: "Admin Console", href: "/login?role=admin" },
              ].map((portal) => (
                <li key={portal.label}>
                  <Link
                    href={portal.href}
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                    className="footer-link"
                  >
                    <ChevronRight size={14} style={{ color: "var(--color-gold)" }} />
                    <span>{portal.label}</span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.1rem 0.4rem",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "var(--radius-sm)",
                        color: "var(--color-gold-light)",
                      }}
                    >
                      UI Access
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "1.5rem" }}>
              <Link
                href="/faq"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "var(--color-gold)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                <span>Frequently Asked Questions</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Column 4: Official Contact Information */}
          <div>
            <h3
              style={{
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
                position: "relative",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid var(--color-gold)",
                display: "inline-block",
              }}
            >
              School Office
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <MapPin size={18} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "0.2rem" }} />
                <div>
                  <strong style={{ color: "#ffffff", display: "block" }}>{SCHOOL_INFO.name}</strong>
                  <span>{SCHOOL_INFO.contact.address.line1}</span>
                  <br />
                  <span>{SCHOOL_INFO.contact.address.line2}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Phone size={18} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                <div>
                  <span style={{ display: "block", color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem" }}>Official Phone</span>
                  <a href={`tel:${SCHOOL_INFO.contact.phone}`} style={{ color: "#ffffff", fontWeight: 600 }}>
                    +91-{SCHOOL_INFO.contact.phone}
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Mail size={18} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                <div>
                  <span style={{ display: "block", color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem" }}>Official Email</span>
                  <a href={`mailto:${SCHOOL_INFO.contact.email}`} style={{ color: "#ffffff", wordBreak: "break-all" }}>
                    {SCHOOL_INFO.contact.email}
                  </a>
                </div>
              </div>

              <a
                href={SCHOOL_INFO.contact.address.googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  color: "var(--color-gold)",
                  fontSize: "0.8rem",
                  marginTop: "0.25rem",
                }}
              >
                <span>View Campus on Map Search</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Verified Notice */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "1.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.8125rem",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <div>
            &copy; {currentYear} {SCHOOL_INFO.name}. All rights reserved.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={14} style={{ color: "var(--color-gold)" }} />
            <span>Official Frontend Portal &bull; School Code: {SCHOOL_INFO.schoolCode} &bull; Maharajganj (U.P.)</span>
          </div>
        </div>
      </div>

      
    </footer>
  );
}
