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

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data && data.products && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch(err => console.warn("Failed to fetch live products for About Us:", err));
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
      {/* 1. Showroom Story & Heritage Section (Moved from Homepage) */}
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
