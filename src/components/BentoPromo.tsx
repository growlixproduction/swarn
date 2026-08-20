"use client";

import React from "react";
import Link from "next/link";

const BentoPromo: React.FC = () => {
  return (
    <section className="promo-bento-section">
      <div className="container">
        <div className="bento-grid">
          {/* Large Left Card: Yellow Gold & Diamond Ring (Slides from Left) */}
          <Link href="/collections/diamond" className="bento-card bento-card-large reveal-left" style={{ textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="bento-bg-image"
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80"
              alt="Yellow Gold and Diamond Ring"
            />
            <div className="bento-content">
              <span className="bento-sub">DIAMOND RING</span>
              <h3 className="bento-title">
                Yellow Gold &<br />Diamond Ring
              </h3>
              <span className="bento-link">
                Shop Collection <i className="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </Link>

          {/* Top Right Card: Infinity Diamond Bracelet (Slides from Right) */}
          <Link href="/collections/daily-wear" className="bento-card reveal-right delay-100" style={{ textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="bento-bg-image"
              src="https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80"
              alt="Infinity Diamond Bracelet"
            />
            <div className="bento-content light-mode">
              <span className="bento-sub">DIAMOND BRACELETS</span>
              <h3 className="bento-title">Infinity Diamond Bracelet</h3>
              <span className="bento-link">
                Shop Daily Luxe <i className="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </Link>

          {/* Bottom Right Card: Teardrop Diamond Pendant (Slides from Right) */}
          <Link href="/collections/gemstone" className="bento-card reveal-right delay-200" style={{ textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="bento-bg-image"
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80"
              alt="Teardrop Diamond Pendant"
            />
            <div className="bento-content light-mode">
              <span className="bento-sub">GEMSTONE PENDANT</span>
              <h3 className="bento-title">Teardrop Gemstone Pendant</h3>
              <span className="bento-link">
                Shop Gemstones <i className="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BentoPromo;
