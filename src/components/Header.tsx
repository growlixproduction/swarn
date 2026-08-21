"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";

const DEFAULT_NAV_ITEMS = [
  { slug: "all", title: "All Jewellery", icon: "fa-gem" },
  { slug: "gold", title: "Gold", icon: "fa-crown" },
  { slug: "diamond", title: "Diamond", icon: "fa-ring" },
  { slug: "earrings", title: "Earrings", icon: "fa-spa" },
  { slug: "daily-wear", title: "Daily Wear", icon: "fa-circle-nodes" },
  { slug: "gemstone", title: "Gemstone", icon: "fa-certificate" },
  { slug: "wedding", title: "Wedding", icon: "fa-shield-heart" },
  { slug: "gifting", title: "Gifting", icon: "fa-gift" },
  { slug: "under-50k", title: "Under 50K", icon: "fa-tags" }
];

const CATEGORY_ICONS: Record<string, string> = {
  "all": "fa-gem",
  "gold": "fa-crown",
  "diamond": "fa-ring",
  "earrings": "fa-spa",
  "daily-wear": "fa-circle-nodes",
  "gemstone": "fa-certificate",
  "wedding": "fa-shield-heart",
  "gifting": "fa-gift",
  "under-50k": "fa-tags"
};

export default function Header() {
  const { bullionRates, cartCount, openCartDrawer, searchQuery, setSearchQuery } = useApp();
  const [navCategories, setNavCategories] = useState<Array<{ slug: string; title: string; icon: string }>>(DEFAULT_NAV_ITEMS);

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

  return (
    <header className="tanishq-header sticky-top" id="header">
      {/* Tier 1: Main Top Row */}
      <div className="tanishq-top-row">
        <div className="tanishq-row-inner">
          {/* Brand Logo */}
          <Link href="/" className="tanishq-logo-wrapper">
            <div className="tanishq-crest">
              <span className="crest-letters">SM</span>
            </div>
            <div className="tanishq-logo-text">
              <span className="tanishq-title">स्वर्ण महल</span>
              <span className="tanishq-tagline">SWARN MAHAL JEWELLERS</span>
            </div>
          </Link>

          {/* Center Search Box */}
          <div className="tanishq-search-box">
            <div className="tanishq-search-input-wrap">
              <i className="fa-solid fa-magnifying-glass search-icon-left"></i>
              <input
                type="text"
                placeholder="Search for gold rani haar, diamond rings, solitaire..."
                className="tanishq-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="tanishq-actions-row">
            {/* Live Gold Rate Chip */}
            <div className="tanishq-rate-chip" title="Live 22K Hallmarked Gold Rate">
              <span className="tanishq-live-dot"></span>
              <span>22K: {rate22k}/g</span>
            </div>

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

      {/* Tier 2: Dynamic Category Navigation Strip */}
      <nav className="tanishq-category-strip">
        <div className="tanishq-cat-inner">
          {navCategories.map(cat => (
            <Link key={cat.slug} href={`/collections/${cat.slug}`} className="tanishq-cat-item">
              <i className={`fa-solid ${cat.icon}`}></i> {cat.title}
            </Link>
          ))}
          <Link href="/#showroom-section" className="tanishq-cat-item">
            <i className="fa-solid fa-store"></i> Showroom
          </Link>
        </div>
      </nav>

      {/* Real-Time Ticker Ribbon */}
      <div className="header-ticker-track">
        <div className="container header-ticker-inner">
          <span><strong>24K Gold:</strong> {rate24k}/g <span style={{ color: "#059669", fontWeight: 700 }}>▲ {bullionRates.trend24h}</span></span>
          <span><strong>22K Hallmark:</strong> {rate22k}/g</span>
          <span><strong>18K Diamond:</strong> {formatCurrency(bullionRates.gold18k)}/g</span>
          <span><strong>14K Luxe:</strong> {formatCurrency(bullionRates.gold14k)}/g</span>
          <span><strong>925 Silver:</strong> {formatCurrency(bullionRates.silver925)}/g</span>
          <span style={{ color: "var(--text-muted)" }}><i className="fa-regular fa-clock"></i> Synced: {bullionRates.lastUpdated}</span>
        </div>
      </div>
    </header>
  );
}
