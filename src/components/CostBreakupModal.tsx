"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { PRODUCTS_CATALOG } from "../lib/catalogData";
import { PricingEngine } from "../lib/pricingEngine";

const CostBreakupModal: React.FC = () => {
  const {
    isCostBreakupOpen,
    breakupProductId,
    closeCostBreakup,
    bullionRates,
    products,
    productSelections
  } = useApp();

  if (!isCostBreakupOpen || !breakupProductId) return null;

  const product = products.find(p => p.id === breakupProductId || p.slug === breakupProductId);
  if (!product) return null;

  const selection = productSelections[product.id] || {
    karat: product.defaultKarat,
    color: product.defaultColor,
    size: "14 (Indian)",
    engraving: "",
    makingCharge: { type: "percent", value: product.makingChargePercent || 15 }
  };

  const currentKarat = selection.karat || product.defaultKarat;
  const currentColor = selection.color || product.defaultColor;

  const breakdown = PricingEngine.calculateBreakdown(
    product,
    currentKarat,
    bullionRates,
    null,
    selection.makingCharge
  );

  const activeImg = (product.images && product.images[currentColor]) || product.images.yellow;

  return (
    <div className={`modal-backdrop ${isCostBreakupOpen ? "active" : ""}`} onClick={closeCostBreakup}>
      <div className="modal-window breakup-modal-window" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={closeCostBreakup} title="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="breakup-modal-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activeImg} alt={product.title} className="breakup-thumb" />
          <div className="breakup-title-box">
            <h3>{product.title}</h3>
            <p>
              {breakdown.karat} {currentColor.toUpperCase()} GOLD • NET WT: {product.netGoldWeightGrams}g
            </p>
          </div>
        </div>

        <div className="breakup-modal-body">
          <table className="breakup-table">
            <thead>
              <tr>
                <th>Component Description</th>
                <th style={{ textAlign: "right" }}>Total (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Pure Metal Cost ({breakdown.karat})</strong>
                  <br />
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    {breakdown.netGoldWeight}g × {PricingEngine.formatINR(breakdown.ratePerGram)}/g ({breakdown.karat} Hallmark)
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <strong>{PricingEngine.formatINR(breakdown.metalCost)}</strong>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Diamonds / Precious Stones</strong>
                  <br />
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    {breakdown.diamondSpecs
                      ? `${breakdown.diamondSpecs.stoneCount || 1} Stones • ${breakdown.diamondSpecs.totalCaratWeight} ct (${breakdown.diamondSpecs.clarity})`
                      : product.gemstoneSpecs
                      ? `${product.gemstoneSpecs.stoneType} (${product.gemstoneSpecs.weightCarat} ct)`
                      : "None"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <strong>{PricingEngine.formatINR(breakdown.diamondCost)}</strong>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Making Charges ({breakdown.makingType === "per_gram" ? `₹${breakdown.makingPerGram}/g` : `${breakdown.makingPct}%`})</strong>
                  <br />
                  <span style={{ fontSize: "0.76rem", color: "var(--rose-gold)" }}>
                    {breakdown.hasDiscount
                      ? `${breakdown.discountPct}% Festive Discount Applied (-${PricingEngine.formatINR(breakdown.discountAmount)})`
                      : "Standard Karigar Crafting"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  {breakdown.hasDiscount && (
                    <span style={{ textDecoration: "line-through", fontSize: "0.76rem", color: "var(--text-muted)", marginRight: "0.3rem" }}>
                      {PricingEngine.formatINR(breakdown.baseMakingCharges)}
                    </span>
                  )}
                  <strong>{PricingEngine.formatINR(breakdown.effectiveMakingCharges)}</strong>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Taxable Value (Subtotal)</strong>
                </td>
                <td style={{ textAlign: "right" }}>
                  <strong>{PricingEngine.formatINR(breakdown.taxableSubtotal)}</strong>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Applicable GST (3% under HSN 7113)</strong>
                  <br />
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    CGST 1.5% ({PricingEngine.formatINR(breakdown.cgstAmount)}) + SGST 1.5% ({PricingEngine.formatINR(breakdown.sgstAmount)})
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <strong>{PricingEngine.formatINR(breakdown.gstAmount)}</strong>
                </td>
              </tr>

              <tr className="total-row">
                <td>
                  <strong>Final Transparency Price (All-Inclusive)</strong>
                </td>
                <td style={{ textAlign: "right", color: "var(--rose-gold)" }}>
                  <strong>{PricingEngine.formatINR(breakdown.finalPrice)}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="huid-badge-box">
            <div className="huid-text">
              <i className="fa-solid fa-stamp" style={{ color: "var(--gold-deep)" }}></i>
              <span>BIS Hallmarked Laser HUID:</span>
            </div>
            <div className="huid-code">{product.huid}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostBreakupModal;
