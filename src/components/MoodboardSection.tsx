"use client";

import React from "react";
import Link from "next/link";

const MOODS = [
  {
    href: "/collections/wedding",
    img: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
    title: "Bridal Rani Haar & Wedding Sets",
    count: "Explore Wedding Edit",
    revealClass: "reveal-left"
  },
  {
    href: "/collections/diamond",
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    title: "Rose Gold & Solitaire Rings",
    count: "Explore Diamond Solitaires",
    revealClass: "reveal-left delay-100"
  },
  {
    href: "/collections/earrings",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    title: "Chandelier Drops & Jhumkas",
    count: "Explore Earrings",
    revealClass: "reveal-right delay-200"
  },
  {
    href: "/collections/gemstone",
    img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
    title: "Royal Gemstones & Pendants",
    count: "Explore Gemstones",
    revealClass: "reveal-right delay-300"
  }
];

const MoodboardSection: React.FC = () => {
  return (
    <section className="moodboard-section" id="moodboard-section">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">DISCOVER BY MOOD</span>
          <h2 className="section-title">Signature Collections</h2>
          <p className="section-subtitle">Curated heirlooms handcrafted with love and artisanal perfection.</p>
        </div>

        <div className="moodboard-grid">
          {MOODS.map((m, idx) => (
            <Link key={idx} href={m.href} className={`moodboard-card ${m.revealClass}`} style={{ textDecoration: "none" }}>
              <div className="moodboard-img-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.title} />
              </div>
              <div className="moodboard-info">
                <h3 className="moodboard-title">{m.title}</h3>
                <span className="moodboard-count">
                  {m.count} <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoodboardSection;
