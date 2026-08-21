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
  { label: "22K Gold", href: "/collections/gold", img: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg" },
  { label: "Diamond", href: "/collections/diamond", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80" },
  { label: "Earrings", href: "/collections/earrings", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=80" },
  { label: "Daily Wear", href: "/collections/daily-wear", img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=200&q=80" },
  { label: "Gemstone", href: "/collections/gemstone", img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=200&q=80" },
  { label: "Wedding", href: "/collections/wedding", img: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg" },
  { label: "Gifting & Coins", href: "/collections/gifting", img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=200&q=80" },
  { label: "Under 50K", href: "/collections/under-50k", img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=200&q=80" }
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
              <div className="story-avatar-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.label} className="story-avatar-img" />
              </div>
              <span className="story-label">{s.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryStories;
