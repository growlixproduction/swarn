"use client";

import React from "react";
import Link from "next/link";
import { STORE_CONFIG } from "../lib/catalogData";

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand-logo" style={{ marginBottom: "1rem", display: "inline-block" }}>
            <span className="logo-main" style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-primary)" }}>
              SWARN MAHAL
            </span>
            <span className="logo-sub" style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.18em", color: "var(--gold-deep)" }}>
              SAWARN LUXURY JEWELS • AMBIKAPUR
            </span>
          </Link>
          <p className="footer-address" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <strong>Ambikapur Flagship:</strong>
            <br />
            {STORE_CONFIG.address}
          </p>
          <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            <i className="fa-solid fa-phone" style={{ color: "var(--gold-deep)", marginRight: "0.4rem" }}></i>
            {STORE_CONFIG.phone}
          </p>
          <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
            <i className="fa-brands fa-whatsapp" style={{ color: "var(--gold-deep)", marginRight: "0.4rem" }}></i>
            {STORE_CONFIG.whatsapp}
          </p>
        </div>

        <div>
          <h4 className="footer-col-title" style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
            Explore Collections
          </h4>
          <ul className="footer-links" style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><Link href="/collections/gold" style={{ color: "var(--text-secondary)" }}>22K Gold Jewellery</Link></li>
            <li><Link href="/collections/diamond" style={{ color: "var(--text-secondary)" }}>Diamond Solitaires</Link></li>
            <li><Link href="/collections/earrings" style={{ color: "var(--text-secondary)" }}>Earrings & Jhumkas</Link></li>
            <li><Link href="/collections/wedding" style={{ color: "var(--text-secondary)" }}>Royal Bridal Trousseau</Link></li>
            <li><Link href="/collections/daily-wear" style={{ color: "var(--text-secondary)" }}>Daily Luxe Essentials</Link></li>
            <li><Link href="/collections/under-50k" style={{ color: "var(--text-secondary)" }}>Designs Under ₹50,000</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title" style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
            Customer Care & Trust
          </h4>
          <ul className="footer-links" style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><Link href="/#tools-section" style={{ color: "var(--text-secondary)" }}>Old Gold Exchange Calculator</Link></li>
            <li><Link href="/#tools-section" style={{ color: "var(--text-secondary)" }}>10+1 Monthly Gold Scheme</Link></li>
            <li><Link href="/#showroom-section" style={{ color: "var(--text-secondary)" }}>Book In-Store Appointment</Link></li>
            <li><span style={{ color: "var(--text-secondary)" }}>BIS 916 HUID Verification</span></li>
            <li><span style={{ color: "var(--text-secondary)" }}>100% Transit Insurance</span></li>
            <li><span style={{ color: "var(--text-secondary)" }}>Lifetime Exchange Policy</span></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title" style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
            Certifications & Standards
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fa-solid fa-stamp" style={{ color: "var(--gold-deep)" }}></i>
              <span>BIS 916 Hallmarked Gold</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fa-solid fa-certificate" style={{ color: "var(--gold-deep)" }}></i>
              <span>IGI / GIA Certified Diamonds</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fa-solid fa-scale-balanced" style={{ color: "var(--gold-deep)" }}></i>
              <span>100% Transparent Formula Billing</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fa-solid fa-shield-halved" style={{ color: "var(--gold-deep)" }}></i>
              <span>GST Registered: {STORE_CONFIG.gstin}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom" style={{ borderTop: "1px solid var(--border-light)", padding: "1.5rem 0", marginTop: "3rem", fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center" }}>
        <div className="container">
          <p>© {new Date().getFullYear()} Swarn Mahal Jewellers, Ambikapur. All Rights Reserved. Handcrafted with pride in Chhattisgarh.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
