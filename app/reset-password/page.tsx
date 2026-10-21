"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/data/school-data";
import { updatePassword } from "@/lib/supabase/auth";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify both entries.");
      return;
    }

    setLoading(true);

    try {
      const res = await updatePassword(password);
      if (!res.success) {
        const rawErr = (res.error || "").toLowerCase();
        if (rawErr.includes("expired") || rawErr.includes("token")) {
          setErrorMsg("Your password reset link is invalid or has expired. Please request a new recovery link.");
        } else {
          setErrorMsg("Failed to update password. Please ensure your recovery link is still active.");
        }
      } else {
        setSuccess(true);
      }
    } catch {
      setErrorMsg("An unexpected connection issue occurred. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.5rem 1rem 2rem 1rem",
      }}
    >
      {/* Top Navigation Bar: Back to Portal Login */}
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          margin: "0 auto 1.25rem auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--color-text-secondary)",
            fontSize: "0.85rem",
            fontWeight: 600,
            textDecoration: "none",
            padding: "0.45rem 0.85rem",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-subtle)",
            transition: "all var(--transition-fast)",
          }}
          className="portal-back-link"
        >
          <ArrowLeft size={16} style={{ color: "var(--color-gold)" }} />
          <span>Back to Portal Login</span>
        </Link>

        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--color-text-muted)",
          }}
        >
          Code: {SCHOOL_INFO.schoolCode}
        </span>
      </div>

      {/* Main Card */}
      <main
        style={{
          maxWidth: "480px",
          width: "100%",
          margin: "0 auto",
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 10px 30px -5px rgba(11, 37, 69, 0.08), 0 4px 12px -2px rgba(11, 37, 69, 0.04)",
          padding: "2.25rem 2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Top Accent Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, var(--color-primary) 0%, var(--color-gold) 50%, var(--color-primary) 100%)",
          }}
        />

        {/* School Identity Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              width: "4.5rem",
              height: "4.5rem",
              borderRadius: "var(--radius-full)",
              backgroundColor: "#ffffff",
              boxShadow: "0 6px 20px rgba(14, 42, 71, 0.12)",
              border: "3px solid #f8fafc",
              outline: "2px solid var(--color-gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.15rem auto",
              padding: "4px",
            }}
          >
            <Image
              src="/images/school-logo.png"
              alt="R.P. Memorial Public School crest logo"
              width={56}
              height={56}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <h1
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "var(--color-primary)",
              letterSpacing: "0.02em",
              marginBottom: "0.25rem",
              textTransform: "uppercase",
            }}
          >
            {SCHOOL_INFO.name}
          </h1>

          <div
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: "0.25rem",
            }}
          >
            Set New Password
          </div>

          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Establish a new security password for your institutional account.
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "4rem",
                height: "4rem",
                borderRadius: "var(--radius-full)",
                backgroundColor: "rgba(21, 128, 61, 0.1)",
                color: "var(--color-success)",
                marginBottom: "1rem",
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h2 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "0.35rem" }}>
              Password Updated Successfully
            </h2>

            <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              Your new password is now active. You may now proceed to the portal login.
            </p>

            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.85rem 1.25rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-primary)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(14, 42, 71, 0.2)",
              }}
            >
              <ArrowLeft size={16} /> Return to Portal Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} noValidate>
            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem 1rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                  fontSize: "0.825rem",
                  color: "#991b1b",
                  lineHeight: 1.45,
                }}
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "0.1rem", color: "#dc2626" }} />
                <div>{errorMsg}</div>
              </div>
            )}

            {/* New Password */}
            <div className="form-group" style={{ marginBottom: "1.1rem" }}>
              <label
                className="form-label"
                htmlFor="newPassword"
                style={{
                  display: "block",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: "0.35rem",
                }}
              >
                New Security Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    left: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="form-input"
                  required
                  autoComplete="new-password"
                  style={{
                    width: "100%",
                    padding: "0.75rem 2.75rem 0.75rem 2.6rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    fontSize: "0.9rem",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--color-text-muted)",
                    cursor: "pointer",
                    padding: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label
                className="form-label"
                htmlFor="confirmPassword"
                style={{
                  display: "block",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: "0.35rem",
                }}
              >
                Confirm Security Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    left: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter same password"
                  className="form-input"
                  required
                  autoComplete="new-password"
                  style={{
                    width: "100%",
                    padding: "0.75rem 2.75rem 0.75rem 2.6rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    fontSize: "0.9rem",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--color-text-muted)",
                    cursor: "pointer",
                    padding: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.85rem 1.25rem",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: "var(--color-primary)",
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 14px rgba(14, 42, 71, 0.2)",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin-animation" />
                  <span>Updating Password…</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}
      </main>

      {/* Security Reassurance Footer Note */}
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          margin: "1.5rem auto 0 auto",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "var(--color-text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.45rem",
        }}
      >
        <ShieldCheck size={14} style={{ color: "var(--color-success)" }} />
        <span>End-to-end encrypted credential management.</span>
      </div>
    </div>
  );
}
