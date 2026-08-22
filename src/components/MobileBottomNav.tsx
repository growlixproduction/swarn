"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, openCartDrawer } = useApp();

  const navItems = [
    { label: "All Jewels", href: "/collections/all", icon: "fa-gem" },
    { label: "Gold", href: "/collections/gold", icon: "fa-crown" },
    { label: "Diamond", href: "/collections/diamond", icon: "fa-ring" },
    { label: "Silver", href: "/collections/silver", icon: "fa-award" },
  ];

  return (
    <nav
      className="mobile-bottom-app-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(12px)",
        borderTop: "1.5px solid rgba(197, 168, 128, 0.35)",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.08)",
        display: "none", // Controlled via CSS media query (@media max-width: 768px -> flex)
        padding: "0.4rem 0.2rem calc(0.4rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div style={{ display: "flex", width: "100%", justifyContent: "space-around", alignItems: "center" }}>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                textDecoration: "none",
                color: isActive ? "var(--gold-deep)" : "#6B7280",
                fontSize: "0.68rem",
                fontWeight: isActive ? 700 : 600,
                flex: 1,
                padding: "0.2rem 0",
                transition: "all 0.2s ease"
              }}
            >
              <i className={`fa-solid ${item.icon}`} style={{ fontSize: "1.1rem", color: isActive ? "var(--gold-deep)" : "#9CA3AF" }}></i>
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Bag / Shopping Cart Button */}
        <button
          type="button"
          onClick={openCartDrawer}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.2rem",
            background: "none",
            border: "none",
            color: "#6B7280",
            fontSize: "0.68rem",
            fontWeight: 600,
            flex: 1,
            padding: "0.2rem 0",
            position: "relative",
            cursor: "pointer"
          }}
        >
          <div style={{ position: "relative" }}>
            <i className="fa-solid fa-bag-shopping" style={{ fontSize: "1.1rem", color: "var(--gold-deep)" }}></i>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-10px",
                  background: "#832729",
                  color: "#FFFFFF",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px solid #FFFFFF"
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
          <span>Bag</span>
        </button>
      </div>
    </nav>
  );
}
