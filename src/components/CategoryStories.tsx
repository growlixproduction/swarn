"use client";

import React, { useEffect, useState } from "react";
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

const MAIN_STORY_ORDER = [
  "all",
  "gold",
  "diamond",
  "silver",
  "rings",
  "necklace",
  "earrings",
  "nose-pins",
  "gold-hoops-balis",
  "pendants",
  "mangalsutra",
  "chains",
  "bangles",
  "bracelet"
];

const CategoryStories: React.FC = () => {
  const [stories, setStories] = useState<StoryItem[]>(DEFAULT_STORIES);
  const [scrollSpeed, setScrollSpeed] = useState<number>(25);

  useEffect(() => {
    // Load categories
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          const catsObj = data.categories;
          // Filter to only main story slugs or categories without parentSlug (or parentSlug === 'gold')
          const filteredCats = Object.values(catsObj).filter((cat: any) => {
            if (MAIN_STORY_ORDER.includes(cat.slug)) return true;
            if (!cat.parentSlug || cat.parentSlug === "" || cat.parentSlug === "gold") {
              return !cat.slug.startsWith("silver-") && !cat.slug.startsWith("diamond-");
            }
            return false;
          });

          // Sort according to MAIN_STORY_ORDER
          filteredCats.sort((a: any, b: any) => {
            const indexA = MAIN_STORY_ORDER.indexOf(a.slug);
            const indexB = MAIN_STORY_ORDER.indexOf(b.slug);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return 0;
          });

          const list: StoryItem[] = filteredCats.map((cat: any) => ({
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

  // Duplicate list to create a seamless infinite loop for mobile marquee
  const marqueeList = [...stories, ...stories];

  return (
    <section className="category-stories-section reveal-up">
      <div className="container">
        {/* DESKTOP STATIC CENTERED ROW (No Auto-Scroll on Desktop Screens) */}
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

        {/* MOBILE CONTINUOUS MARQUEE TRACK (Only Auto-Scrolls on Mobile Phones < 768px) */}
        <div className="mobile-category-stories-wrapper">
          {/* Gradient Edge Blurs */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "30px", background: "linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)", zIndex: 3, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "30px", background: "linear-gradient(to left, var(--bg-primary) 0%, transparent 100%)", zIndex: 3, pointerEvents: "none" }} />

          <div
            className="category-stories-marquee-track"
            style={{ animationDuration: `${scrollSpeed}s` }}
          >
            {marqueeList.map((s, idx) => (
              <Link key={idx} href={s.href} className="category-story-card">
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
