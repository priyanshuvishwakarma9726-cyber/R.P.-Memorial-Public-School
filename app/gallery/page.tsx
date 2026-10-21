"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Eye, CheckCircle2, Info } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import Lightbox from "@/components/shared/Lightbox";
import { CAMPUS_GALLERY_IMAGES } from "@/lib/data/school-data";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ["All", "Campus & Facade", "Infrastructure", "Academics"];

  const filteredImages = CAMPUS_GALLERY_IMAGES.filter((img) =>
    selectedCategory === "All" ? true : img.category === selectedCategory
  );

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Campus Photo Gallery"
        subtitle="Verified visual documentation of institutional grounds, classrooms, and academic sessions."
        badge="Photographic Archive"
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="section" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="container">
          <SectionHeader
            tag="Institutional Archives"
            title="School Grounds & Facilities"
            description="All photographs below depict authentic infrastructure at R.P. Memorial Public School, Maharajganj."
          />

          {/* Authenticity Notice */}
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
            <CheckCircle2 size={18} style={{ color: "var(--color-success)", flexShrink: 0 }} />
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
              <strong>Verified Photography Policy:</strong> This gallery exclusively hosts verified authentic photographs of the school premises. No artificial stock images or fabricated student scenes are used.
            </div>
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "2.5rem",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
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

          {/* Gallery Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.75rem",
              marginBottom: "3.5rem",
            }}
          >
            {filteredImages.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => openLightbox(idx)}
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-card)",
                  cursor: "pointer",
                  transition: "transform var(--transition-fast), box-shadow var(--transition-fast)",
                }}
                className="gallery-card"
              >
                <div style={{ position: "relative", height: "260px", width: "100%" }}>
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    sizes="(min-width: 1024px) 350px, (min-width: 640px) 50vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(10, 25, 45, 0.4)",
                      opacity: 0,
                      transition: "opacity var(--transition-fast)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                    }}
                    className="gallery-hover-icon"
                  >
                    <Eye size={32} />
                  </div>
                </div>

                <div style={{ padding: "1.25rem" }}>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--color-gold-dark)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {img.category}
                  </span>
                  <h3 style={{ fontSize: "1.05rem", color: "var(--color-primary)", marginBottom: "0.4rem" }}>
                    {img.title}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
                    {img.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </section>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={filteredImages}
        currentIndex={currentIndex}
        onPrev={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1))}
        onNext={() => setCurrentIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0))}
      />
    </>
  );
}
