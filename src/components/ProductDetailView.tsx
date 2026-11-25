"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPriceBDT } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { SmartImage } from "@/components/SmartImage";
import { ProductReviews } from "@/components/ProductReviews";
import { Stars } from "@/components/Stars";
import {
  brandName,
  categoryRef,
  discountPercent,
  productBadge,
  productImages,
  variationLabel,
  variationPrice,
  type Product,
  type ProductVariation,
} from "@/lib/products";
import {
  CartIcon,
  HeartIcon,
  ShieldIcon,
  TruckIcon,
  ReturnIcon,
  CheckBadgeIcon,
  SparkIcon,
  ArrowRightIcon,
} from "@/components/icons";

export function ProductDetailView({
  product,
  related,
  freeShippingThreshold,
}: {
  product: Product;
  related: Product[];
  freeShippingThreshold?: number | null;
}) {
  const { addToCart, buyNow, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.slug);
  const images = useMemo(() => productImages(product), [product]);
  const isVariable = product.productType === "variable" && product.variations.length > 0;

  const [selectedImg, setSelectedImg] = useState(images[0]);
  const [variation, setVariation] = useState<ProductVariation | null>(
    isVariable ? product.variations.find((v) => (v.stockQuantity ?? 0) > 0) ?? null : null
  );
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");

  const brand = brandName(product);
  const category = categoryRef(product);
  const badge = productBadge(product);
  const unitPrice = variationPrice(product, variation);
  const compareAt =
    typeof variation?.price === "number" ? null : discountPercent(product) > 0 ? product.regularPrice : null;
  const available = isVariable ? variation?.stockQuantity ?? 0 : product.stockQuantity;
  const outOfStock = available <= 0;
  const needsVariation = isVariable && !variation;
  const specs = Object.entries(product.specifications ?? {});

  const pickVariation = (v: ProductVariation) => {
    setVariation(v);
    setQty(1);
    if (v.image) setSelectedImg(v.image);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="relative">
          <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 animate-blob rounded-full bg-slate-200/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 animate-blob rounded-full bg-slate-200/60 blur-3xl" />
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft ring-1 ring-brand/15">
            <SmartImage
              src={selectedImg}
              alt={product.productName}
              fill
              sizes="(min-width: 768px) 500px, 90vw"
              className="object-contain p-10 transition-all duration-300"
              preload
              loading="eager"
            />
            {badge && (
              <span
                className={`absolute left-6 top-6 rounded-full ${badge.className} px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md`}
              >
                {badge.label}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.slice(0, 8).map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedImg(img)}
                  className={`relative aspect-square overflow-hidden rounded-xl bg-slate-50 ring-2 transition ${
                    selectedImg === img ? "ring-brand" : "ring-slate-100 hover:ring-slate-200"
                  }`}
                >
                  <SmartImage src={img} alt="" fill sizes="100px" className="object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & actions */}
        <div>
          {brand && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
              <SparkIcon className="h-3 w-3" />
              {brand}
            </span>
          )}
          <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold text-slate-900 break-words">
            {product.productName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {product.reviewCount ? (
              <button type="button" onClick={() => setActiveTab("reviews")} className="inline-flex items-center gap-1.5 hover:text-brand-dark">
                <Stars value={product.averageRating ?? 0} />
                <span>
                  {(product.averageRating ?? 0).toFixed(1)} · {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
                </span>
              </button>
            ) : null}
            <span>SKU: {variation?.sku || product.sku}</span>
          </div>

          <div className="mt-4 sm:mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {formatPriceBDT(unitPrice)}
            </span>
            {compareAt && (
              <span className="text-lg font-semibold text-slate-400 line-through">
                {formatPriceBDT(compareAt)}
              </span>
            )}
            {compareAt && (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600 ring-1 ring-rose-100">
                Save {discountPercent(product)}%
              </span>
            )}
          </div>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-600 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {isVariable && (
            <div className="mt-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                Choose an option
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variations.map((v) => {
                  const soldOut = (v.stockQuantity ?? 0) <= 0;
                  const active = variation?._id === v._id;
                  return (
                    <button
                      key={v._id}
                      type="button"
                      disabled={soldOut}
                      onClick={() => pickVariation(v)}
                      className={`rounded-full border px-4 py-2 text-xs font-bold capitalize transition ${
                        active
                          ? "border-brand bg-brand-soft text-brand-dark"
                          : "border-slate-200 bg-white text-slate-700 hover:border-brand"
                      } disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through`}
                    >
                      {Object.values(v.attributes).join(" / ") || variationLabel(v)}
                      {typeof v.price === "number" && (
                        <span className="ml-1.5 font-semibold text-slate-500">{formatPriceBDT(v.price)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            {outOfStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700 ring-1 ring-rose-200">
                {needsVariation ? "Select an option" : "Out of stock"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <CheckBadgeIcon className="h-3.5 w-3.5" />
                {available <= product.lowStockThreshold ? `Only ${available} left` : "In stock"}
              </span>
            )}
            <span className="text-slate-500">Dispatches in 24 hours</span>
          </div>

          <div className="mt-5 sm:mt-6 flex items-center gap-2 sm:gap-3">
            <div className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-9 sm:h-11 sm:w-11 rounded-l-full text-base sm:text-lg text-slate-500 hover:bg-slate-50"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(Math.max(1, available), 100, q + 1))}
                className="h-10 w-9 sm:h-11 sm:w-11 rounded-r-full text-base sm:text-lg text-slate-500 hover:bg-slate-50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={outOfStock}
              onClick={() => addToCart(product, qty, true, variation)}
              className="inline-flex flex-1 min-w-0 items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-brand px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-brand-dark transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CartIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label="Add to wishlist"
              className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full ring-1 transition ${
                inWishlist
                  ? "bg-rose-50 text-rose-500 ring-rose-200"
                  : "bg-white text-brand-dark ring-slate-200 hover:bg-brand-soft"
              }`}
            >
              <HeartIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${inWishlist ? "fill-current text-rose-500" : ""}`} />
            </button>
          </div>

          <button
            type="button"
            disabled={outOfStock}
            onClick={() => buyNow(product, qty, variation)}
            className="mt-2.5 sm:mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-brand-dark shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buy Now <ArrowRightIcon className="h-4 w-4" />
          </button>

          <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:grid-cols-3">
            <Trust icon={<ShieldIcon className="h-4 w-4" />} title="100% Authentic" sub="Australian Origin" />
            <Trust
              icon={<TruckIcon className="h-4 w-4" />}
              title={freeShippingThreshold ? `Free Ship ${formatPriceBDT(freeShippingThreshold)}+` : "Nationwide Delivery"}
              sub="All 64 districts"
            />
            <Trust icon={<ReturnIcon className="h-4 w-4" />} title="7-Day Returns" sub="Hassle free" />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-8 ring-1 ring-slate-100">
        <div className="flex gap-4 sm:gap-6 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
          {(["desc", "specs", "reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-3 text-xs sm:text-sm font-bold transition shrink-0 whitespace-nowrap ${
                activeTab === t ? "border-b-2 border-brand text-brand-dark" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {t === "desc" ? "Description" : t === "specs" ? "Specifications" : `Reviews${product.reviewCount ? ` (${product.reviewCount})` : ""}`}
            </button>
          ))}
        </div>

        {activeTab === "desc" && (
          <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
            <p className="whitespace-pre-line">{product.description}</p>
            {product.features.length > 0 && (
              <ul className="mt-4 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/shop?tag=${encodeURIComponent(t)}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-brand-soft hover:text-brand-dark"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && <ProductReviews slug={product.slug} />}

        {activeTab === "specs" && (
          <div className="mt-6">
            <dl className="grid gap-4 sm:grid-cols-2 text-sm">
              {brand && <Spec label="Brand" value={brand} />}
              {category && <Spec label="Category" value={category.name} />}
              <Spec label="SKU" value={variation?.sku || product.sku} />
              {typeof product.weight === "number" && <Spec label="Weight" value={`${product.weight} g`} />}
              {product.dimensions &&
                (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
                  <Spec
                    label="Dimensions"
                    value={`${product.dimensions.length ?? "–"} × ${product.dimensions.width ?? "–"} × ${
                      product.dimensions.height ?? "–"
                    } ${product.dimensions.unit ?? "cm"}`}
                  />
                )}
              {specs.map(([k, v]) => (
                <Spec key={k} label={k} value={v} />
              ))}
            </dl>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark">
                Recommended For You
              </span>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">You May Also Like</h2>
            </div>
            {category && (
              <Link
                href={`/shop?category=${category.slug}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark hover:underline"
              >
                View All <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Trust({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand shadow-sm">{icon}</span>
      <div>
        <div className="font-bold text-slate-800">{title}</div>
        <div className="text-[10px] text-slate-500">{sub}</div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <dt className="text-xs text-slate-500 font-semibold uppercase">{label}</dt>
      <dd className="mt-1 font-bold text-slate-900 capitalize">{value}</dd>
    </div>
  );
}
