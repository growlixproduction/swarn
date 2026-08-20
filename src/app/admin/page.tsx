"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS_CATALOG, STORE_CONFIG } from "@/lib/catalogData";
import { useApp } from "@/context/AppContext";
import { PricingEngine } from "@/lib/pricingEngine";

export default function AdminDashboardPage() {
  const { bullionRates } = useApp();

  const totalProducts = PRODUCTS_CATALOG.length;
  const totalCatalogValue = PRODUCTS_CATALOG.reduce((acc, p) => {
    const bd = PricingEngine.calculateBreakdown(p, p.defaultKarat, bullionRates);
    return acc + bd.finalPrice;
  }, 0);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Showroom Executive Dashboard</h1>
          <p className="admin-page-desc">
            Real-time management for Swarn Mahal catalogue, bullion pricing engine, and digital showroom assets.
          </p>
        </div>

        <Link href="/admin/products/new" className="btn btn-gold btn-sm">
          <i className="fa-solid fa-plus"></i> Add New Product
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span>TOTAL MASTERPIECES</span>
            <i className="fa-solid fa-ring"></i>
          </div>
          <div className="admin-kpi-value">{totalProducts}</div>
          <div className="admin-kpi-sub">Across 8 Navigational Categories</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span>LIVE CATALOGUE VALUE</span>
            <i className="fa-solid fa-scale-balanced"></i>
          </div>
          <div className="admin-kpi-value">{PricingEngine.formatINR(totalCatalogValue)}</div>
          <div className="admin-kpi-sub">Synchronized with ₹{bullionRates.gold24k}/g 24K Rate</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span>24K BULLION BENCHMARK</span>
            <i className="fa-solid fa-coins"></i>
          </div>
          <div className="admin-kpi-value">{PricingEngine.formatINR(bullionRates.gold24k)}/g</div>
          <div className="admin-kpi-sub" style={{ color: "#10B981" }}>
            22K Hallmark: {PricingEngine.formatINR(bullionRates.gold22k)}/g
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span>VERIFIED REVIEWS</span>
            <i className="fa-solid fa-star" style={{ color: "#F59E0B" }}></i>
          </div>
          <div className="admin-kpi-value">5.0 ★</div>
          <div className="admin-kpi-sub">{STORE_CONFIG.reviewsCount} Customer Reviews (Justdial)</div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="admin-card">
        <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
          <i className="fa-solid fa-bolt" style={{ color: "#C5A880", marginRight: "0.5rem" }}></i>
          Quick Management Portals
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <Link
            href="/admin/products/new"
            style={{ background: "#110E0C", border: "1px solid rgba(197, 168, 128, 0.2)", borderRadius: "8px", padding: "1rem", textDecoration: "none", color: "#EDE8E3", display: "block" }}
          >
            <i className="fa-solid fa-plus-circle" style={{ color: "#C5A880", fontSize: "1.2rem", marginBottom: "0.5rem", display: "block" }}></i>
            <strong style={{ fontSize: "0.88rem", display: "block" }}>Add New Jewellery</strong>
            <span style={{ fontSize: "0.74rem", color: "#8C827A" }}>Weights, stones & multi-tones</span>
          </Link>

          <Link
            href="/admin/gifting"
            style={{ background: "#110E0C", border: "1px solid rgba(197, 168, 128, 0.2)", borderRadius: "8px", padding: "1rem", textDecoration: "none", color: "#EDE8E3", display: "block" }}
          >
            <i className="fa-solid fa-gift" style={{ color: "#C5A880", fontSize: "1.2rem", marginBottom: "0.5rem", display: "block" }}></i>
            <strong style={{ fontSize: "0.88rem", display: "block" }}>Gifting Studio</strong>
            <span style={{ fontSize: "0.74rem", color: "#8C827A" }}>24K Coins, Packaging & Cards</span>
          </Link>

          <Link
            href="/admin/banners"
            style={{ background: "#110E0C", border: "1px solid rgba(197, 168, 128, 0.2)", borderRadius: "8px", padding: "1rem", textDecoration: "none", color: "#EDE8E3", display: "block" }}
          >
            <i className="fa-solid fa-image" style={{ color: "#C5A880", fontSize: "1.2rem", marginBottom: "0.5rem", display: "block" }}></i>
            <strong style={{ fontSize: "0.88rem", display: "block" }}>Hero Slider Banners</strong>
            <span style={{ fontSize: "0.74rem", color: "#8C827A" }}>Update homepage promotions</span>
          </Link>

          <Link
            href="/admin/rates"
            style={{ background: "#110E0C", border: "1px solid rgba(197, 168, 128, 0.2)", borderRadius: "8px", padding: "1rem", textDecoration: "none", color: "#EDE8E3", display: "block" }}
          >
            <i className="fa-solid fa-sliders" style={{ color: "#C5A880", fontSize: "1.2rem", marginBottom: "0.5rem", display: "block" }}></i>
            <strong style={{ fontSize: "0.88rem", display: "block" }}>Bullion & Making Policy</strong>
            <span style={{ fontSize: "0.74rem", color: "#8C827A" }}>Override rates & karigar %</span>
          </Link>
        </div>
      </div>

      {/* Recent Catalogue Items Table */}
      <div className="admin-card">
        <div className="admin-table-toolbar">
          <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", margin: 0, fontFamily: "var(--font-serif)" }}>
            Active Inventory Showcase ({totalProducts})
          </h3>
          <Link href="/admin/products" style={{ color: "#C5A880", fontSize: "0.82rem", textDecoration: "none", fontWeight: 600 }}>
            View Full Inventory Table <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Design / Title</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Net Gold Wt</th>
                <th>Karat</th>
                <th>Live Price</th>
                <th>HUID Assay</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS_CATALOG.slice(0, 6).map(p => {
                const bd = PricingEngine.calculateBreakdown(p, p.defaultKarat, bullionRates);
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images.yellow} alt={p.title} className="admin-prod-thumb" />
                        <div>
                          <strong style={{ display: "block", color: "#FFFFFF" }}>{p.title}</strong>
                          <span style={{ fontSize: "0.72rem", color: "#8C827A" }}>{p.collection}</span>
                        </div>
                      </div>
                    </td>
                    <td><code>{p.id}</code></td>
                    <td><span className="admin-badge admin-badge-gold">{p.category.toUpperCase()}</span></td>
                    <td>{p.netGoldWeightGrams} g</td>
                    <td><span className="admin-badge admin-badge-green">{p.defaultKarat}</span></td>
                    <td><strong style={{ color: "#C5A880" }}>{PricingEngine.formatINR(bd.finalPrice)}</strong></td>
                    <td><code style={{ fontSize: "0.74rem" }}>{p.huid}</code></td>
                    <td>
                      <div className="admin-action-btns">
                        <Link href={`/product/${p.id}`} className="admin-icon-btn" title="View PDP Storefront" target="_blank">
                          <i className="fa-solid fa-eye"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
