"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { KaratType } from "../lib/types";
import { PricingEngine } from "../lib/pricingEngine";

const ToolsSection: React.FC = () => {
  const { bullionRates } = useApp();

  // Tool 1: Gold Rate Estimator (Live Market vs Manual Override)
  const [rateMode, setRateMode] = useState<"live" | "manual">("live");
  const [manual24kRate, setManual24kRate] = useState<number>(bullionRates.gold24k || 16103);
  const [calcWeight, setCalcWeight] = useState<number>(10);
  const [calcKarat, setCalcKarat] = useState<KaratType>("22K");

  // Effective 24K Base Rate depending on selected Mode
  const active24kRate = rateMode === "live" ? bullionRates.gold24k : manual24kRate;

  // Calculate Karat Rate per Gram
  const activeRatePerGram =
    calcKarat === "24K"
      ? active24kRate
      : calcKarat === "22K"
      ? Math.round(active24kRate * (22 / 24))
      : calcKarat === "18K"
      ? Math.round(active24kRate * (18 / 24))
      : Math.round(active24kRate * (14 / 24));

  const metalCost = calcWeight * activeRatePerGram;
  const gst = metalCost * 0.03;
  const estimatedTotal = Math.round(metalCost + gst);

  // Tool 2: Old Gold Exchange Calculator
  const [oldGoldRateMode, setOldGoldRateMode] = useState<"live" | "manual">("live");
  const [oldGoldManualRate, setOldGoldManualRate] = useState<number>(bullionRates.gold24k || 16103);
  const [oldGoldWeight, setOldGoldWeight] = useState<number>(12.5);
  const [oldGoldKarat, setOldGoldKarat] = useState<KaratType>("22K");

  const effectiveBullionRates = {
    ...bullionRates,
    gold24k: oldGoldRateMode === "live" ? bullionRates.gold24k : oldGoldManualRate,
    gold22k: oldGoldRateMode === "live" ? bullionRates.gold22k : Math.round(oldGoldManualRate * (22 / 24)),
    gold18k: oldGoldRateMode === "live" ? bullionRates.gold18k : Math.round(oldGoldManualRate * (18 / 24)),
    gold14k: oldGoldRateMode === "live" ? bullionRates.gold14k : Math.round(oldGoldManualRate * (14 / 24))
  };

  const oldGoldResult = PricingEngine.calculateOldGoldValue(oldGoldWeight, oldGoldKarat, effectiveBullionRates);

  return (
    <section className="tools-section" id="tools-section">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">TRANSPARENT TOOLS</span>
          <h2 className="section-title">Jewellery Purity & Rate Calculators</h2>
          <p className="section-subtitle">
            Calculate real-time pure gold bullion value or estimate exchange credit using live market rates or custom manual rates.
          </p>
        </div>

        <div className="tools-grid">
          {/* Tool 1: Live / Manual Gold Estimator */}
          <div className="tool-card reveal-left">
            <div className="tool-header">
              <h3>
                <i className="fa-solid fa-calculator" style={{ color: "var(--gold-deep)", marginRight: "0.5rem" }}></i>
                Gold Rate & Purity Estimator
              </h3>
              <p>Choose between live market benchmark rates or enter a custom manual rate per gram.</p>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="tool-form-group">
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.82rem" }}>
                Select Rate Calculation Mode:
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.5rem 0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1.5px solid var(--gold-primary)",
                    background: rateMode === "live" ? "var(--gold-deep)" : "#FFFFFF",
                    color: rateMode === "live" ? "#FFFFFF" : "var(--text-primary)",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setRateMode("live")}
                >
                  <i className="fa-solid fa-signal" style={{ marginRight: "0.35rem" }}></i>
                  Live Market Rate (₹{bullionRates.gold24k}/g)
                </button>

                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.5rem 0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1.5px solid var(--gold-primary)",
                    background: rateMode === "manual" ? "var(--gold-deep)" : "#FFFFFF",
                    color: rateMode === "manual" ? "#FFFFFF" : "var(--text-primary)",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setRateMode("manual")}
                >
                  <i className="fa-solid fa-pen-to-square" style={{ marginRight: "0.35rem" }}></i>
                  Manual Custom Rate
                </button>
              </div>
            </div>

            {/* Manual Rate Input Box (Shows when manual mode active) */}
            {rateMode === "manual" && (
              <div className="tool-form-group" style={{ background: "var(--bg-tint-gold)", padding: "0.85rem", borderRadius: "8px", border: "1px dashed var(--gold-primary)" }}>
                <label style={{ color: "var(--gold-deep)", fontWeight: 700 }}>Enter Custom 24K Gold Rate (₹ / Gram):</label>
                <input
                  type="number"
                  value={manual24kRate}
                  step="10"
                  min="1000"
                  style={{ borderColor: "var(--gold-primary)", fontWeight: 700, fontSize: "1rem" }}
                  onChange={e => setManual24kRate(Math.max(0, parseFloat(e.target.value) || 0))}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.25rem", display: "block" }}>
                  Derived {calcKarat} Rate: <strong>₹{activeRatePerGram.toLocaleString("en-IN")}/g</strong>
                </span>
              </div>
            )}

            <div className="tool-form-group">
              <label>Net Gold Weight (Grams)</label>
              <input
                type="number"
                value={calcWeight}
                min="0.1"
                step="0.1"
                onChange={e => setCalcWeight(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>

            <div className="tool-form-group">
              <label>Gold Purity Karat</label>
              <select
                value={calcKarat}
                onChange={e => setCalcKarat(e.target.value as KaratType)}
              >
                <option value="24K">24K Pure Bullion (99.9%) — ₹{active24kRate.toLocaleString("en-IN")}/g</option>
                <option value="22K">22K Hallmark Gold (91.6%) — ₹{Math.round(active24kRate * (22 / 24)).toLocaleString("en-IN")}/g</option>
                <option value="18K">18K Diamond Jewellery (75.0%) — ₹{Math.round(active24kRate * (18 / 24)).toLocaleString("en-IN")}/g</option>
                <option value="14K">14K Modern Gold (58.3%) — ₹{Math.round(active24kRate * (14 / 24)).toLocaleString("en-IN")}/g</option>
              </select>
            </div>

            <div className="tool-result-box">
              <div>
                <span className="result-label">Estimated Pure Gold Value (Incl. 3% GST)</span>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                  Formula: {calcWeight}g × ₹{activeRatePerGram.toLocaleString("en-IN")}/g (+ 3% GST)
                </div>
              </div>
              <div className="result-value">{PricingEngine.formatINR(estimatedTotal)}</div>
            </div>
          </div>

          {/* Tool 2: Old Gold Exchange Calculator */}
          <div className="tool-card reveal-right">
            <div className="tool-header">
              <h3>
                <i className="fa-solid fa-coins" style={{ color: "var(--rose-gold)", marginRight: "0.5rem" }}></i>
                Old Gold Exchange Calculator
              </h3>
              <p>Exchange your old scrap gold at highest benchmark rates with only 2% refining allowance.</p>
            </div>

            {/* Mode Switcher */}
            <div className="tool-form-group">
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.82rem" }}>
                Exchange Rate Calculation Mode:
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.5rem 0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1.5px solid var(--rose-gold)",
                    background: oldGoldRateMode === "live" ? "var(--rose-gold)" : "#FFFFFF",
                    color: oldGoldRateMode === "live" ? "#FFFFFF" : "var(--text-primary)",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setOldGoldRateMode("live")}
                >
                  <i className="fa-solid fa-signal" style={{ marginRight: "0.35rem" }}></i>
                  Live Market Rate
                </button>

                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.5rem 0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1.5px solid var(--rose-gold)",
                    background: oldGoldRateMode === "manual" ? "var(--rose-gold)" : "#FFFFFF",
                    color: oldGoldRateMode === "manual" ? "#FFFFFF" : "var(--text-primary)",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setOldGoldRateMode("manual")}
                >
                  <i className="fa-solid fa-pen-to-square" style={{ marginRight: "0.35rem" }}></i>
                  Manual Custom Rate
                </button>
              </div>
            </div>

            {oldGoldRateMode === "manual" && (
              <div className="tool-form-group" style={{ background: "var(--rose-gold-subtle)", padding: "0.85rem", borderRadius: "8px", border: "1px dashed var(--rose-gold)" }}>
                <label style={{ color: "var(--rose-gold-hover)", fontWeight: 700 }}>Enter Custom 24K Rate for Exchange (₹ / Gram):</label>
                <input
                  type="number"
                  value={oldGoldManualRate}
                  step="10"
                  min="1000"
                  style={{ borderColor: "var(--rose-gold)", fontWeight: 700, fontSize: "1rem" }}
                  onChange={e => setOldGoldManualRate(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </div>
            )}

            <div className="tool-form-group">
              <label>Old Gold Weight (Grams)</label>
              <input
                type="number"
                value={oldGoldWeight}
                min="0.1"
                step="0.1"
                onChange={e => setOldGoldWeight(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>

            <div className="tool-form-group">
              <label>Existing Ornament Purity</label>
              <select
                value={oldGoldKarat}
                onChange={e => setOldGoldKarat(e.target.value as KaratType)}
              >
                <option value="22K">22 Karat (916 Purity)</option>
                <option value="18K">18 Karat (750 Purity)</option>
                <option value="14K">14 Karat (585 Purity)</option>
                <option value="24K">24 Karat (999 Pure Bar/Coin)</option>
              </select>
            </div>

            <div className="tool-result-box">
              <div>
                <span className="result-label">Net Exchange Credit Value</span>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                  Gross Bullion: {PricingEngine.formatINR(oldGoldResult.grossValue)} (Refining fee -2%)
                </div>
              </div>
              <div className="result-value" style={{ color: "var(--rose-gold)" }}>
                {PricingEngine.formatINR(oldGoldResult.netExchangeCredit)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
