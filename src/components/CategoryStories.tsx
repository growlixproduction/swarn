"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface StoryItem {
  label: string;
  href: string;
  img: string;
}

const DEFAULT_STORIES: StoryItem[] = [
  { label: "All Jewellery", href: "/collections/all", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80" },
  { label: "Earrings & Tops", href: "/collections/earrings", img: "/uploads/1787345946257_FLOwYflNl8_20231121163028.webp" },
  { label: "Nose Pins", href: "/collections/nose-pins", img: "/uploads/1787346906675_C004610__1_1.webp" },
  { label: "Gold Hoops & Balis", href: "/collections/gold-hoops-balis", img: "/uploads/1787348208245_images.jpg" },
  { label: "Pendants", href: "/collections/pendants", img: "/uploads/1787348362518_BIIP0359P04_YAA14DIG6XXXXXXXX_ABCD00-PICS-00004-1024-35451.jpg" },
  { label: "Mangalsutra", href: "/collections/mangalsutra", img: "/uploads/1787348617000_A4700723_1.webp" },
  { label: "Chains", href: "/collections/chains", img: "/uploads/1787348725596_513220CLQAA00_1.webp" },
  { label: "Bangles", href: "/collections/bangles", img: "/uploads/1787348810380_511183VAA2A00_1.webp" },
  { label: "Necklace", href: "/collections/necklace", img: "/uploads/1787348852881_red_white.avif" },
  { label: "Bracelet", href: "/collections/bracelet", img: "/uploads/1787348950913_JT02841-1YS300_1_lar.jpg" }
];

const CategoryStories: React.FC = () => {
  const [stories, setStories] = useState<StoryItem[]>(DEFAULT_STORIES);
  const [scrollSpeed, setScrollSpeed] = useState<number>(25);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isInteractingRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load categories from API in exact Admin reordered sequence
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          const catsObj = data.categories;
          const EXCLUDED_SLUGS = ["gold", "diamond", "silver", "other"];

          // Preserve exact Admin order & respect hidden flag!
          const list: StoryItem[] = Object.values(catsObj)
            .filter((cat: any) => !cat.hidden && !EXCLUDED_SLUGS.includes(cat.slug) && !cat.slug.startsWith("silver-") && !cat.slug.startsWith("diamond-"))
            .map((cat: any) => ({
              label: cat.title || cat.name,
              href: `/collections/${cat.slug}`,
              img: cat.circleImg || cat.thumbnail_image || cat.heroBg || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80"
            }));

          if (list.length > 0) {
            setStories(list);
          }
        }
      })
      .catch(err => console.warn("Failed to load category stories from API:", err));

    // Load scroll speed setting
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && data.settings && data.settings.categoryScrollSpeed) {
          const parsed = parseInt(data.settings.categoryScrollSpeed, 10);
          if (!isNaN(parsed) && parsed > 0) {
            setScrollSpeed(parsed);
          }
        }
      })
      .catch(err => console.warn("Failed to load settings:", err));
  }, []);

  // Smooth Auto-Scroll Loop with Touch Pause & Native Drag Support
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    // Pixels per second based on scrollSpeed setting
    const pixelsPerSecond = Math.max(12, 500 / scrollSpeed);

    const step = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!isInteractingRef.current && scrollRef.current) {
        const el = scrollRef.current;
        const maxScroll = el.scrollWidth / 2;
        el.scrollLeft += pixelsPerSecond * dt;

        // Loop seamlessly when half of duplicate list is scrolled
        if (el.scrollLeft >= maxScroll) {
          el.scrollLeft -= maxScroll;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [scrollSpeed, stories]);

  const handleTouchStart = () => {
    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    // Instantly resume auto-rotation (300ms) after finger release so auto-rotate continues seamlessly!
    resumeTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 300);
  };

  const handleScroll = () => {
    if (isInteractingRef.current) {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        isInteractingRef.current = false;
      }, 350);
    }
  };

  const marqueeList = [...stories, ...stories];

  return (
    <section className="category-stories-section reveal-up" style={{ padding: "1.5rem 0 1rem" }}>
      <div className="container">
        {/* DESKTOP STATIC CENTERED ROW */}
        <div className="desktop-category-stories-track">
          {stories.map((s, idx) => (
            <Link key={idx} href={s.href} className="category-story-card">
              <div className="story-avatar-wrap category-story-ring">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.label} className="story-avatar-img category-story-img" />
              </div>
              <span className="story-label category-story-title">{s.label}</span>
            </Link>
          ))}
        </div>

        {/* MOBILE CONTINUOUS & NATIVE TOUCH SCROLLABLE TRACK */}
        <div
          className="mobile-category-stories-wrapper"
          style={{ position: "relative", overflow: "hidden" }}
        >
          {/* Gradient Edge Blurs */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "24px", background: "linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)", zIndex: 3, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "24px", background: "linear-gradient(to left, var(--bg-primary) 0%, transparent 100%)", zIndex: 3, pointerEvents: "none" }} />

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            style={{
              display: "flex",
              gap: "1.2rem",
              overflowX: "auto",
              padding: "0.5rem 0.75rem 0.85rem",
              WebkitOverflowScrolling: "touch",
              cursor: "grab"
            }}
            className="no-scrollbar"
          >
            {marqueeList.map((s, idx) => (
              <Link key={idx} href={s.href} className="category-story-card" style={{ flexShrink: 0 }}>
                <div className="story-avatar-wrap category-story-ring">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.label} className="story-avatar-img category-story-img" />
                </div>
                <span className="story-label category-story-title">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryStories;
