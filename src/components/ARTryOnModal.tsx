"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { PRODUCTS_CATALOG } from "../lib/catalogData";

const ARTryOnModal: React.FC = () => {
  const { isARTryOnOpen, arProductId, closeARTryOn } = useApp();
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isARTryOnOpen || !arProductId) return null;

  const product = PRODUCTS_CATALOG.find(p => p.id === arProductId);
  if (!product) return null;

  return (
    <div className={`modal-backdrop ${isARTryOnOpen ? "active" : ""}`} onClick={closeARTryOn}>
      <div className="modal-window ar-modal-window" onClick={e => e.stopPropagation()} style={{ maxWidth: "560px" }}>
        <button type="button" className="modal-close-btn" onClick={closeARTryOn} title="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="ar-modal-body" style={{ padding: "2rem", textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", marginBottom: "0.25rem" }}>
            Virtual 3D AR Try-On
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Simulating real-world wear for {product.title}
          </p>

          <div
            className="ar-stage-container"
            style={{
              position: "relative",
              width: "100%",
              height: "360px",
              background: "#121212",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
          >
            {/* Background Model / Camera Silhouette */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              alt="Model Canvas"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85)" }}
            />

            {/* Overlay Jewellery Piece */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images.yellow}
              alt={product.title}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                width: "130px",
                filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.6))",
                pointerEvents: "none",
                transition: "transform 0.15s ease"
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "12px",
                right: "12px",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(6px)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span><i className="fa-solid fa-video" style={{ color: "#10B981" }}></i> AR Simulation Active</span>
              <span>100% Proportion Scaled</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginTop: "1.25rem", alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setScale(prev => Math.max(0.6, prev - 0.1))}
              title="Zoom Out"
            >
              <i className="fa-solid fa-magnifying-glass-minus"></i>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setScale(prev => Math.min(1.6, prev + 0.1))}
              title="Zoom In"
            >
              <i className="fa-solid fa-magnifying-glass-plus"></i>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setRotation(prev => prev - 15)}
              title="Rotate Left"
            >
              <i className="fa-solid fa-rotate-left"></i>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setRotation(prev => prev + 15)}
              title="Rotate Right"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
            <button
              type="button"
              className="btn btn-gold btn-sm"
              onClick={() => alert(`Appointment requested! Our Ambikapur gemologist stylist will connect with you via video call for a personalized live consultation on ${product.title}.`)}
            >
              <i className="fa-solid fa-headset"></i> Book Stylist Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARTryOnModal;
