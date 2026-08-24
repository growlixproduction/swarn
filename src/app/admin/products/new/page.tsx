"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PricingEngine } from "@/lib/pricingEngine";
import { KaratType, MetalTone, Product } from "@/lib/types";

export default function AdminNewProductPage() {
  const router = useRouter();
  const { bullionRates, refreshProducts } = useApp();

  // State
  const [sku, setSku] = useState(`SM-${Math.floor(100 + Math.random() * 900)}`);
  const [title, setTitle] = useState("");
  const [primaryMaterial, setPrimaryMaterial] = useState<"gold" | "diamond" | "silver" | "other">("gold");
  const [category, setCategory] = useState("necklaces");
  const [subCategory, setSubCategory] = useState("");
  const [collection, setCollection] = useState("Gold Collection");
  const [navCategories, setNavCategories] = useState<string[]>(["all", "gold"]);
  // Custom extra sub-collections (user-typed)
  const [customSubInput, setCustomSubInput] = useState("");
  const [customSubs, setCustomSubs] = useState<Array<{ slug: string; title: string; category: string }>>([]);

  // Pricing & Weights
  const [netGoldWeight, setNetGoldWeight] = useState<number>(10.5);
  const [defaultKarat, setDefaultKarat] = useState<KaratType>("22K");
  const [makingValue, setMakingValue] = useState<number>(14);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Diamonds
  const [hasDiamonds, setHasDiamonds] = useState(false);
  const [diamondCarat, setDiamondCarat] = useState<number>(0.25);
  const [pricePerCarat, setPricePerCarat] = useState<number>(68000);

  // Images (Multi-Image Array)
  const [imagesList, setImagesList] = useState<string[]>([
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Description
  const [description, setDescription] = useState("");

  // Status message
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto Select / Deselect Sub-Collection Helper (Toggle) - uses slug as unique key
  const handleSelectSubCollection = (sub: { slug: string; title: string; category: string }) => {
    const isCurrentlySelected = navCategories.includes(sub.slug);
    if (isCurrentlySelected) {
      // Deselect: remove slug and its category from navCategories
      setNavCategories(prev => prev.filter(c => c !== sub.slug));
      setSubCategory("");
      setCollection(`${primaryMaterial.toUpperCase()} Collection`);
    } else {
      // Select: clear previous sub-collection slugs first, then add new one
      const metalSlugs = ["gold", "diamond", "silver"];
      setNavCategories(prev => {
        const base = prev.filter(c => metalSlugs.includes(c) || c === "all");
        return Array.from(new Set([...base, "all", primaryMaterial, sub.slug, sub.category]));
      });
      setCategory(sub.category);
      setSubCategory(sub.title);
      setCollection(`${primaryMaterial.toUpperCase()} ${sub.title}`);
    }
  };

  // Add custom sub-collection typed by user
  const handleAddCustomSub = () => {
    const trimmed = customSubInput.trim();
    if (!trimmed) return;
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newSub = { slug, title: trimmed, category: slug };
    setCustomSubs(prev => [...prev, newSub]);
    setCustomSubInput("");
    handleSelectSubCollection(newSub);
  };

  // Image Upload Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setSaveMessage(null);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        }
      }
      if (uploadedUrls.length > 0) {
        setImagesList(prev => [...prev, ...uploadedUrls]);
        setSaveMessage({ type: "success", text: `Successfully uploaded ${uploadedUrls.length} image(s)!` });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Failed to upload images" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImagesList(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImagesList(prev => prev.filter((_, i) => i !== idx));
  };

  // Mock product object for live pricing engine
  const mockProduct: Product = {
    id: sku,
    title: title || "New Jewellery Item",
    slug: (title || "new-item").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    collection,
    category: category as any,
    subCategory,
    primaryMaterial,
    navCategories,
    isFeatured: true,
    isNew: true,
    rating: 5.0,
    reviews: 1,
    netGoldWeightGrams: netGoldWeight,
    grossWeightGrams: netGoldWeight * 1.05,
    defaultKarat,
    supportedKarats: ["14K", "18K", "22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: makingValue,
    discountPercent,
    diamondSpecs: hasDiamonds
      ? { stoneCount: 1, totalCaratWeight: diamondCarat, clarity: "VVS-EF", cut: "Round", pricePerCarat }
      : undefined,
    images: {
      yellow: imagesList[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      hover: imagesList[1] || imagesList[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      gallery: imagesList
    },
    huid: "SM916A8299",
    certificate: "BIS 916 Hallmarked",
    description: description || "Handcrafted luxury jewellery piece by Swarn Mahal Jewellers Ambikapur."
  };

  const breakdown = PricingEngine.calculateBreakdown(mockProduct, defaultKarat, bullionRates, null, {
    type: "percent",
    value: makingValue
  });

  // Submit Handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setSaveMessage({ type: "error", text: "Please enter a Product Title!" });
      return;
    }

    setIsSubmitting(true);
    setSaveMessage(null);

    const payload = {
      ...mockProduct,
      images: {
        yellow: imagesList[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        hover: imagesList[1] || imagesList[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        gallery: imagesList
      }
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: `Product "${title}" published successfully!` });
        await refreshProducts();
        setTimeout(() => {
          router.push("/admin/products");
        }, 1000);
      } else {
        setSaveMessage({ type: "error", text: data.error || "Failed to publish product." });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Failed to save product" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "4rem" }}>
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontSize: "0.8rem", color: "#8C827A", marginBottom: "0.25rem" }}>
            <Link href="/admin/products" style={{ color: "#C5A880", textDecoration: "none" }}>Products</Link> / Add Product
          </div>
          <h1 className="admin-page-title" style={{ fontSize: "1.6rem" }}>Add New Jewellery Piece</h1>
          <p className="admin-page-desc" style={{ fontSize: "0.85rem" }}>
            Fill in the essential details below to list your item in Gold, Diamond, or Silver collections.
          </p>
        </div>

        <button type="submit" form="new-product-form" className="btn btn-gold btn-sm" disabled={isSubmitting}>
          {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
          <span>{isSubmitting ? "Publishing..." : "Publish Product"}</span>
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
          {saveMessage.text}
        </div>
      )}

      <form id="new-product-form" onSubmit={handleSaveProduct} className="admin-form-grid">
        {/* Left Side: Clean Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Card 1: Title & Category Selection */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#F5EAD6", marginBottom: "1.1rem", fontFamily: "var(--font-serif)" }}>
              1. Title & Collections
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 22K Royal Kundan Bridal Haar, Solitaire Ring"
                  className="admin-input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Product SKU / Code</label>
                <input
                  type="text"
                  className="admin-input"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                />
              </div>
            </div>

            {/* Main Metal Selector */}
            <div className="admin-form-group">
              <label className="admin-label" style={{ color: "#F5EAD6", fontWeight: 700 }}>
                Main Metal / Collection *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                {[
                  { key: "gold", title: "Gold Collection", icon: "🟡" },
                  { key: "diamond", title: "Diamond Collection", icon: "💎" },
                  { key: "silver", title: "Silver Collection", icon: "⚪" }
                ].map(mat => {
                  const isSelected = primaryMaterial === mat.key;
                  return (
                    <button
                      key={mat.key}
                      type="button"
                      onClick={() => {
                        setPrimaryMaterial(mat.key as any);
                        // Reset sub-collection on metal switch
                        setSubCategory("");
                        setCategory(mat.key === "silver" ? "silverware" : "rings");
                        setCollection(`${mat.key.toUpperCase()} Collection`);
                        setNavCategories(["all", mat.key]);
                      }}
                      style={{
                        padding: "0.75rem 0.65rem",
                        borderRadius: "10px",
                        textAlign: "center",
                        background: isSelected ? "linear-gradient(135deg, rgba(245, 234, 214, 0.2) 0%, rgba(197, 168, 128, 0.3) 100%)" : "#110E0C",
                        border: isSelected ? "2px solid #D4B68A" : "1px solid rgba(197, 168, 128, 0.2)",
                        color: isSelected ? "#F5EAD6" : "#A3978B",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem", marginRight: "0.4rem" }}>{mat.icon}</span>
                      <strong style={{ fontSize: "0.88rem", color: isSelected ? "#F5EAD6" : "#E2D8CC" }}>
                        {mat.title}
                      </strong>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Collection Selector Chips */}
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label" style={{ color: "#F5EAD6", fontWeight: 700 }}>
                Sub-Collection / Category *
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", padding: "0.75rem", background: "#110E0C", border: "1px solid rgba(197, 168, 128, 0.2)", borderRadius: "10px" }}>
                {(
                  primaryMaterial === "gold" ? [
                    { slug: "rings", title: "Rings & Bands", category: "rings" },
                    { slug: "necklace", title: "Necklace & Rani Haar", category: "necklaces" },
                    { slug: "earrings", title: "Earrings & Tops", category: "earrings" },
                    { slug: "nose-pins", title: "Nose Pins", category: "nose-pins" },
                    { slug: "gold-hoops-balis", title: "Gold Hoops & Balis", category: "earrings" },
                    { slug: "pendants", title: "Pendants", category: "pendants" },
                    { slug: "mangalsutra", title: "Mangalsutra", category: "mangalsutra" },
                    { slug: "chains", title: "Chains", category: "chains" },
                    { slug: "bangles", title: "Bangles & Kadas", category: "bangles" },
                    { slug: "bracelet", title: "Bracelet", category: "bangles" }
                  ] : primaryMaterial === "diamond" ? [
                    { slug: "rings", title: "Rings & Solitaires", category: "rings" },
                    { slug: "diamond-earrings", title: "Diamond Earrings", category: "earrings" },
                    { slug: "diamond-pendants", title: "Diamond Pendants", category: "pendants" },
                    { slug: "necklace", title: "Necklace & Haar", category: "necklaces" },
                    { slug: "bangles", title: "Diamond Bangles", category: "bangles" },
                    { slug: "bracelet", title: "Diamond Bracelet", category: "bangles" },
                    { slug: "mangalsutra", title: "Diamond Mangalsutra", category: "mangalsutra" }
                  ] : [
                    { slug: "rings", title: "Silver Rings", category: "rings" },
                    { slug: "silver-payal", title: "Silver Payal & Anklets", category: "silverware" },
                    { slug: "silverware", title: "Silverware & Coins", category: "silverware" },
                    { slug: "necklace", title: "Silver Necklace", category: "necklaces" },
                    { slug: "earrings", title: "Silver Earrings", category: "earrings" },
                    { slug: "bangles", title: "Silver Bangles", category: "bangles" },
                    { slug: "bracelet", title: "Silver Bracelet", category: "bangles" }
                  ]
                ).concat(customSubs).map(sub => {
                  const isSelected = navCategories.includes(sub.slug);
                  return (
                    <button
                      key={sub.slug}
                      type="button"
                      onClick={() => handleSelectSubCollection(sub)}
                      style={{
                        padding: "0.45rem 0.85rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: isSelected ? 700 : 500,
                        background: isSelected ? "#F5EAD6" : "rgba(255,255,255,0.04)",
                        color: isSelected ? "#832729" : "#C5B6A6",
                        border: isSelected ? "1.5px solid #D4B68A" : "1px solid rgba(197, 168, 128, 0.2)",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span>{sub.title}</span>
                      {customSubs.some(cs => cs.slug === sub.slug) && (
                        <span
                          onClick={(e) => { e.stopPropagation(); setCustomSubs(prev => prev.filter(cs => cs.slug !== sub.slug)); setNavCategories(prev => prev.filter(c => c !== sub.slug)); }}
                          style={{ marginLeft: "0.35rem", color: "#EF4444", fontWeight: 900, fontSize: "0.85rem", lineHeight: 1 }}
                          title="Remove this custom tag"
                        >×</span>
                      )}
                    </button>
                  );
                })}
                {/* Add Custom Sub-Collection Input */}
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginTop: "0.35rem" }}>
                  <input
                    type="text"
                    placeholder="+ Custom (e.g. Maang Tikka)"
                    value={customSubInput}
                    onChange={e => setCustomSubInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddCustomSub())}
                    style={{ padding: "0.35rem 0.65rem", borderRadius: "20px", fontSize: "0.78rem", background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(197, 168, 128, 0.4)", color: "#E2D8CC", outline: "none", width: "170px" }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSub}
                    style={{ padding: "0.35rem 0.75rem", borderRadius: "20px", fontSize: "0.78rem", background: "#D4B68A", color: "#1A150F", border: "none", cursor: "pointer", fontWeight: 700 }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Placement Summary */}
            <div style={{ marginTop: "1rem", padding: "0.65rem 0.85rem", background: "rgba(245, 234, 214, 0.08)", border: "1px solid #D4B68A", borderRadius: "8px", fontSize: "0.78rem", color: "#E2D8CC" }}>
              📍 <strong>Live Storefront Placement:</strong> Will show under <strong>{primaryMaterial.toUpperCase()} Collection ➔ {subCategory}</strong>
            </div>
          </div>

          {/* Card 2: Weight & Pricing */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#F5EAD6", marginBottom: "1.1rem", fontFamily: "var(--font-serif)" }}>
              2. Weight & Pricing Factors
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Gold Net Weight (Grams) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  required
                  className="admin-input"
                  value={netGoldWeight}
                  onChange={e => setNetGoldWeight(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Karat Purity *</label>
                <select
                  className="admin-select"
                  value={defaultKarat}
                  onChange={e => setDefaultKarat(e.target.value as KaratType)}
                >
                  <option value="22K">22K Gold (916 Hallmark)</option>
                  <option value="18K">18K Gold (750 Hallmark)</option>
                  <option value="24K">24K Pure Gold (999 Purity)</option>
                  <option value="14K">14K Luxe Gold (585)</option>
                </select>
              </div>

              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Making Charge (%) *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="admin-input"
                  value={makingValue}
                  onChange={e => setMakingValue(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Discount (%)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  className="admin-input"
                  value={discountPercent}
                  onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Optional Diamonds Checkbox */}
            <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(197, 168, 128, 0.15)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#F5EAD6", fontSize: "0.86rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={hasDiamonds}
                  onChange={e => setHasDiamonds(e.target.checked)}
                  style={{ accentColor: "#D4B68A", width: "16px", height: "16px" }}
                />
                <strong>Include Diamond / Solitaire Details</strong>
              </label>

              {hasDiamonds && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "0.85rem" }}>
                  <div className="admin-form-group" style={{ margin: 0 }}>
                    <label className="admin-label">Diamond Carat Weight (ct)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="admin-input"
                      value={diamondCarat}
                      onChange={e => setDiamondCarat(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="admin-form-group" style={{ margin: 0 }}>
                    <label className="admin-label">Diamond Rate (₹ per Carat)</label>
                    <input
                      type="number"
                      step="1000"
                      className="admin-input"
                      value={pricePerCarat}
                      onChange={e => setPricePerCarat(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Multi-Image Photo Upload */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#F5EAD6", marginBottom: "0.5rem", fontFamily: "var(--font-serif)" }}>
              3. Product Photography (Multiple Photos)
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#A3978B", margin: "0 0 1rem" }}>
              Upload one or more photos directly from your device. First photo will be the main cover image.
            </p>

            {/* Gallery Preview Thumbnails */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
              {imagesList.map((imgUrl, idx) => (
                <div key={idx} style={{ position: "relative", width: "90px", height: "90px", borderRadius: "8px", overflow: "hidden", border: idx === 0 ? "2px solid #D4B68A" : "1px solid rgba(197, 168, 128, 0.3)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt={`Product ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", bottom: "4px", left: "4px", background: "rgba(0,0,0,0.75)", color: "#F5EAD6", fontSize: "0.6rem", padding: "1px 4px", borderRadius: "3px", fontWeight: 700 }}>
                    {idx === 0 ? "Main" : idx === 1 ? "Hover" : `#${idx + 1}`}
                  </span>
                  {imagesList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(239, 68, 68, 0.85)", color: "#FFF", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Direct Device File Upload Button */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
              <label className="btn btn-outline btn-sm" style={{ cursor: "pointer", background: "rgba(245, 234, 214, 0.1)", borderColor: "#D4B68A", color: "#F5EAD6" }}>
                <i className={isUploading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-cloud-arrow-up"}></i>
                <span>{isUploading ? "Uploading..." : "Upload Photos From Computer"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  disabled={isUploading}
                />
              </label>

              {/* OR Image URL */}
              <div style={{ display: "flex", gap: "0.4rem", flex: 1, minWidth: "240px" }}>
                <input
                  type="text"
                  placeholder="Or paste Image URL (https://...)"
                  className="admin-input"
                  style={{ fontSize: "0.8rem", padding: "0.4rem 0.65rem" }}
                  value={imageUrlInput}
                  onChange={e => setImageUrlInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="btn btn-gold btn-sm"
                  style={{ padding: "0.4rem 0.75rem", fontSize: "0.78rem" }}
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Description */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#F5EAD6", marginBottom: "0.85rem", fontFamily: "var(--font-serif)" }}>
              4. Product Description
            </h3>
            <textarea
              rows={3}
              className="admin-textarea"
              placeholder="Describe the craftsmanship, hallmarking, and occasion styling details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

        </div>

        {/* Right Side: Live Pricing & Formula Preview */}
        <div>
          <div className="admin-live-calc-box">
            <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "0.25rem", fontFamily: "var(--font-serif)" }}>
              Live Price Calculation
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#8C827A", marginBottom: "1rem" }}>
              Synced with 2026 Live 24K Gold Rate: <strong>{PricingEngine.formatINR(bullionRates.gold24k)}/g</strong>
            </p>

            {/* Product Card Image Preview */}
            <div style={{ width: "100%", height: "200px", borderRadius: "8px", overflow: "hidden", marginBottom: "1rem", position: "relative", border: "1px solid rgba(197, 168, 128, 0.2)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagesList[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"}
                alt={title || "Preview"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.75)", color: "var(--gold-bright)", padding: "0.2rem 0.55rem", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 700 }}>
                {defaultKarat} Gold
              </span>
            </div>

            <strong style={{ fontSize: "0.95rem", color: "#FFFFFF", display: "block", marginBottom: "0.85rem" }}>
              {title || "Jewellery Title Preview"}
            </strong>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.82rem", color: "#A3978B", borderTop: "1px solid rgba(197, 168, 128, 0.15)", paddingTop: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{defaultKarat} Pure Gold ({netGoldWeight}g):</span>
                <strong style={{ color: "#FFFFFF" }}>{PricingEngine.formatINR(breakdown.metalCost)}</strong>
              </div>

              {hasDiamonds && breakdown.diamondCost > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Diamonds ({diamondCarat} ct):</span>
                  <strong style={{ color: "#FFFFFF" }}>{PricingEngine.formatINR(breakdown.diamondCost)}</strong>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Making Charge ({makingValue}%):</span>
                <strong style={{ color: "#FFFFFF" }}>{PricingEngine.formatINR(breakdown.effectiveMakingCharges)}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>GST (3% HSN 7113):</span>
                <strong style={{ color: "#FFFFFF" }}>{PricingEngine.formatINR(breakdown.gstAmount)}</strong>
              </div>
            </div>

            <div style={{ borderTop: "2px solid #C5A880", marginTop: "1rem", paddingTop: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "0.95rem" }}>Grand Total:</span>
              <strong style={{ color: "var(--gold-bright)", fontSize: "1.35rem", fontWeight: 800 }}>
                {PricingEngine.formatINR(breakdown.finalPrice)}
              </strong>
            </div>

            <button
              type="submit"
              form="new-product-form"
              className="btn btn-gold"
              style={{ width: "100%", marginTop: "1.25rem", padding: "0.75rem", fontSize: "0.9rem", fontWeight: 700 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Product"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
