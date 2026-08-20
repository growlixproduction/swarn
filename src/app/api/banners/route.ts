import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.execute(`SELECT * FROM hero_banners WHERE is_active = 1 ORDER BY display_order ASC`);

    if (rows && rows.length > 0) {
      const banners = rows.map((r: any) => ({
        id: r.slide_code || `hero-${r.id}`,
        order: r.display_order,
        isActive: Boolean(r.is_active),
        tagBadge: r.tag_badge,
        titleMain: r.title_main,
        titleItalic: r.title_italic,
        description: r.description,
        buttonText: r.button_text,
        buttonLink: r.button_link,
        backgroundImage: r.background_image,
        overlayGradient: r.overlay_gradient || "linear-gradient(90deg, rgba(16, 12, 10, 0.94) 0%, rgba(16, 12, 10, 0.78) 45%, rgba(16, 12, 10, 0.25) 78%, transparent 100%)"
      }));

      return NextResponse.json({ success: true, banners, source: 'database' });
    }
  } catch (error) {
    console.warn("DB banners fetch error:", error);
  }

  // Default fallback banners
  return NextResponse.json({
    success: true,
    banners: [
      {
        id: "hero-slide-1",
        order: 1,
        isActive: true,
        tagBadge: "BRIDAL COUTURE 2026",
        titleMain: "ROYAL HEIRLOOMS &",
        titleItalic: "BRIDAL KUNDAN",
        description: "Intricately woven 22K gold with uncut diamonds, emeralds & pearls crafted for brides.",
        buttonText: "EXPLORE HERITAGE",
        buttonLink: "/collections/wedding",
        backgroundImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
        overlayGradient: "linear-gradient(90deg, rgba(16, 12, 10, 0.94) 0%, rgba(16, 12, 10, 0.78) 45%, rgba(16, 12, 10, 0.25) 78%, transparent 100%)"
      }
    ],
    source: 'static'
  });
}
