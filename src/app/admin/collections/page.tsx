"use client";

import React, { useState, useEffect } from "react";
import { CATEGORY_METADATA } from "@/lib/catalogData";

export default function AdminCollectionsPage() {
  const [categories, setCategories] = useState<any[]>(Object.values(CATEGORY_METADATA));
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedCat, setSelectedCat] = useState<any>(categories[0]);
  const [originalSlug, setOriginalSlug] = useState<string>(categories[0]?.slug || "all");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCircle, setIsUploadingCircle] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Category Modal State
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategorySlug, setNewCategorySlug] = useState<string>("");
  const [newCategoryCircleImg, setNewCategoryCircleImg] = useState<string>("");

  // Load latest categories from API / Store
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
      .catch(err => console.warn("Failed to load categories:", err));
  }, []);

  const handleSelectCategory = (c: any, idx: number) => {
    setSelectedCat(c);
    setSelectedIndex(idx);
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
        setSaveMessage({ type: "success", text: `Collection "${selectedCat.title}" & Circle Image saved successfully!` });

        if (data.categories) {
          const list = Object.values(data.categories);
          setCategories(list);
          const updatedSelected = data.category || list.find((item: any) => item.slug === selectedCat.slug) || selectedCat;
          setSelectedCat(updatedSelected);
          setOriginalSlug(updatedSelected.slug);
        }
      } else {
        setSaveMessage({ type: "error", text: data.error || "Failed to save category changes." });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Network request failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: "circleImg" | "heroBg") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (targetField === "circleImg") setIsUploadingCircle(true);
    else setIsUploadingHero(true);

    setSaveMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        if (targetField === "circleImg") {
          setSelectedCat((prev: any) => ({ ...prev, circleImg: data.url, thumbnail_image: data.url }));
        } else {
          setSelectedCat((prev: any) => ({ ...prev, heroBg: data.url }));
        }
        setSaveMessage({ type: "success", text: `Image "${file.name}" uploaded! Click "Save Category & Circle Image" below to apply.` });
      } else {
        setSaveMessage({ type: "error", text: data.error || "Failed to upload image file." });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Image upload failed." });
    } finally {
      setIsUploadingCircle(false);
      setIsUploadingHero(false);
    }
  };

  const handleAddNewCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const slug = (newCategorySlug.trim() || newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
      .replace(/^-+|-+$/g, "");

    const circleImage = newCategoryCircleImg.trim() || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80";

    const newCat = {
      slug: slug || `category-${Date.now()}`,
      title: newCategoryName.trim(),
      pageTitle: `${newCategoryName.trim()} | Swarn Mahal Jewellers Ambikapur`,
      badge: "NEW CURATION • LUXURY COLLECTION",
      subtitle: `Explore handcrafted ${newCategoryName.trim()} in pure BIS 916 gold and authentic gemstones.`,
      heroBg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
      circleImg: circleImage,
      thumbnail_image: circleImage,
      guideTitle: `${newCategoryName.trim()} Buying & Care Guide`,
      guideDesc: "Every design is crafted with BIS 916 certified hallmarked purity and accompanied by an authentic purity certificate."
    };

    setIsAddingNew(false);

    // Save directly to API
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat)
      });
      const data = await res.json();
      if (data && data.categories) {
        const list = Object.values(data.categories);
        setCategories(list);
        setSelectedCat(newCat);
        setSelectedIndex(list.length - 1);
        setOriginalSlug(newCat.slug);
      }
      setSaveMessage({ type: "success", text: `New collection "${newCat.title}" (/${newCat.slug}) created!` });
    } catch (err) {
      setCategories(prev => [...prev, newCat]);
      setSelectedCat(newCat);
      setSelectedIndex(categories.length);
      setOriginalSlug(newCat.slug);
      setSaveMessage({ type: "success", text: `New collection created! Click Save below to confirm.` });
    } finally {
      setNewCategoryName("");
      setNewCategorySlug("");
      setNewCategoryCircleImg("");
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories & Collections Tree Manager</h1>
          <p className="admin-page-desc">
            Configure navigational category titles, custom slugs, upload circle story images, hero backgrounds, and buying guides (Saved to Database & Store).
          </p>
        </div>

        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={() => setIsAddingNew(true)}
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

      {/* Modal for adding a new collection */}
      {isAddingNew && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
        >
          <div
            className="admin-card"
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "#16120F",
              border: "1px solid #C5A880",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.8)",
              padding: "1.75rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.15rem", color: "#FFFFFF", fontFamily: "var(--font-serif)", margin: 0 }}>
                Add New Collection
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                style={{ background: "none", border: "none", color: "#8C827A", cursor: "pointer", fontSize: "1.2rem" }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleAddNewCollection}>
              <div className="admin-form-group">
                <label className="admin-label">Collection Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Men's Heritage Rings, Silverware"
                  className="admin-input"
                  value={newCategoryName}
                  onChange={e => {
                    setNewCategoryName(e.target.value);
                    if (!newCategorySlug || newCategorySlug === newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
                      setNewCategorySlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  autoFocus
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Slug Identifier (URL Path)</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: "0.85rem", color: "#C5A880", fontSize: "0.85rem", pointerEvents: "none" }}>/</span>
                  <input
                    type="text"
                    placeholder="mens-heritage-rings"
                    className="admin-input"
                    style={{ paddingLeft: "1.75rem" }}
                    value={newCategorySlug}
                    onChange={e => setNewCategorySlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Homepage Circle Bubble Image URL</label>
                <input
                  type="text"
                  placeholder="https://... or /asset/your-image.jpeg"
                  className="admin-input"
                  value={newCategoryCircleImg}
                  onChange={e => setNewCategoryCircleImg(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsAddingNew(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm"
                >
                  <i className="fa-solid fa-plus"></i> Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        {/* Left: Category List */}
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", margin: 0, fontFamily: "var(--font-serif)" }}>
              Active Categories ({categories.length})
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#C5A880" }}>Click to edit</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "680px", overflowY: "auto", paddingRight: "0.25rem" }}>
            {categories.map((c, idx) => {
              const circleThumbnail = c.circleImg || c.thumbnail_image || c.heroBg || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80";
              return (
                <div
                  key={`${c.slug}-${idx}`}
                  onClick={() => handleSelectCategory(c, idx)}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "8px",
                    background: selectedIndex === idx ? "rgba(197, 168, 128, 0.18)" : "#110E0C",
                    border: selectedIndex === idx ? "1px solid #C5A880" : "1px solid rgba(197, 168, 128, 0.15)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", overflow: "hidden", border: "2px solid #C5A880", flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={circleThumbnail} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.88rem" }}>{c.title}</strong>
                    <span style={{ fontSize: "0.72rem", color: "#8C827A" }}>/{c.slug}</span>
                  </div>
                  <i
                    className="fa-solid fa-chevron-right"
                    style={{
                      fontSize: "0.75rem",
                      color: selectedIndex === idx ? "#C5A880" : "#4A433D",
                      transform: selectedIndex === idx ? "translateX(2px)" : "none"
                    }}
                  ></i>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Category Editor */}
        {selectedCat && (
          <div className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", borderBottom: "1px solid rgba(197, 168, 128, 0.15)", paddingBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", color: "#FFFFFF", margin: 0, fontFamily: "var(--font-serif)" }}>
                  Editing Collection: <span style={{ color: "#C5A880" }}>{selectedCat.title}</span>
                </h3>
                <span style={{ fontSize: "0.75rem", color: "#8C827A" }}>
                  Live Storefront Route: <span style={{ color: "#C5A880" }}>/collections/{selectedCat.slug}</span>
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="admin-form-group">
                <label className="admin-label">Collection Display Name (Circle & Title)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={selectedCat.title || ""}
                  onChange={e => setSelectedCat({ ...selectedCat, title: e.target.value })}
                  placeholder="e.g. Pure Gold Jewellery & Heirlooms"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" style={{ color: "#C5A880", fontWeight: 700 }}>
                  <i className="fa-solid fa-pen-to-square" style={{ marginRight: "0.3rem" }}></i>
                  Slug Identifier (Editable)
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: "0.85rem", color: "#C5A880", fontSize: "0.85rem", pointerEvents: "none" }}>/</span>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ paddingLeft: "1.75rem", borderColor: "#C5A880", background: "#1A1512", color: "#F3E5AB", fontWeight: 600 }}
                    value={selectedCat.slug || ""}
                    onChange={e => setSelectedCat({ ...selectedCat, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "") })}
                    placeholder="e.g. gold, diamond, wedding"
                  />
                </div>
              </div>
            </div>

            {/* CIRCULAR HOMEPAGE STORY BUBBLE CONTROL & DIRECT FOLDER FILE UPLOADER */}
            <div style={{ background: "#110E0C", border: "1.5px solid #C5A880", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #C5A880", padding: "2px", background: "#000", flexShrink: 0, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedCat.circleImg || selectedCat.thumbnail_image || selectedCat.heroBg || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80"}
                    alt={selectedCat.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                  />
                </div>
                <div>
                  <strong style={{ fontSize: "0.95rem", color: "#F3E5AB", display: "block" }}>
                    <i className="fa-solid fa-circle-dot" style={{ color: "#C5A880", marginRight: "0.4rem" }}></i>
                    Homepage Circle Story Bubble Image
                  </strong>
                  <span style={{ fontSize: "0.78rem", color: "#8C827A" }}>
                    Type URL or click <strong style={{ color: "#C5A880" }}>"Upload File"</strong> to select an image directly from your computer device.
                  </span>
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-label">Circle Image URL / Upload Asset</label>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ background: "#1A1512", color: "#FFFFFF", flexGrow: 1 }}
                    value={selectedCat.circleImg || selectedCat.thumbnail_image || ""}
                    onChange={e => setSelectedCat({ ...selectedCat, circleImg: e.target.value, thumbnail_image: e.target.value })}
                    placeholder="https://... or /uploads/your-image.jpg"
                  />
                  <label
                    style={{
                      background: "var(--gold-deep)",
                      color: "#FFFFFF",
                      padding: "0.65rem 1.1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                    }}
                  >
                    <i className={isUploadingCircle ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-cloud-arrow-up"}></i>
                    {isUploadingCircle ? "Uploading..." : "Upload File"}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={e => handleFileUpload(e, "circleImg")}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Page Title</label>
              <input
                type="text"
                className="admin-input"
                value={selectedCat.pageTitle || ""}
                onChange={e => setSelectedCat({ ...selectedCat, pageTitle: e.target.value })}
              />
            </div>

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
              <label className="admin-label">Subtitle Description</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={selectedCat.subtitle || ""}
                onChange={e => setSelectedCat({ ...selectedCat, subtitle: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Hero Banner Background Image URL</label>
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                <input
                  type="text"
                  className="admin-input"
                  style={{ flexGrow: 1 }}
                  value={selectedCat.heroBg || ""}
                  onChange={e => setSelectedCat({ ...selectedCat, heroBg: e.target.value })}
                  placeholder="https://... or /uploads/hero.jpg"
                />
                <label
                  style={{
                    background: "rgba(197, 168, 128, 0.2)",
                    border: "1px solid #C5A880",
                    color: "#F3E5AB",
                    padding: "0.65rem 1.1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    whiteSpace: "nowrap",
                    flexShrink: 0
                  }}
                >
                  <i className={isUploadingHero ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-folder-open"}></i>
                  {isUploadingHero ? "Uploading..." : "Upload File"}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={e => handleFileUpload(e, "heroBg")}
                  />
                </label>
              </div>
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
                  <i className="fa-solid fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i> Save Category & Circle Image
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
