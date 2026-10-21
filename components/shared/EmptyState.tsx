import { ReactNode } from "react";
import { Info, Clock } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  note?: string;
  icon?: ReactNode;
  actionText?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  note = "Official data pending administrative update by school authorities",
  icon,
}: EmptyStateProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px dashed var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "3rem 2rem",
        textAlign: "center",
        maxWidth: "640px",
        margin: "1.5rem auto",
      }}
    >
      <div
        style={{
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "var(--radius-full)",
          backgroundColor: "rgba(200, 147, 39, 0.12)",
          color: "var(--color-gold-dark)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.25rem auto",
        }}
      >
        {icon || <Clock size={28} />}
      </div>

      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--color-primary)",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "0.95rem",
          color: "var(--color-text-secondary)",
          marginBottom: "1rem",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {note && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            backgroundColor: "var(--color-surface-alt)",
            padding: "0.35rem 0.85rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Info size={13} style={{ color: "var(--color-gold)" }} />
          <span>{note}</span>
        </div>
      )}
    </div>
  );
}
