import { NextResponse } from "next/server";
import pool from "../../../lib/db";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "ugc_videos.json");

const DEFAULT_UGC_VIDEOS = [
  {
    id: 1,
    title: "22K Royal Kundan Bridal Haar Unboxing",
    videoUrl: "https://www.youtube.com/shorts/5k8t2-jYwDk",
    thumbnailUrl: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
    customerName: "Ananya Sharma",
    badge: "Bridal Buyer • Ambikapur",
    displayOrder: 1,
    isActive: true
  },
  {
    id: 2,
    title: "18K Solitaire Engagement Ring In-Store Trial",
    videoUrl: "https://www.youtube.com/shorts/5k8t2-jYwDk",
    thumbnailUrl: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg",
    customerName: "Priya & Rohan Soni",
    badge: "Verified Buyer • Chhattisgarh",
    displayOrder: 2,
    isActive: true
  },
  {
    id: 3,
    title: "Swarn Mahal Flagship Store Ambikapur Consultation",
    videoUrl: "https://www.youtube.com/shorts/5k8t2-jYwDk",
    thumbnailUrl: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (3).jpeg",
    customerName: "Meena Agrawal",
    badge: "Church Road Store Visit",
    displayOrder: 3,
    isActive: true
  },
  {
    id: 4,
    title: "Handcrafted 22K BIS Hallmarked Jhumka Collection",
    videoUrl: "https://www.youtube.com/shorts/5k8t2-jYwDk",
    thumbnailUrl: "/uploads/1787345946257_FLOwYflNl8_20231121163028.webp",
    customerName: "Sunita Agrawal",
    badge: "Google Verified Review",
    displayOrder: 4,
    isActive: true
  },
  {
    id: 5,
    title: "Pure 925 Silver Payal & Silverware Showcase",
    videoUrl: "https://www.youtube.com/shorts/5k8t2-jYwDk",
    thumbnailUrl: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg",
    customerName: "Karan Talukdar",
    badge: "Verified Customer • Ambikapur",
    displayOrder: 5,
    isActive: true
  }
];

function getJsonUgc() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("JSON read error for UGC videos:", err);
  }
  return DEFAULT_UGC_VIDEOS;
}

function saveJsonUgc(videos: any[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(videos, null, 2), "utf8");
  } catch (err) {
    console.warn("JSON write error for UGC videos:", err);
  }
}

export async function GET() {
  try {
    const [rows]: any = await pool.execute(
      `SELECT * FROM ugc_videos WHERE is_active = 1 ORDER BY display_order ASC, id DESC`
    );

    if (rows && rows.length > 0) {
      const videos = rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        videoUrl: r.video_url,
        thumbnailUrl: r.thumbnail_url || "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg",
        customerName: r.customer_name || "Swarn Client",
        badge: r.badge || "Verified Buyer",
        displayOrder: r.display_order || 0,
        isActive: Boolean(r.is_active)
      }));

      return NextResponse.json({ success: true, videos, source: "database" });
    }
  } catch (error) {
    console.warn("DB ugc_videos fetch warning, falling back to JSON:", error);
  }

  const jsonVideos = getJsonUgc();
  return NextResponse.json({ success: true, videos: jsonVideos, source: "json_fallback" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, title, videoUrl, thumbnailUrl, customerName, badge, displayOrder, isActive, videos } = body;

    // Handle bulk save/reorder
    if (action === "reorder" && Array.isArray(videos)) {
      saveJsonUgc(videos);
      return NextResponse.json({ success: true, videos, message: "UGC videos reordered successfully!" });
    }

    const jsonVideos = getJsonUgc();

    if (id) {
      // Edit existing
      const updated = jsonVideos.map((v: any) => {
        if (v.id === id || String(v.id) === String(id)) {
          return {
            ...v,
            title: title !== undefined ? title : v.title,
            videoUrl: videoUrl !== undefined ? videoUrl : v.videoUrl,
            thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : v.thumbnailUrl,
            customerName: customerName !== undefined ? customerName : v.customerName,
            badge: badge !== undefined ? badge : v.badge,
            displayOrder: displayOrder !== undefined ? Number(displayOrder) : v.displayOrder,
            isActive: isActive !== undefined ? Boolean(isActive) : v.isActive
          };
        }
        return v;
      });
      saveJsonUgc(updated);

      // Save to MySQL DB if connected
      try {
        await pool.execute(
          `UPDATE ugc_videos SET title = ?, video_url = ?, thumbnail_url = ?, customer_name = ?, badge = ?, display_order = ?, is_active = ? WHERE id = ?`,
          [title, videoUrl, thumbnailUrl, customerName, badge, Number(displayOrder || 0), isActive ? 1 : 0, id]
        );
      } catch (dbErr) {
        console.warn("DB update warning for ugc_videos:", dbErr);
      }

      return NextResponse.json({ success: true, video: { id, title, videoUrl, thumbnailUrl, customerName, badge }, message: "UGC Reel updated!" });
    } else {
      // Create new video reel
      const newId = Date.now();
      const newVideo = {
        id: newId,
        title: title || "Customer Short Reel",
        videoUrl: videoUrl || "https://www.youtube.com/shorts/5k8t2-jYwDk",
        thumbnailUrl: thumbnailUrl || "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg",
        customerName: customerName || "Ambikapur Client",
        badge: badge || "Verified Buyer",
        displayOrder: Number(displayOrder || jsonVideos.length + 1),
        isActive: isActive !== undefined ? Boolean(isActive) : true
      };

      const updated = [newVideo, ...jsonVideos];
      saveJsonUgc(updated);

      // Save to MySQL DB if connected
      try {
        await pool.execute(
          `INSERT INTO ugc_videos (title, video_url, thumbnail_url, customer_name, badge, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [newVideo.title, newVideo.videoUrl, newVideo.thumbnailUrl, newVideo.customerName, newVideo.badge, newVideo.displayOrder, 1]
        );
      } catch (dbErr) {
        console.warn("DB insert warning for ugc_videos:", dbErr);
      }

      return NextResponse.json({ success: true, video: newVideo, message: "New UGC Video Reel added!" });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to process request" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const jsonVideos = getJsonUgc();
    const updated = jsonVideos.filter((v: any) => String(v.id) !== String(id));
    saveJsonUgc(updated);

    try {
      await pool.execute(`DELETE FROM ugc_videos WHERE id = ?`, [id]);
    } catch (dbErr) {
      console.warn("DB delete warning for ugc_videos:", dbErr);
    }

    return NextResponse.json({ success: true, message: "UGC Reel deleted successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
