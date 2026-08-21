import { NextResponse } from "next/server";
import { CATEGORY_METADATA } from "../../../lib/catalogData";
import pool from "../../../lib/db";

const DEFAULT_CIRCLE_IMAGES: Record<string, string> = {
  "all": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80",
  "gold": "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
  "diamond": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80",
  "earrings": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=80",
  "daily-wear": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=200&q=80",
  "gemstone": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=200&q=80",
  "wedding": "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg",
  "gifting": "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=200&q=80",
  "under-50k": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=200&q=80"
};

// Initial in-memory runtime cache
const initialCategories: Record<string, any> = {};
Object.entries(CATEGORY_METADATA).forEach(([slug, cat]) => {
  initialCategories[slug] = {
    ...cat,
    circleImg: DEFAULT_CIRCLE_IMAGES[slug] || cat.heroBg
  };
});

let dynamicCategories: Record<string, any> = { ...initialCategories };

export async function GET() {
  try {
    const [rows]: any = await pool.execute(`SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order ASC`);

    if (rows && rows.length > 0) {
      const categoriesMap: Record<string, any> = {};
      rows.forEach((r: any) => {
        categoriesMap[r.slug] = {
          slug: r.slug,
          pageTitle: `${r.name} | Swarn Mahal Jewellers Ambikapur`,
          title: r.name,
          badge: "BIS 916 HALLMARKED • 100% PURITY",
          subtitle: r.description || "",
          heroBg: r.banner_image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
          circleImg: r.thumbnail_image || DEFAULT_CIRCLE_IMAGES[r.slug] || r.banner_image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80",
          guideTitle: `${r.name} Buying & Purity Guide`,
          guideDesc: "All Swarn Mahal items come with 100% BIS 916 hallmarking and dynamic bullion price calculations."
        };
      });

      return NextResponse.json({ success: true, categories: categoriesMap, source: 'database' });
    }
  } catch (error) {
    console.warn("DB categories fetch error, using runtime fallback:", error);
  }

  return NextResponse.json({ success: true, categories: dynamicCategories, source: 'memory_fallback' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { originalSlug, slug, title, subtitle, pageTitle, badge, heroBg, circleImg, guideTitle, guideDesc } = body;

    const targetSlug = slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : (originalSlug || title.toLowerCase().replace(/\s+/g, '-'));
    const categoryName = title || "New Collection";
    const categoryDesc = subtitle || "";
    const bannerImage = heroBg || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85";
    const thumbnailImg = circleImg || DEFAULT_CIRCLE_IMAGES[targetSlug] || bannerImage;

    // 1. Update in-memory fallback cache
    const updatedCatObj = {
      slug: targetSlug,
      title: categoryName,
      pageTitle: pageTitle || `${categoryName} | Swarn Mahal Jewellers Ambikapur`,
      badge: badge || "BIS 916 HALLMARKED • 100% PURITY",
      subtitle: categoryDesc,
      heroBg: bannerImage,
      circleImg: thumbnailImg,
      guideTitle: guideTitle || `${categoryName} Buying & Purity Guide`,
      guideDesc: guideDesc || "All Swarn Mahal items come with 100% BIS 916 hallmarking and dynamic bullion price calculations."
    };

    if (originalSlug && originalSlug !== targetSlug && dynamicCategories[originalSlug]) {
      delete dynamicCategories[originalSlug];
    }
    dynamicCategories[targetSlug] = updatedCatObj;

    // 2. Persist to MySQL Database
    try {
      await pool.execute(
        `INSERT INTO categories (slug, name, description, thumbnail_image, banner_image, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, 0, 1)
         ON DUPLICATE KEY UPDATE
           slug = VALUES(slug),
           name = VALUES(name),
           description = VALUES(description),
           thumbnail_image = VALUES(thumbnail_image),
           banner_image = VALUES(banner_image)`,
        [targetSlug, categoryName, categoryDesc, thumbnailImg, bannerImage]
      );
    } catch (dbErr: any) {
      console.warn("MySQL Category save warning:", dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: `Category "${categoryName}" updated successfully in database!`,
      category: updatedCatObj
    });
  } catch (error: any) {
    console.error("POST /api/categories failed:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update category" }, { status: 500 });
  }
}
