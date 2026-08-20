"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const SLIDES = [
  {
    tag: "BRIDAL COUTURE 2026",
    titleMain: "ROYAL HEIRLOOMS &",
    titleItalic: "BRIDAL KUNDAN",
    desc: "Intricately woven 22K gold with uncut diamonds, emeralds & pearls crafted for brides.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    btnText: "EXPLORE HERITAGE",
    btnLink: "/collections/wedding"
  },
  {
    tag: "FESTIVE COLLECTION • FLAT 20% OFF",
    titleMain: "SWARN MAHAL",
    titleItalic: "THE FESTIVE EDIT",
    desc: "Flat 20% Off on making charges across all 22K Hallmark gold & bridal rani haar suites.",
    image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
    btnText: "SHOP FESTIVE",
    btnLink: "/collections/gold"
  },
  {
    tag: "STARTING FROM ₹14,999",
    titleMain: "MINIMAL LUXE &",
    titleItalic: "SOLITAIRES",
    desc: "Handcrafted 18K & 22K gold rings and lightweight hoop earrings for dynamic lifestyles.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85",
    btnText: "EXPLORE MINIMAL",
    btnLink: "/collections/diamond"
  },
  {
    tag: "ESTABLISHED 2015 • AMBIKAPUR",
    titleMain: "TIMELESS TRUST &",
    titleItalic: "100% TRANSPARENCY",
    desc: "North Chhattisgarh's benchmark showroom on Church Road, Joda Pipal, Maharaja Gali.",
    image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (10).jpeg",
    btnText: "VISIT SHOWROOM",
    btnLink: "/#showroom-section"
  }
];

const HeroSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-slider-section">
      <div className="hero-slider-container">
        <div className="hero-slider-viewport">
          {/* Navigation Arrows */}
          <button
            type="button"
            className="slider-arrow-btn slider-prev-btn"
            style={{ left: "20px" }}
            onClick={() => setCurrentIdx(prev => (prev - 1 + SLIDES.length) % SLIDES.length)}
            title="Previous Slide"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            type="button"
            className="slider-arrow-btn slider-next-btn"
            style={{ right: "20px" }}
            onClick={() => setCurrentIdx(prev => (prev + 1) % SLIDES.length)}
            title="Next Slide"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          {/* Slider Track */}
          <div
            className="hero-slider-track"
            style={{
              transform: `translateX(-${currentIdx * 100}%)`,
              display: "flex",
              transition: "transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)"
            }}
          >
            {SLIDES.map((slide, idx) => (
              <div key={idx} className={`hero-slide ${idx === currentIdx ? "active" : ""}`}>
                <div className="slide-media-box">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="slide-bg-img" src={slide.image} alt={slide.titleMain} />
                  <div className="slide-media-overlay"></div>
                </div>
                <div className="slide-hero-content">
                  <div className="hero-tag-badge">{slide.tag}</div>
                  <h1 className="hero-slide-heading">
                    {slide.titleMain}
                    <br />
                    <span className="italic-gold">{slide.titleItalic}</span>
                  </h1>
                  <p className="hero-slide-desc">{slide.desc}</p>
                  <Link href={slide.btnLink} className="btn-hero-luxury">
                    {slide.btnText} <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Pagination Dots */}
        <div className="slider-pagination-dots" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={`slider-dot ${idx === currentIdx ? "active" : ""}`}
              onClick={() => setCurrentIdx(idx)}
              style={{
                width: idx === currentIdx ? "28px" : "10px",
                height: "10px",
                borderRadius: "5px",
                background: idx === currentIdx ? "var(--gold-deep)" : "#D1C7BD",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
