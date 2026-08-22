"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BullionRates, CartItem, KaratType, MakingChargeConfig, MetalTone, Product } from "../lib/types";
import { INITIAL_BULLION_RATES, PRODUCTS_CATALOG } from "../lib/catalogData";
import { PricingEngine } from "../lib/pricingEngine";

interface ProductSelectionState {
  karat: KaratType;
  color: MetalTone;
  size: string;
  engraving: string;
  makingCharge: MakingChargeConfig;
}

interface AppContextType {
  bullionRates: BullionRates;
  products: Product[];
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  wishlist: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  priceLockSeconds: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCostBreakupOpen: boolean;
  breakupProductId: string | null;
  isARTryOnOpen: boolean;
  arProductId: string | null;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  productSelections: Record<string, ProductSelectionState>;
  setBullionRate: (rate24k: number) => void;
  setProductKarat: (id: string, karat: KaratType) => void;
  setProductColor: (id: string, color: MetalTone) => void;
  setProductSize: (id: string, size: string) => void;
  setProductEngraving: (id: string, text: string) => void;
  setProductMakingCharge: (id: string, makingCharge: Partial<MakingChargeConfig>) => void;
  addToCart: (product: Product, customOptions?: Partial<CartItem>) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, qty: number) => void;
  toggleWishlist: (id: string) => void;
  openCostBreakup: (id: string) => void;
  closeCostBreakup: () => void;
  openARTryOn: (id: string) => void;
  closeARTryOn: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  cartCount: number;
  openCartDrawer: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bullionRates, setRates] = useState<BullionRates>(INITIAL_BULLION_RATES);
  const [products, setProducts] = useState<Product[]>(PRODUCTS_CATALOG);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceLockSeconds, setPriceLockSeconds] = useState<number>(900);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCostBreakupOpen, setIsCostBreakupOpen] = useState<boolean>(false);
  const [breakupProductId, setBreakupProductId] = useState<string | null>(null);
  const [isARTryOnOpen, setIsARTryOnOpen] = useState<boolean>(false);
  const [arProductId, setArProductId] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Initialize Product Selections Map
  const [productSelections, setProductSelections] = useState<Record<string, ProductSelectionState>>(() => {
    const initialMap: Record<string, ProductSelectionState> = {};
    PRODUCTS_CATALOG.forEach(p => {
      initialMap[p.id] = {
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
    return initialMap;
  });

  const refreshProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (err) {
      console.warn("Failed to refresh products in AppContext:", err);
    }
  };

  // Load Persisted Storage & Fetch Live Rates + Products from Database / Store API
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("swarn_next_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWish = localStorage.getItem("swarn_next_wishlist");
      if (savedWish) setWishlist(JSON.parse(savedWish));

      refreshProducts();

      // Fetch live rates from Database API
      fetch("/api/rates")
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.rates) {
            setRates(data.rates);
          }
        })
        .catch(err => console.warn("Rates API fetch error:", err));
    } catch (e) {
      console.warn("Storage loading warning", e);
    }
  }, []);


  // Save Cart Changes
  useEffect(() => {
    try {
      localStorage.setItem("swarn_next_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Save Wishlist Changes
  useEffect(() => {
    try {
      localStorage.setItem("swarn_next_wishlist", JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Price Lock 15-minute Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setPriceLockSeconds(prev => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const setBullionRate = (rate24k: number) => {
    setRates(prev => ({
      ...prev,
      gold24k: rate24k,
      gold22k: Math.round(rate24k * (22 / 24)),
      gold18k: Math.round(rate24k * (18 / 24)),
      gold14k: Math.round(rate24k * (14 / 24)),
      lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }));
  };

  const setProductKarat = (id: string, karat: KaratType) => {
    setProductSelections(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { color: "yellow", size: "14", engraving: "", makingCharge: { type: "percent", value: 15 } }),
        karat
      }
    }));
  };

  const setProductColor = (id: string, color: MetalTone) => {
    setProductSelections(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { karat: "18K", size: "14", engraving: "", makingCharge: { type: "percent", value: 15 } }),
        color
      }
    }));
  };

  const setProductSize = (id: string, size: string) => {
    setProductSelections(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { karat: "18K", color: "yellow", engraving: "", makingCharge: { type: "percent", value: 15 } }),
        size
      }
    }));
  };

  const setProductEngraving = (id: string, text: string) => {
    setProductSelections(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { karat: "18K", color: "yellow", size: "14", makingCharge: { type: "percent", value: 15 } }),
        engraving: text
      }
    }));
  };

  const setProductMakingCharge = (id: string, makingCharge: Partial<MakingChargeConfig>) => {
    setProductSelections(prev => {
      const current = prev[id] || { karat: "18K", color: "yellow", size: "14", engraving: "", makingCharge: { type: "percent", value: 15 } };
      return {
        ...prev,
        [id]: {
          ...current,
          makingCharge: {
            ...current.makingCharge,
            ...makingCharge
          }
        }
      };
    });
  };

  const addToCart = (product: Product, customOptions: Partial<CartItem> = {}) => {
    const currentSel = productSelections[product.id] || {
      karat: product.defaultKarat || "18K",
      color: product.defaultColor || "yellow",
      size: "14 (Indian)",
      engraving: "",
      makingCharge: { type: "percent", value: product.makingChargePercent || 15 }
    };

    const karat = customOptions.karat || currentSel.karat;
    const color = customOptions.color || currentSel.color;
    const size = customOptions.size || currentSel.size;
    const engraving = customOptions.engraving || currentSel.engraving;
    const makingCharge = customOptions.makingCharge || currentSel.makingCharge;

    const breakdown = PricingEngine.calculateBreakdown(product, karat, bullionRates, null, makingCharge);

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id && item.karat === karat && item.color === color);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      } else {
        const activeImg = (product.images && product.images[color]) || product.images.yellow;
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            karat,
            color,
            size,
            engraving,
            makingCharge,
            image: activeImg,
            unitPrice: breakdown.finalPrice,
            originalUnitPrice: breakdown.originalPrice,
            quantity: 1,
            netGoldWeightGrams: product.netGoldWeightGrams,
            huid: product.huid
          }
        ];
      }
    });

    setPriceLockSeconds(900);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const next = [...prev];
      if (next[index]) next[index].quantity = qty;
      return next;
    });
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const openCostBreakup = (id: string) => {
    setBreakupProductId(id);
    setIsCostBreakupOpen(true);
  };

  const closeCostBreakup = () => {
    setIsCostBreakupOpen(false);
    setBreakupProductId(null);
  };

  const openARTryOn = (id: string) => {
    setArProductId(id);
    setIsARTryOnOpen(true);
  };

  const closeARTryOn = () => {
    setIsARTryOnOpen(false);
    setArProductId(null);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <AppContext.Provider
      value={{
        bullionRates,
        products,
        refreshProducts,
        cart,
        wishlist,
        searchQuery,
        setSearchQuery,
        priceLockSeconds,
        isCartOpen,
        setIsCartOpen,
        isCostBreakupOpen,
        breakupProductId,
        isARTryOnOpen,
        arProductId,
        isAdminOpen,
        setIsAdminOpen,
        productSelections,
        setBullionRate,
        setProductKarat,
        setProductColor,
        setProductSize,
        setProductEngraving,
        setProductMakingCharge,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        openCostBreakup,
        closeCostBreakup,
        openARTryOn,
        closeARTryOn,
        getCartTotal,
        getCartCount,
        cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        openCartDrawer: () => setIsCartOpen(true)
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
