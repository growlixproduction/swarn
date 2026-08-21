import { NextResponse } from "next/server";
import { getCategoriesFromStore, saveCategoryToStore } from "../../../lib/jsonStore";
import pool from "../../../lib/db";

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
          circleImg: r.thumbnail_image || r.banner_image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80",
          thumbnail_image: r.thumbnail_image || r.banner_image,
          guideTitle: `${r.name} Buying & Purity Guide`,
          guideDesc: "All Swarn Mahal items come with 100% BIS 916 hallmarking and dynamic bullion price calculations."
        };
      });

      return NextResponse.json({ success: true, categories: categoriesMap, source: 'database' });
    }
  } catch (error) {
    console.warn("DB categories fetch error, using persistent store fallback:", error);
  }

  const storedCategories = getCategoriesFromStore();
  return NextResponse.json({ success: true, categories: storedCategories, source: 'file_store' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updatedStore = await saveCategoryToStore(body);

    const targetSlug = body.slug ? body.slug.trim().toLowerCase().replace(/\s+/g, '-') : (body.originalSlug || body.title.toLowerCase().replace(/\s+/g, '-'));
    const savedObj = updatedStore[targetSlug] || body;

    return NextResponse.json({
      success: true,
      message: `Category "${savedObj.title}" & Circle Image saved successfully!`,
      category: savedObj,
      categories: updatedStore
    });
  } catch (error: any) {
    console.error("POST /api/categories failed:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update category" }, { status: 500 });
  }
}
