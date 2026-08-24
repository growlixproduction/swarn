import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import pool from "../../../lib/db";

const bannersFilePath = path.join(process.cwd(), "src", "data", "page_banners.json");

function readBannersFromFile() {
  try {
    if (fs.existsSync(bannersFilePath)) {
      const data = fs.readFileSync(bannersFilePath, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading page_banners.json:", err);
  }
  return null;
}

function saveBannersToFile(data: any) {
  try {
    fs.mkdirSync(path.dirname(bannersFilePath), { recursive: true });
    fs.writeFileSync(bannersFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing page_banners.json:", err);
    return false;
  }
}

export async function GET() {
  const localData = readBannersFromFile();

  // Try DB if connected
  try {
    const [rows]: any = await pool.execute(`SELECT * FROM hero_banners WHERE is_active = 1 ORDER BY display_order ASC`);

    if (rows && rows.length > 0) {
      const heroSlides = rows.map((r: any) => ({
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

      return NextResponse.json({
        success: true,
        banners: heroSlides,
        heroSlides: heroSlides,
        pageBanners: localData?.pageBanners || {},
        showroomStory: localData?.showroomStory || {},
        source: 'database'
      });
    }
  } catch (error) {
    console.warn("DB banners fetch fallback to local file:", error);
  }

  return NextResponse.json({
    success: true,
    banners: localData?.heroSlides || [],
    heroSlides: localData?.heroSlides || [],
    pageBanners: localData?.pageBanners || {},
    showroomStory: localData?.showroomStory || {},
    source: 'file'
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { heroSlides, pageBanners, showroomStory } = body;

    const currentData = readBannersFromFile() || {};

    const updatedData = {
      heroSlides: heroSlides || currentData.heroSlides || [],
      pageBanners: pageBanners || currentData.pageBanners || {},
      showroomStory: showroomStory || currentData.showroomStory || {}
    };

    const saved = saveBannersToFile(updatedData);

    if (saved) {
      return NextResponse.json({
        success: true,
        message: "All Banners, Page Contents, and Showroom Story updated successfully!",
        data: updatedData
      });
    } else {
      return NextResponse.json({ success: false, error: "Failed to save banners data." }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update banners" }, { status: 500 });
  }
}
