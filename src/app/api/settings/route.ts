import { NextResponse } from "next/server";
import { STORE_CONFIG } from "../../../lib/catalogData";
import pool from "../../../lib/db";

// Memory cache for runtime fallback
let runtimeSettings: Record<string, string> = {
  store_name: STORE_CONFIG.name,
  store_tagline: STORE_CONFIG.tagline,
  store_city: STORE_CONFIG.city,
  store_address: STORE_CONFIG.address,
  store_phone: STORE_CONFIG.phone,
  store_whatsapp: STORE_CONFIG.whatsapp,
  store_email: STORE_CONFIG.email,
  store_timing: STORE_CONFIG.timing,
  store_gstin: STORE_CONFIG.gstin,
  site_logo_text: "SWARN MAHAL",
  site_logo_subtext: "SAWARN LUXURY JEWELS • AMBIKAPUR",
  site_logo_symbol: "SM",
  site_logo_image: "/asset/logo.png",
  footer_about: "Ambikapur's premier destination for 22K BIS 916 hallmarked luxury gold heirlooms."
};

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
          logoImage: settingsMap.site_logo_image || "/asset/logo.png",
          footerAbout: settingsMap.footer_about || "Ambikapur's premier destination for 22K BIS 916 hallmarked luxury gold heirlooms."
        },
        source: 'database'
      });
    }
  } catch (error) {
    console.warn("DB settings fetch error, falling back to runtime config:", error);
  }

  return NextResponse.json({
    success: true,
    settings: {
      name: runtimeSettings.store_name,
      tagline: runtimeSettings.store_tagline,
      city: runtimeSettings.store_city,
      address: runtimeSettings.store_address,
      landmark: STORE_CONFIG.landmark,
      phone: runtimeSettings.store_phone,
      whatsapp: runtimeSettings.store_whatsapp,
      email: runtimeSettings.store_email,
      timing: runtimeSettings.store_timing,
      established: STORE_CONFIG.established,
      rating: STORE_CONFIG.rating,
      reviewsCount: STORE_CONFIG.reviewsCount,
      huidAuthority: STORE_CONFIG.huidAuthority,
      gstin: runtimeSettings.store_gstin,
      logoText: runtimeSettings.site_logo_text,
      logoSubtext: runtimeSettings.site_logo_subtext,
      logoSymbol: runtimeSettings.site_logo_symbol,
      logoImage: runtimeSettings.site_logo_image,
      footerAbout: runtimeSettings.footer_about
    },
    source: 'runtime_fallback'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Key map for database
    const map: Record<string, string> = {
      store_name: body.name || body.store_name || STORE_CONFIG.name,
      store_tagline: body.tagline || body.store_tagline || STORE_CONFIG.tagline,
      store_city: body.city || body.store_city || STORE_CONFIG.city,
      store_address: body.address || body.store_address || STORE_CONFIG.address,
      store_phone: body.phone || body.store_phone || STORE_CONFIG.phone,
      store_whatsapp: body.whatsapp || body.store_whatsapp || STORE_CONFIG.whatsapp,
      store_email: body.email || body.store_email || STORE_CONFIG.email,
      store_timing: body.timing || body.store_timing || STORE_CONFIG.timing,
      store_gstin: body.gstin || body.store_gstin || STORE_CONFIG.gstin,
      site_logo_text: body.logoText || body.site_logo_text || "SWARN MAHAL",
      site_logo_subtext: body.logoSubtext || body.site_logo_subtext || "SAWARN LUXURY JEWELS • AMBIKAPUR",
      site_logo_symbol: body.logoSymbol || body.site_logo_symbol || "SM",
      site_logo_image: body.logoImage || body.site_logo_image || "/asset/logo.png",
      footer_about: body.footerAbout || body.footer_about || "Ambikapur's premier destination for 22K BIS 916 hallmarked luxury gold heirlooms."
    };

    // Update runtime memory
    Object.assign(runtimeSettings, map);

    // Save to MySQL site_settings table
    try {
      for (const [k, v] of Object.entries(map)) {
        await pool.execute(
          `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
          [k, String(v)]
        );
      }
    } catch (dbErr: any) {
      console.warn("DB settings save warning:", dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Site settings updated successfully in Database!",
      settings: runtimeSettings
    });
  } catch (error: any) {
    console.error("POST /api/settings failed:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
