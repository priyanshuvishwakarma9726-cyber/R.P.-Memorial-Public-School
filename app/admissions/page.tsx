"use client";

import { useState } from "react";
import {
  GraduationCap,
  FileCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  PhoneCall,
  Send,
  HelpCircle,
  FileText,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import EmptyState from "@/components/shared/EmptyState";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export default function AdmissionsPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    gradeSeeking: "Class I",
    phone: "",
    email: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 1 Frontend mock success state only
    setFormSubmitted(true);
  };

  return (
    <>
      <PageHeader
        title="Admissions & Enrollment"
        subtitle="Transparent admission enquiry, required documentation guidelines, and process workflow."
        badge="Academic Year 2026-27"
        breadcrumbs={[{ label: "Admissions" }]}
      />

      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <SectionHeader
            tag="Enrollment Workflow"
            title="Step-by-Step Admission Procedure"
            description="Clear steps for parents and guardians seeking enrollment for their wards."
          />

          {/* Workflow Steps */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3.5rem",
            }}
          >
            {[
              {
                step: "01",
                title: "Enquiry Submission",
                desc: "Complete the online enquiry form or visit the school administrative office in Maharajganj.",
              },
              {
                step: "02",
                title: "Document Verification",
                desc: "Submit valid age certificate, previous school transfer certificate (TC), and address proof.",
              },
              {
                step: "03",
                title: "Parent Interaction",
                desc: "Informal consultation with academic staff to assess grade suitability and student readiness.",
              },
              {
                step: "04",
                title: "Enrollment Confirmation",
                desc: "Verification of documentation and completion of standard admission register procedures.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="card card-accent-top"
                style={{ padding: "1.75rem" }}
              >
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 900,
                    color: "var(--color-gold-dark)",
                    lineHeight: 1,
                    marginBottom: "0.75rem",
                  }}
                >
                  {s.step}
                </div>
                <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary)", marginBottom: "0.4rem" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.55, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Grid: Enquiry Form & Required Documents */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              alignItems: "start",
              marginBottom: "3.5rem",
            }}
            className="admission-form-grid"
          >
            {/* Left: Admissions Enquiry Form (Phase 1 UI mock state) */}
            <div
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                padding: "2.5rem 2rem",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <GraduationCap size={22} style={{ color: "var(--color-gold-dark)" }} />
                <h3 style={{ fontSize: "1.35rem", color: "var(--color-primary)", margin: 0 }}>
                  Online Admission Enquiry Form
                </h3>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
                Phase 1 Frontend Demonstration &bull; Direct data entry for prospective families
              </p>

              {formSubmitted ? (
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
                    Enquiry Form Submitted Successfully
                  </h4>
                  <p style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    Thank you, <strong>{formData.parentName || "Parent"}</strong>. We have logged your enquiry for <strong>{formData.studentName || "Student"}</strong> seeking admission in <strong>{formData.gradeSeeking}</strong>. Please retain reference note for school desk consultation.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        studentName: "",
                        parentName: "",
                        gradeSeeking: "Class I",
                        phone: "",
                        email: "",
                        notes: "",
                      });
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid-2" style={{ gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="studentName">Student Full Name *</label>
                      <input
                        id="studentName"
                        type="text"
                        required
                        placeholder="e.g. Priyanshu Maurya"
                        className="form-input"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="parentName">Parent / Guardian Name *</label>
                      <input
                        id="parentName"
                        type="text"
                        required
                        placeholder="e.g. Surendra Maurya"
                        className="form-input"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="gradeSeeking">Admission Seeking For</label>
                      <select
                        id="gradeSeeking"
                        className="form-select"
                        value={formData.gradeSeeking}
                        onChange={(e) => setFormData({ ...formData, gradeSeeking: e.target.value })}
                      >
                        <option value="Class I">Class I</option>
                        <option value="Class II">Class II</option>
                        <option value="Class III">Class III</option>
                        <option value="Class IV">Class IV</option>
                        <option value="Class V">Class V</option>
                        <option value="Class VI">Class VI</option>
                        <option value="Class VII">Class VII</option>
                        <option value="Class VIII">Class VIII</option>
                        <option value="Class IX">Class IX</option>
                        <option value="Class X">Class X</option>
                      </select>
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
                      placeholder="parent@example.com"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="notes">Queries or Comments</label>
                    <textarea
                      id="notes"
                      rows={3}
                      placeholder="Special requirements, previous school background, transport enquiry..."
                      className="form-textarea"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width: "100%", padding: "0.85rem" }}>
                    <Send size={16} /> Submit Admission Enquiry
                  </button>
                </form>
              )}
            </div>

            {/* Right: Required Documents & Eligibility Notice */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              <div
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "2rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <FileCheck size={20} style={{ color: "var(--color-primary)" }} />
                  <h3 style={{ fontSize: "1.2rem", color: "var(--color-primary)", margin: 0 }}>
                    Standard Documentation Checklist
                  </h3>
                </div>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {[
                    "Original Birth Certificate issued by competent municipal authority",
                    "Transfer Certificate (TC) countersigned from previous recognized school",
                    "Previous academic session progress report / marksheet",
                    "Passport size colored photographs of student (4 copies)",
                    "Photographs of father and mother / authorized guardian",
                    "Proof of residential address (Aadhaar / Voter ID / Utility bill)",
                  ].map((doc, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.875rem" }}>
                      <CheckCircle2 size={16} style={{ color: "var(--color-gold-dark)", flexShrink: 0, marginTop: "0.2rem" }} />
                      <span style={{ color: "var(--color-text-secondary)" }}>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Call Desk */}
              <div
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "#ffffff",
                  borderRadius: "var(--radius-xl)",
                  padding: "1.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-gold-light)", fontWeight: 700, textTransform: "uppercase" }}>
                    Admission Helpdesk
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff" }}>
                    Speak Directly With Admissions Desk
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
                    School Contact: +91-{SCHOOL_INFO.contact.phone}
                  </div>
                </div>

                <a href={`tel:${SCHOOL_INFO.contact.phone}`} className="btn btn-gold btn-sm">
                  <PhoneCall size={16} /> Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Important Dates & Fee Information States (Uninvented placeholder states) */}
          <SectionHeader
            tag="Session Information"
            title="Important Dates & Fee Structure"
            description="Official announcements regarding registration cycles and fee values."
          />

          <div className="grid-2">
            <div className="card">
              <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                Admission Dates &amp; Registration Schedule
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                Registration deadlines, entry test schedules, and merit confirmation windows will be officially published by the school administrative office.
              </p>
              <EmptyState
                title="Schedule Update Notice"
                description="Specific admission dates for the upcoming term will be published upon administrative notification."
                note="Do not rely on unverified third-party portals • Verify at school office"
              />
            </div>

            <div className="card">
              <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                Fee Schedule &amp; Installments
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                Annual tuition rates, development fund, transport fee, and examination levies are maintained in strict conformity with CBSE guidelines.
              </p>
              <EmptyState
                title="Fee Structure Notice"
                description="Detailed class-wise fee schedules are maintained by the school accounts department."
                note="Contact 8750067726 for official fee challan details"
              />
            </div>
          </div>
        </div>

        
      </section>
    </>
  );
}
