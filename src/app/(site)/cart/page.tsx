"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import {
  useStore,
  formatPriceBDT,
  parsePriceNumber,
} from "@/context/StoreContext";
import {
  ArrowRightIcon,
  CartIcon,
  TruckIcon,
  ShieldIcon,
  CheckBadgeIcon,
} from "@/components/icons";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartSubtotal,
    cartCount,
    showToast,
  } = useStore();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === "SMILE10" || code === "ORALCARE10") {
      setAppliedCoupon("SMILE10");
      setCouponError("");
      showToast("Coupon 'SMILE10' applied! (10% off)", "success");
    } else if (code === "ORALCARE20") {
      setAppliedCoupon("ORALCARE20");
      setCouponError("");
      showToast("Coupon 'ORALCARE20' applied! (20% off)", "success");
    } else if (code === "FREESHIP") {
      setAppliedCoupon("FREESHIP");
      setCouponError("");
      showToast("Coupon 'FREESHIP' applied! (Free Delivery)", "success");
    } else {
      setCouponError("Invalid coupon code. Try 'SMILE10' or 'FREESHIP'");
      showToast("Invalid coupon code", "error");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
    showToast("Coupon removed", "info");
  };

  // Calculations
  const freeThreshold = 1500;
  const isFreeDelivery = cartSubtotal >= freeThreshold || appliedCoupon === "FREESHIP";
  const shippingFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : 120;

  let discountRate = 0;
  if (appliedCoupon === "SMILE10") discountRate = 0.1;
  if (appliedCoupon === "ORALCARE20") discountRate = 0.2;

  const discountAmount = Math.round(cartSubtotal * discountRate);
  const total = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const remainingForFree = Math.max(0, freeThreshold - cartSubtotal);

  return (
    <>
      <PageHero
        title="Your Shopping Cart"
        subtitle={
          cart.length > 0
            ? `${cartCount} item${cartCount === 1 ? "" : "s"} ready for checkout.`
            : "Review your items before proceeding to checkout."
        }
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Line items list */}
            <div className="space-y-4">
              {/* Free delivery prompt banner */}
              {remainingForFree > 0 && appliedCoupon !== "FREESHIP" && (
                <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200 text-xs sm:text-sm">
                  <span className="flex items-center gap-2 text-amber-900 font-semibold">
                    <TruckIcon className="h-4 w-4 text-amber-700" />
                    Add <strong>{formatPriceBDT(remainingForFree)}</strong> more to get{" "}
                    <span className="text-emerald-700 font-bold">FREE Delivery</span>!
                  </span>
                  <Link
                    href="/shop"
                    className="font-bold text-amber-800 underline hover:text-amber-950"
                  >
                    Add more
                  </Link>
                </div>
              )}

              {cart.map((item) => {
                const itemPrice = parsePriceNumber(item.product.price);
                const lineTotal = itemPrice * item.qty;

                return (
                  <div
                    key={item.product.slug}
                    className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 sm:gap-6 shadow-sm"
                  >
                    <Link
                      href={item.product.href}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-soft sm:h-28 sm:w-28"
                    >
                      <Image
                        src={item.product.img}
                        alt={item.product.name}
                        fill
                        sizes="112px"
                        className="object-contain p-2"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">
                        {item.product.brand}
                      </div>
                      <Link
                        href={item.product.href}
                        className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-brand-dark sm:text-base"
                      >
                        {item.product.name}
                      </Link>
                      <div className="mt-1 text-xs text-slate-500">
                        Price: <span className="font-semibold text-slate-700">{item.product.price}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-4">
                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQty(item.product.slug, item.qty - 1)
                            }
                            className="h-8 w-8 rounded-l-full text-slate-500 hover:bg-slate-50 text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-slate-800">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQty(item.product.slug, item.qty + 1)
                            }
                            className="h-8 w-8 rounded-r-full text-slate-500 hover:bg-slate-50 text-sm"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.slug)}
                          className="text-xs font-semibold text-rose-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-slate-900">
                        {formatPriceBDT(lineTotal)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.qty} × {item.product.price}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Coupon Bar */}
              <div className="rounded-2xl bg-gradient-to-r from-brand-soft to-brand-soft p-4 ring-1 ring-brand/15">
                <form
                  onSubmit={handleApplyCoupon}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="text-sm font-semibold text-slate-700">
                    Have a promo coupon?
                  </span>
                  <div className="flex flex-1 gap-2 min-w-[200px]">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. SMILE10"
                      className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 uppercase"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-white hover:bg-brand-dark"
                    >
                      Apply
                    </button>
                  </div>
                </form>

                {couponError && (
                  <p className="mt-2 text-xs font-semibold text-rose-600">
                    {couponError}
                  </p>
                )}

                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                    <span>
                      Coupon <strong>{appliedCoupon}</strong> active:{" "}
                      {appliedCoupon === "FREESHIP"
                        ? "Free Delivery"
                        : `${discountRate * 100}% Discount Applied`}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Action buttons under cart */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-dark hover:underline"
                >
                  <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
                  Continue Shopping
                </Link>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-600"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>

            {/* Order Summary aside */}
            <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
              <div className="overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Order Summary
                </h3>

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Subtotal ({cartCount} items)</dt>
                    <dd className="font-semibold text-slate-900">
                      {formatPriceBDT(cartSubtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Shipping (Estimated)</dt>
                    <dd
                      className={`font-semibold ${
                        shippingFee === 0 ? "text-emerald-600" : "text-slate-900"
                      }`}
                    >
                      {shippingFee === 0 ? "FREE" : formatPriceBDT(shippingFee)}
                    </dd>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">
                        Discount ({appliedCoupon})
                      </dt>
                      <dd className="font-semibold text-emerald-600">
                        - {formatPriceBDT(discountAmount)}
                      </dd>
                    </div>
                  )}

                  <div className="my-3 border-t border-slate-100" />
                  <div className="flex justify-between text-base">
                    <dt className="font-extrabold text-slate-900">Total</dt>
                    <dd className="font-extrabold text-brand-dark">
                      {formatPriceBDT(total)}
                    </dd>
                  </div>
                </dl>

                <Link
                  href="/checkout"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-dark transition"
                >
                  Proceed to Checkout
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["VISA", "Mastercard", "bKash", "Nagad", "Cash on Delivery"].map((p) => (
                    <span
                      key={p}
                      className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-3 rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft p-6 ring-1 ring-brand/15">
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand ring-1 ring-brand/15">
                    <TruckIcon className="h-4 w-4" />
                  </span>
                  Free delivery on orders over ৳1,500
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-blue-dark ring-1 ring-slate-200">
                    <ShieldIcon className="h-4 w-4" />
                  </span>
                  100% authentic Australian dental care
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand ring-1 ring-brand/15">
                    <CheckBadgeIcon className="h-4 w-4" />
                  </span>
                  7-day easy return policy
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

export function EmptyCart() {
  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-12 text-center ring-1 ring-slate-100 shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
        <CartIcon className="h-10 w-10" />
      </div>
      <h3 className="mt-5 text-xl font-extrabold text-slate-900">
        Your cart is empty
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Start shopping to fill it with authentic Australian oral care products.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-dark shadow-md"
      >
        Shop Products <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
