import { NextResponse } from "next/server";
import { PRODUCTS_CATALOG } from "../../../lib/catalogData";
import pool from "../../../lib/db";
import { getCustomProducts, updateOrAddProduct, saveCustomProducts } from "../../../lib/productsStore";
import { getCategoriesFromStore, saveCategoryToStore } from "../../../lib/jsonStore";

export async function GET() {
  const fileProducts = getCustomProducts();
  return NextResponse.json({ success: true, products: fileProducts, source: 'file_store' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Reorder Action
    if (body.action === "reorder" && Array.isArray(body.products)) {
      saveCustomProducts(body.products);
      return NextResponse.json({ success: true, message: "Products reordered successfully!", products: body.products });
    }
    const {
      id,
      title,
      slug,
      category,
      subCategory,
      navCategories,
      primaryMaterial,
      collection,
      description,
      dimensions,
      netGoldWeightGrams,
      grossWeightGrams,
      defaultKarat,
      defaultColor,
      makingChargePercent,
      makingChargePerGram,
      discountPercent,
      huid,
      certificate,
      images,
      diamondSpecs
    } = body;

    const productId = id || `SM-${Math.floor(100 + Math.random() * 900)}`;
    const metalMat = primaryMaterial || (diamondSpecs ? "diamond" : category === "silverware" ? "silver" : "gold");

    const newProduct = {
      id: productId,
      title: title || "New Jewellery Product",
      slug: slug || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || productId.toLowerCase(),
      category: category || 'rings',
      subCategory: subCategory || "",
      primaryMaterial: metalMat,
      navCategories: Array.isArray(navCategories) && navCategories.length > 0 ? navCategories : ["all", metalMat, category || 'rings'],
      collection: collection || 'General Collection',
      description: description || '',
      dimensions: dimensions || '',
      netGoldWeightGrams: Number(netGoldWeightGrams || 4.5),
      grossWeightGrams: Number(grossWeightGrams || 4.8),
      defaultKarat: defaultKarat || '22K',
      supportedKarats: ["14K", "18K", "22K"],
      defaultColor: defaultColor || 'yellow',
      supportedColors: ["yellow", "rose", "white"],
      makingChargePercent: Number(makingChargePercent || 15),
      makingChargePerGram: Number(makingChargePerGram || 0),
      discountPercent: Number(discountPercent || 0),
      huid: huid || '',
      certificate: certificate || 'BIS 916',
      rating: 5.0,
      reviews: 1,
      isFeatured: true,
      isNew: true,
      images: images || { yellow: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg" },
      diamondSpecs
    };

    // Auto-sync sub-category to categories.json if set
    if (subCategory) {
      const subSlug = subCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const currentCats = getCategoriesFromStore();
      if (!currentCats[subSlug]) {
        saveCategoryToStore({
          slug: subSlug,
          parentSlug: metalMat,
          title: subCategory,
          subtitle: `Explore handcrafted ${subCategory} in pure ${metalMat.toUpperCase()} collection.`
        }).catch(err => console.warn("Failed to auto-register category:", err));
      }
    }

    // 1. Save to persistent JSON store first
    updateOrAddProduct(newProduct as any);

    // 2. Try MySQL DB insert as secondary sync
    try {
      await pool.execute(
        `INSERT INTO products (
          id, title, slug, category, collection_name, description, dimensions,
          net_gold_weight_grams, gross_weight_grams, default_karat, supported_karats,
          default_color, supported_colors, making_charge_percent, making_charge_per_gram,
          discount_percent, huid, certificate, rating, reviews_count, is_featured, is_new
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 1, 1, 1)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          net_gold_weight_grams = VALUES(net_gold_weight_grams),
          gross_weight_grams = VALUES(gross_weight_grams)`,
        [
          productId,
          newProduct.title,
          newProduct.slug,
          newProduct.category,
          newProduct.collection,
          newProduct.description,
          newProduct.dimensions,
          newProduct.netGoldWeightGrams,
          newProduct.grossWeightGrams,
          newProduct.defaultKarat,
          JSON.stringify(["14K", "18K", "22K"]),
          newProduct.defaultColor,
          JSON.stringify(["yellow", "rose", "white"]),
          newProduct.makingChargePercent,
          newProduct.makingChargePerGram,
          newProduct.discountPercent,
          newProduct.huid,
          newProduct.certificate
        ]
      );
    } catch (dbErr) {
      console.warn("MySQL DB insert warning (saved to JSON store):", dbErr);
    }

    return NextResponse.json({ success: true, message: `Product ${productId} created successfully!`, id: productId, product: newProduct });
  } catch (error: any) {
    console.error("POST product failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
