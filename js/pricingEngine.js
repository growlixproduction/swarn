/**
 * SAWARN LUXURY JEWELS - DYNAMIC PRICING & BULLION ENGINE
 * Conforming strictly to JEWELLERY_WEBSITE_SPECIFICATION.md Section 2
 */

const PricingEngine = {
  // Karat purity conversion factors (relative to 24K 99.9% fine bullion base)
  KARAT_FACTORS: {
    "24K": 1.0,           // 999 Purity (100%)
    "22K": 22 / 24,       // 916 Hallmark (91.667%)
    "18K": 18 / 24,       // 750 Hallmark (75.000%)
    "14K": 14 / 24,       // 585 Hallmark (58.333%)
    "9K":  9 / 24         // 375 Purity (37.500%)
  },

  // GST rate applicable for Gold & Diamond Jewellery in India (HSN 7113)
  GST_RATE: 0.03, // 3% GST

  /**
   * Get dynamic per-gram gold rate for a specific karat based on 24K benchmark
   */
  getKaratRate(karat, base24kRate) {
    const factor = this.KARAT_FACTORS[karat] || (18 / 24);
    return Math.round(base24kRate * factor);
  },

  /**
   * Calculate complete itemized price breakdown for a product
   */
  calculateBreakdown(product, selectedKarat, bullionRates, customDiscountPct = null, customMaking = null) {
    const karat = selectedKarat || product.defaultKarat || "18K";
    const base24k = bullionRates.gold24k || 7380;
    const ratePerGram = this.getKaratRate(karat, base24k);

    // 1. Metal Cost = Net Metal Weight * Live Karat Rate
    const netGoldWeight = Number(product.netGoldWeightGrams || 0);
    const grossWeight = Number(product.grossWeightGrams || netGoldWeight);
    const metalCost = Math.round(netGoldWeight * ratePerGram);

    // 2. Diamond / Gemstone Cost
    let diamondCost = 0;
    if (product.diamondSpecs && product.diamondSpecs.totalCaratWeight) {
      const { totalCaratWeight, pricePerCarat } = product.diamondSpecs;
      diamondCost = Math.round(totalCaratWeight * pricePerCarat);
    } else if (product.gemstoneSpecs && product.gemstoneSpecs.weightCarat) {
      diamondCost = Math.round((product.gemstoneSpecs.weightCarat || 0) * (product.gemstoneSpecs.pricePerCarat || 15000));
    }

    // 3. Making Charges (Percentage or Per-Gram based)
    let makingType = "percent";
    let makingPct = product.makingChargePercent || 15;
    let makingPerGram = product.makingChargePerGram || 650;

    if (customMaking) {
      if (typeof customMaking === "number") {
        makingPct = customMaking;
        makingType = "percent";
      } else if (typeof customMaking === "object") {
        makingType = customMaking.type || "percent";
        if (customMaking.value !== undefined) {
          if (makingType === "per_gram") makingPerGram = Number(customMaking.value);
          else makingPct = Number(customMaking.value);
        }
        if (customMaking.percent !== undefined) makingPct = Number(customMaking.percent);
        if (customMaking.perGram !== undefined) makingPerGram = Number(customMaking.perGram);
      }
    }

    let baseMakingCharges = 0;
    if (makingType === "per_gram") {
      baseMakingCharges = Math.round(grossWeight * makingPerGram);
    } else {
      baseMakingCharges = Math.round((metalCost * makingPct) / 100);
    }

    // 4. Promotional Discounts on Making Charges / Value
    const discountPct = customDiscountPct !== null ? customDiscountPct : (product.discountPercent || 0);
    const discountAmount = Math.round((baseMakingCharges * discountPct) / 100);
    const effectiveMakingCharges = Math.max(0, baseMakingCharges - discountAmount);

    // 5. Subtotal before taxes
    const taxableSubtotal = metalCost + diamondCost + effectiveMakingCharges;
    const originalTaxableSubtotal = metalCost + diamondCost + baseMakingCharges;

    // 6. 3% GST (HSN 7113) - 1.5% CGST + 1.5% SGST
    const gstAmount = Math.round(taxableSubtotal * this.GST_RATE);
    const cgstAmount = Math.round(taxableSubtotal * 0.015);
    const sgstAmount = gstAmount - cgstAmount;
    const originalGstAmount = Math.round(originalTaxableSubtotal * this.GST_RATE);

    // 7. Grand Total
    const finalPrice = taxableSubtotal + gstAmount;
    const originalPrice = originalTaxableSubtotal + originalGstAmount;

    return {
      karat,
      ratePerGram,
      netGoldWeight,
      grossWeight,
      metalCost,
      diamondSpecs: product.diamondSpecs,
      gemstoneSpecs: product.gemstoneSpecs,
      diamondCost,
      makingType,
      makingPct,
      makingPerGram,
      baseMakingCharges,
      discountPct,
      discountAmount,
      effectiveMakingCharges,
      taxableSubtotal,
      gstRatePct: 3,
      cgstAmount,
      sgstAmount,
      gstAmount,
      finalPrice,
      originalPrice,
      hasDiscount: discountAmount > 0,
      savingsAmount: originalPrice - finalPrice
    };
  },

  /**
   * Format numbers to Indian Rupee Currency Format (e.g. ₹1,45,280)
   */
  formatINR(amount) {
    if (isNaN(amount)) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  },

  /**
   * Old Gold Exchange Calculator Engine
   */
  calculateOldGoldValue(weightGrams, karat, bullionRates) {
    const weight = parseFloat(weightGrams) || 0;
    if (weight <= 0) return { grossValue: 0, netExchangeCredit: 0, meltLoss: 0 };

    const base24k = bullionRates.gold24k || 7380;
    const pureRate = this.getKaratRate(karat, base24k);
    const grossValue = Math.round(weight * pureRate);
    
    // Standard 2% melting / refining allowance
    const meltLoss = Math.round(grossValue * 0.02);
    const netExchangeCredit = grossValue - meltLoss;

    return {
      weight,
      karat,
      ratePerGram: pureRate,
      grossValue,
      meltLoss,
      netExchangeCredit
    };
  }
};
