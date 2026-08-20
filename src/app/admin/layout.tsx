"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PricingEngine } from "@/lib/pricingEngine";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { bullionRates } = useApp();

  const NAV_ITEMS = [
    { label: "Overview Dashboard", href: "/admin", icon: "fa-chart-pie" },
    { label: "Products & Pricing", href: "/admin/products", icon: "fa-ring" },
    { label: "Add New Product", href: "/admin/products/new", icon: "fa-plus-circle" },
    { label: "Categories & Collections", href: "/admin/collections", icon: "fa-folder-tree" },
    { label: "Gifting & Occasion Suite", href: "/admin/gifting", icon: "fa-gift" },
    { label: "Banners & Hero Slider", href: "/admin/banners", icon: "fa-image" },
    { label: "Bullion Rates & Policy", href: "/admin/rates", icon: "fa-coins" },
    { label: "Showroom & Collage Vault", href: "/admin/gallery", icon: "fa-store" }
  ];

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link href="/admin" className="admin-brand-crest">
            <div className="admin-crest-badge">SM</div>
            <div>
              <span className="admin-brand-title">SWARN MAHAL</span>
              <span className="admin-brand-sub">ADMIN PORTAL • AMBIKAPUR</span>
            </div>
          </Link>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-group-title">Catalogue & Merchandising</div>
          {NAV_ITEMS.slice(0, 5).map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link ${isActive ? "active" : ""}`}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="admin-nav-group-title">Marketing & Bullion Rules</div>
          {NAV_ITEMS.slice(5).map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link ${isActive ? "active" : ""}`}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(197, 168, 128, 0.15)", fontSize: "0.72rem", color: "#8C827A" }}>
          <div>Swarn Mahal Admin v2.4 (Next.js)</div>
          <div style={{ color: "#C5A880", marginTop: "0.2rem" }}>Ambikapur Flagship Store</div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-live-ticker-chip">
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }}></span>
              <span>24K Bullion Live: <strong>{PricingEngine.formatINR(bullionRates.gold24k)}/g</strong></span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#B5ACA4" }}>
              22K Hallmark: <strong>{PricingEngine.formatINR(bullionRates.gold22k)}/g</strong> • 18K Diamond: <strong>{PricingEngine.formatINR(bullionRates.gold18k)}/g</strong>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <Link href="/" className="btn-storefront">
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
              <span>View Live Storefront</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Admin Page Content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
