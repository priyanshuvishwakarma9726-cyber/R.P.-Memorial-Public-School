"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  confirmText,
  cancelLabel = "Cancel",
  cancelText,
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const resolvedConfirm = confirmText || confirmLabel;
  const resolvedCancel = cancelText || cancelLabel;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "var(--radius-lg)",
          padding: "1.75rem",
          maxWidth: "440px",
          width: "100%",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
          <div
            style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "50%",
              backgroundColor: isDestructive ? "rgba(220, 38, 38, 0.1)" : "rgba(212, 175, 55, 0.1)",
              color: isDestructive ? "var(--color-error)" : "var(--color-accent-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary)", margin: 0, fontWeight: 700 }}>
              {title}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", margin: "0.5rem 0 0 0", lineHeight: 1.5 }}>
              {message}
            </p>
          </div>

          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              padding: "0.25rem",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn btn-outline"
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            {resolvedCancel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="btn"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              backgroundColor: isDestructive ? "#dc2626" : "var(--color-primary)",
              color: "#ffffff",
              border: "none",
            }}
          >
            {isLoading ? "Processing..." : resolvedConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
