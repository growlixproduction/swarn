"use client";

import React, { useState, useEffect } from "react";

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "pages">("hero");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Hero Slides & Page Banners State
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<string>("");

  const [pageBanners, setPageBanners] = useState<Record<string, any>>({});
  const [selectedPageKey, setSelectedPageKey] = useState<string>("about");

  // Fetch live banners on mount
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (data.success) {
        setHeroSlides(data.heroSlides || []);
        if (data.heroSlides && data.heroSlides.length > 0) {
          setSelectedSlideId(data.heroSlides[0].id);
        }
        setPageBanners(data.pageBanners || {});
      }
    } catch (err) {
      console.error("Failed to load banners:", err);
    } finally {
      setLoading(false);
    }
  };

  // Active Hero Slide Data
  const currentSlide = heroSlides.find(s => s.id === selectedSlideId) || heroSlides[0];

  // Active Page Banner Data
  const currentBanner = pageBanners[selectedPageKey] || {
    pageKey: selectedPageKey,
    pageName: `${selectedPageKey.toUpperCase()} Page`,
    badge: "SWARN MAHAL EXCLUSIVE",
    title: "Page Header Banner Title",
    subtitle: "Page banner subtitle description...",
    backgroundImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    overlayGradient: "linear-gradient(135deg, rgba(28, 25, 23, 0.95) 0%, rgba(17, 14, 12, 0.88) 100%)"
  };

  // Update Hero Slide State
  const handleHeroSlideChange = (field: string, value: any) => {
    setHeroSlides(prev =>
      prev.map(s => (s.id === selectedSlideId ? { ...s, [field]: value } : s))
    );
  };

  // Update Page Banner State
  const handlePageBannerChange = (field: string, value: any) => {
    setPageBanners(prev => ({
      ...prev,
      [selectedPageKey]: {
        ...currentBanner,
        pageKey: selectedPageKey,
        [field]: value
      }
    }));
  };

  // Save all banners to API
  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroSlides, pageBanners })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: "All Banners & Page Headers updated live!" });
        setTimeout(() => setSaveMessage(null), 3500);
      } else {
        setSaveMessage({ type: "error", text: data.error || "Failed to save banners." });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Failed to save banners." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#C5A880" }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
        <p>Loading Banner & Hero Slider Studio...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "4rem" }}>
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1 className="admin-page-title" style={{ fontSize: "1.6rem" }}>Hero Slider & Page Banners Studio</h1>
          <p className="admin-page-desc" style={{ fontSize: "0.85rem" }}>
            Customize Homepage Hero Curved Slides and Top Banners for About Us, Calculator, Gold, Diamond, and Silver pages.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={handleSaveAll}
          disabled={isSaving}
        >
          {isSaving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>}
          <span>{isSaving ? "Saving Live..." : "Save All Banners Live"}</span>
        </button>
      </div>

      {saveMessage && (
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            background: saveMessage.type === "success" ? "rgba(16, 185, 129, 0.18)" : "rgba(239, 68, 68, 0.18)",
            border: `1px solid ${saveMessage.type === "success" ? "#10B981" : "#EF4444"}`,
            color: saveMessage.type === "success" ? "#34D399" : "#F87171",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <i className={`fa-solid ${saveMessage.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`}></i>
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Main Mode Tabs (Homepage Hero Slides vs Inner Page Top Banners) */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(197, 168, 128, 0.2)", paddingBottom: "0.75rem" }}>
        <button
          type="button"
          style={{
            padding: "0.65rem 1.25rem",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            border: activeTab === "hero" ? "1.5px solid #C5A880" : "1px solid rgba(197, 168, 128, 0.25)",
            background: activeTab === "hero" ? "#C5A880" : "#110E0C",
            color: activeTab === "hero" ? "#110E0C" : "#FFFFFF",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
          onClick={() => setActiveTab("hero")}
        >
          <i className="fa-solid fa-images"></i>
          <span>Homepage Hero Slider ({heroSlides.length})</span>
        </button>

        <button
          type="button"
          style={{
            padding: "0.65rem 1.25rem",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            border: activeTab === "pages" ? "1.5px solid #C5A880" : "1px solid rgba(197, 168, 128, 0.25)",
            background: activeTab === "pages" ? "#C5A880" : "#110E0C",
            color: activeTab === "pages" ? "#110E0C" : "#FFFFFF",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
          onClick={() => setActiveTab("pages")}
        >
          <i className="fa-solid fa-heading"></i>
          <span>Inner Page Top Banners (About, Calculator, Collections)</span>
        </button>
      </div>

      {/* TAB 1: HOMEPAGE HERO SLIDES STUDIO */}
      {activeTab === "hero" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.75rem" }}>
          {/* Left Slide List */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#F5EAD6", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
              Select Hero Slide to Edit
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {heroSlides.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSlideId(s.id)}
                  style={{
                    padding: "0.85rem",
                    borderRadius: "10px",
                    background: selectedSlideId === s.id ? "rgba(197, 168, 128, 0.18)" : "#110E0C",
                    border: selectedSlideId === s.id ? "1.5px solid #C5A880" : "1px solid rgba(197, 168, 128, 0.15)",
                    cursor: "pointer",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center"
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.backgroundImage} alt={s.titleMain} style={{ width: "65px", height: "42px", objectFit: "cover", borderRadius: "6px" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.84rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Slide {idx + 1}: {s.titleMain}
                    </strong>
                    <span style={{ fontSize: "0.68rem", color: "#C5A880" }}>{s.tagBadge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Editor for Selected Slide */}
          {currentSlide && (
            <div className="admin-card">
              <h3 style={{ fontSize: "1.05rem", color: "#F5EAD6", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
                Editing Slide: <span style={{ color: "#C5A880" }}>{currentSlide.titleMain}</span>
              </h3>

              <div className="admin-form-group">
                <label className="admin-label">Tag Badge Text</label>
                <input
                  type="text"
                  className="admin-input"
                  value={currentSlide.tagBadge || ""}
                  onChange={e => handleHeroSlideChange("tagBadge", e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="admin-form-group">
                  <label className="admin-label">Heading Main Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={currentSlide.titleMain || ""}
                    onChange={e => handleHeroSlideChange("titleMain", e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Heading Gold Accent Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={currentSlide.titleItalic || ""}
                    onChange={e => handleHeroSlideChange("titleItalic", e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Slide Subtitle / Description</label>
                <textarea
                  rows={3}
                  className="admin-textarea"
                  value={currentSlide.description || ""}
                  onChange={e => handleHeroSlideChange("description", e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="admin-form-group">
                  <label className="admin-label">Button Action Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={currentSlide.buttonText || ""}
                    onChange={e => handleHeroSlideChange("buttonText", e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Button Target Link URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={currentSlide.buttonLink || ""}
                    onChange={e => handleHeroSlideChange("buttonLink", e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Background Image URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={currentSlide.backgroundImage || ""}
                  onChange={e => handleHeroSlideChange("backgroundImage", e.target.value)}
                />
              </div>

              {/* Live Preview Card */}
              <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(197, 168, 128, 0.2)", paddingTop: "1.25rem" }}>
                <label className="admin-label" style={{ color: "#F5EAD6", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Live Slide Preview:
                </label>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "14px",
                    overflow: "hidden",
                    height: "180px",
                    backgroundImage: `url(${currentSlide.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    padding: "1.5rem",
                    color: "#FFFFFF"
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)" }} />
                  <div style={{ position: "relative", zIndex: 2, maxWidth: "80%" }}>
                    <span style={{ fontSize: "0.65rem", background: "rgba(197, 168, 128, 0.3)", color: "#F5EAD6", border: "1px solid #C5A880", padding: "0.15rem 0.5rem", borderRadius: "10px", fontWeight: 700 }}>
                      {currentSlide.tagBadge}
                    </span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "0.35rem", marginBottom: "0.25rem" }}>
                      {currentSlide.titleMain} <span style={{ color: "#C5A880", fontStyle: "italic" }}>{currentSlide.titleItalic}</span>
                    </h4>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", margin: 0, lineClamp: 2, overflow: "hidden" }}>
                      {currentSlide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INNER PAGE TOP BANNERS STUDIO */}
      {activeTab === "pages" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.75rem" }}>
          {/* Left Page Selector List */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#F5EAD6", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
              Select Page Top Banner
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {[
                { key: "about", name: "About Us Page", icon: "fa-circle-info" },
                { key: "calculator", name: "Live Rate Calculator Page", icon: "fa-calculator" },
                { key: "gold", name: "Gold Collection Page", icon: "fa-crown" },
                { key: "diamond", name: "Diamond Collection Page", icon: "fa-gem" },
                { key: "silver", name: "Silver Collection Page", icon: "fa-ring" },
                { key: "all", name: "All Jewellery Page", icon: "fa-layer-group" }
              ].map(p => {
                const b = pageBanners[p.key];
                const isSelected = selectedPageKey === p.key;
                return (
                  <div
                    key={p.key}
                    onClick={() => setSelectedPageKey(p.key)}
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      background: isSelected ? "rgba(197, 168, 128, 0.18)" : "#110E0C",
                      border: isSelected ? "1.5px solid #C5A880" : "1px solid rgba(197, 168, 128, 0.15)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem"
                    }}
                  >
                    <i className={`fa-solid ${p.icon}`} style={{ color: "#C5A880", fontSize: "1.1rem" }}></i>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.88rem" }}>{p.name}</strong>
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>
                        {b?.title || "Default Banner"}
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.75rem", color: "#C5A880" }}></i>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Editor for Selected Page Banner */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#F5EAD6", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
              Editing Page Banner: <span style={{ color: "#C5A880" }}>{currentBanner.pageName || selectedPageKey.toUpperCase()}</span>
            </h3>

            <div className="admin-form-group">
              <label className="admin-label">Top Tag Badge</label>
              <input
                type="text"
                className="admin-input"
                value={currentBanner.badge || ""}
                onChange={e => handlePageBannerChange("badge", e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Page Main Heading Title</label>
              <input
                type="text"
                className="admin-input"
                value={currentBanner.title || ""}
                onChange={e => handlePageBannerChange("title", e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Page Subtitle Description</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={currentBanner.subtitle || ""}
                onChange={e => handlePageBannerChange("subtitle", e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Background Image URL</label>
              <input
                type="text"
                className="admin-input"
                value={currentBanner.backgroundImage || ""}
                onChange={e => handlePageBannerChange("backgroundImage", e.target.value)}
              />
            </div>

            {/* Live Page Banner Preview */}
            <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(197, 168, 128, 0.2)", paddingTop: "1.25rem" }}>
              <label className="admin-label" style={{ color: "#F5EAD6", fontWeight: 700, marginBottom: "0.5rem" }}>
                Live Page Banner Preview:
              </label>
              <div
                style={{
                  position: "relative",
                  borderRadius: "14px",
                  overflow: "hidden",
                  padding: "2.5rem 1.5rem",
                  backgroundImage: `url(${currentBanner.backgroundImage || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "#FFFFFF",
                  textAlign: "center"
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: currentBanner.overlayGradient || "linear-gradient(135deg, rgba(28, 25, 23, 0.95) 0%, rgba(17, 14, 12, 0.88) 100%)" }} />
                <div style={{ position: "relative", zIndex: 2, maxWidth: "700px", margin: "0 auto" }}>
                  {currentBanner.badge && (
                    <span style={{ display: "inline-block", background: "rgba(197, 168, 128, 0.2)", border: "1px solid #C5A880", padding: "0.2rem 0.65rem", borderRadius: "15px", fontSize: "0.68rem", color: "#F5EAD6", letterSpacing: "1.2px", marginBottom: "0.5rem", fontWeight: 700 }}>
                      {currentBanner.badge}
                    </span>
                  )}
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                    {currentBanner.title}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", margin: 0 }}>
                    {currentBanner.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
