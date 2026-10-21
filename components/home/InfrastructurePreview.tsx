import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  FlaskConical,
  Wifi,
  Video,
  ExternalLink,
  ArrowRight,
  Maximize2,
  CheckCircle2,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export default function InfrastructurePreview() {
  return (
    <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="container">
        <SectionHeader
          tag="Campus Facility"
          title="Modern Educational Infrastructure"
          description="A purpose-built 8,130 sq. meter learning environment designed for safety, focus, and holistic education."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem",
            alignItems: "center",
            marginBottom: "3rem",
          }}
          className="infra-grid"
        >
          {/* Left: Key Metrics Grid */}
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.25rem",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                }}
              >
                <div style={{ color: "var(--color-gold-dark)", marginBottom: "0.5rem" }}>
                  <Maximize2 size={24} />
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)", lineHeight: 1 }}>
                  8,130 <span style={{ fontSize: "0.9rem" }}>sq. m</span>
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-text-primary)", marginTop: "0.35rem" }}>
                  Total Campus Area
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  Spacious educational compound
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                }}
              >
                <div style={{ color: "var(--color-gold-dark)", marginBottom: "0.5rem" }}>
                  <Building2 size={24} />
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)", lineHeight: 1 }}>
                  50 <span style={{ fontSize: "0.9rem" }}>Rooms</span>
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-text-primary)", marginTop: "0.35rem" }}>
                  Classrooms
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  Each room 47 sq. meters
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                }}
              >
                <div style={{ color: "var(--color-gold-dark)", marginBottom: "0.5rem" }}>
                  <FlaskConical size={24} />
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)", lineHeight: 1 }}>
                  6 <span style={{ fontSize: "0.9rem" }}>Labs</span>
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-text-primary)", marginTop: "0.35rem" }}>
                  Laboratories
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  56 sq. meters per laboratory unit
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                }}
              >
                <div style={{ color: "var(--color-gold-dark)", marginBottom: "0.5rem" }}>
                  <Wifi size={24} />
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)", lineHeight: 1 }}>
                  YES
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-text-primary)", marginTop: "0.35rem" }}>
                  Internet Connectivity
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  Campus-wide digital enablement
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/infrastructure" className="btn btn-primary">
                View Infrastructure Details <ArrowRight size={16} />
              </Link>

              {/* Verified Source YouTube Inspection Video */}
              <a
                href={SCHOOL_INFO.infrastructure.inspectionVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Video size={16} style={{ color: "#e11d48" }} />
                <span>Inspection Video</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Right: Real Campus Images Showcase */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "280px",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <Image
                src="/images/campus-courtyard.jpg"
                alt="School Inner Courtyard and Classrooms"
                fill
                sizes="(min-width: 768px) 300px, 50vw"
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  insetInline: 0,
                  backgroundColor: "rgba(10, 25, 45, 0.75)",
                  color: "#ffffff",
                  padding: "0.4rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                Inner Courtyard Wing
              </div>
            </div>

            <div
              style={{
                position: "relative",
                height: "280px",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <Image
                src="/images/campus-gate-bus.jpg"
                alt="School Main Gate & Transport Bus"
                fill
                sizes="(min-width: 768px) 300px, 50vw"
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  insetInline: 0,
                  backgroundColor: "rgba(10, 25, 45, 0.75)",
                  color: "#ffffff",
                  padding: "0.4rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                Transport Gate &amp; Buses
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
}
