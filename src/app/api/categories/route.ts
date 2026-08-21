import { NextResponse } from "next/server";
import { getCategoriesFromStore, saveCategoryToStore, deleteCategoryFromStore, saveCategoriesOrderToStore } from "../../../lib/jsonStore";
import pool from "../../../lib/db";

// Helper to sync JSON store categories into MySQL Database
async function syncStoreToDatabase(categoriesMap: Record<string, any>) {
  try {
    const validSlugs = Object.keys(categoriesMap);
    if (validSlugs.length === 0) return;

    // 1. Delete categories from DB that are no longer present in store
    const placeholders = validSlugs.map(() => "?").join(",");
    await pool.execute(
      `DELETE FROM categories WHERE slug NOT IN (${placeholders})`,
      validSlugs
    );

    // 2. Insert / Update all store categories in DB
    let order = 0;
    for (const cat of Object.values(categoriesMap)) {
      await pool.execute(
        `INSERT INTO categories (slug, name, description, thumbnail_image, banner_image, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE
           slug = VALUES(slug),
           name = VALUES(name),
           description = VALUES(description),
           thumbnail_image = VALUES(thumbnail_image),
           banner_image = VALUES(banner_image),
           display_order = VALUES(display_order),
           is_active = 1`,
        [
          cat.slug,
          cat.title || cat.name || cat.slug,
          cat.subtitle || "",
          cat.circleImg || cat.thumbnail_image || "",
          cat.heroBg || "",
          order++
        ]
      );
    }
  } catch (err: any) {
    console.warn("Category DB sync warning:", err.message);
  }
}

export async function GET() {
  const storedCategories = getCategoriesFromStore();

  // Async sync store categories to Hostinger MySQL Database if connected
  syncStoreToDatabase(storedCategories).catch(err =>
    console.warn("Async DB sync failed:", err)
  );

  return NextResponse.json({
    success: true,
    categories: storedCategories,
    source: "persistent_json_store"
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Reorder Action
    if (body.action === "reorder" && Array.isArray(body.categories)) {
      const updatedStore = await saveCategoriesOrderToStore(body.categories);
      await syncStoreToDatabase(updatedStore);
      return NextResponse.json({
        success: true,
        message: "Categories reordered successfully!",
        categories: updatedStore
      });
    }

    // 2. Delete Action
    if (body.action === "delete" && body.slug) {
      const updatedStore = await deleteCategoryFromStore(body.slug);
      await syncStoreToDatabase(updatedStore);
      return NextResponse.json({
        success: true,
        message: `Category /${body.slug} deleted successfully!`,
        categories: updatedStore
      });
    }

    // 3. Normal Save / Edit Category
    const updatedStore = await saveCategoryToStore(body);
    await syncStoreToDatabase(updatedStore);

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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ success: false, error: "Category slug is required" }, { status: 400 });
    }

    const updatedStore = await deleteCategoryFromStore(slug);
    await syncStoreToDatabase(updatedStore);
    return NextResponse.json({
      success: true,
      message: `Category /${slug} deleted successfully!`,
      categories: updatedStore
    });
  } catch (error: any) {
    console.error("DELETE /api/categories failed:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete category" }, { status: 500 });
  }
}
