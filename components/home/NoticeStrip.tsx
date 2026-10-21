import Link from "next/link";
import { Bell, ChevronRight, Sparkles } from "lucide-react";
import { SAMPLE_NOTICES } from "@/lib/data/school-data";

export default function NoticeStrip() {
  const pinnedNotice = SAMPLE_NOTICES.find((n) => n.isPinned) || SAMPLE_NOTICES[0];

  return (
    <aside aria-label="Latest Notice" style={{
      backgroundColor: "var(--color-surface)",
      borderBottom: "1px solid var(--color-border)",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
      padding: "0.65rem 0",
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}>
        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: "1 1 auto", minWidth: 0 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
              padding: "0.2rem 0.65rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            <Bell size={13} style={{ color: "var(--color-gold)" }} />
            Latest Notice
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "0.1rem 0.45rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-gold-subtle)",
                color: "var(--color-gold-dark)",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              Demo Preview
            </span>
            <Link
              href="/notices"
              style={{
                fontSize: "0.9rem",
                color: "var(--color-primary)",
                fontWeight: 600,
                textDecoration: "none",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {pinnedNotice.title}
            </Link>
          </div>
        </div>

        {/* View All */}
        <Link
          href="/notices"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--color-gold-dark)",
            flexShrink: 0,
          }}
        >
          <span>View All Notices</span>
          <ChevronRight size={15} />
        </Link>
      </div>
    </aside>
  );
}
