import { NextResponse } from "next/server";
import { PRODUCTS_CATALOG } from "../../../lib/catalogData";
import pool from "../../../lib/db";

export async function GET() {
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
  } catch (error) {
    console.warn("DB fetch failed, falling back to static catalog:", error);
  }

  // Fallback to static catalog
  return NextResponse.json({ success: true, products: PRODUCTS_CATALOG, source: 'static' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      category,
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
        title,
        slug || title.toLowerCase().replace(/\s+/g, '-'),
        category || 'rings',
        collection || 'General Collection',
        description || '',
        dimensions || '',
        Number(netGoldWeightGrams || 0),
        Number(grossWeightGrams || 0),
        defaultKarat || '22K',
        JSON.stringify(["14K", "18K", "22K"]),
        defaultColor || 'yellow',
        JSON.stringify(["yellow", "rose", "white"]),
        Number(makingChargePercent || 15),
        Number(makingChargePerGram || 0),
        Number(discountPercent || 0),
        huid || '',
        certificate || 'BIS 916'
      ]
    );

    if (images) {
      await pool.execute(
        `INSERT INTO product_images (product_id, yellow_gold_image, rose_gold_image, white_gold_image, hover_image, gallery_images)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           yellow_gold_image = VALUES(yellow_gold_image),
           rose_gold_image = VALUES(rose_gold_image),
           white_gold_image = VALUES(white_gold_image),
           hover_image = VALUES(hover_image)`,
        [
          productId,
          images.yellow || "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg",
          images.rose || null,
          images.white || null,
          images.hover || images.yellow,
          JSON.stringify([images.yellow])
        ]
      );
    }

    if (diamondSpecs && diamondSpecs.totalCaratWeight) {
      await pool.execute(
        `INSERT INTO diamond_specs (product_id, stone_count, total_carat_weight, clarity, cut, price_per_carat)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          productId,
          Number(diamondSpecs.stoneCount || 1),
          Number(diamondSpecs.totalCaratWeight || 0),
          diamondSpecs.clarity || "VVS-EF",
          diamondSpecs.cut || "Round Brilliant",
          Number(diamondSpecs.pricePerCarat || 68000)
        ]
      );
    }

    return NextResponse.json({ success: true, message: `Product ${productId} created in database!`, id: productId });
  } catch (error: any) {
    console.error("POST product failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

