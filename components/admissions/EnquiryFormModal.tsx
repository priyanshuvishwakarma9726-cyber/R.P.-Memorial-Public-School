"use client";

import { useState } from "react";
import { X, CheckCircle2, Send, GraduationCap } from "lucide-react";

interface EnquiryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnquiryFormModal({ isOpen, onClose }: EnquiryFormModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    gradeSeeking: "Class I",
    phone: "",
    email: "",
    message: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 1: Mock submission state only (no backend, no database, no brevo)
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      studentName: "",
      parentName: "",
      gradeSeeking: "Class I",
      phone: "",
      email: "",
      message: "",
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "2rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "rgba(200, 147, 39, 0.15)",
                  color: "var(--color-gold-dark)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GraduationCap size={16} />
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-primary)" }}>
                Admission Enquiry
              </h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
              Phase 1 Preview &bull; Official Registration Helpdesk UI
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close form"
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              padding: "0.25rem",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
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

            <h4 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
              Enquiry Received
            </h4>

            <p style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Thank you, <strong>{formData.parentName || "Parent"}</strong>. Your enquiry for <strong>{formData.studentName || "Student"}</strong> ({formData.gradeSeeking}) has been recorded in the frontend preview state. Official admissions communication will be processed through school administrative desk.
            </p>

            <button onClick={resetForm} className="btn btn-primary" style={{ width: "100%" }}>
              Close Preview
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="studentName">Student Name *</label>
                <input
                  id="studentName"
                  type="text"
                  required
                  placeholder="e.g. Aryan Sharma"
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
                  placeholder="e.g. Rajesh Sharma"
                  className="form-input"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="gradeSeeking">Seeking Admission In</label>
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
              <label className="form-label" htmlFor="email">Email Address (Optional)</label>
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
              <label className="form-label" htmlFor="message">Any Specific Enquiry / Notes</label>
              <textarea
                id="message"
                rows={3}
                placeholder="Transport enquiry, academic queries, or previous schooling..."
                className="form-textarea"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
              * Phase 1 Frontend UI: Data will be connected to administrative database upon Phase 2 activation.
            </p>

            <button type="submit" className="btn btn-gold" style={{ width: "100%", padding: "0.8rem" }}>
              <Send size={16} /> Submit Admission Enquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
