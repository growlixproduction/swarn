import { BullionRates, Product } from "./types";

export const STORE_CONFIG = {
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

export const INITIAL_BULLION_RATES: BullionRates = {
  gold24k: 15920, // Base 2026 999 Purity Rate
  gold22k: 14600, // 2026 916 Hallmark (91.67% of 24K) -> 28.5g = ₹4,16,100
  gold18k: 11940, // 2026 750 Hallmark (75.00% of 24K)
  gold14k: 9285,  // 2026 585 Hallmark (58.33% of 24K)
  silver925: 180, // Fine 925 Silver per gram
  lastUpdated: "09:30 AM (2026 Live)",
  trend24h: "+0.45%"
};


export interface CategoryMeta {
  slug: string;
  parentSlug?: string;
  pageTitle: string;
  title: string;
  badge: string;
  subtitle: string;
  heroBg: string;
  guideTitle: string;
  guideDesc: string;
}

export const CATEGORY_METADATA: Record<string, CategoryMeta> = {
  "all": {
    slug: "all",
    pageTitle: "All Luxury Jewellery | Swarn Mahal Jewellers Ambikapur",
    title: "All Jewellery",
    badge: "COMPLETE CURATION • 24+ DESIGNS",
    subtitle: "Explore handcrafted 22K gold heirlooms, certified IGI diamond solitaires, bridal rani haars, and lightweight daily essentials.",
    heroBg: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "How to Choose Your Perfect Jewellery",
    guideDesc: "Whether investing in 24K pure bullion or purchasing bridal 22K jewellery, our BIS 916 hallmarking and dynamic formula pricing ensure complete transparency."
  },
  "earrings": {
    slug: "earrings",
    pageTitle: "Luxury Earrings, Jhumkas & Tops | Swarn Mahal Ambikapur",
    title: "Earrings & Tops",
    badge: "HANDCRAFTED PERFECTION • 50+ STYLES",
    subtitle: "From grand 22K temple jhumkas for bridal celebrations to lightweight 18K diamond tops and sui-dhaga drops for everyday elegance.",
    heroBg: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Earrings Styling & Face Silhouette Guide",
    guideDesc: "Discover which earring shapes best complement oval, round, and heart-shaped faces, along with secure screw-back and push-plug locking mechanisms."
  },
  "nose-pins": {
    slug: "nose-pins",
    pageTitle: "Nose Pins | Swarn Mahal Jewellers Ambikapur",
    title: "Nose Pins",
    badge: "BIS 916 HALLMARKED • CERTIFIED DIAMONDS",
    subtitle: "Discover delicate diamond nose studs, traditional bridal naths, and minimal 22K gold wire nose pins.",
    heroBg: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Nose Pins Buying & Care Guide",
    guideDesc: "Every design is crafted with BIS 916 certified hallmarked purity and accompanied by an authentic purity certificate."
  },
  "gold-hoops-balis": {
    slug: "gold-hoops-balis",
    pageTitle: "Gold Hoops & Balis | Swarn Mahal Jewellers Ambikapur",
    title: "Gold Hoops & Balis",
    badge: "BIS 916 HALLMARKED • 100% PURITY",
    subtitle: "Explore handcrafted Gold Hoops & Balis in pure BIS 916 gold and authentic gemstones.",
    heroBg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Gold Hoops & Balis Buying & Care Guide",
    guideDesc: "Every design is crafted with BIS 916 certified hallmarked purity and accompanied by an authentic purity certificate."
  },
  "pendants": {
    slug: "pendants",
    pageTitle: "Pendants | Swarn Mahal Jewellers Ambikapur",
    title: "Pendants",
    badge: "BIS 916 HALLMARKED • 100% PURITY",
    subtitle: "Discover elegant daily-wear gold pendants, spiritual lockets, heart motifs, and sparkling diamond pendants.",
    heroBg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Pendants Buying & Care Guide",
    guideDesc: "Every design is crafted with BIS 916 certified hallmarked purity and accompanied by an authentic purity certificate."
  },
  "mangalsutra": {
    slug: "mangalsutra",
    pageTitle: "Mangalsutra | Swarn Mahal Jewellers Ambikapur",
    title: "Mangalsutra",
    badge: "BIS 916 HALLMARKED • 100% PURITY",
    subtitle: "Explore handcrafted Mangalsutra in pure BIS 916 gold and authentic gemstones.",
    heroBg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Mangalsutra Buying & Care Guide",
    guideDesc: "Every design is crafted with BIS 916 certified hallmarked purity and accompanied by an authentic purity certificate."
  },
  "chains": {
    slug: "chains",
    pageTitle: "Chains | Swarn Mahal Jewellers Ambikapur",
    title: "Chains",
    badge: "BIS 916 HALLMARKED • 100% PURITY",
    subtitle: "Explore precision-crafted 22K yellow gold chains, durable daily links, classic rope designs, and elegant machine chains.",
    heroBg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Chains Buying & Care Guide",
    guideDesc: "Every design is crafted with BIS 916 certified hallmarked purity and accompanied by an authentic purity certificate."
  },
  "bangles": {
    slug: "bangles",
    pageTitle: "Bangles | Swarn Mahal Jewellers Ambikapur",
    title: "Bangles",
    badge: "BIS 916 HALLMARKED • 100% PURITY",
    subtitle: "Explore handcrafted Bangles in pure BIS 916 gold and authentic gemstones.",
    heroBg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Bangles Buying & Care Guide",
    guideDesc: "Every design is crafted with BIS 916 certified hallmarked purity and accompanied by an authentic purity certificate."
  },
  "necklace": {
    slug: "necklace",
    pageTitle: "Necklace | Swarn Mahal Jewellers Ambikapur",
    title: "Necklace",
    badge: "BIS 916 HALLMARKED • 100% PURITY",
    subtitle: "Explore handcrafted Necklace in pure BIS 916 gold and authentic gemstones.",
    heroBg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Necklace Buying & Care Guide",
    guideDesc: "Every design is crafted with BIS 916 certified hallmarked purity and accompanied by an authentic purity certificate."
  },
  "bracelet": {
    slug: "bracelet",
    pageTitle: "Bracelet | Swarn Mahal Jewellers Ambikapur",
    title: "Bracelet",
    badge: "BIS 916 HALLMARKED • 100% PURITY",
    subtitle: "Explore handcrafted Bracelet in pure BIS 916 gold and authentic gemstones.",
    heroBg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    guideTitle: "Bracelet Buying & Care Guide",
    guideDesc: "Every design is crafted with BIS 916 certified hallmarked purity and accompanied by an authentic purity certificate."
  }
};

export const REVIEWS_DATA = [
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
    text: "मैंने आज शॉपिंग किया जैसा समझा था उससे कहीं अच्छा स्टोर को पाया, रेट बहुत कम है दूसरे दुकानों के अपेक्षा। Pure gold, accurate weight and trustworthy people.",
    badge: "Verified Buyer • Ambikapur"
  }
];

