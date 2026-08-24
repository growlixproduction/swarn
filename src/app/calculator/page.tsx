"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { KaratType } from "@/lib/types";
import { PricingEngine } from "@/lib/pricingEngine";

export default function CalculatorPage() {
  const { bullionRates } = useApp();

  // Tool 1: Gold Jewellery & Bullion Estimator
  const [weightGrams, setWeightGrams] = useState<number>(10);
  const [karat, setKarat] = useState<KaratType>("22K");
  const [includeGst, setIncludeGst] = useState<boolean>(true);
  const [customGstPercent, setCustomGstPercent] = useState<number>(3);
  const [makingChargePercent, setMakingChargePercent] = useState<number>(10);
  
  // Custom Gold Rate Override State
  const [useCustomGoldRate, setUseCustomGoldRate] = useState<boolean>(false);
  const [custom24kRate, setCustom24kRate] = useState<number>(bullionRates.gold24k || 15920);

  // Active Gold Rate Calculation
  const active24kRate = useCustomGoldRate ? custom24kRate : bullionRates.gold24k;
  const ratePerGram =
    karat === "24K"
      ? active24kRate
      : karat === "22K"
      ? Math.round(active24kRate * 0.916)
      : karat === "18K"
      ? Math.round(active24kRate * 0.75)
      : Math.round(active24kRate * 0.583);

  const rawMetalCost = weightGrams * ratePerGram;
  const makingChargesAmount = Math.round(rawMetalCost * (makingChargePercent / 100));
  const subtotalBeforeGst = rawMetalCost + makingChargesAmount;
  const activeGstRate = includeGst ? customGstPercent / 100 : 0;
  const gstAmount = Math.round(subtotalBeforeGst * activeGstRate);
  const finalTotalCost = subtotalBeforeGst + gstAmount;

  // Tool 2: Live 925 Silver Jewellery & Bullion Estimator
  const [silverWeightGrams, setSilverWeightGrams] = useState<number>(50);
  const [silverPurity, setSilverPurity] = useState<number>(0.925);
  const [includeSilverGst, setIncludeSilverGst] = useState<boolean>(true);
  const [silverMakingPercent, setSilverMakingPercent] = useState<number>(12);

  // Custom Silver Rate Override State
  const [useCustomSilverRate, setUseCustomSilverRate] = useState<boolean>(false);
  const [customSilver925Rate, setCustomSilver925Rate] = useState<number>(bullionRates.silver925 || 180);

  const activeSilver925Rate = useCustomSilverRate ? customSilver925Rate : (bullionRates.silver925 || 180);
  const silverBaseRatePerGram = Math.round(activeSilver925Rate * (silverPurity / 0.925));
  const rawSilverCost = silverWeightGrams * silverBaseRatePerGram;
  const silverMakingAmount = Math.round(rawSilverCost * (silverMakingPercent / 100));
  const silverSubtotal = rawSilverCost + silverMakingAmount;
  const silverGstAmount = includeSilverGst ? Math.round(silverSubtotal * 0.03) : 0;
  const finalSilverCost = silverSubtotal + silverGstAmount;

  // Tool 3: Old Gold Scrap Exchange Credit Calculator
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
            TRANSPARENT LIVE BILLING & CUSTOM RATE CALCULATOR
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
            Gold & Silver Rate Calculator
          </h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", margin: 0 }}>
            Use live market rates or enter your own custom Gold & Silver rates to calculate exact itemized jewellery costs, making charges, GST, and old gold exchange value.
          </p>
        </div>
      </section>

      {/* Main Calculators Section */}
      <div className="container" style={{ padding: "3rem 1rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "2rem" }}>
          
          {/* Tool 1: Gold Jewellery & Bullion Estimator */}
          <div className="tool-card" style={{ background: "#FFFFFF", borderRadius: "16px", padding: "1.75rem", border: "1px solid var(--border-light)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: "1.25rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <i className="fa-solid fa-calculator" style={{ color: "var(--gold-deep)" }}></i>
                Gold Jewellery & Bullion Estimator
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                Calculate exact pure gold metal cost, making charges, and GST breakdown.
              </p>
            </div>

            {/* Gold Rate Source Selector (Live vs Custom Rate) */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.85rem" }}>
                Gold Rate Benchmark:
              </label>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1.5px solid var(--gold-deep)",
                    background: !useCustomGoldRate ? "var(--gold-deep)" : "#FFFFFF",
                    color: !useCustomGoldRate ? "#FFFFFF" : "var(--text-primary)"
                  }}
                  onClick={() => setUseCustomGoldRate(false)}
                >
                  <i className="fa-solid fa-bolt" style={{ marginRight: "0.35rem" }}></i>
                  Live Market (₹{bullionRates.gold24k.toLocaleString("en-IN")}/g)
                </button>

                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1.5px solid var(--gold-deep)",
                    background: useCustomGoldRate ? "var(--gold-deep)" : "#FFFFFF",
                    color: useCustomGoldRate ? "#FFFFFF" : "var(--text-primary)"
                  }}
                  onClick={() => setUseCustomGoldRate(true)}
                >
                  <i className="fa-solid fa-pen-to-square" style={{ marginRight: "0.35rem" }}></i>
                  Custom Gold Rate
                </button>
              </div>

              {/* Custom Gold Rate Input Box */}
              {useCustomGoldRate && (
                <div style={{ padding: "0.75rem", borderRadius: "10px", background: "#FAF6F2", border: "1px solid var(--border-gold)" }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--gold-deep)", marginBottom: "0.3rem" }}>
                    Enter Custom 24K Gold Rate (₹ per gram):
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="number"
                      value={custom24kRate}
                      step="50"
                      style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border-gold)", fontSize: "0.95rem", fontWeight: 700 }}
                      onChange={e => setCustom24kRate(Math.max(1, parseFloat(e.target.value) || 0))}
                    />
                    <button
                      type="button"
                      style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", background: "#FFFFFF", border: "1px solid var(--border-gold)", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer", color: "var(--gold-deep)" }}
                      onClick={() => setCustom24kRate(bullionRates.gold24k)}
                    >
                      Reset Live
                    </button>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                    Equivalents: 22K (916) = ₹{Math.round(custom24kRate * 0.916).toLocaleString("en-IN")}/g • 18K = ₹{Math.round(custom24kRate * 0.75).toLocaleString("en-IN")}/g
                  </span>
                </div>
              )}
            </div>

            {/* GST Tax Mode */}
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
                <option value="24K">24K Pure Bullion (99.9%) — ₹{active24kRate.toLocaleString("en-IN")}/g</option>
                <option value="22K">22K BIS 916 Hallmark (91.6%) — ₹{Math.round(active24kRate * 0.916).toLocaleString("en-IN")}/g</option>
                <option value="18K">18K Diamond Gold (75.0%) — ₹{Math.round(active24kRate * 0.75).toLocaleString("en-IN")}/g</option>
                <option value="14K">14K Luxe Gold (58.3%) — ₹{Math.round(active24kRate * 0.583).toLocaleString("en-IN")}/g</option>
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
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "block" }}>ESTIMATED GOLD TOTAL</span>
                  <strong style={{ fontSize: "1.35rem", color: "var(--gold-deep)" }}>
                    {PricingEngine.formatINR(finalTotalCost)}
                  </strong>
                </div>
                <Link href="/collections/gold" className="btn btn-gold btn-sm">
                  View Gold Designs
                </Link>
              </div>
            </div>
          </div>

          {/* Tool 2: Live Silver Jewellery & Bullion Estimator */}
          <div className="tool-card" style={{ background: "#FFFFFF", borderRadius: "16px", padding: "1.75rem", border: "1px solid var(--border-light)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: "1.25rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <i className="fa-solid fa-ring" style={{ color: "#71717A" }}></i>
                Live Silver Jewellery & Bullion Estimator
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                Calculate exact 925 sterling & 999 silver metal cost, making charges, and GST.
              </p>
            </div>

            {/* Silver Rate Source Selector (Live vs Custom Rate) */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.85rem" }}>
                Silver Rate Benchmark:
              </label>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1.5px solid #71717A",
                    background: !useCustomSilverRate ? "#3F3F46" : "#FFFFFF",
                    color: !useCustomSilverRate ? "#FFFFFF" : "var(--text-primary)"
                  }}
                  onClick={() => setUseCustomSilverRate(false)}
                >
                  <i className="fa-solid fa-bolt" style={{ marginRight: "0.35rem" }}></i>
                  Live Market (₹{(bullionRates.silver925 || 180).toLocaleString("en-IN")}/g)
                </button>

                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1.5px solid #71717A",
                    background: useCustomSilverRate ? "#3F3F46" : "#FFFFFF",
                    color: useCustomSilverRate ? "#FFFFFF" : "var(--text-primary)"
                  }}
                  onClick={() => setUseCustomSilverRate(true)}
                >
                  <i className="fa-solid fa-pen-to-square" style={{ marginRight: "0.35rem" }}></i>
                  Custom Silver Rate
                </button>
              </div>

              {/* Custom Silver Rate Input Box */}
              {useCustomSilverRate && (
                <div style={{ padding: "0.75rem", borderRadius: "10px", background: "#F4F4F5", border: "1px solid #D4D4D8" }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#27272A", marginBottom: "0.3rem" }}>
                    Enter Custom 925 Silver Rate (₹ per gram):
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="number"
                      value={customSilver925Rate}
                      step="5"
                      style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #A1A1AA", fontSize: "0.95rem", fontWeight: 700 }}
                      onChange={e => setCustomSilver925Rate(Math.max(1, parseFloat(e.target.value) || 0))}
                    />
                    <button
                      type="button"
                      style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", background: "#FFFFFF", border: "1px solid #A1A1AA", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer", color: "#27272A" }}
                      onClick={() => setCustomSilver925Rate(bullionRates.silver925 || 180)}
                    >
                      Reset Live
                    </button>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                    Equivalent: 1 Kg Silver = ₹{(customSilver925Rate * 1000).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            {/* GST Tax Mode */}
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
                    border: "1.5px solid #71717A",
                    background: includeSilverGst ? "#3F3F46" : "#FFFFFF",
                    color: includeSilverGst ? "#FFFFFF" : "var(--text-primary)",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setIncludeSilverGst(true)}
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
                    border: "1.5px solid #71717A",
                    background: !includeSilverGst ? "#3F3F46" : "#FFFFFF",
                    color: !includeSilverGst ? "#FFFFFF" : "var(--text-primary)",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setIncludeSilverGst(false)}
                >
                  <i className="fa-solid fa-ban" style={{ marginRight: "0.35rem" }}></i>
                  Remove GST (0%)
                </button>
              </div>
            </div>

            {/* Silver Weight Input + Quick Pills */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                Net Silver Weight (Grams):
              </label>
              <input
                type="number"
                value={silverWeightGrams}
                min="1"
                step="1"
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "1rem", fontWeight: 700 }}
                onChange={e => setSilverWeightGrams(Math.max(0, parseFloat(e.target.value) || 0))}
              />
              <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.45rem", flexWrap: "wrap" }}>
                {[10, 25, 50, 100, 250, 500, 1000].map(w => (
                  <button
                    key={w}
                    type="button"
                    style={{ padding: "0.2rem 0.55rem", borderRadius: "4px", border: "1px solid var(--border-light)", background: "#F4F4F5", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}
                    onClick={() => setSilverWeightGrams(w)}
                  >
                    {w >= 1000 ? `${w / 1000}kg` : `${w}g`}
                  </button>
                ))}
              </div>
            </div>

            {/* Silver Purity Selector */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                Silver Purity Standard:
              </label>
              <select
                value={silverPurity}
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.88rem" }}
                onChange={e => setSilverPurity(parseFloat(e.target.value))}
              >
                <option value={0.925}>925 Sterling Silver (92.5%) — ₹{activeSilver925Rate.toLocaleString("en-IN")}/g</option>
                <option value={0.999}>999 Pure Fine Silver (99.9%) — ₹{Math.round(activeSilver925Rate * 1.08).toLocaleString("en-IN")}/g</option>
                <option value={0.800}>800 Standard Payal Silver (80.0%) — ₹{Math.round(activeSilver925Rate * 0.865).toLocaleString("en-IN")}/g</option>
              </select>
            </div>

            {/* Silver Making Charge Percent */}
            <div className="tool-form-group" style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                <span>Making Charges (%):</span>
                <span style={{ color: "#3F3F46" }}>{silverMakingPercent}% (₹{silverMakingAmount.toLocaleString("en-IN")})</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={silverMakingPercent}
                onChange={e => setSilverMakingPercent(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#3F3F46", cursor: "pointer" }}
              />
            </div>

            {/* Silver Receipt Breakdown */}
            <div style={{ background: "#F4F4F5", borderRadius: "12px", padding: "1.25rem", border: "1px solid #E4E4E7" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem", marginBottom: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Base Silver Metal ({silverWeightGrams}g × ₹{silverBaseRatePerGram.toLocaleString("en-IN")}/g):</span>
                  <strong>{PricingEngine.formatINR(rawSilverCost)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Making Charges ({silverMakingPercent}%):</span>
                  <strong>{PricingEngine.formatINR(silverMakingAmount)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: includeSilverGst ? "#27272A" : "var(--text-muted)" }}>
                  <span>GST ({includeSilverGst ? "3%" : "0% Excluded"}):</span>
                  <strong>{PricingEngine.formatINR(silverGstAmount)}</strong>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #A1A1AA", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "block" }}>ESTIMATED SILVER TOTAL</span>
                  <strong style={{ fontSize: "1.35rem", color: "#18181B" }}>
                    {PricingEngine.formatINR(finalSilverCost)}
                  </strong>
                </div>
                <Link href="/collections/silver" className="btn btn-outline btn-sm">
                  View Silver Designs
                </Link>
              </div>
            </div>
          </div>

          {/* Tool 3: Old Gold Exchange & Scrap Calculator */}
          <div className="tool-card" style={{ background: "#FFFFFF", borderRadius: "16px", padding: "1.75rem", border: "1px solid var(--border-light)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: "1.25rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", fontFamily: "var(--font-heading)", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <i className="fa-solid fa-coins" style={{ color: "var(--rose-gold)" }}></i>
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
