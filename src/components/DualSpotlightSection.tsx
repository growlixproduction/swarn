"use client";

import React from "react";
import Link from "next/link";

const DualSpotlightSection: React.FC = () => {
  return (
    <section className="spotlight-section">
      <div className="container spotlight-grid">
        <div className="spotlight-card reveal-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="spotlight-img"
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
            alt="Drop Cut Blue Necklace Set"
          />
          <div className="spotlight-content">
            <span className="spotlight-tag">EXCLUSIVE EDITION</span>
            <h3 className="spotlight-title">Drop Cut Blue Sapphire & Diamond Necklace Set</h3>
            <Link href="/collections/gemstone" className="btn btn-dark btn-sm">
              Shop Now
            </Link>
          </div>
        </div>

        <div className="spotlight-card reveal-right delay-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="spotlight-img"
            src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80"
            alt="Rose Gold Ring for Women"
          />
          <div className="spotlight-content">
            <span className="spotlight-tag">BEST ETERNAL RING</span>
            <h3 className="spotlight-title">Rose Gold Ring For Women & Solitaires</h3>
            <Link href="/collections/diamond" className="btn btn-dark btn-sm">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualSpotlightSection;
