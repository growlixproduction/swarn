"use client";

import React from "react";
import { REVIEWS_DATA } from "../lib/catalogData";

const ReviewsSection: React.FC = () => {
  return (
    <section className="testimonials-section" id="reviews-section">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">VERIFIED BUYER EXPERIENCES</span>
          <h2 className="section-title">What Our Ambikapur Clients Say</h2>
          <p className="section-subtitle">Rated 5.0 / 5.0 on Justdial with 31+ authentic customer testimonials.</p>
        </div>

        <div className="reviews-grid reveal-stagger" id="reviews-grid">
          {REVIEWS_DATA.map((rev, idx) => (
            <div key={idx} className="review-card">
              <div className="review-rating" style={{ color: "#F59E0B", marginBottom: "0.5rem" }}>
                {"★".repeat(rev.rating)}
              </div>
              <p className="review-text">&quot;{rev.text}&quot;</p>
              <div className="review-author-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: "0.75rem", marginTop: "1rem" }}>
                <div>
                  <h4 className="review-author" style={{ fontSize: "0.9rem", fontWeight: 700, margin: 0 }}>{rev.name}</h4>
                  <span className="review-date" style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{rev.date}</span>
                </div>
                <span className="review-verified-badge" style={{ fontSize: "0.68rem", background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: 600 }}>
                  <i className="fa-solid fa-circle-check"></i> {rev.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
