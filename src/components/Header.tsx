"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { PricingEngine } from "../lib/pricingEngine";

const Header: React.FC = () => {
  const router = useRouter();
  const { bullionRates, getCartCount, searchQuery, setSearchQuery, setIsCartOpen } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/collections/all?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const rate24k = PricingEngine.formatINR(bullionRates.gold24k);
  const rate22k = PricingEngine.formatINR(bullionRates.gold22k);
  const rate18k = PricingEngine.formatINR(bullionRates.gold18k);
  const rate14k = PricingEngine.formatINR(bullionRates.gold14k);
  const rateSilver = PricingEngine.formatINR(bullionRates.silver925);

  return (
    <header className={`tanishq-header ${isScrolled ? "scrolled" : ""}`} id="main-header">
      {/* Top 2-Tier Header Row */}
      <div className="tanishq-top-row">
        <div className="container tanishq-row-inner">
          <Link href="/" className="tanishq-logo-wrapper" title="Swarn Mahal Jewellers">
            <div className="tanishq-crest">
              <span className="crest-letters">SM</span>
            </div>
            <div className="tanishq-logo-text">
              <span className="tanishq-title">SWARN MAHAL</span>
              <span className="tanishq-tagline">SAWARN LUXURY JEWELS • AMBIKAPUR</span>
            </div>
          </Link>

          {/* Search Box */}
          <div className="tanishq-search-box">
            <div className="tanishq-search-input-wrap">
              <i className="fa-solid fa-magnifying-glass search-icon-left"></i>
              <input
                type="text"
                className="tanishq-search-input"
                placeholder="Search for gold rani haar, diamond rings, solitaire..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                autoComplete="off"
              />
              <div className="tanishq-search-right-tools">
                <button
                  type="button"
                  className="tanishq-tool-btn"
                  title="Search Now"
                  onClick={() => router.push(`/collections/all?q=${encodeURIComponent(searchQuery)}`)}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Actions Row */}
          <div className="tanishq-actions-row">
            <Link href="/#tools-section" className="tanishq-rate-chip" title="Live Bullion Rate">
              <span className="tanishq-live-dot"></span>
              <span className="rate-label-text">22K: {rate22k}/g</span>
            </Link>

            <Link href="/collections/diamond" className="tanishq-nav-icon-btn" title="Diamond Solitaires">
              <i className="fa-regular fa-gem"></i>
            </Link>

            <Link href="/#showroom-section" className="tanishq-nav-icon-btn" title="Ambikapur Showroom">
              <i className="fa-solid fa-store"></i>
            </Link>

            <button
              type="button"
              className="tanishq-nav-icon-btn tanishq-cart-btn"
              title="Shopping Bag"
              onClick={() => setIsCartOpen(true)}
            >
              <i className="fa-solid fa-bag-shopping"></i>
              <span className="badge-count" id="header-cart-count">
                {getCartCount()}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Strip */}
      <nav className="tanishq-category-strip">
        <div className="container tanishq-cat-inner">
          <Link href="/collections/all" className="tanishq-cat-item">
            <i className="fa-solid fa-gem"></i> All Jewellery
          </Link>
          <Link href="/collections/gold" className="tanishq-cat-item">
            <i className="fa-solid fa-crown"></i> Gold
          </Link>
          <Link href="/collections/diamond" className="tanishq-cat-item">
            <i className="fa-solid fa-ring"></i> Diamond
          </Link>
          <Link href="/collections/earrings" className="tanishq-cat-item">
            <i className="fa-solid fa-spa"></i> Earrings
          </Link>
          <Link href="/collections/daily-wear" className="tanishq-cat-item">
            <i className="fa-solid fa-circle-nodes"></i> Daily Wear
          </Link>
          <Link href="/collections/gemstone" className="tanishq-cat-item">
            <i className="fa-solid fa-certificate"></i> Gemstone
          </Link>
          <Link href="/collections/wedding" className="tanishq-cat-item">
            <i className="fa-solid fa-shield-heart"></i> Wedding
          </Link>
          <Link href="/collections/gifting" className="tanishq-cat-item">
            <i className="fa-solid fa-gift"></i> Gifting
          </Link>
          <Link href="/collections/under-50k" className="tanishq-cat-item">
            <i className="fa-solid fa-tags"></i> Under 50K
          </Link>
          <Link href="/#showroom-section" className="tanishq-cat-item">
            <i className="fa-solid fa-store"></i> Showroom
          </Link>
        </div>
      </nav>

      {/* Real-time Ticker Ribbon */}
      <div className="header-ticker-track" style={{ background: "var(--bg-secondary)", padding: "0.25rem 0", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", fontSize: "0.72rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
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
};

export default Header;
