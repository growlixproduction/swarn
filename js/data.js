/**
 * SAWARN LUXURY JEWELS - CATALOG & STORE DATA
 * Store: Swarn Mahal Jewellers, Ambikapur (Est. 2015)
 * Source: Justdial & Specification Document
 */

const STORE_CONFIG = {
  name: "Swarn Mahal Jewellers",
  tagline: "Sawarn Luxury Jewels & Heritage Bullion",
  city: "Ambikapur",
  address: "Church Road, Joda Pipal, Maharaja Gali, Ambikapur, Chhattisgarh - 497001",
  landmark: "Near Joda Pipal, Maharaja Gali",
  phone: "+91 9999P-7774 / +91 7774-241216",
  whatsapp: "+91 99997 77740",
  email: "contact@swarnmahalambikapur.com",
  timing: "Mon - Sun: 09:00 AM - 09:00 PM (Open All 7 Days)",
  established: "2015",
  rating: 5.0,
  reviewsCount: 31,
  huidAuthority: "Bureau of Indian Standards (BIS) Hallmarked",
  gstin: "22AABCJ9823Q1Z4"
};

// Live Bullion benchmark rates per gram (INR)
const INITIAL_BULLION_RATES = {
  gold24k: 15928, // Base 2026 999 Purity Rate
  gold22k: 14601, // 916 Hallmark (91.67% of 24K)
  gold18k: 11946, // 750 Hallmark (75.00% of 24K)
  gold14k: 9291,  // 585 Hallmark (58.33% of 24K)
  silver925: 180, // Fine 925 Silver per gram
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  trend24h: "+0.45%",
  isUp: true
};

// Navigation Category Metadata for Dedicated Pages
const CATEGORY_METADATA = {
  "all": {
    slug: "all",
    pageTitle: "All Luxury Jewellery | Swarn Mahal Jewellers Ambikapur",
    title: "All Jewellery Master Collection",
    badge: "COMPLETE CURATION • 24+ DESIGNS",
    subtitle: "Explore handcrafted 22K gold heirlooms, certified IGI diamond solitaires, bridal rani haars, and lightweight daily essentials.",
    heroBg: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "How to Choose Your Perfect Jewellery",
    guideDesc: "Whether investing in 24K pure bullion or purchasing bridal 22K jewellery, our BIS 916 hallmarking and dynamic formula pricing ensure complete transparency."
  },
  "gold": {
    slug: "gold",
    pageTitle: "22K BIS Hallmarked Gold Jewellery | Swarn Mahal Ambikapur",
    title: "Pure Gold Jewellery & Heirlooms",
    badge: "BIS 916 HALLMARKED • 100% PURITY",
    subtitle: "Traditional North Chhattisgarh craftsmanship in 22K yellow gold. Bridal rani haars, handcrafted kadas, solid gold chains, and pure bullion coins.",
    heroBg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "22K Gold Purity & Hallmark Guide",
    guideDesc: "22 Karat (916 purity) is the gold benchmark in India, containing 91.6% pure gold alloyed with 8.4% copper/zinc for strength and lasting heirloom beauty."
  },
  "diamond": {
    slug: "diamond",
    pageTitle: "Certified Diamond & Solitaire Jewellery | Swarn Mahal",
    title: "Diamonds & Solitaire Masterpieces",
    badge: "IGI & GIA CERTIFIED • VVS-EF / VS-GH",
    subtitle: "Dazzling solitaires and diamond-encrusted bands handcrafted in 18K and 14K gold with precision optical brilliance.",
    heroBg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "The 4Cs Diamond Buying Guide",
    guideDesc: "Learn how Cut, Clarity, Color, and Carat weight determine diamond value. Swarn Mahal provides independent IGI/GIA grading cards with every diamond ornament."
  },
  "earrings": {
    slug: "earrings",
    pageTitle: "Luxury Earrings, Jhumkas & Studs | Swarn Mahal Ambikapur",
    title: "Earrings, Jhumkas & Drops",
    badge: "HANDCRAFTED PERFECTION • 50+ STYLES",
    subtitle: "From grand 22K temple jhumkas for bridal celebrations to lightweight 18K diamond tops and sui-dhaga drops for everyday elegance.",
    heroBg: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Earrings Styling & Face Silhouette Guide",
    guideDesc: "Discover which earring shapes best complement oval, round, and heart-shaped faces, along with secure screw-back and push-plug locking mechanisms."
  },
  "daily-wear": {
    slug: "daily-wear",
    pageTitle: "Lightweight Daily Wear Jewellery | Swarn Mahal Ambikapur",
    title: "Daily Luxe & Minimalist Jewellery",
    badge: "LIGHTWEIGHT COMFORT • UNDER 10 GRAMS",
    subtitle: "Sleek, stackable, and feather-light designs engineered for modern lifestyles, office meetings, and effortless everyday sparkle.",
    heroBg: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Daily Jewellery Care & Durability Guide",
    guideDesc: "14K and 18K gold offer superior scratch resistance for daily active wear while maintaining the warm glow of genuine precious metal."
  },
  "gemstone": {
    slug: "gemstone",
    pageTitle: "Precious Gemstone Jewellery & Pearls | Swarn Mahal",
    title: "Royal Gemstone & Pearl Collections",
    badge: "NATURAL UNCUT & FACETED GEMS",
    subtitle: "Zambian emeralds, Ceylon royal blue sapphires, Burmese rubies, and South Sea pearls handset in handcrafted gold mounts.",
    heroBg: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Gemstone Purity & Astrological Selection",
    guideDesc: "Each natural gemstone is tested for authenticity and natural color saturation, bringing astrological balance and timeless regal luxury."
  },
  "wedding": {
    slug: "wedding",
    pageTitle: "Royal Bridal Jewellery & Wedding Suites | Swarn Mahal Ambikapur",
    title: "Bridal Couture & Royal Heirlooms",
    badge: "THE GRAND WEDDING EDIT 2026",
    subtitle: "Exquisite 22K bridal rani haars, kundan polki chokers, auspicious mangalsutras, and handcrafted wedding kadas for the discerning bride.",
    heroBg: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
    guideTitle: "Bridal Jewellery Planning Checklist",
    guideDesc: "Tips on coordinating necklace layering (Choker + Rani Haar), matching matha patti, and locking bullion prices ahead of the wedding muhurat."
  },
  "gifting": {
    slug: "gifting",
    pageTitle: "Luxury Jewellery Gifting & Bullion Coins | Swarn Mahal",
    title: "Luxury Gifting & 24K Gold Coins",
    badge: "ELEGANT VELVET PACKAGING • 24K 999",
    subtitle: "Celebrate life's precious milestones with 24K tamper-proof Laxmi Ganesh gold coins, romantic solitaire rings, and timeless gift boxes.",
    heroBg: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Jewellery Gifting Budget Guide",
    guideDesc: "Explore curated gift suggestions tailored by budget from under ₹10,000 to ₹1,00,000+ with complimentary personalized message cards."
  },
  "under-50k": {
    slug: "under-50k",
    pageTitle: "Fine Jewellery Under ₹50,000 | Swarn Mahal Ambikapur",
    title: "Affordable Fine Jewellery Under ₹50K",
    badge: "BUDGET LUXURY • REAL-TIME PRICE LOCK",
    subtitle: "Precious 18K and 22K gold rings, diamond pendants, delicate gold chains, and ear studs strictly curated under ₹50,000.",
    heroBg: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Maximizing Value Under ₹50K",
    guideDesc: "Discover smart design combinations such as halo solitaire settings and lightweight gold alloys that deliver maximum visual grandeur within ₹50,000."
  }
};

