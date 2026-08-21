"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCTS_CATALOG } from "@/lib/catalogData";
import { useApp } from "@/context/AppContext";
import { PricingEngine } from "@/lib/pricingEngine";
import { KaratType, MetalTone } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { matchesSearchQuery } from "@/lib/searchMatcher";

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const { bullionRates, searchQuery, setSearchQuery } = useApp();

  const activeQuery = queryParam || searchQuery;

  // Filters State
  const [maxPrice, setMaxPrice] = useState<number>(350000);
  const [selectedKarats, setSelectedKarats] = useState<KaratType[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Filter Catalog by active query
  let filtered = PRODUCTS_CATALOG.filter(p => matchesSearchQuery(p, activeQuery));

  // Karat Filter
  if (selectedKarats.length > 0) {
    filtered = filtered.filter(p => p.supportedKarats.some(k => selectedKarats.includes(k)));
  }

  // Color Filter
  if (selectedColor !== "all") {
    filtered = filtered.filter(p => p.supportedColors.includes(selectedColor as MetalTone));
  }

  // Price Filter
  filtered = filtered.filter(p => {
    const bd = PricingEngine.calculateBreakdown(p, p.defaultKarat, bullionRates);
    return bd.finalPrice <= maxPrice;
  });

  // Sorting
  filtered.sort((a, b) => {
    const bdA = PricingEngine.calculateBreakdown(a, a.defaultKarat, bullionRates);
    const bdB = PricingEngine.calculateBreakdown(b, b.defaultKarat, bullionRates);
    if (sortBy === "price-asc") return bdA.finalPrice - bdB.finalPrice;
    if (sortBy === "price-desc") return bdB.finalPrice - bdA.finalPrice;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "weight") return b.netGoldWeightGrams - a.netGoldWeightGrams;
    return 0;
  });

  const toggleKarat = (karat: KaratType) => {
    setSelectedKarats(prev => (prev.includes(karat) ? prev.filter(k => k !== karat) : [...prev, karat]));
  };

  const resetFilters = () => {
    setMaxPrice(350000);
    setSelectedKarats([]);
    setSelectedColor("all");
    setSortBy("recommended");
    setSearchQuery("");
  };

  return (
    <div>
      {/* Search Header Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #1C1917 0%, #110E0C 100%)",
          padding: "3.5rem 1rem",
          color: "#FFFFFF",
          textAlign: "center",
          borderBottom: "1px solid var(--border-gold-subtle)"
        }}
      >
        <div className="container" style={{ maxWidth: "800px" }}>
          <span style={{ display: "inline-block", background: "rgba(197, 168, 128, 0.2)", border: "1px solid var(--gold-primary)", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.72rem", letterSpacing: "0.15em", color: "var(--gold-light)", marginBottom: "0.85rem" }}>
            LIVE CATALOG NLP SEARCH
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
            Search Results for &quot;<span style={{ color: "var(--gold-light)" }}>{activeQuery || "All Masterpieces"}</span>&quot;
          </h1>
          <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.8)", margin: 0 }}>
            Showing <strong>{filtered.length}</strong> handcrafted jewellery heirlooms synced with today&apos;s 24K gold rate (₹{bullionRates.gold24k}/g).
          </p>
        </div>
      </section>

      {/* Main Search Results Area */}
      <div className="container" style={{ padding: "2.5rem 1rem 5rem" }}>
        {/* Breadcrumb & Results Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--text-secondary)" }}>Home</Link>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.65rem", margin: "0 0.45rem", color: "var(--gold-deep)" }}></i>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Search: &quot;{activeQuery}&quot;</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Found <strong>{filtered.length}</strong> Matching Items
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.82rem", background: "#FFFFFF" }}
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="weight">Gold Weight</option>
            </select>
          </div>
        </div>

        {/* 2-Column Split: Sidebar + Products Grid */}
        <div className="plp-layout-container">
          {/* Faceted Filter Sidebar */}
          <aside className="plp-sidebar">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.75rem" }}>
              <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
                <i className="fa-solid fa-sliders" style={{ color: "var(--gold-deep)", marginRight: "0.4rem" }}></i>
                Refine Search
              </strong>
              <button
                type="button"
                onClick={resetFilters}
                style={{ background: "none", border: "none", color: "var(--rose-gold)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
              >
                Reset All
              </button>
            </div>

            {/* Price Filter */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                <span>Max Price Limit:</span>
                <span style={{ color: "var(--gold-deep)" }}>₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="500000"
                step="5000"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--gold-deep)", cursor: "pointer" }}
              />
            </div>

            {/* Karat Filter */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.6rem" }}>
                Gold Purity (Karat):
              </label>
              {(["24K", "22K", "18K", "14K"] as KaratType[]).map(k => (
                <label key={k} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.45rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedKarats.includes(k)}
                    onChange={() => toggleKarat(k)}
                    style={{ accentColor: "var(--gold-deep)" }}
                  />
                  <span>{k} Pure Gold</span>
                </label>
              ))}
            </div>

            {/* Precious Metal Tone */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.6rem" }}>
                Precious Metal Tone:
              </label>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {[
                  { label: "All", key: "all" },
                  { label: "Yellow", key: "yellow" },
                  { label: "Rose", key: "rose" },
                  { label: "White", key: "white" }
                ].map(c => (
                  <button
                    key={c.key}
                    type="button"
                    className={`filter-color-pill ${selectedColor === c.key ? "active" : ""}`}
                    style={{
                      padding: "0.3rem 0.6rem",
                      borderRadius: "4px",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      border: "1px solid var(--border-light)",
                      background: selectedColor === c.key ? "var(--gold-deep)" : "#FFFFFF",
                      color: selectedColor === c.key ? "#FFFFFF" : "var(--text-secondary)",
                      cursor: "pointer"
                    }}
                    onClick={() => setSelectedColor(c.key)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 1rem", background: "#FFFFFF", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
                <i className="fa-solid fa-magnifying-glass" style={{ fontSize: "2.5rem", color: "var(--gold-light)", marginBottom: "1rem" }}></i>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No Matching Jewellery Found</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
                  We couldn&apos;t find any designs matching &quot;{activeQuery}&quot;. Try searching for gold rings, solitaires, or rani haars.
                </p>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                  {["Ring", "Solitaire", "Haar", "Earrings", "Chain"].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setSearchQuery(tag)}
                    >
                      Search &quot;{tag}&quot;
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: "5rem", textAlign: "center", color: "#C5A880" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
        <div>Searching Swarn Mahal Catalogue...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
