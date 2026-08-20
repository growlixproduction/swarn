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

        {/* Right Mosaic Gallery with Real Asset Photos (Slides in from Right) */}
        <div className="showroom-gallery-mosaic reveal-right reveal-stagger" id="showroom-mosaic">
          <div className="mosaic-img-card card-tall">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (10).jpeg" alt="Main Luxury Showroom Floor" />
            <div className="mosaic-tag">Ambikapur Main Floor</div>
          </div>
          <div className="mosaic-img-card card-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (11).jpeg" alt="Precision Weighing Counter" />
            <div className="mosaic-tag">Live Karat Assay</div>
          </div>
          <div className="mosaic-img-card card-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (3).jpeg" alt="Bridal Consultation Bay" />
            <div className="mosaic-tag">Bridal Trousseau Lounge</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowroomSection;
