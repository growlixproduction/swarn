"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const DEFAULT_SLIDES = [
  {
    tagBadge: "BRIDAL COUTURE 2026",
    titleMain: "ROYAL HEIRLOOMS &",
    titleItalic: "BRIDAL KUNDAN",
    description: "Intricately woven 22K gold with uncut diamonds, emeralds & pearls crafted for brides.",
    backgroundImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    buttonText: "EXPLORE HERITAGE",
    buttonLink: "/collections/wedding"
  },
  {
    tagBadge: "FESTIVE COLLECTION • FLAT 20% OFF",
    titleMain: "SWARN MAHAL",
    titleItalic: "THE FESTIVE EDIT",
    description: "Flat 20% Off on making charges across all 22K Hallmark gold & bridal rani haar suites.",
    backgroundImage: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
    buttonText: "SHOP FESTIVE",
    buttonLink: "/collections/gold"
  },
  {
    tagBadge: "STARTING FROM ₹14,999",
    titleMain: "MINIMAL LUXE &",
    titleItalic: "SOLITAIRES",
    description: "Handcrafted 18K & 22K gold rings and lightweight hoop earrings for dynamic lifestyles.",
    backgroundImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85",
    buttonText: "EXPLORE MINIMAL",
    buttonLink: "/collections/diamond"
  },
  {
    tagBadge: "ESTABLISHED 2015 • AMBIKAPUR",
    titleMain: "TIMELESS TRUST &",
    titleItalic: "100% TRANSPARENCY",
    description: "North Chhattisgarh's benchmark showroom on Church Road, Joda Pipal, Maharaja Gali.",
    backgroundImage: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (10).jpeg",
    buttonText: "VISIT SHOWROOM",
    buttonLink: "/#showroom-section"
  }
];

const HeroSection: React.FC = () => {
  const [slides, setSlides] = useState<any[]>(DEFAULT_SLIDES);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        if (data && data.heroSlides && data.heroSlides.length > 0) {
          setSlides(data.heroSlides);
        }
      })
      .catch(err => console.warn("Failed to load live hero slides:", err));
  }, []);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  return (
    <section className="hero-slider-section">
      <div className="hero-slider-container">
        <div className="hero-slider-viewport">
          {/* Navigation Arrows */}
          <button
            type="button"
            className="slider-arrow-btn slider-prev-btn"
            style={{ left: "20px" }}
            onClick={() => setCurrentIdx(prev => (prev - 1 + slides.length) % slides.length)}
            title="Previous Slide"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            type="button"
            className="slider-arrow-btn slider-next-btn"
            style={{ right: "20px" }}
            onClick={() => setCurrentIdx(prev => (prev + 1) % slides.length)}
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
            {slides.map((slide, idx) => (
              <div key={idx} className={`hero-slide ${idx === currentIdx ? "active" : ""}`}>
                <div className="slide-media-box">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="slide-bg-img" src={slide.backgroundImage || slide.image} alt={slide.titleMain} />
                  <div className="slide-media-overlay" style={{ background: slide.overlayGradient }}></div>
                </div>
                <div className="slide-hero-content">
                  <div className="hero-tag-badge">{slide.tagBadge || slide.tag}</div>
                  <h1 className="hero-slide-heading">
                    {slide.titleMain}
                    <br />
                    <span className="italic-gold">{slide.titleItalic}</span>
                  </h1>
                  <p className="hero-slide-desc">{slide.description || slide.desc}</p>
                  <Link href={slide.buttonLink || slide.btnLink || "/"} className="btn-hero-luxury">
                    {slide.buttonText || slide.btnText} <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Pagination Dots */}
        <div className="slider-pagination-dots" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          {slides.map((_, idx) => (
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
