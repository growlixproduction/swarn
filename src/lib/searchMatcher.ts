import { Product } from "./types";

/**
 * Intelligent Smart NLP Search Matcher
 * Ensures searching for "ring" returns ONLY rings (no coins, no necklaces).
 * Searching for "gold ring" returns gold rings (no silver rings, no coins).
 * Searching for "earring" returns all earrings/jhumkas/tops/balis.
 */
export function matchesSearchQuery(product: Product, searchQuery: string): boolean {
  if (!searchQuery || !searchQuery.trim()) return true;

  const rawQuery = searchQuery.toLowerCase().trim();
  const tokens = rawQuery.split(/\s+/).filter(Boolean);

  // Helper keyword checks
  const isRingQuery = tokens.some(t => ["ring", "rings", "angutthi"].includes(t));
  const isEarringQuery = tokens.some(t => ["earring", "earrings", "jhumka", "jhumkas", "top", "tops", "stud", "studs", "bali", "balis"].includes(t));
  const isNecklaceQuery = tokens.some(t => ["necklace", "necklaces", "haar", "choker"].includes(t));
  const isMangalsutraQuery = tokens.some(t => ["mangalsutra", "mangalsutras", "tanmaniya"].includes(t));
  const isCoinQuery = tokens.some(t => ["coin", "coins", "bar", "bars", "bullion", "laxmi", "ganesh"].includes(t));
  const isPendantQuery = tokens.some(t => ["pendant", "pendants", "locket", "lockets"].includes(t));
  const isBangleQuery = tokens.some(t => ["bangle", "bangles", "kada", "kadas", "bracelet", "bracelets"].includes(t));
  const isNosePinQuery = tokens.some(t => ["nose", "nath", "pin", "studs"].includes(t));

  const pTitle = product.title.toLowerCase();
  const pCategory = (product.category || "").toLowerCase();
  const pCollection = (product.collection || "").toLowerCase();
  const pNav = (product.navCategories || []).map(c => c.toLowerCase());
  const pKeywords = (product.searchKeywords || "").toLowerCase();

  // Strict Exclusion Rules for Intent-based queries
  if (isRingQuery) {
    const titleIsRing = pTitle.includes("ring") || pTitle.includes("angutthi");
    const categoryIsRing = pCategory === "rings" || pNav.includes("rings") || pCollection.includes("ring");
    if (!titleIsRing && !categoryIsRing) return false;
  }

  if (isEarringQuery) {
    const titleIsEarring = pTitle.includes("earring") || pTitle.includes("jhumka") || pTitle.includes("top") || pTitle.includes("stud") || pTitle.includes("bali") || pTitle.includes("drop");
    const categoryIsEarring = pCategory === "earrings" || pNav.includes("earrings") || pCollection.includes("earring");
    if (!titleIsEarring && !categoryIsEarring) return false;
  }

  if (isCoinQuery) {
    const titleIsCoin = pTitle.includes("coin") || pTitle.includes("bar") || pTitle.includes("bullion") || pTitle.includes("laxmi") || pTitle.includes("ganesh");
    const categoryIsCoin = pCategory === "bullion" || pNav.includes("bullion") || pCollection.includes("bullion");
    if (!titleIsCoin && !categoryIsCoin) return false;
  }

  if (isNecklaceQuery) {
    const titleIsNecklace = pTitle.includes("necklace") || pTitle.includes("haar") || pTitle.includes("choker");
    const categoryIsNecklace = pCategory === "necklaces" || pNav.includes("necklaces") || pCollection.includes("necklace");
    if (!titleIsNecklace && !categoryIsNecklace) return false;
  }

  if (isMangalsutraQuery) {
    const titleIsMangalsutra = pTitle.includes("mangalsutra") || pTitle.includes("tanmaniya");
    const categoryIsMangalsutra = pCategory === "mangalsutra" || pNav.includes("mangalsutra") || pCollection.includes("mangalsutra");
    if (!titleIsMangalsutra && !categoryIsMangalsutra) return false;
  }

  if (isPendantQuery) {
    const titleIsPendant = pTitle.includes("pendant") || pTitle.includes("locket");
    const categoryIsPendant = pCategory === "pendants" || pNav.includes("pendants") || pCollection.includes("pendant");
    if (!titleIsPendant && !categoryIsPendant) return false;
  }

  if (isBangleQuery) {
    const titleIsBangle = pTitle.includes("bangle") || pTitle.includes("kada") || pTitle.includes("bracelet");
    const categoryIsBangle = pCategory === "bangles" || pNav.includes("bangles") || pCollection.includes("bangle") || pCollection.includes("bracelet");
    if (!titleIsBangle && !categoryIsBangle) return false;
  }

  if (isNosePinQuery && rawQuery.includes("nose")) {
    const titleIsNose = pTitle.includes("nose") || pTitle.includes("nath") || pTitle.includes("pin");
    const categoryIsNose = pCategory === "nose-pins" || pNav.includes("nose-pins") || pCollection.includes("nose");
    if (!titleIsNose && !categoryIsNose) return false;
  }

  // Metal & Gemstone Qualifier Filtering
  const isGoldSearch = tokens.includes("gold") && !tokens.includes("silver");
  const isSilverSearch = tokens.includes("silver") || tokens.includes("silverware");
  const isDiamondSearch = tokens.includes("diamond") || tokens.includes("solitaire");

  if (isGoldSearch && pCategory === "silverware") {
    return false;
  }

  if (isSilverSearch && pCategory !== "silverware" && !pTitle.includes("silver")) {
    return false;
  }

  if (isDiamondSearch && !product.diamondSpecs && !pTitle.includes("diamond") && !pTitle.includes("solitaire") && !pCollection.includes("diamond")) {
    return false;
  }

  // Tokenized Match Check across full product searchable text
  const fullText = `${pTitle} ${pCategory} ${pCollection} ${pNav.join(" ")} ${pKeywords} ${product.description || ""}`.toLowerCase();

  return tokens.every(token => fullText.includes(token));
}
