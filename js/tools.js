/**
 * SAWARN LUXURY JEWELS - INTERACTIVE TOOLS & CALCULATORS
 */

const Tools = {
  init() {
    this.bindGoldRateCalculator();
    this.bindOldGoldCalculator();
    this.bindARTryOnControls();
  },

  /**
   * Live Custom Gold Rate Calculator
   */
  bindGoldRateCalculator() {
    const weightInput = document.getElementById("calc-gold-weight");
    const karatSelect = document.getElementById("calc-gold-karat");
    const makingSelect = document.getElementById("calc-making-charge");
    const resultDisplay = document.getElementById("calc-gold-result");

    const updateCalc = () => {
      if (!weightInput || !resultDisplay) return;
      const weight = parseFloat(weightInput.value) || 0;
      const karat = karatSelect ? karatSelect.value : "22K";
      const makingPct = parseFloat(makingSelect ? makingSelect.value : 12) || 12;

      const ratePerGram = PricingEngine.getKaratRate(karat, AppState.bullionRates.gold24k);
      const metalCost = weight * ratePerGram;
      const makingCharges = metalCost * (makingPct / 100);
      const subtotal = metalCost + makingCharges;
      const gst = subtotal * 0.03;
      const total = Math.round(subtotal + gst);

      resultDisplay.textContent = PricingEngine.formatINR(total);
    };

    if (weightInput) weightInput.addEventListener("input", updateCalc);
    if (karatSelect) karatSelect.addEventListener("change", updateCalc);
    if (makingSelect) makingSelect.addEventListener("change", updateCalc);
  },

  /**
   * Old Gold Exchange Value Calculator
   */
  bindOldGoldCalculator() {
    const weightInput = document.getElementById("old-gold-weight");
    const karatSelect = document.getElementById("old-gold-karat");
    const resultDisplay = document.getElementById("old-gold-result");
    const grossDisplay = document.getElementById("old-gold-gross");

    const updateOldGold = () => {
      if (!weightInput || !resultDisplay) return;
      const weight = parseFloat(weightInput.value) || 0;
      const karat = karatSelect ? karatSelect.value : "22K";

      const calculation = PricingEngine.calculateOldGoldValue(weight, karat, AppState.bullionRates);
      resultDisplay.textContent = PricingEngine.formatINR(calculation.netExchangeCredit);
      if (grossDisplay) {
        grossDisplay.textContent = `Gross Bullion: ${PricingEngine.formatINR(calculation.grossValue)} (Refining fee -2%)`;
      }
    };

    if (weightInput) weightInput.addEventListener("input", updateOldGold);
    if (karatSelect) karatSelect.addEventListener("change", updateOldGold);
  },

  /**
   * Virtual AR Try-On Controls
   */
  bindARTryOnControls() {
    let scale = 1.0;
    const overlay = document.getElementById("ar-overlay-piece");
    const zoomInBtn = document.getElementById("ar-zoom-in");
    const zoomOutBtn = document.getElementById("ar-zoom-out");

    if (zoomInBtn && overlay) {
      zoomInBtn.addEventListener("click", () => {
        scale = Math.min(scale + 0.15, 1.8);
        overlay.style.transform = `translate(-50%, -50%) scale(${scale})`;
      });
    }

    if (zoomOutBtn && overlay) {
      zoomOutBtn.addEventListener("click", () => {
        scale = Math.max(scale - 0.15, 0.6);
        overlay.style.transform = `translate(-50%, -50%) scale(${scale})`;
      });
    }
  }
};
