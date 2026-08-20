"use client";

import React from "react";
import { useApp } from "../context/AppContext";

const LiveRateSimulator: React.FC = () => {
  const { bullionRates, setBullionRate, isAdminOpen, setIsAdminOpen } = useApp();

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setBullionRate(val);
  };

  const handleSpike = () => {
    setBullionRate(bullionRates.gold24k + 150);
  };

  const handleDip = () => {
    setBullionRate(Math.max(6000, bullionRates.gold24k - 150));
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        id="admin-rate-float-btn"
        className="admin-float-btn"
        onClick={() => setIsAdminOpen(!isAdminOpen)}
        title="Open Live Rate Simulator"
      >
        <span className="pulse-dot" style={{ background: "#10B981" }}></span>
        <span>Live Rate Simulator</span>
      </button>

      {/* Admin Simulator Drawer */}
      <div className={`admin-drawer ${isAdminOpen ? "active" : ""}`} id="admin-drawer">
        <div className="admin-drawer-header">
          <div className="admin-title">
            <i className="fa-solid fa-chart-line" style={{ color: "var(--gold-deep)" }}></i>
            <span>Bullion Market Simulator</span>
          </div>
          <button
            type="button"
            className="admin-close-btn"
            onClick={() => setIsAdminOpen(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="admin-drawer-body">
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
            Simulate real-time bullion market movements. All products, karat tiers, and cart formulas will recalculate dynamically across the platform.
          </p>

          <div className="admin-control-group">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>24K Bullion Rate / Gram:</label>
              <strong style={{ color: "var(--gold-deep)" }}>₹{bullionRates.gold24k.toLocaleString("en-IN")}/g</strong>
            </div>
            <input
              type="range"
              min="6500"
              max="8500"
              step="10"
              value={bullionRates.gold24k}
              onChange={handleSlider}
              style={{ width: "100%", accentColor: "var(--gold-deep)", cursor: "pointer" }}
            />
          </div>

          {/* Quick Rate Shocks */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1.25rem" }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ color: "#059669", borderColor: "#A7F3D0", background: "#ECFDF5" }}
              onClick={handleSpike}
            >
              <i className="fa-solid fa-arrow-trend-up"></i> Spike (+₹150)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ color: "#DC2626", borderColor: "#FECACA", background: "#FEF2F2" }}
              onClick={handleDip}
            >
              <i className="fa-solid fa-arrow-trend-down"></i> Dip (-₹150)
            </button>
          </div>

          {/* Current Derived Benchmark Summary */}
          <div
            style={{
              marginTop: "1.5rem",
              background: "var(--bg-secondary)",
              padding: "1rem",
              borderRadius: "8px",
              fontSize: "0.78rem"
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Derived Karat Benchmarks:
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.2rem 0" }}>
              <span>22K (91.6% Hallmark):</span>
              <strong>₹{bullionRates.gold22k.toLocaleString("en-IN")}/g</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.2rem 0" }}>
              <span>18K (75.0% Diamond Gold):</span>
              <strong>₹{bullionRates.gold18k.toLocaleString("en-IN")}/g</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.2rem 0" }}>
              <span>14K (58.3% Luxe Gold):</span>
              <strong>₹{bullionRates.gold14k.toLocaleString("en-IN")}/g</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveRateSimulator;
