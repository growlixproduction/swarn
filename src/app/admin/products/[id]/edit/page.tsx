"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PricingEngine } from "@/lib/pricingEngine";
import { KaratType, MetalTone, Product } from "@/lib/types";
import { PRODUCTS_CATALOG } from "@/lib/catalogData";
import { ImageUploadInput } from "@/components/ImageUploadInput";


export default function AdminEditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { bullionRates, refreshProducts } = useApp();
  const productId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Dynamic Categories State
  const [availableCategories, setAvailableCategories] = useState<Array<{ key: string; label: string }>>([
    { key: "all", label: "All Jewellery" },
    { key: "gold", label: "22K Gold" },
    { key: "diamond", label: "Diamond Solitaires" },
    { key: "earrings", label: "Earrings & Tops" },
    { key: "daily-wear", label: "Daily Wear" },
    { key: "gemstone", label: "Gemstone" },
    { key: "wedding", label: "Bridal / Wedding" },
    { key: "gifting", label: "Gifting Suite" },
    { key: "under-50k", label: "Under ₹50,000" }
  ]);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          const list = Object.values(data.categories).map((cat: any) => ({
            key: cat.slug,
            label: cat.title || cat.name
          }));
          if (list.length > 0) {
            setAvailableCategories(list);
          }
        }
      })
      .catch(err => console.warn("Failed to fetch categories:", err));
  }, []);

  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [sku, setSku] = useState(productId);
  const [title, setTitle] = useState("");
  const [collection, setCollection] = useState("General Collection");
  const [category, setCategory] = useState("rings");
  const [primaryMaterial, setPrimaryMaterial] = useState<"gold" | "diamond" | "silver" | "other">("gold");
  const [subCategory, setSubCategory] = useState("");
  const [navCategories, setNavCategories] = useState<string[]>(["all"]);

  // Weights & Karats
  const [netGoldWeight, setNetGoldWeight] = useState<number>(4.5);
  const [grossWeight, setGrossWeight] = useState<number>(4.8);
  const [defaultKarat, setDefaultKarat] = useState<KaratType>("22K");
  const [defaultColor, setDefaultColor] = useState<MetalTone>("yellow");

  // Making & Discounts
  const [makingType, setMakingType] = useState<"percent" | "per_gram">("percent");
  const [makingValue, setMakingValue] = useState<number>(15);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Diamonds & Gemstones
  const [hasDiamonds, setHasDiamonds] = useState(false);
  const [stoneCount, setStoneCount] = useState<number>(1);
  const [diamondCarat, setDiamondCarat] = useState<number>(0.35);
  const [diamondClarity, setDiamondClarity] = useState("VVS-EF");
  const [diamondCut, setDiamondCut] = useState("Round Brilliant");
  const [pricePerCarat, setPricePerCarat] = useState<number>(68000);

  // Images
  const [imageYellow, setImageYellow] = useState("");
  const [imageRose, setImageRose] = useState("");
  const [imageWhite, setImageWhite] = useState("");
  const [imageHover, setImageHover] = useState("");

  // Legal & Descriptions
  const [huid, setHuid] = useState("");
  const [certificate, setCertificate] = useState("BIS 916");
  const [description, setDescription] = useState("");
  const [dimensions, setDimensions] = useState("");

  // Search Tags & Hashtags
  const [searchKeywords, setSearchKeywords] = useState("");
  const [hashtags, setHashtags] = useState("");

  // Fetch product data on load
  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        let targetProduct: Product | undefined;

        if (data && data.products) {
          targetProduct = data.products.find((p: Product) => p.id === productId || p.slug === productId);
        }

        if (!targetProduct) {
          targetProduct = PRODUCTS_CATALOG.find(p => p.id === productId || p.slug === productId);
        }

        if (targetProduct) {
          setSku(targetProduct.id);
          setTitle(targetProduct.title);
          setCollection(targetProduct.collection || "General Collection");
          setCategory(targetProduct.category);
          setPrimaryMaterial(targetProduct.primaryMaterial || (targetProduct.diamondSpecs ? "diamond" : targetProduct.category === "silverware" ? "silver" : "gold"));
          setNavCategories(targetProduct.navCategories || ["all"]);
          setNetGoldWeight(targetProduct.netGoldWeightGrams);
          setGrossWeight(targetProduct.grossWeightGrams);
          setDefaultKarat(targetProduct.defaultKarat || "22K");
          setDefaultColor(targetProduct.defaultColor || "yellow");
          setMakingValue(targetProduct.makingChargePercent || targetProduct.makingChargePerGram || 15);
          setMakingType(targetProduct.makingChargePerGram ? "per_gram" : "percent");
          setDiscountPercent(targetProduct.discountPercent || 0);

          if (targetProduct.diamondSpecs) {
            setHasDiamonds(true);
            setStoneCount(targetProduct.diamondSpecs.stoneCount || 1);
            setDiamondCarat(targetProduct.diamondSpecs.totalCaratWeight || 0.35);
            setDiamondClarity(targetProduct.diamondSpecs.clarity || "VVS-EF");
            setDiamondCut(targetProduct.diamondSpecs.cut || "Round Brilliant");
            setPricePerCarat(targetProduct.diamondSpecs.pricePerCarat || 68000);
          }

          if (targetProduct.images) {
            setImageYellow(targetProduct.images.yellow || "");
            setImageRose(targetProduct.images.rose || "");
            setImageWhite(targetProduct.images.white || "");
            setImageHover(targetProduct.images.hover || targetProduct.images.yellow || "");
          }

          setHuid(targetProduct.huid || "");
          setCertificate(targetProduct.certificate || "BIS 916");
          setDescription(targetProduct.description || "");
          setDimensions(targetProduct.dimensions || "");
        }
      } catch (err) {
        console.warn("Failed to load product for editing:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  // Product object for live pricing engine computation
  const mockProduct: Product = {
    id: sku,
    title: title || "Sample Piece",
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    collection,
    category: category as any,
    navCategories,
    isFeatured: true,
    isNew: false,
    rating: 4.9,
    reviews: 12,
    netGoldWeightGrams: netGoldWeight,
    grossWeightGrams: grossWeight,
    defaultKarat,
    supportedKarats: ["14K", "18K", "22K"],
    defaultColor,
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: makingType === "percent" ? makingValue : undefined,
    makingChargePerGram: makingType === "per_gram" ? makingValue : undefined,
    discountPercent,
    diamondSpecs: hasDiamonds
      ? {
          stoneCount,
          totalCaratWeight: diamondCarat,
          clarity: diamondClarity,
          cut: diamondCut,
          pricePerCarat
        }
      : undefined,
    images: {
      yellow: imageYellow || "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg",
      rose: imageRose,
      white: imageWhite,
      hover: imageHover || imageYellow,
      gallery: [imageYellow]
    },
    huid,
    certificate,
    description,
    dimensions
  };

  const breakdown = PricingEngine.calculateBreakdown(mockProduct, defaultKarat, bullionRates, null, {
    type: makingType,
    value: makingValue
  });

  const toggleNavCategory = (catKey: string) => {
    setNavCategories(prev => (prev.includes(catKey) ? prev.filter(c => c !== catKey) : [...prev, catKey]));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    const payload = {
      id: sku,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      collection,
      category,
      primaryMaterial,
      netGoldWeightGrams: netGoldWeight,
      grossWeightGrams: grossWeight,
      defaultKarat,
      defaultColor,
      makingChargePercent: makingType === "percent" ? makingValue : undefined,
      makingChargePerGram: makingType === "per_gram" ? makingValue : undefined,
      discountPercent,
      huid,
      certificate,
      description,
      dimensions,
      images: {
        yellow: imageYellow,
        rose: imageRose || undefined,
        white: imageWhite || undefined,
        hover: imageHover || imageYellow
      },
      diamondSpecs: hasDiamonds
        ? {
            stoneCount,
            totalCaratWeight: diamondCarat,
            clarity: diamondClarity,
            cut: diamondCut,
            pricePerCarat
          }
        : undefined
    };

    try {
      const res = await fetch(`/api/products/${sku}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: `Product "${title}" updated successfully in Database!` });
        await refreshProducts();
        setTimeout(() => {
          router.push("/admin/products");
        }, 1200);
      } else {
        setSaveMessage({ type: "error", text: data.error || "Failed to update product" });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Network request error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#C5A880" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "2rem", marginBottom: "1rem", display: "block" }}></i>
        Loading product specs for <strong>{productId}</strong>...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div style={{ fontSize: "0.8rem", color: "#8C827A", marginBottom: "0.25rem" }}>
            <Link href="/admin/products" style={{ color: "#C5A880", textDecoration: "none" }}>Products</Link> / Edit Piece ({sku})
          </div>
          <h1 className="admin-page-title">Edit Jewellery Piece: {title || sku}</h1>
          <p className="admin-page-desc">
            Modify physical weights, karat purities, making charges, diamond grades, and multi-tone imagery.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/admin/products" className="btn btn-outline btn-sm">
            Cancel
          </Link>
          <button type="submit" form="edit-product-form" className="btn btn-gold btn-sm" disabled={isSaving}>
            {isSaving ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk"></i> Save & Publish Changes
              </>
            )}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div
          style={{
            padding: "0.9rem 1.25rem",
            marginBottom: "1.5rem",
            borderRadius: "8px",
            fontSize: "0.9rem",
            background: saveMessage.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
            border: `1px solid ${saveMessage.type === "success" ? "#10B981" : "#EF4444"}`,
            color: saveMessage.type === "success" ? "#A7F3D0" : "#FCA5A5"
          }}
        >
          <i className={`fa-solid ${saveMessage.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} style={{ marginRight: "0.5rem" }}></i>
          {saveMessage.text}
        </div>
      )}

      <form id="edit-product-form" onSubmit={handleSaveProduct} className="admin-form-grid">
        {/* Left Column: Form Fields */}
        <div>
          {/* Section 1: Basic Identity & Categorization */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
              1. Identity, Category & Collections
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="admin-form-group">
                <label className="admin-label">Product SKU / Code *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  readOnly
                  style={{ opacity: 0.8, cursor: "not-allowed" }}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Collection Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={collection}
                  onChange={e => setCollection(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Product Title *</label>
              <input
                type="text"
                className="admin-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Primary Metal Collection Selector Cards (Cream/Gold Luxury Theme) */}
            <div className="admin-form-group">
              <label className="admin-label" style={{ color: "#F5EAD6", fontWeight: 700 }}>
                1. Select Main Metal Collection *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                {[
                  { key: "gold", title: "Gold Collection", icon: "🟡", desc: "22K/24K Gold Items" },
                  { key: "diamond", title: "Diamond Collection", icon: "💎", desc: "Solitaires & VVS Items" },
                  { key: "silver", title: "Silver Collection", icon: "⚪", desc: "925 Silver & Payal" },
                  { key: "other", title: "Other / Special", icon: "✨", desc: "Custom Heirlooms" }
                ].map(mat => {
                  const isSelected = primaryMaterial === mat.key;
                  return (
                    <button
                      key={mat.key}
                      type="button"
                      onClick={() => {
                        setPrimaryMaterial(mat.key as any);
                        setNavCategories(prev => {
                          const base = prev.filter(c => !["gold", "diamond", "silver", "other"].includes(c));
                          return Array.from(new Set([...base, "all", mat.key]));
                        });
                      }}
                      style={{
                        padding: "0.85rem 0.65rem",
                        borderRadius: "10px",
                        textAlign: "left",
                        background: isSelected ? "linear-gradient(135deg, rgba(245, 234, 214, 0.18) 0%, rgba(197, 168, 128, 0.25) 100%)" : "#110E0C",
                        border: isSelected ? "2px solid #D4B68A" : "1px solid rgba(197, 168, 128, 0.2)",
                        color: isSelected ? "#F5EAD6" : "#A3978B",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: isSelected ? "0 4px 15px rgba(212, 182, 138, 0.2)" : "none"
                      }}
                    >
                      <div style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>{mat.icon}</div>
                      <strong style={{ display: "block", fontSize: "0.85rem", color: isSelected ? "#F5EAD6" : "#E2D8CC" }}>
                        {mat.title}
                      </strong>
                      <span style={{ fontSize: "0.68rem", opacity: 0.75 }}>{mat.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Collection Selection Chips (Auto-Maps to Category, SubCategory & NavCategories) */}
            <div className="admin-form-group">
              <label className="admin-label" style={{ color: "#F5EAD6", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <i className="fa-solid fa-layer-group" style={{ color: "#D4B68A" }}></i>
                2. Choose Sub-Collection / Category *
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", padding: "0.75rem", background: "#110E0C", border: "1px solid rgba(197, 168, 128, 0.2)", borderRadius: "10px" }}>
                {(
                  primaryMaterial === "gold" ? [
                    { slug: "necklace", title: "Necklace & Rani Haar", category: "necklaces", icon: "fa-crown" },
                    { slug: "earrings", title: "Earrings & Tops", category: "earrings", icon: "fa-spa" },
                    { slug: "nose-pins", title: "Nose Pins", category: "nose-pins", icon: "fa-ring" },
                    { slug: "gold-hoops-balis", title: "Gold Hoops & Balis", category: "earrings", icon: "fa-circle-notch" },
                    { slug: "pendants", title: "Pendants", category: "pendants", icon: "fa-gem" },
                    { slug: "mangalsutra", title: "Mangalsutra", category: "mangalsutra", icon: "fa-heart" },
                    { slug: "chains", title: "Chains", category: "chains", icon: "fa-link" },
                    { slug: "bangles", title: "Bangles & Kadas", category: "bangles", icon: "fa-circle" },
                    { slug: "bracelet", title: "Bracelet", category: "bangles", icon: "fa-ring" }
                  ] : primaryMaterial === "diamond" ? [
                    { slug: "diamond-rings", title: "Diamond Rings & Solitaires", category: "rings", icon: "fa-ring" },
                    { slug: "diamond-earrings", title: "Diamond Earrings", category: "earrings", icon: "fa-gem" },
                    { slug: "diamond-pendants", title: "Diamond Pendants", category: "pendants", icon: "fa-gem" }
                  ] : primaryMaterial === "silver" ? [
                    { slug: "silver-payal", title: "Silver Payal & Anklets", category: "silverware", icon: "fa-spa" },
                    { slug: "silverware", title: "Silverware & Coins", category: "silverware", icon: "fa-coins" }
                  ] : [
                    { slug: "wedding", title: "Bridal / Wedding", category: "necklaces", icon: "fa-gem" },
                    { slug: "daily-wear", title: "Daily Wear", category: "chains", icon: "fa-spa" },
                    { slug: "gifting", title: "Gifting Suite", category: "pendants", icon: "fa-gift" }
                  ]
                ).map(sub => {
                  const isSubSelected = navCategories.includes(sub.slug) || category === sub.category;
                  return (
                    <button
                      key={sub.slug}
                      type="button"
                      onClick={() => {
                        setCategory(sub.category);
                        setSubCategory(sub.title);
                        setCollection(`${primaryMaterial.toUpperCase()} ${sub.title} Curation`);
                        setNavCategories(prev => Array.from(new Set([...prev, "all", primaryMaterial, sub.slug, sub.category])));
                      }}
                      style={{
                        padding: "0.45rem 0.85rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: isSubSelected ? 700 : 500,
                        background: isSubSelected ? "#F5EAD6" : "rgba(255,255,255,0.04)",
                        color: isSubSelected ? "#832729" : "#C5B6A6",
                        border: isSubSelected ? "1.5px solid #D4B68A" : "1px solid rgba(197, 168, 128, 0.2)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem"
                      }}
                    >
                      <i className={`fa-solid ${sub.icon}`} style={{ fontSize: "0.75rem", color: isSubSelected ? "#832729" : "#C5A880" }}></i>
                      <span>{sub.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Storefront Placement Preview Summary Box (Cream Theme) */}
            <div style={{ background: "rgba(245, 234, 214, 0.08)", border: "1.5px solid #D4B68A", borderRadius: "10px", padding: "0.85rem 1.1rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#F5EAD6", fontWeight: 700, fontSize: "0.86rem" }}>
                <i className="fa-solid fa-circle-check" style={{ color: "#4ADE80" }}></i>
                <span>Storefront Auto-Placement Summary:</span>
              </div>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: "#E2D8CC", lineHeight: 1.5 }}>
                This piece will automatically show under: <strong style={{ color: "#F5EAD6" }}>{primaryMaterial.toUpperCase()} Collection ➔ {subCategory || category}</strong> (/collections/{navCategories.find(c => c !== "all" && c !== primaryMaterial) || category})
              </p>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Optional Filter Tags (Multi-Select):</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {availableCategories.map(c => (
                  <button
                    key={c.key}
                    type="button"
                    className={`filter-color-pill ${navCategories.includes(c.key) ? "active" : ""}`}
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      border: "1px solid rgba(197, 168, 128, 0.3)",
                      background: navCategories.includes(c.key) ? "#C5A880" : "#110E0C",
                      color: navCategories.includes(c.key) ? "#14110E" : "#EDE8E3",
                      cursor: "pointer"
                    }}
                    onClick={() => toggleNavCategory(c.key)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Metal, Weights & Making Charges */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
              2. Precious Metal Weights & Making Charges
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="admin-form-group">
                <label className="admin-label">Net Gold Weight (Grams) *</label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  className="admin-input"
                  value={netGoldWeight}
                  onChange={e => setNetGoldWeight(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Gross Item Weight (Grams) *</label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  className="admin-input"
                  value={grossWeight}
                  onChange={e => setGrossWeight(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="admin-form-group">
                <label className="admin-label">Default Karat Purity *</label>
                <select
                  className="admin-select"
                  value={defaultKarat}
                  onChange={e => setDefaultKarat(e.target.value as KaratType)}
                >
                  <option value="24K">24K Pure Bullion (99.9%)</option>
                  <option value="22K">22K BIS 916 Hallmark (91.6%)</option>
                  <option value="18K">18K Diamond Gold (75.0%)</option>
                  <option value="14K">14K Luxe Gold (58.3%)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Default Metal Tone *</label>
                <select
                  className="admin-select"
                  value={defaultColor}
                  onChange={e => setDefaultColor(e.target.value as MetalTone)}
                >
                  <option value="yellow">Yellow Gold</option>
                  <option value="rose">Rose Gold</option>
                  <option value="white">White Gold</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div className="admin-form-group">
                <label className="admin-label">Making Charge Mode</label>
                <select
                  className="admin-select"
                  value={makingType}
                  onChange={e => setMakingType(e.target.value as any)}
                >
                  <option value="percent">% of Gold Value</option>
                  <option value="per_gram">₹ / Gram Gross</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Making Charge Value ({makingType === "percent" ? "%" : "₹/g"})</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="admin-input"
                  value={makingValue}
                  onChange={e => setMakingValue(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Festive Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="admin-input"
                  value={discountPercent}
                  onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Diamond & Solitaire Specs */}
          <div className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", margin: 0, fontFamily: "var(--font-serif)" }}>
                3. Diamonds & Precious Gemstones
              </h3>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#C5A880", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={hasDiamonds}
                  onChange={e => setHasDiamonds(e.target.checked)}
                />
                <span>Include Diamonds / Solitaires</span>
              </label>
            </div>

            {hasDiamonds && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                <div className="admin-form-group">
                  <label className="admin-label">Stone Count</label>
                  <input
                    type="number"
                    min="1"
                    className="admin-input"
                    value={stoneCount}
                    onChange={e => setStoneCount(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Total Carat (ct)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="admin-input"
                    value={diamondCarat}
                    onChange={e => setDiamondCarat(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Clarity Grade</label>
                  <select
                    className="admin-select"
                    value={diamondClarity}
                    onChange={e => setDiamondClarity(e.target.value)}
                  >
                    <option value="VVS-EF">VVS-EF (Flawless Colorless)</option>
                    <option value="VS-GH">VS-GH (Near Colorless)</option>
                    <option value="SI-IJ">SI-IJ (Commercial Sparkle)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Cut Type</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={diamondCut}
                    onChange={e => setDiamondCut(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Rate / Carat (₹/ct)</label>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    className="admin-input"
                    value={pricePerCarat}
                    onChange={e => setPricePerCarat(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Multi-Angle Imagery & Legal Compliance */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
              4. Photography & Legal BIS Certification
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <ImageUploadInput
                label="Yellow Gold Image (Choose File / URL) *"
                value={imageYellow}
                onChange={setImageYellow}
                required
              />

              <ImageUploadInput
                label="Rose Gold Image (Choose File / URL)"
                value={imageRose}
                onChange={setImageRose}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <ImageUploadInput
                label="White Gold Image (Choose File / URL)"
                value={imageWhite}
                onChange={setImageWhite}
              />

              <ImageUploadInput
                label="Hover Angle Image (Choose File / URL)"
                value={imageHover}
                onChange={setImageHover}
              />
            </div>


            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="admin-form-group">
                <label className="admin-label">BIS Laser HUID Code *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={huid}
                  onChange={e => setHuid(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Lab Assay Certificate</label>
                <input
                  type="text"
                  className="admin-input"
                  value={certificate}
                  onChange={e => setCertificate(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Detailed Luxury Description *</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Dimensions / Sizing String</label>
              <input
                type="text"
                className="admin-input"
                value={dimensions}
                onChange={e => setDimensions(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Live Calculation Preview Box */}
        <div className="admin-live-calc-box">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "#C5A880" }}>
            <i className="fa-solid fa-calculator"></i>
            <strong style={{ fontSize: "0.95rem" }}>Live Price Calculation Preview</strong>
          </div>

          <div style={{ fontSize: "0.76rem", color: "#8C827A", marginBottom: "1rem", lineHeight: 1.5 }}>
            Calculated in real-time synced with today&apos;s 24K benchmark: <strong>₹{bullionRates.gold24k}/g</strong>
          </div>

          {/* Image Thumbnail Preview */}
          <div style={{ borderRadius: "8px", overflow: "hidden", height: "180px", marginBottom: "1.25rem", border: "1px solid rgba(197, 168, 128, 0.3)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageYellow || "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg"} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <h4 style={{ fontSize: "0.95rem", color: "#FFFFFF", marginBottom: "0.75rem", borderBottom: "1px solid rgba(197, 168, 128, 0.2)", paddingBottom: "0.5rem" }}>
            {title || "Untitled Piece"}
          </h4>

          {/* Itemized Calculations */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#B5ACA4" }}>{defaultKarat} Pure Gold ({netGoldWeight}g @ ₹{breakdown.ratePerGram}/g):</span>
              <strong>{PricingEngine.formatINR(breakdown.metalCost)}</strong>
            </div>

            {hasDiamonds && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#B5ACA4" }}>Diamonds ({diamondCarat} ct @ ₹{pricePerCarat}/ct):</span>
                <strong>{PricingEngine.formatINR(breakdown.diamondCost)}</strong>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#B5ACA4" }}>Making Charges ({makingType === "percent" ? `${makingValue}%` : `₹${makingValue}/g`}):</span>
              <span>
                {breakdown.hasDiscount && (
                  <span style={{ textDecoration: "line-through", color: "#8C827A", marginRight: "0.35rem", fontSize: "0.74rem" }}>
                    {PricingEngine.formatINR(breakdown.baseMakingCharges)}
                  </span>
                )}
                <strong>{PricingEngine.formatINR(breakdown.effectiveMakingCharges)}</strong>
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "0.4rem" }}>
              <span style={{ color: "#B5ACA4" }}>Taxable Subtotal:</span>
              <strong>{PricingEngine.formatINR(breakdown.taxableSubtotal)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#B5ACA4" }}>GST (3% HSN 7113):</span>
              <strong>{PricingEngine.formatINR(breakdown.gstAmount)}</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1.5px solid #C5A880",
                paddingTop: "0.75rem",
                marginTop: "0.5rem",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#FFFFFF"
              }}
            >
              <span>Grand Total:</span>
              <span style={{ color: "#C5A880" }}>{PricingEngine.formatINR(breakdown.finalPrice)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-gold"
            style={{ width: "100%", marginTop: "1.5rem", justifyContent: "center" }}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk"></i> Save & Publish Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
