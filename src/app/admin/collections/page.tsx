"use client";

import React, { useState, useEffect } from "react";
import { CATEGORY_METADATA } from "@/lib/catalogData";

export default function AdminCollectionsPage() {
  const [categories, setCategories] = useState<any[]>(Object.values(CATEGORY_METADATA));
  const [selectedCat, setSelectedCat] = useState<any>(categories[0]);
  const [originalSlug, setOriginalSlug] = useState<string>(categories[0]?.slug || "all");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load latest categories from API
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          const list = Object.values(data.categories);
          if (list.length > 0) {
            setCategories(list);
            setSelectedCat(list[0]);
            setOriginalSlug((list[0] as any).slug);
          }
        }
      })
      .catch(err => console.warn("Failed to load categories from DB:", err));
  }, []);

  const handleSelectCategory = (c: any) => {
    setSelectedCat(c);
    setOriginalSlug(c.slug);
    setSaveMessage(null);
  };

  const handleSaveCategory = async () => {
    if (!selectedCat) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const payload = {
        ...selectedCat,
        originalSlug: originalSlug
      };

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: `Collection "${selectedCat.title}" & Slug /${selectedCat.slug} saved to Database!` });

        // Update local list
        setCategories(prev => {
          const exists = prev.some(c => c.slug === originalSlug || c.slug === selectedCat.slug);
          if (exists) {
            return prev.map(c => (c.slug === originalSlug ? selectedCat : c));
          }
          return [...prev, selectedCat];
        });
        setOriginalSlug(selectedCat.slug);
      } else {
        setSaveMessage({ type: "error", text: data.error || "Failed to save category changes to database." });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Network request failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewCategory = () => {
    const newSlug = `new-collection-${Date.now().toString().slice(-4)}`;
    const newCat = {
      slug: newSlug,
      title: "New Luxury Collection",
      pageTitle: "New Luxury Collection | Swarn Mahal Jewellers Ambikapur",
      badge: "NEW ARRIVAL • 2026 EDITION",
      subtitle: "Explore handcrafted heirlooms and certified luxury jewellery.",
      heroBg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
      guideTitle: "New Collection Guide",
      guideDesc: "All Swarn Mahal items come with 100% BIS 916 hallmarking."
    };

    setCategories(prev => [...prev, newCat]);
    setSelectedCat(newCat);
    setOriginalSlug(newSlug);
    setSaveMessage({ type: "success", text: "New collection created! Edit details below and click Save." });
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories & Collections Tree Manager</h1>
          <p className="admin-page-desc">
            Configure navigational categories, custom slug identifiers, hero backgrounds, and buying guides (Saved to Database).
          </p>
        </div>

        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={handleAddNewCategory}
        >
          <i className="fa-solid fa-plus"></i> Add New Collection
        </button>
      </div>

      {saveMessage && (
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.88rem",
            fontWeight: 600,
            background: saveMessage.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: saveMessage.type === "success" ? "1px solid #10B981" : "1px solid #EF4444",
            color: saveMessage.type === "success" ? "#34D399" : "#F87171",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <i className={saveMessage.type === "success" ? "fa-solid fa-circle-check" : "fa-solid fa-triangle-exclamation"}></i>
          {saveMessage.text}
        </div>
      )}

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
                onClick={() => handleSelectCategory(c)}
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
        {selectedCat && (
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
              Editing Collection: <span style={{ color: "#C5A880" }}>{selectedCat.title}</span>
            </h3>

            <div className="admin-form-group">
              <label className="admin-label">Page Title</label>
              <input
                type="text"
                className="admin-input"
                value={selectedCat.pageTitle || ""}
                onChange={e => setSelectedCat({ ...selectedCat, pageTitle: e.target.value })}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="admin-form-group">
                <label className="admin-label">Hero Badge Text</label>
                <input
                  type="text"
                  className="admin-input"
                  value={selectedCat.badge || ""}
                  onChange={e => setSelectedCat({ ...selectedCat, badge: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label" style={{ color: "#C5A880", fontWeight: 700 }}>
                  <i className="fa-solid fa-pen-to-square" style={{ marginRight: "0.3rem" }}></i>
                  Slug Identifier (Editable)
                </label>
                <input
                  type="text"
                  className="admin-input"
                  style={{ borderColor: "#C5A880", background: "#1A1512", color: "#F3E5AB", fontWeight: 600 }}
                  value={selectedCat.slug || ""}
                  onChange={e => setSelectedCat({ ...selectedCat, slug: e.target.value })}
                  placeholder="e.g. gold, diamond, bridal-haar"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Subtitle Description</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={selectedCat.subtitle || ""}
                onChange={e => setSelectedCat({ ...selectedCat, subtitle: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Hero Background Image URL</label>
              <input
                type="text"
                className="admin-input"
                value={selectedCat.heroBg || ""}
                onChange={e => setSelectedCat({ ...selectedCat, heroBg: e.target.value })}
              />
            </div>

            {selectedCat.heroBg && (
              <div style={{ borderRadius: "8px", overflow: "hidden", height: "140px", marginBottom: "1.25rem", border: "1px solid rgba(197, 168, 128, 0.3)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedCat.heroBg} alt={selectedCat.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            <div className="admin-form-group">
              <label className="admin-label">Buying Guide Title</label>
              <input
                type="text"
                className="admin-input"
                value={selectedCat.guideTitle || ""}
                onChange={e => setSelectedCat({ ...selectedCat, guideTitle: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Buying Guide Description</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={selectedCat.guideDesc || ""}
                onChange={e => setSelectedCat({ ...selectedCat, guideDesc: e.target.value })}
              />
            </div>

            <button
              type="button"
              className="btn btn-gold btn-sm"
              onClick={handleSaveCategory}
              disabled={isSaving}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {isSaving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Saving to Database...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i> Save Category Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