// Customer Reviews from Justdial verified listing
const REVIEWS_DATA = [
  {
    name: "Surendra Singh",
    rating: 5,
    date: "October 2025",
    text: "Main pehli baar is Sona ki dukaan par aaya tha aur experience bahut hi shandar raha. Yahan ke designs modern bhi hain aur traditional touch bhi hai. Rate fair hain, koi extra charge nahi, aur staff ka vyavhaar bilkul ghar jaise apnapan wala hai.",
    badge: "Verified Buyer • Ambikapur"
  },
  {
    name: "Aarti Soni",
    rating: 5,
    date: "October 2025",
    text: "Excellent jewelleries available in this showroom! Very good bridal and gold jewellery collections in Ambikapur. Highly satisfied with pure hallmark gold and transparent billing.",
    badge: "Verified Buyer • Ambikapur"
  },
  {
    name: "Roshan",
    rating: 5,
    date: "October 2025",
    text: "Best jewellery collection in Ambikapur! Designs itne unique aur classy hain ki first visit me hi dil jeet liya. The cost breakup and diamond certification gave complete peace of mind.",
    badge: "Verified Buyer • Chhattisgarh"
  },
  {
    name: "Karan Talukdar",
    rating: 5,
    date: "October 2025",
    text: "मैंने आज शॉपिंग किया जैसा समझा था उससे कहीं अच्छा स्टोर को पाया, रेट बहुत कम है दूसरे दुकानों के अपेक्षा। pure gold, accurate weight and trustworthy people.",
    badge: "Verified Buyer • Ambikapur"
  },
  {
    name: "Arpna Bhagat",
    rating: 5,
    date: "November 2025",
    text: "Excellent jewelleries and huge variety of traditional necklaces, rani haar and lightweight daily wear designs. Best experience at Swarn Mahal!",
    badge: "Verified Buyer • Ambikapur"
  },
  {
    name: "Ravi Prabhakar",
    rating: 5,
    date: "October 2025",
    text: "The latest collection and 100% genuine pure gold. Transparent making charges and courteous staff.",
    badge: "Verified Buyer • Ambikapur"
  }
];

