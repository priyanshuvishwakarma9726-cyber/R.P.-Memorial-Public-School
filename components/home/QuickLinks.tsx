import Link from "next/link";
import {
  GraduationCap,
  Users,
  Building,
  FileText,
  Calendar,
  HelpCircle,
} from "lucide-react";

export default function QuickLinks() {
  const links = [
    {
      title: "Admissions Enquiry",
      desc: "Process & registration helpdesk",
      href: "/admissions",
      icon: <GraduationCap size={22} />,
      highlight: true,
    },
    {
      title: "Faculty Directory",
      desc: "19 listed educators & qualifications",
      href: "/faculty",
      icon: <Users size={22} />,
    },
    {
      title: "Campus Infrastructure",
      desc: "8,130 sq. m campus & 50 rooms",
      href: "/infrastructure",
      icon: <Building size={22} />,
    },
    {
      title: "Academic Curriculum",
      desc: "CBSE secondary curriculum outline",
      href: "/academics",
      icon: <FileText size={22} />,
    },
    {
      title: "School Calendar",
      desc: "Term events & academic schedules",
      href: "/calendar",
      icon: <Calendar size={22} />,
    },
    {
      title: "Helpdesk & FAQs",
      desc: "Answers to common queries",
      href: "/faq",
      icon: <HelpCircle size={22} />,
    },
  ];

  return (
    <section style={{ padding: "2.5rem 0", backgroundColor: "var(--color-surface-alt)" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              style={{
                backgroundColor: link.highlight ? "var(--color-primary)" : "var(--color-surface)",
                color: link.highlight ? "#ffffff" : "var(--color-primary)",
                border: link.highlight ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem 1rem",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                transition: "all var(--transition-fast)",
                boxShadow: "var(--shadow-subtle)",
              }}
              className="quicklink-card"
            >
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: link.highlight
                    ? "rgba(200, 147, 39, 0.25)"
                    : "rgba(14, 42, 71, 0.06)",
                  color: link.highlight ? "#ffdf85" : "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {link.icon}
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: link.highlight ? "#ffffff" : "var(--color-primary)",
                    lineHeight: 1.3,
                    marginBottom: "0.2rem",
                  }}
                >
                  {link.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.775rem",
                    color: link.highlight ? "rgba(255, 255, 255, 0.75)" : "var(--color-text-muted)",
                    margin: 0,
                    lineHeight: 1.35,
                  }}
                >
                  {link.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      
    </section>
  );
}