export const COLLAGE_GALLERY_DATA = [
  {
    id: "gal-1",
    title: "22K Royal Bridal Rani Haar Suite",
    category: "bridal",
    badge: "22K BIS 916",
    spanClass: "span-tall",
    image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg",
    desc: "Authentic handcrafted bridal necklaces and rani haar suites crafted by master karigars for North Chhattisgarh weddings.",
    specs: "28.5g Net Gold • 916 Hallmark HUID"
  },
  {
    id: "gal-2",
    title: "Swarn Mahal Luxury Ambience & Lounge",
    category: "showroom",
    badge: "Ambikapur Flagship",
    spanClass: "span-wide",
    image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (10).jpeg",
    desc: "Explore North Chhattisgarh's premier luxury jewellery destination on Church Road, Joda Pipal, Maharaja Gali.",
    specs: "Private VIP Bays • 100% Purity Certified"
  },
  {
    id: "gal-3",
    title: "Traditional Sacred Mangalsutras",
    category: "mangalsutra",
    badge: "Sacred Vows",
    spanClass: "span-square",
    image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (14).jpeg",
    desc: "Intricate black onyx bead strands interwoven with 22K pure gold pendants and meenakari motifs.",
    specs: "14.8g Gold • 22K Hallmark"
  },
  {
    id: "gal-4",
    title: "Precision Digital Karat Weighing",
    category: "showroom",
    badge: "100% Transparency",
    spanClass: "span-square",
    image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (11).jpeg",
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
    image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg",
    desc: "A stunning showcase of bridal sets, heavy gold necklaces, and temple jewellery on display.",
    specs: "Heritage Collection • Ambikapur"
  },
  {
    id: "gal-7",
    title: "Pure 925 Silverware & Payal Trays",
    category: "silver",
    badge: "Fine Silver 925",
    spanClass: "span-large-square",
    image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM.jpeg",
    desc: "Finest handcrafted 925 sterling silver payals, anklets, puja utensils, and ceremonial silverware.",
    specs: "92.5% Fine Silver • Assayed"
  },
  {
    id: "gal-8",
    title: "Infinity Diamond Tennis Bracelets",
    category: "solitaire",
    badge: "SGL Certified",
    spanClass: "span-medium",
    image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg",
    desc: "A continuous loop of shimmering brilliant-cut diamonds in 18K gold bezel settings.",
    specs: "0.85 ct Diamonds • 18K Gold"
  },
  {
    id: "gal-9",
    title: "Customer Consultation & Velvet Bay",
    category: "showroom",
    badge: "VIP Service",
    spanClass: "span-wide",
    image: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (3).jpeg",
    desc: "Comfortable velvet consultation chairs where our certified jewellery advisors assist you with personalized curation.",
    specs: "Rated 5.0 on Justdial • Open 7 Days"
  }
];

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: "SM-101",
    title: "Rubans Modern Solitaire Ring",
    slug: "rubans-modern-solitaire-ring",
    collection: "Solitaire Collection",
    category: "rings",
    navCategories: ["all", "diamond", "daily-wear", "gifting"],
    isFeatured: true,
    isNew: true,
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
    dimensions: "Band Width: 2.2mm | Crown Height: 5.5mm"
  },
  {
    id: "SM-106",
    title: "Floral Diamond Cocktail Ring",
    slug: "floral-diamond-cocktail-ring",
    collection: "Garden of Eden",
    category: "rings",
    navCategories: ["all", "diamond", "gifting"],
    isFeatured: false,
    isNew: true,
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
    dimensions: "Motif Diameter: 14mm | Shank: 2.0mm"
  },
  {
    id: "SM-109",
    title: "Eternal Diamond Pavé Eternity Band",
    slug: "eternal-diamond-pave-eternity-band",
    collection: "Infinite Love",
    category: "rings",
    navCategories: ["all", "diamond", "daily-wear", "under-50k", "gifting"],
    isFeatured: false,
    isNew: false,
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
    dimensions: "Width: 1.8mm | Thickness: 1.6mm"
  },
  {
    id: "SM-110",
    title: "Zambian Emerald Solitaire Halo Ring",
    slug: "zambian-emerald-solitaire-halo-ring",
    collection: "Royal Gemstone",
    category: "rings",
    navCategories: ["all", "gemstone", "gifting"],
    isFeatured: true,
    isNew: true,
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
      pricePerCarat: 22000
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
    dimensions: "Center Stone: 7x5mm Octagon | Band: 2.1mm"
  },
  {
    id: "SM-104",
    title: "Swarn Mahal 22K Royal Rani Haar",
    slug: "swarn-mahal-22k-royal-rani-haar",
    collection: "Heritage Ambikapur",
    category: "necklaces",
    navCategories: ["all", "gold", "wedding"],
    isFeatured: true,
    isNew: false,
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
    images: {
      yellow: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM916RH285",
    certificate: "BIS Hallmarked HUID 916",
    description: "Authentic 22K gold bridal Rani Haar handcrafted with heritage nakshi, intricate filigree, and floral jali medallions by Swarn Mahal master karigars in Ambikapur.",
    dimensions: "Length: 24 Inches Adjustable Dori | Center Pendant: 52mm"
  },
  {
    id: "SM-105",
    title: "Swarn Mahal Traditional Mangalsutra",
    slug: "swarn-mahal-traditional-mangalsutra",
    collection: "Sacred Vows",
    category: "necklaces",
    navCategories: ["all", "gold", "wedding", "daily-wear"],
    isFeatured: true,
    isNew: true,
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
    images: {
      yellow: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM916MS148",
    certificate: "BIS 916 Hallmarked",
    description: "Auspicious black onyx beads interwoven with 22K pure gold pendants, delicate ghungroo drops, and intricate traditional meenakari detailing.",
    dimensions: "Length: 18 Inches | Pendant Drop: 32mm"
  },
  {
    id: "SM-111",
    title: "Royal Kundan & Polki Bridal Choker Set",
    slug: "royal-kundan-polki-bridal-choker-set",
    collection: "Maharani Trousseau",
    category: "necklaces",
    navCategories: ["all", "gold", "wedding", "gemstone"],
    isFeatured: true,
    isNew: true,
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
    gemstoneSpecs: {
      stoneType: "Uncut Jadau Polki & Natural Emerald Beads",
      weightCarat: 12.4,
      pricePerCarat: 14000
    },
    images: {
      yellow: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM916KC342",
    certificate: "BIS 916 Hallmark & Artisan Assay",
    description: "Opulent bridal choker handcrafted with 22K hallmarked gold, uncut polki stones, suspended emerald beads, and matching chandelier earrings.",
    dimensions: "Choker Width: 45mm | Adjustable Silk Dori"
  },
  {
    id: "SM-107",
    title: "Chandelier Diamond Drop Earrings",
    slug: "chandelier-diamond-drop-earrings",
    collection: "Luminescence",
    category: "earrings",
    navCategories: ["all", "diamond", "earrings", "wedding"],
    isFeatured: false,
    isNew: false,
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
    dimensions: "Drop Length: 38mm | Width: 12mm"
  },
  {
    id: "SM-113",
    title: "Heritage 22K Royal Peacock Jhumkas",
    slug: "heritage-22k-royal-peacock-jhumkas",
    collection: "Heritage Ambikapur",
    category: "earrings",
    navCategories: ["all", "gold", "earrings", "wedding"],
    isFeatured: true,
    isNew: true,
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
    images: {
      yellow: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM916PJ112",
    certificate: "BIS 916 Hallmarked",
    description: "Intricately sculpted Mayur (Peacock) studs with dome jhumka bells and dangling micro gold bead fringes in authentic 22K yellow gold.",
    dimensions: "Length: 48mm | Bell Diameter: 18mm"
  },
  {
    id: "SM-102",
    title: "Infinity Diamond Tennis Bracelet",
    slug: "infinity-diamond-tennis-bracelet",
    collection: "Eternal Sparkle",
    category: "bangles",
    navCategories: ["all", "diamond", "daily-wear", "gifting"],
    isFeatured: true,
    isNew: false,
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
    images: {
      yellow: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM750B9410",
    certificate: "SGL-IN892019",
    description: "An infinite loop of sparkling brilliant-cut diamonds encased in sleek gold bezels with a double-safety box clasp.",
    dimensions: "Length: 7.0 Inches | Link Width: 3.5mm"
  },
  {
    id: "SM-116",
    title: "Swarn Mahal 22K Handcrafted Gold Kada (Pair)",
    slug: "swarn-mahal-22k-handcrafted-gold-kada-pair",
    collection: "Heritage Ambikapur",
    category: "bangles",
    navCategories: ["all", "gold", "wedding"],
    isFeatured: true,
    isNew: false,
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
    images: {
      yellow: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      rose: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      white: "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80",
      hover: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=1200&q=85"
      ]
    },
    huid: "SM916KD248",
    certificate: "BIS 916 Hallmarked",
    description: "A pair of traditional solid 22K gold kadas with floral relief engraving, screw-hinge locking mechanism, and antique semi-matte polish.",
    dimensions: "Standard Size: 2-6 (2.375 inch diameter)"
  },
  {
    id: "SM-108",
    title: "Pure 24K Gold Laxmi-Ganesh Coin (10g)",
    slug: "pure-24k-gold-laxmi-ganesh-coin-10g",
    collection: "Bullion & Investment",
    category: "bullion",
    navCategories: ["all", "gold", "gifting"],
    isFeatured: true,
    isNew: false,
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
    dimensions: "Diameter: 22mm | Thickness: 1.4mm"
  }
];

export const SHOWROOM_GALLERY = [
  {
    src: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (10).jpeg",
    title: "Main Luxury Showroom Floor",
    desc: "Plush velvet seating, gold illuminated showcases & private consultation bays."
  },
  {
    src: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (3).jpeg",
    title: "Necklace & Bridal Section",
    desc: "Exclusive showcase for 22K bridal sets and diamond heirlooms."
  },
  {
    src: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (11).jpeg",
    title: "Precision Karat Weighing Counter",
    desc: "BIS-certified electronic weighing scales with instant purity assay."
  },
  {
    src: "/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (6).jpeg",
    title: "Solitaire & Diamond Loupe Lounge",
    desc: "10x optical loupe grading and live spectrum fluorescence inspection."
  }
];
