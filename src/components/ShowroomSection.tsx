"use client";

import React, { useState, useEffect } from "react";

const DEFAULT_STORY = {
  badge: "ESTABLISHED 2015 • AMBIKAPUR, CHHATTISGARH",
  title: "Welcome to Swarn Mahal Luxury Jewellers",
  description: "Located at Church Road, Joda Pipal, Maharaja Gali, Ambikapur, Swarn Mahal has been the benchmark of purity, trust, and transparent pricing in North Chhattisgarh for over a decade.",
  phone: "+91 99997 77740",
  feature1Title: "100% BIS 916 Hallmarked Gold",
  feature1Desc: "Every single gold ornament carries a verifiable 6-digit laser HUID stamp.",
  feature2Title: "Certified Precision Weighing & Assay",
  feature2Desc: "Zero wastage manipulation. Digital weights and karat purity tested right in front of you.",
  feature3Title: "Lowest & Fair Making Charges",
  feature3Desc: "Direct artisan pricing with transparent formula billing and zero hidden surcharges.",
  galleryImg1: "/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(10).jpeg",
  galleryTag1: "Ambikapur Main Floor",
  galleryImg2: "/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(11).jpeg",
  galleryTag2: "Live Karat Assay",
  galleryImg3: "/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(3).jpeg",
  galleryTag3: "Bridal Trousseau Lounge"
};

const ShowroomSection: React.FC = () => {
  const [story, setStory] = useState(DEFAULT_STORY);

  useEffect(() => {
    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        if (data && data.showroomStory && data.showroomStory.title) {
          setStory(data.showroomStory);
        }
      })
      .catch(err => console.warn("Failed to load showroom story:", err));
  }, []);

  return (
    <section className="showroom-story-section" id="showroom-section">
      <div className="container showroom-grid">
        {/* Left Content */}
        <div className="showroom-text-col">
          <span className="showroom-badge">{story.badge}</span>
          <h2 className="showroom-title">{story.title}</h2>
          <p className="showroom-desc">{story.description}</p>

          <ul className="showroom-features-list">
            <li className="showroom-feature-item">
              <div className="showroom-feature-icon">
                <i className="fa-solid fa-stamp"></i>
              </div>
              <div className="showroom-feature-text">
                <strong>{story.feature1Title}</strong>
                <span>{story.feature1Desc}</span>
              </div>
            </li>
            <li className="showroom-feature-item">
              <div className="showroom-feature-icon">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <div className="showroom-feature-text">
                <strong>{story.feature2Title}</strong>
                <span>{story.feature2Desc}</span>
              </div>
            </li>
            <li className="showroom-feature-item">
              <div className="showroom-feature-icon">
                <i className="fa-solid fa-hand-holding-dollar"></i>
              </div>
              <div className="showroom-feature-text">
                <strong>{story.feature3Title}</strong>
                <span>{story.feature3Desc}</span>
              </div>
            </li>
          </ul>

          <a href={`tel:${story.phone?.replace(/[^0-9+]/g, "") || "+919999777740"}`} className="btn btn-gold">
            <i className="fa-solid fa-phone"></i> Call Store: {story.phone}
          </a>
        </div>

        {/* Right Mosaic Gallery */}
        <div className="showroom-gallery-mosaic" id="showroom-mosaic">
          <div className="mosaic-img-card card-tall">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.galleryImg1 || "/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(10).jpeg"}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80";
              }}
              alt={story.galleryTag1}
            />
            <div className="mosaic-tag">{story.galleryTag1}</div>
          </div>
          <div className="mosaic-img-card card-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.galleryImg2 || "/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(11).jpeg"}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80";
              }}
              alt={story.galleryTag2}
            />
            <div className="mosaic-tag">{story.galleryTag2}</div>
          </div>
          <div className="mosaic-img-card card-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.galleryImg3 || "/asset/WhatsApp%20Image%202026-08-13%20at%2012.17.43%20PM%20(3).jpeg"}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80";
              }}
              alt={story.galleryTag3}
            />
            <div className="mosaic-tag">{story.galleryTag3}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowroomSection;
