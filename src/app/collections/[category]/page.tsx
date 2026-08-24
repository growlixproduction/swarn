"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CATEGORY_METADATA, PRODUCTS_CATALOG } from "../../../lib/catalogData";
import { useApp } from "../../../context/AppContext";
import { PricingEngine } from "../../../lib/pricingEngine";
import { KaratType, MetalTone } from "../../../lib/types";
import ProductCard from "../../../components/ProductCard";
import { matchesSearchQuery } from "../../../lib/searchMatcher";

export default function CollectionPage() {
  const params = useParams();
  const categorySlug = (params?.category as string) || "all";

  // Dynamic Category Metadata State
  const [categoriesMap, setCategoriesMap] = useState<Record<string, any>>(CATEGORY_METADATA);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          setCategoriesMap(data.categories);
        }
      })
      .catch(err => console.warn("Failed to load collection metadata:", err));
  }, []);

  // Compute active metadata
  const currentMeta = categoriesMap[categorySlug];

  // Helper to format slug to human readable Title (e.g. "nose-pins" -> "Nose Pins")
  const formatSlugToTitle = (slug: string) => {
    return slug
      .split("-")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const formattedName = currentMeta?.title || (categorySlug !== "all" ? formatSlugToTitle(categorySlug) : "All Jewellery");

  const meta = {
    title: formattedName,
    badge: currentMeta?.badge || "BIS 916 HALLMARKED • 100% PURITY",
    subtitle: currentMeta?.subtitle || `Explore handcrafted ${formattedName} in pure 22K hallmarked gold and certified diamonds.`,
    heroBg: currentMeta?.heroBg || currentMeta?.circleImg || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    guideTitle: currentMeta?.guideTitle || `${formattedName} Buying & Care Guide`,
    guideDesc: currentMeta?.guideDesc || "Every Swarn Mahal piece is accompanied by a BIS 916 purity hallmark and authentic certificate of quality."
  };

  const { bullionRates, products, searchQuery, setSearchQuery } = useApp();

  // Filters State
  const [maxPrice, setMaxPrice] = useState<number>(350000);
  const [selectedKarats, setSelectedKarats] = useState<KaratType[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");  // Compute parent & child sub-collections for current category
  const allCategories = Object.values(categoriesMap);
  const parentSlug = currentMeta?.parentSlug || "";
  const effectiveParentSlug = parentSlug || (allCategories.some((c: any) => c.parentSlug === categorySlug) ? categorySlug : "");
  const subCollections = effectiveParentSlug
    ? allCategories.filter((c: any) => c.parentSlug === effectiveParentSlug)
    : [];
  const parentMeta = parentSlug ? categoriesMap[parentSlug] : null;

  // Filter Catalog
  let filtered = products.filter(p => {
    if (categorySlug === "all") return true;
    if (categorySlug === "under-50k") {
      const bd = PricingEngine.calculateBreakdown(p, p.defaultKarat, bullionRates);
      return bd.finalPrice <= 55000 || p.navCategories.includes("under-50k");
    }

    const normSlug = categorySlug.toLowerCase();

    // Main Metal Collection Filters
    if (normSlug === "gold") {
      return (
        p.supportedKarats.some(k => ["24K", "22K", "18K", "14K"].includes(k)) ||
        p.collection.toLowerCase().includes("gold") ||
        p.title.toLowerCase().includes("gold") ||
        p.category.toLowerCase().includes("gold")
      );
    }
    if (normSlug === "diamond") {
      return (
        Boolean(p.diamondSpecs) ||
        p.category.toLowerCase().includes("diamond") ||
        p.title.toLowerCase().includes("diamond") ||
        p.collection.toLowerCase().includes("diamond")
      );
    }
    if (normSlug === "silver") {
      return (
        p.title.toLowerCase().includes("silver") ||
        p.category.toLowerCase().includes("silver") ||
        p.collection.toLowerCase().includes("silver") ||
        p.title.toLowerCase().includes("payal")
      );
    }

    return (
      p.navCategories.some(c => c.toLowerCase() === normSlug) ||
      p.category.toLowerCase() === normSlug ||
      p.title.toLowerCase().includes(normSlug) ||
      p.collection.toLowerCase().includes(normSlug)
    );
  });

  // Search Filter
  if (searchQuery) {
    filtered = filtered.filter(p => matchesSearchQuery(p, searchQuery));
  }

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
      {/* Category Hero Banner */}
      <section
        style={{
          background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url('${meta.heroBg}') center/cover no-repeat`,
          padding: "4.5rem 1rem",
          color: "#FFFFFF",
          textAlign: "center"
        }}
      >
        <div className="container" style={{ maxWidth: "800px" }}>
          <span style={{ display: "inline-block", background: "rgba(197, 168, 128, 0.3)", border: "1px solid var(--gold-primary)", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.72rem", letterSpacing: "0.15em", color: "var(--gold-light)", marginBottom: "0.85rem" }}>
            {meta.badge}
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 700, marginBottom: "0.75rem" }}>
            {meta.title}
          </h1>
          <p style={{ fontSize: "0.98rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
            {meta.subtitle}
          </p>
        </div>
      </section>

      {/* Main Catalog Area with Faceted Sidebar */}
      <div className="container" style={{ padding: "2.5rem 1rem 5rem" }}>
        {/* Breadcrumb & Results Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--text-secondary)" }}>Home</Link>
            {parentMeta && (
              <>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.65rem", margin: "0 0.45rem", color: "var(--gold-deep)" }}></i>
                <Link href={`/collections/${parentMeta.slug}`} style={{ color: "var(--text-secondary)" }}>{parentMeta.title}</Link>
              </>
            )}
            <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.65rem", margin: "0 0.45rem", color: "var(--gold-deep)" }}></i>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{meta.title}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Showing <strong>{filtered.length}</strong> Handcrafted Designs
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

        {/* Sub-Collection Filter Bar / Pills Strip */}
        {subCollections.length > 0 && (
          <div style={{ marginBottom: "2rem", padding: "1rem 1.25rem", background: "#FAF6F2", borderRadius: "12px", border: "1px solid var(--border-gold-subtle)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gold-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <i className="fa-solid fa-layer-group"></i>
              <span>{parentMeta ? `${parentMeta.title} Sub-Collections` : `${meta.title} Sub-Collections`}:</span>
            </div>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
              {effectiveParentSlug && (
                <Link
                  href={`/collections/${effectiveParentSlug}`}
                  style={{
                    padding: "0.45rem 0.95rem",
                    borderRadius: "20px",
                    fontSize: "0.82rem",
                    fontWeight: categorySlug === effectiveParentSlug ? 700 : 500,
                    background: categorySlug === effectiveParentSlug ? "var(--gold-primary)" : "#FFFFFF",
                    color: categorySlug === effectiveParentSlug ? "#FFFFFF" : "var(--text-primary)",
                    border: categorySlug === effectiveParentSlug ? "1px solid var(--gold-primary)" : "1px solid var(--border-light)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.03)"
                  }}
                >
                  All {parentMeta?.title || meta.title}
                </Link>
              )}

              {subCollections.map((sub: any) => {
                const isActive = categorySlug === sub.slug;
                const circleImg = sub.circleImg || sub.thumbnail_image;
                return (
                  <Link
                    key={sub.slug}
                    href={`/collections/${sub.slug}`}
                    style={{
                      padding: "0.45rem 0.95rem",
                      borderRadius: "20px",
                      fontSize: "0.82rem",
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? "var(--gold-primary)" : "#FFFFFF",
                      color: isActive ? "#FFFFFF" : "var(--text-primary)",
                      border: isActive ? "1px solid var(--gold-primary)" : "1px solid var(--border-light)",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem"
                    }}
                  >
                    {circleImg && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={circleImg} alt={sub.title} style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }} />
                    )}
                    <span>{sub.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 2-Column Split: Sidebar + Products Grid */}
        <div className="plp-layout-container">
          {/* Faceted Filter Sidebar */}
          <aside className="plp-sidebar">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.75rem" }}>
              <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
                <i className="fa-solid fa-sliders" style={{ color: "var(--gold-deep)", marginRight: "0.4rem" }}></i>
                Filters
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
                <i className="fa-solid fa-filter" style={{ fontSize: "2.5rem", color: "var(--gold-light)", marginBottom: "1rem" }}></i>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No Jewellery Designs Found</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
                  Try resetting your price slider or karat filters to view more handcrafted heirlooms.
                </p>
                <button type="button" className="btn btn-gold btn-sm" onClick={resetFilters}>
                  Reset All Filters
                </button>
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

        {/* Category Guide Box */}
        <div
          style={{
            marginTop: "4.5rem",
            background: "var(--bg-tint-gold)",
            border: "1.5px solid var(--border-gold)",
            borderRadius: "16px",
            padding: "2.5rem"
          }}
        >
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
            <i className="fa-solid fa-gem" style={{ color: "var(--gold-deep)", marginRight: "0.5rem" }}></i>
            {meta.guideTitle}
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
            {meta.guideDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
