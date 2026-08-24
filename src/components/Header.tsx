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
  const { bullionRates, products, cartCount, openCartDrawer, searchQuery, setSearchQuery } = useApp();
  const [categoriesMap, setCategoriesMap] = useState<Record<string, any>>({});
  const [navCategories, setNavCategories] = useState<Array<{ slug: string; title: string; icon: string; parentSlug?: string }>>(DEFAULT_NAV_ITEMS);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileAccordion, setActiveMobileAccordion] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          setCategoriesMap(data.categories);
          const list = Object.values(data.categories).map((cat: any) => ({
            slug: cat.slug,
            title: cat.title || cat.name,
            parentSlug: cat.parentSlug || "",
            icon: CATEGORY_ICONS[cat.slug] || "fa-gem"
          }));
          if (list.length > 0) {
            setNavCategories(list);
          }
        }
      })
      .catch(err => console.warn("Failed to fetch nav categories:", err));
  }, []);

  // Lock background body scroll when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

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
    ? products.filter(p => matchesSearchQuery(p, searchQuery)).slice(0, 5)
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
            
            {/* Left Block: Brand Logo Emblem & Hindi Typography */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link href="/" className="tanishq-logo-wrapper" title="Swarn Mahal Jewellers" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/asset/logo.png" 
                  alt="Swarn Mahal Emblem" 
                  className="tanishq-logo-img" 
                  style={{ height: "44px", width: "auto", objectFit: "contain" }} 
                />
                <div className="tanishq-logo-text" style={{ display: "flex", flexDirection: "column" }}>
                  <span className="tanishq-title" style={{ fontFamily: "serif", fontWeight: 700, fontSize: "1.2rem", color: "#832729", lineHeight: 1.15, letterSpacing: "0.02em" }}>स्वर्ण महल</span>
                  <span className="tanishq-tagline" style={{ fontSize: "0.6rem", letterSpacing: "1.2px", color: "#C59B27", textTransform: "uppercase", fontWeight: 600 }}>SWARN MAHAL JEWELLERS</span>
                </div>
              </Link>
            </div>

            {/* Center Search Box with Live Auto-Complete Dropdown */}
            <div className="tanishq-search-box" style={{ position: "relative", zIndex: 999999 }}>
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
                <div
                  className="tanishq-search-dropdown"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    right: 0,
                    minWidth: "350px",
                    background: "#FFFFFF",
                    borderRadius: "14px",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
                    border: "1.5px solid var(--gold-deep)",
                    zIndex: 9999999,
                    padding: "1rem",
                    maxHeight: "450px",
                    overflowY: "auto"
                  }}
                >
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
              {/* Desktop Only Actions: Admin Diamond, Visit Showroom, Cart */}
              <div className="desktop-only-action-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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

              {/* ☰ 3-Line Hamburger Menu Button (Positioned on the RIGHT for Mobile!) */}
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
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Strip (Visible on mobile phones < 768px) */}
        <div className="mobile-header-search-strip">
          <form onSubmit={handleSearchSubmit} style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search 22K Gold, Solitaires, Jhumkas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              style={{
                width: "100%",
                padding: "0.55rem 0.85rem 0.55rem 2.3rem",
                borderRadius: "20px",
                border: "1px solid var(--border-gold)",
                fontSize: "0.82rem",
                background: "#FFFFFF",
                outline: "none"
              }}
            />
            <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "0.85rem", color: "#832729", fontSize: "0.85rem" }}></i>
          </form>
        </div>

        {/* Tier 2: Dynamic Category Navigation Strip (Desktop Nav with Sub-Collection Dropdowns) */}
        <nav className="tanishq-category-strip">
          <div className="tanishq-cat-inner">
            {/* Top-Level Categories Filtering */}
            {navCategories.filter(c => !c.parentSlug).map(cat => {
              const children = navCategories.filter(sub => sub.parentSlug === cat.slug);
              return (
                <div key={cat.slug} className="tanishq-cat-dropdown-wrapper">
                  <Link href={`/collections/${cat.slug}`} className="tanishq-cat-item" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                    <i className={`fa-solid ${cat.icon}`}></i>
                    <span>{cat.title}</span>
                    {children.length > 0 && <i className="fa-solid fa-chevron-down" style={{ fontSize: "0.62rem", opacity: 0.8, marginLeft: "2px" }}></i>}
                  </Link>

                  {/* Floating Luxury Hover Dropdown for Sub-Collections */}
                  {children.length > 0 && (
                    <div className="tanishq-cat-dropdown-menu">
                      {children.map(sub => (
                        <Link
                          key={sub.slug}
                          href={`/collections/${sub.slug}`}
                          className="tanishq-dropdown-item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            padding: "0.55rem 0.85rem",
                            fontSize: "0.83rem",
                            color: "var(--text-primary)",
                            textDecoration: "none",
                            borderRadius: "6px",
                            transition: "background 0.2s ease"
                          }}
                        >
                          <i className={`fa-solid ${sub.icon}`} style={{ color: "var(--gold-deep)", fontSize: "0.78rem" }}></i>
                          <span>{sub.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link href="/about" className="tanishq-cat-item" style={{ color: "var(--gold-deep)", fontWeight: 700 }}>
              <i className="fa-solid fa-circle-info"></i> About Us
            </Link>
            <Link href="/calculator" className="tanishq-cat-item" style={{ color: "var(--gold-deep)", fontWeight: 700 }}>
              <i className="fa-solid fa-calculator"></i> Calculator
            </Link>
          </div>
        </nav>
      </header>

      {/* ☰ 3-Line Hamburger Navigation Drawer Modal (Side Slide-In Drawer from Right - Full Height 100vh!) */}
      {isMobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999999, display: "flex", justifyContent: "flex-end" }}>
          {/* Dark Backdrop */}
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Side Slide-in Drawer FROM RIGHT */}
          <div
            style={{
              position: "relative",
              width: "350px",
              maxWidth: "90vw",
              height: "100vh",
              maxHeight: "100vh",
              background: "#FFFFFF",
              boxShadow: "-10px 0 40px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              zIndex: 2,
              animation: "slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: "1.1rem 1.25rem", borderBottom: "1px solid #F0ECE8", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(180deg, #FAF6F2 0%, #F5EAD6 100%)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/asset/logo.png" alt="Swarn Mahal" style={{ height: "38px" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontFamily: "serif", fontWeight: 700, color: "#832729", fontSize: "1.15rem", lineHeight: 1.1 }}>स्वर्ण महल</span>
                  <span style={{ fontSize: "0.58rem", color: "#C59B27", letterSpacing: "1px", fontWeight: 700 }}>SWARN MAHAL JEWELLERS</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "#832729", color: "#FFFFFF", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(131, 39, 41, 0.3)" }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Quick Action Pills: About & Calculator */}
            <div style={{ padding: "0.85rem 1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", background: "#FAF6F2", borderBottom: "1px solid #EAE3DA" }}>
              <Link
                href="/about"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.6rem 0.85rem", borderRadius: "12px", background: "#FFFFFF", border: "1px solid rgba(197, 168, 128, 0.4)", color: "#832729", fontWeight: 700, textDecoration: "none", fontSize: "0.84rem", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fa-solid fa-circle-info" style={{ color: "#C59B27" }}></i>
                <span>About Us</span>
              </Link>

              <Link
                href="/calculator"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.6rem 0.85rem", borderRadius: "12px", background: "#FFFFFF", border: "1px solid rgba(197, 168, 128, 0.4)", color: "#832729", fontWeight: 700, textDecoration: "none", fontSize: "0.84rem", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fa-solid fa-calculator" style={{ color: "#C59B27" }}></i>
                <span>Calculator</span>
              </Link>
            </div>

            {/* Drawer Navigation Links Scroll Area */}
            <div
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                flex: "1 1 0%",
                minHeight: 0,
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                overscrollBehaviorY: "contain"
              }}
            >
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1.2px", color: "#832729", fontWeight: 800, marginBottom: "0.1rem" }}>
                Browse Collections & Sub-Categories:
              </div>

              {/* Dynamic Main Metal Collections with Expandable Accordion */}
              {navCategories.filter(c => !c.parentSlug && c.slug !== "all").map(mainCat => {
                const subItems = navCategories.filter(sub => sub.parentSlug === mainCat.slug);
                const isExpanded = activeMobileAccordion === mainCat.slug;
                return (
                  <div
                    key={mainCat.slug}
                    style={{
                      background: "#FAF6F2",
                      border: isExpanded ? "1.5px solid #832729" : "1px solid rgba(197, 168, 128, 0.35)",
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow: isExpanded ? "0 4px 15px rgba(131, 39, 41, 0.12)" : "0 2px 6px rgba(0,0,0,0.02)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div
                      onClick={() => setActiveMobileAccordion(prev => prev === mainCat.slug ? null : mainCat.slug)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.9rem 1.1rem",
                        background: isExpanded ? "linear-gradient(135deg, #F5EAD6 0%, #E8D9BF 100%)" : "linear-gradient(135deg, #FAF6F2 0%, #F5EAD6 100%)",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <i className={`fa-solid ${mainCat.icon}`} style={{ color: "#832729", fontSize: "1.15rem" }}></i>
                        <span style={{ color: "#1C1917", fontWeight: 700, fontSize: "0.98rem" }}>{mainCat.title}</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {subItems.length > 0 && (
                          <span style={{ fontSize: "0.7rem", color: "#832729", background: "#FFFFFF", border: "1px solid rgba(197, 168, 128, 0.4)", padding: "0.15rem 0.55rem", borderRadius: "12px", fontWeight: 700 }}>
                            {subItems.length} items
                          </span>
                        )}
                        <i
                          className="fa-solid fa-chevron-down"
                          style={{
                            fontSize: "0.75rem",
                            color: "#832729",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s ease"
                          }}
                        ></i>
                      </div>
                    </div>

                    {/* Collapsible Sub-Collections 1-Column Vertical Scrollable List inside Drawer */}
                    {isExpanded && subItems.length > 0 && (
                      <div
                        style={{
                          padding: "0.65rem 0.75rem 0.85rem",
                          background: "#FFFFFF",
                          borderTop: "1px solid rgba(197, 168, 128, 0.3)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          maxHeight: "260px",
                          overflowY: "auto",
                          WebkitOverflowScrolling: "touch",
                          overscrollBehaviorY: "contain"
                        }}
                      >
                        <Link
                          href={`/collections/${mainCat.slug}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.65rem 0.85rem",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #832729 0%, #5E1A1B 100%)",
                            color: "#FFFFFF",
                            fontSize: "0.86rem",
                            fontWeight: 700,
                            textDecoration: "none"
                          }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span>Explore All {mainCat.title}</span>
                          <i className="fa-solid fa-arrow-right" style={{ fontSize: "0.8rem" }}></i>
                        </Link>

                        {subItems.map(sub => (
                          <Link
                            key={sub.slug}
                            href={`/collections/${sub.slug}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0.65rem 0.85rem",
                              borderRadius: "10px",
                              background: "#FAF6F2",
                              border: "1px solid rgba(197, 168, 128, 0.25)",
                              color: "#332927",
                              fontSize: "0.88rem",
                              fontWeight: 600,
                              textDecoration: "none"
                            }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <i className={`fa-solid ${sub.icon}`} style={{ fontSize: "0.85rem", color: "#832729", width: "20px", textAlign: "center" }}></i>
                              <span>{sub.title}</span>
                            </div>
                            <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.72rem", color: "#C59B27" }}></i>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer Store Call Action */}
            <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #F0ECE8", background: "#FAF6F2" }}>
              <a
                href="tel:+917566747628"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #832729 0%, #5E1A1B 100%)",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  boxShadow: "0 4px 15px rgba(131, 39, 41, 0.3)"
                }}
              >
                <i className="fa-solid fa-phone"></i> Call Store: +91 75667 47628
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
