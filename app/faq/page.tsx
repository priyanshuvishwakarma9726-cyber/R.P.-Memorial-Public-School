"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import { FAQS, SCHOOL_INFO } from "@/lib/data/school-data";

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Verified institutional details, admissions assistance, and school policies."
        badge="Inquiry Desk"
        breadcrumbs={[{ label: "FAQs" }]}
      />

      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <SectionHeader
            tag="General Inquiries"
            title="Common Questions & Official Answers"
            description="Verified responses based strictly on confirmed CBSE disclosure and institutional records."
          />

          <div
            style={{
              maxWidth: "840px",
              margin: "0 auto 3.5rem auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--color-bg)",
                    border: "1px solid",
                    borderColor: isOpen ? "var(--color-gold)" : "var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    transition: "border-color var(--transition-fast)",
                  }}
                >
                  <button
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    style={{
                      width: "100%",
                      padding: "1.25rem 1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "var(--color-primary)",
                      }}
                    >
                      {faq.q}
                    </span>

                    <span style={{ color: "var(--color-gold-dark)", flexShrink: 0 }}>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: "0 1.5rem 1.25rem 1.5rem",
                        fontSize: "0.95rem",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.65,
                        borderTop: "1px solid var(--color-border-light)",
                        paddingTop: "1rem",
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Need Further Information Card */}
          <div
            style={{
              backgroundColor: "var(--color-surface-alt)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border)",
              padding: "2.5rem 2rem",
              textAlign: "center",
              maxWidth: "760px",
              margin: "0 auto",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
              Have an Unlisted Inquiry?
            </h3>
            <p style={{ fontSize: "0.925rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Our administrative helpdesk at Maharajganj is ready to assist parents with student admissions, transfer certificates, or school policies.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <a href={`tel:${SCHOOL_INFO.contact.phone}`} className="btn btn-primary btn-sm">
                <PhoneCall size={16} /> Call +91-{SCHOOL_INFO.contact.phone}
              </a>
              <Link href="/contact" className="btn btn-outline btn-sm">
                <Mail size={16} /> Send Direct Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
