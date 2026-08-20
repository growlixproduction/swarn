/**
 * SAWARN LUXURY JEWELS - REACTIVE STATE MANAGEMENT
 */

const AppState = {
  // Bullion rates
  bullionRates: { ...INITIAL_BULLION_RATES },
  isLiveApiMode: true,

  // Selected filters
  activeCategory: "all",
  searchQuery: "",

  // Product card variant state (productId -> { karat, color })
  productSelections: {},

  // User Cart & Wishlist
  cart: [],
  wishlist: [],

  // Dynamic Price Lock Timer (15 minutes = 900 seconds)
  priceLockSecondsRemaining: 900,
  priceLockInterval: null,

  // Subscribed listeners
  listeners: [],

  subscribe(listener) {
    this.listeners.push(listener);
  },

  notify(changeType) {
    this.listeners.forEach(fn => fn(changeType, this));
  },

  init() {
    // Initialize default selections for all products
    PRODUCTS_CATALOG.forEach(p => {
      this.productSelections[p.id] = {
        karat: p.defaultKarat || "18K",
        color: p.defaultColor || "yellow",
        size: "14 (Indian)",
        engraving: "",
        makingCharge: {
          type: "percent",
          value: p.makingChargePercent || 15
        }
      };
    });

    // Load persisted state if available
    try {
      const savedCart = localStorage.getItem("swarn_cart");
      if (savedCart) this.cart = JSON.parse(savedCart);

      const savedWish = localStorage.getItem("swarn_wishlist");
      if (savedWish) this.wishlist = JSON.parse(savedWish);
    } catch (e) {
      console.warn("Could not load local storage", e);
    }

    this.startPriceLockTimer();
  },

  setBullionRate(rate24k) {
    this.bullionRates.gold24k = Number(rate24k);
    this.bullionRates.gold22k = Math.round(rate24k * (22 / 24));
    this.bullionRates.gold18k = Math.round(rate24k * (18 / 24));
    this.bullionRates.gold14k = Math.round(rate24k * (14 / 24));
    this.bullionRates.lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.notify("rates");
  },

  setProductKarat(productId, karat) {
    if (this.productSelections[productId]) {
      this.productSelections[productId].karat = karat;
      this.notify("product_variant");
    }
  },

  setProductColor(productId, color) {
    if (this.productSelections[productId]) {
      this.productSelections[productId].color = color;
      this.notify("product_variant");
    }
  },

  setProductMakingCharge(productId, makingChargeObj) {
    if (!this.productSelections[productId]) {
      this.productSelections[productId] = {};
    }
    this.productSelections[productId].makingCharge = {
      ...(this.productSelections[productId].makingCharge || { type: "percent", value: 15 }),
      ...makingChargeObj
    };
    this.notify("product_variant");
  },

  addToCart(product, customOptions = {}) {
    const currentSel = this.productSelections[product.id] || {};
    const karat = customOptions.karat || currentSel.karat || product.defaultKarat || "18K";
    const color = customOptions.color || currentSel.color || product.defaultColor || "yellow";
    const size = customOptions.size || currentSel.size || "14";
    const engraving = customOptions.engraving || currentSel.engraving || "";
    const makingCharge = customOptions.makingCharge || currentSel.makingCharge || { type: "percent", value: product.makingChargePercent || 15 };

    const breakdown = PricingEngine.calculateBreakdown(product, karat, this.bullionRates, null, makingCharge);

    const existingIndex = this.cart.findIndex(
      item => item.id === product.id && item.karat === karat && item.color === color
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        karat,
        color,
        size,
        engraving,
        makingCharge,
        image: product.images[color] || product.images.yellow,
        unitPrice: breakdown.finalPrice,
        originalUnitPrice: breakdown.originalPrice,
        quantity: 1,
        netGoldWeightGrams: product.netGoldWeightGrams,
        huid: product.huid
      });
    }

    this.saveCart();
    this.resetPriceLockTimer();
    this.notify("cart");
  },

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.notify("cart");
  },

  updateCartQuantity(index, newQty) {
    if (newQty <= 0) {
      this.removeFromCart(index);
      return;
    }
    this.cart[index].quantity = newQty;
    this.saveCart();
    this.notify("cart");
  },

  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
    } else {
      this.wishlist.push(productId);
    }
    try {
      localStorage.setItem("swarn_wishlist", JSON.stringify(this.wishlist));
    } catch (e) {}
    this.notify("wishlist");
  },

  saveCart() {
    try {
      localStorage.setItem("swarn_cart", JSON.stringify(this.cart));
    } catch (e) {}
  },

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  },

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  startPriceLockTimer() {
    if (this.priceLockInterval) clearInterval(this.priceLockInterval);
    this.priceLockInterval = setInterval(() => {
      if (this.priceLockSecondsRemaining > 0) {
        this.priceLockSecondsRemaining -= 1;
        this.notify("timer");
      } else {
        // Refresh prices upon expiration
        this.priceLockSecondsRemaining = 900;
        this.notify("rates");
      }
    }, 1000);
  },

  resetPriceLockTimer() {
    this.priceLockSecondsRemaining = 900;
    this.notify("timer");
  }
};
