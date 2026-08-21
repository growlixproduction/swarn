import fs from "fs";
import path from "path";
import { Product } from "./types";
import { PRODUCTS_CATALOG } from "./catalogData";

const PRODUCTS_FILE_PATH = path.join(process.cwd(), "data", "products.json");

export function getCustomProducts(): Product[] {
  try {
    if (fs.existsSync(PRODUCTS_FILE_PATH)) {
      const data = fs.readFileSync(PRODUCTS_FILE_PATH, "utf-8");
      const list = JSON.parse(data);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (err) {
    console.warn("Failed to read products.json:", err);
  }
  return PRODUCTS_CATALOG;
}

export function saveCustomProducts(products: Product[]) {
  try {
    const dir = path.dirname(PRODUCTS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write products.json:", err);
  }
}

export function updateOrAddProduct(product: Product): Product[] {
  const current = getCustomProducts();
  const existingIdx = current.findIndex(p => p.id === product.id || p.slug === product.slug);

  let updatedList: Product[];
  if (existingIdx >= 0) {
    updatedList = current.map((p, idx) => (idx === existingIdx ? { ...p, ...product } : p));
  } else {
    updatedList = [product, ...current];
  }

  saveCustomProducts(updatedList);

  // Also update in-memory catalog
  const catalogIdx = PRODUCTS_CATALOG.findIndex(p => p.id === product.id || p.slug === product.slug);
  if (catalogIdx >= 0) {
    PRODUCTS_CATALOG[catalogIdx] = { ...PRODUCTS_CATALOG[catalogIdx], ...product };
  } else {
    PRODUCTS_CATALOG.unshift(product);
  }

  return updatedList;
}

export function deleteProductFromStore(productId: string): Product[] {
  const current = getCustomProducts();
  const updatedList = current.filter(p => p.id !== productId && p.slug !== productId);
  saveCustomProducts(updatedList);
  return updatedList;
}
