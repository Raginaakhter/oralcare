/**
 * Helpers for the backend Product shape (GET /products, GET /products/:idOrSlug).
 * Components read products through these so populated vs. id-only refs,
 * missing images and sale prices are handled in one place.
 */
import { assetUrl } from "@/lib/api/config";
import type { Product, ProductVariation, RefLite } from "@/lib/api/types";

export type { Product, ProductVariation };

function ref(v: RefLite | string | null | undefined): RefLite | null {
  return v && typeof v === "object" ? v : null;
}

export function productHref(p: Pick<Product, "slug">): string {
  return `/product/${p.slug}`;
}

/** Main image: thumbnail → first image (by order) → placeholder. */
export function productImage(p: Pick<Product, "thumbnail" | "images">): string {
  if (p.thumbnail) return assetUrl(p.thumbnail);
  const first = [...(p.images ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];
  return assetUrl(first?.url);
}

/** Every image for the gallery, thumbnail first, de-duplicated. */
export function productImages(p: Pick<Product, "thumbnail" | "images">): string[] {
  const urls = [
    ...(p.thumbnail ? [p.thumbnail] : []),
    ...[...(p.images ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((i) => i.url),
  ].map((u) => assetUrl(u));
  const unique = Array.from(new Set(urls));
  return unique.length ? unique : [assetUrl(null)];
}

export function brandName(p: Pick<Product, "brand">): string {
  return ref(p.brand as RefLite | string | null)?.name ?? "";
}

export function brandId(p: Pick<Product, "brand">): string | null {
  const b = p.brand;
  if (!b) return null;
  return typeof b === "string" ? b : b._id;
}

export function categoryRef(p: Pick<Product, "category">): RefLite | null {
  return ref(p.category);
}

export function categoryId(p: Pick<Product, "category">): string {
  const c = p.category;
  return typeof c === "string" ? c : c?._id;
}

export function hasSale(p: Pick<Product, "salePrice" | "regularPrice">): boolean {
  return typeof p.salePrice === "number" && p.salePrice < p.regularPrice;
}

export function discountPercent(p: Pick<Product, "salePrice" | "regularPrice">): number {
  if (!hasSale(p) || !p.regularPrice) return 0;
  return Math.round(((p.regularPrice - (p.salePrice as number)) / p.regularPrice) * 100);
}

export function isPurchasable(p: Pick<Product, "stockStatus" | "productType" | "variations">): boolean {
  if (p.productType === "variable") {
    return p.variations.some((v) => (v.stockQuantity ?? 0) > 0);
  }
  return p.stockStatus !== "out-of-stock";
}

export function stockLabel(p: Pick<Product, "stockStatus" | "stockQuantity">): {
  label: string;
  tone: "ok" | "low" | "out";
} {
  if (p.stockStatus === "out-of-stock") return { label: "Out of stock", tone: "out" };
  if (p.stockStatus === "low-stock")
    return { label: `Only ${p.stockQuantity} left`, tone: "low" };
  return { label: "In stock", tone: "ok" };
}

/** Card badge derived from real data: sold out → discount → featured → low stock. */
export function productBadge(
  p: Pick<Product, "salePrice" | "regularPrice" | "isFeatured" | "stockStatus">
): { label: string; className: string } | null {
  if (p.stockStatus === "out-of-stock") return { label: "SOLD OUT", className: "bg-slate-500" };
  const pct = discountPercent(p);
  if (pct > 0) return { label: `-${pct}%`, className: "bg-rose-500" };
  if (p.isFeatured) return { label: "HOT", className: "bg-rose-500" };
  if (p.stockStatus === "low-stock") return { label: "LOW STOCK", className: "bg-amber-500" };
  return null;
}

/** "size: 250ml · color: blue" */
export function variationLabel(v: Pick<ProductVariation, "attributes">): string {
  return Object.entries(v.attributes ?? {})
    .map(([k, val]) => `${k}: ${val}`)
    .join(" · ");
}

export function variationPrice(p: Product, v?: ProductVariation | null): number {
  return typeof v?.price === "number" ? v.price : p.effectivePrice;
}
