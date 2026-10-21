"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  FileText,
  PhoneCall,
  Calendar,
  Building,
  Users,
  Award,
  Image as ImageIcon,
  BookOpen,
  HelpCircle,
  LogIn,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: scrolled ? "var(--shadow-card)" : "var(--shadow-subtle)",
        transition: "box-shadow var(--transition-normal)",
      }}
    >
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "5rem",
      }}>
        {/* Brand / Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
          }}
        >
          {/* Authentic Standalone School Crest */}
          <div
            style={{
              position: "relative",
              width: "48px",
              height: "48px",
              flexShrink: 0,
            }}
          >
            <Image
              src="/images/school-logo.png"
              alt="R.P. Memorial Public School logo"
              width={48}
              height={48}
              priority
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          </div>

          {/* School Name as Real Semantic Text */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 900,
                fontSize: "1.05rem",
                lineHeight: 1.15,
                color: "var(--color-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              R. P. MEMORIAL
            </span>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "0.85rem",
                lineHeight: 1.15,
                color: "var(--color-primary)",
                letterSpacing: "0.02em",
              }}
            >
              PUBLIC SCHOOL
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          style={{
            display: "none",
            alignItems: "center",
            gap: "1.25rem",
          }}
          className="desktop-nav"
        >
          <Link
            href="/"
            style={{
              fontWeight: 600,
              fontSize: "0.925rem",
              color: pathname === "/" ? "var(--color-gold-dark)" : "var(--color-primary)",
              borderBottom: pathname === "/" ? "2px solid var(--color-gold)" : "2px solid transparent",
              padding: "0.4rem 0",
            }}
          >
            Home
          </Link>

          {/* About Dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setActiveDropdown("about")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => toggleDropdown("about")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.925rem",
                color: ["/about", "/principal", "/infrastructure", "/faculty"].includes(pathname)
                  ? "var(--color-gold-dark)"
                  : "var(--color-primary)",
                padding: "0.4rem 0",
              }}
            >
              About
              <ChevronDown size={15} />
            </button>
            {activeDropdown === "about" && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "230px",
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-elevated)",
                  padding: "0.5rem 0",
                  zIndex: 200,
                }}
              >
                <Link href="/about" className="dropdown-link">
                  <Building size={16} /> About School
                </Link>
                <Link href="/principal" className="dropdown-link">
                  <Award size={16} /> Principal&apos;s Profile
                </Link>
                <Link href="/faculty" className="dropdown-link">
                  <Users size={16} /> Faculty Directory
                </Link>
                <Link href="/infrastructure" className="dropdown-link">
                  <Building size={16} /> Infrastructure
                </Link>
              </div>
            )}
          </div>

          {/* Academics Dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setActiveDropdown("academics")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => toggleDropdown("academics")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.925rem",
                color: ["/academics", "/results", "/calendar", "/downloads"].includes(pathname)
                  ? "var(--color-gold-dark)"
                  : "var(--color-primary)",
                padding: "0.4rem 0",
              }}
            >
              Academics
              <ChevronDown size={15} />
            </button>
            {activeDropdown === "academics" && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "230px",
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-elevated)",
                  padding: "0.5rem 0",
                  zIndex: 200,
                }}
              >
                <Link href="/academics" className="dropdown-link">
                  <BookOpen size={16} /> Academic Curriculum
                </Link>
                <Link href="/results" className="dropdown-link">
                  <Award size={16} /> Results &amp; Academics
                </Link>
                <Link href="/calendar" className="dropdown-link">
                  <Calendar size={16} /> School Calendar
                </Link>
                <Link href="/downloads" className="dropdown-link">
                  <FileText size={16} /> Download Center
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/admissions"
            style={{
              fontWeight: 600,
              fontSize: "0.925rem",
              color: pathname === "/admissions" ? "var(--color-gold-dark)" : "var(--color-primary)",
              borderBottom: pathname === "/admissions" ? "2px solid var(--color-gold)" : "2px solid transparent",
              padding: "0.4rem 0",
            }}
          >
            Admissions
          </Link>

          {/* School Life Dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setActiveDropdown("life")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => toggleDropdown("life")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.925rem",
                color: ["/notices", "/events", "/gallery", "/faq"].includes(pathname)
                  ? "var(--color-gold-dark)"
                  : "var(--color-primary)",
                padding: "0.4rem 0",
              }}
            >
              School Life
              <ChevronDown size={15} />
            </button>
            {activeDropdown === "life" && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "220px",
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-elevated)",
                  padding: "0.5rem 0",
                  zIndex: 200,
                }}
              >
                <Link href="/notices" className="dropdown-link">
                  <FileText size={16} /> Notices &amp; Circulars
                </Link>
                <Link href="/events" className="dropdown-link">
                  <Calendar size={16} /> Campus Events
                </Link>
                <Link href="/gallery" className="dropdown-link">
                  <ImageIcon size={16} /> Campus Gallery
                </Link>
                <Link href="/faq" className="dropdown-link">
                  <HelpCircle size={16} /> FAQs
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            style={{
              fontWeight: 600,
              fontSize: "0.925rem",
              color: pathname === "/contact" ? "var(--color-gold-dark)" : "var(--color-primary)",
              borderBottom: pathname === "/contact" ? "2px solid var(--color-gold)" : "2px solid transparent",
              padding: "0.4rem 0",
            }}
          >
            Contact
          </Link>

          {/* Admissions CTA */}
          <Link
            href="/admissions"
            className="btn btn-gold btn-sm"
            style={{
              marginLeft: "0.5rem",
              boxShadow: "var(--shadow-gold)",
            }}
          >
            <GraduationCap size={16} />
            Admission Enquiry
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2.75rem",
            height: "2.75rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-primary)",
            cursor: "pointer",
          }}
          className="mobile-toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            padding: "1rem var(--space-4) 1.5rem var(--space-4)",
            maxHeight: "calc(100vh - 5.5rem)",
            overflowY: "auto",
          }}
          className="mobile-drawer"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <Link href="/" className="mobile-nav-link">
              Home
            </Link>

            <div style={{ borderTop: "1px solid var(--color-border-light)", margin: "0.3rem 0" }} />
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-gold-dark)", textTransform: "uppercase", padding: "0.2rem 0.5rem" }}>
              About School
            </div>
            <Link href="/about" className="mobile-nav-link">
              <Building size={16} /> About School
            </Link>
            <Link href="/principal" className="mobile-nav-link">
              <Award size={16} /> Principal&apos;s Profile
            </Link>
            <Link href="/faculty" className="mobile-nav-link">
              <Users size={16} /> Faculty Roster (19 Staff)
            </Link>
            <Link href="/infrastructure" className="mobile-nav-link">
              <Building size={16} /> Infrastructure &amp; Campus
            </Link>

            <div style={{ borderTop: "1px solid var(--color-border-light)", margin: "0.3rem 0" }} />
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-gold-dark)", textTransform: "uppercase", padding: "0.2rem 0.5rem" }}>
              Academics
            </div>
            <Link href="/academics" className="mobile-nav-link">
              <BookOpen size={16} /> Academic Programs
            </Link>
            <Link href="/results" className="mobile-nav-link">
              <Award size={16} /> Results &amp; Academics
            </Link>
            <Link href="/calendar" className="mobile-nav-link">
              <Calendar size={16} /> School Calendar
            </Link>
            <Link href="/downloads" className="mobile-nav-link">
              <FileText size={16} /> Download Center
            </Link>

            <div style={{ borderTop: "1px solid var(--color-border-light)", margin: "0.3rem 0" }} />
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-gold-dark)", textTransform: "uppercase", padding: "0.2rem 0.5rem" }}>
              Notices &amp; Campus
            </div>
            <Link href="/admissions" className="mobile-nav-link">
              <GraduationCap size={16} /> Admissions &amp; Enquiry
            </Link>
            <Link href="/notices" className="mobile-nav-link">
              <FileText size={16} /> Notices &amp; Announcements
            </Link>
            <Link href="/events" className="mobile-nav-link">
              <Calendar size={16} /> Events &amp; Celebrations
            </Link>
            <Link href="/gallery" className="mobile-nav-link">
              <ImageIcon size={16} /> Campus Photo Gallery
            </Link>
            <Link href="/faq" className="mobile-nav-link">
              <HelpCircle size={16} /> FAQs
            </Link>
            <Link href="/contact" className="mobile-nav-link">
              <PhoneCall size={16} /> Contact Office
            </Link>
            <Link href="/login" className="mobile-nav-link">
              <LogIn size={16} /> Portal Login UI
            </Link>

            <div style={{ marginTop: "1rem" }}>
              <Link
                href="/admissions"
                className="btn btn-gold"
                style={{ width: "100%", textAlign: "center" }}
              >
                <GraduationCap size={16} /> Admission Enquiry Form
              </Link>
            </div>
          </div>
        </div>
      )}

      
    </header>
  );
}
