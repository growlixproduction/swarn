"use client";

import React, { useState } from "react";
import { COLLAGE_GALLERY_DATA } from "@/lib/catalogData";

export default function AdminGalleryPage() {
  const [galleryItems] = useState(COLLAGE_GALLERY_DATA);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Showroom & 21st.dev Collage Vault Studio</h1>
          <p className="admin-page-desc">
            Manage asymmetric 12-column masonry bento tiles, showroom atmosphere photos, and assay scale verification moments.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={() => alert("Upload Photo Modal Activated.")}
        >
          <i className="fa-solid fa-cloud-arrow-up"></i> Upload Showroom Photo
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo & Title</th>
                <th>Category</th>
                <th>Grid Span Class</th>
                <th>Tag Badge</th>
                <th>Specifications / Caption</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {galleryItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.title} className="admin-prod-thumb" />
                      <div>
                        <strong style={{ display: "block", color: "#FFFFFF" }}>{item.title}</strong>
                        <span style={{ fontSize: "0.72rem", color: "#8C827A" }}>{item.id}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="admin-badge admin-badge-gold">{item.category.toUpperCase()}</span></td>
                  <td><code>{item.spanClass}</code></td>
                  <td><span className="admin-badge admin-badge-green">{item.badge}</span></td>
                  <td><span style={{ fontSize: "0.76rem", color: "#B5ACA4" }}>{item.specs}</span></td>
                  <td>
                    <div className="admin-action-btns">
                      <button
                        type="button"
                        className="admin-icon-btn"
                        title="Edit Photo"
                        onClick={() => alert(`Edit photo details for ${item.title}`)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
