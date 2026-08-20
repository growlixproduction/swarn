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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Edit Drawer Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load latest products from API if available
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

  // Filter products by search & category
  const filtered = productsList.filter(p => {
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.huid.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
            Manage physical weights, karat purities, making charge formulas, diamond grades, and live bullion calculations.
          </p>
        </div>

        <Link href="/admin/products/new" className="btn btn-gold btn-sm">
          <i className="fa-solid fa-plus"></i> Add New Product
        </Link>
      </div>

      <div className="admin-card">
        {/* Search & Category Filter Toolbar */}
        <div className="admin-table-toolbar">
          <div className="admin-table-search">
            <i className="fa-solid fa-magnifying-glass" style={{ color: "#C5A880" }}></i>
            <input
              type="text"
              placeholder="Search by title, SKU (e.g. SM-101), or HUID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select
              className="admin-select"
              style={{ width: "auto" }}
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="rings">Rings</option>
              <option value="necklaces">Necklaces & Rani Haar</option>
              <option value="earrings">Earrings & Jhumkas</option>
              <option value="bangles">Bangles & Kadas</option>
              <option value="bullion">Bullion & 24K Coins</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Piece & Title</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Net Gold Wt</th>
                <th>Gross Wt</th>
                <th>Making % / ₹/g</th>
                <th>Stones / Diamonds</th>
                <th>Live Invoice Price</th>
                <th>HUID Assay</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const bd = PricingEngine.calculateBreakdown(p, p.defaultKarat, bullionRates);
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images.yellow} alt={p.title} className="admin-prod-thumb" />
                        <div>
                          <strong style={{ display: "block", color: "#FFFFFF" }}>{p.title}</strong>
                          <span style={{ fontSize: "0.72rem", color: "#8C827A" }}>
                            {p.defaultKarat} • {p.collection}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td><code>{p.id}</code></td>
                    <td><span className="admin-badge admin-badge-gold">{p.category.toUpperCase()}</span></td>
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
                      <div className="admin-action-btns">
                        <Link
                          href={`/product/${p.id}`}
                          className="admin-icon-btn"
                          title="View Live Storefront PDP"
                          target="_blank"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="admin-icon-btn"
                          title="Edit Piece Specs & Database"
                          style={{ background: "rgba(197, 168, 128, 0.25)", color: "#FFD700" }}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </Link>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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

              {/* SECTION 4: DIAMOND / GEMSTONE SPECS */}
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
                      value={editingProduct.images.yellow}
                      onChange={e => handleNestedChange("images", "yellow", e.target.value)}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Hover / Lifestyle Image URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.images.hover}
                      onChange={e => handleNestedChange("images", "hover", e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Rose Gold Variant Image URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.images.rose || ""}
                      onChange={e => handleNestedChange("images", "rose", e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">White Gold Variant Image URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.images.white || ""}
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
                    value={editingProduct.description}
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
