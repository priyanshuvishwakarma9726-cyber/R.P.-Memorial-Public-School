"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Image as ImageIcon } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import Lightbox from "@/components/shared/Lightbox";
import { CAMPUS_GALLERY_IMAGES } from "@/lib/data/school-data";

export default function GalleryPreview() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (idx: number) => {
    setSelectedIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <section className="section" style={{ backgroundColor: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
      <div className="container">
        <SectionHeader
          tag="Campus Glimpse"
          title="Authentic Campus Life & Infrastructure"
          description="Photographic views of R.P. Memorial Public School premises and academic activities."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {CAMPUS_GALLERY_IMAGES.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              style={{
                position: "relative",
                height: "260px",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "var(--shadow-card)",
                border: "1px solid var(--color-border)",
              }}
              className="gallery-preview-card"
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                style={{ objectFit: "cover" }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 40%, rgba(10, 25, 45, 0.85) 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "1.25rem",
                  color: "#ffffff",
                  transition: "background var(--transition-fast)",
                }}
                className="gallery-overlay"
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--color-gold-light)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.2rem",
                  }}
                >
                  {img.category}
                </span>
                <h3 style={{ color: "#ffffff", fontSize: "0.95rem", lineHeight: 1.3, margin: 0 }}>
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/gallery" className="btn btn-outline">
            <ImageIcon size={16} />
            <span>Explore Complete Campus Gallery</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={CAMPUS_GALLERY_IMAGES}
        currentIndex={selectedIndex}
        onPrev={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : CAMPUS_GALLERY_IMAGES.length - 1))}
        onNext={() => setSelectedIndex((prev) => (prev < CAMPUS_GALLERY_IMAGES.length - 1 ? prev + 1 : 0))}
      />

      
    </section>
  );
}
