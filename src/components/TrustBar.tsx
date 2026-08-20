"use client";

import React from "react";

const TrustBar: React.FC = () => {
  return (
    <section className="trust-bar">
      <div className="container trust-grid reveal-stagger">
        <div className="trust-item">
          <div className="trust-icon-box">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <div className="trust-info">
            <h4>Worldwide & Insured Shipping</h4>
            <p>100% transit insurance & OTP verified delivery</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box">
            <i className="fa-solid fa-arrow-rotate-left"></i>
          </div>
          <div className="trust-info">
            <h4>Money Back & Buyback</h4>
            <p>Lifetime buyback & 100% exchange value guarantee</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box">
            <i className="fa-solid fa-tags"></i>
          </div>
          <div className="trust-info">
            <h4>Offers & Transparent Pricing</h4>
            <p>Zero hidden charges with itemized formula breakup</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box">
            <i className="fa-solid fa-headset"></i>
          </div>
          <div className="trust-info">
            <h4>24/7 Expert Gemologist Support</h4>
            <p>Live video call & in-store consultation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
