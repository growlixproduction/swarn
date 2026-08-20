"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { KaratType } from "../lib/types";
import { PricingEngine } from "../lib/pricingEngine";

const ToolsSection: React.FC = () => {
  const { bullionRates } = useApp();

  // Tool 1: Live Gold Rate Estimator
  const [calcWeight, setCalcWeight] = useState<number>(10);
  const [calcKarat, setCalcKarat] = useState<KaratType>("22K");
  const [calcMakingPct, setCalcMakingPct] = useState<number>(12);

  const ratePerGram =
    calcKarat === "24K"
      ? bullionRates.gold24k
      : calcKarat === "22K"
      ? bullionRates.gold22k
      : calcKarat === "18K"
      ? bullionRates.gold18k
      : bullionRates.gold14k;

  const metalCost = calcWeight * ratePerGram;
  const makingCost = metalCost * (calcMakingPct / 100);
  const subtotal = metalCost + makingCost;
  const gst = subtotal * 0.03;
  const estimatedTotal = Math.round(subtotal + gst);

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
            Calculate real-time jewellery making costs or estimate exchange credit for your old gold ornaments.
          </p>
        </div>

        <div className="tools-grid">
          {/* Tool 1: Live Custom Gold Estimator (Slides from Left) */}
          <div className="tool-card reveal-left">
            <div className="tool-header">
              <h3>
                <i className="fa-solid fa-calculator" style={{ color: "var(--gold-deep)", marginRight: "0.5rem" }}></i>
                Live Gold Rate Estimator
              </h3>
              <p>Calculate exact estimated purchase price based on today&apos;s live bullion market.</p>
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
              <div className="tool-input-row" style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label>Gold Purity Karat</label>
                  <select
                    value={calcKarat}
                    onChange={e => setCalcKarat(e.target.value as KaratType)}
                  >
                    <option value="24K">24K Pure Bullion (99.9%)</option>
                    <option value="22K">22K Hallmark Gold (91.6%)</option>
                    <option value="18K">18K Diamond Jewellery (75.0%)</option>
                    <option value="14K">14K Modern Gold (58.3%)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label>Making Charge (%)</label>
                  <select
                    value={calcMakingPct}
                    onChange={e => setCalcMakingPct(Number(e.target.value))}
                  >
                    <option value="10">10% (Plain Bands & Chains)</option>
                    <option value="12">12% (Standard Designs)</option>
                    <option value="16">16% (Intricate Bridal/Rani Haar)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="tool-result-box">
              <div>
                <span className="result-label">Estimated Total (Incl. 3% GST)</span>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>Formula: Metal + Making + GST</div>
              </div>
              <div className="result-value">{PricingEngine.formatINR(estimatedTotal)}</div>
            </div>
          </div>

          {/* Tool 2: Old Gold Exchange Calculator (Slides from Right) */}
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
