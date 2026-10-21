"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Users,
  Shield,
  BookOpen,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  LogOut,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Phone,
  HelpCircle,
  X,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/data/school-data";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  signInUser,
  signOutUser,
  requestPasswordReset,
} from "@/lib/supabase/auth";
import type { Profile } from "@/lib/supabase/types";

type RoleType = "student" | "parent" | "teacher" | "admin";

interface RoleOption {
  id: RoleType;
  label: string;
  badgeLabel: string;
  icon: typeof GraduationCap;
  desc: string;
}

const ROLES: RoleOption[] = [
  {
    id: "student",
    label: "Student",
    badgeLabel: "Student Portal",
    icon: GraduationCap,
    desc: "Results • Attendance • Homework",
  },
  {
    id: "parent",
    label: "Parent",
    badgeLabel: "Parent Portal",
    icon: Users,
    desc: "Child Progress • Fees • Notices",
  },
  {
    id: "teacher",
    label: "Teacher",
    badgeLabel: "Teacher Portal",
    icon: BookOpen,
    desc: "Classes • Attendance • Assignments",
  },
  {
    id: "admin",
    label: "Admin",
    badgeLabel: "Admin Portal",
    icon: Shield,
    desc: "School Management • CMS • Reports",
  },
];

export default function LoginPage() {
  const [role, setRole] = useState<RoleType>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [authenticatedProfile, setAuthenticatedProfile] = useState<Profile | null>(null);
  const [isConfigured, setIsConfigured] = useState(true);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());

    // Retrieve saved email if "Remember email" was previously selected
    try {
      const savedEmail = localStorage.getItem("rpm_saved_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberEmail(true);
      }
    } catch {
      // localStorage unavailable or restricted
    }
  }, []);

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showForgotModal) {
        setShowForgotModal(false);
        setForgotMsg(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showForgotModal]);

  const activeRoleConfig = ROLES.find((r) => r.id === role) || ROLES[0];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Please enter your registered institutional email.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your security password.");
      return;
    }

    setLoading(true);

    try {
      // Manage "Remember email"
      try {
        if (rememberEmail) {
          localStorage.setItem("rpm_saved_email", cleanEmail);
        } else {
          localStorage.removeItem("rpm_saved_email");
        }
      } catch {
        // Storage restricted
      }

      const res = await signInUser(cleanEmail, password, role);

      if (!res.success) {
        // Map raw errors to friendly, human-centered security responses
        const rawErr = (res.error || "").toLowerCase();
        if (
          rawErr.includes("invalid login credentials") ||
          rawErr.includes("invalid_grant") ||
          rawErr.includes("wrong password") ||
          rawErr.includes("user not found")
        ) {
          setErrorMsg("Email or password is incorrect. Please check your details and try again.");
        } else if (rawErr.includes("inactive") || rawErr.includes("suspended") || rawErr.includes("not active")) {
          setErrorMsg("Your account is not active. Please contact the school administration.");
        } else if (rawErr.includes("network") || rawErr.includes("fetch")) {
          setErrorMsg("We couldn't connect to the school portal. Please check your internet connection and try again.");
        } else {
          setErrorMsg("Email or password is incorrect. Please check your details and try again.");
        }
        setLoading(false);
        return;
      }

      const profile = res.profile;

      // WRONG PORTAL PROTECTION: Strictly compare selected role vs actual profile role
      if (!profile) {
        setErrorMsg("Authenticated, but no institutional profile was found. Please contact administration.");
        setLoading(false);
        return;
      }

      // Check account status: strictly require active status
      if (profile.status !== "active") {
        await signOutUser();
        setErrorMsg("Your account is not active. Please contact the school administration.");
        setLoading(false);
        return;
      }

      // Verify school association
      const expectedSchoolId = "a1000000-0000-0000-0000-000000000001";
      if (profile.school_id && profile.school_id !== expectedSchoolId) {
        await signOutUser();
        setErrorMsg("Your account is not registered with R.P. Memorial Public School.");
        setLoading(false);
        return;
      }

      // Check role compatibility
      const isRoleMatched =
        role === profile.role ||
        (role === "admin" && (profile.role === "admin" || profile.role === "principal"));

      if (!isRoleMatched) {
        // Portal mismatch: Sign out immediately so unauthorized session does not linger
        await signOutUser();

        const roleLabels: Record<string, string> = {
          student: "Student",
          parent: "Parent",
          teacher: "Teacher",
          admin: "Admin",
          principal: "Admin",
          staff: "Staff",
        };
        const actualPortal = roleLabels[profile.role] || "assigned";

        setErrorMsg(
          `Your account is registered for the ${actualPortal} Portal. Please select ${actualPortal} to continue.`
        );
        setLoading(false);
        return;
      }

      // Success branch
      setSuccessMsg("Authentication verified. Loading your portal...");
      setAuthenticatedProfile(profile);

      if (profile.role === "admin" || profile.role === "principal") {
        // Full administrative access verified
        window.location.href = "/admin";
        return;
      }

      // Other roles stay in authenticated state until dedicated portals are phased in
      setLoading(false);
    } catch {
      setErrorMsg("We couldn't connect to the school portal. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOutUser();
    setAuthenticatedProfile(null);
    setSuccessMsg(null);
    setErrorMsg(null);
    setPassword("");
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotLoading) return;

    const cleanForgotEmail = forgotEmail.trim();
    if (!cleanForgotEmail) {
      setForgotMsg("Please enter your registered email address.");
      return;
    }

    setForgotLoading(true);
    setForgotMsg(null);

    try {
      await requestPasswordReset(cleanForgotEmail);
      // Privacy-preserving response: never reveal whether the email exists
      setForgotMsg(
        "If an account exists for this email, password recovery instructions have been sent to your inbox."
      );
    } catch {
      setForgotMsg(
        "If an account exists for this email, password recovery instructions have been sent to your inbox."
      );
    } finally {
      setForgotLoading(false);
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
      {/* Top Navigation Bar: Back to School Website */}
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          margin: "0 auto 1.25rem auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
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
          <span>Back to School Website</span>
        </Link>

        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--color-text-muted)",
            letterSpacing: "0.03em",
          }}
        >
          School Code: {SCHOOL_INFO.schoolCode}
        </span>
      </div>

      {/* Main Portal Card */}
      <main
        style={{
          maxWidth: "560px",
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
              width: "5rem",
              height: "5rem",
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
              width={64}
              height={64}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <h1
            style={{
              fontSize: "1.25rem",
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
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--color-gold-dark)",
              backgroundColor: "var(--color-gold-subtle)",
              padding: "0.2rem 0.65rem",
              borderRadius: "var(--radius-full)",
              marginBottom: "0.85rem",
            }}
          >
            CBSE Affiliated &bull; Code {SCHOOL_INFO.schoolCode}
          </div>

          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: "0.25rem",
            }}
          >
            Welcome back 👋
          </div>

          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Secure School Portal &bull; Sign in using your school-provided account.
          </p>
        </div>

        {/* Configuration Notice (fallback if env missing) */}
        {!isConfigured && (
          <div
            style={{
              backgroundColor: "var(--color-warning-bg)",
              border: "1px solid rgba(180, 83, 9, 0.3)",
              borderRadius: "var(--radius-md)",
              padding: "0.85rem 1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              fontSize: "0.8rem",
              color: "var(--color-warning)",
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
            <div>
              <strong>Database Configuration Notice:</strong> Supabase live connection credentials missing in environment.
            </div>
          </div>
        )}

        {/* ACTIVE AUTHENTICATED SESSION STATE */}
        {authenticatedProfile ? (
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

            <h2 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "0.25rem" }}>
              Active Session Verified
            </h2>

            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>
              Welcome, <strong>{authenticatedProfile.full_name || authenticatedProfile.email}</strong>
            </p>

            <div
              style={{
                backgroundColor: "var(--color-bg)",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                textAlign: "left",
                fontSize: "0.85rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Assigned Portal:</span>
                <span style={{ fontWeight: 700, textTransform: "capitalize", color: "var(--color-primary)" }}>
                  {authenticatedProfile.role}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Institutional Email:</span>
                <span style={{ fontWeight: 600 }}>{authenticatedProfile.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Account Status:</span>
                <span style={{ color: "var(--color-success)", fontWeight: 700, textTransform: "capitalize" }}>
                  {authenticatedProfile.status}
                </span>
              </div>
            </div>

            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
              Dedicated student, parent, and teacher portals are active in upcoming releases.
            </p>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={loading}
              className="btn btn-outline"
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <LogOut size={16} /> Sign Out of Portal
            </button>
          </div>
        ) : (
          <>
            {/* ROLE SELECTION ("WHO ARE YOU SIGNING IN AS?") */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-text-muted)",
                  marginBottom: "0.6rem",
                  textAlign: "center",
                }}
              >
                Who are you signing in as?
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "0.6rem",
                }}
                className="role-selector-grid"
              >
                {ROLES.map((r) => {
                  const IconComponent = r.icon;
                  const isSelected = role === r.id;

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setRole(r.id);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      aria-pressed={isSelected}
                      aria-label={`Select ${r.label} Portal`}
                      style={{
                        padding: "0.75rem 0.65rem",
                        borderRadius: "var(--radius-md)",
                        border: isSelected
                          ? "2px solid var(--color-gold)"
                          : "1px solid var(--color-border)",
                        backgroundColor: isSelected
                          ? "var(--color-gold-subtle)"
                          : "var(--color-bg)",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        transition: "all var(--transition-fast)",
                        boxShadow: isSelected
                          ? "0 4px 12px rgba(200, 147, 39, 0.15)"
                          : "none",
                        outline: "none",
                        position: "relative",
                      }}
                      className="portal-role-card"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.45rem",
                          }}
                        >
                          <div
                            style={{
                              color: isSelected ? "var(--color-gold-dark)" : "var(--color-primary)",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <IconComponent size={18} />
                          </div>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              color: isSelected ? "var(--color-primary)" : "var(--color-text-primary)",
                            }}
                          >
                            {r.label}
                          </span>
                        </div>

                        {isSelected && (
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "var(--color-gold)",
                            }}
                          />
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: isSelected ? "var(--color-text-secondary)" : "var(--color-text-muted)",
                          lineHeight: 1.25,
                        }}
                      >
                        {r.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Feedback Banner */}
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

            {/* Success Feedback Banner */}
            {successMsg && (
              <div
                style={{
                  backgroundColor: "var(--color-success-bg)",
                  border: "1px solid rgba(21, 128, 61, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem 1rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                  fontSize: "0.825rem",
                  color: "var(--color-success)",
                }}
                role="status"
              >
                <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                <div>{successMsg}</div>
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleLogin} noValidate>
              {/* Email Input */}
              <div className="form-group" style={{ marginBottom: "1.1rem" }}>
                <label
                  className="form-label"
                  htmlFor="portalEmail"
                  style={{
                    display: "block",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "0.35rem",
                  }}
                >
                  Registered Institutional Email
                </label>
                <div
                  className="portal-input-wrapper"
                  onClick={() => document.getElementById("portalEmail")?.focus()}
                >
                  <div className="portal-input-icon-area">
                    <Mail size={18} />
                  </div>
                  <input
                    id="portalEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@rpm.edu or user@gmail.com"
                    className="portal-input-bare"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Input with Accessible Show/Hide Toggle */}
              <div className="form-group" style={{ marginBottom: "1.1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <label
                    className="form-label"
                    htmlFor="portalPassword"
                    style={{
                      fontSize: "0.825rem",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      margin: 0,
                    }}
                  >
                    Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-primary)",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <div
                  className="portal-input-wrapper"
                  onClick={() => document.getElementById("portalPassword")?.focus()}
                >
                  <div className="portal-input-icon-area">
                    <Lock size={18} />
                  </div>
                  <input
                    id="portalPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="portal-input-bare"
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: "0.5rem" }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                    }}
                    aria-label={showPassword ? "Hide security password" : "Show security password"}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-text-muted)",
                      cursor: "pointer",
                      padding: "0.4rem 0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "var(--radius-sm)",
                      flexShrink: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Email Checkbox */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.825rem",
                  marginBottom: "1.5rem",
                }}
              >
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    cursor: "pointer",
                    color: "var(--color-text-secondary)",
                    userSelect: "none",
                  }}
                  htmlFor="rememberEmailCheck"
                >
                  <input
                    id="rememberEmailCheck"
                    type="checkbox"
                    checked={rememberEmail}
                    onChange={(e) => setRememberEmail(e.target.checked)}
                    style={{ cursor: "pointer", accentColor: "var(--color-primary)" }}
                  />
                  <span>Remember email</span>
                </label>
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
                  transition: "all var(--transition-fast)",
                  opacity: loading ? 0.8 : 1,
                }}
                className="portal-submit-btn"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin-animation" />
                    <span>Signing you in…</span>
                  </>
                ) : (
                  <>Access {activeRoleConfig.label} Portal</>
                )}
              </button>
            </form>

            {/* Institutional Policy Reassurance: No Public Signup */}
            <div
              style={{
                marginTop: "1.5rem",
                padding: "0.85rem 1rem",
                backgroundColor: "var(--color-bg)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem",
                fontSize: "0.775rem",
                color: "var(--color-text-secondary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 700, color: "var(--color-primary)" }}>
                <ShieldCheck size={16} style={{ color: "var(--color-gold)" }} />
                <span>Institutional Access Only</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.4, color: "var(--color-text-muted)" }}>
                Public registration is disabled. Student, parent, and faculty credentials are provisioned exclusively by the school administration office.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Need portal access?</span>
                <Link
                  href="/contact"
                  style={{
                    color: "var(--color-primary)",
                    fontWeight: 700,
                    textDecoration: "underline",
                  }}
                >
                  Contact School Administration
                </Link>
                <span style={{ color: "var(--color-text-muted)" }}>&bull;</span>
                <a
                  href={`tel:${SCHOOL_INFO.contact.phone}`}
                  style={{
                    color: "var(--color-primary)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {SCHOOL_INFO.contact.phone}
                </a>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Security Reassurance Footer Note */}
      <div
        style={{
          maxWidth: "560px",
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
        <span>Your school account is protected by secure institutional authentication.</span>
      </div>

      {/* FORGOT PASSWORD MODAL DIALOG */}
      {showForgotModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(14, 42, 71, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgotPasswordTitle"
          onClick={() => {
            setShowForgotModal(false);
            setForgotMsg(null);
          }}
        >
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
              border: "1px solid var(--color-border)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                setForgotMsg(null);
              }}
              aria-label="Close dialog"
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                color: "var(--color-text-muted)",
                cursor: "pointer",
                padding: "0.25rem",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--color-gold-subtle)",
                  color: "var(--color-gold-dark)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <KeyRound size={20} />
              </div>
              <h2 id="forgotPasswordTitle" style={{ fontSize: "1.2rem", color: "var(--color-primary)", margin: 0, fontWeight: 700 }}>
                Reset Portal Password
              </h2>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "1.25rem", lineHeight: 1.45 }}>
              Enter your registered institutional email. A secure recovery link will be sent to your inbox.
            </p>

            {forgotMsg && (
              <div
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-info-bg)",
                  border: "1px solid rgba(3, 105, 161, 0.25)",
                  color: "var(--color-info)",
                  fontSize: "0.825rem",
                  marginBottom: "1.25rem",
                  lineHeight: 1.4,
                }}
                role="status"
              >
                {forgotMsg}
              </div>
            )}

            <form onSubmit={handleForgotPassword} noValidate>
              <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                <label
                  className="form-label"
                  htmlFor="forgotEmailInput"
                  style={{
                    display: "block",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "0.35rem",
                  }}
                >
                  Registered Email Address
                </label>
                <input
                  id="forgotEmailInput"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@rpm.edu or user@gmail.com"
                  className="form-input"
                  required
                  autoComplete="email"
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.85rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    fontSize: "0.9rem",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotMsg(null);
                  }}
                  className="btn btn-outline"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  style={{
                    flex: 1.5,
                    padding: "0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    backgroundColor: "var(--color-primary)",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: forgotLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                  }}
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 size={16} className="spin-animation" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <span>Send Reset Instructions</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
