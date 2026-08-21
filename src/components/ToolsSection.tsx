"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { KaratType } from "../lib/types";
import { PricingEngine } from "../lib/pricingEngine";

const ToolsSection: React.FC = () => {
  const { bullionRates } = useApp();

  // Tool 1: Live Gold Rate Estimator (Calculates using active Storefront rate)
  const [calcWeight, setCalcWeight] = useState<number>(10);
  const [calcKarat, setCalcKarat] = useState<KaratType>("22K");

  const ratePerGram =
    calcKarat === "24K"
      ? bullionRates.gold24k
      : calcKarat === "22K"
      ? bullionRates.gold22k
      : calcKarat === "18K"
      ? bullionRates.gold18k
      : bullionRates.gold14k;

  const metalCost = calcWeight * ratePerGram;
  const gst = metalCost * 0.03;
  const estimatedTotal = Math.round(metalCost + gst);

  // Tool 2: Old Gold Exchange Calculator
  const [oldGoldWeight, setOldGoldWeight] = useState<number>(12.5);
  const [oldGoldKarat, setOldGoldKarat] = useState<KaratType>("22K");
  const oldGoldResult = PricingEngine.calculateOldGoldValue(oldGoldWeight, oldGoldKarat, bullionRates);

  return (
    <section className="tools-section" id="tools-section">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">TRANSPARENT TOOLS</span>
          <h2 className="section-title">Jewellery Purity & Rate Calculators</h2>
          <p className="section-subtitle">
            Calculate real-time pure gold bullion value or estimate exchange credit for your old gold ornaments.
          </p>
        </div>

        <div className="tools-grid">
          {/* Tool 1: Live Gold Rate Estimator */}
          <div className="tool-card reveal-left">
            <div className="tool-header">
              <h3>
                <i className="fa-solid fa-calculator" style={{ color: "var(--gold-deep)", marginRight: "0.5rem" }}></i>
                Live Gold Rate Estimator
              </h3>
              <p>Calculate exact pure gold value based on today&apos;s active bullion benchmark rate.</p>
            </div>

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
                <option value="24K">24K Pure Bullion (99.9%) — ₹{bullionRates.gold24k.toLocaleString("en-IN")}/g</option>
                <option value="22K">22K Hallmark Gold (91.6%) — ₹{bullionRates.gold22k.toLocaleString("en-IN")}/g</option>
                <option value="18K">18K Diamond Jewellery (75.0%) — ₹{bullionRates.gold18k.toLocaleString("en-IN")}/g</option>
                <option value="14K">14K Modern Gold (58.3%) — ₹{bullionRates.gold14k.toLocaleString("en-IN")}/g</option>
              </select>
            </div>

            <div className="tool-result-box">
              <div>
                <span className="result-label">Estimated Pure Gold Value (Incl. 3% GST)</span>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                  Formula: {calcWeight}g × ₹{ratePerGram.toLocaleString("en-IN")}/g (+ 3% GST)
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
