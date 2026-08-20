"use client";

import React, { useState } from "react";

export default function AdminBannersPage() {
  const [slides, setSlides] = useState([
    {
      id: 1,
      tag: "BRIDAL COUTURE 2026",
      titleMain: "ROYAL HEIRLOOMS &",
      titleItalic: "BRIDAL KUNDAN",
      desc: "Intricately woven 22K gold with uncut diamonds, emeralds & pearls crafted for brides.",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
      btnText: "EXPLORE HERITAGE",
      btnLink: "/collections/wedding"
    },
    {
      id: 2,
      tag: "FESTIVE COLLECTION • FLAT 20% OFF",
      titleMain: "SWARN MAHAL",
      titleItalic: "THE FESTIVE EDIT",
      desc: "Flat 20% Off on making charges across all 22K Hallmark gold & bridal rani haar suites.",
      image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
      btnText: "SHOP FESTIVE",
      btnLink: "/collections/gold"
    },
    {
      id: 3,
      tag: "STARTING FROM ₹14,999",
      titleMain: "MINIMAL LUXE &",
      titleItalic: "SOLITAIRES",
      desc: "Handcrafted 18K & 22K gold rings and lightweight hoop earrings for dynamic lifestyles.",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85",
      btnText: "EXPLORE MINIMAL",
      btnLink: "/collections/diamond"
    },
    {
      id: 4,
      tag: "ESTABLISHED 2015 • AMBIKAPUR",
      titleMain: "TIMELESS TRUST &",
      titleItalic: "100% TRANSPARENCY",
      desc: "North Chhattisgarh's benchmark showroom on Church Road, Joda Pipal, Maharaja Gali.",
      image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (10).jpeg",
      btnText: "VISIT SHOWROOM",
      btnLink: "/#showroom-section"
    }
  ]);

  const [selectedSlide, setSelectedSlide] = useState(slides[0]);

  const handleUpdateSlide = () => {
    setSlides(slides.map(s => (s.id === selectedSlide.id ? selectedSlide : s)));
    alert(`Hero Slide ${selectedSlide.id} updated successfully!`);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Hero Slider & Promotional Banner Studio</h1>
          <p className="admin-page-desc">
            Customize the homepage curved plaque slider, seasonal marketing campaigns, and spotlight promotions.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={() => alert("New Slide Modal Activated.")}
        >
          <i className="fa-solid fa-plus"></i> Add New Slide
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        {/* Slide Selector Cards */}
        <div className="admin-card">
          <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
            Homepage Curved Slides ({slides.length})
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {slides.map(s => (
              <div
                key={s.id}
                onClick={() => setSelectedSlide(s)}
                style={{
                  padding: "0.85rem",
                  borderRadius: "8px",
                  background: selectedSlide.id === s.id ? "rgba(197, 168, 128, 0.18)" : "#110E0C",
                  border: selectedSlide.id === s.id ? "1px solid #C5A880" : "1px solid rgba(197, 168, 128, 0.15)",
                  cursor: "pointer",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center"
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.titleMain} style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Slide {s.id}: {s.titleMain}
                  </strong>
                  <span style={{ fontSize: "0.68rem", color: "#C5A880" }}>{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Slide Editor */}
        <div className="admin-card">
          <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
            Editing Slide {selectedSlide.id}: <span style={{ color: "#C5A880" }}>{selectedSlide.titleMain}</span>
          </h3>

          <div className="admin-form-group">
            <label className="admin-label">Tag Badge Text</label>
            <input
              type="text"
              className="admin-input"
              value={selectedSlide.tag}
              onChange={e => setSelectedSlide({ ...selectedSlide, tag: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="admin-form-group">
              <label className="admin-label">Heading Main Text</label>
              <input
                type="text"
                className="admin-input"
                value={selectedSlide.titleMain}
                onChange={e => setSelectedSlide({ ...selectedSlide, titleMain: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Heading Italic Gold Accent</label>
              <input
                type="text"
                className="admin-input"
                value={selectedSlide.titleItalic}
                onChange={e => setSelectedSlide({ ...selectedSlide, titleItalic: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Slide Subtitle / Description</label>
            <textarea
              rows={2}
              className="admin-textarea"
              value={selectedSlide.desc}
              onChange={e => setSelectedSlide({ ...selectedSlide, desc: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Background Image URL</label>
            <input
              type="text"
              className="admin-input"
              value={selectedSlide.image}
              onChange={e => setSelectedSlide({ ...selectedSlide, image: e.target.value })}
            />
          </div>

          {/* Real-time Curved Plaque Preview */}
          <div style={{ position: "relative", height: "180px", borderRadius: "14px", overflow: "hidden", marginBottom: "1.25rem", border: "1px solid rgba(197, 168, 128, 0.3)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedSlide.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(90deg, rgba(16, 12, 10, 0.94) 0%, rgba(16, 12, 10, 0.7) 60%, transparent 100%)", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontSize: "0.68rem", color: "#FFFFFF", background: "rgba(255,255,255,0.15)", padding: "0.2rem 0.5rem", borderRadius: "12px", display: "inline-block", width: "fit-content", marginBottom: "0.4rem" }}>
                {selectedSlide.tag}
              </span>
              <h4 style={{ color: "#FFFFFF", fontSize: "1.1rem", margin: 0, fontFamily: "var(--font-serif)" }}>
                {selectedSlide.titleMain} <span style={{ color: "#C5A880", fontStyle: "italic" }}>{selectedSlide.titleItalic}</span>
              </h4>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="admin-form-group">
              <label className="admin-label">Button CTA Text</label>
              <input
                type="text"
                className="admin-input"
                value={selectedSlide.btnText}
                onChange={e => setSelectedSlide({ ...selectedSlide, btnText: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Button Destination URL</label>
              <input
                type="text"
                className="admin-input"
                value={selectedSlide.btnLink}
                onChange={e => setSelectedSlide({ ...selectedSlide, btnLink: e.target.value })}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-gold btn-sm"
            onClick={handleUpdateSlide}
          >
            <i className="fa-solid fa-check"></i> Save Slide Settings
          </button>
        </div>
      </div>
    </div>
  );
}
