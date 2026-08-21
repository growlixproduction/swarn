"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PRODUCTS_CATALOG } from "../../../lib/catalogData";
import { useApp } from "../../../context/AppContext";
import { PricingEngine } from "../../../lib/pricingEngine";
import { KaratType, MetalTone } from "../../../lib/types";
import LiveCalculationTable from "../../../components/LiveCalculationTable";
import ProductCard from "../../../components/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.id as string) || "SM-101";

  const product = PRODUCTS_CATALOG.find(p => p.id === productId) || PRODUCTS_CATALOG[0];

  const {
    bullionRates,
    productSelections,
    setProductKarat,
    setProductColor,
    setProductSize,
    setProductEngraving,
    addToCart,
    openCostBreakup,
    openARTryOn,
    priceLockSeconds
  } = useApp();

  const selection = productSelections[product.id] || {
    karat: product.defaultKarat,
    color: product.defaultColor,
    size: "14 (Indian)",
    engraving: "",
    makingCharge: { type: "percent", value: product.makingChargePercent || 15 }
  };

  const currentKarat = selection.karat || product.defaultKarat;
  const currentColor = selection.color || product.defaultColor;

  const [activeGalleryImg, setActiveGalleryImg] = useState<string>(
    (product.images && product.images[currentColor]) || product.images.yellow
  );

  const [pincode, setPincode] = useState("497001");
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(
    "Ambikapur Flagship Express: Same-day pickup / In-store trial available today at Church Road."
  );

  const breakdown = PricingEngine.calculateBreakdown(
    product,
    currentKarat,
    bullionRates,
    null,
    selection.makingCharge
  );

  const galleryImages =
    product.images && product.images.gallery && product.images.gallery.length > 0
      ? product.images.gallery
      : [(product.images && product.images[currentColor]) || product.images.yellow, product.images.hover || product.images.yellow];

  const handleColorChange = (c: MetalTone) => {
    setProductColor(product.id, c);
    const newImg = (product.images && product.images[c]) || product.images.yellow;
    setActiveGalleryImg(newImg);
  };

  const handlePincodeCheck = () => {
    if (pincode === "497001" || pincode.startsWith("497")) {
      setDeliveryStatus("Ambikapur Flagship Express: Same-day pickup / In-store consultation available today.");
    } else if (pincode.length === 6) {
      setDeliveryStatus("Insured Express Delivery: Estimated delivery in 2-3 business days via Sequel Secure Logistics.");
    } else {
      setDeliveryStatus("Please enter a valid 6-digit Indian PIN code.");
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const related = PRODUCTS_CATALOG.filter(
    p => p.id !== product.id && (p.category === product.category || p.navCategories.some(c => product.navCategories.includes(c)))
  ).slice(0, 4);

  return (
    <main className="container pdp-section" style={{ padding: "1.5rem 0.85rem 5rem", maxWidth: "1280px", margin: "0 auto", overflowX: "hidden" }}>
      {/* Breadcrumb */}
      <div className="plp-breadcrumb" style={{ marginBottom: "1.5rem", color: "var(--text-muted)", fontSize: "0.82rem", flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "var(--text-secondary)" }}>Home</Link>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.65rem", margin: "0 0.45rem", color: "var(--gold-deep)" }}></i>
        <Link href={`/collections/${product.category}`} style={{ color: "var(--text-secondary)" }}>
          {product.collection}
        </Link>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.65rem", margin: "0 0.45rem", color: "var(--gold-deep)" }}></i>
        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{product.title}</span>
      </div>

      {/* 2-Column Split: Gallery + PDP Config Pane */}
      <div className="pdp-main-grid">
        {/* Left Column: Gallery & Zoom Viewport */}
        <div className="pdp-gallery-col">
          <div className="pdp-thumb-strip">
            {galleryImages.map((imgSrc, idx) => (
              <div
                key={idx}
                className={`pdp-thumb-item ${activeGalleryImg === imgSrc ? "active" : ""}`}
                onClick={() => setActiveGalleryImg(imgSrc)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgSrc} alt={`${product.title} angle ${idx + 1}`} />
              </div>
            ))}
          </div>

          <div className="pdp-main-image-viewport">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeGalleryImg} alt={product.title} id="pdp-main-img" />
            <button
              type="button"
              className="pdp-ar-float-badge"
              onClick={() => openARTryOn(product.id)}
            >
              <i className="fa-solid fa-camera"></i> AR Virtual Try-On
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Configuration Pane */}
        <div className="pdp-info-col">
          <span className="pdp-collection-badge" style={{ display: "inline-block", background: "var(--bg-tint-gold)", color: "var(--gold-deep)", border: "1px solid var(--border-gold)", borderRadius: "4px", padding: "0.2rem 0.6rem", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
            {product.collection.toUpperCase()}
          </span>

          <h1 className="pdp-heading-title" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)", lineHeight: 1.25, wordBreak: "break-word" }}>
            {product.title}
          </h1>

          <div className="pdp-rating-row" style={{ display: "flex", alignItems: "center", gap: "0.4rem 0.65rem", marginBottom: "1.15rem", flexWrap: "wrap" }}>
            <div style={{ color: "#F59E0B", fontSize: "0.9rem" }}>★ ★ ★ ★ ★</div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {product.rating} / 5.0 ({product.reviews} Reviews)
            </span>
            <span className="huid-mini-tag" style={{ marginLeft: "0", fontSize: "0.65rem" }}>
              <i className="fa-solid fa-certificate"></i> BIS HUID: {product.huid}
            </span>
          </div>

          {/* Dynamic Price Hero Card */}
          <div className="pdp-pricing-card" style={{ background: "#FFFFFF", border: "1.5px solid var(--border-gold)", borderRadius: "12px", padding: "0.85rem", marginBottom: "1.25rem" }}>
            <div className="pdp-price-hero-row" style={{ display: "flex", alignItems: "baseline", gap: "0.4rem 0.6rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
              <span className="pdp-hero-price" style={{ fontSize: "clamp(1.4rem, 4vw, 1.9rem)", fontWeight: 700, color: "var(--text-primary)" }}>
                {PricingEngine.formatINR(breakdown.finalPrice)}
              </span>
              {breakdown.hasDiscount && (
                <span className="pdp-hero-original-price" style={{ fontSize: "0.95rem", textDecoration: "line-through", color: "var(--text-muted)" }}>
                  {PricingEngine.formatINR(breakdown.originalPrice)}
                </span>
              )}
              {breakdown.hasDiscount && (
                <span className="pdp-hero-savings-badge" style={{ background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0", borderRadius: "4px", padding: "0.15rem 0.45rem", fontSize: "0.68rem", fontWeight: 700 }}>
                  Save {PricingEngine.formatINR(breakdown.savingsAmount)} ({breakdown.discountPct}% OFF Making)
                </span>
              )}
            </div>
            <div className="pdp-gst-inclusive-text" style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.35 }}>
              Inclusive of all taxes (3% GST HSN 7113) with 100% itemized transparency.
            </div>

            {/* PROMINENT GOLD WEIGHT & ASSAY HIGHLIGHT BOX */}
            <div className="pdp-weight-box-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.5rem", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px dashed var(--border-gold)" }}>
              <div style={{ background: "rgba(197, 168, 128, 0.12)", border: "1.5px solid var(--border-gold)", borderRadius: "8px", padding: "0.5rem 0.6rem" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", fontWeight: 700 }}>
                  ⚖️ Net Gold Weight
                </span>
                <strong style={{ fontSize: "1rem", color: "var(--gold-deep)", display: "block", marginTop: "0.1rem", fontWeight: 800 }}>
                  {product.netGoldWeightGrams} Grams ({product.netGoldWeightGrams}g)
                </strong>
              </div>

              <div style={{ background: "rgba(197, 168, 128, 0.08)", border: "1px solid var(--border-gold)", borderRadius: "8px", padding: "0.5rem 0.6rem" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", fontWeight: 700 }}>
                  📐 Gross Total Weight
                </span>
                <strong style={{ fontSize: "1rem", color: "var(--text-primary)", display: "block", marginTop: "0.1rem", fontWeight: 700 }}>
                  {product.grossWeightGrams} Grams ({product.grossWeightGrams}g)
                </strong>
              </div>
            </div>

            {/* Dynamic 15-Minute Price Lock Banner */}
            <div className="pdp-price-lock-strip" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.35rem", background: "var(--bg-tint-gold)", border: "1px dashed var(--border-gold)", borderRadius: "8px", padding: "0.4rem 0.65rem", marginTop: "0.75rem", fontSize: "0.74rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <i className="fa-solid fa-lock" style={{ color: "var(--gold-deep)" }}></i>
                <span>Live Market Rate Locked:</span>
              </div>
              <strong style={{ color: "var(--gold-deep)" }}>{formatTimer(priceLockSeconds)}</strong>
            </div>
          </div>


          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: "1.25rem" }}>
            {product.description}
          </p>

          {/* Purity Selector */}
          <div className="pdp-option-card" style={{ marginBottom: "1.15rem" }}>
            <div className="pdp-option-title" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.2rem 0.5rem", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.45rem" }}>
              <span>Select Gold Purity Karat:</span>
              <span style={{ color: "var(--gold-deep)", fontSize: "0.74rem" }}>
                18K Diamond / 22K Hallmark
              </span>
            </div>
            <div className="pdp-karat-group" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.45rem" }}>
              {product.supportedKarats.map(k => (
                <div
                  key={k}
                  className={`pdp-karat-btn ${k === currentKarat ? "active" : ""}`}
                  style={{ padding: "0.5rem 0.35rem", textAlign: "center", cursor: "pointer", borderRadius: "6px" }}
                  onClick={() => setProductKarat(product.id, k)}
                >
                  <span className="pdp-karat-name" style={{ display: "block", fontWeight: 700, fontSize: "0.85rem" }}>
                    {k} Gold
                  </span>
                  <span className="pdp-karat-purity" style={{ display: "block", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                    {k === "24K" ? "99.9% Pure" : k === "22K" ? "91.6% Hallmark" : k === "18K" ? "75.0% Diamond" : "58.3% Luxe"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="pdp-option-card" style={{ marginBottom: "1.15rem" }}>
            <div className="pdp-option-title" style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.45rem" }}>
              <span>Select Precious Metal Tone:</span>
            </div>
            <div className="pdp-color-group" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.45rem" }}>
              {product.supportedColors.map(c => (
                <div
                  key={c}
                  className={`pdp-color-btn ${c === currentColor ? "active" : ""}`}
                  style={{ padding: "0.45rem 0.35rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", cursor: "pointer", borderRadius: "6px" }}
                  onClick={() => handleColorChange(c)}
                >
                  <span className={`color-dot ${c}`}></span>
                  <span style={{ fontSize: "0.74rem", fontWeight: 600 }}>{c.toUpperCase()} GOLD</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sizing Selector */}
          <div className="pdp-option-card" style={{ marginBottom: "1.25rem" }}>
            <div className="pdp-option-title" style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              <span>Select Sizing / Dimensions:</span>
            </div>
            <select
              className="pdp-size-select"
              value={selection.size}
              onChange={e => setProductSize(product.id, e.target.value)}
              style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.88rem" }}
            >
              <option value="12 (Indian)">Size 12 - 16.5 mm (Standard Small)</option>
              <option value="14 (Indian)">Size 14 - 17.2 mm (Standard Medium - Most Popular)</option>
              <option value="16 (Indian)">Size 16 - 17.8 mm (Standard Large)</option>
              <option value="18 (Indian)">Size 18 - 18.5 mm (Comfort Fit)</option>
              <option value="Custom Size">Custom Size (Ambikapur Stylist will call for sizing)</option>
            </select>
          </div>

          {/* Complimentary Laser Engraving Input */}
          <div className="pdp-option-card" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="engraving-input" className="pdp-option-title" style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.4rem", display: "block" }}>
              <i className="fa-solid fa-pen-nib" style={{ color: "var(--gold-deep)", marginRight: "0.35rem" }}></i>
              Complimentary Inner-Band Laser Engraving:
            </label>
            <input
              id="engraving-input"
              type="text"
              className="pdp-engraving-input"
              placeholder="e.g. Aryan & Ananya ❤️ 2026"
              value={selection.engraving}
              maxLength={22}
              onChange={e => setProductEngraving(product.id, e.target.value)}
              style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.88rem" }}
            />
            <div className="engraving-live-preview" style={{ marginTop: "0.4rem", fontSize: "0.74rem", color: "var(--gold-deep)", fontStyle: "italic" }}>
              {selection.engraving
                ? `Laser Inner Preview: "✦ ${selection.engraving} ✦"`
                : "Laser inner band engraving preview will appear here..."}
            </div>
          </div>

          {/* REAL-TIME LIVE GOLD PRICE & MAKING CHARGES TABLE */}
          <LiveCalculationTable product={product} />

          {/* Pincode Delivery Estimator */}
          <div className="pdp-pincode-card" style={{ background: "#FFFFFF", border: "1px solid var(--border-light)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              <i className="fa-solid fa-location-dot" style={{ color: "var(--gold-deep)", marginRight: "0.35rem" }}></i>
              Check Delivery & Showroom Trial:
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={pincode}
                maxLength={6}
                onChange={e => setPincode(e.target.value)}
                style={{ flex: 1, padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.85rem" }}
              />
              <button type="button" className="btn btn-gold btn-sm" onClick={handlePincodeCheck}>
                Check
              </button>
            </div>
            {deliveryStatus && (
              <div style={{ marginTop: "0.6rem", fontSize: "0.76rem", color: "var(--text-secondary)" }}>
                <i className="fa-solid fa-circle-check" style={{ color: "#059669", marginRight: "0.3rem" }}></i>
                {deliveryStatus}
              </div>
            )}
          </div>

          {/* Main Purchase Action Buttons */}
          <div className="pdp-actions-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <button
              type="button"
              className="btn-pdp-cart"
              onClick={() => addToCart(product)}
            >
              <i className="fa-solid fa-bag-shopping"></i> Add to Shopping Bag
            </button>
            <button
              type="button"
              className="btn-pdp-breakup"
              onClick={() => openCostBreakup(product.id)}
            >
              <i className="fa-solid fa-receipt"></i> 100% Cost Breakup
            </button>
          </div>

          {/* Secondary Assurances Strip */}
          <div className="pdp-trust-strip" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", textAlign: "center", borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem" }}>
            <div>
              <i className="fa-solid fa-stamp" style={{ color: "var(--gold-deep)", fontSize: "1.1rem", marginBottom: "0.25rem" }}></i>
              <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>BIS 916 Hallmark</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Laser Inscribed HUID</div>
            </div>
            <div>
              <i className="fa-solid fa-arrow-rotate-left" style={{ color: "var(--gold-deep)", fontSize: "1.1rem", marginBottom: "0.25rem" }}></i>
              <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>100% Buyback</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Lifetime Exchange</div>
            </div>
            <div>
              <i className="fa-solid fa-truck-fast" style={{ color: "var(--gold-deep)", fontSize: "1.1rem", marginBottom: "0.25rem" }}></i>
              <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>Insured Delivery</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Sequel Logistics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Table Section */}
      <section className="pdp-specs-section" style={{ marginTop: "4rem", borderTop: "1px solid var(--border-light)", paddingTop: "3rem" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Product Specifications & Transparency Sheet
        </h3>
        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Every single piece from Swarn Mahal Jewellers is manufactured with high-precision micro assay standards and accompanied by legal BIS/IGI certification.
        </p>

        <div className="pdp-specs-grid">
          <div className="pdp-spec-row">
            <span className="pdp-spec-label">Precious Metal:</span>
            <span className="pdp-spec-value">{currentKarat} Pure Gold ({currentColor.toUpperCase()})</span>
          </div>
          <div className="pdp-spec-row">
            <span className="pdp-spec-label">Net Gold Weight:</span>
            <span className="pdp-spec-value">{product.netGoldWeightGrams} Grams</span>
          </div>
          <div className="pdp-spec-row">
            <span className="pdp-spec-label">Gross Item Weight:</span>
            <span className="pdp-spec-value">{product.grossWeightGrams} Grams</span>
          </div>
          <div className="pdp-spec-row">
            <span className="pdp-spec-label">BIS Hallmark HUID:</span>
            <span className="pdp-spec-value">{product.huid} (Assayed)</span>
          </div>
          <div className="pdp-spec-row">
            <span className="pdp-spec-label">Certification:</span>
            <span className="pdp-spec-value">{product.certificate}</span>
          </div>
          <div className="pdp-spec-row">
            <span className="pdp-spec-label">Dimensions / Sizing:</span>
            <span className="pdp-spec-value">{product.dimensions || "Standard Indian Size"}</span>
          </div>
          <div className="pdp-spec-row">
            <span className="pdp-spec-label">Diamond / Stone Grade:</span>
            <span className="pdp-spec-value">
              {product.diamondSpecs
                ? `${product.diamondSpecs.totalCaratWeight} ct • ${product.diamondSpecs.clarity} (${product.diamondSpecs.cut})`
                : product.gemstoneSpecs
                ? `${product.gemstoneSpecs.stoneType} (${product.gemstoneSpecs.weightCarat} ct)`
                : "Pure Gold Piece"}
            </span>
          </div>
          <div className="pdp-spec-row">
            <span className="pdp-spec-label">Return & Buyback:</span>
            <span className="pdp-spec-value">Lifetime 100% Exchange Policy</span>
          </div>
        </div>
      </section>

      {/* Related Recommendations */}
      {related.length > 0 && (
        <section style={{ marginTop: "4.5rem" }}>
          <div className="section-header" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="section-tag">COMPLETE YOUR ENSEMBLE</span>
            <h2 className="section-title">Matching Jewellery Recommendations</h2>
            <p className="section-subtitle">Complementary heirlooms selected by Swarn Mahal stylists to pair with your piece.</p>
          </div>
          <div className="products-grid">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
