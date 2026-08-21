"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { PRODUCTS_CATALOG } from "../lib/catalogData";
import { PricingEngine } from "../lib/pricingEngine";
import { matchesSearchQuery } from "../lib/searchMatcher";

const DEFAULT_NAV_ITEMS = [
  { slug: "all", title: "All Jewellery", icon: "fa-gem" },
  { slug: "earrings", title: "Earrings & Tops", icon: "fa-spa" },
  { slug: "nose-pins", title: "Nose Pins", icon: "fa-ring" },
  { slug: "gold-hoops-balis", title: "Gold Hoops & Balis", icon: "fa-circle-notch" },
  { slug: "pendants", title: "Pendants", icon: "fa-gem" },
  { slug: "mangalsutra", title: "Mangalsutra", icon: "fa-heart" },
  { slug: "chains", title: "Chains", icon: "fa-link" },
  { slug: "bangles", title: "Bangles", icon: "fa-circle" },
  { slug: "necklace", title: "Necklace", icon: "fa-crown" },
  { slug: "bracelet", title: "Bracelet", icon: "fa-ring" }
];

const CATEGORY_ICONS: Record<string, string> = {
  "all": "fa-gem",
  "earrings": "fa-spa",
  "nose-pins": "fa-ring",
  "gold-hoops-balis": "fa-circle-notch",
  "pendants": "fa-gem",
  "mangalsutra": "fa-heart",
  "chains": "fa-link",
  "bangles": "fa-circle",
  "necklace": "fa-crown",
  "bracelet": "fa-ring"
};

const POPULAR_SEARCH_TAGS = [
  { label: "Solitaire Ring", query: "ring" },
  { label: "Rani Haar", query: "haar" },
  { label: "22K Jhumka", query: "jhumka" },
  { label: "Gold Chain", query: "chain" },
  { label: "Nose Pin", query: "nose" },
  { label: "Mangalsutra", query: "mangalsutra" }
];

