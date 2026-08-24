"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PRODUCTS_CATALOG } from "@/lib/catalogData";
import { useApp } from "@/context/AppContext";
import { PricingEngine } from "@/lib/pricingEngine";
import { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const { bullionRates } = useApp();
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS_CATALOG);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMetalFilter, setSelectedMetalFilter] = useState<"all" | "gold" | "diamond" | "silver">("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Reorder Drag-and-Drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Edit Drawer Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete Modal State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load latest products from API
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data && data.products && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch(err => console.warn("Failed to load products from API", err));
  }, []);

  // Filter products by Metal, Sub-Category, and Search Term
  const filtered = productsList.filter(p => {
    // Metal Collection Filter
    let matchesMetal = true;
    if (selectedMetalFilter === "gold") {
      matchesMetal = (p.primaryMaterial === "gold" || (!p.diamondSpecs && p.category !== "silverware" && !p.id.toLowerCase().startsWith("sil"))) && p.category !== "silverware";
    } else if (selectedMetalFilter === "diamond") {
      matchesMetal = p.primaryMaterial === "diamond" || Boolean(p.diamondSpecs) || p.collection?.toLowerCase().includes("diamond") || p.id.toLowerCase().includes("dia");
    } else if (selectedMetalFilter === "silver") {
      matchesMetal = p.primaryMaterial === "silver" || p.category === "silverware" || p.category?.includes("silver") || p.id.toLowerCase().startsWith("sil");
    }

    // Sub-Category / Category Filter
    let matchesCat = true;
    if (selectedCategoryFilter !== "all") {
      matchesCat = p.category === selectedCategoryFilter || p.subCategory === selectedCategoryFilter || p.navCategories?.includes(selectedCategoryFilter);
    }

    // Search Term Filter
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.huid && p.huid.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesMetal && matchesCat && matchesSearch;
  });

  // Unique category list for dropdown
  const uniqueCategories = Array.from(
    new Set(productsList.map(p => p.category).filter(Boolean))
  );

  // Handle Drag & Drop / Directional Reordering
  const handleReorder = async (fromIdx: number, toIdx: number) => {
    if (fromIdx < 0 || fromIdx >= productsList.length || toIdx < 0 || toIdx >= productsList.length || fromIdx === toIdx) {
      return;
    }

    const updated = [...productsList];
    const [movedItem] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, movedItem);

    setProductsList(updated);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", products: updated })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: `Product sequence reordered & saved to database!` });
      }
    } catch (err) {
      console.warn("Product reorder save error:", err);
    }
  };

  // Handle Product Deletion with DB Sync
  const handleDeleteProduct = async (productId: string) => {
    if (!productId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProductsList(prev => prev.filter(p => p.id !== productId));
        setSaveMessage({ type: "success", text: `Product ${productId} deleted permanently from database and storefront!` });
        setDeletingProduct(null);
      } else {
        setSaveMessage({ type: "error", text: data.error || "Failed to delete product" });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Network error while deleting product" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Form Input Change for Editing
  const handleFormChange = (field: string, value: any) => {
    if (!editingProduct) return;
    setEditingProduct(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleNestedChange = (parent: "images" | "diamondSpecs" | "gemstoneSpecs", field: string, value: any) => {
    if (!editingProduct) return;
    setEditingProduct(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [parent]: {
          ...(prev[parent] as any),
          [field]: value
        }
      };
    });
  };

  // Save Edit Handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: `Product "${editingProduct.title}" updated successfully!` });
        
        // Update local list
        setProductsList(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));

        setTimeout(() => {
          setEditingProduct(null);
          setSaveMessage(null);
        }, 1200);
      } else {
        setSaveMessage({ type: "error", text: data.error || "Failed to update product in database" });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Network request failed" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Jewellery Inventory & Pricing Master</h1>
          <p className="admin-page-desc">
            Reorder products via drag-and-drop, filter by main metals and sub-collections, edit specs, and delete products with live database sync.
          </p>
        </div>

        <Link href="/admin/products/new" className="btn btn-gold btn-sm">
          <i className="fa-solid fa-plus"></i> Add New Product
        </Link>
      </div>

      {saveMessage && (
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderRadius: "8px",
            marginBottom: "1.25rem",
            fontSize: "0.88rem",
            fontWeight: 600,
            background: saveMessage.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: saveMessage.type === "success" ? "1px solid #10B981" : "1px solid #EF4444",
            color: saveMessage.type === "success" ? "#34D399" : "#F87171",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <i className={saveMessage.type === "success" ? "fa-solid fa-circle-check" : "fa-solid fa-triangle-exclamation"}></i>
          {saveMessage.text}
        </div>
      )}

      {/* FILTER BUTTONS & TOOLBAR SUITE */}
      <div className="admin-card" style={{ marginBottom: "1.5rem", padding: "1.25rem" }}>
        {/* Row 1: Metal Collection Filter Chips */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#C5A880", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: "0.4rem" }}>
            <i className="fa-solid fa-filter" style={{ marginRight: "0.35rem" }}></i> Main Collection:
          </span>

          <button
            type="button"
            onClick={() => setSelectedMetalFilter("all")}
            style={{
              padding: "0.45rem 0.95rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: selectedMetalFilter === "all" ? 700 : 500,
              background: selectedMetalFilter === "all" ? "linear-gradient(135deg, #C5A880 0%, #9A7B4F 100%)" : "rgba(255, 255, 255, 0.05)",
              color: selectedMetalFilter === "all" ? "#110E0C" : "#E0D7CD",
              border: selectedMetalFilter === "all" ? "1px solid #C5A880" : "1px solid rgba(197, 168, 128, 0.2)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            All Products ({productsList.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedMetalFilter("gold")}
            style={{
              padding: "0.45rem 0.95rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: selectedMetalFilter === "gold" ? 700 : 500,
              background: selectedMetalFilter === "gold" ? "linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)" : "rgba(255, 255, 255, 0.05)",
              color: selectedMetalFilter === "gold" ? "#110E0C" : "#E0D7CD",
              border: selectedMetalFilter === "gold" ? "1px solid #FFD700" : "1px solid rgba(197, 168, 128, 0.2)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            🟡 Gold Collection
          </button>

          <button
            type="button"
            onClick={() => setSelectedMetalFilter("diamond")}
            style={{
              padding: "0.45rem 0.95rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: selectedMetalFilter === "diamond" ? 700 : 500,
              background: selectedMetalFilter === "diamond" ? "linear-gradient(135deg, #E0E7FF 0%, #818CF8 100%)" : "rgba(255, 255, 255, 0.05)",
              color: selectedMetalFilter === "diamond" ? "#110E0C" : "#E0D7CD",
              border: selectedMetalFilter === "diamond" ? "1px solid #818CF8" : "1px solid rgba(197, 168, 128, 0.2)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            💎 Diamond Collection
          </button>

          <button
            type="button"
            onClick={() => setSelectedMetalFilter("silver")}
            style={{
              padding: "0.45rem 0.95rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: selectedMetalFilter === "silver" ? 700 : 500,
              background: selectedMetalFilter === "silver" ? "linear-gradient(135deg, #F3F4F6 0%, #9CA3AF 100%)" : "rgba(255, 255, 255, 0.05)",
              color: selectedMetalFilter === "silver" ? "#110E0C" : "#E0D7CD",
              border: selectedMetalFilter === "silver" ? "1px solid #9CA3AF" : "1px solid rgba(197, 168, 128, 0.2)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            ⚪ Silver Collection
          </button>
        </div>

        {/* Row 2: Search & Sub-Collection Select */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div className="admin-table-search" style={{ flexGrow: 1, margin: 0 }}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: "#C5A880" }}></i>
            <input
              type="text"
              placeholder="Search product title, SKU (e.g. SM-101), or HUID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#A3978B", fontWeight: 600 }}>Category:</span>
            <select
              className="admin-select"
              style={{ width: "auto", background: "#16120F", color: "#F3E5AB", borderColor: "#C5A880" }}
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="all">All Sub-Collections</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
          <span style={{ fontSize: "0.82rem", color: "#A3978B" }}>
            Showing <strong>{filtered.length}</strong> of {productsList.length} products • <span style={{ color: "#C5A880" }}>Drag row to reorder display sequence</span>
          </span>
        </div>

        {/* Inventory Table with Drag Reorder */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>Order</th>
                <th>Piece & Title</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Net Gold Wt</th>
                <th>Gross Wt</th>
                <th>Making % / ₹/g</th>
                <th>Stones / Diamonds</th>
                <th>Live Invoice Price</th>
                <th>HUID Assay</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, displayIndex) => {
                const actualIndex = productsList.findIndex(item => item.id === p.id);
                const bd = PricingEngine.calculateBreakdown(p, p.defaultKarat, bullionRates);
                return (
                  <tr
                    key={p.id}
                    draggable={true}
                    onDragStart={() => setDraggedIdx(actualIndex)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedIdx !== null && draggedIdx !== actualIndex) {
                        handleReorder(draggedIdx, actualIndex);
                        setDraggedIdx(null);
                      }
                    }}
                    style={{
                      background: draggedIdx === actualIndex ? "rgba(197, 168, 128, 0.2)" : "transparent",
                      cursor: "grab"
                    }}
                  >
                    {/* Drag Grip & Directional Arrows */}
                    <td style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                        <i
                          className="fa-solid fa-grip-vertical"
                          style={{ color: "#8C827A", cursor: "grab", fontSize: "0.85rem" }}
                          title="Drag row up/down to reorder"
                        ></i>
                        <div style={{ display: "flex", gap: "2px" }}>
                          <button
                            type="button"
                            disabled={actualIndex === 0}
                            onClick={() => handleReorder(actualIndex, actualIndex - 1)}
                            style={{ background: "none", border: "none", color: actualIndex === 0 ? "#444" : "#C5A880", cursor: actualIndex === 0 ? "not-allowed" : "pointer", fontSize: "0.65rem" }}
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={actualIndex === productsList.length - 1}
                            onClick={() => handleReorder(actualIndex, actualIndex + 1)}
                            style={{ background: "none", border: "none", color: actualIndex === productsList.length - 1 ? "#444" : "#C5A880", cursor: actualIndex === productsList.length - 1 ? "not-allowed" : "pointer", fontSize: "0.65rem" }}
                            title="Move Down"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images?.yellow || "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg"} alt={p.title} className="admin-prod-thumb" />
                        <div>
                          <strong style={{ display: "block", color: "#FFFFFF" }}>{p.title}</strong>
                          <span style={{ fontSize: "0.72rem", color: "#8C827A" }}>
                            {p.defaultKarat} • {p.collection}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td><code>{p.id}</code></td>
                    <td>
                      <span className="admin-badge admin-badge-gold">
                        {p.category ? p.category.toUpperCase() : "GENERAL"}
                      </span>
                    </td>
                    <td>{p.netGoldWeightGrams} g</td>
                    <td>{p.grossWeightGrams} g</td>
                    <td>
                      <span style={{ color: "#DFCAAB" }}>
                        {p.makingChargePercent ? `${p.makingChargePercent}%` : `₹${p.makingChargePerGram}/g`}
                      </span>
                      {p.discountPercent ? (
                        <span style={{ fontSize: "0.68rem", color: "#10B981", display: "block" }}>
                          (-{p.discountPercent}% OFF)
                        </span>
                      ) : null}
                    </td>
                    <td>
                      {p.diamondSpecs ? (
                        <span style={{ fontSize: "0.74rem", color: "#E0E7FF" }}>
                          {p.diamondSpecs.totalCaratWeight} ct ({p.diamondSpecs.clarity})
                        </span>
                      ) : p.gemstoneSpecs ? (
                        <span style={{ fontSize: "0.74rem", color: "#A7F3D0" }}>
                          {p.gemstoneSpecs.stoneType} ({p.gemstoneSpecs.weightCarat} ct)
                        </span>
                      ) : (
                        <span style={{ color: "#8C827A", fontSize: "0.72rem" }}>Pure Gold</span>
                      )}
                    </td>
                    <td>
                      <strong style={{ color: "#C5A880", fontSize: "0.92rem" }}>
                        {PricingEngine.formatINR(bd.finalPrice)}
                      </strong>
                    </td>
                    <td><code style={{ fontSize: "0.74rem" }}>{p.huid}</code></td>
                    <td>
                      <div className="admin-action-btns" style={{ justifyContent: "flex-end" }}>
                        {/* View Button */}
                        <Link
                          href={`/product/${p.id}`}
                          className="admin-icon-btn"
                          title="View Live Storefront PDP"
                          target="_blank"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </Link>

                        {/* Edit Button */}
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="admin-icon-btn"
                          title="Edit Piece Specs & Database"
                          style={{ background: "rgba(197, 168, 128, 0.25)", color: "#FFD700" }}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </Link>

                        {/* Delete Button */}
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Delete Product Permanently"
                          onClick={() => setDeletingProduct(p)}
                          style={{ background: "rgba(239, 68, 68, 0.2)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.4)", cursor: "pointer" }}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="admin-modal-backdrop" onClick={() => setDeletingProduct(null)}>
          <div
            className="admin-card"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "460px",
              margin: "auto",
              background: "#16120F",
              border: "1px solid #EF4444",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              padding: "1.75rem",
              textAlign: "center"
            }}
          >
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.15)", border: "1.5px solid #EF4444", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.5rem" }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>

            <h2 style={{ fontSize: "1.2rem", color: "#FFFFFF", fontFamily: "var(--font-serif)", marginBottom: "0.5rem" }}>
              Delete Product Permanently?
            </h2>

            <p style={{ fontSize: "0.85rem", color: "#A3978B", marginBottom: "1.25rem" }}>
              Are you sure you want to delete <strong style={{ color: "#FFFFFF" }}>"{deletingProduct.title}"</strong> (SKU: <code>{deletingProduct.id}</code>)?
              <br />
              <span style={{ fontSize: "0.78rem", color: "#EF4444", display: "block", marginTop: "0.4rem" }}>
                This will delete the item from MySQL Database and Storefront.
              </span>
            </p>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-sm"
                onClick={() => handleDeleteProduct(deletingProduct.id)}
                disabled={isDeleting}
                style={{ background: "#EF4444", color: "#FFFFFF", border: "none" }}
              >
                {isDeleting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Deleting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-trash-can"></i> Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT SLIDE-OVER DRAWER MODAL */}
      {editingProduct && (
        <div className="admin-modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="admin-edit-drawer" onClick={e => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <div>
                <span className="admin-badge admin-badge-gold">SKU: {editingProduct.id}</span>
                <h2 style={{ fontSize: "1.25rem", color: "#FFFFFF", marginTop: "0.35rem" }}>
                  Edit Product: {editingProduct.title}
                </h2>
              </div>
              <button
                type="button"
                className="admin-close-btn"
                onClick={() => setEditingProduct(null)}
              >
                &times;
              </button>
            </div>

            {saveMessage && (
              <div
                style={{
                  padding: "0.85rem 1.25rem",
                  margin: "1rem 1.5rem 0",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  background: saveMessage.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                  border: `1px solid ${saveMessage.type === "success" ? "#10B981" : "#EF4444"}`,
                  color: saveMessage.type === "success" ? "#A7F3D0" : "#FCA5A5"
                }}
              >
                <i className={`fa-solid ${saveMessage.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} style={{ marginRight: "0.5rem" }}></i>
                {saveMessage.text}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="admin-drawer-body">
              {/* SECTION 1: CORE DETAILS */}
              <div className="admin-form-section">
                <h3 className="admin-form-sec-title"><i className="fa-solid fa-gem"></i> Basic Details</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Product Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.title}
                      onChange={e => handleFormChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Category</label>
                    <select
                      className="admin-select"
                      value={editingProduct.category}
                      onChange={e => handleFormChange("category", e.target.value)}
                    >
                      <option value="rings">Rings</option>
                      <option value="necklaces">Necklaces & Rani Haar</option>
                      <option value="earrings">Earrings & Jhumkas</option>
                      <option value="bangles">Bangles & Kadas</option>
                      <option value="bullion">Bullion & Coins</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Collection Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.collection || ""}
                      onChange={e => handleFormChange("collection", e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">BIS 6-Digit HUID Code</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.huid}
                      onChange={e => handleFormChange("huid", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: WEIGHTS & KARAT PURITY */}
              <div className="admin-form-section">
                <h3 className="admin-form-sec-title"><i className="fa-solid fa-scale-balanced"></i> Weights & Purities</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Net Gold Weight (g)</label>
                    <input
                      type="number"
                      step="0.001"
                      className="admin-input"
                      value={editingProduct.netGoldWeightGrams}
                      onChange={e => handleFormChange("netGoldWeightGrams", parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Gross Weight (g)</label>
                    <input
                      type="number"
                      step="0.001"
                      className="admin-input"
                      value={editingProduct.grossWeightGrams}
                      onChange={e => handleFormChange("grossWeightGrams", parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Default Karat Purity</label>
                    <select
                      className="admin-select"
                      value={editingProduct.defaultKarat}
                      onChange={e => handleFormChange("defaultKarat", e.target.value)}
                    >
                      <option value="24K">24K (999 Pure)</option>
                      <option value="22K">22K (916 Hallmark)</option>
                      <option value="18K">18K (750 Diamond)</option>
                      <option value="14K">14K (585 Luxe)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Default Metal Color</label>
                    <select
                      className="admin-select"
                      value={editingProduct.defaultColor}
                      onChange={e => handleFormChange("defaultColor", e.target.value)}
                    >
                      <option value="yellow">Yellow Gold</option>
                      <option value="rose">Rose Gold</option>
                      <option value="white">White Gold</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: MAKING CHARGES & DISCOUNTS */}
              <div className="admin-form-section">
                <h3 className="admin-form-sec-title"><i className="fa-solid fa-percent"></i> Making Charges & Discounts</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Making Charge (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="admin-input"
                      value={editingProduct.makingChargePercent || 0}
                      onChange={e => handleFormChange("makingChargePercent", parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Making Charge (₹/g)</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={editingProduct.makingChargePerGram || 0}
                      onChange={e => handleFormChange("makingChargePerGram", parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Festive Discount (% OFF on Making)</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={editingProduct.discountPercent || 0}
                      onChange={e => handleFormChange("discountPercent", parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Assay Certificate Code</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.certificate}
                      onChange={e => handleFormChange("certificate", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: DIAMOND SPECS */}
              {editingProduct.diamondSpecs && (
                <div className="admin-form-section">
                  <h3 className="admin-form-sec-title"><i className="fa-solid fa-diamond"></i> Diamond Specifications</h3>
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label className="admin-label">Total Carat Weight (ct)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="admin-input"
                        value={editingProduct.diamondSpecs.totalCaratWeight}
                        onChange={e => handleNestedChange("diamondSpecs", "totalCaratWeight", parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Clarity</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={editingProduct.diamondSpecs.clarity}
                        onChange={e => handleNestedChange("diamondSpecs", "clarity", e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Cut</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={editingProduct.diamondSpecs.cut}
                        onChange={e => handleNestedChange("diamondSpecs", "cut", e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Price Per Carat (₹/ct)</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={editingProduct.diamondSpecs.pricePerCarat}
                        onChange={e => handleNestedChange("diamondSpecs", "pricePerCarat", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: MULTI-TONE IMAGES */}
              <div className="admin-form-section">
                <h3 className="admin-form-sec-title"><i className="fa-solid fa-image"></i> Product Image URLs</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Yellow Gold Main Image URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.images?.yellow || ""}
                      onChange={e => handleNestedChange("images", "yellow", e.target.value)}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Hover / Lifestyle Image URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.images?.hover || ""}
                      onChange={e => handleNestedChange("images", "hover", e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Rose Gold Variant Image URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.images?.rose || ""}
                      onChange={e => handleNestedChange("images", "rose", e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">White Gold Variant Image URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.images?.white || ""}
                      onChange={e => handleNestedChange("images", "white", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 6: DESCRIPTION */}
              <div className="admin-form-section">
                <h3 className="admin-form-sec-title"><i className="fa-solid fa-align-left"></i> Description & Dimensions</h3>
                <div className="admin-form-group">
                  <label className="admin-label">PDP Description</label>
                  <textarea
                    rows={3}
                    className="admin-input"
                    value={editingProduct.description || ""}
                    onChange={e => handleFormChange("description", e.target.value)}
                  />
                </div>
              </div>

              {/* DRAWER FOOTER ACTIONS */}
              <div className="admin-drawer-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Saving to DB...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i> Save Product Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
