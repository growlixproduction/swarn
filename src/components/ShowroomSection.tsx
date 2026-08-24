"use client";

import React from "react";
import { STORE_CONFIG } from "../lib/catalogData";

const ShowroomSection: React.FC = () => {
  return (
    <section className="showroom-story-section" id="showroom-section">
      <div className="container showroom-grid">
        {/* Left Content (Slides in from Left) */}
        <div className="showroom-text-col reveal-left">
          <span className="showroom-badge">ESTABLISHED 2015 • AMBIKAPUR, CHHATTISGARH</span>
          <h2 className="showroom-title">Welcome to Swarn Mahal Luxury Jewellers</h2>
          <p className="showroom-desc">
            Located at <strong>Church Road, Joda Pipal, Maharaja Gali, Ambikapur</strong>, Swarn Mahal has been the benchmark of purity, trust, and transparent pricing in North Chhattisgarh for over a decade.
          </p>

          <ul className="showroom-features-list">
            <li className="showroom-feature-item">
              <div className="showroom-feature-icon">
                <i className="fa-solid fa-stamp"></i>
              </div>
              <div className="showroom-feature-text">
                <strong>100% BIS 916 Hallmarked Gold</strong>
                <span>Every single gold ornament carries a verifiable 6-digit laser HUID stamp.</span>
              </div>
            </li>
            <li className="showroom-feature-item">
              <div className="showroom-feature-icon">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <div className="showroom-feature-text">
                <strong>Certified Precision Weighing & Assay</strong>
                <span>Zero wastage manipulation. Digital weights and karat purity tested right in front of you.</span>
              </div>
            </li>
            <li className="showroom-feature-item">
              <div className="showroom-feature-icon">
                <i className="fa-solid fa-hand-holding-dollar"></i>
              </div>
              <div className="showroom-feature-text">
                <strong>Lowest & Fair Making Charges</strong>
                <span>Direct artisan pricing with transparent formula billing and zero hidden surcharges.</span>
              </div>
            </li>
          </ul>

          <a href="tel:+919999777740" className="btn btn-gold">
            <i className="fa-solid fa-phone"></i> Call Store: +91 9999P-7774
          </a>
        </div>

        {/* Right Mosaic Gallery with Real Asset Photos */}
        <div className="showroom-gallery-mosaic" id="showroom-mosaic">
          <div className="mosaic-img-card card-tall">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(10).jpeg"
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80";
              }}
              alt="Main Luxury Showroom Floor"
            />
            <div className="mosaic-tag">Ambikapur Main Floor</div>
          </div>
          <div className="mosaic-img-card card-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(11).jpeg"
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80";
              }}
              alt="Precision Weighing Counter"
            />
            <div className="mosaic-tag">Live Karat Assay</div>
          </div>
          <div className="mosaic-img-card card-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(3).jpeg"
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80";
              }}
              alt="Bridal Consultation Bay"
            />
            <div className="mosaic-tag">Bridal Trousseau Lounge</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowroomSection;
