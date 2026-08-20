"use client";

import React from "react";
import Link from "next/link";

const COLLECTIONS = [
  {
    href: "/collections/gold",
    img: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
    tag: "BIS 916 HALLMARK",
    title: "22K Gold Jewellery",
    cta: "Shop Gold Collection"
  },
  {
    href: "/collections/diamond",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    tag: "IGI & GIA CERTIFIED",
    title: "Diamond & Solitaires",
    cta: "Shop Diamonds"
  },
  {
    href: "/collections/earrings",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    tag: "50+ HANDCRAFTED STYLES",
    title: "Earrings & Jhumkas",
    cta: "Shop Earrings"
  },
  {
    href: "/collections/daily-wear",
    img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
    tag: "UNDER 10 GRAMS",
    title: "Daily Wear Luxe",
    cta: "Shop Daily Wear"
  },
  {
    href: "/collections/gemstone",
    img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
    tag: "EMERALDS & SAPPHIRES",
    title: "Royal Gemstones",
    cta: "Shop Gemstones"
  },
  {
    href: "/collections/wedding",
    img: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg",
    tag: "ROYAL HEIRLOOMS 2026",
    title: "Bridal & Wedding",
    cta: "Shop Wedding Edit"
  },
  {
    href: "/collections/gifting",
    img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
    tag: "24K 999 COINS",
    title: "Gifting & Bullion",
    cta: "Shop Gifts"
  },
  {
    href: "/collections/under-50k",
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    tag: "BUDGET LUXURY",
    title: "Jewels Under ₹50K",
    cta: "Shop Under 50K"
  }
];

const CategoryCollections: React.FC = () => {
  return (
    <section className="home-collections-section">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">EXPLORE BY CATEGORY</span>
          <h2 className="section-title">Curated Jewellery Collections</h2>
          <p className="section-subtitle">Click on any category to browse its complete exclusive collection with live bullion rates.</p>
        </div>

        <div className="collections-showcase-grid reveal-stagger">
          {COLLECTIONS.map((c, idx) => (
            <Link key={idx} href={c.href} className="collection-tile-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.title} className="collection-tile-bg" />
              <div className="collection-tile-overlay"></div>
              <div className="collection-tile-info">
                <span className="collection-tile-tag">{c.tag}</span>
                <h3 className="collection-tile-title">{c.title}</h3>
                <span className="collection-tile-cta">
                  {c.cta} <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCollections;
