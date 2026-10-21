import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Shield,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Building,
  CheckCircle2,
  Calendar,
  Compass,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export const metadata: Metadata = {
  title: "About School",
  description: `Institutional overview and verified identity facts of ${SCHOOL_INFO.name}, Maharajganj.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Our School"
        subtitle="A disciplined institution dedicated to academic rigor and moral excellence in Maharajganj, Uttar Pradesh."
        badge="Institutional Profile"
        breadcrumbs={[{ label: "About School" }]}
      />

      {/* Main Overview Section */}
      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3.5rem",
              alignItems: "center",
              marginBottom: "3.5rem",
            }}
            className="about-grid"
          >
            <div>
              <span
                style={{
                  color: "var(--color-gold-dark)",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                  display: "inline-block",
                }}
              >
                Institutional Overview
              </span>

              <h2
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.3rem)",
                  fontWeight: 800,
                  color: "var(--color-primary)",
                  marginBottom: "1rem",
                }}
              >
                {SCHOOL_INFO.name}
              </h2>

              <p
                style={{
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  color: "var(--color-gold-dark)",
                  fontWeight: 600,
                  marginBottom: "1.25rem",
                }}
              >
                &ldquo;{SCHOOL_INFO.tagline}&rdquo;
              </p>

              <p style={{ fontSize: "1.05rem", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                <strong>{SCHOOL_INFO.name}</strong> is a co-educational secondary school situated in Partawal Bazar, Maharajganj, Uttar Pradesh (School Code: <strong>{SCHOOL_INFO.schoolCode}</strong>). The institution was established in 2011 to extend quality academic opportunities to students in the region.
              </p>

              <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                The campus is arranged across 8,130 sq. meters of dedicated educational land, featuring 50 classrooms, 6 specialized laboratory and computer science rooms, digital network connectivity, and trained educators headed by Principal <strong>{SCHOOL_INFO.principal.name} ({SCHOOL_INFO.principal.qualification})</strong>.
              </p>

              <div
                style={{
                  backgroundColor: "var(--color-surface-alt)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem 1.25rem",
                  fontSize: "0.875rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                <strong>Educational Philosophy:</strong> In adherence with the institutional motto <em>&ldquo;Read, Lead and Succeed&rdquo;</em>, the school prioritizes student discipline, foundational inquiry, moral values, and regular academic assessment.
              </div>
            </div>

            {/* Right: Real Campus Entrance */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  height: "420px",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-elevated)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Image
                  src="/images/campus-entrance.jpg"
                  alt="R.P. Memorial Public School Campus Building"
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  style={{ objectFit: "cover" }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "1rem",
                    right: "1rem",
                    backgroundColor: "rgba(10, 25, 45, 0.85)",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md)",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                  }}
                >
                  <strong>Institutional Campus Gate</strong> &bull; Partawal Bazar, Maharajganj
                </div>
              </div>
            </div>
          </div>

          {/* Verified Official Facts Summary Table */}
          <div style={{ marginTop: "2rem" }}>
            <SectionHeader
              tag="Institutional Record"
              title="Official School Registry Details"
              description="Confirmed data points from Central Board of Secondary Education public disclosure."
            />

            <div className="table-container" style={{ maxWidth: "880px", margin: "0 auto" }}>
              <table className="data-table">
                <tbody>
                  <tr>
                    <th style={{ width: "35%" }}>School Name</th>
                    <td><strong>{SCHOOL_INFO.name}</strong></td>
                  </tr>
                  <tr>
                    <th>Official Tagline</th>
                    <td>&ldquo;{SCHOOL_INFO.tagline}&rdquo;</td>
                  </tr>
                  <tr>
                    <th>Emblem Motto</th>
                    <td>&ldquo;Read Lead and Succeed&rdquo; (Since: 2011)</td>
                  </tr>
                  <tr>
                    <th>CBSE School Code</th>
                    <td><strong>{SCHOOL_INFO.schoolCode}</strong></td>
                  </tr>
                  <tr>
                    <th>Principal</th>
                    <td>{SCHOOL_INFO.principal.name}</td>
                  </tr>
                  <tr>
                    <th>Principal Qualification</th>
                    <td>{SCHOOL_INFO.principal.qualification}</td>
                  </tr>
                  <tr>
                    <th>Campus Address</th>
                    <td>
                      {SCHOOL_INFO.contact.address.line1} {SCHOOL_INFO.contact.address.line2}
                    </td>
                  </tr>
                  <tr>
                    <th>Contact Phone</th>
                    <td>+91-{SCHOOL_INFO.contact.phone}</td>
                  </tr>
                  <tr>
                    <th>Official Email</th>
                    <td>{SCHOOL_INFO.contact.email}</td>
                  </tr>
                  <tr>
                    <th>Total Campus Area</th>
                    <td>{SCHOOL_INFO.infrastructure.campusAreaSqM}</td>
                  </tr>
                  <tr>
                    <th>Total Classrooms</th>
                    <td>{SCHOOL_INFO.infrastructure.totalClassrooms} Rooms (47 sq. m each)</td>
                  </tr>
                  <tr>
                    <th>Laboratories Count</th>
                    <td>{SCHOOL_INFO.infrastructure.laboratoriesCount} Labs (56 sq. m each)</td>
                  </tr>
                  <tr>
                    <th>Internet Facility</th>
                    <td>{SCHOOL_INFO.infrastructure.internetFacility}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        
      </section>
    </>
  );
}
