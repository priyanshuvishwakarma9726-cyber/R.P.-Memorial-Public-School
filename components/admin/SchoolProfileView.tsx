"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
} from "lucide-react";
import type { School } from "@/lib/supabase/types";
import { updateSchoolProfile } from "@/lib/actions/admin-actions";

interface SchoolProfileViewProps {
  school: School;
  canEdit: boolean;
}

export default function SchoolProfileView({ school, canEdit }: SchoolProfileViewProps) {
  const [name, setName] = useState(school?.name || "R.P. MEMORIAL PUBLIC SCHOOL");
  const [tagline, setTagline] = useState(school?.tagline || "A School that leads to excellence");
  const [phone, setPhone] = useState(school?.phone || "8750067726");
  const [email, setEmail] = useState(school?.email || "rpmemorialp.school@gmail.com");
  const [address, setAddress] = useState(school?.address || "MAHARAJGANJ, MAHARAJGANJ, MAHARAJGANJ, UTTAR PRADESH - 273301");
  const [city, setCity] = useState(school?.city || "Maharajganj");
  const [state, setState] = useState(school?.state || "Uttar Pradesh");
  const [pincode, setPincode] = useState(school?.pincode || "273301");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const res = await updateSchoolProfile({
      name,
      tagline,
      phone,
      email,
      address,
      city,
      state,
      pincode,
    });

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "Failed to update school profile.");
    } else {
      setSuccessMsg(res.message || "Institutional profile updated successfully and logged to audit trail.");
    }
  };

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      {successMsg && (
        <div
          style={{
            backgroundColor: "var(--color-success-bg)",
            color: "var(--color-success)",
            padding: "0.85rem 1.25rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "1px solid rgba(22, 101, 52, 0.2)",
            fontSize: "0.85rem",
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            backgroundColor: "var(--color-error-bg)",
            color: "var(--color-error)",
            padding: "0.85rem 1.25rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "1px solid rgba(185, 28, 28, 0.2)",
            fontSize: "0.85rem",
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Emblem Preview & Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid var(--color-border)",
            marginBottom: "1.75rem",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid var(--color-border)",
              position: "relative",
              flexShrink: 0,
              backgroundColor: "#ffffff",
            }}
          >
            <Image
              src="/images/school-logo.png"
              alt="R.P. Memorial Public School logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <h2 style={{ fontSize: "1.25rem", color: "var(--color-primary)", margin: 0, fontWeight: 800 }}>
                {school?.name || "R.P. MEMORIAL PUBLIC SCHOOL"}
              </h2>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  backgroundColor: "rgba(14, 42, 71, 0.08)",
                  color: "var(--color-primary)",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                }}
              >
                Code: {school?.school_code || "2134039"}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              {school?.tagline || "A School that leads to excellence"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="schName">Official School Name *</label>
            <input
              id="schName"
              type="text"
              required
              value={name}
              disabled={!canEdit}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="schTagline">Official Tagline *</label>
            <input
              id="schTagline"
              type="text"
              required
              value={tagline}
              disabled={!canEdit}
              onChange={(e) => setTagline(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="schPhone">Primary Phone *</label>
              <input
                id="schPhone"
                type="tel"
                required
                value={phone}
                disabled={!canEdit}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="schEmail">Official Email *</label>
              <input
                id="schEmail"
                type="email"
                required
                value={email}
                disabled={!canEdit}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="schAddress">Campus Address *</label>
            <textarea
              id="schAddress"
              rows={2}
              required
              value={address}
              disabled={!canEdit}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="schCity">City</label>
              <input
                id="schCity"
                type="text"
                value={city}
                disabled={!canEdit}
                onChange={(e) => setCity(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="schState">State</label>
              <input
                id="schState"
                type="text"
                value={state}
                disabled={!canEdit}
                onChange={(e) => setState(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="schPin">PIN Code</label>
              <input
                id="schPin"
                type="text"
                value={pincode}
                disabled={!canEdit}
                onChange={(e) => setPincode(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {canEdit ? (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Save size={16} />
                {isSubmitting ? "Saving & Logging..." : "Update School Profile"}
              </button>
            </div>
          ) : (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-surface)",
                fontSize: "0.8rem",
                color: "var(--color-text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Lock size={14} />
              <span>Read-only view. School profile modifications require administrator authorization.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
