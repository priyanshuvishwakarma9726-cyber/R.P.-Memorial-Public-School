"use client";

import Link from "next/link";
import { Menu, ShieldCheck, ExternalLink, User } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  title: string;
  subtitle?: string;
  callerName?: string;
  callerRole?: string;
}

export default function AdminHeader({
  onToggleSidebar,
  title,
  subtitle,
  callerName = "Administrator",
  callerRole = "admin",
}: AdminHeaderProps) {
  return (
    <header
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid var(--color-border)",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1020,
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={onToggleSidebar}
          className="admin-menu-toggle-btn"
          style={{
            display: "none",
            background: "none",
            border: "1px solid var(--color-border)",
            borderRadius: "6px",
            padding: "0.45rem",
            cursor: "pointer",
            color: "var(--color-primary)",
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 style={{ fontSize: "1.25rem", color: "var(--color-primary)", margin: 0, fontWeight: 800 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", margin: "0.15rem 0 0 0" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "var(--color-surface)",
            padding: "0.4rem 0.85rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--color-border)",
            fontSize: "0.8rem",
          }}
        >
          <div
            style={{
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "50%",
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 800,
            }}
          >
            {callerName ? callerName.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{callerName}</span>
            <span
              style={{
                marginLeft: "0.4rem",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                fontWeight: 800,
                color: callerRole === "admin" ? "var(--color-accent-dark)" : "var(--color-primary)",
              }}
            >
              ({callerRole})
            </span>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="btn btn-outline"
          style={{ fontSize: "0.75rem", padding: "0.4rem 0.75rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <ExternalLink size={14} /> Public Website
        </Link>
      </div>
    </header>
  );
}
