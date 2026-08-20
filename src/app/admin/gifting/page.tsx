"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PricingEngine } from "@/lib/pricingEngine";

export default function AdminGiftingPage() {
  const { bullionRates } = useApp();

  const [coinRate24k] = useState(bullionRates.gold24k);
  const [coinMakingPct, setCoinMakingPct] = useState(3.5);

  const COIN_VARIANTS = [
    { weight: 1, motif: "Lord Ganesha & Lakshmi", purity: "24K (99.9%)", inStock: true },
    { weight: 2, motif: "Goddess Lakshmi Gold Coin", purity: "24K (99.9%)", inStock: true },
    { weight: 5, motif: "Sacred Om & Swastik", purity: "24K (99.9%)", inStock: true },
    { weight: 10, motif: "Swarn Mahal 10g Royal Bar", purity: "24K (99.9%)", inStock: true },
    { weight: 20, motif: "Heritage Lakshmi Gold Bar", purity: "24K (99.9%)", inStock: false },
    { weight: 50, motif: "50g Pure Gold Ingot", purity: "24K (99.9%)", inStock: true }
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gifting & Occasion Merchandising Studio</h1>
          <p className="admin-page-desc">
            Manage 24K pure gold coins, tamper-proof packaging, anniversary gifting sets, and greeting cards.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={() => alert("New Gift Set Creator Modal Activated.")}
        >
          <i className="fa-solid fa-gift"></i> Create Gifting Bundle
        </button>
      </div>

      {/* 24K Bullion Coins Pricing Engine */}
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", margin: 0, fontFamily: "var(--font-serif)" }}>
            <i className="fa-solid fa-coins" style={{ color: "#C5A880", marginRight: "0.5rem" }}></i>
            24K Investment Gold Coins Pricing Table
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#B5ACA4" }}>Coin Making Charge (%):</span>
            <input
              type="number"
              step="0.5"
              value={coinMakingPct}
              onChange={e => setCoinMakingPct(parseFloat(e.target.value) || 0)}
              style={{ width: "70px", background: "#110E0C", border: "1px solid rgba(197, 168, 128, 0.3)", padding: "0.3rem 0.5rem", borderRadius: "6px", color: "#FFFFFF", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Coin Weight</th>
                <th>Purity & Motif</th>
                <th>Metal Value (@ ₹{coinRate24k}/g)</th>
                <th>Making Fee ({coinMakingPct}%)</th>
                <th>GST (3%)</th>
                <th>Live Invoice Price</th>
                <th>Inventory Status</th>
              </tr>
            </thead>
            <tbody>
              {COIN_VARIANTS.map(c => {
                const metal = c.weight * coinRate24k;
                const making = metal * (coinMakingPct / 100);
                const sub = metal + making;
                const gst = sub * 0.03;
                const total = Math.round(sub + gst);

                return (
                  <tr key={c.weight}>
                    <td><strong>{c.weight} Grams</strong></td>
                    <td>{c.motif} ({c.purity})</td>
                    <td>{PricingEngine.formatINR(metal)}</td>
                    <td>{PricingEngine.formatINR(making)}</td>
                    <td>{PricingEngine.formatINR(gst)}</td>
                    <td><strong style={{ color: "#C5A880" }}>{PricingEngine.formatINR(total)}</strong></td>
                    <td>
                      <span className={`admin-badge ${c.inStock ? "admin-badge-green" : "admin-badge-gold"}`}>
                        {c.inStock ? "Ready to Dispatch" : "Made to Order"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gift Packaging & Personalized Message Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div className="admin-card">
          <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
            <i className="fa-solid fa-box-open" style={{ color: "#C5A880", marginRight: "0.5rem" }}></i>
            Luxury Packaging Tiers
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ background: "#110E0C", padding: "0.85rem", borderRadius: "8px", border: "1px solid rgba(197, 168, 128, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.86rem" }}>Royal Maroon Velvet Box</strong>
                <span style={{ fontSize: "0.74rem", color: "#8C827A" }}>Standard complimentary packaging with gold foil crest</span>
              </div>
              <span className="admin-badge admin-badge-green">Free / Included</span>
            </div>

            <div style={{ background: "#110E0C", padding: "0.85rem", borderRadius: "8px", border: "1px solid rgba(197, 168, 128, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.86rem" }}>Handcrafted Rosewood Chest</strong>
                <span style={{ fontSize: "0.74rem", color: "#8C827A" }}>Brass latches & silk velvet lining for bridal gifting</span>
              </div>
              <span className="admin-badge admin-badge-gold">+₹750</span>
            </div>

            <div style={{ background: "#110E0C", padding: "0.85rem", borderRadius: "8px", border: "1px solid rgba(197, 168, 128, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.86rem" }}>Tamper-Proof Blister Assay Card</strong>
                <span style={{ fontSize: "0.74rem", color: "#8C827A" }}>CertiCard security seal for 24K bullion coins</span>
              </div>
              <span className="admin-badge admin-badge-green">Included</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
            <i className="fa-solid fa-envelope-open-text" style={{ color: "#C5A880", marginRight: "0.5rem" }}></i>
            Greeting Card & Personalization Settings
          </h3>

          <div className="admin-form-group">
            <label className="admin-label">Complimentary Greeting Message Service</label>
            <select className="admin-select">
              <option>Enabled (Customer can add message at checkout)</option>
              <option>Disabled</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Default Festive Message Template</label>
            <textarea
              rows={3}
              className="admin-textarea"
              defaultValue="Wishing you boundless joy, prosperity, and golden memories on this auspicious occasion. Warm regards from Swarn Mahal Jewellers."
            />
          </div>

          <button
            type="button"
            className="btn btn-gold btn-sm"
            onClick={() => alert("Gifting configurations saved!")}
          >
            <i className="fa-solid fa-check"></i> Save Gifting Settings
          </button>
        </div>
      </div>
    </div>
  );
}
