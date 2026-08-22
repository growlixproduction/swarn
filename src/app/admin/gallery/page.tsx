"use client";

import React, { useState, useEffect } from "react";

export interface UgcVideo {
  id: number | string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  customerName: string;
  badge: string;
  displayOrder?: number;
}

export default function AdminGalleryPage() {
  const [reels, setReels] = useState<UgcVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State for New Video Reel
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newThumbnailUrl, setNewThumbnailUrl] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newBadge, setNewBadge] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Editing State
  const [editingReel, setEditingReel] = useState<UgcVideo | null>(null);

  const fetchReels = async () => {
    try {
      const res = await fetch("/api/ugc");
      const data = await res.json();
      if (data && data.videos) {
        setReels(data.videos);
      }
    } catch (err) {
      console.warn("Failed to fetch UGC reels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleAddReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl) {
      alert("Please enter a YouTube Shorts or Video URL!");
      return;
    }

    setIsSaving(true);
    setSaveMsg(null);

    try {
      const res = await fetch("/api/ugc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle || "Customer Short Reel",
          videoUrl: newVideoUrl,
          thumbnailUrl: newThumbnailUrl || "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
          customerName: newCustomerName || "Ambikapur Client",
          badge: newBadge || "Google Verified Buyer",
          displayOrder: reels.length + 1
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMsg({ type: "success", text: "New UGC Video Reel added successfully!" });
        setIsAdding(false);
        setNewTitle("");
        setNewVideoUrl("");
        setNewThumbnailUrl("");
        setNewCustomerName("");
        setNewBadge("");
        fetchReels();
      } else {
        setSaveMsg({ type: "error", text: data.error || "Failed to add UGC reel." });
      }
    } catch (err: any) {
      setSaveMsg({ type: "error", text: err.message || "Network error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReel) return;

    setIsSaving(true);
    setSaveMsg(null);

    try {
      const res = await fetch("/api/ugc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingReel)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMsg({ type: "success", text: `Reel "${editingReel.title}" updated!` });
        setEditingReel(null);
        fetchReels();
      } else {
        setSaveMsg({ type: "error", text: data.error || "Failed to update reel." });
      }
    } catch (err: any) {
      setSaveMsg({ type: "error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteReel = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this UGC Video Reel?")) return;

    try {
      const res = await fetch(`/api/ugc?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMsg({ type: "success", text: "UGC Reel deleted successfully!" });
        fetchReels();
      } else {
        setSaveMsg({ type: "error", text: data.error || "Failed to delete reel." });
      }
    } catch (err: any) {
      setSaveMsg({ type: "error", text: err.message });
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">UGC Video Reels & YouTube Shorts Studio</h1>
          <p className="admin-page-desc">
            Manage 8-10 vertical 9:16 customer story video reels. Add direct YouTube Shorts links (`https://www.youtube.com/shorts/...`) or MP4 video files.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={() => setIsAdding(true)}
        >
          <i className="fa-solid fa-plus"></i> Add UGC Short Reel
        </button>
      </div>

      {saveMsg && (
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.88rem",
            fontWeight: 600,
            background: saveMsg.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: saveMsg.type === "success" ? "1px solid #10B981" : "1px solid #EF4444",
            color: saveMsg.type === "success" ? "#34D399" : "#F87171",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <i className={saveMsg.type === "success" ? "fa-solid fa-circle-check" : "fa-solid fa-triangle-exclamation"}></i>
          {saveMsg.text}
        </div>
      )}

      {/* SQL DATABASE QUERY INFO BOX */}
      <div
        className="admin-card"
        style={{
          background: "linear-gradient(135deg, #1C1814 0%, #120F0D 100%)",
          border: "1px solid var(--border-gold-subtle)",
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.75rem"
        }}
      >
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--gold-bright)", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i className="fa-solid fa-database"></i> MySQL Database Table Query (`ugc_videos`)
        </h3>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0 0 0.75rem" }}>
          Run this SQL query in your phpMyAdmin / MySQL database terminal to create the `ugc_videos` table:
        </p>
        <pre
          style={{
            background: "#0A0807",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "0.85rem 1rem",
            borderRadius: "8px",
            fontSize: "0.78rem",
            color: "#34D399",
            overflowX: "auto",
            margin: 0
          }}
        >
{`CREATE TABLE IF NOT EXISTS ugc_videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  video_url VARCHAR(500) DEFAULT NULL,
  thumbnail_url VARCHAR(500) DEFAULT NULL,
  customer_name VARCHAR(100) DEFAULT 'Ambikapur Client',
  badge VARCHAR(100) DEFAULT 'Google Verified Buyer',
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
        </pre>
      </div>

      {/* Add New Reel Modal */}
      {isAdding && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
        >
          <div
            className="admin-card"
            style={{
              width: "100%",
              maxWidth: "540px",
              background: "#16120F",
              border: "1px solid #C5A880",
              borderRadius: "12px",
              padding: "1.75rem"
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gold-bright)", margin: "0 0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fa-brands fa-youtube" style={{ color: "#FF0000" }}></i> Add New YouTube Shorts / Video Reel
            </h2>

            <form onSubmit={handleAddReel}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#C5A880", marginBottom: "0.35rem" }}>
                  Video Reel Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 22K Royal Bridal Kundan Haar Unboxing"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="admin-form-input"
                  style={{ width: "100%" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#C5A880", marginBottom: "0.35rem" }}>
                  YouTube Shorts / Video URL *
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/shorts/5k8t2-jYwDk or /uploads/video.mp4"
                  value={newVideoUrl}
                  onChange={e => setNewVideoUrl(e.target.value)}
                  className="admin-form-input"
                  style={{ width: "100%" }}
                  required
                />
                <span style={{ fontSize: "0.72rem", color: "#8C827A" }}>
                  Paste direct YouTube Shorts link, YouTube link, or MP4 file URL.
                </span>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#C5A880", marginBottom: "0.35rem" }}>
                  Thumbnail Cover Photo URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg"
                  value={newThumbnailUrl}
                  onChange={e => setNewThumbnailUrl(e.target.value)}
                  className="admin-form-input"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#C5A880", marginBottom: "0.35rem" }}>
                    Customer Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya Sharma"
                    value={newCustomerName}
                    onChange={e => setNewCustomerName(e.target.value)}
                    className="admin-form-input"
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#C5A880", marginBottom: "0.35rem" }}>
                    Verification Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bridal Buyer • Ambikapur"
                    value={newBadge}
                    onChange={e => setNewBadge(e.target.value)}
                    className="admin-form-input"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Add Video Reel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Reel Modal */}
      {editingReel && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
        >
          <div
            className="admin-card"
            style={{
              width: "100%",
              maxWidth: "540px",
              background: "#16120F",
              border: "1px solid #C5A880",
              borderRadius: "12px",
              padding: "1.75rem"
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gold-bright)", margin: "0 0 1.25rem" }}>
              Edit UGC Video Reel #{editingReel.id}
            </h2>

            <form onSubmit={handleUpdateReel}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#C5A880", marginBottom: "0.35rem" }}>
                  Video Reel Title
                </label>
                <input
                  type="text"
                  value={editingReel.title}
                  onChange={e => setEditingReel({ ...editingReel, title: e.target.value })}
                  className="admin-form-input"
                  style={{ width: "100%" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#C5A880", marginBottom: "0.35rem" }}>
                  YouTube Shorts / Video URL
                </label>
                <input
                  type="text"
                  value={editingReel.videoUrl}
                  onChange={e => setEditingReel({ ...editingReel, videoUrl: e.target.value })}
                  className="admin-form-input"
                  style={{ width: "100%" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#C5A880", marginBottom: "0.35rem" }}>
                  Thumbnail Cover Photo URL
                </label>
                <input
                  type="text"
                  value={editingReel.thumbnailUrl}
                  onChange={e => setEditingReel({ ...editingReel, thumbnailUrl: e.target.value })}
                  className="admin-form-input"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#C5A880", marginBottom: "0.35rem" }}>
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={editingReel.customerName}
                    onChange={e => setEditingReel({ ...editingReel, customerName: e.target.value })}
                    className="admin-form-input"
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#C5A880", marginBottom: "0.35rem" }}>
                    Verification Badge
                  </label>
                  <input
                    type="text"
                    value={editingReel.badge}
                    onChange={e => setEditingReel({ ...editingReel, badge: e.target.value })}
                    className="admin-form-input"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setEditingReel(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UGC Video Reels List Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reel Thumbnail & Title</th>
                <th>Video Link / Shorts</th>
                <th>Customer & Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading UGC Video Reels...
                  </td>
                </tr>
              ) : reels.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#8C827A" }}>
                    No UGC reels added yet. Click &quot;Add UGC Short Reel&quot; above!
                  </td>
                </tr>
              ) : (
                reels.map(reel => (
                  <tr key={reel.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={reel.thumbnailUrl}
                          alt={reel.title}
                          style={{ width: "42px", height: "64px", borderRadius: "6px", objectFit: "cover", border: "1px solid var(--border-gold)" }}
                        />
                        <div>
                          <strong style={{ color: "#FFFFFF", display: "block", fontSize: "0.9rem" }}>{reel.title}</strong>
                          <span style={{ fontSize: "0.72rem", color: "#8C827A" }}>ID: #{reel.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a
                        href={reel.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--gold-bright)", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.35rem", textDecoration: "none" }}
                      >
                        <i className="fa-brands fa-youtube" style={{ color: "#FF0000" }}></i>
                        <span style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {reel.videoUrl}
                        </span>
                        <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "0.68rem" }}></i>
                      </a>
                    </td>
                    <td>
                      <div>
                        <strong style={{ display: "block", fontSize: "0.84rem", color: "#FFFFFF" }}>{reel.customerName}</strong>
                        <span style={{ fontSize: "0.7rem", color: "#34D399" }}>{reel.badge}</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-action-btns">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Edit Reel"
                          onClick={() => setEditingReel(reel)}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Delete Reel"
                          style={{ color: "#F87171" }}
                          onClick={() => handleDeleteReel(reel.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
