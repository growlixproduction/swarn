"use client";

import React from "react";

const GOOGLE_REVIEW_LINK = "https://share.google/UgEQIcP5zoW6vgAb5";

const GOOGLE_REVIEWS_LIST = [
  {
    name: "Surendra Singh",
    initial: "S",
    avatarBg: "#832729",
    rating: 5,
    date: "2 weeks ago",
    text: "Main pehli baar is Swarn Mahal Sona ki dukaan par aaya tha aur experience bahut hi shandar raha. Yahan ke designs modern bhi hain aur traditional touch bhi hai. Rate fair hain, koi extra charge nahi!",
    badge: "Google Verified Review • Ambikapur"
  },
  {
    name: "Aarti Soni",
    initial: "A",
    avatarBg: "#C59B27",
    rating: 5,
    date: "1 month ago",
    text: "Excellent jewelleries available in this showroom! Very good bridal and gold jewellery collections in Ambikapur. Highly satisfied with pure hallmark gold and transparent billing.",
    badge: "Google Verified Review • Ambikapur"
  },
  {
    name: "Roshan",
    initial: "R",
    avatarBg: "#059669",
    rating: 5,
    date: "3 weeks ago",
    text: "Best jewellery collection in Ambikapur! Designs itne unique aur classy hain ki first visit me hi dil jeet liya. The cost breakup and diamond certification gave complete peace of mind.",
    badge: "Google Verified Review • Chhattisgarh"
  },
  {
    name: "Karan Talukdar",
    initial: "K",
    avatarBg: "#2563EB",
    rating: 5,
    date: "1 month ago",
    text: "मैंने आज शॉपिंग किया जैसा समझा था उससे कहीं अच्छा स्टोर को पाया, रेट बहुत कम है दूसरे दुकानों के अपेक्षा। Pure gold, accurate weight and trustworthy people.",
    badge: "Google Verified Review • Ambikapur"
  },
  {
    name: "Priyanshu Gupta",
    initial: "P",
    avatarBg: "#7C3AED",
    rating: 5,
    date: "2 months ago",
    text: "Swarn Mahal is the most transparent jeweller in Ambikapur. Live 24K gold rates ticker, accurate gross/net weight calculation, and wonderful hospitality!",
    badge: "Google Verified Review • Ambikapur"
  },
  {
    name: "Sunita Agrawal",
    initial: "S",
    avatarBg: "#D97706",
    rating: 5,
    date: "1 month ago",
    text: "Bought 22K BIS Hallmarked Jhumkas for my daughter's wedding. The karigari is so intricate and beautiful. Staff helped us calculate complete itemized breakup patiently.",
    badge: "Google Verified Review • Ambikapur"
  }
];

const ReviewsSection: React.FC = () => {
  // Duplicate array to create a seamless infinite loop
  const marqueeItems = [...GOOGLE_REVIEWS_LIST, ...GOOGLE_REVIEWS_LIST];

  return (
    <section className="testimonials-section" id="reviews-section" style={{ overflow: "hidden", background: "linear-gradient(180deg, #FCFAF7 0%, #F8F3EC 100%)", padding: "4.5rem 0" }}>
      <div className="container" style={{ marginBottom: "2.5rem" }}>
        <div className="section-header reveal-up" style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "30px", padding: "0.4rem 1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "1rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/asset/Google_G-logo.svg" alt="Google" style={{ width: "18px", height: "18px" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", letterSpacing: "0.04em" }}>GOOGLE VERIFIED REVIEWS</span>
            <span style={{ color: "#F59E0B", fontSize: "0.85rem", fontWeight: 700 }}>4.9 ★★★★★</span>
          </div>

          <h2 className="section-title" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text-primary)", marginBottom: "0.6rem" }}>
            What Our Ambikapur Clients Say On Google
          </h2>
          <p className="section-subtitle" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", maxWidth: "680px", margin: "0 auto 1.5rem" }}>
            Real experiences from authentic buyers at Swarn Mahal Jewellers, Church Road, Ambikapur.
          </p>

          <a
            href={GOOGLE_REVIEW_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", borderRadius: "24px", padding: "0.55rem 1.35rem", fontSize: "0.84rem", fontWeight: 700, textDecoration: "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/asset/Google_G-logo.svg" alt="Google" style={{ width: "16px", height: "16px", background: "#FFF", borderRadius: "50%", padding: "2px" }} />
            <span>Leave a Review on Google</span>
            <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "0.74rem" }}></i>
          </a>
        </div>
      </div>

      {/* CONTINUOUS RIGHT-TO-LEFT INFINITE LOOP MARQUEE CONTAINER */}
      <div style={{ width: "100%", overflow: "hidden", position: "relative", padding: "0.5rem 0 1.5rem" }}>
        {/* Gradient Edge Blurs */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "80px", background: "linear-gradient(to right, #FCFAF7 0%, transparent 100%)", zIndex: 3, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "80px", background: "linear-gradient(to left, #FCFAF7 0%, transparent 100%)", zIndex: 3, pointerEvents: "none" }} />

        {/* Marquee Track */}
        <div className="google-reviews-marquee-track">
          {marqueeItems.map((rev, idx) => (
            <a
              key={idx}
              href={GOOGLE_REVIEW_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="google-review-card-item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "360px",
                maxWidth: "85vw",
                flexShrink: 0,
                background: "#FFFFFF",
                borderRadius: "14px",
                border: "1px solid #EAE4DC",
                padding: "1.35rem",
                boxShadow: "0 4px 18px rgba(135, 101, 56, 0.06)",
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.25s ease, box-shadow 0.25s ease"
              }}
            >
              <div>
                {/* Header Row: User Avatar & Google Icon */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: rev.avatarBg, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1rem" }}>
                      {rev.initial}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.92rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>{rev.name}</h4>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{rev.date}</span>
                    </div>
                  </div>

                  {/* Google Logo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/asset/Google_G-logo.svg" alt="Google" style={{ width: "20px", height: "20px" }} />
                </div>

                {/* 5-Star Rating Row */}
                <div style={{ color: "#F59E0B", fontSize: "0.9rem", marginBottom: "0.65rem", display: "flex", gap: "0.15rem" }}>
                  {"★".repeat(rev.rating)}
                </div>

                {/* Review Text */}
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: "0 0 1rem", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  &quot;{rev.text}&quot;
                </p>
              </div>

              {/* Card Footer Badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.65rem", borderTop: "1px solid #F3EFE9" }}>
                <span style={{ fontSize: "0.68rem", color: "#059669", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "4px", padding: "0.2rem 0.5rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  <i className="fa-brands fa-google" style={{ color: "#4285F4" }}></i> {rev.badge}
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--gold-deep)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span>Verify</span>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: "0.65rem" }}></i>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