export default function Header() {
  const router = useRouter();
  const { bullionRates, cartCount, openCartDrawer, searchQuery, setSearchQuery } = useApp();
  const [navCategories, setNavCategories] = useState<Array<{ slug: string; title: string; icon: string }>>(DEFAULT_NAV_ITEMS);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          const list = Object.values(data.categories).map((cat: any) => ({
            slug: cat.slug,
            title: cat.title || cat.name,
            icon: CATEGORY_ICONS[cat.slug] || "fa-gem"
          }));
          if (list.length > 0) {
            setNavCategories(list);
          }
        }
      })
      .catch(err => console.warn("Failed to fetch nav categories:", err));
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const rate24k = formatCurrency(bullionRates.gold24k);
  const rate22k = formatCurrency(bullionRates.gold22k);
  const rate18k = formatCurrency(bullionRates.gold18k);
  const rate14k = formatCurrency(bullionRates.gold14k);
  const rateSilver = formatCurrency(bullionRates.silver925);

  // Matching Products Search Results
  const matchingProducts = searchQuery.trim()
    ? PRODUCTS_CATALOG.filter(p => matchesSearchQuery(p, searchQuery)).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const TickerItems = (
    <>
      <span className="marquee-item">
        <span className="marquee-pill">LIVE</span>
        <span><strong>24K Pure Gold:</strong> {rate24k}/g</span>
        <span style={{ color: "#4ADE80" }}>▲ {bullionRates.trend24h}</span>
      </span>
      <span className="marquee-item">•</span>
      <span className="marquee-item">
        <span><strong>22K Hallmark:</strong> {rate22k}/g</span>
      </span>
      <span className="marquee-item">•</span>
      <span className="marquee-item">
        <span><strong>18K Diamond:</strong> {rate18k}/g</span>
      </span>
      <span className="marquee-item">•</span>
      <span className="marquee-item">
        <span><strong>14K Luxe:</strong> {rate14k}/g</span>
      </span>
      <span className="marquee-item">•</span>
      <span className="marquee-item">
        <span><strong>925 Silver:</strong> {rateSilver}/g</span>
      </span>
      <span className="marquee-item">•</span>
      <span className="marquee-item">
        <span><i className="fa-solid fa-stamp" style={{ color: "#F3E5AB" }}></i> 100% BIS 916 Hallmarked & HUID Stamped</span>
      </span>
      <span className="marquee-item">•</span>
      <span className="marquee-item">
        <span><i className="fa-solid fa-location-dot" style={{ color: "#F3E5AB" }}></i> Ambikapur Flagship Store • Church Road</span>
      </span>
      <span className="marquee-item">•</span>
    </>
  );

  return (
    <>
      {/* Non-Sticky Announcement Ticker Bar (Scrolls away naturally when scrolling down!) */}
      <div className="marquee-ticker-container">
        <div className="marquee-ticker-track">
          {TickerItems}
          {TickerItems}
        </div>
      </div>

      {/* Sticky Main Navigation Header (Stays fixed at top when scrolling) */}
      <header className="tanishq-header sticky-top" id="header">
        {/* Tier 1: Main Top Row (Logo, Search Bar, Action Icons) */}
        <div className="tanishq-top-row">
          <div className="tanishq-row-inner">
            
            {/* Left Block: Hamburger ☰ Button + Brand Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* ☰ 3-Line Hamburger Menu Button */}
              <button
                type="button"
                className="mobile-hamburger-btn"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  border: "1px solid #EAE3DA",
                  background: "#FAF6F2",
                  color: "#832729",
                  fontSize: "1.15rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
                }}
              >
                <i className="fa-solid fa-bars"></i>
              </button>

              {/* Brand Logo (Official Crest + Typography) */}
              <Link href="/" className="tanishq-logo-wrapper" title="Swarn Mahal Jewellers" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/asset/logo.png" 
                  alt="Swarn Mahal Emblem" 
                  className="tanishq-logo-img" 
                  style={{ height: "46px", width: "auto", objectFit: "contain" }} 
                />
                <div className="tanishq-logo-text" style={{ display: "flex", flexDirection: "column" }}>
                  <span className="tanishq-title" style={{ fontFamily: "serif", fontWeight: 700, fontSize: "1.25rem", color: "#832729", lineHeight: 1.15, letterSpacing: "0.02em" }}>स्वर्ण महल</span>
                  <span className="tanishq-tagline" style={{ fontSize: "0.62rem", letterSpacing: "1.2px", color: "#C59B27", textTransform: "uppercase", fontWeight: 600 }}>SWARN MAHAL JEWELLERS</span>
                </div>
              </Link>
            </div>

            {/* Center Search Box with Live Auto-Complete Dropdown */}
            <div className="tanishq-search-box">
              <form onSubmit={handleSearchSubmit} className="tanishq-search-input-wrap">
                <i className="fa-solid fa-magnifying-glass search-icon-left"></i>
                <input
                  type="text"
                  placeholder="Search for gold rani haar, diamond rings, solitaire..."
                  className="tanishq-search-input"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{ background: "none", border: "none", color: "#832729", cursor: "pointer", fontSize: "0.85rem", marginRight: "0.4rem" }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </form>

              {/* Live Search Results Dropdown Overlay */}
              {isSearchFocused && (
                <div className="tanishq-search-dropdown" style={{ display: "block" }}>
                  {searchQuery.trim() ? (
                    <div>
                      <div className="tanishq-dropdown-title">
                        Matching Products ({matchingProducts.length}):
                      </div>

                      {matchingProducts.length === 0 ? (
                        <div style={{ padding: "0.75rem", fontSize: "0.82rem", color: "var(--text-muted)", textAlign: "center" }}>
                          No matching jewellery items found for &quot;{searchQuery}&quot;.
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                          {matchingProducts.map(p => {
                            const bd = PricingEngine.calculateBreakdown(p, p.defaultKarat, bullionRates);
                            return (
                              <Link
                                key={p.id}
                                href={`/product/${p.id}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.75rem",
                                  textDecoration: "none",
                                  padding: "0.4rem 0.6rem",
                                  borderRadius: "8px",
                                  background: "#FAF6F2",
                                  transition: "background 0.2s ease"
                                }}
                                onClick={() => setIsSearchFocused(false)}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={p.images.yellow}
                                  alt={p.title}
                                  style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <strong style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {p.title}
                                  </strong>
                                  <span style={{ fontSize: "0.72rem", color: "var(--gold-deep)" }}>
                                    {p.defaultKarat} Gold • {p.netGoldWeightGrams}g
                                  </span>
                                </div>
                                <strong style={{ fontSize: "0.85rem", color: "#832729" }}>
                                  {PricingEngine.formatINR(bd.finalPrice)}
                                </strong>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="tanishq-dropdown-title">Trending Searches:</div>
                      <div className="tanishq-tags-flex">
                        {POPULAR_SEARCH_TAGS.map((tag, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="tanishq-quick-pill"
                            onClick={() => {
                              setSearchQuery(tag.query);
                              setIsSearchFocused(false);
                              router.push(`/search?q=${encodeURIComponent(tag.query)}`);
                            }}
                          >
                            <i className="fa-solid fa-magnifying-glass"></i> {tag.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="tanishq-actions-row">
              <Link href="/admin/collections" className="tanishq-nav-icon-btn" title="Admin Control Panel">
                <i className="fa-solid fa-gem"></i>
              </Link>

              <a href="#showroom-section" className="tanishq-nav-icon-btn" title="Visit Showroom">
                <i className="fa-solid fa-store"></i>
              </a>

              {/* Cart Trigger */}
              <button
                type="button"
                className="tanishq-nav-icon-btn tanishq-cart-btn"
                onClick={openCartDrawer}
                aria-label="Open Shopping Bag"
              >
                <i className="fa-solid fa-bag-shopping"></i>
                <span className="badge-count">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: Dynamic Category Navigation Strip (Desktop Nav) */}
        <nav className="tanishq-category-strip">
          <div className="tanishq-cat-inner">
            {navCategories.map(cat => (
              <Link key={cat.slug} href={`/collections/${cat.slug}`} className="tanishq-cat-item">
                <i className={`fa-solid ${cat.icon}`}></i> {cat.title}
              </Link>
            ))}
            <Link href="/about" className="tanishq-cat-item" style={{ color: "var(--gold-deep)", fontWeight: 700 }}>
              <i className="fa-solid fa-circle-info"></i> About Us
            </Link>
            <Link href="/calculator" className="tanishq-cat-item" style={{ color: "var(--gold-deep)", fontWeight: 700 }}>
              <i className="fa-solid fa-calculator"></i> Gold Calculator
            </Link>
          </div>
        </nav>
      </header>

      {/* ☰ 3-Line Hamburger Navigation Drawer Modal (Mobile Drawer) */}
      {isMobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex" }}>
          {/* Dark Backdrop */}
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-in Drawer */}
          <div style={{
            position: "relative",
            width: "300px",
            maxWidth: "85vw",
            height: "100%",
            background: "#FFFFFF",
            boxShadow: "6px 0 28px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            zIndex: 2,
            animation: "slideInLeft 0.25s ease-out"
          }}>
            {/* Drawer Header */}
            <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid #F0ECE8", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAF6F2" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/asset/logo.png" alt="Swarn Mahal" style={{ height: "38px" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontFamily: "serif", fontWeight: 700, color: "#832729", fontSize: "1.1rem", lineHeight: 1.1 }}>स्वर्ण महल</span>
                  <span style={{ fontSize: "0.58rem", color: "#C59B27", letterSpacing: "1px", fontWeight: 600 }}>SWARN MAHAL</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", background: "#EAE3DA", color: "#832729", cursor: "pointer", fontSize: "1rem" }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Drawer Navigation Links (Exact list requested by user) */}
            <div style={{ padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1, overflowY: "auto" }}>
              <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "1.2px", color: "#8C827A", fontWeight: 700, marginBottom: "0.35rem", paddingLeft: "0.5rem" }}>
                Menu & Sections
              </div>

              {/* 1. About Us */}
              <Link
                href="/about"
                style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem", borderRadius: "10px", background: "#FAF6F2", color: "#832729", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fa-solid fa-circle-info" style={{ color: "#C59B27", fontSize: "1.15rem" }}></i>
                <span>About Us</span>
              </Link>

              {/* 2. Gold Calculator */}
              <Link
                href="/calculator"
                style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem", borderRadius: "10px", background: "#FAF6F2", color: "#832729", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fa-solid fa-calculator" style={{ color: "#C59B27", fontSize: "1.15rem" }}></i>
                <span>Gold Calculator</span>
              </Link>

              {/* 3. Gold Section */}
              <Link
                href="/collections/gold"
                style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem", borderRadius: "10px", background: "#FAF6F2", color: "#1C1917", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span style={{ fontSize: "1.15rem" }}>🟡</span>
                <span>Gold Section</span>
              </Link>

              {/* 4. Diamond Section */}
              <Link
                href="/collections/diamond"
                style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem", borderRadius: "10px", background: "#FAF6F2", color: "#1C1917", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span style={{ fontSize: "1.15rem" }}>💎</span>
                <span>Diamond Section</span>
              </Link>

              {/* 5. Silver Section */}
              <Link
                href="/collections/silverware"
                style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem", borderRadius: "10px", background: "#FAF6F2", color: "#1C1917", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span style={{ fontSize: "1.15rem" }}>⚪</span>
                <span>Silver Section</span>
              </Link>
            </div>

            {/* Drawer Footer Call & Store Action */}
            <div style={{ padding: "1rem", borderTop: "1px solid #F0ECE8", background: "#FAF6F2" }}>
              <a href="tel:+919999777740" className="btn btn-gold" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "0.75rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 }}>
                <i className="fa-solid fa-phone"></i> Call Store: +91 9999P-7774
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
