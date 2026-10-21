"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 1 Frontend demonstration only
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        title="Contact School Office"
        subtitle="Reach out to the administrative staff at R.P. Memorial Public School, Maharajganj."
        badge="Office & Directory"
        breadcrumbs={[{ label: "Contact Us" }]}
      />

      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <SectionHeader
            tag="Direct Inquiries"
            title="School Office Communication Channels"
            description="Official contact channels for admissions, student records, and general administrative inquiries."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              alignItems: "start",
              marginBottom: "3.5rem",
            }}
            className="contact-grid"
          >
            {/* Left: Contact Form UI */}
            <div
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                padding: "2.5rem 2rem",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ fontSize: "1.35rem", color: "var(--color-primary)", marginBottom: "0.4rem" }}>
                Send Official Message
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "1.75rem" }}>
                Submit your query directly to school administrative records (Phase 1 UI demonstration).
              </p>

              {submitted ? (
                <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
                  <div
                    style={{
                      width: "4rem",
                      height: "4rem",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: "var(--color-success-bg)",
                      color: "var(--color-success)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.25rem auto",
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                    Message Received Successfully
                  </h4>
                  <p style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    Thank you, <strong>{formData.name}</strong>. Your query regarding <em>&quot;{formData.subject || "General Enquiry"}&quot;</em> has been captured in the frontend demo preview.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid-2" style={{ gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Your Full Name *</label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="e.g. Sunil Kumar"
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Contact Mobile Number *</label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        placeholder="10-digit mobile"
                        className="form-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">Subject / Inquiry Topic</label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="e.g. Admission Information / TC Certificate / Verification"
                      className="form-input"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Your Message *</label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      placeholder="Write your inquiry or question here..."
                      className="form-textarea"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width: "100%", padding: "0.85rem" }}>
                    <Send size={16} /> Send Message to School
                  </button>
                </form>
              )}
            </div>

            {/* Right: Verified Coordinates & Mobile Direct Call */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              <div
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "2rem",
                }}
              >
                <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary)", marginBottom: "1.25rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem" }}>
                  Verified School Details
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Address */}
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "rgba(14, 42, 71, 0.06)",
                        color: "var(--color-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                        School Campus Address
                      </div>
                      <div style={{ fontWeight: 700, color: "var(--color-primary)", fontSize: "1rem" }}>
                        {SCHOOL_INFO.name}
                      </div>
                      <div style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                        {SCHOOL_INFO.contact.address.line1}
                        <br />
                        {SCHOOL_INFO.contact.address.line2}
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--color-gold-subtle)",
                        color: "var(--color-gold-dark)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                        Direct Telephone
                      </div>
                      <a
                        href={`tel:${SCHOOL_INFO.contact.phone}`}
                        style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-primary)", textDecoration: "none" }}
                      >
                        +91-{SCHOOL_INFO.contact.phone}
                      </a>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        Administrative &amp; Admissions Helpdesk
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "rgba(14, 42, 71, 0.06)",
                        color: "var(--color-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                        Official Email
                      </div>
                      <a
                        href={`mailto:${SCHOOL_INFO.contact.email}`}
                        style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-primary)", textDecoration: "none", wordBreak: "break-all" }}
                      >
                        {SCHOOL_INFO.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Quick Call Button */}
              <a
                href={`tel:${SCHOOL_INFO.contact.phone}`}
                className="btn btn-gold btn-lg"
                style={{ width: "100%", textAlign: "center" }}
              >
                <PhoneCall size={20} /> Instant Call: {SCHOOL_INFO.contact.phone}
              </a>
            </div>
          </div>

          {/* Map Location UI (Safe search link without fabricated coordinates) */}
          <SectionHeader
            tag="Geographic Location"
            title="Campus Map Location"
            description="Verified location in Maharajganj, Uttar Pradesh (PIN 273301)."
          />

          <div
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem",
              textAlign: "center",
              maxWidth: "820px",
              margin: "0 auto",
            }}
          >
            <MapPin size={40} style={{ color: "var(--color-gold-dark)", margin: "0 auto 1rem auto" }} />
            <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
              {SCHOOL_INFO.name} Campus
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
              Located in Partawal Bazar, Maharajganj district, Uttar Pradesh - 273301. To protect geographic accuracy without unverified coordinates, access verified directions via Google Maps search.
            </p>
            <a
              href={SCHOOL_INFO.contact.address.googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span>Open Campus Location on Google Maps</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        
      </section>
    </>
  );
}
