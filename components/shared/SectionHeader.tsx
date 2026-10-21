interface SectionHeaderProps {
  tag?: string;
  title: string;
  description?: string;
  centered?: boolean;
  inverse?: boolean;
}

export default function SectionHeader({
  tag,
  title,
  description,
  centered = true,
  inverse = false,
}: SectionHeaderProps) {
  return (
    <div
      style={{
        textAlign: centered ? "center" : "left",
        maxWidth: centered ? "720px" : "100%",
        margin: centered ? "0 auto var(--space-10) auto" : "0 0 var(--space-8) 0",
      }}
    >
      {tag && (
        <span
          style={{
            color: inverse ? "#ffdf85" : "var(--color-gold-dark)",
            fontWeight: 700,
            fontSize: "0.8125rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.35rem",
            display: "inline-block",
          }}
        >
          {tag}
        </span>
      )}
      <h2
        style={{
          color: inverse ? "var(--color-text-inverse)" : "var(--color-primary)",
          marginBottom: description ? "0.65rem" : 0,
          fontWeight: 800,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: "1.05rem",
            color: inverse ? "rgba(255, 255, 255, 0.85)" : "var(--color-text-muted)",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
