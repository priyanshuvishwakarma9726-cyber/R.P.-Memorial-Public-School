import Link from "next/link";
import { Phone, Mail, Award, UserCheck } from "lucide-react";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export default function TopBar() {
  return (
    <aside aria-label="Official announcements and contacts" style={{
      backgroundColor: "var(--color-primary-dark)",
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "0.8125rem",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "0.45rem 0",
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}>
        {/* Left: School Code & Contact */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Award size={14} style={{ color: "var(--color-gold)" }} />
            <span>School Code: <strong>{SCHOOL_INFO.schoolCode}</strong></span>
          </div>

          <a
            href={`tel:${SCHOOL_INFO.contact.phone}`}
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <Phone size={14} style={{ color: "var(--color-gold)" }} />
            <span>+91-{SCHOOL_INFO.contact.phone}</span>
          </a>

          <a
            href={`mailto:${SCHOOL_INFO.contact.email}`}
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
            className="topbar-email"
          >
            <Mail size={14} style={{ color: "var(--color-gold)" }} />
            <span>{SCHOOL_INFO.contact.email}</span>
          </a>
        </div>

        {/* Right: Quick Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "var(--color-gold)", fontStyle: "italic", display: "inline-block" }}>
            &ldquo;{SCHOOL_INFO.tagline}&rdquo;
          </span>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              backgroundColor: "rgba(200, 147, 39, 0.2)",
              color: "#ffdf85",
              padding: "0.15rem 0.6rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(200, 147, 39, 0.4)",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          >
            <UserCheck size={12} />
            <span>Portal Login</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
