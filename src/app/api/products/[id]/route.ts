import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { updateOrAddProduct, deleteProductFromStore, getCustomProducts } from "@/lib/productsStore";

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
      rating,
      reviews,
      isFeatured,
      isNew,
      images,
      diamondSpecs,
      gemstoneSpecs
    } = body;

    const currentList = getCustomProducts();
    const existing = currentList.find(p => p.id === productId || p.slug === productId);

    const updatedProduct = {
      id: productId,
      title: title || existing?.title || "Jewellery Item",
      slug: slug || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || productId.toLowerCase(),
      category: category || existing?.category || "rings",
      primaryMaterial: primaryMaterial || existing?.primaryMaterial || (diamondSpecs ? "diamond" : category === "silverware" ? "silver" : "gold"),
      navCategories: existing?.navCategories || ["all", category || "rings"],
      collection: collection || existing?.collection || "General Collection",
      description: description || existing?.description || "",
      dimensions: dimensions || existing?.dimensions || "",
      netGoldWeightGrams: Number(netGoldWeightGrams || existing?.netGoldWeightGrams || 4.5),
      grossWeightGrams: Number(grossWeightGrams || existing?.grossWeightGrams || 4.8),
      defaultKarat: defaultKarat || existing?.defaultKarat || "22K",
      defaultColor: defaultColor || existing?.defaultColor || "yellow",
      supportedKarats: existing?.supportedKarats || ["14K", "18K", "22K"],
      supportedColors: existing?.supportedColors || ["yellow", "rose", "white"],
      makingChargePercent: Number(makingChargePercent || existing?.makingChargePercent || 15),
      makingChargePerGram: Number(makingChargePerGram || existing?.makingChargePerGram || 0),
      discountPercent: Number(discountPercent || existing?.discountPercent || 0),
      huid: huid || existing?.huid || "",
      certificate: certificate || existing?.certificate || "BIS 916",
      rating: Number(rating || existing?.rating || 4.9),
      reviews: Number(reviews || existing?.reviews || 10),
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : (existing?.isFeatured ?? true),
      isNew: isNew !== undefined ? Boolean(isNew) : (existing?.isNew ?? true),
      images: images || existing?.images || { yellow: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg" },
      diamondSpecs: diamondSpecs || existing?.diamondSpecs,
      gemstoneSpecs: gemstoneSpecs || existing?.gemstoneSpecs
    };

    // 1. Always update JSON Store first (Guarantees persistence!)
    updateOrAddProduct(updatedProduct as any);

    // 2. Try MySQL DB update as secondary sync
    try {
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
          updatedProduct.title,
          updatedProduct.slug,
          updatedProduct.category,
          updatedProduct.collection,
          updatedProduct.description,
          updatedProduct.dimensions,
          updatedProduct.netGoldWeightGrams,
          updatedProduct.grossWeightGrams,
          updatedProduct.defaultKarat,
          updatedProduct.defaultColor,
          updatedProduct.makingChargePercent,
          updatedProduct.makingChargePerGram,
          updatedProduct.discountPercent,
          updatedProduct.huid,
          updatedProduct.certificate,
          updatedProduct.rating,
          updatedProduct.reviews,
          updatedProduct.isFeatured ? 1 : 0,
          updatedProduct.isNew ? 1 : 0,
          productId
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
    } catch (dbErr) {
      console.warn("MySQL DB update warning (saved to JSON store):", dbErr);
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: `Product ${productId} updated successfully!`
    });
  } catch (error: any) {
    console.error("Failed to update product:", error);
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

    // 1. Delete from JSON Store
    deleteProductFromStore(productId);

    // 2. Try MySQL DB delete
    try {
      await pool.execute(`DELETE FROM products WHERE id = ?`, [productId]);
    } catch (e) {}

    return NextResponse.json({ success: true, message: `Product ${productId} deleted successfully` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
