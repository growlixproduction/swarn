/**
 * SAWARN LUXURY JEWELS - UI RENDERING & COMPONENT CONTROLLER
 */

const UI = {
  /**
   * Render Live Bullion Ticker in Header
   */
  renderTicker(rates) {
    const tickerContainer = document.getElementById("live-ticker-track");
    if (!tickerContainer) return;

    const rate24k = PricingEngine.formatINR(rates.gold24k);
    const rate22k = PricingEngine.formatINR(rates.gold22k);
    const rate18k = PricingEngine.formatINR(rates.gold18k);
    const rate14k = PricingEngine.formatINR(rates.gold14k);
    const rateSilver = PricingEngine.formatINR(rates.silver925);

    tickerContainer.innerHTML = `
      <div class="ticker-item"><strong>24K Bullion Gold:</strong> <span class="rate-val">${rate24k}/g</span> <span class="rate-delta up">▲ ${rates.trend24h}</span></div>
      <div class="ticker-item"><strong>22K Hallmark Gold:</strong> <span class="rate-val">${rate22k}/g</span></div>
      <div class="ticker-item"><strong>18K Diamond Gold:</strong> <span class="rate-val">${rate18k}/g</span></div>
      <div class="ticker-item"><strong>14K Affordable Gold:</strong> <span class="rate-val">${rate14k}/g</span></div>
      <div class="ticker-item"><strong>925 Fine Silver:</strong> <span class="rate-val">${rateSilver}/g</span></div>
      <div class="ticker-item"><i class="fa-regular fa-clock"></i> Updated: ${rates.lastUpdated}</div>
    `;

    // Also update header rate button
    const headerBtnRate = document.getElementById("header-gold-rate");
    if (headerBtnRate) {
      const label = headerBtnRate.querySelector(".rate-label-text");
      if (label) {
        label.textContent = `22K: ${rate22k}/g`;
      } else {
        headerBtnRate.innerHTML = `<span class="tanishq-live-dot"></span> <span class="rate-label-text">22K: ${rate22k}/g</span>`;
      }
    }
  },

  /**
   * Render Single Luxury Product Card HTML (Official Tanishq Aesthetic)
   */
  renderProductCardHTML(product) {
    const selection = AppState.productSelections[product.id] || { karat: product.defaultKarat, color: product.defaultColor };
    const currentKarat = selection.karat || product.defaultKarat;
    const currentColor = selection.color || product.defaultColor;

    const breakdown = PricingEngine.calculateBreakdown(product, currentKarat, AppState.bullionRates);
    const isWishlisted = AppState.wishlist.includes(product.id);

    const activeImage = (product.images && product.images[currentColor]) || product.images.yellow;
    const hoverImage = (product.images && product.images.hover) || activeImage;

    // Tanishq-style stock urgency text
    const stockUrgency = product.isFeatured ? 'Only 1 left!' : (product.isNew ? 'New Arrival' : 'Only 2 left!');
    
    // Tanishq-style offer text
    const offerText = breakdown.hasDiscount ? `${breakdown.discountPct}% off on stone charges` : '20% off on making charges';

    return `
      <div class="product-card" id="card-${product.id}" onclick="window.location.href='product-detail.html?id=${product.id}'">
        <div class="product-media">
          <img class="product-img-primary" src="${activeImage}" alt="${product.title}" loading="lazy" />
          <img class="product-img-hover" src="${hoverImage}" alt="${product.title} alternate view" loading="lazy" />
          
          <button class="tanishq-card-wishlist ${isWishlisted ? 'wishlisted' : ''}" 
                  title="Add to Wishlist" 
                  onclick="event.stopPropagation(); AppState.toggleWishlist('${product.id}')">
            <i class="${isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
          </button>
        </div>

        <div class="product-info">
          <h3 class="product-title" title="${product.title}">
            ${product.title}
          </h3>

          <div class="product-pricing-box">
            <span class="price-current">₹ ${Math.round(breakdown.finalPrice).toLocaleString('en-IN')}</span>
            ${breakdown.hasDiscount ? `<span class="price-original">₹ ${Math.round(breakdown.originalPrice).toLocaleString('en-IN')}</span>` : ''}
            <span class="stock-urgency-text">${stockUrgency}</span>
          </div>

          <div class="tanishq-offer-pill">
            <span class="offer-pct-icon">%</span>
            <span class="offer-text">${offerText}</span>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Product Catalog Grid for Home Page or generic lists
   */
  renderProducts(products, containerId = "products-grid") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = products.filter(p => {
      const matchesCat = AppState.activeCategory === "all" || 
                         p.category === AppState.activeCategory || 
                         (p.navCategories && p.navCategories.includes(AppState.activeCategory));
      const matchesSearch = !AppState.searchQuery || 
        p.title.toLowerCase().includes(AppState.searchQuery.toLowerCase()) ||
        p.collection.toLowerCase().includes(AppState.searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
          <p style="font-size: 1.1rem; color: var(--text-muted);">No jewellery designs found matching your selection.</p>
          <button class="btn btn-outline btn-sm" style="margin-top: 1rem;" onclick="AppState.activeCategory = 'all'; AppState.notify('filter');">View All Collections</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => this.renderProductCardHTML(p)).join('');

    if (typeof window.refreshScrollReveal === 'function') {
      setTimeout(() => window.refreshScrollReveal(), 50);
    }
  },

  /**
   * Render Dedicated Product Listing Page (PLP) with Sidebar Filtering & Sorting
   */
  renderPLP(categorySlug = "all") {
    const container = document.getElementById("plp-products-grid");
    if (!container) return;

    // Get filter states
    const priceMax = Number(document.getElementById("plp-price-range") ? document.getElementById("plp-price-range").value : 300000);
    const sortVal = document.getElementById("plp-sort-select") ? document.getElementById("plp-sort-select").value : "recommended";
    
    // Checked Karats
    const checkedKarats = Array.from(document.querySelectorAll(".plp-karat-checkbox:checked")).map(el => el.value);
    
    // Selected Color
    const activeColorEl = document.querySelector(".filter-color-pill.active");
    const activeColor = activeColorEl ? activeColorEl.dataset.color : "all";

    // 1. Filter by category
    let filtered = PRODUCTS_CATALOG.filter(p => {
      if (categorySlug === "all") return true;
      if (categorySlug === "under-50k") {
        const bd = PricingEngine.calculateBreakdown(p, p.defaultKarat, AppState.bullionRates);
        return bd.finalPrice <= 55000 || (p.navCategories && p.navCategories.includes("under-50k"));
      }
      return (p.navCategories && p.navCategories.includes(categorySlug)) || p.category === categorySlug;
    });

    // 2. Filter by Search Query
    if (AppState.searchQuery) {
      const q = AppState.searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.collection.toLowerCase().includes(q));
    }

    // 3. Filter by Karat
    if (checkedKarats.length > 0) {
      filtered = filtered.filter(p => p.supportedKarats.some(k => checkedKarats.includes(k)));
    }

    // 4. Filter by Color
    if (activeColor && activeColor !== "all") {
      filtered = filtered.filter(p => p.supportedColors.includes(activeColor));
    }

    // 5. Filter by Price Limit
    filtered = filtered.filter(p => {
      const bd = PricingEngine.calculateBreakdown(p, p.defaultKarat, AppState.bullionRates);
      return bd.finalPrice <= priceMax;
    });

    // 6. Sort
    filtered.sort((a, b) => {
      const bdA = PricingEngine.calculateBreakdown(a, a.defaultKarat, AppState.bullionRates);
      const bdB = PricingEngine.calculateBreakdown(b, b.defaultKarat, AppState.bullionRates);
      if (sortVal === "price-asc") return bdA.finalPrice - bdB.finalPrice;
      if (sortVal === "price-desc") return bdB.finalPrice - bdA.finalPrice;
      if (sortVal === "rating") return b.rating - a.rating;
      if (sortVal === "weight") return b.netGoldWeightGrams - a.netGoldWeightGrams;
      return 0; // recommended default
    });

    // Update Result Count
    const countEl = document.getElementById("plp-results-count");
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${filtered.length}</strong> Handcrafted Designs`;
    }

    // Render Cards
    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
          <i class="fa-solid fa-filter" style="font-size: 2.5rem; color: var(--gold-light); margin-bottom: 1rem;"></i>
          <p style="font-size: 1.1rem; color: var(--text-muted);">No jewellery designs match your selected filters.</p>
          <button class="btn btn-gold btn-sm" style="margin-top: 1rem;" onclick="UI.resetPLPFilters('${categorySlug}')">Reset All Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => this.renderProductCardHTML(p)).join('');

    if (typeof window.refreshScrollReveal === 'function') {
      setTimeout(() => window.refreshScrollReveal(), 50);
    }
  },

  /**
   * Reset PLP Filters Helper
   */
  resetPLPFilters(categorySlug) {
    const slider = document.getElementById("plp-price-range");
    if (slider) {
      slider.value = 300000;
      const valDisp = document.getElementById("plp-price-val");
      if (valDisp) valDisp.textContent = "₹3,00,000";
    }

    document.querySelectorAll(".plp-karat-checkbox").forEach(cb => cb.checked = false);
    document.querySelectorAll(".filter-color-pill").forEach(p => p.classList.remove("active"));
    const allPill = document.querySelector(".filter-color-pill[data-color='all']");
    if (allPill) allPill.classList.add("active");

    const sortSelect = document.getElementById("plp-sort-select");
    if (sortSelect) sortSelect.value = "recommended";

    AppState.searchQuery = "";
    this.renderPLP(categorySlug);
  },

  /**
   * Initialize Dynamic Product Details Page (PDP)
   */
  initPDP() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id") || "SM-101";
    const product = PRODUCTS_CATALOG.find(p => p.id === productId) || PRODUCTS_CATALOG[0];

    // Initialize product selection if missing
    if (!AppState.productSelections[product.id]) {
      AppState.productSelections[product.id] = {
        karat: product.defaultKarat,
        color: product.defaultColor,
        size: "14 (Indian)",
        engraving: ""
      };
    }

    const selection = AppState.productSelections[product.id];
    let currentKarat = selection.karat || product.defaultKarat;
    let currentColor = selection.color || product.defaultColor;

    // Update Page Meta & Breadcrumb
    document.title = `${product.title} | Swarn Mahal Jewellers Ambikapur`;
    const bcTitle = document.getElementById("pdp-breadcrumb-title");
    if (bcTitle) bcTitle.textContent = product.title;
    const bcCat = document.getElementById("pdp-breadcrumb-category");
    if (bcCat) {
      bcCat.textContent = product.collection;
      bcCat.href = `${product.category}.html`;
    }

    // Set Product Info
    const collTag = document.getElementById("pdp-collection-tag");
    if (collTag) collTag.textContent = product.collection;

    const titleEl = document.getElementById("pdp-product-title");
    if (titleEl) titleEl.textContent = product.title;

    const ratingEl = document.getElementById("pdp-rating-text");
    if (ratingEl) ratingEl.textContent = `${product.rating} / 5.0 (${product.reviews} Verified Customer Reviews)`;

    const descEl = document.getElementById("pdp-description-text");
    if (descEl) descEl.textContent = product.description;

    const huidBadge = document.getElementById("pdp-huid-badge");
    if (huidBadge) huidBadge.textContent = `BIS HUID: ${product.huid}`;

    // Render Thumbnails and Main Image
    const mainViewport = document.getElementById("pdp-main-img");
    const activeImg = (product.images && product.images[currentColor]) || product.images.yellow;
    if (mainViewport) mainViewport.src = activeImg;

    const galleryImages = (product.images && product.images.gallery && product.images.gallery.length > 0)
      ? product.images.gallery
      : [activeImg, product.images.hover || activeImg];

    const thumbStrip = document.getElementById("pdp-thumb-strip");
    if (thumbStrip) {
      thumbStrip.innerHTML = galleryImages.map((imgSrc, idx) => `
        <div class="pdp-thumb-item ${idx === 0 ? 'active' : ''}" onclick="UI.changePDPMainImage('${imgSrc}', this)">
          <img src="${imgSrc}" alt="Angle view ${idx + 1}" />
        </div>
      `).join('');
    }

    // Render Karat Selector
    const karatWrap = document.getElementById("pdp-karat-wrap");
    if (karatWrap) {
      karatWrap.innerHTML = product.supportedKarats.map(k => `
        <div class="pdp-karat-btn ${k === currentKarat ? 'active' : ''}" onclick="UI.selectPDPKarat('${product.id}', '${k}')">
          <span class="pdp-karat-name">${k} Gold</span>
          <span class="pdp-karat-purity">${k === '24K' ? '99.9% Pure' : k === '22K' ? '91.6% Hallmark' : k === '18K' ? '75.0% Diamond' : '58.3% Luxe'}</span>
        </div>
      `).join('');
    }

    // Render Color Swatches
    const colorWrap = document.getElementById("pdp-color-wrap");
    if (colorWrap) {
      colorWrap.innerHTML = product.supportedColors.map(c => `
        <div class="pdp-color-btn ${c === currentColor ? 'active' : ''}" onclick="UI.selectPDPColor('${product.id}', '${c}')">
          <span class="color-dot ${c}"></span>
          <span>${c.toUpperCase()} GOLD</span>
        </div>
      `).join('');
    }

    // Update Price Breakup & Hero Display
    this.updatePDPPriceHero(product, currentKarat);

    // Engraving input live listener
    const engravingInput = document.getElementById("pdp-engraving-input");
    const engravingPreview = document.getElementById("pdp-engraving-preview");
    if (engravingInput && engravingPreview) {
      engravingInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        engravingPreview.textContent = val 
          ? `Laser Inner Preview: "✦ ${val} ✦"` 
          : "Laser inner band engraving preview will appear here...";
        selection.engraving = val;
      });
    }

    // Pincode Checker Handler
    const pinBtn = document.getElementById("pdp-pincode-btn");
    const pinInput = document.getElementById("pdp-pincode-input");
    const pinStatus = document.getElementById("pdp-delivery-status");
    if (pinBtn && pinInput && pinStatus) {
      pinBtn.onclick = () => {
        const code = pinInput.value.trim();
        if (code === "497001" || code.startsWith("497")) {
          pinStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Ambikapur Flagship Express:</strong> Same-day pickup / In-store consultation available today.`;
        } else if (code.length === 6) {
          pinStatus.innerHTML = `<i class="fa-solid fa-truck-fast"></i> <strong>Insured Express Delivery:</strong> Estimated delivery in 2-3 business days via Sequel Secure Logistics.`;
        } else {
          pinStatus.innerHTML = `<span style="color: #C62828;"><i class="fa-solid fa-circle-xmark"></i> Please enter a valid 6-digit Indian PIN code.</span>`;
        }
      };
    }

    // Action Buttons
    const addCartBtn = document.getElementById("pdp-add-cart-btn");
    if (addCartBtn) {
      addCartBtn.onclick = () => {
        const sizeSelect = document.getElementById("pdp-size-select");
        const size = sizeSelect ? sizeSelect.value : "Standard";
        AppState.addToCart(product, {
          karat: currentKarat,
          color: currentColor,
          size: size,
          engraving: selection.engraving
        });
        document.getElementById("cart-drawer-overlay").classList.add("active");
      };
    }

    const buyNowBtn = document.getElementById("pdp-buy-now-btn");
    if (buyNowBtn) {
      buyNowBtn.onclick = () => {
        const sizeSelect = document.getElementById("pdp-size-select");
        const size = sizeSelect ? sizeSelect.value : "Standard";
        AppState.addToCart(product, {
          karat: currentKarat,
          color: currentColor,
          size: size,
          engraving: selection.engraving
        });
        document.getElementById("cart-drawer-overlay").classList.add("active");
      };
    }

    // Populate Specifications Table
    this.populatePDPSpecs(product, currentKarat, currentColor);

    // Render Related Products Carousel / Grid
    const relatedContainer = document.getElementById("pdp-related-grid");
    if (relatedContainer) {
      const related = PRODUCTS_CATALOG.filter(p => p.id !== product.id && (p.category === product.category || p.navCategories.some(c => product.navCategories.includes(c)))).slice(0, 4);
      relatedContainer.innerHTML = related.map(p => this.renderProductCardHTML(p)).join('');
    }

    // Subscribe to live bullion market rate changes for real-time recalculations
    AppState.subscribe(() => {
      const sel = AppState.productSelections[product.id] || {};
      const activeK = sel.karat || currentKarat;
      this.updatePDPPriceHero(product, activeK);
      this.populatePDPSpecs(product, activeK, sel.color || currentColor);
    });
  },

  /**
   * Switch PDP Main Gallery Image
   */
  changePDPMainImage(src, thumbElement) {
    const mainImg = document.getElementById("pdp-main-img");
    if (mainImg) mainImg.src = src;

    document.querySelectorAll(".pdp-thumb-item").forEach(t => t.classList.remove("active"));
    if (thumbElement) thumbElement.classList.add("active");
  },

  /**
   * PDP Karat Selection Trigger
   */
  selectPDPKarat(productId, karat) {
    AppState.setProductKarat(productId, karat);
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;

    document.querySelectorAll(".pdp-karat-btn").forEach(btn => {
      btn.classList.toggle("active", btn.textContent.includes(karat));
    });

    this.updatePDPPriceHero(product, karat);
    this.populatePDPSpecs(product, karat, AppState.productSelections[productId].color);
  },

  /**
   * PDP Color Selection Trigger
   */
  selectPDPColor(productId, color) {
    AppState.setProductColor(productId, color);
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;

    document.querySelectorAll(".pdp-color-btn").forEach(btn => {
      btn.classList.toggle("active", btn.textContent.toLowerCase().includes(color));
    });

    const activeImg = (product.images && product.images[color]) || product.images.yellow;
    const mainImg = document.getElementById("pdp-main-img");
    if (mainImg) mainImg.src = activeImg;

    this.populatePDPSpecs(product, AppState.productSelections[productId].karat, color);
  },

  /**
   * Update PDP Dynamic Price Banner and Real-Time Interactive Breakdown Table
   */
  updatePDPPriceHero(product, karat) {
    const selection = AppState.productSelections[product.id] || {};
    const currentKarat = karat || selection.karat || product.defaultKarat;
    const makingCharge = selection.makingCharge || { type: "percent", value: product.makingChargePercent || 15 };
    const makingType = makingCharge.type || "percent";
    const makingVal = Number(makingCharge.value !== undefined ? makingCharge.value : (makingType === "per_gram" ? (product.makingChargePerGram || 650) : (product.makingChargePercent || 15)));

    const breakdown = PricingEngine.calculateBreakdown(product, currentKarat, AppState.bullionRates, null, {
      type: makingType,
      value: makingVal
    });
    
    // Update Hero Price & Savings Badge
    const heroPrice = document.getElementById("pdp-hero-price");
    if (heroPrice) heroPrice.textContent = PricingEngine.formatINR(breakdown.finalPrice);

    const origPrice = document.getElementById("pdp-hero-original-price");
    if (origPrice) {
      if (breakdown.hasDiscount) {
        origPrice.textContent = PricingEngine.formatINR(breakdown.originalPrice);
        origPrice.style.display = "inline";
      } else {
        origPrice.style.display = "none";
      }
    }

    const savingsBadge = document.getElementById("pdp-hero-savings-badge");
    if (savingsBadge) {
      if (breakdown.hasDiscount) {
        savingsBadge.textContent = `Save ${PricingEngine.formatINR(breakdown.savingsAmount)} (${breakdown.discountPct}% OFF Making)`;
        savingsBadge.style.display = "inline-block";
      } else {
        savingsBadge.style.display = "none";
      }
    }

    // Live In-Page Cost Breakdown Table
    const breakdownBody = document.getElementById("pdp-breakdown-card-body");
    if (breakdownBody) {
      const isPercent = makingType === "percent";
      const presets = isPercent ? [8, 10, 12, 15, 18, 22] : [450, 550, 650, 750, 900];

      const diamondRow = breakdown.diamondSpecs ? `
        <tr>
          <td>
            <div class="calc-cell-component">
              <i class="fa-regular fa-gem"></i>
              <span>Diamonds / Solitaire</span>
            </div>
          </td>
          <td>
            <div class="calc-cell-formula">
              <span>${breakdown.diamondSpecs.totalCaratWeight} ct • ${breakdown.diamondSpecs.clarity} (${breakdown.diamondSpecs.cut})</span>
              <span class="calc-formula-sub">@ ${PricingEngine.formatINR(breakdown.diamondSpecs.pricePerCarat)}/ct (${breakdown.diamondSpecs.stoneCount || 1} Stones)</span>
            </div>
          </td>
          <td>
            <div class="calc-cell-amount">${PricingEngine.formatINR(breakdown.diamondCost)}</div>
          </td>
        </tr>
      ` : (product.gemstoneSpecs ? `
        <tr>
          <td>
            <div class="calc-cell-component">
              <i class="fa-regular fa-gem"></i>
              <span>${product.gemstoneSpecs.stoneType || 'Natural Gemstone'}</span>
            </div>
          </td>
          <td>
            <div class="calc-cell-formula">
              <span>${product.gemstoneSpecs.weightCarat || 0} Carats Natural Precious Stone</span>
              <span class="calc-formula-sub">Assayed & Certified</span>
            </div>
          </td>
          <td>
            <div class="calc-cell-amount">${PricingEngine.formatINR(breakdown.diamondCost || 0)}</div>
          </td>
        </tr>
      ` : '');

      breakdownBody.innerHTML = `
        <!-- 100% Itemized Live Calculation Table -->
        <div class="pdp-calc-table-wrap">
          <table class="pdp-calc-table">
            <thead>
              <tr>
                <th style="width: 32%;">Itemized Component</th>
                <th style="width: 44%;">Live Rate / Formula</th>
                <th style="width: 24%;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <!-- Row 1: Pure Gold Value -->
              <tr>
                <td>
                  <div class="calc-cell-component">
                    <i class="fa-solid fa-crown"></i>
                    <span>${breakdown.karat} Pure Gold</span>
                  </div>
                </td>
                <td>
                  <div class="calc-cell-formula">
                    <span>${breakdown.netGoldWeight} g Net Weight @ ${PricingEngine.formatINR(breakdown.ratePerGram)}/g</span>
                    <span class="calc-formula-sub">Live Bullion Synced (${breakdown.karat} Hallmark)</span>
                  </div>
                </td>
                <td>
                  <div class="calc-cell-amount">${PricingEngine.formatINR(breakdown.metalCost)}</div>
                </td>
              </tr>

              <!-- Row 2: Diamonds / Gemstones -->
              ${diamondRow}

              <!-- Row 3: Making Charges -->
              <tr>
                <td>
                  <div class="calc-cell-component">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Making Charges</span>
                  </div>
                </td>
                <td>
                  <div class="calc-cell-formula">
                    <span>${isPercent ? `${breakdown.makingPct}% of Gold Value` : `${PricingEngine.formatINR(breakdown.makingPerGram)}/g on ${breakdown.grossWeight}g gross`}</span>
                    ${breakdown.hasDiscount ? `<span class="calc-discount-pill">${breakdown.discountPct}% Festive OFF (-${PricingEngine.formatINR(breakdown.discountAmount)})</span>` : ''}
                  </div>
                </td>
                <td>
                  <div class="calc-cell-amount">
                    ${breakdown.hasDiscount ? `<span class="calc-strike">${PricingEngine.formatINR(breakdown.baseMakingCharges)}</span>` : ''}
                    <span>${PricingEngine.formatINR(breakdown.effectiveMakingCharges)}</span>
                  </div>
                </td>
              </tr>

              <!-- Row 4: Taxable Subtotal -->
              <tr class="calc-row-subtotal">
                <td>
                  <div class="calc-cell-component">
                    <i class="fa-solid fa-file-invoice"></i>
                    <span>Taxable Subtotal</span>
                  </div>
                </td>
                <td>
                  <div class="calc-cell-formula">
                    <span class="calc-formula-sub">Metal + Stones + Effective Making</span>
                  </div>
                </td>
                <td>
                  <div class="calc-cell-amount">${PricingEngine.formatINR(breakdown.taxableSubtotal)}</div>
                </td>
              </tr>

              <!-- Row 5: 3% GST -->
              <tr>
                <td>
                  <div class="calc-cell-component">
                    <i class="fa-solid fa-scale-balanced"></i>
                    <span>GST (3% HSN 7113)</span>
                  </div>
                </td>
                <td>
                  <div class="calc-cell-formula">
                    <span>1.5% CGST (${PricingEngine.formatINR(breakdown.cgstAmount)}) + 1.5% SGST (${PricingEngine.formatINR(breakdown.sgstAmount)})</span>
                  </div>
                </td>
                <td>
                  <div class="calc-cell-amount">${PricingEngine.formatINR(breakdown.gstAmount)}</div>
                </td>
              </tr>

              <!-- Row 6: Grand Total -->
              <tr class="calc-row-total">
                <td>
                  <div class="calc-cell-component" style="font-weight: 700;">
                    <i class="fa-solid fa-shield-halved" style="color: var(--gold-deep);"></i>
                    <span>Grand Total</span>
                  </div>
                </td>
                <td>
                  <div class="calc-cell-formula">
                    <span class="huid-mini-tag"><i class="fa-solid fa-certificate"></i> BIS HUID: ${product.huid}</span>
                  </div>
                </td>
                <td>
                  <div class="calc-cell-amount calc-total-grand">${PricingEngine.formatINR(breakdown.finalPrice)}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="breakdown-formula-footer">
          <span><i class="fa-solid fa-scale-balanced"></i> 24K Benchmark: <strong>${PricingEngine.formatINR(AppState.bullionRates.gold24k)}/g</strong></span>
          <span><i class="fa-solid fa-truck-shield"></i> 100% Transit Insured & Legal BIS Assayed</span>
        </div>
      `;
    }
  },

  /**
   * PDP Making Charge Interactive Handlers
   */
  setPDPMakingType(productId, type) {
    const selection = AppState.productSelections[productId] || {};
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;
    const defaultVal = type === "per_gram" ? (product.makingChargePerGram || 650) : (product.makingChargePercent || 15);
    AppState.setProductMakingCharge(productId, { type, value: defaultVal });
    this.updatePDPPriceHero(product, selection.karat || product.defaultKarat);
  },

  setPDPMakingPreset(productId, val) {
    const selection = AppState.productSelections[productId] || {};
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;
    AppState.setProductMakingCharge(productId, { value: Number(val) });
    this.updatePDPPriceHero(product, selection.karat || product.defaultKarat);
  },

  onPDPMakingInputChange(productId, rawVal) {
    const val = Math.max(0, Number(rawVal) || 0);
    const selection = AppState.productSelections[productId] || {};
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;
    AppState.setProductMakingCharge(productId, { value: val });
    this.updatePDPPriceHero(product, selection.karat || product.defaultKarat);
  },

  stepPDPMaking(productId, delta) {
    const selection = AppState.productSelections[productId] || {};
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;
    const currentCharge = selection.makingCharge || { type: "percent", value: product.makingChargePercent || 15 };
    const step = currentCharge.type === "per_gram" ? 50 : 1;
    const newVal = Math.max(0, (Number(currentCharge.value) || 0) + (delta * step));
    AppState.setProductMakingCharge(productId, { value: newVal });
    this.updatePDPPriceHero(product, selection.karat || product.defaultKarat);
  },

  /**
   * Populate PDP Technical Specs Table
   */
  populatePDPSpecs(product, karat, color) {
    const table = document.getElementById("pdp-specs-grid");
    if (!table) return;

    table.innerHTML = `
      <div class="pdp-spec-row">
        <span class="pdp-spec-label">Precious Metal:</span>
        <span class="pdp-spec-value">${karat} Pure Gold (${color.toUpperCase()})</span>
      </div>
      <div class="pdp-spec-row">
        <span class="pdp-spec-label">Net Gold Weight:</span>
        <span class="pdp-spec-value">${product.netGoldWeightGrams} Grams</span>
      </div>
      <div class="pdp-spec-row">
        <span class="pdp-spec-label">Gross Item Weight:</span>
        <span class="pdp-spec-value">${product.grossWeightGrams} Grams</span>
      </div>
      <div class="pdp-spec-row">
        <span class="pdp-spec-label">BIS Hallmark HUID:</span>
        <span class="pdp-spec-value">${product.huid} (Assayed)</span>
      </div>
      <div class="pdp-spec-row">
        <span class="pdp-spec-label">Certification:</span>
        <span class="pdp-spec-value">${product.certificate}</span>
      </div>
      <div class="pdp-spec-row">
        <span class="pdp-spec-label">Dimensions / Sizing:</span>
        <span class="pdp-spec-value">${product.dimensions || 'Custom Size Available'}</span>
      </div>
      <div class="pdp-spec-row">
        <span class="pdp-spec-label">Diamond / Stone Grade:</span>
        <span class="pdp-spec-value">${product.diamondSpecs ? `${product.diamondSpecs.totalCaratWeight} ct • ${product.diamondSpecs.clarity} (${product.diamondSpecs.cut})` : product.gemstoneSpecs ? `${product.gemstoneSpecs.stoneType} (${product.gemstoneSpecs.weightCarat} ct)` : 'Pure Gold Piece'}</span>
      </div>
      <div class="pdp-spec-row">
        <span class="pdp-spec-label">Return & Buyback:</span>
        <span class="pdp-spec-value">Lifetime 100% Exchange Policy</span>
      </div>
    `;
  },

  /**
   * Ambikapur Showroom Mosaic Gallery
   */
  renderShowroomGallery() {
    const container = document.getElementById("showroom-mosaic");
    if (!container) return;

    container.innerHTML = SHOWROOM_GALLERY.map(item => `
      <div class="mosaic-img-card">
        <img src="${item.src}" alt="${item.title}" loading="lazy" />
        <div class="mosaic-caption">
          <strong>${item.title}</strong>
        </div>
      </div>
    `).join('');
  },

  /**
   * Customer Reviews
   */
  renderReviews() {
    const container = document.getElementById("reviews-grid");
    if (!container) return;

    container.innerHTML = REVIEWS_DATA.map(rev => `
      <div class="review-card">
        <div>
          <div class="review-stars">★ ★ ★ ★ ★</div>
          <p class="review-text">"${rev.text}"</p>
        </div>
        <div class="reviewer-meta">
          <div>
            <div class="reviewer-name">${rev.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${rev.date}</div>
          </div>
          <div class="reviewer-badge">
            <i class="fa-solid fa-circle-check"></i> ${rev.badge}
          </div>
        </div>
      </div>
    `).join('');
  },

  /**
   * Cost Breakup Modal
   */
  openBreakupModal(productId) {
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;

    const selection = AppState.productSelections[product.id] || { 
      karat: product.defaultKarat, 
      color: product.defaultColor,
      makingCharge: { type: "percent", value: product.makingChargePercent || 15 }
    };
    const karat = selection.karat || product.defaultKarat;
    const color = selection.color || product.defaultColor;

    const breakdown = PricingEngine.calculateBreakdown(product, karat, AppState.bullionRates, null, selection.makingCharge);
    const modal = document.getElementById("breakup-modal");
    if (!modal) return;

    document.getElementById("breakup-product-img").src = (product.images && product.images[color]) || product.images.yellow;
    document.getElementById("breakup-product-title").textContent = product.title;
    document.getElementById("breakup-product-subtitle").textContent = `${karat} ${color.toUpperCase()} GOLD • NET WT: ${product.netGoldWeightGrams}g`;

    const tableBody = document.getElementById("breakup-table-body");
    tableBody.innerHTML = `
      <tr>
        <td><strong>Pure Metal Cost (${karat})</strong><br><span style="font-size: 0.76rem; color: var(--text-muted);">${breakdown.netGoldWeight}g × ${PricingEngine.formatINR(breakdown.ratePerGram)}/g</span></td>
        <td style="text-align: right;"><strong>${PricingEngine.formatINR(breakdown.metalCost)}</strong></td>
      </tr>
      <tr>
        <td><strong>Diamonds / Precious Stones</strong><br><span style="font-size: 0.76rem; color: var(--text-muted);">${breakdown.diamondSpecs ? `${breakdown.diamondSpecs.stoneCount || 1} Stones • ${breakdown.diamondSpecs.totalCaratWeight} ct (${breakdown.diamondSpecs.clarity})` : product.gemstoneSpecs ? `${product.gemstoneSpecs.stoneType} (${product.gemstoneSpecs.weightCarat} ct)` : 'None'}</span></td>
        <td style="text-align: right;"><strong>${PricingEngine.formatINR(breakdown.diamondCost)}</strong></td>
      </tr>
      <tr>
        <td><strong>Making Charges (${breakdown.makingType === 'per_gram' ? `₹${breakdown.makingPerGram}/g` : `${breakdown.makingPct}%`})</strong><br><span style="font-size: 0.76rem; color: var(--rose-gold);">${breakdown.hasDiscount ? `${breakdown.discountPct}% Festive Discount Applied (-${PricingEngine.formatINR(breakdown.discountAmount)})` : 'Standard Karigar Crafting'}</span></td>
        <td style="text-align: right;">
          ${breakdown.hasDiscount ? `<span style="text-decoration: line-through; font-size: 0.76rem; color: var(--text-muted); margin-right: 0.3rem;">${PricingEngine.formatINR(breakdown.baseMakingCharges)}</span>` : ''}
          <strong>${PricingEngine.formatINR(breakdown.effectiveMakingCharges)}</strong>
        </td>
      </tr>
      <tr>
        <td><strong>Taxable Value (Subtotal)</strong></td>
        <td style="text-align: right;"><strong>${PricingEngine.formatINR(breakdown.taxableSubtotal)}</strong></td>
      </tr>
      <tr>
        <td><strong>Applicable GST (3% under HSN 7113)</strong><br><span style="font-size: 0.76rem; color: var(--text-muted);">CGST 1.5% (${PricingEngine.formatINR(breakdown.cgstAmount)}) + SGST 1.5% (${PricingEngine.formatINR(breakdown.sgstAmount)})</span></td>
        <td style="text-align: right;"><strong>${PricingEngine.formatINR(breakdown.gstAmount)}</strong></td>
      </tr>
      <tr class="total-row">
        <td><strong>Final Transparency Price (All-Inclusive)</strong></td>
        <td style="text-align: right; color: var(--rose-gold);"><strong>${PricingEngine.formatINR(breakdown.finalPrice)}</strong></td>
      </tr>
    `;

    document.getElementById("breakup-huid-code").textContent = product.huid;
    document.getElementById("breakup-cert-code").textContent = product.certificate;

    modal.classList.add("active");
  },

  /**
   * Quick View Modal
   */
  openQuickView(productId) {
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;

    const selection = AppState.productSelections[product.id] || { karat: product.defaultKarat, color: product.defaultColor };
    const currentKarat = selection.karat || product.defaultKarat;
    const currentColor = selection.color || product.defaultColor;
    const breakdown = PricingEngine.calculateBreakdown(product, currentKarat, AppState.bullionRates);

    const modal = document.getElementById("quickview-modal");
    if (!modal) return;

    const mainImg = document.getElementById("qv-main-img");
    mainImg.src = (product.images && product.images[currentColor]) || product.images.yellow;

    document.getElementById("qv-title").textContent = product.title;
    document.getElementById("qv-collection").textContent = product.collection;
    document.getElementById("qv-price").textContent = PricingEngine.formatINR(breakdown.finalPrice);
    document.getElementById("qv-desc").textContent = product.description;

    const karatContainer = document.getElementById("qv-karat-options");
    karatContainer.innerHTML = product.supportedKarats.map(k => `
      <button class="karat-pill ${k === currentKarat ? 'active' : ''}" 
              onclick="AppState.setProductKarat('${product.id}', '${k}'); UI.openQuickView('${product.id}')">
        ${k}
      </button>
    `).join('');

    const colorContainer = document.getElementById("qv-color-options");
    colorContainer.innerHTML = product.supportedColors.map(c => `
      <span class="color-dot ${c} ${c === currentColor ? 'active' : ''}" 
            title="${c.toUpperCase()}"
            onclick="AppState.setProductColor('${product.id}', '${c}'); UI.openQuickView('${product.id}')">
      </span>
    `).join('');

    const addBtn = document.getElementById("qv-add-to-cart-btn");
    addBtn.onclick = () => {
      const engravingInput = document.getElementById("qv-engraving-input");
      const engraving = engravingInput ? engravingInput.value : "";
      AppState.addToCart(product, { karat: currentKarat, color: currentColor, engraving });
      modal.classList.remove("active");
    };

    modal.classList.add("active");
  },

  /**
   * AR Virtual Try-On Simulator Modal
   */
  openARTryOn(productId) {
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("ar-tryon-modal");
    if (!modal) {
      alert(`Launching Augmented Reality 3D Try-On for ${product.title}... Align face with camera.`);
      return;
    }

    document.getElementById("ar-product-title").textContent = `Virtual Try-On: ${product.title}`;
    const overlayImg = document.getElementById("ar-overlay-piece");
    if (overlayImg) overlayImg.src = product.images.yellow;

    modal.classList.add("active");
  },

  /**
   * Slide-out Cart Drawer
   */
  renderCart() {
    const countBadge = document.getElementById("header-cart-count");
    if (countBadge) countBadge.textContent = AppState.getCartCount();

    const cartList = document.getElementById("cart-items-list");
    if (!cartList) return;

    if (AppState.cart.length === 0) {
      cartList.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: var(--gold-light); margin-bottom: 1rem;"></i>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">Your jewellery vault is empty.</p>
          <button class="btn btn-gold btn-sm" style="margin-top: 1rem;" onclick="document.getElementById('cart-drawer-overlay').classList.remove('active')">
            Explore Collections
          </button>
        </div>
      `;
      const sub = document.getElementById("cart-subtotal");
      const gst = document.getElementById("cart-gst");
      const tot = document.getElementById("cart-total");
      if (sub) sub.textContent = "₹0";
      if (gst) gst.textContent = "₹0";
      if (tot) tot.textContent = "₹0";
      const pa = document.getElementById("pan-alert");
      if (pa) pa.classList.remove("active");
      return;
    }

    cartList.innerHTML = AppState.cart.map((item, idx) => `
      <div class="cart-item-card">
        <span class="cart-item-remove" onclick="AppState.removeFromCart(${idx})" title="Remove">
          <i class="fa-solid fa-xmark"></i>
        </span>
        <img class="cart-item-thumb" src="${item.image}" alt="${item.title}" />
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-meta">${item.karat} Gold • ${item.color.toUpperCase()} • HUID: ${item.huid}</div>
          <div class="cart-item-price-row">
            <span class="cart-item-price">${PricingEngine.formatINR(item.unitPrice * item.quantity)}</span>
            <div class="cart-qty-ctrl">
              <span class="cart-qty-btn" onclick="AppState.updateCartQuantity(${idx}, ${item.quantity - 1})">-</span>
              <span>${item.quantity}</span>
              <span class="cart-qty-btn" onclick="AppState.updateCartQuantity(${idx}, ${item.quantity + 1})">+</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    const subtotal = AppState.getCartTotal();
    const gst = Math.round(subtotal * 0.03);
    const total = subtotal;

    const subEl = document.getElementById("cart-subtotal");
    const gstEl = document.getElementById("cart-gst");
    const totEl = document.getElementById("cart-total");

    if (subEl) subEl.textContent = PricingEngine.formatINR(subtotal - gst);
    if (gstEl) gstEl.textContent = PricingEngine.formatINR(gst);
    if (totEl) totEl.textContent = PricingEngine.formatINR(total);

    const panAlert = document.getElementById("pan-alert");
    if (panAlert) {
      if (total >= 200000) {
        panAlert.classList.add("active");
      } else {
        panAlert.classList.remove("active");
      }
    }
  },

  /**
   * Update 15-Minute Dynamic Price Lock Timer UI
   */
  updatePriceLockTimer(secondsRemaining) {
    const timerElem = document.getElementById("price-lock-timer-val");
    if (timerElem) {
      const mins = Math.floor(secondsRemaining / 60);
      const secs = secondsRemaining % 60;
      timerElem.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    const pdpTimer = document.getElementById("pdp-price-lock-timer-val");
    if (pdpTimer) {
      const mins = Math.floor(secondsRemaining / 60);
      const secs = secondsRemaining % 60;
      pdpTimer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  },

  /**
   * Render 21st.dev Style Luxury Bento Collage Gallery
   */
  renderCollageGallery(categoryFilter = "all") {
    const container = document.getElementById("collage-grid-container");
    if (!container || typeof COLLAGE_GALLERY_DATA === "undefined") return;

    const filtered = categoryFilter === "all" 
      ? COLLAGE_GALLERY_DATA 
      : COLLAGE_GALLERY_DATA.filter(item => item.category === categoryFilter);

    container.innerHTML = filtered.map(item => `
      <div class="collage-item ${item.spanClass} reveal-scale" onclick="UI.openLightboxModal('${item.id}')">
        <img class="collage-img" src="${item.image}" alt="${item.title}" loading="lazy" />
        <div class="collage-overlay"></div>
        <div class="collage-top-tag">${item.badge}</div>
        <div class="collage-bottom-plaque">
          <div class="collage-info-col">
            <h4>${item.title}</h4>
            <p>${item.specs}</p>
          </div>
          <div class="collage-expand-btn">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </div>
        </div>
      </div>
    `).join('');

    if (typeof window.refreshScrollReveal === 'function') {
      setTimeout(() => window.refreshScrollReveal(), 50);
    }
  },

  /**
   * Open High-Res Lightbox Modal
   */
  openLightboxModal(itemId) {
    const item = COLLAGE_GALLERY_DATA.find(g => g.id === itemId);
    if (!item) return;

    const modal = document.getElementById("gallery-lightbox-modal");
    if (!modal) return;

    document.getElementById("lightbox-img").src = item.image;
    document.getElementById("lightbox-tag").textContent = item.badge;
    document.getElementById("lightbox-title").textContent = item.title;
    document.getElementById("lightbox-desc").textContent = item.desc;
    document.getElementById("lightbox-specs").textContent = item.specs;

    const waBtn = document.getElementById("lightbox-whatsapp-btn");
    if (waBtn) {
      const msg = encodeURIComponent(`Hello Swarn Mahal Jewellers Ambikapur, I would like to inquire about "${item.title}" (${item.specs}).`);
      waBtn.href = `https://wa.me/919999777740?text=${msg}`;
    }

    modal.classList.add("active");
  }
};
