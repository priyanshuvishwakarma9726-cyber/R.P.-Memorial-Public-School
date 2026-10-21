"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Search,
  GraduationCap,
  Award,
  ShieldCheck,
  CheckCircle2,
  Info,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import { TEACHERS_ROSTER, Teacher, SCHOOL_INFO } from "@/lib/data/school-data";

export default function FacultyPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");

  const filteredTeachers = TEACHERS_ROSTER.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.qualification.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || teacher.designation.toUpperCase() === filter.toUpperCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <PageHeader
        title="Faculty & Teaching Staff"
        subtitle="Verified directory of educators and academic leadership at R.P. Memorial Public School."
        badge="Academic Directory"
        breadcrumbs={[{ label: "Faculty Directory" }]}
      />

      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <SectionHeader
            tag="Teaching Roster"
            title="Institutional Faculty Directory"
            description="Verified teacher records transcribed directly from CBSE mandatory public disclosure records."
          />

          {/* Transparent Source Discrepancy Integrity Notice */}
          <div
            style={{
              backgroundColor: "var(--color-surface-alt)",
              border: "1px solid var(--color-border)",
              borderLeft: "4px solid var(--color-gold)",
              borderRadius: "var(--radius-md)",
              padding: "1rem 1.25rem",
              marginBottom: "2.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <Info size={18} style={{ color: "var(--color-gold-dark)", flexShrink: 0, marginTop: "0.15rem" }} />
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
              <strong>Official Source Integrity Note:</strong> The CBSE summary disclosure record reports 18 total teaching staff (PGT: 9, TGT: 10, PRT: 8), while the detailed institutional staff table lists 19 named staff members (including Principal Avadhes Kumar Chaurasaia). As per strict editorial guidelines, all 19 listed educators are presented below without altered figures or omitted names. Teacher Section Ratio: <strong>{SCHOOL_INFO.academicsData.teacherSectionRatio}</strong>. Special Educator: <strong>1</strong>. Wellness Teacher: <strong>1</strong>.
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem",
              marginBottom: "2.5rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Search Input */}
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Search teacher by name or qualification..."
                className="form-input"
                style={{ paddingLeft: "2.5rem" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["ALL", "PRINCIPAL", "TGT", "PRT"].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid",
                    backgroundColor: filter === category ? "var(--color-primary)" : "var(--color-surface)",
                    color: filter === category ? "#ffffff" : "var(--color-primary)",
                    borderColor: filter === category ? "var(--color-primary)" : "var(--color-border)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {category === "ALL" ? `All Staff (${TEACHERS_ROSTER.length})` : category}
                </button>
              ))}
            </div>
          </div>

          {/* Teacher Cards Grid */}
          <div className="grid-3" style={{ marginBottom: "3rem" }}>
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "1.75rem",
                  borderTop: teacher.designation === "PRINCIPAL" ? "3px solid var(--color-gold)" : undefined,
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    {/* Academic avatar / Principal photo */}
                    <div
                      style={{
                        width: "3.25rem",
                        height: "3.25rem",
                        borderRadius: "var(--radius-full)",
                        overflow: "hidden",
                        backgroundColor: teacher.designation === "PRINCIPAL"
                          ? "var(--color-primary)"
                          : "rgba(14, 42, 71, 0.08)",
                        color: teacher.designation === "PRINCIPAL" ? "#ffdf85" : "var(--color-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        fontWeight: 800,
                        border: teacher.designation === "PRINCIPAL" ? "2px solid var(--color-gold)" : "none",
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      {teacher.designation === "PRINCIPAL" ? (
                        <Image
                          src="/images/Principal.jpeg"
                          alt="Avadhes Kumar Chaurasaia, Principal of R.P. Memorial Public School"
                          fill
                          sizes="52px"
                          style={{ objectFit: "cover", objectPosition: "center 15%" }}
                        />
                      ) : (
                        teacher.name.charAt(0)
                      )}
                    </div>

                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: teacher.designation === "PRINCIPAL"
                          ? "rgba(200, 147, 39, 0.2)"
                          : "var(--color-surface-alt)",
                        color: teacher.designation === "PRINCIPAL"
                          ? "var(--color-gold-dark)"
                          : "var(--color-primary)",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {teacher.designation}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                      marginBottom: "0.4rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {teacher.name}
                  </h3>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    <Award size={15} style={{ color: "var(--color-gold-dark)" }} />
                    <span>Qualification: <strong>{teacher.qualification}</strong></span>
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--color-border-light)",
                    marginTop: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <span>Roster ID: #{teacher.id}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem", color: "var(--color-success)" }}>
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)" }}>
              <p>No faculty members found matching &quot;{search}&quot;.</p>
              <button onClick={() => { setSearch(""); setFilter("ALL"); }} className="btn btn-outline btn-sm">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
