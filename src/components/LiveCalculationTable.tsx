"use client";

import React, { useState } from "react";
import { Product } from "../lib/types";
import { useApp } from "../context/AppContext";
import { PricingEngine } from "../lib/pricingEngine";

interface LiveCalculationTableProps {
  product: Product;
}

const LiveCalculationTable: React.FC<LiveCalculationTableProps> = ({ product }) => {
  const { bullionRates, productSelections, setProductMakingCharge } = useApp();

  // Dynamic Gold Weight Adjuster State (Defaults to Product Net Weight)
  const [adjustedWeight, setAdjustedWeight] = useState<number>(product.netGoldWeightGrams);

  const selection = productSelections[product.id] || {
    karat: product.defaultKarat,
    color: product.defaultColor,
    size: "14 (Indian)",
    engraving: "",
    makingCharge: { type: "percent", value: product.makingChargePercent || 15 }
  };

  const currentKarat = selection.karat || product.defaultKarat;
  const makingCharge = selection.makingCharge || { type: "percent", value: product.makingChargePercent || 15 };
  const makingType = makingCharge.type || "percent";
  const isPercent = makingType === "percent";
  const makingVal = Number(
    makingCharge.value !== undefined
      ? makingCharge.value
      : isPercent
      ? product.makingChargePercent || 15
      : product.makingChargePerGram || 650
  );

  // Create temporary modified product with adjusted weight for live breakdown
  const activeProduct: Product = {
    ...product,
    netGoldWeightGrams: adjustedWeight,
    grossWeightGrams: Number((adjustedWeight + (product.grossWeightGrams - product.netGoldWeightGrams)).toFixed(3))
  };

  const breakdown = PricingEngine.calculateBreakdown(activeProduct, currentKarat, bullionRates, null, {
    type: makingType,
    value: makingVal
  });

  const presets = isPercent ? [8, 10, 12, 15, 18, 22] : [450, 550, 650, 750, 900];

  const handleWeightStep = (delta: number) => {
    const newVal = Math.max(0.1, Number((adjustedWeight + delta * 0.5).toFixed(3)));
    setAdjustedWeight(newVal);
  };

  const handleStep = (delta: number) => {
    const step = isPercent ? 1 : 50;
    const newVal = Math.max(0, makingVal + delta * step);
    setProductMakingCharge(product.id, { value: newVal });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(0, Number(e.target.value) || 0);
    setProductMakingCharge(product.id, { value: val });
  };

  const handleTypeToggle = (type: "percent" | "per_gram") => {
    const defaultVal = type === "per_gram" ? product.makingChargePerGram || 650 : product.makingChargePercent || 15;
    setProductMakingCharge(product.id, { type, value: defaultVal });
  };

  return (
    <div className="pdp-live-breakdown-card" id="pdp-live-breakdown-box">
      {/* Header */}
      <div className="breakdown-card-header">
        <div className="breakdown-header-title">
          <i className="fa-solid fa-calculator"></i>
          <span>Live Price & Weight Formula</span>
        </div>
        <span className="live-pulse-badge">
          <span className="pulse-dot"></span> 100% Itemized
        </span>
      </div>

      <div className="breakdown-card-body" id="pdp-breakdown-card-body">
        {/* 100% Itemized Live Calculation Table */}
        <div className="pdp-calc-table-wrap" style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table className="pdp-calc-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ minWidth: "90px" }}>Itemized Component</th>
                <th style={{ minWidth: "110px" }}>Live Rate / Formula</th>
                <th style={{ minWidth: "75px", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Pure Gold Value */}
              <tr>
                <td>
                  <div className="calc-cell-component">
                    <i className="fa-solid fa-crown"></i>
                    <span>{breakdown.karat} Pure Gold</span>
                  </div>
                </td>
                <td>
                  <div className="calc-cell-formula">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--bg-tint-gold)", border: "1.5px solid var(--border-gold)", borderRadius: "6px", padding: "0.25rem 0.6rem", marginBottom: "0.2rem" }}>
                      <i className="fa-solid fa-scale-balanced" style={{ color: "var(--gold-deep)", fontSize: "0.95rem" }}></i>
                      <strong style={{ color: "var(--text-primary)", fontSize: "0.98rem", fontWeight: 800 }}>
                        {breakdown.netGoldWeight} Grams ({breakdown.karat} Hallmark)
                      </strong>
                    </div>
                    <span className="calc-formula-sub" style={{ display: "block" }}>
                      Formula: {breakdown.netGoldWeight}g × {PricingEngine.formatINR(breakdown.ratePerGram)}/g
                    </span>
                  </div>
                </td>
                <td>
                  <div className="calc-cell-amount" style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                    {PricingEngine.formatINR(breakdown.metalCost)}
                  </div>
                </td>
              </tr>

              {/* Row 2: Diamonds / Gemstones */}
              {breakdown.diamondSpecs && (
                <tr>
                  <td>
                    <div className="calc-cell-component">
                      <i className="fa-regular fa-gem"></i>
                      <span>Diamonds / Solitaire</span>
                    </div>
                  </td>
                  <td>
                    <div className="calc-cell-formula">
                      <span>
                        {breakdown.diamondSpecs.totalCaratWeight} ct • {breakdown.diamondSpecs.clarity} (
                        {breakdown.diamondSpecs.cut})
                      </span>
                      <span className="calc-formula-sub">
                        @ {PricingEngine.formatINR(breakdown.diamondSpecs.pricePerCarat)}/ct (
                        {breakdown.diamondSpecs.stoneCount || 1} Stones)
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="calc-cell-amount">{PricingEngine.formatINR(breakdown.diamondCost)}</div>
                  </td>
                </tr>
              )}

              {product.gemstoneSpecs && !breakdown.diamondSpecs && (
                <tr>
                  <td>
                    <div className="calc-cell-component">
                      <i className="fa-regular fa-gem"></i>
                      <span>{product.gemstoneSpecs.stoneType || "Natural Gemstone"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="calc-cell-formula">
                      <span>{product.gemstoneSpecs.weightCarat || 0} Carats Natural Precious Stone</span>
                      <span className="calc-formula-sub">Assayed & Certified</span>
                    </div>
                  </td>
                  <td>
                    <div className="calc-cell-amount">{PricingEngine.formatINR(breakdown.diamondCost || 0)}</div>
                  </td>
                </tr>
              )}

              {/* Row 3: Making Charges */}
              <tr>
                <td>
                  <div className="calc-cell-component">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Making Charges</span>
                  </div>
                </td>
                <td>
                  <div className="calc-cell-formula">
                    <span>
                      {isPercent
                        ? `${breakdown.makingPct}% of Gold Value`
                        : `${PricingEngine.formatINR(breakdown.makingPerGram)}/g on ${breakdown.grossWeight}g gross`}
                    </span>
                    {breakdown.hasDiscount && (
                      <span className="calc-discount-pill">
                        {breakdown.discountPct}% Festive OFF (-{PricingEngine.formatINR(breakdown.discountAmount)})
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="calc-cell-amount">
                    {breakdown.hasDiscount && (
                      <span className="calc-strike">{PricingEngine.formatINR(breakdown.baseMakingCharges)}</span>
                    )}
                    <span>{PricingEngine.formatINR(breakdown.effectiveMakingCharges)}</span>
                  </div>
                </td>
              </tr>

              {/* Row 4: Taxable Subtotal */}
              <tr className="calc-row-subtotal">
                <td>
                  <div className="calc-cell-component">
                    <i className="fa-solid fa-file-invoice"></i>
                    <span>Taxable Subtotal</span>
                  </div>
                </td>
                <td>
                  <div className="calc-cell-formula">
                    <span className="calc-formula-sub">Metal + Stones + Effective Making</span>
                  </div>
                </td>
                <td>
                  <div className="calc-cell-amount">{PricingEngine.formatINR(breakdown.taxableSubtotal)}</div>
                </td>
              </tr>

              {/* Row 5: 3% GST */}
              <tr>
                <td>
                  <div className="calc-cell-component">
                    <i className="fa-solid fa-scale-balanced"></i>
                    <span>GST (3% HSN 7113)</span>
                  </div>
                </td>
                <td>
                  <div className="calc-cell-formula">
                    <span>
                      1.5% CGST ({PricingEngine.formatINR(breakdown.cgstAmount)}) + 1.5% SGST (
                      {PricingEngine.formatINR(breakdown.sgstAmount)})
                    </span>
                  </div>
                </td>
                <td>
                  <div className="calc-cell-amount">{PricingEngine.formatINR(breakdown.gstAmount)}</div>
                </td>
              </tr>

              {/* Row 6: Grand Total */}
              <tr className="calc-row-total">
                <td>
                  <div className="calc-cell-component" style={{ fontWeight: 700 }}>
                    <i className="fa-solid fa-shield-halved" style={{ color: "var(--gold-deep)" }}></i>
                    <span>Grand Total</span>
                  </div>
                </td>
                <td>
                  <div className="calc-cell-formula">
                    <span className="huid-mini-tag">
                      <i className="fa-solid fa-certificate"></i> BIS HUID: {product.huid}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="calc-cell-amount calc-total-grand">{PricingEngine.formatINR(breakdown.finalPrice)}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="breakdown-formula-footer">
          <span>
            <i className="fa-solid fa-scale-balanced"></i> 24K Benchmark:{" "}
            <strong>{PricingEngine.formatINR(bullionRates.gold24k)}/g</strong>
          </span>
          <span>
            <i className="fa-solid fa-truck-shield"></i> 100% Transit Insured & Legal BIS Assayed
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveCalculationTable;
