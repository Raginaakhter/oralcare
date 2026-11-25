"use client";

import React from "react";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import { SmartImage } from "@/components/SmartImage";
import { useStore, formatPriceBDT } from "@/context/StoreContext";
import { brandName, productHref, productImage, stockLabel } from "@/lib/products";
import {
  ArrowRightIcon,
  CartIcon,
  HeartIcon,
} from "@/components/icons";

export default function WishlistPage() {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    wishlistCount,
    showToast,
  } = useStore();

  const handleAddAllToCart = () => {
    wishlist.forEach((p) => {
      addToCart(p, 1, false);
    });
    showToast("All wishlist items moved to cart!", "success");
  };

  return (
    <>
      <PageHero
        title="My Wishlist"
        subtitle={
          wishlistCount > 0
            ? `${wishlistCount} saved item${wishlistCount === 1 ? "" : "s"} waiting for you.`
            : "Save your favorite oral care products for later."
        }
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {wishlist.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl bg-white p-12 text-center ring-1 ring-slate-100 shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <HeartIcon className="h-10 w-10" />
            </div>
            <h3 className="mt-5 text-xl font-extrabold text-slate-900">
              Your wishlist is empty
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Explore our store and tap the heart icon on any product to save it here.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-dark shadow-md"
            >
              Explore Products <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header action bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 shadow-sm">
              <div className="text-sm text-slate-600">
                You have <strong className="text-slate-900">{wishlistCount}</strong> items saved
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-dark"
                >
                  <CartIcon className="h-3.5 w-3.5" />
                  Add All to Cart
                </button>
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-600"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm">
              <table className="hidden w-full md:table">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">SKU</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {wishlist.map((p) => (
                    <tr key={p.slug} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Link
                            href={productHref(p)}
                            className="relative h-16 w-16 overflow-hidden rounded-xl bg-brand-soft"
                          >
                            <SmartImage
                              src={productImage(p)}
                              alt={p.productName}
                              fill
                              sizes="64px"
                              className="object-contain p-1"
                            />
                          </Link>
                          <div>
                            <div className="text-[10px] font-bold uppercase text-brand-dark">
                              {brandName(p)}
                            </div>
                            <Link
                              href={productHref(p)}
                              className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-brand-dark"
                            >
                              {p.productName}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-500">{p.sku}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-extrabold text-slate-900">
                        {formatPriceBDT(p.effectivePrice)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${stockLabel(p).tone === "out" ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200"}`}>{stockLabel(p).label}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => addToCart(p, 1, true)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
                          >
                            <CartIcon className="h-3.5 w-3.5" />
                            Add to Cart
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(p.slug)}
                            aria-label="Remove"
                            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                          >
                            &times;
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card List */}
              <div className="divide-y divide-slate-100 md:hidden">
                {wishlist.map((p) => (
                  <div key={p.slug} className="flex items-center gap-4 p-4">
                    <Link
                      href={productHref(p)}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-soft"
                    >
                      <SmartImage
                        src={productImage(p)}
                        alt={p.productName}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase text-brand-dark">
                        {brandName(p)}
                      </div>
                      <Link
                        href={productHref(p)}
                        className="line-clamp-2 text-xs font-bold text-slate-900"
                      >
                        {p.productName}
                      </Link>
                      <div className="mt-1 text-xs font-black text-slate-900">{formatPriceBDT(p.effectivePrice)}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(p, 1, true)}
                          className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white"
                        >
                          <CartIcon className="h-3 w-3" />
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(p.slug)}
                          className="text-[11px] font-semibold text-rose-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom info banner */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft p-6 ring-1 ring-brand/15">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-sm">
                  <HeartIcon className="h-5 w-5 fill-current text-brand" />
                </span>
                <div className="flex-1">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Saved For Later
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Your wishlist is saved on your device and will be waiting when you return.
                  </p>
                </div>
              </div>

              <Link
                href="/shop"
                className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-blue-soft via-white to-brand-soft p-6 ring-1 ring-slate-200 transition hover:-translate-y-0.5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-blue-dark shadow-sm">
                  <ArrowRightIcon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Browse More Products
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Check out new arrivals and special whitening offers.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
