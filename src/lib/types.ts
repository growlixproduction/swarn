export type KaratType = "24K" | "22K" | "18K" | "14K" | "9K";
export type MetalTone = "yellow" | "rose" | "white";

export interface DiamondSpecs {
  totalCaratWeight: number;
  clarity: string;
  cut: string;
  pricePerCarat: number;
  stoneCount?: number;
}

export interface GemstoneSpecs {
  stoneType: string;
  weightCarat: number;
  pricePerCarat?: number;
}

export interface ProductImages {
  yellow: string;
  rose?: string;
  white?: string;
  hover?: string;
  gallery?: string[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  navCategories: string[];
  collection: string;
  description: string;
  huid: string;
  certificate: string;
  netGoldWeightGrams: number;
  grossWeightGrams: number;
  defaultKarat: KaratType;
  defaultColor: MetalTone;
  supportedKarats: KaratType[];
  supportedColors: MetalTone[];
  makingChargePercent: number;
  makingChargePerGram?: number;
  discountPercent?: number;
  rating: number;
  reviews: number;
  isFeatured?: boolean;
  isNew?: boolean;
  dimensions?: string;
  diamondSpecs?: DiamondSpecs;
  gemstoneSpecs?: GemstoneSpecs;
  images: ProductImages;
}

export interface BullionRates {
  gold24k: number;
  gold22k: number;
  gold18k: number;
  gold14k: number;
  silver925: number;
  trend24h: string;
  lastUpdated: string;
}

export interface MakingChargeConfig {
  type: "percent" | "per_gram";
  value: number;
}

export interface PriceBreakdown {
  karat: KaratType;
  ratePerGram: number;
  netGoldWeight: number;
  grossWeight: number;
  metalCost: number;
  diamondSpecs?: DiamondSpecs;
  gemstoneSpecs?: GemstoneSpecs;
  diamondCost: number;
  makingType: "percent" | "per_gram";
  makingPct: number;
  makingPerGram: number;
  baseMakingCharges: number;
  discountPct: number;
  discountAmount: number;
  effectiveMakingCharges: number;
  taxableSubtotal: number;
  gstRatePct: number;
  cgstAmount: number;
  sgstAmount: number;
  gstAmount: number;
  finalPrice: number;
  originalPrice: number;
  hasDiscount: boolean;
  savingsAmount: number;
}

export interface CartItem {
  id: string;
  title: string;
  karat: KaratType;
  color: MetalTone;
  size: string;
  engraving?: string;
  makingCharge: MakingChargeConfig;
  image: string;
  unitPrice: number;
  originalUnitPrice: number;
  quantity: number;
  netGoldWeightGrams: number;
  huid: string;
}
