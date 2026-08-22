"use client";

import React, { useState, useEffect, useRef } from "react";

export interface UgcVideo {
  id: number | string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  customerName: string;
  badge: string;
  displayOrder?: number;
}

const DEFAULT_UGC_VIDEOS: UgcVideo[] = [
  {
    id: 1,
    title: "22K Royal Kundan Bridal Haar Showcase",
    videoUrl: "",
    thumbnailUrl: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
    customerName: "Ananya Sharma",
    badge: "Bridal Buyer • Ambikapur"
  },
  {
    id: 2,
    title: "18K Solitaire Engagement Ring In-Store Trial",
    videoUrl: "",
    thumbnailUrl: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg",
    customerName: "Priya & Rohan Soni",
    badge: "Verified Buyer • Chhattisgarh"
  },
  {
    id: 3,
    title: "Swarn Mahal Flagship Store Ambikapur Consultation",
    videoUrl: "",
    thumbnailUrl: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (3).jpeg",
    customerName: "Meena Agrawal",
    badge: "Church Road Store Visit"
  },
  {
    id: 4,
    title: "Handcrafted 22K BIS Hallmarked Jhumka Collection",
    videoUrl: "",
    thumbnailUrl: "/uploads/1787345946257_FLOwYflNl8_20231121163028.webp",
    customerName: "Sunita Agrawal",
    badge: "Google Verified Review"
  },
  {
    id: 5,
    title: "Pure 925 Silver Payal & Silverware Showcase",
    videoUrl: "",
    thumbnailUrl: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg",
    customerName: "Karan Talukdar",
    badge: "Verified Customer • Ambikapur"
  }
];

// Helper to convert YouTube / Shorts links into embeddable URLs
function getEmbedUrl(url: string): { type: "youtube" | "video"; embedUrl: string } {
  if (!url) return { type: "video", embedUrl: "" };

  // Check YouTube Shorts / YouTube video
  const shortsRegex = /(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/;
  const match = url.match(shortsRegex);

  if (match && match[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1`
    };
  }

  // Fallback to direct video file link (.mp4, etc.)
  return { type: "video", embedUrl: url };
}

export default function UgcReelsSection() {
  const [reels, setReels] = useState<UgcVideo[]>(DEFAULT_UGC_VIDEOS);
  const [activeVideo, setActiveVideo] = useState<UgcVideo | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/ugc")
      .then(res => res.json())
      .then(data => {
        if (data && data.videos && data.videos.length > 0) {
          setReels(data.videos);
        }
      })
      .catch(err => console.warn("UGC videos fetch warning:", err));
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="ugc-reels-section" style={{ background: "linear-gradient(180deg, #181412 0%, #100D0B 100%)", padding: "4.5rem 0", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(212, 168, 83, 0.15)", border: "1px solid rgba(212, 168, 83, 0.4)", padding: "0.35rem 0.85rem", borderRadius: "20px", fontSize: "0.74rem", color: "var(--gold-bright)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
              <i className="fa-brands fa-youtube" style={{ color: "#FF0000", fontSize: "0.9rem" }}></i>
              <span>CLIENT STORIES & SHORTS REELS</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "#FFFFFF", margin: "0 0 0.4rem" }}>
              Real Ambikapur Buyers in Action
            </h2>
            <p style={{ fontSize: "0.92rem", color: "rgba(255, 255, 255, 0.7)", margin: 0, maxWidth: "600px" }}>
              Watch authentic unboxings, in-store trial shorts, and client testimonials from Swarn Mahal Jewellers.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              type="button"
              onClick={() => handleScroll("left")}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              aria-label="Scroll left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <button
              type="button"
              onClick={() => handleScroll("right")}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "var(--gold-primary)",
                border: "none",
                color: "#FFFFFF",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 15px rgba(197, 168, 128, 0.4)"
              }}
              aria-label="Scroll right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Reels Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "1.25rem",
            overflowX: "auto",
            scrollBehavior: "smooth",
            paddingBottom: "1.25rem",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {reels.map(reel => (
            <div
              key={reel.id}
              onClick={() => setActiveVideo(reel)}
              style={{
                width: "240px",
                height: "410px",
                flexShrink: 0,
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(212, 168, 83, 0.3)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                cursor: "pointer",
                transition: "transform 0.3s ease, border-color 0.3s ease"
              }}
              className="ugc-reel-card"
            >
              {/* Background Thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reel.thumbnailUrl}
                alt={reel.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              {/* Dark Gradient Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.92) 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "1rem"
                }}
              >
                {/* Top Badge: Shorts / YouTube Icon */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      background: "rgba(0, 0, 0, 0.65)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "12px",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem"
                    }}
                  >
                    <i className="fa-brands fa-youtube" style={{ color: "#FF0000" }}></i> Shorts
                  </span>

                  {/* Play Button Icon */}
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.25)",
                      backdropFilter: "blur(6px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      fontSize: "0.85rem"
                    }}
                  >
                    <i className="fa-solid fa-play" style={{ marginLeft: "2px" }}></i>
                  </div>
                </div>

                {/* Bottom Title & Customer Details */}
                <div>
                  <span style={{ fontSize: "0.68rem", color: "var(--gold-bright)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.2rem" }}>
                    {reel.badge}
                  </span>
                  <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.3rem", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {reel.title}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.75)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <i className="fa-solid fa-user-check" style={{ fontSize: "0.68rem", color: "#34D399" }}></i> {reel.customerName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL-SCREEN / 9:16 VIDEO MODAL PLAYER */}
      {activeVideo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0, 0, 0, 0.92)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
          onClick={() => setActiveVideo(null)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "380px",
              height: "80vh",
              maxHeight: "680px",
              background: "#000000",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.9)",
              border: "1px solid var(--border-gold)"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                zIndex: 10,
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#FFFFFF",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Video / Iframe or Image Showcase */}
            {(() => {
              if (!activeVideo.videoUrl) {
                return (
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeVideo.thumbnailUrl}
                      alt={activeVideo.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.95) 100%)",
                        padding: "1.5rem",
                        color: "#FFFFFF"
                      }}
                    >
                      <span style={{ fontSize: "0.75rem", color: "var(--gold-bright)", fontWeight: 700, textTransform: "uppercase" }}>
                        {activeVideo.badge}
                      </span>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0.2rem 0 0.5rem" }}>
                        {activeVideo.title}
                      </h3>
                      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>
                        <i className="fa-solid fa-user-check" style={{ color: "#34D399" }}></i> {activeVideo.customerName}
                      </span>
                    </div>
                  </div>
                );
              }

              const { type, embedUrl } = getEmbedUrl(activeVideo.videoUrl);
              if (type === "youtube") {
                return (
                  <iframe
                    src={embedUrl}
                    title={activeVideo.title}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }
              return (
                <video
                  src={embedUrl}
                  controls
                  autoPlay
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
