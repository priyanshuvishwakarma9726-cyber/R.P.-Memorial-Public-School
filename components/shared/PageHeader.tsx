import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHeader({
  title,
  subtitle,
  badge,
  breadcrumbs = [],
}: PageHeaderProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)",
        color: "var(--color-text-inverse)",
        paddingTop: "3.5rem",
        paddingBottom: "3.5rem",
        borderBottom: "3px solid var(--color-gold)",
        position: "relative",
      }}
    >
      <div className="container">
        {/* Breadcrumbs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.85rem",
            color: "rgba(255, 255, 255, 0.7)",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none" }}>
            Home
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <ChevronRight size={14} style={{ color: "var(--color-gold)" }} />
              {crumb.href ? (
                <Link href={crumb.href} style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none" }}>
                  {crumb.label}
                </Link>
              ) : (
                <span style={{ color: "#ffdf85", fontWeight: 600 }}>{crumb.label}</span>
              )}
            </div>
          ))}
        </div>

        {badge && (
          <span
            style={{
              display: "inline-block",
              backgroundColor: "rgba(200, 147, 39, 0.2)",
              color: "#ffdf85",
              border: "1px solid rgba(200, 147, 39, 0.4)",
              borderRadius: "var(--radius-full)",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.2rem 0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.75rem",
            }}
          >
            {badge}
          </span>
        )}

        <h1
          style={{
            color: "#ffffff",
            fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
            fontWeight: 800,
            marginBottom: subtitle ? "0.5rem" : 0,
            letterSpacing: "-0.015em",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255, 255, 255, 0.85)",
              maxWidth: "760px",
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
