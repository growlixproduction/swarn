"use client";

import React from "react";
import Link from "next/link";
import { Product } from "../lib/types";
import { useApp } from "../context/AppContext";
import { PricingEngine } from "../lib/pricingEngine";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { bullionRates, wishlist, toggleWishlist, productSelections } = useApp();

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

  const isWishlisted = wishlist.includes(product.id);
  const activeImage = (product.images && product.images[currentColor]) || product.images.yellow;
  const hoverImage = (product.images && product.images.hover) || activeImage;

  const stockUrgency = product.isFeatured ? "Only 1 left!" : product.isNew ? "New Arrival" : "Only 2 left!";
  const offerText = breakdown.hasDiscount
    ? `${breakdown.discountPct}% OFF on Making Charges`
    : "Flat 20% OFF on Making";

  return (
    <div className="product-card" id={`card-${product.id}`}>
      <Link href={`/product/${product.id}`} className="product-card-link-wrapper">
        <div className="product-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="product-img-primary" src={activeImage} alt={product.title} loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="product-img-hover" src={hoverImage} alt={`${product.title} alternate view`} loading="lazy" />

          <button
            type="button"
            className={`tanishq-card-wishlist ${isWishlisted ? "wishlisted" : ""}`}
            title="Add to Wishlist"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
          >
            <i className={isWishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
          </button>
        </div>

        <div className="product-info">
          <h3 className="product-title" title={product.title}>
            {product.title}
          </h3>

          <div className="product-pricing-box">
            <span className="price-current">₹ {Math.round(breakdown.finalPrice).toLocaleString("en-IN")}</span>
            {breakdown.hasDiscount && (
              <span className="price-original">₹ {Math.round(breakdown.originalPrice).toLocaleString("en-IN")}</span>
            )}
            <span className="stock-urgency-text">{stockUrgency}</span>
          </div>

          <div className="tanishq-offer-pill">
            <span className="offer-pct-icon">%</span>
            <span className="offer-text">{offerText}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
