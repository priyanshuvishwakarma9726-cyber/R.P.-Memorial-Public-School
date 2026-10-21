import { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

interface StatCardProps {
  number: string | number;
  unit?: string;
  label: string;
  detail?: string;
  icon?: ReactNode;
  isVerified?: boolean;
}

export default function StatCard({
  number,
  unit,
  label,
  detail,
  icon,
  isVerified = true,
}: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem 1.5rem",
        boxShadow: "var(--shadow-card)",
        transition: "transform var(--transition-fast), border-color var(--transition-fast)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      className="stat-card-item"
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div
          style={{
            width: "2.75rem",
            height: "2.75rem",
            borderRadius: "var(--radius-md)",
            backgroundColor: "rgba(14, 42, 71, 0.06)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>

        {isVerified && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--color-success)",
              backgroundColor: "var(--color-success-bg)",
              padding: "0.15rem 0.5rem",
              borderRadius: "var(--radius-full)",
              border: "1px solid rgba(21, 128, 61, 0.2)",
            }}
          >
            <CheckCircle2 size={11} />
            Verified
          </span>
        )}
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
          <span
            style={{
              fontSize: "2.35rem",
              fontWeight: 800,
              color: "var(--color-primary)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {number}
          </span>
          {unit && (
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-gold-dark)" }}>
              {unit}
            </span>
          )}
        </div>

        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            marginTop: "0.4rem",
            marginBottom: "0.25rem",
          }}
        >
          {label}
        </h3>

        {detail && (
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.4 }}>
            {detail}
          </p>
        )}
      </div>

      
    </div>
  );
}
