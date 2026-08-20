"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { PricingEngine } from "../lib/pricingEngine";

const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    priceLockSeconds
  } = useApp();

  if (!isCartOpen) return null;

  const total = getCartTotal();
  const subtotal = Math.round(total / 1.03);
  const gst = total - subtotal;
  const isHighValueKYC = total >= 200000;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`cart-drawer-overlay ${isCartOpen ? "active" : ""}`}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="cart-drawer-panel"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <i className="fa-solid fa-bag-shopping" style={{ color: "var(--gold-deep)" }}></i>
            <span>Your Jewellery Bag ({cart.length})</span>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            title="Close Bag"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Dynamic Price Lock Strip */}
        <div className="cart-price-lock-banner">
          <i className="fa-solid fa-shield-halved" style={{ color: "var(--gold-deep)" }}></i>
          <span>Bullion Rate Locked for: <strong>{formatTimer(priceLockSeconds)}</strong></span>
        </div>

        {/* Cart Item List */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state" style={{ textAlign: "center", padding: "4rem 1rem" }}>
              <i
                className="fa-solid fa-basket-shopping"
                style={{ fontSize: "3rem", color: "var(--gold-light)", marginBottom: "1rem", display: "block" }}
              ></i>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", fontWeight: 600 }}>
                Your jewellery vault is empty.
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.4rem" }}>
                Explore handcrafted heirlooms, diamond solitaires and pure 22K gold designs.
              </p>
              <button
                type="button"
                className="btn btn-gold btn-sm"
                style={{ marginTop: "1.5rem" }}
                onClick={() => setIsCartOpen(false)}
              >
                Explore Collections
              </button>
            </div>
          ) : (
            <div className="cart-items-list" id="cart-items-list">
              {cart.map((item, idx) => (
                <div className="cart-item-card" key={`${item.id}-${item.karat}-${item.color}-${idx}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <div className="cart-item-spec">
                      <span>{item.karat} {item.color.toUpperCase()} GOLD</span> • <span>Size: {item.size}</span>
                    </div>
                    {item.engraving && (
                      <div className="cart-engraving-tag" style={{ fontSize: "0.72rem", color: "var(--gold-deep)", fontStyle: "italic" }}>
                        <i className="fa-solid fa-pen-nib"></i> Laser Inner: &quot;{item.engraving}&quot;
                      </div>
                    )}
                    <div className="cart-item-price-row">
                      <div className="cart-qty-box">
                        <button type="button" className="qty-btn" onClick={() => updateCartQuantity(idx, item.quantity - 1)}>
                          -
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button type="button" className="qty-btn" onClick={() => updateCartQuantity(idx, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <span className="cart-item-price">
                        {PricingEngine.formatINR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => removeFromCart(idx)}
                    title="Remove Item"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Drawer Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            {isHighValueKYC && (
              <div className="pan-alert active" id="pan-alert" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#FEF3C7", border: "1px solid #FCD34D", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.76rem", color: "#92400E", marginBottom: "0.85rem" }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>Orders exceeding ₹2,00,000 require mandatory PAN verification at checkout under Indian Tax Laws.</span>
              </div>
            )}

            <div className="cart-summary-row">
              <span>Taxable Value (Metal + Making):</span>
              <span>{PricingEngine.formatINR(subtotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Applicable GST (3% HSN 7113):</span>
              <span>{PricingEngine.formatINR(gst)}</span>
            </div>
            <div className="cart-summary-row total-row" style={{ borderTop: "1.5px solid var(--border-gold)", paddingTop: "0.65rem", marginTop: "0.5rem", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
              <span>Grand Total (All-Inclusive):</span>
              <span style={{ color: "var(--gold-deep)", fontSize: "1.2rem" }}>{PricingEngine.formatINR(total)}</span>
            </div>

            <button
              type="button"
              className="btn-pdp-cart"
              style={{ width: "100%", marginTop: "1rem", justifyContent: "center" }}
              onClick={() => alert(`Proceeding to 100% Insured Checkout with Sequel Secure Logistics. Order Total: ${PricingEngine.formatINR(total)}`)}
            >
              <i className="fa-solid fa-lock"></i> Secure Checkout (Price Locked)
            </button>
            <div style={{ textAlign: "center", marginTop: "0.6rem", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              <i className="fa-solid fa-shield-halved"></i> 100% Transit Insured Handover with OTP Verification
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
