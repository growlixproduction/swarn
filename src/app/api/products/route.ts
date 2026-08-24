import { NextResponse } from "next/server";
import { PRODUCTS_CATALOG } from "../../../lib/catalogData";
import pool from "../../../lib/db";
import { getCustomProducts, updateOrAddProduct } from "../../../lib/productsStore";
import { getCategoriesFromStore, saveCategoryToStore } from "../../../lib/jsonStore";

export async function GET() {
  // 1. First try MySQL Database
  try {
    const [rows]: any = await pool.execute(`
      SELECT 
        p.*,
        img.yellow_gold_image, img.rose_gold_image, img.white_gold_image, img.hover_image, img.gallery_images,
        ds.stone_count, ds.total_carat_weight, ds.clarity, ds.cut, ds.price_per_carat,
        gs.stone_type, gs.weight_carat, gs.price_per_carat AS gemstone_price_per_carat
      FROM products p
      LEFT JOIN product_images img ON p.id = img.product_id
      LEFT JOIN diamond_specs ds ON p.id = ds.product_id
      LEFT JOIN gemstone_specs gs ON p.id = gs.product_id
      ORDER BY p.created_at DESC
    `);

    if (rows && rows.length > 0) {
      const dbProducts = rows.map((r: any) => {
        let navCats: string[] = ["all"];
        try {
          if (r.category) navCats.push(r.category);
        } catch (e) {}

        return {
          id: r.id,
          title: r.title,
          slug: r.slug,
          category: r.category,
          primaryMaterial: r.primary_material || (r.total_carat_weight ? "diamond" : r.category === "silverware" ? "silver" : "gold"),
          navCategories: navCats,
          collection: r.collection_name || "General Collection",
          description: r.description,
          huid: r.huid,
          certificate: r.certificate,
          netGoldWeightGrams: Number(r.net_gold_weight_grams),
          grossWeightGrams: Number(r.gross_weight_grams),
          defaultKarat: r.default_karat,
          defaultColor: r.default_color,
          supportedKarats: typeof r.supported_karats === 'string' ? JSON.parse(r.supported_karats) : (r.supported_karats || [r.default_karat]),
          supportedColors: typeof r.supported_colors === 'string' ? JSON.parse(r.supported_colors) : (r.supported_colors || [r.default_color]),
          makingChargePercent: Number(r.making_charge_percent || 15),
          makingChargePerGram: Number(r.making_charge_per_gram || 0),
          discountPercent: Number(r.discount_percent || 0),
          rating: Number(r.rating || 4.9),
          reviews: Number(r.reviews_count || 12),
          isFeatured: Boolean(r.is_featured),
          isNew: Boolean(r.is_new),
          dimensions: r.dimensions,
          images: {
            yellow: r.yellow_gold_image || "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg",
            rose: r.rose_gold_image || undefined,
            white: r.white_gold_image || undefined,
            hover: r.hover_image || r.yellow_gold_image || "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
            gallery: r.gallery_images ? (typeof r.gallery_images === 'string' ? JSON.parse(r.gallery_images) : r.gallery_images) : []
          },
          diamondSpecs: r.total_carat_weight ? {
            stoneCount: r.stone_count,
            totalCaratWeight: Number(r.total_carat_weight),
            clarity: r.clarity,
            cut: r.cut,
            pricePerCarat: Number(r.price_per_carat)
          } : undefined,
          gemstoneSpecs: r.stone_type ? {
            stoneType: r.stone_type,
            weightCarat: Number(r.weight_carat),
            pricePerCarat: Number(r.gemstone_price_per_carat)
          } : undefined
        };
      });

      return NextResponse.json({ success: true, products: dbProducts, source: 'database' });
    }
  } catch (err: any) {
    console.warn("DB fetch failed, falling back to persistent JSON store:", err.message);
  }

  // 2. Fallback to persistent JSON store
  const fileProducts = getCustomProducts();
  return NextResponse.json({ success: true, products: fileProducts, source: 'file_store' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
