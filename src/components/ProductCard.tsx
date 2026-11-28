"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CartIcon,
  HeartIcon,
  SparkIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { SmartImage } from "@/components/SmartImage";
import { Stars } from "@/components/Stars";
import {
  brandName,
  hasSale,
  isPurchasable,
  productBadge,
  productHref,
  productImage,
  stockLabel,
  type Product,
} from "@/lib/products";
import { formatPriceBDT } from "@/lib/format";
import { useStore } from "@/context/StoreContext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, buyNow, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.slug);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const name = product.productName;
  const href = productHref(product);
  const img = productImage(product);
  const brand = brandName(product);
  const badge = productBadge(product);
  const onSale = hasSale(product);
  const canBuy = isPurchasable(product);
  const stock = stockLabel(product);
  const isVariable = product.productType === "variable";

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product, 1, true);
    setIsAdding(false);
  };

  const price = (
    <div className="flex items-baseline gap-2">
      <span className="text-base sm:text-lg font-black text-slate-900">
        {isVariable ? "From " : ""}
        {formatPriceBDT(product.effectivePrice)}
      </span>
      {onSale && (
        <span className="text-[11px] sm:text-xs font-semibold text-slate-400 line-through">
          {formatPriceBDT(product.regularPrice)}
        </span>
      )}
    </div>
  );

  return (
    <>
      <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 hover:ring-brand/30">
        {badge && (
          <span
            className={`absolute left-4 top-4 z-10 rounded-full ${badge.className} px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-md`}
          >
            {badge.label}
          </span>
        )}

        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-2 sm:group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={() => toggleWishlist(product)}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full shadow-md ring-1 transition ${
              inWishlist
                ? "bg-rose-50 text-rose-500 ring-rose-200"
                : "bg-white text-slate-500 ring-slate-100 hover:bg-rose-50 hover:text-rose-500"
            }`}
          >
            <HeartIcon className={`h-4 w-4 ${inWishlist ? "fill-current text-rose-500" : ""}`} />
          </button>
          <button
            onClick={() => setQuickViewOpen(true)}
            aria-label="Quick view"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-100 transition hover:bg-brand-soft hover:text-brand-dark"
          >
            <SparkIcon className="h-4 w-4" />
          </button>
        </div>

        <Link href={href} className="relative block overflow-hidden rounded-xl bg-gradient-to-br from-brand-soft via-white to-brand-blue-soft">
          <div className="relative aspect-square">
            <SmartImage
              src={img}
              alt={name}
              fill
              sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-3 sm:p-5 transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        <div className="mt-3 flex flex-1 flex-col px-1">
          {brand && (
            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-dark">
              {brand}
            </div>
          )}
          <Link href={href}>
            <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs sm:text-sm font-bold leading-snug text-slate-900 hover:text-brand-dark">
              {name}
            </h3>
          </Link>
          {product.reviewCount ? (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
              <Stars value={product.averageRating ?? 0} />
              <span>({product.reviewCount})</span>
            </div>
          ) : null}
          <div
            className={`mt-1.5 text-[11px] font-semibold ${
              stock.tone === "out"
                ? "text-rose-600"
                : stock.tone === "low"
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            {stock.label}
          </div>
          <div className="mt-2.5 sm:mt-3 border-t border-slate-100 pt-2.5 sm:pt-3">{price}</div>

          <div className="mt-3 flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || !canBuy}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-brand bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-bold text-brand-dark transition hover:bg-brand-soft active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CartIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {isAdding ? "Adding..." : isVariable ? "Options" : "Add to Cart"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => buyNow(product, 1)}
              disabled={!canBuy}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-blue px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-bold text-white shadow-sm shadow-brand-blue/20 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-blue/30 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="truncate">Buy Now</span>
            </button>
          </div>
        </div>
      </article>

      {quickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="fixed inset-0" onClick={() => setQuickViewOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-100 sm:p-8 animate-scale-up">
            <button
              onClick={() => setQuickViewOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              &times;
            </button>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-soft">
                <SmartImage src={img} alt={name} fill sizes="300px" className="object-contain p-6" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  {brand && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark">
                      {brand}
                    </span>
                  )}
                  <h3 className="mt-1 text-xl font-extrabold text-slate-900">{name}</h3>
                  <div className="mt-3 text-2xl font-black text-brand-dark">{price}</div>
                  <p className="mt-3 text-xs text-slate-600 line-clamp-3">
                    {product.shortDescription || product.description}
                  </p>
                  <div
                    className={`mt-3 flex items-center gap-1.5 text-xs font-semibold ${
                      stock.tone === "out" ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    <CheckBadgeIcon className="h-4 w-4" /> {stock.label}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={!canBuy}
                      onClick={() => {
                        void addToCart(product, 1, true);
                        setQuickViewOpen(false);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-brand bg-white px-4 py-2.5 text-xs font-bold text-brand-dark hover:bg-brand-soft disabled:opacity-50"
                    >
                      <CartIcon className="h-4 w-4" /> Add to Cart
                    </button>
                    <button
                      disabled={!canBuy}
                      onClick={() => {
                        setQuickViewOpen(false);
                        buyNow(product, 1);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      Buy Now
                    </button>
                  </div>
                  <Link
                    href={href}
                    onClick={() => setQuickViewOpen(false)}
                    className="inline-flex w-full items-center justify-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-dark"
                  >
                    View Full Product Details <ArrowRightIcon className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
