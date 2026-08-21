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

const CategoryStories: React.FC = () => {
  const [stories, setStories] = useState<StoryItem[]>(DEFAULT_STORIES);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          const list: StoryItem[] = Object.values(data.categories).map((cat: any) => ({
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
  }, []);

  return (
    <section className="category-stories-section reveal-up">
      <div className="container">
        <div className="category-stories-track reveal-stagger">
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
      </div>
    </section>
  );
};

export default CategoryStories;
