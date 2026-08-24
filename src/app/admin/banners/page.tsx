"use client";

import React, { useState, useEffect } from "react";

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "pages" | "showroom">("hero");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // File Uploading States
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // States
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<string>("");

  const [pageBanners, setPageBanners] = useState<Record<string, any>>({});
  const [selectedPageKey, setSelectedPageKey] = useState<string>("calculator");

  const [showroomStory, setShowroomStory] = useState<any>({
    badge: "ESTABLISHED 2015 • AMBIKAPUR, CHHATTISGARH",
    title: "Welcome to Swarn Mahal Luxury Jewellers",
    description: "Located at Church Road, Joda Pipal, Maharaja Gali, Ambikapur, Swarn Mahal has been the benchmark of purity, trust, and transparent pricing in North Chhattisgarh for over a decade.",
    phone: "+91 99997 77740",
    feature1Title: "100% BIS 916 Hallmarked Gold",
    feature1Desc: "Every single gold ornament carries a verifiable 6-digit laser HUID stamp.",
    feature2Title: "Certified Precision Weighing & Assay",
    feature2Desc: "Zero wastage manipulation. Digital weights and karat purity tested right in front of you.",
    feature3Title: "Lowest & Fair Making Charges",
    feature3Desc: "Direct artisan pricing with transparent formula billing and zero hidden surcharges.",
    galleryImg1: "/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(10).jpeg",
    galleryTag1: "Ambikapur Main Floor",
    galleryImg2: "/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(11).jpeg",
    galleryTag2: "Live Karat Assay",
    galleryImg3: "/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(3).jpeg",
    galleryTag3: "Bridal Trousseau Lounge"
  });

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
        if (data.showroomStory && data.showroomStory.title) {
          setShowroomStory(data.showroomStory);
        }
      }
    } catch (err) {
      console.error("Failed to load banners:", err);
    } finally {
      setLoading(false);
    }
  };

  // Upload image from PC
  const handleDirectPCUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string, updateCallback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(fieldKey);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        updateCallback(data.url);
        setSaveMessage({ type: "success", text: `Image "${file.name}" uploaded successfully from PC!` });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: "error", text: data.error || "Failed to upload image from PC." });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "File upload failed" });
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  const currentSlide = heroSlides.find(s => s.id === selectedSlideId) || heroSlides[0];

  const currentBanner = pageBanners[selectedPageKey] || {
    pageKey: selectedPageKey,
    pageName: `${selectedPageKey.toUpperCase()} Page`,
    badge: "SWARN MAHAL EXCLUSIVE",
    title: "Page Header Banner Title",
    subtitle: "Page banner subtitle description...",
    backgroundImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    overlayGradient: "linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.72) 100%)"
  };

  const handleHeroSlideChange = (field: string, value: any) => {
    setHeroSlides(prev =>
      prev.map(s => (s.id === selectedSlideId ? { ...s, [field]: value } : s))
    );
  };

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

  const handleShowroomStoryChange = (field: string, value: any) => {
    setShowroomStory((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroSlides, pageBanners, showroomStory })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: "All Banners, Calculator & About Page Content updated live!" });
        setTimeout(() => setSaveMessage(null), 3500);
      } else {
        setSaveMessage({ type: "error", text: data.error || "Failed to save data." });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Failed to save data." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#C5A880" }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
        <p>Loading Banner & Website Content Studio...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "4rem" }}>
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1 className="admin-page-title" style={{ fontSize: "1.6rem" }}>Website Banners & Page Content Studio</h1>
          <p className="admin-page-desc" style={{ fontSize: "0.85rem" }}>
            Customize Homepage Hero Slider, Calculator Page Banner, About Us Page Banner & Story, and Collection Banners with Direct PC Image Upload.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={handleSaveAll}
          disabled={isSaving}
        >
          {isSaving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>}
          <span>{isSaving ? "Saving Live..." : "Save All Live"}</span>
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

      {/* Main Mode Tabs */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(197, 168, 128, 0.2)", paddingBottom: "0.75rem", flexWrap: "wrap" }}>
        <button
          type="button"
          style={{
            padding: "0.65rem 1.25rem",
            borderRadius: "10px",
            fontSize: "0.88rem",
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
            fontSize: "0.88rem",
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
          <span>Calculator & Page Header Banners</span>
        </button>

        <button
          type="button"
          style={{
            padding: "0.65rem 1.25rem",
            borderRadius: "10px",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: "pointer",
            border: activeTab === "showroom" ? "1.5px solid #C5A880" : "1px solid rgba(197, 168, 128, 0.25)",
            background: activeTab === "showroom" ? "#C5A880" : "#110E0C",
            color: activeTab === "showroom" ? "#110E0C" : "#FFFFFF",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
          onClick={() => setActiveTab("showroom")}
        >
          <i className="fa-solid fa-store"></i>
          <span>About Us Story & Showroom Gallery</span>
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

              {/* Background Image Input + Direct PC Browse Button */}
              <div className="admin-form-group">
                <label className="admin-label">Background Image URL (Or Browse PC File)</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1 }}
                    value={currentSlide.backgroundImage || ""}
                    onChange={e => handleHeroSlideChange("backgroundImage", e.target.value)}
                  />
                  <label
                    style={{
                      padding: "0.55rem 1rem",
                      borderRadius: "8px",
                      background: uploadingField === `hero-${currentSlide.id}` ? "rgba(197,168,128,0.2)" : "#C5A880",
                      color: "#110E0C",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      whiteSpace: "nowrap"
                    }}
                  >
                    <i className={uploadingField === `hero-${currentSlide.id}` ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-folder-open"}></i>
                    <span>{uploadingField === `hero-${currentSlide.id}` ? "Uploading..." : "Browse PC"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={uploadingField === `hero-${currentSlide.id}`}
                      onChange={e => handleDirectPCUpload(e, `hero-${currentSlide.id}`, url => handleHeroSlideChange("backgroundImage", url))}
                    />
                  </label>
                </div>
              </div>

              {/* Preview Card */}
              <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(197, 168, 128, 0.2)", paddingTop: "1rem" }}>
                <label className="admin-label" style={{ color: "#F5EAD6", fontWeight: 700 }}>Live Hero Slide Preview:</label>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "160px",
                    backgroundImage: `url(${currentSlide.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    padding: "1.25rem",
                    color: "#FFFFFF"
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)" }} />
                  <div style={{ position: "relative", zIndex: 2, maxWidth: "80%" }}>
                    <span style={{ fontSize: "0.65rem", background: "rgba(197, 168, 128, 0.3)", color: "#F5EAD6", border: "1px solid #C5A880", padding: "0.15rem 0.5rem", borderRadius: "10px", fontWeight: 700 }}>
                      {currentSlide.tagBadge}
                    </span>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.3rem", marginBottom: "0.2rem" }}>
                      {currentSlide.titleMain} <span style={{ color: "#C5A880", fontStyle: "italic" }}>{currentSlide.titleItalic}</span>
                    </h4>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", margin: 0 }}>
                      {currentSlide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CALCULATOR & PAGE HEADER BANNERS STUDIO */}
      {activeTab === "pages" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.75rem" }}>
          {/* Page Selector Sidebar */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#F5EAD6", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
              Select Page to Edit Banner
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {[
                { key: "calculator", name: "🧮 Calculator Page Banner", icon: "fa-calculator" },
                { key: "about", name: "ℹ️ About Us Page Banner", icon: "fa-circle-info" },
                { key: "gold", name: "🟡 Gold Collection Banner", icon: "fa-crown" },
                { key: "diamond", name: "💎 Diamond Collection Banner", icon: "fa-gem" },
                { key: "silver", name: "⚪ Silver Collection Banner", icon: "fa-ring" },
                { key: "all", name: "🛍️ All Jewellery Banner", icon: "fa-layer-group" }
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
                      background: isSelected ? "rgba(197, 168, 128, 0.2)" : "#110E0C",
                      border: isSelected ? "1.5px solid #C5A880" : "1px solid rgba(197, 168, 128, 0.15)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem"
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", color: isSelected ? "#C5A880" : "#FFFFFF", fontSize: "0.88rem" }}>{p.name}</strong>
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>
                        {b?.title || "Custom Page Banner"}
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

            {/* Banner Background Image Input + Direct PC Browse Button */}
            <div className="admin-form-group">
              <label className="admin-label">Background Image URL (Or Browse PC File)</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: 1 }}
                  value={currentBanner.backgroundImage || ""}
                  onChange={e => handlePageBannerChange("backgroundImage", e.target.value)}
                />
                <label
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "8px",
                    background: uploadingField === `page-${selectedPageKey}` ? "rgba(197,168,128,0.2)" : "#C5A880",
                    color: "#110E0C",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    whiteSpace: "nowrap"
                  }}
                >
                  <i className={uploadingField === `page-${selectedPageKey}` ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-folder-open"}></i>
                  <span>{uploadingField === `page-${selectedPageKey}` ? "Uploading..." : "Browse PC"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    disabled={uploadingField === `page-${selectedPageKey}`}
                    onChange={e => handleDirectPCUpload(e, `page-${selectedPageKey}`, url => handlePageBannerChange("backgroundImage", url))}
                  />
                </label>
              </div>
            </div>

            {/* Live Banner Preview */}
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
                <div style={{ position: "absolute", inset: 0, background: currentBanner.overlayGradient || "linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.72) 100%)" }} />
                <div style={{ position: "relative", zIndex: 2, maxWidth: "700px", margin: "0 auto" }}>
                  {currentBanner.badge && (
                    <span style={{ display: "inline-block", background: "rgba(197, 168, 128, 0.2)", border: "1px solid #C5A880", padding: "0.2rem 0.65rem", borderRadius: "15px", fontSize: "0.68rem", color: "#F5EAD6", letterSpacing: "1.2px", marginBottom: "0.5rem", fontWeight: 700 }}>
                      {currentBanner.badge}
                    </span>
                  )}
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.35rem", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
                    {currentBanner.title}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#F5EAD6", margin: 0, textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                    {currentBanner.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ABOUT US SHOWROOM STORY & GALLERY */}
      {activeTab === "showroom" && (
        <div className="admin-card">
          <h3 style={{ fontSize: "1.1rem", color: "#F5EAD6", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
            About Us Showroom Story & 3-Mosaic Gallery Manager
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div className="admin-form-group">
              <label className="admin-label">Showroom Tag Badge</label>
              <input
                type="text"
                className="admin-input"
                value={showroomStory.badge || ""}
                onChange={e => handleShowroomStoryChange("badge", e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Store Phone Number</label>
              <input
                type="text"
                className="admin-input"
                value={showroomStory.phone || ""}
                onChange={e => handleShowroomStoryChange("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Showroom Welcome Heading</label>
            <input
              type="text"
              className="admin-input"
              value={showroomStory.title || ""}
              onChange={e => handleShowroomStoryChange("title", e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Main Showroom Description Story</label>
            <textarea
              rows={3}
              className="admin-textarea"
              value={showroomStory.description || ""}
              onChange={e => handleShowroomStoryChange("description", e.target.value)}
            />
          </div>

          <h4 style={{ fontSize: "0.95rem", color: "#C5A880", marginTop: "1.5rem", marginBottom: "1rem", fontWeight: 700 }}>
            <i className="fa-solid fa-images" style={{ marginRight: "0.4rem" }}></i> Showroom 3 Mosaic Gallery Photos (Browse PC Supported)
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            {/* Gallery Image 1 */}
            <div style={{ background: "#110E0C", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(197, 168, 128, 0.2)" }}>
              <strong style={{ color: "#FFFFFF", fontSize: "0.82rem", display: "block", marginBottom: "0.5rem" }}>Gallery Photo 1 (Tall)</strong>
              <div className="admin-form-group" style={{ marginBottom: "0.5rem" }}>
                <label className="admin-label" style={{ fontSize: "0.7rem" }}>Image URL / PC File</label>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1, fontSize: "0.75rem" }}
                    value={showroomStory.galleryImg1 || ""}
                    onChange={e => handleShowroomStoryChange("galleryImg1", e.target.value)}
                  />
                  <label style={{ padding: "0.4rem 0.6rem", background: "#C5A880", color: "#110E0C", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <i className={uploadingField === "g1" ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-folder-open"}></i>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={uploadingField === "g1"}
                      onChange={e => handleDirectPCUpload(e, "g1", url => handleShowroomStoryChange("galleryImg1", url))}
                    />
                  </label>
                </div>
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-label" style={{ fontSize: "0.7rem" }}>Tag Badge</label>
                <input
                  type="text"
                  className="admin-input"
                  value={showroomStory.galleryTag1 || ""}
                  onChange={e => handleShowroomStoryChange("galleryTag1", e.target.value)}
                />
              </div>
            </div>

            {/* Gallery Image 2 */}
            <div style={{ background: "#110E0C", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(197, 168, 128, 0.2)" }}>
              <strong style={{ color: "#FFFFFF", fontSize: "0.82rem", display: "block", marginBottom: "0.5rem" }}>Gallery Photo 2 (Square)</strong>
              <div className="admin-form-group" style={{ marginBottom: "0.5rem" }}>
                <label className="admin-label" style={{ fontSize: "0.7rem" }}>Image URL / PC File</label>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1, fontSize: "0.75rem" }}
                    value={showroomStory.galleryImg2 || ""}
                    onChange={e => handleShowroomStoryChange("galleryImg2", e.target.value)}
                  />
                  <label style={{ padding: "0.4rem 0.6rem", background: "#C5A880", color: "#110E0C", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <i className={uploadingField === "g2" ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-folder-open"}></i>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={uploadingField === "g2"}
                      onChange={e => handleDirectPCUpload(e, "g2", url => handleShowroomStoryChange("galleryImg2", url))}
                    />
                  </label>
                </div>
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-label" style={{ fontSize: "0.7rem" }}>Tag Badge</label>
                <input
                  type="text"
                  className="admin-input"
                  value={showroomStory.galleryTag2 || ""}
                  onChange={e => handleShowroomStoryChange("galleryTag2", e.target.value)}
                />
              </div>
            </div>

            {/* Gallery Image 3 */}
            <div style={{ background: "#110E0C", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(197, 168, 128, 0.2)" }}>
              <strong style={{ color: "#FFFFFF", fontSize: "0.82rem", display: "block", marginBottom: "0.5rem" }}>Gallery Photo 3 (Square)</strong>
              <div className="admin-form-group" style={{ marginBottom: "0.5rem" }}>
                <label className="admin-label" style={{ fontSize: "0.7rem" }}>Image URL / PC File</label>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1, fontSize: "0.75rem" }}
                    value={showroomStory.galleryImg3 || ""}
                    onChange={e => handleShowroomStoryChange("galleryImg3", e.target.value)}
                  />
                  <label style={{ padding: "0.4rem 0.6rem", background: "#C5A880", color: "#110E0C", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <i className={uploadingField === "g3" ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-folder-open"}></i>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={uploadingField === "g3"}
                      onChange={e => handleDirectPCUpload(e, "g3", url => handleShowroomStoryChange("galleryImg3", url))}
                    />
                  </label>
                </div>
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-label" style={{ fontSize: "0.7rem" }}>Tag Badge</label>
                <input
                  type="text"
                  className="admin-input"
                  value={showroomStory.galleryTag3 || ""}
                  onChange={e => handleShowroomStoryChange("galleryTag3", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
