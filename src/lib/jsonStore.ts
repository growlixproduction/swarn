import fs from "fs";
import path from "path";
import { CATEGORY_METADATA } from "./catalogData";
import pool from "./db";

const DATA_DIR = path.join(process.cwd(), "data");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

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

// Initialize default categories data
function getInitialCategoriesData(): Record<string, any> {
  const initial: Record<string, any> = {};
  Object.entries(CATEGORY_METADATA).forEach(([slug, cat]) => {
    initial[slug] = {
      ...cat,
      circleImg: DEFAULT_CIRCLE_IMAGES[slug] || cat.heroBg,
      thumbnail_image: DEFAULT_CIRCLE_IMAGES[slug] || cat.heroBg
    };
  });
  return initial;
}

// Read categories from JSON file (or create initial)
export function getCategoriesFromStore(): Record<string, any> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(CATEGORIES_FILE)) {
      const fileData = fs.readFileSync(CATEGORIES_FILE, "utf-8");
      const parsed = JSON.parse(fileData);
      if (parsed && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }

    // Create file with initial categories
    const initial = getInitialCategoriesData();
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  } catch (err) {
    console.warn("JSON store read error, fallback to initial:", err);
    return getInitialCategoriesData();
  }
}

// Save category to JSON file AND MySQL Database
export async function saveCategoryToStore(catData: any): Promise<Record<string, any>> {
  const { originalSlug, slug, title, subtitle, pageTitle, badge, heroBg, circleImg, thumbnail_image, guideTitle, guideDesc } = catData;

  const targetSlug = slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : (originalSlug || title.toLowerCase().replace(/\s+/g, '-'));
  const categoryName = title || "New Collection";
  const categoryDesc = subtitle || "";
  const bannerImage = heroBg || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85";
  const circleThumbnail = circleImg || thumbnail_image || DEFAULT_CIRCLE_IMAGES[targetSlug] || bannerImage;

  const updatedCatObj = {
    slug: targetSlug,
    title: categoryName,
    pageTitle: pageTitle || `${categoryName} | Swarn Mahal Jewellers Ambikapur`,
    badge: badge || "BIS 916 HALLMARKED • 100% PURITY",
    subtitle: categoryDesc,
    heroBg: bannerImage,
    circleImg: circleThumbnail,
    thumbnail_image: circleThumbnail,
    guideTitle: guideTitle || `${categoryName} Buying & Purity Guide`,
    guideDesc: guideDesc || "All Swarn Mahal items come with 100% BIS 916 hallmarking and dynamic bullion price calculations."
  };

  // 1. Update JSON file
  const currentStore = getCategoriesFromStore();
  if (originalSlug && originalSlug !== targetSlug && currentStore[originalSlug]) {
    delete currentStore[originalSlug];
  }
  currentStore[targetSlug] = updatedCatObj;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(currentStore, null, 2), "utf-8");
  } catch (fsErr) {
    console.error("Failed to write to categories JSON file:", fsErr);
  }

  // 2. Update MySQL Database if available
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
      [targetSlug, categoryName, categoryDesc, circleThumbnail, bannerImage]
    );
  } catch (dbErr: any) {
    console.warn("MySQL DB save warning (operating in persistent file mode):", dbErr.message);
  }

  return currentStore;
}
