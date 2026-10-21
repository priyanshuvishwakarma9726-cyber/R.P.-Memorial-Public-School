"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  HeartHandshake,
  BookOpen,
  Briefcase,
  History,
  Building2,
  Settings,
  LogOut,
  ExternalLink,
  CalendarCheck,
  Award,
  CreditCard,
  FileText,
  Clock,
  Bell,
  Calendar,
  School,
  Layers,
  BookMarked,
  UserCheck,
  X,
} from "lucide-react";
import { signOutUser } from "@/lib/supabase/auth";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  callerRole?: string;
  callerName?: string;
}

export default function AdminSidebar({
  isOpen = false,
  onClose,
  callerRole = "admin",
  callerName = "Administrator",
}: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOutUser();
    window.location.href = "/login";
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    {
      group: "Academics",
      items: [
        { label: "Academics Overview", href: "/admin/academics", icon: <School size={18} /> },
        { label: "Academic Years", href: "/admin/academic-years", icon: <Calendar size={18} /> },
        { label: "Classes", href: "/admin/classes", icon: <School size={18} /> },
        { label: "Sections", href: "/admin/sections", icon: <Layers size={18} /> },
        { label: "Subjects", href: "/admin/subjects", icon: <BookMarked size={18} /> },
        { label: "Enrollments", href: "/admin/enrollments", icon: <UserCheck size={18} /> },
      ],
    },
    {
      group: "People & Identities",
      items: [
        { label: "Students", href: "/admin/students", icon: <GraduationCap size={18} /> },
        { label: "Parents", href: "/admin/parents", icon: <HeartHandshake size={18} /> },
        { label: "Teachers", href: "/admin/teachers", icon: <BookOpen size={18} /> },
        { label: "Staff", href: "/admin/staff", icon: <Briefcase size={18} /> },
      ],
    },
    {
      group: "Administration",
      items: [
        { label: "User Management", href: "/admin/users", icon: <Users size={18} /> },
        { label: "Audit Logs", href: "/admin/audit-logs", icon: <History size={18} /> },
        { label: "School Profile", href: "/admin/school-profile", icon: <Building2 size={18} /> },
        { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
      ],
    },
  ];

  const futureModules = [
    { label: "Attendance", icon: <CalendarCheck size={16} /> },
    { label: "Results", icon: <Award size={16} /> },
    { label: "Fee Management", icon: <CreditCard size={16} /> },
    { label: "Admissions CRM", icon: <FileText size={16} /> },
    { label: "Timetable", icon: <Clock size={16} /> },
    { label: "Notifications", icon: <Bell size={16} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1040,
            display: "block",
          }}
          className="admin-sidebar-backdrop"
        />
      )}

      <aside
        className={`admin-sidebar ${isOpen ? "open" : ""}`}
        style={{
          width: "270px",
          backgroundColor: "#07172c",
          color: "#e2e8f0",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          height: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 1050,
          overflowY: "auto",
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: "1.25rem 1.25rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Image
              src="/images/school-logo.png"
              alt="R.P. Memorial Public School logo"
              width={38}
              height={38}
              style={{ objectFit: "contain", borderRadius: "50%" }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#ffffff", letterSpacing: "0.3px", lineHeight: 1.2 }}>
                R.P. MEMORIAL
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--color-accent-light)", fontWeight: 600 }}>
                Control Center &bull; 2134039
              </div>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="admin-sidebar-close-btn"
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "0.25rem",
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* User Badge Info */}
        <div
          style={{
            padding: "0.85rem 1.25rem",
            backgroundColor: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
            Signed in as: <strong style={{ color: "#ffffff", display: "block" }}>{callerName}</strong>
          </div>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 800,
              textTransform: "uppercase",
              padding: "0.2rem 0.5rem",
              borderRadius: "4px",
              backgroundColor: callerRole === "admin" ? "rgba(212, 175, 55, 0.2)" : "rgba(59, 130, 246, 0.2)",
              color: callerRole === "admin" ? "#fcd34d" : "#93c5fd",
              border: `1px solid ${callerRole === "admin" ? "rgba(212, 175, 55, 0.4)" : "rgba(59, 130, 246, 0.4)"}`,
            }}
          >
            {callerRole}
          </span>
        </div>

        {/* Navigation Items */}
        <div style={{ padding: "1rem 0.75rem", flex: 1 }}>
          <div style={{ marginBottom: "1rem" }}>
            <Link
              href="/admin"
              className={`admin-nav-link ${pathname === "/admin" ? "active" : ""}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </Link>
          </div>

          {navItems.slice(1).map((section, idx) => (
            <div key={idx} style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  fontSize: "0.68rem",
                  textTransform: "uppercase",
                  fontWeight: 800,
                  letterSpacing: "0.8px",
                  color: "#64748b",
                  padding: "0 0.6rem 0.4rem 0.6rem",
                }}
              >
                {section.group}
              </div>

              {section.items?.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-link ${isActive ? "active" : ""}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Future Modules — Marked "Coming Soon" */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                fontSize: "0.68rem",
                textTransform: "uppercase",
                fontWeight: 800,
                letterSpacing: "0.8px",
                color: "#64748b",
                padding: "0 0.6rem 0.4rem 0.6rem",
              }}
            >
              Future Modules
            </div>

            {futureModules.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.55rem 0.75rem",
                  fontSize: "0.78rem",
                  color: "#64748b",
                  borderRadius: "6px",
                  cursor: "not-allowed",
                  opacity: 0.65,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  {m.icon}
                  <span>{m.label}</span>
                </div>
                <span
                  style={{
                    fontSize: "0.6rem",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    padding: "0.15rem 0.35rem",
                    borderRadius: "4px",
                    fontWeight: 700,
                  }}
                >
                  Phase 4+
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "0.85rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 0.75rem",
              color: "#94a3b8",
              fontSize: "0.8rem",
              textDecoration: "none",
              borderRadius: "6px",
            }}
          >
            <ExternalLink size={16} />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 0.75rem",
              color: "#f87171",
              fontSize: "0.8rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderRadius: "6px",
              width: "100%",
              textAlign: "left",
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
