"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import { SmartImage } from "@/components/SmartImage";
import { useStore, formatPriceBDT } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useShippingMethods } from "@/lib/hooks";
import {
  couponsApi,
  errorMessage,
  shippingApi,
  type ShippingCalculation,
  type ShippingMethodCode,
} from "@/lib/api";
import { ArrowRightIcon, CartIcon, TruckIcon, ShieldIcon, CheckBadgeIcon } from "@/components/icons";
import { COUPON_STORAGE_KEY } from "@/lib/storage-keys";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQty, clearCart, cartSubtotal, cartCount, showToast, cartSummary } =
    useStore();
  const { status } = useAuth();
  const signedIn = status === "authenticated";
  const shipping = useShippingMethods();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applying, setApplying] = useState(false);
  const [method, setMethod] = useState<ShippingMethodCode>("inside_dhaka");
  const [serverQuote, setQuote] = useState<ShippingCalculation | null>(null);

  // Restore a coupon applied earlier in this session.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(COUPON_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from sessionStorage (client-only)
      if (saved) setCouponInput(saved);
    } catch {
      // ignore
    }
  }, []);

  // Live totals from the server (shipping + coupon) for signed-in shoppers.
  useEffect(() => {
    if (!signedIn || cart.length === 0) return;
    let alive = true;
    shippingApi
      .calculate({ shippingMethod: method, source: "cart", couponCode: appliedCoupon?.code })
      .then((q) => alive && setQuote(q))
      .catch(() => alive && setQuote(null));
    return () => {
      alive = false;
    };
  }, [signedIn, method, appliedCoupon?.code, cart, cartSummary?.subtotal]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (!signedIn) {
      setCouponError("Sign in to apply a coupon.");
      return;
    }
    setApplying(true);
    try {
      const env = await couponsApi.validate({ code, source: "cart" });
      setAppliedCoupon({ code: env.data.code, discount: env.data.discountAmount });
      setCouponError("");
      sessionStorage.setItem(COUPON_STORAGE_KEY, env.data.code);
      showToast(`Coupon '${env.data.code}' applied — you save ${formatPriceBDT(env.data.discountAmount)}`, "success");
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(errorMessage(err, "Invalid coupon code"));
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
    try {
      sessionStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast("Coupon removed", "info");
  };

  // Only trust a server quote while it still applies.
  const quote = signedIn && cart.length > 0 ? serverQuote : null;
  const methodInfo = shipping?.methods.find((m) => m.code === method);
  const shippingFee = quote?.shipping.charge ?? methodInfo?.charge ?? 0;
  const discountAmount = quote?.discount ?? appliedCoupon?.discount ?? 0;
  const total = quote?.grandTotal ?? Math.max(0, cartSubtotal + shippingFee - discountAmount);
  const threshold = shipping?.freeShippingThreshold ?? 0;
  const remainingForFree = threshold ? Math.max(0, threshold - cartSubtotal) : 0;
  const hasIssues = cart.some((l) => l.issue);

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
            <div className="space-y-4">
              {remainingForFree > 0 && (
                <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200 text-xs sm:text-sm">
                  <span className="flex items-center gap-2 text-amber-900 font-semibold">
                    <TruckIcon className="h-4 w-4 text-amber-700" />
                    Add <strong>{formatPriceBDT(remainingForFree)}</strong> more to get{" "}
                    <span className="text-emerald-700 font-bold">FREE Delivery</span>!
                  </span>
                  <Link href="/shop" className="font-bold text-amber-800 underline hover:text-amber-950">
                    Add more
                  </Link>
                </div>
              )}

              {!signedIn && (
                <div className="rounded-2xl bg-brand-soft p-4 text-xs sm:text-sm text-slate-700 ring-1 ring-brand/15">
                  <Link href="/signin?next=/cart" className="font-bold text-brand-dark underline">
                    Sign in
                  </Link>{" "}
                  to save your cart, apply coupons and check out. Items here are kept on this device until then.
                </div>
              )}

              {cart.map((item) => {
                const href = item.slug ? `/product/${item.slug}` : "/shop";
                return (
                  <div
                    key={item.key}
                    className={`flex items-start sm:items-center gap-3 sm:gap-6 rounded-2xl bg-white p-3.5 sm:p-4 shadow-sm ring-1 ${
                      item.issue ? "ring-rose-200" : "ring-slate-100"
                    }`}
                  >
                    <Link
                      href={href}
                      className="relative h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-brand-soft"
                    >
                      <SmartImage src={item.thumbnail} alt={item.productName} fill sizes="112px" className="object-contain p-2" />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {item.brandName && (
                            <div className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">
                              {item.brandName}
                            </div>
                          )}
                          <Link
                            href={href}
                            className="line-clamp-2 text-xs sm:text-base font-semibold text-slate-900 hover:text-brand-dark"
                          >
                            {item.productName}
                          </Link>
                          {item.variationAttributes && (
                            <div className="text-[11px] capitalize text-slate-500">
                              {Object.entries(item.variationAttributes)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" · ")}
                            </div>
                          )}
                          {item.issue && (
                            <div className="mt-1 text-[11px] font-semibold text-rose-600">{item.issue}</div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm sm:text-base font-extrabold text-slate-900">
                            {formatPriceBDT(item.lineTotal)}
                          </div>
                          <div className="text-[10px] sm:text-xs text-slate-400">
                            {item.quantity} × {formatPriceBDT(item.unitPrice)}
                          </div>
                          {item.regularPrice > item.unitPrice && (
                            <div className="text-[10px] text-slate-400 line-through">
                              {formatPriceBDT(item.regularPrice * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.key, item.quantity - 1)}
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-l-full text-slate-500 hover:bg-slate-50 text-xs sm:text-sm font-bold"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-semibold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.key, item.quantity + 1)}
                            disabled={item.availableStock > 0 && item.quantity >= item.availableStock}
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-r-full text-slate-500 hover:bg-slate-50 text-xs sm:text-sm font-bold disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.key)}
                          className="text-[11px] sm:text-xs font-semibold text-rose-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Coupon Bar */}
              <div className="rounded-2xl bg-gradient-to-r from-brand-soft to-brand-soft p-4 ring-1 ring-brand/15">
                <form onSubmit={handleApplyCoupon} className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700">Have a promo coupon?</span>
                  <div className="flex flex-1 gap-2 min-w-[200px]">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter coupon code"
                      className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 uppercase"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
                    >
                      {applying ? "Checking…" : "Apply"}
                    </button>
                  </div>
                </form>

                {couponError && <p className="mt-2 text-xs font-semibold text-rose-600">{couponError}</p>}

                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> active: {formatPriceBDT(discountAmount)} off
                    </span>
                    <button type="button" onClick={handleRemoveCoupon} className="text-rose-600 hover:underline">
                      Remove
                    </button>
                  </div>
                )}
              </div>

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
                  onClick={() => clearCart()}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-600"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
              <div className="overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-900">Order Summary</h3>

                {shipping && shipping.methods.length > 0 && (
                  <label className="mt-4 block text-xs font-bold text-slate-600">
                    Delivery area
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value as ShippingMethodCode)}
                      className="mt-1 h-10 w-full rounded-full border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-brand"
                    >
                      {shipping.methods.map((m) => (
                        <option key={m.code} value={m.code}>
                          {m.name} — {formatPriceBDT(m.charge)}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Subtotal ({cartCount} items)</dt>
                    <dd className="font-semibold text-slate-900">{formatPriceBDT(quote?.subtotal ?? cartSubtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Shipping {quote ? "" : "(Estimated)"}</dt>
                    <dd className={`font-semibold ${shippingFee === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                      {shippingFee === 0 ? "FREE" : formatPriceBDT(shippingFee)}
                    </dd>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Discount ({appliedCoupon?.code})</dt>
                      <dd className="font-semibold text-emerald-600">- {formatPriceBDT(discountAmount)}</dd>
                    </div>
                  )}
                  <div className="my-3 border-t border-slate-100" />
                  <div className="flex justify-between text-base">
                    <dt className="font-extrabold text-slate-900">Total</dt>
                    <dd className="font-extrabold text-brand-dark">{formatPriceBDT(total)}</dd>
                  </div>
                </dl>

                {hasIssues && (
                  <p className="mt-3 rounded-xl bg-rose-50 p-3 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-100">
                    Some items need attention before you can check out.
                  </p>
                )}

                <Link
                  href={signedIn ? `/checkout?shipping=${method}` : "/signin?next=/checkout"}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-dark transition"
                >
                  {signedIn ? "Proceed to Checkout" : "Sign in to Checkout"}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["Online Payment", "Cash on Delivery"].map((p) => (
                    <span key={p} className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft p-6 ring-1 ring-brand/15">
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand ring-1 ring-brand/15">
                    <TruckIcon className="h-4 w-4" />
                  </span>
                  {threshold ? `Free delivery on orders over ${formatPriceBDT(threshold)}` : "Delivery to all 64 districts"}
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

function EmptyCart() {
  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-12 text-center ring-1 ring-slate-100 shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
        <CartIcon className="h-10 w-10" />
      </div>
      <h3 className="mt-5 text-xl font-extrabold text-slate-900">Your cart is empty</h3>
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