// Rich 24+ Masterpiece Product Catalog with Dynamic Attributes
const PRODUCTS_CATALOG = [
  // --- 1. RINGS & SOLITAIRES ---
  {
    id: "SM-101",
    title: "Rubans Modern Solitaire Ring",
    collection: "Solitaire Collection",
    category: "rings",
    navCategories: ["all", "diamond", "daily-wear", "gifting"],
    isFeatured: true,
    isNew: true,
    badge: "Bestseller",
    rating: 4.9,
    reviews: 24,
    netGoldWeightGrams: 4.85,
    grossWeightGrams: 5.10,
    defaultKarat: "18K",
    supportedKarats: ["14K", "18K", "22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: 14,
    discountPercent: 15,
    diamondSpecs: {
      stoneCount: 1,
      totalCaratWeight: 0.35,
      clarity: "VVS-EF",
      cut: "Round Brilliant",
      pricePerCarat: 68000
    },
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM916A8201",
    certificate: "IGI-LG5829104",
    description: "Handcrafted 18K gold band crowned with a certified round brilliant solitaire diamond. Designed with tapered knife-edge shoulders for maximum light return.",
    dimensions: "Band Width: 2.2mm | Crown Height: 5.5mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-106",
    title: "Floral Diamond Cocktail Ring",
    collection: "Garden of Eden",
    category: "rings",
    navCategories: ["all", "diamond", "gifting"],
    isFeatured: false,
    isNew: true,
    badge: "Hot",
    rating: 4.8,
    reviews: 11,
    netGoldWeightGrams: 5.20,
    grossWeightGrams: 5.60,
    defaultKarat: "18K",
    supportedKarats: ["14K", "18K", "22K"],
    defaultColor: "rose",
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: 15,
    discountPercent: 15,
    diamondSpecs: {
      stoneCount: 19,
      totalCaratWeight: 0.52,
      clarity: "VS-GH",
      cut: "Brilliant Floral",
      pricePerCarat: 58000
    },
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM750FR520",
    certificate: "IGI-CR9210",
    description: "Blooming floral motif studded with sparkling GH clarity diamonds set in glowing rose gold. Perfectly balances celebratory volume with lightweight wearability.",
    dimensions: "Motif Diameter: 14mm | Shank: 2.0mm",
    dispatchTime: "24-48 Hours"
  },
  {
    id: "SM-109",
    title: "Eternal Diamond Pavé Eternity Band",
    collection: "Infinite Love",
    category: "rings",
    navCategories: ["all", "diamond", "daily-wear", "under-50k", "gifting"],
    isFeatured: false,
    isNew: false,
    badge: "Popular",
    rating: 4.9,
    reviews: 32,
    netGoldWeightGrams: 3.10,
    grossWeightGrams: 3.35,
    defaultKarat: "18K",
    supportedKarats: ["14K", "18K"],
    defaultColor: "white",
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: 12,
    discountPercent: 10,
    diamondSpecs: {
      stoneCount: 22,
      totalCaratWeight: 0.30,
      clarity: "VS-GH",
      cut: "Micro Pavé Round",
      pricePerCarat: 54000
    },
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM750EB310",
    certificate: "SGL-EB7490",
    description: "A continuous ribbon of micro-pavé set diamonds encircling the band in luminous white gold. Exceptional comfort fit for daily styling.",
    dimensions: "Width: 1.8mm | Thickness: 1.6mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-110",
    title: "Zambian Emerald Solitaire Halo Ring",
    collection: "Royal Gemstone",
    category: "rings",
    navCategories: ["all", "gemstone", "gifting"],
    isFeatured: true,
    isNew: true,
    badge: "Precious Gem",
    rating: 5.0,
    reviews: 14,
    netGoldWeightGrams: 4.60,
    grossWeightGrams: 5.15,
    defaultKarat: "18K",
    supportedKarats: ["18K", "22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow", "rose"],
    makingChargePercent: 15,
    discountPercent: 10,
    diamondSpecs: {
      stoneCount: 16,
      totalCaratWeight: 0.28,
      clarity: "VVS-EF",
      cut: "Round Halo",
      pricePerCarat: 65000
    },
    gemstoneSpecs: {
      stoneType: "Natural Zambian Emerald",
      weightCarat: 1.25,
      color: "Vivid Forest Green",
      setting: "Octagon Bezel Prong"
    },
    images: {
      yellow: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM750EM460",
    certificate: "GIA-GEM-89210",
    description: "An untreated certified natural Zambian emerald surrounded by a scintillating diamond halo, set in warm 18K yellow gold.",
    dimensions: "Center Stone: 7x5mm Octagon | Band: 2.1mm",
    dispatchTime: "24-48 Hours"
  },

  // --- 2. BRIDAL & GOLD NECKLACES ---
  {
    id: "SM-104",
    title: "Swarn Mahal 22K Royal Rani Haar",
    collection: "Heritage Ambikapur",
    category: "necklaces",
    navCategories: ["all", "gold", "wedding"],
    isFeatured: true,
    isNew: false,
    badge: "BIS 916",
    rating: 5.0,
    reviews: 42,
    netGoldWeightGrams: 28.50,
    grossWeightGrams: 29.20,
    defaultKarat: "22K",
    supportedKarats: ["22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow"],
    makingChargePercent: 16,
    discountPercent: 12,
    diamondSpecs: null,
    gemstoneSpecs: null,
    images: {
      yellow: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
      rose: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
      white: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
      hover: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg",
      gallery: [
        "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
        "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg",
        "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (10).jpeg"
      ]
    },
    huid: "SM916RH285",
    certificate: "BIS Hallmarked HUID 916",
    description: "Authentic 22K gold bridal Rani Haar handcrafted with heritage nakshi, intricate filigree, and floral jali medallions by Swarn Mahal master karigars in Ambikapur.",
    dimensions: "Length: 24 Inches Adjustable Dori | Center Pendant: 52mm",
    dispatchTime: "In-Store & Express Insured"
  },
  {
    id: "SM-105",
    title: "Swarn Mahal Traditional Mangalsutra",
    collection: "Sacred Vows",
    category: "necklaces",
    navCategories: ["all", "gold", "wedding", "daily-wear"],
    isFeatured: true,
    isNew: true,
    badge: "Popular",
    rating: 4.9,
    reviews: 29,
    netGoldWeightGrams: 14.80,
    grossWeightGrams: 16.50,
    defaultKarat: "22K",
    supportedKarats: ["18K", "22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow", "rose"],
    makingChargePercent: 14,
    discountPercent: 10,
    diamondSpecs: null,
    gemstoneSpecs: null,
    images: {
      yellow: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (14).jpeg",
      rose: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (14).jpeg",
      white: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (14).jpeg",
      hover: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
      gallery: [
        "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (14).jpeg",
        "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg"
      ]
    },
    huid: "SM916MS148",
    certificate: "BIS 916 Hallmarked",
    description: "Auspicious black onyx beads interwoven with 22K pure gold pendants, delicate ghungroo drops, and intricate traditional meenakari detailing.",
    dimensions: "Length: 18 Inches | Pendant Drop: 32mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-111",
    title: "Royal Kundan & Polki Bridal Choker Set",
    collection: "Maharani Trousseau",
    category: "necklaces",
    navCategories: ["all", "gold", "wedding", "gemstone"],
    isFeatured: true,
    isNew: true,
    badge: "Bridal Masterpiece",
    rating: 5.0,
    reviews: 18,
    netGoldWeightGrams: 34.20,
    grossWeightGrams: 39.80,
    defaultKarat: "22K",
    supportedKarats: ["22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow"],
    makingChargePercent: 18,
    discountPercent: 15,
    diamondSpecs: null,
    gemstoneSpecs: {
      stoneType: "Uncut Jadau Polki & Natural Emerald Beads",
      weightCarat: 12.4,
      color: "Royal Emerald & Pearl Drops",
      setting: "24K Foil Jadau Setting"
    },
    images: {
      yellow: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg",
      rose: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg",
      white: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg",
      hover: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
      gallery: [
        "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg",
        "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (10).jpeg"
      ]
    },
    huid: "SM916KC342",
    certificate: "BIS 916 Hallmark & Artisan Assay",
    description: "Opulent bridal choker handcrafted with 22K hallmarked gold, uncut polki stones, suspended emerald beads, and matching chandelier earrings.",
    dimensions: "Choker Width: 45mm | Adjustable Silk Dori",
    dispatchTime: "Express Insured 24h"
  },
  {
    id: "SM-112",
    title: "Classic 22K Daily Gold Rope Chain",
    collection: "Heritage Bullion",
    category: "necklaces",
    navCategories: ["all", "gold", "daily-wear", "gifting"],
    isFeatured: false,
    isNew: false,
    badge: "Essential",
    rating: 4.9,
    reviews: 38,
    netGoldWeightGrams: 8.50,
    grossWeightGrams: 8.50,
    defaultKarat: "22K",
    supportedKarats: ["18K", "22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow", "rose"],
    makingChargePercent: 10,
    discountPercent: 10,
    diamondSpecs: null,
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      hover: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (14).jpeg",
      gallery: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM916GC850",
    certificate: "BIS 916 Hallmark",
    description: "Solid 22K gold machine-cut rope chain with diamond-faceted links for supreme brilliance and daily durability.",
    dimensions: "Length: 20 Inches | Gauge: 2.5mm",
    dispatchTime: "Same Day Dispatch"
  },

  // --- 3. EARRINGS & JHUMKAS ---
  {
    id: "SM-107",
    title: "Chandelier Diamond Drop Earrings",
    collection: "Luminescence",
    category: "earrings",
    navCategories: ["all", "diamond", "earrings", "wedding"],
    isFeatured: false,
    isNew: false,
    badge: "Staff Pick",
    rating: 4.9,
    reviews: 19,
    netGoldWeightGrams: 6.80,
    grossWeightGrams: 7.30,
    defaultKarat: "18K",
    supportedKarats: ["14K", "18K"],
    defaultColor: "yellow",
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: 15,
    discountPercent: 15,
    diamondSpecs: {
      stoneCount: 36,
      totalCaratWeight: 0.78,
      clarity: "VVS-EF",
      cut: "Baguette & Round",
      pricePerCarat: 64000
    },
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM750DE680",
    certificate: "GIA-ER88410",
    description: "Cascading tiers of sparkling baguette and round diamonds designed for royal gala evenings and wedding celebrations.",
    dimensions: "Drop Length: 38mm | Width: 12mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-113",
    title: "Heritage 22K Royal Peacock Jhumkas",
    collection: "Heritage Ambikapur",
    category: "earrings",
    navCategories: ["all", "gold", "earrings", "wedding"],
    isFeatured: true,
    isNew: true,
    badge: "22K BIS 916",
    rating: 5.0,
    reviews: 27,
    netGoldWeightGrams: 11.20,
    grossWeightGrams: 11.80,
    defaultKarat: "22K",
    supportedKarats: ["22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow"],
    makingChargePercent: 15,
    discountPercent: 10,
    diamondSpecs: null,
    gemstoneSpecs: null,
    images: {
      yellow: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
      rose: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
      white: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
      hover: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg",
      gallery: [
        "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg"
      ]
    },
    huid: "SM916PJ112",
    certificate: "BIS 916 Hallmarked",
    description: "Intricately sculpted Mayur (Peacock) studs with dome jhumka bells and dangling micro gold bead fringes in authentic 22K yellow gold.",
    dimensions: "Length: 48mm | Bell Diameter: 18mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-114",
    title: "Solitaire Diamond Stud Earrings (0.50 tcw)",
    collection: "Solitaire Collection",
    category: "earrings",
    navCategories: ["all", "diamond", "earrings", "daily-wear", "under-50k", "gifting"],
    isFeatured: false,
    isNew: false,
    badge: "Bestseller",
    rating: 4.9,
    reviews: 45,
    netGoldWeightGrams: 2.10,
    grossWeightGrams: 2.25,
    defaultKarat: "18K",
    supportedKarats: ["14K", "18K"],
    defaultColor: "white",
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: 12,
    discountPercent: 15,
    diamondSpecs: {
      stoneCount: 2,
      totalCaratWeight: 0.50,
      clarity: "VVS-EF",
      cut: "Hearts & Arrows Round",
      pricePerCarat: 68000
    },
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM750DS210",
    certificate: "IGI-DS3910",
    description: "Four-prong basket stud earrings set with certified VVS-EF brilliant cut diamonds and threaded safety screw backs.",
    dimensions: "Stone Diameter: 4.1mm each | Post Length: 9mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-115",
    title: "Sui Dhaga Sleek Wave Drop Earrings",
    collection: "Modern Minimal",
    category: "earrings",
    navCategories: ["all", "earrings", "daily-wear", "under-50k", "gifting"],
    isFeatured: false,
    isNew: true,
    badge: "Trendy",
    rating: 4.8,
    reviews: 16,
    netGoldWeightGrams: 3.40,
    grossWeightGrams: 3.40,
    defaultKarat: "18K",
    supportedKarats: ["14K", "18K", "22K"],
    defaultColor: "rose",
    supportedColors: ["yellow", "rose"],
    makingChargePercent: 12,
    discountPercent: 10,
    diamondSpecs: null,
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM750SD340",
    certificate: "BIS 750 Hallmark",
    description: "Effortlessly chic pull-through needle threader earrings with curved wave bars that shimmer gracefully with every movement.",
    dimensions: "Chain Length: 65mm | Bar: 20mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-121",
    title: "Royal Emerald & Diamond Chandbali Earrings",
    collection: "Royal Gemstone",
    category: "earrings",
    navCategories: ["all", "gemstone", "earrings", "wedding"],
    isFeatured: true,
    isNew: true,
    badge: "Royal Couture",
    rating: 5.0,
    reviews: 22,
    netGoldWeightGrams: 9.80,
    grossWeightGrams: 11.20,
    defaultKarat: "18K",
    supportedKarats: ["18K", "22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow", "rose"],
    makingChargePercent: 16,
    discountPercent: 12,
    diamondSpecs: {
      stoneCount: 28,
      totalCaratWeight: 0.65,
      clarity: "VVS-EF",
      cut: "Round Brilliant",
      pricePerCarat: 65000
    },
    gemstoneSpecs: {
      stoneType: "Natural Emerald Drops",
      weightCarat: 3.50,
      color: "Vivid Emerald Green",
      setting: "Bezel & Prong"
    },
    images: {
      yellow: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM750CB980",
    certificate: "GIA-GEM-CB481",
    description: "Crescent moon Chandbali earrings handset with sparkling VVS diamonds and dangling teardrop emerald beads for royal wedding couture.",
    dimensions: "Length: 52mm | Width: 28mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-122",
    title: "22K Filigree Gold Hoop Balis",
    collection: "Heritage Ambikapur",
    category: "earrings",
    navCategories: ["all", "gold", "earrings", "daily-wear", "under-50k"],
    isFeatured: false,
    isNew: false,
    badge: "22K BIS 916",
    rating: 4.9,
    reviews: 34,
    netGoldWeightGrams: 4.80,
    grossWeightGrams: 4.80,
    defaultKarat: "22K",
    supportedKarats: ["18K", "22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow", "rose"],
    makingChargePercent: 12,
    discountPercent: 10,
    diamondSpecs: null,
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM916HB480",
    certificate: "BIS 916 Hallmarked",
    description: "Solid 22K yellow gold hoop balis with delicate micro-filigree floral engraving and comfortable snap-lock closure.",
    dimensions: "Diameter: 22mm | Thickness: 3.0mm",
    dispatchTime: "Same Day Dispatch"
  },

  // --- 4. BANGLES & BRACELETS ---
  {
    id: "SM-102",
    title: "Infinity Diamond Tennis Bracelet",
    collection: "Eternal Sparkle",
    category: "bangles",
    navCategories: ["all", "diamond", "daily-wear", "gifting"],
    isFeatured: true,
    isNew: false,
    badge: "Sale -20%",
    rating: 5.0,
    reviews: 18,
    netGoldWeightGrams: 9.40,
    grossWeightGrams: 10.20,
    defaultKarat: "18K",
    supportedKarats: ["14K", "18K"],
    defaultColor: "yellow",
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: 12,
    discountPercent: 20,
    diamondSpecs: {
      stoneCount: 28,
      totalCaratWeight: 0.85,
      clarity: "VS-GH",
      cut: "Round Brilliant",
      pricePerCarat: 55000
    },
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=1200&q=85",
        "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg"
      ]
    },
    huid: "SM750B9410",
    certificate: "SGL-IN892019",
    description: "An infinite loop of sparkling brilliant-cut diamonds encased in sleek gold bezels with a double-safety box clasp.",
    dimensions: "Length: 7.0 Inches | Link Width: 3.5mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-116",
    title: "Swarn Mahal 22K Handcrafted Gold Kada (Pair)",
    collection: "Heritage Ambikapur",
    category: "bangles",
    navCategories: ["all", "gold", "wedding"],
    isFeatured: true,
    isNew: false,
    badge: "22K BIS 916",
    rating: 5.0,
    reviews: 31,
    netGoldWeightGrams: 24.80,
    grossWeightGrams: 25.00,
    defaultKarat: "22K",
    supportedKarats: ["22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow"],
    makingChargePercent: 14,
    discountPercent: 12,
    diamondSpecs: null,
    gemstoneSpecs: null,
    images: {
      yellow: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg",
      rose: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg",
      white: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg",
      hover: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
      gallery: [
        "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg"
      ]
    },
    huid: "SM916KD248",
    certificate: "BIS 916 Hallmarked",
    description: "A pair of traditional solid 22K gold kadas with floral relief engraving, screw-hinge locking mechanism, and antique semi-matte polish.",
    dimensions: "Standard Size: 2-6 (2.375 inch diameter)",
    dispatchTime: "In-Store & Express Insured"
  },
  {
    id: "SM-117",
    title: "Sleek Rose Gold Evil Eye Charm Bracelet",
    collection: "Amulet Luxe",
    category: "bangles",
    navCategories: ["all", "diamond", "daily-wear", "under-50k", "gifting"],
    isFeatured: false,
    isNew: true,
    badge: "Bestseller",
    rating: 4.9,
    reviews: 22,
    netGoldWeightGrams: 3.80,
    grossWeightGrams: 4.10,
    defaultKarat: "18K",
    supportedKarats: ["14K", "18K"],
    defaultColor: "rose",
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: 12,
    discountPercent: 10,
    diamondSpecs: {
      stoneCount: 14,
      totalCaratWeight: 0.12,
      clarity: "VS-GH",
      cut: "Micro Pavé",
      pricePerCarat: 52000
    },
    gemstoneSpecs: {
      stoneType: "Natural Blue Sapphire & Mother of Pearl",
      weightCarat: 0.45,
      color: "Deep Indigo & White Shell",
      setting: "Bezel Inlay"
    },
    images: {
      yellow: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM750EE380",
    certificate: "SGL-EE2901",
    description: "Protection meets luxury in this 18K rose gold bracelet featuring a Mother-of-Pearl evil eye center framed by natural sapphires and diamonds.",
    dimensions: "Adjustable 6.5 - 7.5 Inches",
    dispatchTime: "Same Day Dispatch"
  },

  // --- 5. PENDANTS & GEMSTONES ---
  {
    id: "SM-103",
    title: "Teardrop Pear Solitaire Pendant",
    collection: "Royal Drop",
    category: "pendants",
    navCategories: ["all", "diamond", "gemstone", "daily-wear", "gifting"],
    isFeatured: true,
    isNew: true,
    badge: "New",
    rating: 4.8,
    reviews: 15,
    netGoldWeightGrams: 3.20,
    grossWeightGrams: 3.45,
    defaultKarat: "18K",
    supportedKarats: ["14K", "18K", "22K"],
    defaultColor: "rose",
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: 15,
    discountPercent: 10,
    diamondSpecs: {
      stoneCount: 12,
      totalCaratWeight: 0.42,
      clarity: "VVS-EF",
      cut: "Pear & Round",
      pricePerCarat: 62000
    },
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM916P3211",
    certificate: "IGI-PD291083",
    description: "A dazzling pear-shaped center diamond embraced by a sparkling micro-halo on a delicate 18K rose gold bale.",
    dimensions: "Pendant Length: 18mm | Width: 9mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-118",
    title: "Royal Blue Sapphire & Diamond Halo Pendant",
    collection: "Royal Gemstone",
    category: "pendants",
    navCategories: ["all", "gemstone", "diamond", "under-50k", "gifting"],
    isFeatured: true,
    isNew: false,
    badge: "Exclusive",
    rating: 5.0,
    reviews: 19,
    netGoldWeightGrams: 2.80,
    grossWeightGrams: 3.30,
    defaultKarat: "18K",
    supportedKarats: ["14K", "18K"],
    defaultColor: "white",
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: 14,
    discountPercent: 12,
    diamondSpecs: {
      stoneCount: 14,
      totalCaratWeight: 0.20,
      clarity: "VVS-EF",
      cut: "Round Brilliant Halo",
      pricePerCarat: 60000
    },
    gemstoneSpecs: {
      stoneType: "Natural Ceylon Blue Sapphire",
      weightCarat: 0.95,
      color: "Cornflower Deep Blue",
      setting: "Oval Four-Prong"
    },
    images: {
      yellow: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM750SP280",
    certificate: "GIA-SAP-49102",
    description: "An oval Ceylon royal blue sapphire surrounded by a constellation of brilliant diamonds, evoking pure royal heritage.",
    dimensions: "Pendant Length: 16mm | Width: 10mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-119",
    title: "Dainty 18K Gold Butterfly Motif Pendant",
    collection: "Modern Minimal",
    category: "pendants",
    navCategories: ["all", "daily-wear", "under-50k", "gifting"],
    isFeatured: false,
    isNew: true,
    badge: "Under 50K",
    rating: 4.8,
    reviews: 21,
    netGoldWeightGrams: 2.20,
    grossWeightGrams: 2.20,
    defaultKarat: "18K",
    supportedKarats: ["14K", "18K", "22K"],
    defaultColor: "yellow",
    supportedColors: ["yellow", "rose", "white"],
    makingChargePercent: 12,
    discountPercent: 10,
    diamondSpecs: null,
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM750BF220",
    certificate: "BIS 750 Hallmark",
    description: "Lightweight and joyful 18K gold butterfly pendant with high-shine polish wings. Perfect for layering on delicate chains.",
    dimensions: "Motif: 12x10mm",
    dispatchTime: "Same Day Dispatch"
  },

  // --- 6. BULLION COINS & INVESTMENT ---
  {
    id: "SM-108",
    title: "Pure 24K Gold Laxmi-Ganesh Coin (10g)",
    collection: "Bullion & Investment",
    category: "bullion",
    navCategories: ["all", "gold", "gifting"],
    isFeatured: true,
    isNew: false,
    badge: "999 Purity",
    rating: 5.0,
    reviews: 65,
    netGoldWeightGrams: 10.00,
    grossWeightGrams: 10.00,
    defaultKarat: "24K",
    supportedKarats: ["24K"],
    defaultColor: "yellow",
    supportedColors: ["yellow"],
    makingChargePercent: 3,
    discountPercent: 0,
    diamondSpecs: null,
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM999COIN10",
    certificate: "NABL Assayed & Tamper-Proof Blister Card",
    description: "10 Grams 24 Karat 99.9% fine investment gold coin embossed with Lord Ganesha and Goddess Lakshmi. Sealed in certified tamper-evident packaging.",
    dimensions: "Diameter: 22mm | Thickness: 1.4mm",
    dispatchTime: "Same Day Dispatch"
  },
  {
    id: "SM-120",
    title: "Pure 24K Gold Bar (5g) Assayed",
    collection: "Bullion & Investment",
    category: "bullion",
    navCategories: ["all", "gold", "under-50k", "gifting"],
    isFeatured: false,
    isNew: false,
    badge: "999 Purity",
    rating: 5.0,
    reviews: 44,
    netGoldWeightGrams: 5.00,
    grossWeightGrams: 5.00,
    defaultKarat: "24K",
    supportedKarats: ["24K"],
    defaultColor: "yellow",
    supportedColors: ["yellow"],
    makingChargePercent: 3,
    discountPercent: 0,
    diamondSpecs: null,
    gemstoneSpecs: null,
    images: {
      yellow: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM999BAR05",
    certificate: "BIS 999 Hallmark NABL Certified",
    description: "5 Grams 24 Karat pure investment gold ingot with serial number engraving and certified assay assay card.",
    dimensions: "Rectangular Ingot: 20x12mm",
    dispatchTime: "Same Day Dispatch"
  }
];

// Showroom Image Gallery for Ambikapur Section
const SHOWROOM_GALLERY = [
  {
    src: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (10).jpeg",
    title: "Main Luxury Showroom Floor",
    desc: "Plush velvet seating, gold illuminated showcases & private consultation bays."
  },
  {
    src: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (3).jpeg",
    title: "Necklace & Bridal Section",
    desc: "Exclusive showcase for 22K bridal sets and diamond heirlooms."
  },
  {
    src: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (11).jpeg",
    title: "Precision Karat Weighing Counter",
    desc: "BIS-certified electronic weighing scales with instant purity assay."
  },
  {
    src: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (6).jpeg",
    title: "Showroom Entrance & Atmosphere",
    desc: "Located on Church Road, Joda Pipal, Maharaja Gali, Ambikapur."
  }
];

// 21st.dev Style Asymmetrical Collage Gallery Master Data
const COLLAGE_GALLERY_DATA = [
  {
    id: "gal-1",
    title: "22K Royal Bridal Rani Haar Suite",
    category: "bridal",
    badge: "22K BIS 916",
    spanClass: "span-tall",
    image: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
    desc: "Authentic handcrafted bridal necklaces and rani haar suites crafted by master karigars for North Chhattisgarh weddings.",
    specs: "28.5g Net Gold • 916 Hallmark HUID"
  },
  {
    id: "gal-2",
    title: "Swarn Mahal Luxury Ambience & Lounge",
    category: "showroom",
    badge: "Ambikapur Flagship",
    spanClass: "span-wide",
    image: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (10).jpeg",
    desc: "Explore North Chhattisgarh's premier luxury jewellery destination on Church Road, Joda Pipal, Maharaja Gali.",
    specs: "Private VIP Bays • 100% Purity Certified"
  },
  {
    id: "gal-3",
    title: "Traditional Sacred Mangalsutras",
    category: "mangalsutra",
    badge: "Sacred Vows",
    spanClass: "span-square",
    image: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (14).jpeg",
    desc: "Intricate black onyx bead strands interwoven with 22K pure gold pendants and meenakari motifs.",
    specs: "14.8g Gold • 22K Hallmark"
  },
  {
    id: "gal-4",
    title: "Precision Digital Karat Weighing",
    category: "showroom",
    badge: "100% Transparency",
    spanClass: "span-square",
    image: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (11).jpeg",
    desc: "State-of-the-art electronic scales providing 100% transparent weight and live bullion pricing right before your eyes.",
    specs: "BIS Verified Weighing • Zero Hidden Charges"
  },
  {
    id: "gal-5",
    title: "Solitaire Diamond & Cocktail Rings",
    category: "solitaire",
    badge: "IGI Certified",
    spanClass: "span-wide",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
    desc: "Round brilliant cut solitaires set in glowing 18K yellow, rose, and white gold bands.",
    specs: "VVS-EF Clarity • 18K Gold"
  },
  {
    id: "gal-6",
    title: "Wall Display Busts & Royal Chokers",
    category: "showroom",
    badge: "Showroom Vault",
    spanClass: "span-tall",
    image: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg",
    desc: "A stunning showcase of bridal sets, heavy gold necklaces, and temple jewellery on display.",
    specs: "Heritage Collection • Ambikapur"
  },
  {
    id: "gal-7",
    title: "Pure 925 Silverware & Payal Trays",
    category: "silver",
    badge: "Fine Silver 925",
    spanClass: "span-large-square",
    image: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg",
    desc: "Finest handcrafted 925 sterling silver payals, anklets, puja utensils, and ceremonial silverware.",
    specs: "92.5% Fine Silver • Assayed"
  },
  {
    id: "gal-8",
    title: "Infinity Diamond Tennis Bracelets",
    category: "solitaire",
    badge: "SGL Certified",
    spanClass: "span-medium",
    image: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg",
    desc: "A continuous loop of shimmering brilliant-cut diamonds in 18K gold bezel settings.",
    specs: "0.85 ct Diamonds • 18K Gold"
  },
  {
    id: "gal-9",
    title: "Customer Consultation & Velvet Bay",
    category: "showroom",
    badge: "VIP Service",
    spanClass: "span-wide",
    image: "asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (3).jpeg",
    desc: "Comfortable velvet consultation chairs where our certified jewellery advisors assist you with personalized curation.",
    specs: "Rated 5.0 on Justdial • Open 7 Days"
  }
];
