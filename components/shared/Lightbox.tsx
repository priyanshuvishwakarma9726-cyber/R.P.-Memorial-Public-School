"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: { title: string; src: string; category?: string; description?: string }[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onPrev,
  onNext,
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ zIndex: 1100, backgroundColor: "rgba(10, 18, 30, 0.92)" }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "1000px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#ffffff",
          }}
        >
          <span style={{ fontSize: "0.875rem", color: "var(--color-gold-light)" }}>
            {currentIndex + 1} of {images.length}
          </span>
          <button
            onClick={onClose}
            aria-label="Close image lightbox"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "#ffffff",
              padding: "0.5rem",
              borderRadius: "var(--radius-full)",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Image View */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "65vh",
            maxHeight: "600px",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            backgroundColor: "#000000",
          }}
        >
          <Image
            src={current.src}
            alt={current.title}
            fill
            sizes="1000px"
            style={{ objectFit: "contain" }}
          />

          {/* Navigation Arrows */}
          <button
            onClick={onPrev}
            aria-label="Previous image"
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              padding: "0.6rem",
              borderRadius: "var(--radius-full)",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={onNext}
            aria-label="Next image"
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              padding: "0.6rem",
              borderRadius: "var(--radius-full)",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Caption */}
        <div style={{ textAlign: "center", color: "#ffffff", maxWidth: "700px" }}>
          <h3 style={{ color: "#ffffff", fontSize: "1.1rem", marginBottom: "0.25rem" }}>
            {current.title}
          </h3>
          {current.description && (
            <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.85rem", margin: 0 }}>
              {current.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
