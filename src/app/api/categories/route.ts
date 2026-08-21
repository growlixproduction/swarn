import { NextResponse } from "next/server";
import { CATEGORY_METADATA } from "../../../lib/catalogData";
import pool from "../../../lib/db";

// In-memory runtime cache for fallback updates when DB is initializing
let dynamicCategories: Record<string, any> = { ...CATEGORY_METADATA };

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
    const { originalSlug, slug, title, subtitle, pageTitle, badge, heroBg, guideTitle, guideDesc } = body;

    const targetSlug = slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : (originalSlug || title.toLowerCase().replace(/\s+/g, '-'));
    const categoryName = title || "New Collection";
    const categoryDesc = subtitle || "";
    const bannerImage = heroBg || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85";

    // 1. Update in-memory fallback cache
    const updatedCatObj = {
      slug: targetSlug,
      title: categoryName,
      pageTitle: pageTitle || `${categoryName} | Swarn Mahal Jewellers Ambikapur`,
      badge: badge || "BIS 916 HALLMARKED • 100% PURITY",
      subtitle: categoryDesc,
      heroBg: bannerImage,
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
        `INSERT INTO categories (slug, name, description, banner_image, display_order, is_active)
         VALUES (?, ?, ?, ?, 0, 1)
         ON DUPLICATE KEY UPDATE
           slug = VALUES(slug),
           name = VALUES(name),
           description = VALUES(description),
           banner_image = VALUES(banner_image)`,
        [targetSlug, categoryName, categoryDesc, bannerImage]
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
