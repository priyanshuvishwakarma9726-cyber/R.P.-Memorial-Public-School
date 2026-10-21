"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  AlertCircle,
  FileCheck,
  Clock,
  ShieldCheck,
  Search,
  Info,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import { DOWNLOAD_ITEMS } from "@/lib/data/school-data";

export default function DownloadsPage() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Admissions", "Academics", "Student Life", "Governance"];

  const filteredItems = DOWNLOAD_ITEMS.filter((item) => {
    const matchesFilter = filter === "All" || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <PageHeader
        title="Download Center"
        subtitle="Institutional forms, academic syllabi, guidelines, and administrative registers."
        badge="Document Repository"
        breadcrumbs={[{ label: "Downloads" }]}
      />

      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <SectionHeader
            tag="Document Portal"
            title="Institutional Resources & Forms"
            description="Downloadable templates and official academic handbooks for students and parents."
          />

          {/* Section B Exclusion Guarantee Notice */}
          <div
            style={{
              backgroundColor: "var(--color-surface-alt)",
              border: "1px solid var(--color-border)",
              borderLeft: "4px solid var(--color-gold)",
              borderRadius: "var(--radius-md)",
              padding: "1rem 1.25rem",
              marginBottom: "2.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <ShieldCheck size={20} style={{ color: "var(--color-gold-dark)", flexShrink: 0 }} />
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
              <strong>Phase 1 Repository Notice:</strong> This download center provides institutional and academic forms. In accordance with Phase 1 directives, Section B statutory certificates are omitted from public display.
            </div>
          </div>

          {/* Search & Filter Bar */}
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
            <div style={{ position: "relative", flex: "1 1 280px" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50)",
                  color: "var(--color-text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Search document name..."
                className="form-input"
                style={{ paddingLeft: "2.5rem" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid",
                    backgroundColor: filter === cat ? "var(--color-primary)" : "var(--color-surface)",
                    color: filter === cat ? "#ffffff" : "var(--color-primary)",
                    borderColor: filter === cat ? "var(--color-primary)" : "var(--color-border)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid-3" style={{ marginBottom: "3rem" }}>
            {filteredItems.map((doc) => (
              <div
                key={doc.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "1.75rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: "rgba(14, 42, 71, 0.08)",
                        color: "var(--color-primary)",
                        padding: "0.15rem 0.55rem",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      {doc.category}
                    </span>

                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                      {doc.format}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary)", marginBottom: "0.4rem" }}>
                    {doc.title}
                  </h3>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: "var(--color-gold-dark)", marginBottom: "1rem" }}>
                    <Clock size={13} />
                    <span>{doc.status}</span>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--color-border-light)",
                    paddingTop: "1rem",
                    marginTop: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    {doc.size}
                  </span>

                  <button
                    disabled
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      backgroundColor: "var(--color-surface-alt)",
                      color: "var(--color-text-muted)",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "not-allowed",
                      opacity: 0.8,
                    }}
                    title="Will be enabled when file is uploaded by school desk"
                  >
                    <Download size={13} />
                    <span>Upload Pending</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
