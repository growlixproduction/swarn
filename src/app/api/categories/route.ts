import { NextResponse } from "next/server";
import { CATEGORY_METADATA } from "../../../lib/catalogData";
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
          guideTitle: `${r.name} Buying & Purity Guide`,
          guideDesc: "All Swarn Mahal items come with 100% BIS 916 hallmarking and dynamic bullion price calculations."
        };
      });

      return NextResponse.json({ success: true, categories: categoriesMap, source: 'database' });
    }
  } catch (error) {
    console.warn("DB categories fetch error, using static fallback:", error);
  }

  return NextResponse.json({ success: true, categories: CATEGORY_METADATA, source: 'static' });
}
