"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PricingEngine } from "@/lib/pricingEngine";
import { KaratType, MetalTone, Product } from "@/lib/types";
import { ImageUploadInput } from "@/components/ImageUploadInput";


export default function AdminNewProductPage() {
  const router = useRouter();
  const { bullionRates } = useApp();

  // Form State
  const [sku, setSku] = useState("SM-120");
  const [title, setTitle] = useState("Royal Peacock Solitaire Diamond Ring");
  const [collection, setCollection] = useState("Solitaire Collection");
  const [category, setCategory] = useState("rings");
  const [subCategory, setSubCategory] = useState("Solitaire Rings");
  const [navCategories, setNavCategories] = useState<string[]>(["all", "diamond", "gifting"]);

  // Weights & Karats
  const [netGoldWeight, setNetGoldWeight] = useState<number>(4.5);
  const [grossWeight, setGrossWeight] = useState<number>(4.8);
  const [defaultKarat, setDefaultKarat] = useState<KaratType>("18K");
  const [defaultColor, setDefaultColor] = useState<MetalTone>("yellow");

  // Making & Discounts
  const [makingType, setMakingType] = useState<"percent" | "per_gram">("percent");
  const [makingValue, setMakingValue] = useState<number>(14);
  const [discountPercent, setDiscountPercent] = useState<number>(15);

  // Diamonds & Gemstones
  const [hasDiamonds, setHasDiamonds] = useState(true);
  const [stoneCount, setStoneCount] = useState<number>(1);
  const [diamondCarat, setDiamondCarat] = useState<number>(0.35);
  const [diamondClarity, setDiamondClarity] = useState("VVS-EF");
  const [diamondCut, setDiamondCut] = useState("Round Brilliant");
  const [pricePerCarat, setPricePerCarat] = useState<number>(68000);

  // Images
  const [imageYellow, setImageYellow] = useState("https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80");
  const [imageRose, setImageRose] = useState("https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80");
  const [imageWhite, setImageWhite] = useState("https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80");
  const [imageHover, setImageHover] = useState("https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80");

  // Legal & Descriptions
  const [huid, setHuid] = useState("SM916A8299");
  const [certificate, setCertificate] = useState("IGI-LG5829999");
  const [description, setDescription] = useState("Handcrafted pure gold band crowned with an IGI certified solitaire diamond, manufactured with BIS 916 hallmarked assay.");
  const [dimensions, setDimensions] = useState("Band Width: 2.2mm | Crown Height: 5.5mm");

  // Search Tags & Hashtags
  const [searchKeywords, setSearchKeywords] = useState("solitaire ring, diamond ring, engagement ring, gold ring");
  const [hashtags, setHashtags] = useState("#SolitaireRing #SwarnMahal #AmbikapurJewellery #IGIcertified");

  // Mock product object for live pricing engine computation
  const mockProduct: Product = {
    id: sku,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    collection,
    category: category as any,
    navCategories,
    isFeatured: true,
    isNew: true,
    rating: 5.0,
    reviews: 1,
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
      yellow: imageYellow,
      rose: imageRose,
      white: imageWhite,
      hover: imageHover,
      gallery: [imageYellow, imageRose, imageWhite]
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

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Jewellery Masterpiece "${title}" (${sku}) successfully created with live calculated price of ${PricingEngine.formatINR(breakdown.finalPrice)}!`);
    router.push("/admin/products");
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div style={{ fontSize: "0.8rem", color: "#8C827A", marginBottom: "0.25rem" }}>
            <Link href="/admin/products" style={{ color: "#C5A880", textDecoration: "none" }}>Products</Link> / Add New Piece
          </div>
          <h1 className="admin-page-title">Add New Jewellery Masterpiece</h1>
          <p className="admin-page-desc">
            Define precious metal weights, karat factors, stone grades, multi-angle images, and live formula pricing.
          </p>
        </div>

        <button type="submit" form="new-product-form" className="btn btn-gold btn-sm">
          <i className="fa-solid fa-floppy-disk"></i> Publish to Catalogue
        </button>
      </div>

      <form id="new-product-form" onSubmit={handleSaveProduct} className="admin-form-grid">
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
                  required
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="admin-form-group">
                <label className="admin-label">Physical Category *</label>
                <select
                  className="admin-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="rings">Rings</option>
                  <option value="necklaces">Necklaces & Rani Haar</option>
                  <option value="earrings">Earrings & Jhumkas</option>
                  <option value="bangles">Bracelets & Kadas</option>
                  <option value="pendants">Pendants</option>
                  <option value="bullion">Bullion & 24K Coins</option>
                  <option value="silverware">925 Silverware</option>
                  <option value="mens">Men&apos;s Jewellery</option>
                  <option value="kids">Kids & Nazariya</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Sub-Category / Style</label>
                <input
                  type="text"
                  className="admin-input"
                  value={subCategory}
                  onChange={e => setSubCategory(e.target.value)}
                  placeholder="e.g. Solitaire Rings"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Navigational & Filter Collections (Multi-Select):</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {[
                  { key: "all", label: "All Jewellery" },
                  { key: "gold", label: "22K Gold" },
                  { key: "diamond", label: "Diamond Solitaires" },
                  { key: "earrings", label: "Earrings" },
                  { key: "daily-wear", label: "Daily Luxe" },
                  { key: "gemstone", label: "Gemstone" },
                  { key: "wedding", label: "Bridal / Wedding" },
                  { key: "gifting", label: "Gifting Suite" },
                  { key: "under-50k", label: "Under ₹50,000" }
                ].map(c => (
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
                  step="0.01"
                  min="0.1"
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
                  step="0.01"
                  min="0.1"
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

          {/* Section 5: Search Keywords & Hashtags */}
          <div className="admin-card">
            <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
              5. Search Tags & Hashtag Engine
            </h3>

            <div className="admin-form-group">
              <label className="admin-label">Search Keywords (Comma Separated)</label>
              <input
                type="text"
                className="admin-input"
                value={searchKeywords}
                onChange={e => setSearchKeywords(e.target.value)}
              />
              <span style={{ fontSize: "0.72rem", color: "#8C827A", marginTop: "0.25rem", display: "block" }}>
                Used by search bar auto-complete & NLP search matching.
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Social Hashtags</label>
              <input
                type="text"
                className="admin-input"
                value={hashtags}
                onChange={e => setHashtags(e.target.value)}
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
            <img src={imageYellow} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
          >
            <i className="fa-solid fa-cloud-arrow-up"></i> Save & Publish Product
          </button>
        </div>
      </form>
    </div>
  );
}
