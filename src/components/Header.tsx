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
  const { bullionRates, cartCount, openCartDrawer } = useApp();
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
  const rate18k = formatCurrency(bullionRates.gold18k);
  const rate14k = formatCurrency(bullionRates.gold14k);
  const rateSilver = formatCurrency(bullionRates.silver925);

  return (
    <header className="tanishq-header-root sticky-top" id="header">
      {/* Top Brand & Utility Header */}
      <div className="container tanishq-header-inner">
        <div className="header-col-left">
          <Link href="/" className="brand-crest-group">
            <div className="brand-logo-crest">
              <span className="crest-monogram">SM</span>
            </div>
            <div className="brand-title-wrap">
              <span className="brand-name-main">स्वर्ण महल</span>
              <span className="brand-subtitle">SWARN MAHAL JEWELLERS</span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="header-col-center">
          <div className="tanishq-search-box">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              placeholder="Search for gold rani haar, diamond rings, solitaire..."
              className="tanishq-search-input"
            />
            <button type="button" className="tanishq-search-submit">
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Action Controls: Live Rate Badge & Cart */}
        <div className="header-col-right">
          {/* Live Rate Pill */}
          <div className="live-rate-pill">
            <span className="rate-pulse-dot"></span>
            <span className="rate-label">22K:</span>
            <strong className="rate-val">{rate22k}/g</strong>
          </div>

          <Link href="/admin/collections" className="header-icon-action" title="Admin Control Panel">
            <i className="fa-solid fa-gem"></i>
          </Link>

          <a href="#showroom-section" className="header-icon-action" title="Visit Showroom">
            <i className="fa-solid fa-store"></i>
          </a>

          {/* Cart Trigger */}
          <button
            type="button"
            className="header-icon-action cart-trigger-btn"
            onClick={openCartDrawer}
            aria-label="Open Shopping Bag"
          >
            <i className="fa-solid fa-bag-shopping"></i>
            <span className="cart-badge-count">{cartCount}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Category Navigation Strip */}
      <nav className="tanishq-category-strip">
        <div className="container tanishq-cat-inner">
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

      {/* Real-time Ticker Ribbon */}
      <div className="header-ticker-track">
        <div className="container header-ticker-inner">
          <span><strong>24K Gold:</strong> {rate24k}/g <span style={{ color: "#059669", fontWeight: 700 }}>▲ {bullionRates.trend24h}</span></span>
          <span><strong>22K Hallmark:</strong> {rate22k}/g</span>
          <span><strong>18K Diamond:</strong> {rate18k}/g</span>
          <span><strong>14K Luxe:</strong> {rate14k}/g</span>
          <span><strong>925 Silver:</strong> {rateSilver}/g</span>
          <span style={{ color: "var(--text-muted)" }}><i className="fa-regular fa-clock"></i> Synced: {bullionRates.lastUpdated}</span>
        </div>
      </div>
    </header>
  );
}
