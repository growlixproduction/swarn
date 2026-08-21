"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { KaratType } from "@/lib/types";
import { PricingEngine } from "@/lib/pricingEngine";

export default function CalculatorPage() {
  const { bullionRates } = useApp();

  // Calculator State
  const [weightGrams, setWeightGrams] = useState<number>(10);
  const [karat, setKarat] = useState<KaratType>("22K");
  const [includeGst, setIncludeGst] = useState<boolean>(true);
  const [customGstPercent, setCustomGstPercent] = useState<number>(3);
  const [makingChargePercent, setMakingChargePercent] = useState<number>(10);

  // Active Rate Per Gram
  const ratePerGram =
    karat === "24K"
      ? bullionRates.gold24k
      : karat === "22K"
      ? bullionRates.gold22k
      : karat === "18K"
      ? bullionRates.gold18k
      : bullionRates.gold14k;

  const rawMetalCost = weightGrams * ratePerGram;
  const makingChargesAmount = Math.round(rawMetalCost * (makingChargePercent / 100));
  const subtotalBeforeGst = rawMetalCost + makingChargesAmount;
  const activeGstRate = includeGst ? customGstPercent / 100 : 0;
  const gstAmount = Math.round(subtotalBeforeGst * activeGstRate);
  const finalTotalCost = subtotalBeforeGst + gstAmount;

  // Tool 2: Old Gold Scrap Exchange Credit Calculator
  const [oldGoldWeight, setOldGoldWeight] = useState<number>(12.5);
  const [oldGoldKarat, setOldGoldKarat] = useState<KaratType>("22K");
  const [refiningFeePercent, setRefiningFeePercent] = useState<number>(2);

  const oldGoldResult = PricingEngine.calculateOldGoldValue(oldGoldWeight, oldGoldKarat, bullionRates);
  const grossScrapValue = oldGoldResult.grossValue;
  const customRefiningFee = Math.round(grossScrapValue * (refiningFeePercent / 100));
  const netExchangeCredit = Math.max(0, grossScrapValue - customRefiningFee);

  return (
    <div>
      {/* Header Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #1C1917 0%, #110E0C 100%)",
          padding: "3.5rem 1rem",
          color: "#FFFFFF",
          textAlign: "center",
          borderBottom: "1px solid var(--border-gold-subtle)"
        }}
      >
        <div className="container" style={{ maxWidth: "800px" }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(197, 168, 128, 0.2)",
              border: "1px solid var(--gold-primary)",
              padding: "0.25rem 0.75rem",
              borderRadius: "20px",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              color: "var(--gold-light)",
              marginBottom: "0.85rem"
            }}
          >
            TRANSPARENT BILLING ENGINE
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
            Gold Rate & Purity Calculator
          </h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", margin: 0 }}>
            Calculate exact jewellery & bullion costs with live market rates, customizable GST (3% / 0%), making charges, and old gold scrap exchange estimates.
          </p>
        </div>
      </section>

      {/* Main Calculators Section */}
      <div className="container" style={{ padding: "3rem 1rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem" }}>
          {/* Calculator 1: Gold Jewellery & Bullion Estimator */}
          <div className="tool-card" style={{ background: "#FFFFFF", borderRadius: "16px", padding: "1.75rem", border: "1px solid var(--border-light)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: "1.25rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.25rem", color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: "0.35rem" }}>
                <i className="fa-solid fa-calculator" style={{ color: "var(--gold-deep)", marginRight: "0.5rem" }}></i>
                Gold Jewellery & Bullion Estimator
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                Calculate exact pure metal cost, making charges, and GST breakdown.
              </p>
            </div>

            {/* GST Add / Remove Toggle Switcher */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, fontSize: "0.85rem" }}>
                GST Tax Mode:
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.6rem 0.8rem",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1.5px solid var(--gold-deep)",
                    background: includeGst ? "var(--gold-deep)" : "#FFFFFF",
                    color: includeGst ? "#FFFFFF" : "var(--text-primary)",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setIncludeGst(true)}
                >
                  <i className="fa-solid fa-check" style={{ marginRight: "0.35rem" }}></i>
                  Include 3% GST
                </button>

                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.6rem 0.8rem",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1.5px solid var(--gold-deep)",
                    background: !includeGst ? "var(--gold-deep)" : "#FFFFFF",
                    color: !includeGst ? "#FFFFFF" : "var(--text-primary)",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setIncludeGst(false)}
                >
                  <i className="fa-solid fa-ban" style={{ marginRight: "0.35rem" }}></i>
                  Remove GST (0%)
                </button>
              </div>
            </div>

            {/* Weight Input + Quick Weight Pills */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                Net Gold Weight (Grams):
              </label>
              <input
                type="number"
                value={weightGrams}
                min="0.1"
                step="0.1"
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "1rem", fontWeight: 700 }}
                onChange={e => setWeightGrams(Math.max(0, parseFloat(e.target.value) || 0))}
              />
              <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.45rem", flexWrap: "wrap" }}>
                {[1, 5, 8, 10, 20, 50, 100].map(w => (
                  <button
                    key={w}
                    type="button"
                    style={{ padding: "0.2rem 0.55rem", borderRadius: "4px", border: "1px solid var(--border-light)", background: "#FAF6F2", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}
                    onClick={() => setWeightGrams(w)}
                  >
                    {w}g
                  </button>
                ))}
              </div>
            </div>

            {/* Gold Karat Selector */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                Gold Purity Karat:
              </label>
              <select
                value={karat}
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.88rem" }}
                onChange={e => setKarat(e.target.value as KaratType)}
              >
                <option value="24K">24K Pure Bullion (99.9%) — ₹{bullionRates.gold24k.toLocaleString("en-IN")}/g</option>
                <option value="22K">22K BIS 916 Hallmark (91.6%) — ₹{bullionRates.gold22k.toLocaleString("en-IN")}/g</option>
                <option value="18K">18K Diamond Gold (75.0%) — ₹{bullionRates.gold18k.toLocaleString("en-IN")}/g</option>
                <option value="14K">14K Luxe Gold (58.3%) — ₹{bullionRates.gold14k.toLocaleString("en-IN")}/g</option>
              </select>
            </div>

            {/* Making Charge Percent */}
            <div className="tool-form-group" style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                <span>Making Charges (%):</span>
                <span style={{ color: "var(--gold-deep)" }}>{makingChargePercent}% (₹{makingChargesAmount.toLocaleString("en-IN")})</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={makingChargePercent}
                onChange={e => setMakingChargePercent(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--gold-deep)", cursor: "pointer" }}
              />
            </div>

            {/* Detailed Itemized Receipt Breakdown */}
            <div style={{ background: "var(--bg-tint-gold)", borderRadius: "12px", padding: "1.25rem", border: "1px solid var(--border-gold-subtle)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem", marginBottom: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Base Gold Metal ({weightGrams}g × ₹{ratePerGram.toLocaleString("en-IN")}/g):</span>
                  <strong>{PricingEngine.formatINR(rawMetalCost)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Making Charges ({makingChargePercent}%):</span>
                  <strong>{PricingEngine.formatINR(makingChargesAmount)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: includeGst ? "var(--gold-deep)" : "var(--text-muted)" }}>
                  <span>GST ({includeGst ? `${customGstPercent}%` : "0% Excluded"}):</span>
                  <strong>{PricingEngine.formatINR(gstAmount)}</strong>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--gold-primary)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "block" }}>ESTIMATED TOTAL VALUE</span>
                  <strong style={{ fontSize: "1.35rem", color: "var(--gold-deep)" }}>
                    {PricingEngine.formatINR(finalTotalCost)}
                  </strong>
                </div>
                <Link href="/#products-section" className="btn btn-gold btn-sm">
                  View Designs
                </Link>
              </div>
            </div>
          </div>

          {/* Calculator 2: Old Gold Exchange & Scrap Calculator */}
          <div className="tool-card" style={{ background: "#FFFFFF", borderRadius: "16px", padding: "1.75rem", border: "1px solid var(--border-light)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: "1.25rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.25rem", color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: "0.35rem" }}>
                <i className="fa-solid fa-coins" style={{ color: "var(--rose-gold)", marginRight: "0.5rem" }}></i>
                Old Gold Scrap Exchange Calculator
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                Calculate exchange credit for old ornaments at benchmark bullion rates.
              </p>
            </div>

            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                Old Scrap Gold Weight (Grams):
              </label>
              <input
                type="number"
                value={oldGoldWeight}
                min="0.1"
                step="0.1"
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "1rem", fontWeight: 700 }}
                onChange={e => setOldGoldWeight(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>

            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                Existing Ornament Purity:
              </label>
              <select
                value={oldGoldKarat}
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.88rem" }}
                onChange={e => setOldGoldKarat(e.target.value as KaratType)}
              >
                <option value="22K">22 Karat (916 BIS Hallmark)</option>
                <option value="18K">18 Karat (750 Purity)</option>
                <option value="14K">14 Karat (585 Purity)</option>
                <option value="24K">24 Karat (999 Pure Bar/Coin)</option>
              </select>
            </div>

            <div className="tool-form-group" style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                <span>Refining Allowance Fee (%):</span>
                <span style={{ color: "var(--rose-gold)" }}>{refiningFeePercent}% (₹{customRefiningFee.toLocaleString("en-IN")})</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={refiningFeePercent}
                onChange={e => setRefiningFeePercent(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--rose-gold)", cursor: "pointer" }}
              />
            </div>

            <div style={{ background: "var(--rose-gold-subtle)", borderRadius: "12px", padding: "1.25rem", border: "1px solid var(--rose-gold)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem", marginBottom: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Gross Scrap Bullion Value:</span>
                  <strong>{PricingEngine.formatINR(grossScrapValue)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--rose-gold)" }}>
                  <span>Refining Fee ({refiningFeePercent}%):</span>
                  <strong>- {PricingEngine.formatINR(customRefiningFee)}</strong>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--rose-gold)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "block" }}>NET EXCHANGE CREDIT VALUE</span>
                  <strong style={{ fontSize: "1.35rem", color: "var(--rose-gold)" }}>
                    {PricingEngine.formatINR(netExchangeCredit)}
                  </strong>
                </div>
                <a href="#header" className="btn btn-outline btn-sm">
                  Exchange Offer
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
