"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PricingEngine } from "@/lib/pricingEngine";

export default function AdminRatesPage() {
  const { bullionRates, setBullionRate } = useApp();
  const [newRate24k, setNewRate24k] = useState(bullionRates.gold24k);

  const derived22k = Math.round(newRate24k * (22 / 24));
  const derived18k = Math.round(newRate24k * (18 / 24));
  const derived14k = Math.round(newRate24k * (14 / 24));

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gold24k: newRate24k })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBullionRate(newRate24k);
        alert(`✅ 24K Gold Rate updated to ₹${newRate24k}/g and saved in MySQL Database! Live Prices recalculated across the platform.`);
      } else {
        alert("Failed to save rates in database.");
      }
    } catch (e) {
      setBullionRate(newRate24k);
      alert(`24K Gold Rate updated locally to ₹${newRate24k}/g.`);
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Live Bullion Rates & Making Policy Engine</h1>
          <p className="admin-page-desc">
            Define daily benchmark bullion feeds and global making charge rulebooks for Ambikapur showroom.
          </p>
        </div>

        <button type="button" className="btn btn-gold btn-sm" onClick={handleUpdate}>
          <i className="fa-solid fa-cloud-arrow-up"></i> Push Live Rates to Storefront
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* 24K Base Rate Setter */}
        <div className="admin-card">
          <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
            <i className="fa-solid fa-coins" style={{ color: "#C5A880", marginRight: "0.5rem" }}></i>
            Base 24K Gold Rate (₹ / Gram)
          </h3>

          <div className="admin-form-group">
            <label className="admin-label">24K 999 Fine Bullion Rate (Ambikapur Market Rate)</label>
            <input
              type="number"
              step="10"
              className="admin-input"
              style={{ fontSize: "1.2rem", fontWeight: 700, color: "#C5A880" }}
              value={newRate24k}
              onChange={e => setNewRate24k(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div style={{ background: "#110E0C", border: "1px solid rgba(197, 168, 128, 0.2)", borderRadius: "10px", padding: "1.25rem", marginTop: "1.5rem" }}>
            <strong style={{ fontSize: "0.86rem", color: "#FFFFFF", display: "block", marginBottom: "0.75rem" }}>
              Live Derived Purity Benchmarks:
            </strong>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>22K BIS 916 Hallmark (91.67%):</span>
                <strong style={{ color: "#10B981" }}>{PricingEngine.formatINR(derived22k)}/g</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>18K Diamond Solitaire Gold (75.00%):</span>
                <strong style={{ color: "#10B981" }}>{PricingEngine.formatINR(derived18k)}/g</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>14K Modern Luxe Gold (58.33%):</span>
                <strong style={{ color: "#10B981" }}>{PricingEngine.formatINR(derived14k)}/g</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>925 Fine Silver:</span>
                <strong style={{ color: "#C5A880" }}>{PricingEngine.formatINR(bullionRates.silver925)}/g</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Global Making Charge Rulebook */}
        <div className="admin-card">
          <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
            <i className="fa-solid fa-scale-balanced" style={{ color: "#C5A880", marginRight: "0.5rem" }}></i>
            Showroom Making Charge Policy Matrix
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div style={{ background: "#110E0C", padding: "0.85rem", borderRadius: "8px", border: "1px solid rgba(197, 168, 128, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.85rem" }}>Plain Gold Bands & Chains</strong>
                <span style={{ fontSize: "0.72rem", color: "#8C827A" }}>Machine cut lightweight chains & plain rings</span>
              </div>
              <span className="admin-badge admin-badge-green">10% – 12%</span>
            </div>

            <div style={{ background: "#110E0C", padding: "0.85rem", borderRadius: "8px", border: "1px solid rgba(197, 168, 128, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.85rem" }}>Handcrafted Bridal Rani Haars</strong>
                <span style={{ fontSize: "0.72rem", color: "#8C827A" }}>Intricate nakshi, filigree & temple karigari</span>
              </div>
              <span className="admin-badge admin-badge-gold">14% – 18%</span>
            </div>

            <div style={{ background: "#110E0C", padding: "0.85rem", borderRadius: "8px", border: "1px solid rgba(197, 168, 128, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ display: "block", color: "#FFFFFF", fontSize: "0.85rem" }}>24K Pure Bullion Coins</strong>
                <span style={{ fontSize: "0.72rem", color: "#8C827A" }}>Laxmi Ganesh minted investment coins</span>
              </div>
              <span className="admin-badge admin-badge-green">3% – 5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
