/**
 * SAWARN LUXURY JEWELS - APPLICATION ENTRY POINT & EVENT CONTROLLER
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize state and tools
  AppState.init();
  if (typeof Tools !== "undefined" && Tools.init) {
    Tools.init();
  }

  const pageType = document.body.dataset.pageType || "home";
  const categorySlug = document.body.dataset.category || "all";

  // Common Header & Widget Renders
  UI.renderTicker(AppState.bullionRates);
  UI.renderCart();

  // Page Specific Initializations
  if (pageType === "plp") {
    setupPLPFilters(categorySlug);
    UI.renderPLP(categorySlug);
  } else if (pageType === "pdp") {
    UI.initPDP();
  } else {
    // Home Page
    UI.renderProducts(PRODUCTS_CATALOG);
    UI.renderCollageGallery();
    UI.renderShowroomGallery();
    UI.renderReviews();
    setupHeroSlider();
    setupFilterTabs();
    setupCollageFilters();
  }

  // Subscribe UI updates to AppState changes
  AppState.subscribe((changeType, state) => {
    if (changeType === "rates") {
      UI.renderTicker(state.bullionRates);
      if (pageType === "plp") {
        UI.renderPLP(categorySlug);
      } else if (pageType === "pdp") {
        UI.initPDP();
      } else {
        UI.renderProducts(PRODUCTS_CATALOG);
      }
    } else if (changeType === "product_variant" || changeType === "filter") {
      if (pageType === "plp") {
        UI.renderPLP(categorySlug);
      } else if (pageType === "home") {
        UI.renderProducts(PRODUCTS_CATALOG);
      }
    } else if (changeType === "cart") {
      UI.renderCart();
    } else if (changeType === "wishlist") {
      if (pageType === "plp") {
        UI.renderPLP(categorySlug);
      } else if (pageType === "home") {
        UI.renderProducts(PRODUCTS_CATALOG);
      }
    } else if (changeType === "timer") {
      UI.updatePriceLockTimer(state.priceLockSecondsRemaining);
    }
  });

  // Setup Global Event Listeners
  setupHeaderEvents();
  setupModalBackdrops();
  setupAdminSimulator();
  setupScrollReveal();
  runGoldCalculator();
});

let selectedCalcKarat = "24K";

function selectCalcKarat(karat) {
  selectedCalcKarat = karat;
  document.querySelectorAll(".karat-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.karat === karat);
  });
  runGoldCalculator();
}

function setCalcWeight(weight) {
  const input = document.getElementById("calc-gold-weight");
  if (input) {
    input.value = weight;
    document.querySelectorAll(".preset-pill").forEach(pill => {
      pill.classList.toggle("active", pill.textContent.startsWith(weight + "g"));
    });
    runGoldCalculator();
  }
}

function runGoldCalculator() {
  const weightInput = document.getElementById("calc-gold-weight");
  if (!weightInput) return;

  const weight = parseFloat(weightInput.value) || 0;
  const base24k = (typeof AppState !== "undefined" && AppState.bullionRates) ? AppState.bullionRates.gold24k : 15928;
  const res = PricingEngine.calculateOldGoldValue(weight, selectedCalcKarat, { gold24k: base24k });

  const ratePerGramEl = document.getElementById("calc-rate-per-gram-display");
  const grossEl = document.getElementById("calc-gross-value");
  const meltEl = document.getElementById("calc-melt-loss");
  const netEl = document.getElementById("calc-net-credit");

  if (ratePerGramEl) ratePerGramEl.textContent = `Rate: ₹${res.ratePerGram.toLocaleString('en-IN')} / g`;
  if (grossEl) grossEl.textContent = PricingEngine.formatINR(res.grossValue);
  if (meltEl) meltEl.textContent = `-₹${res.meltLoss.toLocaleString('en-IN')}`;
  if (netEl) netEl.textContent = PricingEngine.formatINR(res.netExchangeCredit);
}

/**
 * PLP Faceted Sidebar & Sort Event Listeners
 */
function setupPLPFilters(categorySlug) {
  const priceSlider = document.getElementById("plp-price-range");
  const priceVal = document.getElementById("plp-price-val");
  const sortSelect = document.getElementById("plp-sort-select");
  const resetBtn = document.getElementById("plp-reset-filters");

  if (priceSlider && priceVal) {
    priceSlider.addEventListener("input", (e) => {
      priceVal.textContent = `₹${Number(e.target.value).toLocaleString('en-IN')}`;
      UI.renderPLP(categorySlug);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      UI.renderPLP(categorySlug);
    });
  }

  // Karat checkboxes
  document.querySelectorAll(".plp-karat-checkbox").forEach(cb => {
    cb.addEventListener("change", () => {
      UI.renderPLP(categorySlug);
    });
  });

  // Color filter pills
  document.querySelectorAll(".filter-color-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-color-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      UI.renderPLP(categorySlug);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      UI.resetPLPFilters(categorySlug);
    });
  }
}

/**
 * Hero Slider Controller (Autoplay, Prev/Next, Dots & Swipes)
 */
function setupHeroSlider() {
  const track = document.getElementById("hero-slider-track");
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".slider-dot");
  const prevBtn = document.getElementById("hero-slider-prev");
  const nextBtn = document.getElementById("hero-slider-next");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  function updateSlider(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((s, idx) => {
      if (idx === currentIndex) {
        s.classList.add("active");
      } else {
        s.classList.remove("active");
      }
    });

    dots.forEach((d, idx) => {
      if (idx === currentIndex) {
        d.classList.add("active");
      } else {
        d.classList.remove("active");
      }
    });
  }

  function nextSlide() {
    updateSlider(currentIndex + 1);
  }

  function prevSlide() {
    updateSlider(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      updateSlider(idx);
      startAutoplay();
    });
  });

  const viewport = document.querySelector(".hero-slider-viewport");
  if (viewport) {
    viewport.addEventListener("mouseenter", stopAutoplay);
    viewport.addEventListener("mouseleave", startAutoplay);

    let touchStartX = 0;
    let touchEndX = 0;

    viewport.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
        startAutoplay();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
        startAutoplay();
      }
    }, { passive: true });
  }

  startAutoplay();
}

