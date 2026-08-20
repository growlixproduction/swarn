"use client";

import React, { useState } from "react";
import { COLLAGE_GALLERY_DATA } from "../lib/catalogData";

const COLLAGE_CATEGORIES = [
  { key: "all", label: "All Showcases", icon: "fa-gem" },
  { key: "bridal", label: "Bridal & Rani Haar", icon: "fa-crown" },
  { key: "showroom", label: "Showroom Experience", icon: "fa-store" },
  { key: "solitaire", label: "Diamonds & Solitaires", icon: "fa-ring" },
  { key: "mangalsutra", label: "Mangalsutras", icon: "fa-heart" },
  { key: "silver", label: "925 Silverware", icon: "fa-coins" }
];

const CollageGallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxItem, setLightboxItem] = useState<typeof COLLAGE_GALLERY_DATA[0] | null>(null);

  const filtered = activeCategory === "all"
    ? COLLAGE_GALLERY_DATA
    : COLLAGE_GALLERY_DATA.filter(item => item.category === activeCategory);

  return (
    <section className="luxury-collage-section" id="gallery-section">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">ARTISANAL MASTERWORKS & SHOWROOM</span>
          <h2 className="section-title">Curated Heirlooms & Showroom Gallery</h2>
          <p className="section-subtitle">
            Explore 22K royal bridal suites, sacred mangalsutras, and authentic moments from our Ambikapur flagship showroom.
          </p>
        </div>

        {/* 21st.dev Style Interactive Category Filter Bar */}
        <div className="collage-filter-bar reveal-scale">
          {COLLAGE_CATEGORIES.map(c => (
            <button
              key={c.key}
              type="button"
              className={`collage-pill-btn ${activeCategory === c.key ? "active" : ""}`}
              onClick={() => setActiveCategory(c.key)}
            >
              <i className={`fa-solid ${c.icon}`}></i> {c.label}
            </button>
          ))}
        </div>

        {/* Asymmetric 12-Column Masonry Bento Grid */}
        <div className="collage-masonry-grid reveal-stagger" id="collage-grid-container">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`collage-item ${item.spanClass} reveal-scale`}
              onClick={() => setLightboxItem(item)}
              style={{ cursor: "pointer" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="collage-img" src={item.image} alt={item.title} loading="lazy" />
              <div className="collage-overlay"></div>
              <div className="collage-top-tag">{item.badge}</div>
              <div className="collage-bottom-plaque">
                <div className="collage-info-col">
                  <h4 className="collage-title">{item.title}</h4>
                  <p className="collage-specs">{item.specs}</p>
                </div>
                <div className="collage-expand-btn">
                  <i className="fa-solid fa-expand"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="modal-backdrop active" onClick={() => setLightboxItem(null)}>
          <div className="modal-window breakup-modal-window" onClick={e => e.stopPropagation()} style={{ maxWidth: "680px" }}>
            <button type="button" className="modal-close-btn" onClick={() => setLightboxItem(null)} title="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div style={{ borderRadius: "12px", overflow: "hidden", maxHeight: "450px", marginBottom: "1rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightboxItem.image} alt={lightboxItem.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="modal-header" style={{ padding: "0.5rem 0", borderBottom: "none" }}>
              <span className="section-tag">{lightboxItem.badge}</span>
              <h3 style={{ fontSize: "1.4rem", margin: "0.25rem 0" }}>{lightboxItem.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>{lightboxItem.desc}</p>
              <div style={{ background: "var(--bg-tint-gold)", padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid var(--border-gold)", marginTop: "0.8rem", fontSize: "0.82rem", fontWeight: 600 }}>
                {lightboxItem.specs}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CollageGallerySection;
