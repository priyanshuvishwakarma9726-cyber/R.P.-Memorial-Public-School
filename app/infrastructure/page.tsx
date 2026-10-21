import type { Metadata } from "next";
import Image from "next/image";
import {
  Building2,
  FlaskConical,
  Wifi,
  Maximize2,
  Video,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Users2,
  Compass,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import StatCard from "@/components/shared/StatCard";
import { SCHOOL_INFO, CAMPUS_GALLERY_IMAGES } from "@/lib/data/school-data";

export const metadata: Metadata = {
  title: "Campus Infrastructure",
  description: `Verified campus facilities, classrooms, laboratories, and infrastructure metrics of ${SCHOOL_INFO.name}, Maharajganj.`,
};

export default function InfrastructurePage() {
  const verifiedStats = [
    {
      number: "8,130",
      unit: "sq. m",
      label: "Total Campus Land Area",
      detail: "Official campus plot area in Maharajganj, Uttar Pradesh",
      icon: <Maximize2 size={24} />,
    },
    {
      number: "50",
      unit: "Rooms",
      label: "Number of Classrooms",
      detail: "Well-ventilated learning rooms across multi-storey corridors",
      icon: <Building2 size={24} />,
    },
    {
      number: "47",
      unit: "sq. m",
      label: "Classroom Size",
      detail: "Standardized dimensions per classroom as documented in disclosure",
      icon: <Building2 size={24} />,
    },
    {
      number: "6",
      unit: "Units",
      label: "Laboratories (Inc. Computer)",
      detail: "Dedicated scientific and digital laboratory facilities",
      icon: <FlaskConical size={24} />,
    },
    {
      number: "56",
      unit: "sq. m",
      label: "Laboratory Size",
      detail: "Spacious laboratory dimensions per unit",
      icon: <FlaskConical size={24} />,
    },
    {
      number: "YES",
      label: "Internet Connectivity",
      detail: "High-speed campus-wide digital and online access facility",
      icon: <Wifi size={24} />,
    },
    {
      number: "12",
      unit: "Units",
      label: "Girls' Toilets",
      detail: "Dedicated, hygienic sanitation units for female students",
      icon: <CheckCircle2 size={24} />,
    },
    {
      number: "12",
      unit: "Units",
      label: "Boys' Toilets",
      detail: "Dedicated, hygienic sanitation units for male students",
      icon: <CheckCircle2 size={24} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="School Campus & Infrastructure"
        subtitle="Verified physical and digital facilities at R.P. Memorial Public School, Maharajganj."
        badge="Campus Highlights"
        breadcrumbs={[{ label: "Infrastructure" }]}
      />

      {/* Verified Metrics Section */}
      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <SectionHeader
            tag="Verified Disclosure Data"
            title="Official Infrastructure Specifications"
            description="All metrics reported below are directly sourced from the CBSE Mandatory Public Disclosure document."
          />

          <div className="grid-4" style={{ marginBottom: "3.5rem" }}>
            {verifiedStats.map((stat, idx) => (
              <StatCard
                key={idx}
                number={stat.number}
                unit={stat.unit}
                label={stat.label}
                detail={stat.detail}
                icon={stat.icon}
                isVerified={true}
              />
            ))}
          </div>

          {/* Infrastructure Inspection Video Showcase */}
          <div
            style={{
              backgroundColor: "var(--color-surface-alt)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem 2rem",
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2rem",
              alignItems: "center",
              marginBottom: "3.5rem",
            }}
            className="video-box-grid"
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "rgba(225, 29, 72, 0.1)",
                  color: "#e11d48",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                <Video size={14} /> Official Inspection Record
              </div>

              <h3 style={{ fontSize: "1.5rem", color: "var(--color-primary)", marginBottom: "0.75rem" }}>
                Campus Infrastructure Video Inspection
              </h3>

              <p style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                As mandated by the Central Board of Secondary Education, the school infrastructure was recorded on video during official inspection. You can view the authentic institutional inspection footage on YouTube using the exact link provided in the disclosure file.
              </p>

              <a
                href={SCHOOL_INFO.infrastructure.inspectionVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Video size={18} style={{ color: "#ffffff" }} />
                <span>Watch Inspection Video on YouTube</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div
              style={{
                position: "relative",
                height: "240px",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <Image
                src="/images/campus-entrance.jpg"
                alt="School Inspection Video Preview"
                fill
                sizes="(min-width: 768px) 400px, 100vw"
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "rgba(225, 29, 72, 0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Video size={28} />
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  CBSE Inspection Footage
                </span>
              </div>
            </div>
          </div>

          {/* Real Campus Photos Gallery Grid */}
          <SectionHeader
            tag="Visual Documentation"
            title="Authentic Campus Photography"
            description="Verified photographic records of the institutional building, inner wings, and learning facilities."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {CAMPUS_GALLERY_IMAGES.map((img) => (
              <div
                key={img.id}
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div style={{ position: "relative", height: "240px", width: "100%" }}>
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    sizes="(min-width: 768px) 350px, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--color-gold-dark)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {img.category}
                  </span>
                  <h4 style={{ fontSize: "1rem", color: "var(--color-primary)", marginBottom: "0.35rem" }}>
                    {img.title}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
                    {img.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </section>
    </>
  );
}
