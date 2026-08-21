import { NextResponse } from "next/server";
import { INITIAL_BULLION_RATES } from "../../../lib/catalogData";
import pool from "../../../lib/db";
import fs from "fs";
import path from "path";

const RATES_FILE_PATH = path.join(process.cwd(), "data", "rates.json");

function getRatesConfig() {
  try {
    if (fs.existsSync(RATES_FILE_PATH)) {
      const data = fs.readFileSync(RATES_FILE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Failed to read rates.json:", err);
  }
  return { mode: "live", manual24k: 16103, live24k: 16103, silver925: 180 };
}

function saveRatesConfig(config: any) {
  try {
    const dir = path.dirname(RATES_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(RATES_FILE_PATH, JSON.stringify(config, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write rates.json:", err);
  }
}

/**
 * Official GoldAPI.io Integration
 */
async function fetchFromOfficialGoldAPI(): Promise<{
  gold24k: number;
  gold22k: number;
  gold18k: number;
  gold14k: number;
  silver925: number;
  trend24h: string;
} | null> {
  const apiKey = process.env.GOLDAPI_KEY || "goldapi-d031c1863a6b0cdcf05b321c599d649a-io";
  try {
    const res = await fetch("https://www.goldapi.io/api/XAU/INR", {
      headers: {
        "x-access-token": apiKey,
        "Content-Type": "application/json"
      },
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.price_gram_24k) {
        const g24 = Math.round(data.price_gram_24k * 1.1368);
        const g22 = Math.round((data.price_gram_22k ? data.price_gram_22k * 1.1368 : g24 * (22 / 24)));
        const g18 = Math.round((data.price_gram_18k ? data.price_gram_18k * 1.1368 : g24 * (18 / 24)));
        const g14 = Math.round((data.price_gram_14k ? data.price_gram_14k * 1.1368 : g24 * (14 / 24)));
        const trend = data.chp ? `${data.chp > 0 ? '+' : ''}${data.chp.toFixed(2)}%` : '+0.45%';

        return {
          gold24k: g24,
          gold22k: g22,
          gold18k: g18,
          gold14k: g14,
          silver925: Math.round(g24 * 0.0113) || 180,
          trend24h: trend
        };
      }
    }
  } catch (e) {
    console.warn("GoldAPI.io fetch warning:", e);
  }
  return null;
}

export async function GET() {
  const config = getRatesConfig();

  // If Admin set Manual Mode, return manual rate
  if (config.mode === "manual" && config.manual24k > 0) {
    const g24 = Number(config.manual24k);
    const rates = {
      gold24k: g24,
      gold22k: Math.round(g24 * (22 / 24)),
      gold18k: Math.round(g24 * (18 / 24)),
      gold14k: Math.round(g24 * (14 / 24)),
      silver925: Number(config.silver925 || 180),
      trend24h: "Admin Manual Rate",
      lastUpdated: "Admin Override"
    };

    return NextResponse.json({
      success: true,
      rates,
      config,
      source: "admin_manual_override"
    });
  }

  // Live Mode: Fetch from API or DB
  let liveRates = { ...INITIAL_BULLION_RATES };
  let rateSource = 'official_goldapi_io';

  const apiRates = await fetchFromOfficialGoldAPI();
  if (apiRates) {
    liveRates = {
      ...apiRates,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } else {
    try {
      const [rows]: any = await pool.execute(`SELECT * FROM bullion_rates ORDER BY created_at DESC LIMIT 1`);
      if (rows && rows.length > 0) {
        const latest = rows[0];
        let g24 = Number(latest.gold_24k_per_gram);
        if (g24 < 15000) g24 = Math.round(g24 * 1.1368);
        liveRates = {
          gold24k: g24,
          gold22k: Math.round(g24 * (22 / 24)),
          gold18k: Math.round(g24 * (18 / 24)),
          gold14k: Math.round(g24 * (14 / 24)),
          silver925: Number(latest.silver_925_per_gram || 180),
          trend24h: latest.trend_24h || "+0.45%",
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        rateSource = 'database_cache';
      }
    } catch (e) {}
  }

  return NextResponse.json({
    success: true,
    rates: liveRates,
    config,
    source: rateSource
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config = getRatesConfig();

    const mode = body.mode || config.mode || "live";
    const manual24k = Number(body.gold24k || body.manual24k || config.manual24k || 16103);
    const sil = Number(body.silver925 || config.silver925 || 180);

    const updatedConfig = {
      mode,
      manual24k,
      live24k: config.live24k || 16103,
      silver925: sil,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    saveRatesConfig(updatedConfig);

    const active24k = mode === "manual" ? manual24k : config.live24k || 16103;
    const g22 = Math.round(active24k * (22 / 24));
    const g18 = Math.round(active24k * (18 / 24));
    const g14 = Math.round(active24k * (14 / 24));

    try {
      await pool.execute(
        `INSERT INTO bullion_rates (gold_24k_per_gram, gold_22k_per_gram, gold_18k_per_gram, gold_14k_per_gram, silver_925_per_gram, trend_24h, updated_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [active24k, g22, g18, g14, sil, mode === "manual" ? "Admin Manual Override" : "+0.45%", `Admin Panel (${mode})`]
      );
    } catch (e) {}

    return NextResponse.json({
      success: true,
      config: updatedConfig,
      rates: {
        gold24k: active24k,
        gold22k: g22,
        gold18k: g18,
        gold14k: g14,
        silver925: sil,
        trend24h: mode === "manual" ? "Admin Manual Rate" : "+0.45%",
        lastUpdated: updatedConfig.lastUpdated
      },
      message: `Rates updated successfully to ${mode.toUpperCase()} mode (24K: ₹${active24k}/g)!`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
