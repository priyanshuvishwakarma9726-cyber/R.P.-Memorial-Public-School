"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import { SAMPLE_EVENTS, EventItem } from "@/lib/data/school-data";

export default function EventsPage() {
  const [tab, setTab] = useState<"Upcoming" | "Past">("Upcoming");

  const filteredEvents = SAMPLE_EVENTS.filter((e) => e.status === tab);

  return (
    <>
      <PageHeader
        title="School Events & Activities"
        subtitle="Co-curricular celebrations, athletic tournaments, and academic showcases at R.P. Memorial Public School."
        badge="Campus Life"
        breadcrumbs={[{ label: "Events" }]}
      />

      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <SectionHeader
            tag="Activity Calendar"
            title="School Celebrations & Meets"
            description="Preview of institutional event coordination system."
          />

          {/* Integrity Note */}
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
            <Info size={18} style={{ color: "var(--color-gold-dark)", flexShrink: 0 }} />
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
              <strong>Demo Interface Notice:</strong> Event cards represent recurring institutional events formatted for visual presentation. Exact dates will be populated from administrative calendars.
            </div>
          </div>

          {/* Tab Switcher */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.75rem",
              marginBottom: "2.5rem",
            }}
          >
            <button
              onClick={() => setTab("Upcoming")}
              style={{
                padding: "0.6rem 1.6rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                border: "1px solid",
                backgroundColor: tab === "Upcoming" ? "var(--color-primary)" : "var(--color-surface)",
                color: tab === "Upcoming" ? "#ffffff" : "var(--color-primary)",
                borderColor: tab === "Upcoming" ? "var(--color-primary)" : "var(--color-border)",
                transition: "all var(--transition-fast)",
              }}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setTab("Past")}
              style={{
                padding: "0.6rem 1.6rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                border: "1px solid",
                backgroundColor: tab === "Past" ? "var(--color-primary)" : "var(--color-surface)",
                color: tab === "Past" ? "#ffffff" : "var(--color-primary)",
                borderColor: tab === "Past" ? "var(--color-primary)" : "var(--color-border)",
                transition: "all var(--transition-fast)",
              }}
            >
              Past Celebrations
            </button>
          </div>

          {/* Event Cards */}
          <div className="grid-2" style={{ maxWidth: "960px", margin: "0 auto 3.5rem auto" }}>
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="card card-accent-top"
                style={{ padding: "2rem" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      backgroundColor: "rgba(14, 42, 71, 0.08)",
                      color: "var(--color-primary)",
                      padding: "0.15rem 0.6rem",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    {event.category}
                  </span>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-gold-dark)",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Calendar size={13} />
                    {event.date}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "0.6rem" }}>
                  {event.title}
                </h3>

                <p style={{ fontSize: "0.925rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                  {event.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                    borderTop: "1px solid var(--color-border-light)",
                    paddingTop: "0.75rem",
                  }}
                >
                  <MapPin size={13} />
                  <span>Main Campus Grounds &bull; Maharajganj</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link to School Calendar */}
          <div
            style={{
              backgroundColor: "var(--color-bg)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              padding: "1.75rem 2rem",
              textAlign: "center",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            <h4 style={{ fontSize: "1.1rem", color: "var(--color-primary)", marginBottom: "0.35rem" }}>
              Looking for Term Schedules &amp; Exam Dates?
            </h4>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
              Access the interactive annual schedule on our school calendar page.
            </p>
            <Link href="/calendar" className="btn btn-outline btn-sm">
              <Calendar size={16} /> Open School Calendar View
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
