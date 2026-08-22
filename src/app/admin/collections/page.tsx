"use client";

import React, { useState, useEffect } from "react";
import { CATEGORY_METADATA } from "@/lib/catalogData";

export default function AdminCollectionsPage() {
  const [categories, setCategories] = useState<any[]>(Object.values(CATEGORY_METADATA));
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedCat, setSelectedCat] = useState<any>(categories[0]);
  const [originalSlug, setOriginalSlug] = useState<string>(categories[0]?.slug || "all");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingCircle, setIsUploadingCircle] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Drag and Drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // New Category Modal State
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategorySlug, setNewCategorySlug] = useState<string>("");
  const [newCategoryCircleImg, setNewCategoryCircleImg] = useState<string>("");

  // Category Auto-Scroll Speed State
  const [scrollSpeed, setScrollSpeed] = useState<number>(25);
  const [isSavingSpeed, setIsSavingSpeed] = useState<boolean>(false);

  // Load latest categories and settings from API
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

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && data.settings && data.settings.categoryScrollSpeed) {
          const speed = parseInt(data.settings.categoryScrollSpeed, 10);
          if (!isNaN(speed) && speed > 0) {
            setScrollSpeed(speed);
          }
        }
      })
      .catch(err => console.warn("Failed to load settings:", err));
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
        setSaveMessage({ type: "success", text: `Collection "${selectedCat.title}" saved successfully!` });

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

  // Reorder Handler: Move First, Up, Down, Last
  const handleReorder = async (fromIdx: number, toIdx: number) => {
    if (fromIdx < 0 || fromIdx >= categories.length || toIdx < 0 || toIdx >= categories.length || fromIdx === toIdx) {
      return;
    }

    const updated = [...categories];
    const [movedItem] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, movedItem);

    setCategories(updated);

    // Update selected index if selected category moved
    const newSelectedIdx = updated.findIndex(c => c.slug === selectedCat?.slug);
    if (newSelectedIdx !== -1) {
      setSelectedIndex(newSelectedIdx);
    }

    // Persist reorder to API
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", categories: updated })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: `Category position updated! Live order saved.` });
      }
    } catch (err) {
      console.warn("Reorder save error:", err);
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (targetCategory?: any) => {
    const catToDelete = targetCategory || selectedCat;
    if (!catToDelete) return;

    if (!confirm(`Are you sure you want to delete the collection "${catToDelete.title}" (/${catToDelete.slug})?\n\nThis will remove it from the homepage circle stories and navigation bar.`)) {
      return;
    }

    setIsDeleting(true);
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/categories?slug=${encodeURIComponent(catToDelete.slug)}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const remaining = categories.filter(c => c.slug !== catToDelete.slug);
        setCategories(remaining);

        if (remaining.length > 0) {
          const nextIdx = Math.min(selectedIndex, remaining.length - 1);
          setSelectedCat(remaining[nextIdx]);
          setSelectedIndex(nextIdx);
          setOriginalSlug(remaining[nextIdx].slug);
        } else {
          setSelectedCat(null);
        }

        setSaveMessage({ type: "success", text: `Collection "${catToDelete.title}" (/${catToDelete.slug}) deleted successfully!` });
      } else {
        setSaveMessage({ type: "error", text: data.error || "Failed to delete collection." });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Delete request failed." });
    } finally {
      setIsDeleting(false);
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
    } finally {
      setNewCategoryName("");
      setNewCategorySlug("");
      setNewCategoryCircleImg("");
      setIsAddingNew(false);
    }
  };
  const handleSaveSpeed = async () => {
    setIsSavingSpeed(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryScrollSpeed: String(scrollSpeed) })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: `Homepage Category Auto-Scroll Speed updated to ${scrollSpeed} seconds!` });
      } else {
        setSaveMessage({ type: "error", text: "Failed to update category scroll speed." });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setIsSavingSpeed(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories & Collections Tree Manager</h1>
          <p className="admin-page-desc">
            Reorder, drag-and-drop, edit titles, custom slugs, upload circle story images, and delete collections (Saved to Database & Store).
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

      {/* AUTO-SCROLL SPEED CONTROL CARD */}
      <div
        className="admin-card"
        style={{
          background: "linear-gradient(135deg, #1C1814 0%, #120F0D 100%)",
          border: "1px solid var(--border-gold-subtle)",
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.75rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--gold-bright)", margin: "0 0 0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fa-solid fa-gauge-high"></i> Homepage Collection Auto-Scroll Timing / Speed
            </h3>
            <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", margin: 0 }}>
              Adjust how fast or slow the circular category bubbles move from right to left (In Seconds).
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.05)", padding: "0.4rem 0.85rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={scrollSpeed}
                onChange={e => setScrollSpeed(parseInt(e.target.value, 10))}
                style={{ cursor: "pointer", accentColor: "var(--gold-primary)" }}
              />
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#FFFFFF", minWidth: "45px", textAlign: "right" }}>
                {scrollSpeed}s
              </span>
            </div>

            <button
              type="button"
              className="btn btn-gold btn-sm"
              onClick={handleSaveSpeed}
              disabled={isSavingSpeed}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              {isSavingSpeed ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>}
              <span>Save Speed</span>
            </button>
          </div>
        </div>
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
                  placeholder="e.g. Earrings & Tops, Men's Rings"
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
                    placeholder="earrings-and-tops"
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
                  placeholder="https://... or /uploads/your-image.jpg"
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

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "2rem" }}>
        {/* Left: Category List with Direct Edit & Add Controls */}
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", margin: 0, fontFamily: "var(--font-serif)" }}>
                Active Categories ({categories.length})
              </h3>
              <span style={{ fontSize: "0.72rem", color: "#C5A880" }}>Drag or use arrows to reorder</span>
            </div>

            <button
              type="button"
              className="btn btn-gold btn-sm"
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
              onClick={() => setIsAddingNew(true)}
            >
              <i className="fa-solid fa-plus"></i> Add New
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "720px", overflowY: "auto", paddingRight: "0.25rem" }}>
            {categories.map((c, idx) => {
              const circleThumbnail = c.circleImg || c.thumbnail_image || c.heroBg || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80";
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={`${c.slug}-${idx}`}
                  draggable={true}
                  onDragStart={() => setDraggedIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      handleReorder(draggedIdx, idx);
                      setDraggedIdx(null);
                    }
                  }}
                  onClick={() => handleSelectCategory(c, idx)}
                  style={{
                    padding: "0.75rem 0.85rem",
                    borderRadius: "8px",
                    background: isSelected ? "rgba(197, 168, 128, 0.18)" : "#110E0C",
                    border: isSelected ? "1.5px solid #C5A880" : "1px solid rgba(197, 168, 128, 0.15)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    transition: "all 0.2s ease"
                  }}
                >
                  {/* Drag Grip Handle */}
                  <i
                    className="fa-solid fa-grip-vertical"
                    style={{ color: isSelected ? "#C5A880" : "#554C44", cursor: "grab", fontSize: "0.85rem" }}
                    title="Drag to reorder"
                  ></i>

                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", border: "1.5px solid #C5A880", flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={circleThumbnail} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.86rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.title}
                    </strong>
                    <span style={{ fontSize: "0.7rem", color: "#8C827A", display: "block" }}>/{c.slug}</span>
                  </div>

                  {/* Actions: Edit Button + Ordering Arrows + Delete Icon */}
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      title="Edit Category Details"
                      onClick={() => handleSelectCategory(c, idx)}
                      style={{
                        background: isSelected ? "var(--gold-deep)" : "rgba(197, 168, 128, 0.15)",
                        border: "1px solid #C5A880",
                        color: "#FFFFFF",
                        borderRadius: "4px",
                        padding: "2px 7px",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px"
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Edit
                    </button>

                    <button
                      type="button"
                      title="Move to First Position"
                      disabled={idx === 0}
                      onClick={() => handleReorder(idx, 0)}
                      style={{ background: "none", border: "none", color: idx === 0 ? "#332C26" : "#C5A880", cursor: idx === 0 ? "default" : "pointer", padding: "2px 3px", fontSize: "0.75rem" }}
                    >
                      <i className="fa-solid fa-angles-up"></i>
                    </button>
                    <button
                      type="button"
                      title="Move Up"
                      disabled={idx === 0}
                      onClick={() => handleReorder(idx, idx - 1)}
                      style={{ background: "none", border: "none", color: idx === 0 ? "#332C26" : "#F3E5AB", cursor: idx === 0 ? "default" : "pointer", padding: "2px 3px", fontSize: "0.75rem" }}
                    >
                      <i className="fa-solid fa-angle-up"></i>
                    </button>
                    <button
                      type="button"
                      title="Move Down"
                      disabled={idx === categories.length - 1}
                      onClick={() => handleReorder(idx, idx + 1)}
                      style={{ background: "none", border: "none", color: idx === categories.length - 1 ? "#332C26" : "#F3E5AB", cursor: idx === categories.length - 1 ? "default" : "pointer", padding: "2px 3px", fontSize: "0.75rem" }}
                    >
                      <i className="fa-solid fa-angle-down"></i>
                    </button>
                    <button
                      type="button"
                      title="Move to Last Position"
                      disabled={idx === categories.length - 1}
                      onClick={() => handleReorder(idx, categories.length - 1)}
                      style={{ background: "none", border: "none", color: idx === categories.length - 1 ? "#332C26" : "#C5A880", cursor: idx === categories.length - 1 ? "default" : "pointer", padding: "2px 3px", fontSize: "0.75rem" }}
                    >
                      <i className="fa-solid fa-angles-down"></i>
                    </button>

                    <button
                      type="button"
                      title="Delete Collection"
                      onClick={() => handleDeleteCategory(c)}
                      style={{ background: "none", border: "none", color: "#F87171", cursor: "pointer", padding: "2px 3px", fontSize: "0.75rem" }}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Category Editor */}
        {selectedCat ? (
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

              {/* DELETE COLLECTION BUTTON */}
              <button
                type="button"
                onClick={() => handleDeleteCategory(selectedCat)}
                disabled={isDeleting}
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid #EF4444",
                  color: "#F87171",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}
                title="Permanently Delete Collection"
              >
                <i className={isDeleting ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-trash-can"}></i>
                {isDeleting ? "Deleting..." : "Delete Collection"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="admin-form-group">
                <label className="admin-label">Collection Display Name (Circle & Title)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={selectedCat.title || ""}
                  onChange={e => setSelectedCat({ ...selectedCat, title: e.target.value })}
                  placeholder="e.g. Earrings & Tops, Pure Gold"
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

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
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
          </div>
        ) : (
          <div className="admin-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px", color: "#8C827A" }}>
            Select a collection from the left to edit or click "Add New".
          </div>
        )}
      </div>
    </div>
  );
}
