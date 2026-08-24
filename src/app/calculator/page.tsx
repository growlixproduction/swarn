"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { KaratType } from "@/lib/types";
import { PricingEngine } from "@/lib/pricingEngine";

export default function CalculatorPage() {
  const { bullionRates } = useApp();

  const [pageBanner, setPageBanner] = useState<any>({
    badge: "TRANSPARENT 100% CUSTOMIZABLE LIVE BILLING ENGINE",
    title: "Gold & Silver Rate Calculator",
    subtitle: "Enter custom rates (per 1g, 10g, or 1Kg), custom weights, custom purity percentages, custom making charges (₹/g or %), and custom GST to calculate exact itemized jewellery costs.",
    backgroundImage: "https://images.unsplash.com/photo-1611591475140-be3a7fcfb088?auto=format&fit=crop&w=1600&q=85",
    overlayGradient: "linear-gradient(135deg, rgba(28, 25, 23, 0.95) 0%, rgba(17, 14, 12, 0.88) 100%)"
  });

  useEffect(() => {
    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        if (data && data.pageBanners && data.pageBanners.calculator) {
          setPageBanner(data.pageBanners.calculator);
        }
      })
      .catch(err => console.warn("Failed to fetch live banner for Calculator:", err));
  }, []);

  // ==========================================
  // TOOL 1: GOLD JEWELLERY & BULLION ESTIMATOR
  // ==========================================
  const [weightGrams, setWeightGrams] = useState<number>(10);
  const [karatMode, setKaratMode] = useState<KaratType | "CUSTOM">("22K");
  const [customGoldPurityPercent, setCustomGoldPurityPercent] = useState<number>(91.6);
  
  // GST State
  const [gstMode, setGstMode] = useState<"3%" | "0%" | "CUSTOM">("3%");
  const [customGstVal, setCustomGstVal] = useState<number>(3);

  // Making Charge State (% vs ₹/g vs ₹ Flat Total)
  const [makingType, setMakingType] = useState<"PERCENT" | "PER_GRAM" | "FLAT">("PERCENT");
  const [makingVal, setMakingVal] = useState<number>(10);

  // Custom Gold Rate Override State (Unit: per 1g or per 10g)
  const [useCustomGoldRate, setUseCustomGoldRate] = useState<boolean>(false);
  const [goldRateUnit, setGoldRateUnit] = useState<"1g" | "10g">("1g");
  const [customGoldInput, setCustomGoldInput] = useState<number>(bullionRates.gold24k || 15920);

  // Active 24K Rate calculation
  const custom24kRatePerGram = goldRateUnit === "10g" ? customGoldInput / 10 : customGoldInput;
  const active24kRate = useCustomGoldRate ? custom24kRatePerGram : bullionRates.gold24k;
  
  // Rate Per Gram based on Purity
  const effectivePurityRatio =
    karatMode === "24K"
      ? 1.0
      : karatMode === "22K"
      ? 0.916
      : karatMode === "18K"
      ? 0.75
      : karatMode === "14K"
      ? 0.583
      : customGoldPurityPercent / 100;

  const ratePerGram = Math.round(active24kRate * effectivePurityRatio);
  const rawMetalCost = weightGrams * ratePerGram;

  // Making Charges calculation
  const makingChargesAmount =
    makingType === "PERCENT"
      ? Math.round(rawMetalCost * (makingVal / 100))
      : makingType === "PER_GRAM"
      ? Math.round(makingVal * weightGrams)
      : Math.round(makingVal);

  const subtotalBeforeGst = rawMetalCost + makingChargesAmount;
  const activeGstRate = gstMode === "3%" ? 0.03 : gstMode === "0%" ? 0 : customGstVal / 100;
  const gstAmount = Math.round(subtotalBeforeGst * activeGstRate);
  const finalTotalCost = subtotalBeforeGst + gstAmount;

  // ===============================================
  // TOOL 2: LIVE SILVER JEWELLERY & BULLION ESTIMATOR
  // ===============================================
  const [silverWeightGrams, setSilverWeightGrams] = useState<number>(50);
  const [silverPurityMode, setSilverPurityMode] = useState<number | "CUSTOM">(0.925);
  const [customSilverPurityPercent, setCustomSilverPurityPercent] = useState<number>(92.5);
  
  // Silver GST & Making Charges
  const [silverGstMode, setSilverGstMode] = useState<"3%" | "0%" | "CUSTOM">("3%");
  const [customSilverGstVal, setCustomSilverGstVal] = useState<number>(3);

  const [silverMakingType, setSilverMakingType] = useState<"PERCENT" | "PER_GRAM" | "FLAT">("PERCENT");
  const [silverMakingVal, setSilverMakingVal] = useState<number>(12);

  // Custom Silver Rate Override State (Unit: per 1g, per 10g, or per 1kg)
  const [useCustomSilverRate, setUseCustomSilverRate] = useState<boolean>(false);
  const [silverRateUnit, setSilverRateUnit] = useState<"1g" | "10g" | "1kg">("1g");
  const [customSilverInput, setCustomSilverInput] = useState<number>(bullionRates.silver925 || 180);

  const customSilver925RatePerGram =
    silverRateUnit === "1kg"
      ? customSilverInput / 1000
      : silverRateUnit === "10g"
      ? customSilverInput / 10
      : customSilverInput;
  const activeSilver925Rate = useCustomSilverRate ? customSilver925RatePerGram : (bullionRates.silver925 || 180);
  
  const effectiveSilverPurityRatio =
    silverPurityMode === "CUSTOM"
      ? customSilverPurityPercent / 100
      : Number(silverPurityMode);

  const silverBaseRatePerGram = Math.round(activeSilver925Rate * (effectiveSilverPurityRatio / 0.925));
  const rawSilverCost = silverWeightGrams * silverBaseRatePerGram;
  
  const silverMakingAmount =
    silverMakingType === "PERCENT"
      ? Math.round(rawSilverCost * (silverMakingVal / 100))
      : silverMakingType === "PER_GRAM"
      ? Math.round(silverMakingVal * silverWeightGrams)
      : Math.round(silverMakingVal);

  const silverSubtotal = rawSilverCost + silverMakingAmount;
  const activeSilverGstRate = silverGstMode === "3%" ? 0.03 : silverGstMode === "0%" ? 0 : customSilverGstVal / 100;
  const silverGstAmount = Math.round(silverSubtotal * activeSilverGstRate);
  const finalSilverCost = silverSubtotal + silverGstAmount;

  // ============================================
  // TOOL 3: OLD GOLD SCRAP EXCHANGE CALCULATOR
  // ============================================
  const [oldGoldWeight, setOldGoldWeight] = useState<number>(12.5);
  const [oldGoldKaratMode, setOldGoldKaratMode] = useState<KaratType | "CUSTOM">("22K");
  const [customOldGoldPurityPercent, setCustomOldGoldPurityPercent] = useState<number>(91.6);
  const [refiningFeePercent, setRefiningFeePercent] = useState<number>(2);

  const effectiveOldGoldRatio =
    oldGoldKaratMode === "24K"
      ? 1.0
      : oldGoldKaratMode === "22K"
      ? 0.916
      : oldGoldKaratMode === "18K"
      ? 0.75
      : oldGoldKaratMode === "14K"
      ? 0.583
      : customOldGoldPurityPercent / 100;

  const grossScrapValue = Math.round(oldGoldWeight * active24kRate * effectiveOldGoldRatio);
  const customRefiningFee = Math.round(grossScrapValue * (refiningFeePercent / 100));
  const netExchangeCredit = Math.max(0, grossScrapValue - customRefiningFee);

  return (
    <div>
      {/* Header Banner (Editable from Admin Panel) */}
      <section
        style={{
          position: "relative",
          background: pageBanner.backgroundImage
            ? `url('${pageBanner.backgroundImage}') center/cover no-repeat`
            : "linear-gradient(135deg, #1C1917 0%, #110E0C 100%)",
          padding: "3.5rem 1rem",
          color: "#FFFFFF",
          textAlign: "center",
          borderBottom: "1px solid var(--border-gold-subtle)"
        }}
      >
        {pageBanner.backgroundImage && (
          <div style={{ position: "absolute", inset: 0, background: pageBanner.overlayGradient || "linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.72) 100%)" }} />
        )}
        <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "850px" }}>
          {pageBanner.badge && (
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
                marginBottom: "0.85rem",
                fontWeight: 700
              }}
            >
              {pageBanner.badge}
            </span>
          )}
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
            {pageBanner.title}
          </h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", margin: 0 }}>
            {pageBanner.subtitle}
          </p>
        </div>
      </section>

      {/* Main Calculators Section */}
      <div className="container" style={{ padding: "3rem 1rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "2rem" }}>
          
          {/* TOOL 1: GOLD ESTIMATOR */}
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

            {/* Gold Rate Benchmark Selector (Live vs Custom Rate) */}
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
                  onClick={() => {
                    setUseCustomGoldRate(true);
                    if (goldRateUnit === "10g" && customGoldInput < 20000) {
                      setCustomGoldInput(bullionRates.gold24k * 10);
                    }
                  }}
                >
                  <i className="fa-solid fa-pen-to-square" style={{ marginRight: "0.35rem" }}></i>
                  Custom Gold Rate
                </button>
              </div>

              {/* Custom Gold Rate Input Box + Weight Basis Selector */}
              {useCustomGoldRate && (
                <div style={{ padding: "0.85rem", borderRadius: "10px", background: "#FAF6F2", border: "1px solid var(--border-gold)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gold-deep)" }}>
                      Custom Rate Unit:
                    </label>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button
                        type="button"
                        style={{
                          padding: "0.25rem 0.65rem",
                          borderRadius: "4px",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "1px solid var(--gold-deep)",
                          background: goldRateUnit === "1g" ? "var(--gold-deep)" : "#FFFFFF",
                          color: goldRateUnit === "1g" ? "#FFFFFF" : "var(--gold-deep)"
                        }}
                        onClick={() => {
                          if (goldRateUnit === "10g") setCustomGoldInput(Math.round(customGoldInput / 10));
                          setGoldRateUnit("1g");
                        }}
                      >
                        ₹ / 1 Gram
                      </button>

                      <button
                        type="button"
                        style={{
                          padding: "0.25rem 0.65rem",
                          borderRadius: "4px",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "1px solid var(--gold-deep)",
                          background: goldRateUnit === "10g" ? "var(--gold-deep)" : "#FFFFFF",
                          color: goldRateUnit === "10g" ? "#FFFFFF" : "var(--gold-deep)"
                        }}
                        onClick={() => {
                          if (goldRateUnit === "1g") setCustomGoldInput(Math.round(customGoldInput * 10));
                          setGoldRateUnit("10g");
                        }}
                      >
                        ₹ / 10 Grams
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="number"
                      value={customGoldInput}
                      step={goldRateUnit === "10g" ? "500" : "50"}
                      style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "1px solid var(--border-gold)", fontSize: "0.95rem", fontWeight: 700 }}
                      onChange={e => setCustomGoldInput(Math.max(1, parseFloat(e.target.value) || 0))}
                    />
                    <button
                      type="button"
                      style={{ padding: "0.55rem 0.75rem", borderRadius: "6px", background: "#FFFFFF", border: "1px solid var(--border-gold)", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer", color: "var(--gold-deep)" }}
                      onClick={() => {
                        setCustomGoldInput(goldRateUnit === "10g" ? bullionRates.gold24k * 10 : bullionRates.gold24k);
                      }}
                    >
                      Reset Live
                    </button>
                  </div>

                  <div style={{ marginTop: "0.4rem", padding: "0.35rem 0.5rem", borderRadius: "6px", background: "#FFFFFF", border: "1px dashed var(--border-gold)", fontSize: "0.74rem", color: "var(--gold-deep)", fontWeight: 600 }}>
                    Per-Gram 24K Rate: <strong>₹{custom24kRatePerGram.toLocaleString("en-IN")}/g</strong> • 10g = ₹{(custom24kRatePerGram * 10).toLocaleString("en-IN")}
                  </div>
                </div>
              )}
            </div>

            {/* Net Gold Weight (Custom Editable Input) */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.85rem" }}>
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

            {/* Gold Purity Karat (Standard vs Custom Purity %) */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.85rem" }}>
                Gold Purity Standard:
              </label>
              <select
                value={karatMode}
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.88rem", fontWeight: 600 }}
                onChange={e => setKaratMode(e.target.value as KaratType | "CUSTOM")}
              >
                <option value="24K">24K Pure Bullion (99.9%) — ₹{active24kRate.toLocaleString("en-IN")}/g</option>
                <option value="22K">22K BIS 916 Hallmark (91.6%) — ₹{Math.round(active24kRate * 0.916).toLocaleString("en-IN")}/g</option>
                <option value="18K">18K Diamond Gold (75.0%) — ₹{Math.round(active24kRate * 0.75).toLocaleString("en-IN")}/g</option>
                <option value="14K">14K Luxe Gold (58.3%) — ₹{Math.round(active24kRate * 0.583).toLocaleString("en-IN")}/g</option>
                <option value="CUSTOM">✏️ Enter Custom Purity % (e.g. 21K, 90%)</option>
              </select>

              {karatMode === "CUSTOM" && (
                <div style={{ marginTop: "0.5rem", padding: "0.65rem", borderRadius: "8px", background: "#FAF6F2", border: "1px solid var(--border-gold)" }}>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "var(--gold-deep)", marginBottom: "0.25rem" }}>
                    Custom Purity Percentage (%):
                  </label>
                  <input
                    type="number"
                    value={customGoldPurityPercent}
                    min="1"
                    max="100"
                    step="0.1"
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border-gold)", fontSize: "0.9rem", fontWeight: 700 }}
                    onChange={e => setCustomGoldPurityPercent(Math.min(100, Math.max(1, parseFloat(e.target.value) || 0)))}
                  />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem", display: "block" }}>
                    Equivalent Rate = ₹{ratePerGram.toLocaleString("en-IN")}/g ({customGoldPurityPercent}% purity)
                  </span>
                </div>
              )}
            </div>

            {/* Making Charges (Custom % vs ₹/g vs ₹ Flat Total) */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontWeight: 700, fontSize: "0.85rem" }}>Making Charges:</label>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  <button
                    type="button"
                    style={{ padding: "0.2rem 0.55rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", border: "1px solid var(--gold-deep)", background: makingType === "PERCENT" ? "var(--gold-deep)" : "#FFFFFF", color: makingType === "PERCENT" ? "#FFFFFF" : "var(--gold-deep)" }}
                    onClick={() => setMakingType("PERCENT")}
                  >
                    % Percent
                  </button>
                  <button
                    type="button"
                    style={{ padding: "0.2rem 0.55rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", border: "1px solid var(--gold-deep)", background: makingType === "PER_GRAM" ? "var(--gold-deep)" : "#FFFFFF", color: makingType === "PER_GRAM" ? "#FFFFFF" : "var(--gold-deep)" }}
                    onClick={() => setMakingType("PER_GRAM")}
                  >
                    ₹ / Gram
                  </button>
                  <button
                    type="button"
                    style={{ padding: "0.2rem 0.55rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", border: "1px solid var(--gold-deep)", background: makingType === "FLAT" ? "var(--gold-deep)" : "#FFFFFF", color: makingType === "FLAT" ? "#FFFFFF" : "var(--gold-deep)" }}
                    onClick={() => setMakingType("FLAT")}
                  >
                    ₹ Total Flat
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="number"
                  value={makingVal}
                  min="0"
                  step="1"
                  style={{ flex: 1, padding: "0.55rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.95rem", fontWeight: 700 }}
                  onChange={e => setMakingVal(Math.max(0, parseFloat(e.target.value) || 0))}
                />
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--gold-deep)", minWidth: "110px", textAlign: "right" }}>
                  = ₹{makingChargesAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* GST Tax Mode (3%, 0%, Custom GST %) */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.85rem" }}>
                GST Tax Rate:
              </label>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  type="button"
                  style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: "1.5px solid var(--gold-deep)", background: gstMode === "3%" ? "var(--gold-deep)" : "#FFFFFF", color: gstMode === "3%" ? "#FFFFFF" : "var(--text-primary)" }}
                  onClick={() => setGstMode("3%")}
                >
                  3% Standard GST
                </button>
                <button
                  type="button"
                  style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: "1.5px solid var(--gold-deep)", background: gstMode === "0%" ? "var(--gold-deep)" : "#FFFFFF", color: gstMode === "0%" ? "#FFFFFF" : "var(--text-primary)" }}
                  onClick={() => setGstMode("0%")}
                >
                  0% Excluded
                </button>
                <button
                  type="button"
                  style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: "1.5px solid var(--gold-deep)", background: gstMode === "CUSTOM" ? "var(--gold-deep)" : "#FFFFFF", color: gstMode === "CUSTOM" ? "#FFFFFF" : "var(--text-primary)" }}
                  onClick={() => setGstMode("CUSTOM")}
                >
                  ✏️ Custom GST %
                </button>
              </div>

              {gstMode === "CUSTOM" && (
                <div style={{ marginTop: "0.5rem", padding: "0.5rem", borderRadius: "6px", background: "#FAF6F2", border: "1px solid var(--border-gold)" }}>
                  <input
                    type="number"
                    value={customGstVal}
                    min="0"
                    step="0.5"
                    placeholder="Enter Custom GST %"
                    style={{ width: "100%", padding: "0.45rem", borderRadius: "6px", border: "1px solid var(--border-gold)", fontSize: "0.9rem", fontWeight: 700 }}
                    onChange={e => setCustomGstVal(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
              )}
            </div>

            {/* Detailed Receipt Breakdown */}
            <div style={{ background: "var(--bg-tint-gold)", borderRadius: "12px", padding: "1.25rem", border: "1px solid var(--border-gold-subtle)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem", marginBottom: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Base Gold Metal ({weightGrams}g × ₹{ratePerGram.toLocaleString("en-IN")}/g):</span>
                  <strong>{PricingEngine.formatINR(rawMetalCost)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Making Charges ({makingType === "PERCENT" ? `${makingVal}%` : makingType === "PER_GRAM" ? `₹${makingVal}/g` : "Flat Total"}):</span>
                  <strong>{PricingEngine.formatINR(makingChargesAmount)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: activeGstRate > 0 ? "var(--gold-deep)" : "var(--text-muted)" }}>
                  <span>GST ({activeGstRate * 100}%):</span>
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

          {/* TOOL 2: SILVER ESTIMATOR */}
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

            {/* Silver Rate Benchmark Selector (Live vs Custom Rate) */}
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
                  onClick={() => {
                    setUseCustomSilverRate(true);
                    if (silverRateUnit === "1kg" && customSilverInput < 10000) {
                      setCustomSilverInput((bullionRates.silver925 || 180) * 1000);
                    }
                  }}
                >
                  <i className="fa-solid fa-pen-to-square" style={{ marginRight: "0.35rem" }}></i>
                  Custom Silver Rate
                </button>
              </div>

              {/* Custom Silver Rate Input Box + Weight Basis Selector */}
              {useCustomSilverRate && (
                <div style={{ padding: "0.85rem", borderRadius: "10px", background: "#F4F4F5", border: "1px solid #D4D4D8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#27272A" }}>
                      Custom Rate Unit:
                    </label>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button
                        type="button"
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "1px solid #3F3F46",
                          background: silverRateUnit === "1g" ? "#3F3F46" : "#FFFFFF",
                          color: silverRateUnit === "1g" ? "#FFFFFF" : "#3F3F46"
                        }}
                        onClick={() => {
                          if (silverRateUnit === "1kg") setCustomSilverInput(Math.round(customSilverInput / 1000));
                          if (silverRateUnit === "10g") setCustomSilverInput(Math.round(customSilverInput / 10));
                          setSilverRateUnit("1g");
                        }}
                      >
                        ₹ / 1g
                      </button>

                      <button
                        type="button"
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "1px solid #3F3F46",
                          background: silverRateUnit === "10g" ? "#3F3F46" : "#FFFFFF",
                          color: silverRateUnit === "10g" ? "#FFFFFF" : "#3F3F46"
                        }}
                        onClick={() => {
                          if (silverRateUnit === "1g") setCustomSilverInput(Math.round(customSilverInput * 10));
                          if (silverRateUnit === "1kg") setCustomSilverInput(Math.round(customSilverInput / 100));
                          setSilverRateUnit("10g");
                        }}
                      >
                        ₹ / 10g
                      </button>

                      <button
                        type="button"
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "1px solid #3F3F46",
                          background: silverRateUnit === "1kg" ? "#3F3F46" : "#FFFFFF",
                          color: silverRateUnit === "1kg" ? "#FFFFFF" : "#3F3F46"
                        }}
                        onClick={() => {
                          if (silverRateUnit === "1g") setCustomSilverInput(Math.round(customSilverInput * 1000));
                          if (silverRateUnit === "10g") setCustomSilverInput(Math.round(customSilverInput * 100));
                          setSilverRateUnit("1kg");
                        }}
                      >
                        ₹ / 1 Kg
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="number"
                      value={customSilverInput}
                      step={silverRateUnit === "1kg" ? "1000" : "5"}
                      style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "1px solid #A1A1AA", fontSize: "0.95rem", fontWeight: 700 }}
                      onChange={e => setCustomSilverInput(Math.max(1, parseFloat(e.target.value) || 0))}
                    />
                    <button
                      type="button"
                      style={{ padding: "0.55rem 0.75rem", borderRadius: "6px", background: "#FFFFFF", border: "1px solid #A1A1AA", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer", color: "#27272A" }}
                      onClick={() => {
                        const base = bullionRates.silver925 || 180;
                        setCustomSilverInput(silverRateUnit === "1kg" ? base * 1000 : silverRateUnit === "10g" ? base * 10 : base);
                      }}
                    >
                      Reset Live
                    </button>
                  </div>

                  <div style={{ marginTop: "0.4rem", padding: "0.35rem 0.5rem", borderRadius: "6px", background: "#FFFFFF", border: "1px dashed #A1A1AA", fontSize: "0.74rem", color: "#27272A", fontWeight: 600 }}>
                    Per-Gram 925 Rate: <strong>₹{customSilver925RatePerGram.toLocaleString("en-IN")}/g</strong> • 1 Kg = ₹{(customSilver925RatePerGram * 1000).toLocaleString("en-IN")}
                  </div>
                </div>
              )}
            </div>

            {/* Net Silver Weight (Custom Editable Input) */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.85rem" }}>
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

            {/* Silver Purity Standard (Standard vs Custom Purity %) */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.85rem" }}>
                Silver Purity Standard:
              </label>
              <select
                value={silverPurityMode}
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.88rem", fontWeight: 600 }}
                onChange={e => {
                  const val = e.target.value;
                  setSilverPurityMode(val === "CUSTOM" ? "CUSTOM" : parseFloat(val));
                }}
              >
                <option value={0.925}>925 Sterling Silver (92.5%) — ₹{silverBaseRatePerGram.toLocaleString("en-IN")}/g</option>
                <option value={0.999}>999 Pure Fine Silver (99.9%) — ₹{Math.round(activeSilver925Rate * 1.08).toLocaleString("en-IN")}/g</option>
                <option value={0.800}>800 Standard Payal Silver (80.0%) — ₹{Math.round(activeSilver925Rate * 0.865).toLocaleString("en-IN")}/g</option>
                <option value="CUSTOM">✏️ Enter Custom Silver Purity %</option>
              </select>

              {silverPurityMode === "CUSTOM" && (
                <div style={{ marginTop: "0.5rem", padding: "0.65rem", borderRadius: "8px", background: "#F4F4F5", border: "1px solid #A1A1AA" }}>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#27272A", marginBottom: "0.25rem" }}>
                    Custom Silver Purity (%):
                  </label>
                  <input
                    type="number"
                    value={customSilverPurityPercent}
                    min="1"
                    max="100"
                    step="0.1"
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #A1A1AA", fontSize: "0.9rem", fontWeight: 700 }}
                    onChange={e => setCustomSilverPurityPercent(Math.min(100, Math.max(1, parseFloat(e.target.value) || 0)))}
                  />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem", display: "block" }}>
                    Rate = ₹{silverBaseRatePerGram.toLocaleString("en-IN")}/g ({customSilverPurityPercent}% purity)
                  </span>
                </div>
              )}
            </div>

            {/* Silver Making Charges (Custom % vs ₹/g vs ₹ Flat Total) */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontWeight: 700, fontSize: "0.85rem" }}>Making Charges:</label>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  <button
                    type="button"
                    style={{ padding: "0.2rem 0.55rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", border: "1px solid #3F3F46", background: silverMakingType === "PERCENT" ? "#3F3F46" : "#FFFFFF", color: silverMakingType === "PERCENT" ? "#FFFFFF" : "#3F3F46" }}
                    onClick={() => setSilverMakingType("PERCENT")}
                  >
                    % Percent
                  </button>
                  <button
                    type="button"
                    style={{ padding: "0.2rem 0.55rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", border: "1px solid #3F3F46", background: silverMakingType === "PER_GRAM" ? "#3F3F46" : "#FFFFFF", color: silverMakingType === "PER_GRAM" ? "#FFFFFF" : "#3F3F46" }}
                    onClick={() => setSilverMakingType("PER_GRAM")}
                  >
                    ₹ / Gram
                  </button>
                  <button
                    type="button"
                    style={{ padding: "0.2rem 0.55rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", border: "1px solid #3F3F46", background: silverMakingType === "FLAT" ? "#3F3F46" : "#FFFFFF", color: silverMakingType === "FLAT" ? "#FFFFFF" : "#3F3F46" }}
                    onClick={() => setSilverMakingType("FLAT")}
                  >
                    ₹ Total Flat
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="number"
                  value={silverMakingVal}
                  min="0"
                  step="1"
                  style={{ flex: 1, padding: "0.55rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.95rem", fontWeight: 700 }}
                  onChange={e => setSilverMakingVal(Math.max(0, parseFloat(e.target.value) || 0))}
                />
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#18181B", minWidth: "110px", textAlign: "right" }}>
                  = ₹{silverMakingAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Silver GST Tax Mode (3%, 0%, Custom GST %) */}
            <div className="tool-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.85rem" }}>
                GST Tax Rate:
              </label>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  type="button"
                  style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: "1.5px solid #71717A", background: silverGstMode === "3%" ? "#3F3F46" : "#FFFFFF", color: silverGstMode === "3%" ? "#FFFFFF" : "var(--text-primary)" }}
                  onClick={() => setSilverGstMode("3%")}
                >
                  3% Standard GST
                </button>
                <button
                  type="button"
                  style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: "1.5px solid #71717A", background: silverGstMode === "0%" ? "#3F3F46" : "#FFFFFF", color: silverGstMode === "0%" ? "#FFFFFF" : "var(--text-primary)" }}
                  onClick={() => setSilverGstMode("0%")}
                >
                  0% Excluded
                </button>
                <button
                  type="button"
                  style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: "1.5px solid #71717A", background: silverGstMode === "CUSTOM" ? "#3F3F46" : "#FFFFFF", color: silverGstMode === "CUSTOM" ? "#FFFFFF" : "var(--text-primary)" }}
                  onClick={() => setSilverGstMode("CUSTOM")}
                >
                  ✏️ Custom GST %
                </button>
              </div>

              {silverGstMode === "CUSTOM" && (
                <div style={{ marginTop: "0.5rem", padding: "0.5rem", borderRadius: "6px", background: "#F4F4F5", border: "1px solid #A1A1AA" }}>
                  <input
                    type="number"
                    value={customSilverGstVal}
                    min="0"
                    step="0.5"
                    placeholder="Enter Custom GST %"
                    style={{ width: "100%", padding: "0.45rem", borderRadius: "6px", border: "1px solid #A1A1AA", fontSize: "0.9rem", fontWeight: 700 }}
                    onChange={e => setCustomSilverGstVal(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
              )}
            </div>

            {/* Silver Receipt Breakdown */}
            <div style={{ background: "#F4F4F5", borderRadius: "12px", padding: "1.25rem", border: "1px solid #E4E4E7" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem", marginBottom: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Base Silver Metal ({silverWeightGrams}g × ₹{silverBaseRatePerGram.toLocaleString("en-IN")}/g):</span>
                  <strong>{PricingEngine.formatINR(rawSilverCost)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Making Charges ({silverMakingType === "PERCENT" ? `${silverMakingVal}%` : silverMakingType === "PER_GRAM" ? `₹${silverMakingVal}/g` : "Flat Total"}):</span>
                  <strong>{PricingEngine.formatINR(silverMakingAmount)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: activeSilverGstRate > 0 ? "#27272A" : "var(--text-muted)" }}>
                  <span>GST ({activeSilverGstRate * 100}%):</span>
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

          {/* TOOL 3: OLD GOLD SCRAP EXCHANGE CALCULATOR */}
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
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.85rem" }}>
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
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.85rem" }}>
                Existing Ornament Purity:
              </label>
              <select
                value={oldGoldKaratMode}
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.88rem", fontWeight: 600 }}
                onChange={e => setOldGoldKaratMode(e.target.value as KaratType | "CUSTOM")}
              >
                <option value="22K">22 Karat (916 BIS Hallmark)</option>
                <option value="18K">18 Karat (750 Purity)</option>
                <option value="14K">14 Karat (585 Purity)</option>
                <option value="24K">24 Karat (999 Pure Bar/Coin)</option>
                <option value="CUSTOM">✏️ Custom Scrap Purity %</option>
              </select>

              {oldGoldKaratMode === "CUSTOM" && (
                <div style={{ marginTop: "0.5rem", padding: "0.5rem", borderRadius: "6px", background: "var(--rose-gold-subtle)", border: "1px solid var(--rose-gold)" }}>
                  <input
                    type="number"
                    value={customOldGoldPurityPercent}
                    min="1"
                    max="100"
                    step="0.1"
                    placeholder="Enter Custom Scrap Purity %"
                    style={{ width: "100%", padding: "0.45rem", borderRadius: "6px", border: "1px solid var(--rose-gold)", fontSize: "0.9rem", fontWeight: 700 }}
                    onChange={e => setCustomOldGoldPurityPercent(Math.min(100, Math.max(1, parseFloat(e.target.value) || 0)))}
                  />
                </div>
              )}
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