/**
 * Header interactions, Search & Category Tabs, Cart toggles
 */
function setupHeaderEvents() {
  const header = document.getElementById("main-header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      if (header) header.classList.add("scrolled");
    } else {
      if (header) header.classList.remove("scrolled");
    }
  });

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      AppState.searchQuery = e.target.value;
      const pageType = document.body.dataset.pageType;
      const cat = document.body.dataset.category || "all";
      if (pageType === "plp") {
        UI.renderPLP(cat);
      } else if (pageType === "home") {
        AppState.notify("filter");
      }
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const prodSec = document.querySelector("#products-section") || document.querySelector("#plp-products-grid");
        if (prodSec) prodSec.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Cart Drawer Toggles
  const cartBtn = document.getElementById("header-cart-btn");
  const cartOverlay = document.getElementById("cart-drawer-overlay");
  const closeCartBtn = document.getElementById("close-cart-btn");

  if (cartBtn && cartOverlay) {
    cartBtn.addEventListener("click", () => {
      cartOverlay.classList.add("active");
    });
  }

  if (closeCartBtn && cartOverlay) {
    closeCartBtn.addEventListener("click", () => {
      cartOverlay.classList.remove("active");
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", (e) => {
      if (e.target === cartOverlay) {
        cartOverlay.classList.remove("active");
      }
    });
  }
}

// Global Quick Filter helper for popular search tags
window.quickFilter = function(term) {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = term;
    AppState.searchQuery = term;
    const pageType = document.body.dataset.pageType;
    const cat = document.body.dataset.category || "all";
    if (pageType === "plp") {
      UI.renderPLP(cat);
    } else {
      AppState.notify("filter");
      const productsSec = document.querySelector("#products-section");
      if (productsSec) productsSec.scrollIntoView({ behavior: "smooth" });
    }
  }
};

/**
 * Filter tabs switcher (Home)
 */
function setupFilterTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      AppState.activeCategory = btn.dataset.category || "all";
      AppState.notify("filter");
    });
  });
}

/**
 * Collage Gallery Category Filter Switcher
 */
function setupCollageFilters() {
  const pillBtns = document.querySelectorAll(".collage-pill-btn");
  pillBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      pillBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.collageCategory || "all";
      UI.renderCollageGallery(category);
    });
  });
}

/**
 * Modal Close Buttons & Backdrops
 */
function setupModalBackdrops() {
  const modals = document.querySelectorAll(".modal-backdrop");
  modals.forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });

    const closeBtn = modal.querySelector(".modal-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
      });
    }
  });
}

/**
 * Admin Live Bullion Rate Simulator
 */
function setupAdminSimulator() {
  const adminToggleBtn = document.getElementById("admin-rate-float-btn");
  const adminDrawer = document.getElementById("admin-drawer");
  const adminCloseBtn = document.getElementById("admin-drawer-close");
  const rateSlider = document.getElementById("admin-rate-24k-slider");
  const rateLabel = document.getElementById("admin-rate-24k-val");
  const spikeBtn = document.getElementById("admin-spike-btn");
  const dipBtn = document.getElementById("admin-dip-btn");

  if (adminToggleBtn && adminDrawer) {
    adminToggleBtn.addEventListener("click", () => {
      adminDrawer.classList.toggle("active");
    });
  }

  if (adminCloseBtn && adminDrawer) {
    adminCloseBtn.addEventListener("click", () => {
      adminDrawer.classList.remove("active");
    });
  }

  if (rateSlider && rateLabel) {
    rateSlider.addEventListener("input", (e) => {
      const newRate = parseInt(e.target.value);
      rateLabel.textContent = `₹${newRate.toLocaleString('en-IN')}/g`;
      AppState.setBullionRate(newRate);
    });
  }

  if (spikeBtn) {
    spikeBtn.addEventListener("click", () => {
      const current = AppState.bullionRates.gold24k;
      const spiked = current + 150;
      if (rateSlider) rateSlider.value = spiked;
      if (rateLabel) rateLabel.textContent = `₹${spiked.toLocaleString('en-IN')}/g`;
      AppState.bullionRates.trend24h = "+2.15%";
      AppState.setBullionRate(spiked);
    });
  }

  if (dipBtn) {
    dipBtn.addEventListener("click", () => {
      const current = AppState.bullionRates.gold24k;
      const dipped = Math.max(current - 150, 6000);
      if (rateSlider) rateSlider.value = dipped;
      if (rateLabel) rateLabel.textContent = `₹${dipped.toLocaleString('en-IN')}/g`;
      AppState.bullionRates.trend24h = "-1.85%";
      AppState.setBullionRate(dipped);
    });
  }
}

/**
 * Advanced Directional Scroll Reveal Animations Observer
 */
function setupScrollReveal() {
  const selector = ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger";
  const reveals = document.querySelectorAll(selector);

  function checkInitialViewport() {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 50) {
        el.classList.add("active");
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { 
    threshold: 0.05,
    rootMargin: "0px 0px -20px 0px"
  });

  reveals.forEach(el => observer.observe(el));
  
  // Trigger initial visibility
  setTimeout(checkInitialViewport, 50);

  window.refreshScrollReveal = function() {
    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 50) {
        el.classList.add("active");
      }
    });
  };
}
