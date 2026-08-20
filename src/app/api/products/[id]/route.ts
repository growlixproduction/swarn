import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const body = await request.json();

    const {
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
      rating,
      reviews,
      isFeatured,
      isNew,
      images,
      diamondSpecs,
      gemstoneSpecs
    } = body;

    // 1. Update Products Core Table
    await pool.execute(
      `UPDATE products SET 
        title = ?,
        slug = ?,
        category = ?,
        collection_name = ?,
        description = ?,
        dimensions = ?,
        net_gold_weight_grams = ?,
        gross_weight_grams = ?,
        default_karat = ?,
        default_color = ?,
        making_charge_percent = ?,
        making_charge_per_gram = ?,
        discount_percent = ?,
        huid = ?,
        certificate = ?,
        rating = ?,
        reviews_count = ?,
        is_featured = ?,
        is_new = ?
      WHERE id = ?`,
      [
        title || "",
        slug || title?.toLowerCase().replace(/\s+/g, '-') || productId.toLowerCase(),
        category || "rings",
        collection || "General Collection",
        description || "",
        dimensions || "",
        Number(netGoldWeightGrams || 0),
        Number(grossWeightGrams || 0),
        defaultKarat || "22K",
        defaultColor || "yellow",
        Number(makingChargePercent || 0),
        Number(makingChargePerGram || 0),
        Number(discountPercent || 0),
        huid || "",
        certificate || "BIS 916",
        Number(rating || 4.9),
        Number(reviews || 10),
        isFeatured ? 1 : 0,
        isNew ? 1 : 0,
        productId
      ]
    );

    // 2. Update Product Images Table
    if (images) {
      await pool.execute(
        `INSERT INTO product_images (product_id, yellow_gold_image, rose_gold_image, white_gold_image, hover_image, gallery_images)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           yellow_gold_image = VALUES(yellow_gold_image),
           rose_gold_image = VALUES(rose_gold_image),
           white_gold_image = VALUES(white_gold_image),
           hover_image = VALUES(hover_image),
           gallery_images = VALUES(gallery_images)`,
        [
          productId,
          images.yellow || "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg",
          images.rose || null,
          images.white || null,
          images.hover || images.yellow || "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
          JSON.stringify(images.gallery || [])
        ]
      );
    }

    // 3. Update Diamond Specs Table
    if (diamondSpecs && diamondSpecs.totalCaratWeight) {
      await pool.execute(
        `INSERT INTO diamond_specs (product_id, stone_count, total_carat_weight, clarity, cut, price_per_carat)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           stone_count = VALUES(stone_count),
           total_carat_weight = VALUES(total_carat_weight),
           clarity = VALUES(clarity),
           cut = VALUES(cut),
           price_per_carat = VALUES(price_per_carat)`,
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

    return NextResponse.json({
      success: true,
      message: `Product ${productId} updated successfully in MySQL Database!`
    });
  } catch (error: any) {
    console.error("Failed to update product in database:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    await pool.execute(`DELETE FROM products WHERE id = ?`, [productId]);
    return NextResponse.json({ success: true, message: `Product ${productId} deleted successfully` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
