import { NextResponse } from "next/server";
import { STORE_CONFIG } from "../../../lib/catalogData";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.execute(`SELECT setting_key, setting_value FROM site_settings`);

    if (rows && rows.length > 0) {
      const settingsMap: Record<string, string> = {};
      rows.forEach((r: any) => {
        settingsMap[r.setting_key] = r.setting_value;
      });

      return NextResponse.json({
        success: true,
        settings: {
          name: settingsMap.store_name || STORE_CONFIG.name,
          tagline: settingsMap.store_tagline || STORE_CONFIG.tagline,
          city: settingsMap.store_city || STORE_CONFIG.city,
          address: settingsMap.store_address || STORE_CONFIG.address,
          landmark: STORE_CONFIG.landmark,
          phone: settingsMap.store_phone || STORE_CONFIG.phone,
          whatsapp: settingsMap.store_whatsapp || STORE_CONFIG.whatsapp,
          email: settingsMap.store_email || STORE_CONFIG.email,
          timing: settingsMap.store_timing || STORE_CONFIG.timing,
          established: STORE_CONFIG.established,
          rating: STORE_CONFIG.rating,
          reviewsCount: STORE_CONFIG.reviewsCount,
          huidAuthority: STORE_CONFIG.huidAuthority,
          gstin: settingsMap.store_gstin || STORE_CONFIG.gstin,
          logoText: settingsMap.site_logo_text || "SWARN MAHAL",
          logoSubtext: settingsMap.site_logo_subtext || "SAWARN LUXURY JEWELS • AMBIKAPUR",
          logoSymbol: settingsMap.site_logo_symbol || "SM",
          logoImage: settingsMap.site_logo_image || "/asset/logo.jpg",
          footerAbout: settingsMap.footer_about || "Ambikapur's premier destination for 22K BIS 916 hallmarked luxury gold heirlooms."
        },
        source: 'database'
      });
    }
  } catch (error) {
    console.warn("DB settings fetch error, falling back to static config:", error);
  }

  return NextResponse.json({
    success: true,
    settings: {
      ...STORE_CONFIG,
      logoText: "SWARN MAHAL",
      logoSubtext: "SAWARN LUXURY JEWELS • AMBIKAPUR",
      logoSymbol: "SM",
      logoImage: "/asset/logo.jpg"
    },
    source: 'static'
  });
}
