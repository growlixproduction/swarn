"use client";

import React, { useState } from "react";
import { CATEGORY_METADATA } from "@/lib/catalogData";

export default function AdminCollectionsPage() {
  const [categories, setCategories] = useState(Object.values(CATEGORY_METADATA));
  const [selectedCat, setSelectedCat] = useState(categories[0]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories & Collections Tree Manager</h1>
          <p className="admin-page-desc">
            Configure navigational categories, nested sub-collections, hero backgrounds, and jewellery buying guides.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={() => alert("Add Category Modal: Allows creating new taxonomy nodes like Men's Jewellery, Kids Nazariya, or Silverware.")}
        >
          <i className="fa-solid fa-plus"></i> Add New Collection
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        {/* Left: Category List */}
        <div className="admin-card">
          <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
            Active Categories ({categories.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {categories.map(c => (
              <div
                key={c.slug}
                onClick={() => setSelectedCat(c)}
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  background: selectedCat.slug === c.slug ? "rgba(197, 168, 128, 0.18)" : "#110E0C",
                  border: selectedCat.slug === c.slug ? "1px solid #C5A880" : "1px solid rgba(197, 168, 128, 0.15)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.88rem" }}>{c.title}</strong>
                  <span style={{ fontSize: "0.72rem", color: "#8C827A" }}>/{c.slug}</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.75rem", color: "#C5A880" }}></i>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Category Editor */}
        <div className="admin-card">
          <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
            Editing Collection: <span style={{ color: "#C5A880" }}>{selectedCat.title}</span>
          </h3>

          <div className="admin-form-group">
            <label className="admin-label">Page Title</label>
            <input
              type="text"
              className="admin-input"
              value={selectedCat.pageTitle}
              onChange={e => setSelectedCat({ ...selectedCat, pageTitle: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="admin-form-group">
              <label className="admin-label">Hero Badge Text</label>
              <input
                type="text"
                className="admin-input"
                value={selectedCat.badge}
                onChange={e => setSelectedCat({ ...selectedCat, badge: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Slug Identifier</label>
              <input type="text" className="admin-input" value={selectedCat.slug} disabled />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Subtitle Description</label>
            <textarea
              rows={2}
              className="admin-textarea"
              value={selectedCat.subtitle}
              onChange={e => setSelectedCat({ ...selectedCat, subtitle: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Hero Background Image URL</label>
            <input
              type="text"
              className="admin-input"
              value={selectedCat.heroBg}
              onChange={e => setSelectedCat({ ...selectedCat, heroBg: e.target.value })}
            />
          </div>

          <div style={{ borderRadius: "8px", overflow: "hidden", height: "140px", marginBottom: "1.25rem", border: "1px solid rgba(197, 168, 128, 0.3)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedCat.heroBg} alt={selectedCat.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Buying Guide Title</label>
            <input
              type="text"
              className="admin-input"
              value={selectedCat.guideTitle}
              onChange={e => setSelectedCat({ ...selectedCat, guideTitle: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Buying Guide Description</label>
            <textarea
              rows={3}
              className="admin-textarea"
              value={selectedCat.guideDesc}
              onChange={e => setSelectedCat({ ...selectedCat, guideDesc: e.target.value })}
            />
          </div>

          <button
            type="button"
            className="btn btn-gold btn-sm"
            onClick={() => alert(`Collection ${selectedCat.title} changes saved successfully!`)}
          >
            <i className="fa-solid fa-check"></i> Save Category Changes
          </button>
        </div>
      </div>
    </div>
  );
}
