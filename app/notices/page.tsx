"use client";

import { useState } from "react";
import {
  Bell,
  Search,
  Pin,
  Calendar,
  FileText,
  Filter,
  Info,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import { SAMPLE_NOTICES, NoticeItem } from "@/lib/data/school-data";

export default function NoticesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Academic", "Administrative", "Examination", "Admission"];

  const filteredNotices = SAMPLE_NOTICES.filter((notice) => {
    const matchesCategory =
      selectedCategory === "All" || notice.category === selectedCategory;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PageHeader
        title="Notices & Announcements"
        subtitle="Official circulars, administrative notifications, and academic updates."
        badge="Notice Board"
        breadcrumbs={[{ label: "Notices" }]}
      />

      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <SectionHeader
            tag="Institutional Circulars"
            title="School Notice Board"
            description="Preview of institutional notice board system with category filtering and search."
          />

          {/* Integrity Disclaimer */}
          <div
            style={{
              backgroundColor: "var(--color-surface-alt)",
              border: "1px solid var(--color-border)",
              borderLeft: "4px solid var(--color-gold)",
              borderRadius: "var(--radius-md)",
              padding: "1rem 1.25rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <Info size={18} style={{ color: "var(--color-gold-dark)", flexShrink: 0 }} />
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
              <strong>Demo Content Notice:</strong> The notices shown below demonstrate the public frontend notification interface. Live official circulars are published upon administrative release.
            </div>
          </div>

          {/* Search and Category Filter */}
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
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Search circulars by keyword..."
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
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid",
                    backgroundColor: selectedCategory === cat ? "var(--color-primary)" : "var(--color-surface)",
                    color: selectedCategory === cat ? "#ffffff" : "var(--color-primary)",
                    borderColor: selectedCategory === cat ? "var(--color-primary)" : "var(--color-border)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notices List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "3rem" }}>
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className={`notice-card ${notice.isPinned ? "pinned" : ""}`}
                style={{ padding: "1.5rem 1.75rem" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {notice.isPinned && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          backgroundColor: "var(--color-gold)",
                          color: "#1a1708",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          textTransform: "uppercase",
                        }}
                      >
                        <Pin size={11} /> Pinned
                      </span>
                    )}

                    <span
                      style={{
                        backgroundColor: "rgba(14, 42, 71, 0.08)",
                        color: "var(--color-primary)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.15rem 0.6rem",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      {notice.category}
                    </span>

                    <span
                      style={{
                        fontSize: "0.7rem",
                        backgroundColor: "var(--color-surface-alt)",
                        color: "var(--color-text-muted)",
                        padding: "0.15rem 0.45rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      Sample Circular UI
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    <Calendar size={14} />
                    <span>{notice.date}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary)", margin: 0 }}>
                  {notice.title}
                </h3>

                <p style={{ fontSize: "0.925rem", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  {notice.description}
                </p>
              </div>
            ))}

            {filteredNotices.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)" }}>
                <p>No notices found matching your criteria.</p>
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                  className="btn btn-outline btn-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
