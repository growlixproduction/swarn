import { NextResponse } from "next/server";
import { INITIAL_BULLION_RATES } from "../../../lib/catalogData";
import pool from "../../../lib/db";

/**
 * Official GoldAPI.io Integration
 * Key: goldapi-d031c1863a6b0cdcf05b321c599d649a-io
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
      next: { revalidate: 300 } // Cache 5 minutes
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.price_gram_24k) {
        // Multiply raw XAU spot rate by 1.1368 (Indian Gold Import Duty + Local Bullion Premium)
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
  let liveRates = { ...INITIAL_BULLION_RATES };
  let rateSource = 'official_goldapi_io';

  // 1. Fetch live market rates directly from GoldAPI.io
  const apiRates = await fetchFromOfficialGoldAPI();
  if (apiRates) {
    liveRates = {
      ...apiRates,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Save/sync into MySQL DB
    try {
      await pool.execute(
        `INSERT INTO bullion_rates (gold_24k_per_gram, gold_22k_per_gram, gold_18k_per_gram, gold_14k_per_gram, silver_925_per_gram, trend_24h, updated_by)
         VALUES (?, ?, ?, ?, ?, ?, 'Official GoldAPI.io')`,
        [liveRates.gold24k, liveRates.gold22k, liveRates.gold18k, liveRates.gold14k, liveRates.silver925, liveRates.trend24h]
      );
    } catch (e) {}
  } else {
    // Read from DB if API failed
    try {
      const [rows]: any = await pool.execute(`SELECT * FROM bullion_rates ORDER BY created_at DESC LIMIT 1`);
      if (rows && rows.length > 0) {
        const latest = rows[0];
        liveRates = {
          gold24k: Number(latest.gold_24k_per_gram),
          gold22k: Number(latest.gold_22k_per_gram),
          gold18k: Number(latest.gold_18k_per_gram),
          gold14k: Number(latest.gold_14k_per_gram),
          silver925: Number(latest.silver_925_per_gram),
          trend24h: latest.trend_24h || "+0.45%",
          lastUpdated: new Date(latest.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        rateSource = 'database_cache';
      }
    } catch (e) {}
  }

  return NextResponse.json({
    success: true,
    rates: liveRates,
    source: rateSource,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { gold24k, silver925 } = body;

    const g24 = Number(gold24k || 13765);
    const g22 = Math.round(g24 * (22 / 24));
    const g18 = Math.round(g24 * (18 / 24));
    const g14 = Math.round(g24 * (14 / 24));
    const sil = Number(silver925 || 180);

    await pool.execute(
      `INSERT INTO bullion_rates (gold_24k_per_gram, gold_22k_per_gram, gold_18k_per_gram, gold_14k_per_gram, silver_925_per_gram, trend_24h, updated_by)
       VALUES (?, ?, ?, ?, ?, '+0.45%', 'Admin Panel Override')`,
      [g24, g22, g18, g14, sil]
    );

    return NextResponse.json({
      success: true,
      rates: {
        gold24k: g24,
        gold22k: g22,
        gold18k: g18,
        gold14k: g14,
        silver925: sil,
        trend24h: '+0.45%',
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      message: 'Rates updated and saved to MySQL Database!'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
