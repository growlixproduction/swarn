"use client";

import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import CategoryStories from "../components/CategoryStories";
import TrustBar from "../components/TrustBar";
import BentoPromo from "../components/BentoPromo";
import MoodboardSection from "../components/MoodboardSection";
import CollageGallerySection from "../components/CollageGallerySection";
import ToolsSection from "../components/ToolsSection";
import DualSpotlightSection from "../components/DualSpotlightSection";
import ReviewsSection from "../components/ReviewsSection";
import ProductCard from "../components/ProductCard";
import { PRODUCTS_CATALOG } from "../lib/catalogData";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = PRODUCTS_CATALOG.filter(p => {
    if (activeTab === "all") return true;
    return p.category === activeTab;
  });

  return (
    <div>
      {/* 1. LUXURY HERO SLIDER SECTION */}
      <HeroSection />

      {/* 2. CIRCULAR CATEGORY STORIES STRIP */}
      <CategoryStories />

      {/* 3. 4-ITEM TRUST & VALUE PROP STRIP */}
      <TrustBar />

      {/* 4. EDITORIAL BENTO PROMO GRID */}
      <BentoPromo />

      {/* 5. LATEST PRODUCTS & DYNAMIC PRICING CATALOG */}
      <section className="products-section" id="products-section">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">LIVE FORMULA DRIVEN CATALOG</span>
            <h2 className="section-title">Latest Masterpiece Products</h2>
            <p className="section-subtitle">
              Switch Karat (14K/18K/22K) & Gold Color in real-time to watch prices recalculate accurately based on live gold market rates.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs reveal-scale">
            {[
              { label: "All Designs", key: "all" },
              { label: "Rings", key: "rings" },
              { label: "Necklaces & Sets", key: "necklaces" },
              { label: "Bracelets & Bangles", key: "bangles" },
              { label: "Earrings", key: "earrings" },
              { label: "Bullion Coins", key: "bullion" }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Product Cards Grid */}
          <div className="products-grid reveal-stagger" id="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. CATEGORY MOODBOARD SHOWCASE */}
      <MoodboardSection />

      {/* 7. LUXURY BENTO COLLAGE GALLERY SECTION */}
      <CollageGallerySection />

      {/* 8. INTERACTIVE CALCULATORS: LIVE GOLD RATE & OLD GOLD EXCHANGE */}
      <ToolsSection />

      {/* 9. DUAL SPOTLIGHT BANNERS */}
      <DualSpotlightSection />

      {/* 10. TESTIMONIALS FROM JUSTDIAL 5.0 VERIFIED BUYERS */}
      <ReviewsSection />

      {/* 11. BRAND ASSURANCES & CERTIFICATION LOGOS */}
      <section className="trust-logos-row" style={{ background: "var(--bg-secondary)", padding: "2.5rem 0", borderTop: "1px solid var(--border-light)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: "2rem", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className="fa-solid fa-stamp" style={{ fontSize: "1.3rem", color: "var(--gold-deep)" }}></i>
            <span>BIS Hallmarked 916 Pure Gold</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className="fa-solid fa-gem" style={{ fontSize: "1.3rem", color: "var(--gold-deep)" }}></i>
            <span>IGI & GIA Certified Solitaires</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className="fa-solid fa-scale-balanced" style={{ fontSize: "1.3rem", color: "var(--gold-deep)" }}></i>
            <span>100% Itemized Live Billing</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className="fa-solid fa-shield-halved" style={{ fontSize: "1.3rem", color: "var(--gold-deep)" }}></i>
            <span>100% Transit Insured Delivery</span>
          </div>
        </div>
      </section>
    </div>
  );
}
