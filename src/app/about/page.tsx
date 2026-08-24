"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PRODUCTS_CATALOG } from "@/lib/catalogData";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import ShowroomSection from "@/components/ShowroomSection";
import { Product } from "@/lib/types";

type MaterialTab = "gold" | "diamond" | "silver" | "other";

export default function AboutUsPage() {
  const { bullionRates } = useApp();
  const [activeTab, setActiveTab] = useState<MaterialTab>("gold");
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS_CATALOG);
  const [pageBanner, setPageBanner] = useState<any>({
    badge: "OUR HERITAGE & LEGACY",
    title: "Crafting Timeless Elegance Since 2015",
    subtitle: "Swarn Mahal Jewellers Ambikapur represents purity, craftsmanship, and trust.",
    backgroundImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1600&q=85",
    overlayGradient: "linear-gradient(135deg, rgba(28, 25, 23, 0.95) 0%, rgba(17, 14, 12, 0.88) 100%)"
  });

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data && data.products && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch(err => console.warn("Failed to fetch live products for About Us:", err));

    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        if (data && data.pageBanners && data.pageBanners.about) {
          setPageBanner(data.pageBanners.about);
        }
      })
      .catch(err => console.warn("Failed to fetch live banners for About Us:", err));
  }, []);

  // Helper to infer product material
  const getProductMaterial = (p: Product): MaterialTab => {
    if (p.primaryMaterial) return p.primaryMaterial;
    const title = p.title.toLowerCase();
    const cat = p.category ? p.category.toLowerCase() : "";

    // 1. Diamonds check
    if (p.diamondSpecs || title.includes("diamond") || title.includes("solitaire")) {
      return "diamond";
    }

    // 2. Silver check
    if (cat === "silverware" || title.includes("silver")) {
      return "silver";
    }

    // 3. Gold check
    if (cat === "rings" || cat === "earrings" || cat === "necklaces" || cat === "chains" || cat === "bangles" || cat === "pendants" || cat === "mangalsutra" || cat === "bullion" || title.includes("gold")) {
      return "gold";
    }

    return "other";
  };

  // Filter catalog by active material tab
  const tabProducts = productsList.filter(p => getProductMaterial(p) === activeTab);

  const tabCounts = {
    gold: productsList.filter(p => getProductMaterial(p) === "gold").length,
    diamond: productsList.filter(p => getProductMaterial(p) === "diamond").length,
    silver: productsList.filter(p => getProductMaterial(p) === "silver").length,
    other: productsList.filter(p => getProductMaterial(p) === "other").length
  };

  return (
    <div>
      {/* Dynamic Header Banner (Editable from Admin Panel) */}
      <section
        style={{
          position: "relative",
          background: pageBanner.backgroundImage
            ? `url('${pageBanner.backgroundImage}') center/cover no-repeat`
            : "linear-gradient(135deg, #1C1917 0%, #110E0C 100%)",
          padding: "4rem 1rem",
          color: "#FFFFFF",
          textAlign: "center",
          borderBottom: "1px solid var(--border-gold-subtle)"
        }}
      >
        {pageBanner.backgroundImage && (
          <div style={{ position: "absolute", inset: 0, background: pageBanner.overlayGradient || "linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.72) 100%)" }} />
        )}
        <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "800px" }}>
          {pageBanner.badge && (
            <span
              style={{
                display: "inline-block",
                background: "rgba(197, 168, 128, 0.2)",
                border: "1px solid var(--gold-primary)",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                color: "var(--gold-light)",
                marginBottom: "0.85rem",
                fontWeight: 700
              }}
            >
              {pageBanner.badge}
            </span>
          )}
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, marginBottom: "0.5rem", color: "#FFFFFF", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
            {pageBanner.title}
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#F5EAD6", margin: 0, textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
            {pageBanner.subtitle}
          </p>
        </div>
      </section>

      {/* 1. Showroom Story & Heritage Section */}
      <ShowroomSection />

      {/* 2. Material Collection Tabs Section */}
      <section style={{ padding: "3.5rem 1rem", background: "#FAF6F2" }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span className="section-tag">CURATED COLLECTIONS BY MATERIAL</span>
            <h2 className="section-title">Explore Our Precious Collections</h2>
            <p className="section-subtitle">
              Browse all {productsList.length} products categorized by Gold, Diamond, Silver, and Custom Special creations.
            </p>
          </div>

          {/* 4 Material Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            <button
              type="button"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "30px",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                border: activeTab === "gold" ? "2px solid var(--gold-deep)" : "1px solid var(--border-light)",
                background: activeTab === "gold" ? "var(--gold-deep)" : "#FFFFFF",
                color: activeTab === "gold" ? "#FFFFFF" : "var(--text-primary)",
                boxShadow: activeTab === "gold" ? "0 4px 12px rgba(131,39,41,0.2)" : "none",
                transition: "all 0.2s ease"
              }}
              onClick={() => setActiveTab("gold")}
            >
              🟡 Gold Collection ({tabCounts.gold})
            </button>

            <button
              type="button"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "30px",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                border: activeTab === "diamond" ? "2px solid var(--gold-deep)" : "1px solid var(--border-light)",
                background: activeTab === "diamond" ? "var(--gold-deep)" : "#FFFFFF",
                color: activeTab === "diamond" ? "#FFFFFF" : "var(--text-primary)",
                boxShadow: activeTab === "diamond" ? "0 4px 12px rgba(131,39,41,0.2)" : "none",
                transition: "all 0.2s ease"
              }}
              onClick={() => setActiveTab("diamond")}
            >
              💎 Diamond Collection ({tabCounts.diamond})
            </button>

            <button
              type="button"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "30px",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                border: activeTab === "silver" ? "2px solid var(--gold-deep)" : "1px solid var(--border-light)",
                background: activeTab === "silver" ? "var(--gold-deep)" : "#FFFFFF",
                color: activeTab === "silver" ? "#FFFFFF" : "var(--text-primary)",
                boxShadow: activeTab === "silver" ? "0 4px 12px rgba(131,39,41,0.2)" : "none",
                transition: "all 0.2s ease"
              }}
              onClick={() => setActiveTab("silver")}
            >
              ⚪ Silver Collection ({tabCounts.silver})
            </button>

            <button
              type="button"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "30px",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                border: activeTab === "other" ? "2px solid var(--gold-deep)" : "1px solid var(--border-light)",
                background: activeTab === "other" ? "var(--gold-deep)" : "#FFFFFF",
                color: activeTab === "other" ? "#FFFFFF" : "var(--text-primary)",
                boxShadow: activeTab === "other" ? "0 4px 12px rgba(131,39,41,0.2)" : "none",
                transition: "all 0.2s ease"
              }}
              onClick={() => setActiveTab("other")}
            >
              ✨ Other Special Items ({tabCounts.other})
            </button>
          </div>

          {/* Products Showcase for Active Tab */}
          {tabProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", background: "#FFFFFF", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
              <i className="fa-solid fa-gem" style={{ fontSize: "2.5rem", color: "var(--gold-light)", marginBottom: "1rem" }}></i>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No designs in {activeTab.toUpperCase()} collection yet</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                Add new items under this material category from the Admin Portal.
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {tabProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
