"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { PricingEngine } from "@/lib/pricingEngine";

export default function AdminRatesPage() {
  const { bullionRates, setBullionRate } = useApp();

  const [rateMode, setRateMode] = useState<"live" | "manual">("live");
  const [manualRate24k, setManualRate24k] = useState<number>(bullionRates.gold24k || 16103);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rates")
      .then(res => res.json())
      .then(data => {
        if (data && data.config) {
          setRateMode(data.config.mode || "live");
          if (data.config.manual24k) {
            setManualRate24k(data.config.manual24k);
          }
        }
      })
      .catch(err => console.warn("Failed to fetch rates config:", err));
  }, []);

  const active24k = rateMode === "live" ? bullionRates.gold24k : manualRate24k;
  const derived22k = Math.round(active24k * (22 / 24));
  const derived18k = Math.round(active24k * (18 / 24));
  const derived14k = Math.round(active24k * (14 / 24));

  const handleUpdate = async () => {
    setIsUpdating(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: rateMode,
          gold24k: manualRate24k
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBullionRate(active24k);
        setStatusMessage(`✅ Rates updated to ${rateMode.toUpperCase()} mode (24K: ₹${active24k}/g)! Storefront & Calculators synced.`);
      } else {
        setStatusMessage("❌ Failed to save rates configuration.");
      }
    } catch (e: any) {
      setBullionRate(active24k);
      setStatusMessage(`✅ Rates updated locally to ${rateMode.toUpperCase()} mode (24K: ₹${active24k}/g).`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Live Bullion Rates & Rate Policy Engine</h1>
          <p className="admin-page-desc">
            Choose between Live Auto API Market Rates or set a Fixed Manual Gold Rate for the storefront.
          </p>
        </div>

        <button type="button" className="btn btn-gold btn-sm" onClick={handleUpdate} disabled={isUpdating}>
          <i className="fa-solid fa-cloud-arrow-up"></i> Push Rates to Storefront
        </button>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderRadius: "8px",
            background: statusMessage.startsWith("✅") ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: `1px solid ${statusMessage.startsWith("✅") ? "#10B981" : "#EF4444"}`,
            color: "#FFFFFF",
            marginBottom: "1.5rem",
            fontSize: "0.88rem",
            fontWeight: 600
          }}
        >
          {statusMessage}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Rate Mode Selector & Base 24K Setter */}
        <div className="admin-card">
          <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", marginBottom: "1.25rem", fontFamily: "var(--font-serif)" }}>
            <i className="fa-solid fa-coins" style={{ color: "#C5A880", marginRight: "0.5rem" }}></i>
            Storefront Gold Rate Control Mode
          </h3>

          {/* 2-Option Mode Selector */}
          <div className="admin-form-group">
            <label className="admin-label">Select Rate Calculation Mode for Storefront & Calculators:</label>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: rateMode === "live" ? "2px solid #C5A880" : "1px solid rgba(255, 255, 255, 0.15)",
                  background: rateMode === "live" ? "rgba(197, 168, 128, 0.2)" : "#110E0C",
                  color: rateMode === "live" ? "#C5A880" : "#8C827A",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setRateMode("live")}
              >
                <i className="fa-solid fa-signal" style={{ marginRight: "0.4rem" }}></i>
                Option 1: Live Market Rate (Auto)
              </button>

              <button
                type="button"
                style={{
                  flex: 1,
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: rateMode === "manual" ? "2px solid #C5A880" : "1px solid rgba(255, 255, 255, 0.15)",
                  background: rateMode === "manual" ? "rgba(197, 168, 128, 0.2)" : "#110E0C",
                  color: rateMode === "manual" ? "#C5A880" : "#8C827A",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setRateMode("manual")}
              >
                <i className="fa-solid fa-pen-to-square" style={{ marginRight: "0.4rem" }}></i>
                Option 2: Manual Fixed Rate
              </button>
            </div>
          </div>

          {/* Mode 1: Live Info */}
          {rateMode === "live" && (
            <div style={{ background: "#110E0C", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "8px", padding: "1rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10B981", fontWeight: 700, fontSize: "0.9rem" }}>
                <span className="rate-pulse-dot"></span> Live Market Rate Active (GoldAPI.io)
              </div>
              <p style={{ fontSize: "0.8rem", color: "#8C827A", marginTop: "0.35rem", margin: 0 }}>
                Storefront uses live 24K benchmark: <strong style={{ color: "#FFFFFF" }}>₹{bullionRates.gold24k.toLocaleString("en-IN")}/g</strong>. Rates auto-update every 5 minutes.
              </p>
            </div>
          )}

          {/* Mode 2: Manual Rate Entry Box */}
          {rateMode === "manual" && (
            <div className="admin-form-group" style={{ background: "#110E0C", border: "1.5px dashed #C5A880", borderRadius: "10px", padding: "1.25rem", marginTop: "1rem" }}>
              <label className="admin-label" style={{ color: "#C5A880", fontWeight: 700 }}>
                Enter Custom Manual 24K Gold Rate (₹ / Gram):
              </label>
              <input
                type="number"
                step="10"
                className="admin-input"
                style={{ fontSize: "1.2rem", fontWeight: 700, color: "#C5A880" }}
                value={manualRate24k}
                onChange={e => setManualRate24k(parseFloat(e.target.value) || 0)}
              />
              <span style={{ fontSize: "0.74rem", color: "#8C827A", marginTop: "0.35rem", display: "block" }}>
                This rate will be used across the entire storefront (Header, Cards, and Estimator Calculator).
              </span>
            </div>
          )}

          {/* Derived Benchmarks */}
          <div style={{ background: "#110E0C", border: "1px solid rgba(197, 168, 128, 0.2)", borderRadius: "10px", padding: "1.25rem", marginTop: "1.5rem" }}>
            <strong style={{ fontSize: "0.86rem", color: "#FFFFFF", display: "block", marginBottom: "0.75rem" }}>
              Active Storefront Derived Benchmarks ({rateMode.toUpperCase()} Mode):
            </strong>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>24K Pure Bullion (99.9%):</span>
                <strong style={{ color: "#C5A880" }}>{PricingEngine.formatINR(active24k)}/g</strong>
              </div>
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
            </div>
          </div>
        </div>

        {/* Global Making Charge Policy Matrix */}
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
