"use client";

import React, { useState } from "react";

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Enter URL or upload image from system...",
  required = false
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || "Failed to upload image from system");
      }
    } catch (err) {
      alert("Error uploading image from system. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-form-group" style={{ marginBottom: "1rem" }}>
      <label className="admin-label">{label}</label>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {/* Text Input for URL */}
        <input
          type="text"
          className="admin-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={{ flex: 1 }}
        />

        {/* Hidden Native File Input */}
        <label
          className="btn btn-outline btn-sm"
          style={{
            whiteSpace: "nowrap",
            cursor: isUploading ? "not-allowed" : "pointer",
            background: "rgba(197, 168, 128, 0.15)",
            borderColor: "#C5A880",
            color: "#FFD700",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem"
          }}
        >
          {isUploading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i> Uploading...
            </>
          ) : (
            <>
              <i className="fa-solid fa-folder-open"></i> Choose File
            </>
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Image Thumbnail Preview */}
      {value && (
        <div
          style={{
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.4rem 0.6rem",
            background: "#110E0C",
            borderRadius: "6px",
            border: "1px solid rgba(197, 168, 128, 0.2)"
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded Preview"
            style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
          />
          <span style={{ fontSize: "0.74rem", color: "#B5ACA4", wordBreak: "break-all" }}>
            {value}
          </span>
        </div>
      )}
    </div>
  );
};
