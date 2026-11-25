"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useStore, formatPriceBDT } from "@/context/StoreContext";
import { SmartImage } from "@/components/SmartImage";
import { useShippingMethods } from "@/lib/hooks";
import {
  CartIcon,
  ArrowRightIcon,
  TruckIcon,
  ShieldIcon,
  CheckBadgeIcon,
} from "@/components/icons";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQty,
    cartSubtotal,
    cartCount,
    toasts,
    removeToast,
    cartLoading,
  } = useStore();
  const shipping = useShippingMethods();

  // Only show the free-delivery meter when the backend has a threshold configured.
  const freeShippingThreshold = shipping?.freeShippingThreshold ?? 0;
  const progressPercent = freeShippingThreshold
    ? Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100))
    : 0;
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSubtotal);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Toast notifications container */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl p-4 shadow-2xl ring-1 transition-all duration-300 animate-slide-up ${
              toast.type === "error"
                ? "bg-rose-900 text-white ring-rose-700"
                : toast.type === "info"
                ? "bg-slate-900 text-white ring-slate-800"
                : "bg-emerald-950 text-white ring-emerald-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  toast.type === "error"
                    ? "bg-rose-600 text-white"
                    : toast.type === "info"
                    ? "bg-slate-700 text-white"
                    : "bg-emerald-500 text-white"
                }`}
              >
                {toast.type === "error" ? (
                  "!"
                ) : toast.type === "info" ? (
                  "i"
                ) : (
                  <CheckBadgeIcon className="h-4 w-4" />
                )}
              </span>
              <p className="text-xs font-semibold leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white text-sm"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Drawer backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer slide-over */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
              <CartIcon className="h-4 w-4" />
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              Shopping Cart
            </h2>
            <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-black text-white">
              {cartCount}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            &times;
          </button>
        </div>

        {/* Free Shipping Meter */}
        {freeShippingThreshold > 0 && (
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <TruckIcon className="h-3.5 w-3.5 text-brand" />
              {remainingForFree === 0 ? (
                <span className="text-emerald-600 font-bold">
                  You unlocked FREE Delivery! 🎉
                </span>
              ) : (
                <span>
                  Add{" "}
                  <strong className="text-brand-dark">
                    {formatPriceBDT(remainingForFree)}
                  </strong>{" "}
                  more for FREE delivery
                </span>
              )}
            </span>
            <span className="text-[11px] text-slate-500">{progressPercent}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-brand to-brand-dark transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        )}

        {/* Cart Item List */}
        <div className={`flex-1 overflow-y-auto px-6 py-4 transition-opacity ${cartLoading ? "opacity-60" : ""}`}>
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                <CartIcon className="h-10 w-10" />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-slate-900">
                Your cart is empty
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                Explore our dentist-approved oral care items and find your best smile.
              </p>
              <Link
                href="/shop"
                onClick={() => setIsCartOpen(false)}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-dark"
              >
                Shop Now <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 space-y-4">
              {cart.map((item) => {
                const href = item.slug ? `/product/${item.slug}` : "/shop";
                return (
                  <div key={item.key} className="flex gap-4 pt-4 first:pt-0">
                    <Link
                      href={href}
                      onClick={() => setIsCartOpen(false)}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-soft"
                    >
                      <SmartImage
                        src={item.thumbnail}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        {item.brandName && (
                          <div className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">
                            {item.brandName}
                          </div>
                        )}
                        <Link
                          href={href}
                          onClick={() => setIsCartOpen(false)}
                          className="line-clamp-2 text-xs font-bold text-slate-900 hover:text-brand-dark"
                        >
                          {item.productName}
                        </Link>
                        {item.variationAttributes && (
                          <div className="text-[11px] capitalize text-slate-500">
                            {Object.values(item.variationAttributes).join(" / ")}
                          </div>
                        )}
                        <div className="mt-0.5 text-xs font-black text-slate-900">
                          {formatPriceBDT(item.lineTotal)}
                          {item.quantity > 1 && (
                            <span className="ml-1 text-[11px] font-normal text-slate-500">
                              ({formatPriceBDT(item.unitPrice)} each)
                            </span>
                          )}
                        </div>
                        {item.issue && (
                          <div className="mt-1 text-[11px] font-semibold text-rose-600">{item.issue}</div>
                        )}
                      </div>

                      {/* Qty & Remove */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                          <button
                            onClick={() => updateCartQty(item.key, item.quantity - 1)}
                            className="h-7 w-7 rounded-l-full text-slate-500 hover:bg-slate-50 text-xs"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.key, item.quantity + 1)}
                            disabled={item.availableStock > 0 && item.quantity >= item.availableStock}
                            className="h-7 w-7 rounded-r-full text-slate-500 hover:bg-slate-50 text-xs disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-[11px] font-semibold text-rose-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/70 p-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-600">Subtotal</span>
              <span className="text-lg font-black text-slate-900">
                {formatPriceBDT(cartSubtotal)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Shipping & discounts are calculated during checkout.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark transition"
              >
                View Full Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-3 text-xs font-bold text-white shadow-md shadow-brand/30 hover:bg-brand-dark transition"
              >
                Checkout Now
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 pt-1 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldIcon className="h-3 w-3 text-brand" /> 100% Authentic
              </span>
              <span className="flex items-center gap-1">
                <TruckIcon className="h-3 w-3 text-brand" /> Fast Delivery
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
