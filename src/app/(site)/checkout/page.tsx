"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { SmartImage } from "@/components/SmartImage";
import { useStore, formatPriceBDT, type BuyNowItem } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import {
  couponsApi,
  errorMessage,
  ordersApi,
  paymentsApi,
  ApiError,
  type Address,
  type CheckoutPreview,
  type LineItemInput,
  type Order,
  type PaymentMethod,
  type ShippingMethodCode,
} from "@/lib/api";
import { COUPON_STORAGE_KEY, LAST_ORDER_KEY } from "@/lib/storage-keys";
import { ArrowRightIcon, ShieldIcon, TruckIcon, CheckBadgeIcon, CartIcon } from "@/components/icons";

const DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Gazipur",
  "Narayanganj",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Bogura",
];

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutShell><Loading /></CheckoutShell>}>
      <Checkout />
    </Suspense>
  );
}

function Checkout() {
  const router = useRouter();
  const params = useSearchParams();
  const isBuyNow = params.get("mode") === "buy-now";
  const { user, status } = useAuth();
  const { cart, refreshCart, getBuyNowItem, clearBuyNowItem, showToast } = useStore();

  const [buyNowItem, setBuyNowItem] = useState<BuyNowItem | null>(null);
  const [ready, setReady] = useState(false);

  // Address
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [postalCode, setPostalCode] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  // Options
  const initialMethod = (params.get("shipping") as ShippingMethodCode) || "inside_dhaka";
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodCode>(initialMethod);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState<string | undefined>(undefined);
  const [couponError, setCouponError] = useState("");

  // Preview / submit
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [previewError, setPreviewError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const idempotencyKey = useRef<string>("");

  // Guests must sign in — the backend's cart & order endpoints need a customer token.
  useEffect(() => {
    if (status === "guest") {
      const next = isBuyNow ? "/checkout?mode=buy-now" : "/checkout";
      router.replace(`/signin?next=${encodeURIComponent(next)}`);
    }
  }, [status, isBuyNow, router]);

  // One-time setup: buy-now item, saved coupon, idempotency key, profile prefill.
  useEffect(() => {
    if (status !== "authenticated") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time setup from sessionStorage / session (client-only)
    if (isBuyNow) setBuyNowItem(getBuyNowItem());
    try {
      const saved = sessionStorage.getItem(COUPON_STORAGE_KEY);
      if (saved) {
        setCouponInput(saved);
        setCouponCode(saved);
      }
    } catch {
      // ignore
    }
    idempotencyKey.current =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setFullName((v) => v || user?.fullName || "");
    setEmail((v) => v || user?.email || "");
    setReady(true);
  }, [status, isBuyNow, getBuyNowItem, user]);

  const items: LineItemInput[] | undefined = useMemo(
    () =>
      isBuyNow && buyNowItem
        ? [{ productId: buyNowItem.productId, variationId: buyNowItem.variationId, quantity: buyNowItem.quantity }]
        : undefined,
    [isBuyNow, buyNowItem]
  );

  // Live totals from the server.
  useEffect(() => {
    if (!ready) return;
    if (isBuyNow && !items) return;
    if (!isBuyNow && cart.length === 0) return;
    let alive = true;
    ordersApi
      .checkout({ source: isBuyNow ? "buy_now" : "cart", items, couponCode, shippingMethod })
      .then((p) => {
        if (!alive) return;
        setPreview(p);
        setPreviewError("");
        if (p.paymentMethods.length && !p.paymentMethods.includes(paymentMethod)) {
          setPaymentMethod(p.paymentMethods[0]);
        }
      })
      .catch((err) => {
        if (!alive) return;
        // A bad coupon shouldn't block the page: drop it and retry without.
        if (couponCode && err instanceof ApiError && /coupon/i.test(err.message)) {
          setCouponError(err.message);
          setCouponCode(undefined);
          return;
        }
        setPreviewError(errorMessage(err, "Could not calculate your order"));
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isBuyNow, items, couponCode, shippingMethod, cart]);

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    try {
      const env = await couponsApi.validate({ code, source: isBuyNow ? "buy_now" : "cart", items });
      setCouponCode(env.data.code);
      setCouponError("");
      sessionStorage.setItem(COUPON_STORAGE_KEY, env.data.code);
      showToast(`Coupon '${env.data.code}' applied!`, "success");
    } catch (err) {
      setCouponError(errorMessage(err, "Invalid coupon code"));
    }
  };

  const removeCoupon = () => {
    setCouponCode(undefined);
    setCouponInput("");
    setCouponError("");
    try {
      sessionStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview?.canPlaceOrder) {
      showToast("Please resolve the issues with your items first", "error");
      return;
    }
    setSubmitting(true);
    setFieldErrors({});

    const shippingAddress: Address = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      ...(email.trim() ? { email: email.trim() } : {}),
      addressLine1: addressLine1.trim(),
      ...(addressLine2.trim() ? { addressLine2: addressLine2.trim() } : {}),
      ...(area.trim() ? { area: area.trim() } : {}),
      city: city.trim(),
      district,
      ...(postalCode.trim() ? { postalCode: postalCode.trim() } : {}),
      country: "Bangladesh",
    };
    const body = {
      shippingAddress,
      shippingMethod,
      paymentMethod,
      ...(couponCode ? { couponCode } : {}),
      ...(customerNote.trim() ? { customerNote: customerNote.trim() } : {}),
    };

    let order: Order;
    try {
      const env =
        isBuyNow && buyNowItem
          ? await ordersApi.buyNow(
              {
                ...body,
                productId: buyNowItem.productId,
                variationId: buyNowItem.variationId,
                quantity: buyNowItem.quantity,
              },
              idempotencyKey.current
            )
          : await ordersApi.place(body, idempotencyKey.current);
      order = env.data;
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.length) {
        setFieldErrors(
          Object.fromEntries(err.fieldErrors.map((f) => [f.field.replace(/^shippingAddress\./, ""), f.message]))
        );
      }
      showToast(errorMessage(err, "Could not place your order"), "error");
      setSubmitting(false);
      return;
    }

    try {
      sessionStorage.removeItem(COUPON_STORAGE_KEY);
      sessionStorage.setItem(LAST_ORDER_KEY, order._id);
    } catch {
      // ignore
    }
    if (isBuyNow) clearBuyNowItem();
    else void refreshCart();

    if (order.paymentMethod === "online") {
      try {
        const pay = await paymentsApi.initialize(order._id);
        if (pay.data.provider === "mock") {
          router.push(`/payment/mock?tx=${encodeURIComponent(pay.data.transactionId)}&order=${order._id}`);
        } else {
          window.location.href = pay.data.redirectUrl;
        }
        return;
      } catch (err) {
        showToast(errorMessage(err, "Order placed, but payment could not start. You can retry from My Orders."), "error");
      }
    } else {
      showToast(`Order ${order.orderNumber} placed successfully!`, "success");
    }
    router.push(`/order-success?id=${order._id}`);
  };

  if (status !== "authenticated" || !ready) {
    return (
      <CheckoutShell>
        <Loading />
      </CheckoutShell>
    );
  }

  const isEmpty = isBuyNow ? !buyNowItem : cart.length === 0;
  if (isEmpty) {
    return (
      <CheckoutShell>
        <main className="mx-auto w-full max-w-md px-4 py-16 text-center">
          <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-100 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
              <CartIcon className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-900">Nothing to check out</h2>
            <p className="mt-2 text-xs text-slate-500">Please add products to your cart before proceeding to checkout.</p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-bold text-white hover:bg-brand-dark"
            >
              Shop Now <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </main>
      </CheckoutShell>
    );
  }

  const lines = preview?.lines ?? [];
  const methods = preview?.shippingMethods ?? [];
  const paymentOptions = preview?.paymentMethods ?? ["cod"];

  return (
    <CheckoutShell>
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <Section number={1} title="Contact Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full Name" required value={fullName} onChange={setFullName} error={fieldErrors.fullName} placeholder="e.g. Afsana Rahman" />
                <Input
                  label="Phone Number (for delivery)"
                  required
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  error={fieldErrors.phone}
                  placeholder="017XXXXXXXX"
                />
              </div>
              <Input label="Email (for invoice & tracking updates)" type="email" value={email} onChange={setEmail} error={fieldErrors.email} placeholder="you@example.com" />
            </Section>

            <Section number={2} title="Delivery Address">
              <Input
                label="Street Address (House, Road)"
                required
                value={addressLine1}
                onChange={setAddressLine1}
                error={fieldErrors.addressLine1}
                placeholder="House 24, Road 7, Block B"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Apartment / Landmark (optional)" value={addressLine2} onChange={setAddressLine2} placeholder="Flat 5B, beside Green Super Market" />
                <Input label="Area / Thana" value={area} onChange={setArea} error={fieldErrors.area} placeholder="e.g. Dhanmondi" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="City" required value={city} onChange={setCity} error={fieldErrors.city} placeholder="Dhaka" />
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <Input label="Postcode" value={postalCode} onChange={setPostalCode} placeholder="1205" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Delivery Notes (Optional)</label>
                <textarea
                  rows={2}
                  maxLength={1000}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="e.g. Please call before delivery"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </Section>

            <Section number={3} title="Delivery Method">
              <div className="grid gap-3 sm:grid-cols-3">
                {methods.map((m) => (
                  <label
                    key={m.code}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${
                      shippingMethod === m.code ? "border-brand bg-brand-soft" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === m.code}
                      onChange={() => setShippingMethod(m.code)}
                      className="mt-0.5 h-4 w-4 accent-brand"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {formatPriceBDT(m.charge)} · {m.estimatedDays.min}-{m.estimatedDays.max} days
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-400">{m.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Section>

            <Section number={4} title="Payment Method">
              <div className="grid gap-3 sm:grid-cols-2">
                {paymentOptions.includes("cod") && (
                  <PaymentCard
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    label="Cash on Delivery (COD)"
                    sub="Pay cash when you receive the order"
                    badge="Popular"
                  />
                )}
                {paymentOptions.includes("online") && (
                  <PaymentCard
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    label="Pay Online"
                    sub="bKash, Nagad, cards — via secure payment gateway"
                  />
                )}
              </div>
              {paymentMethod === "cod" ? (
                <div className="mt-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 text-xs text-emerald-800">
                  💡 <strong>Cash on Delivery:</strong> pay the courier when your parcel arrives. Please keep the exact amount ready.
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-200 text-xs text-sky-800">
                  🔒 After placing the order you&apos;ll be taken to the payment gateway to complete payment of{" "}
                  <strong>{formatPriceBDT(preview?.grandTotal)}</strong>.
                </div>
              )}
            </Section>

            <Section number={5} title={`Order Items (${preview?.totalQuantity ?? 0})`}>
              <div className="divide-y divide-slate-100">
                {lines.map((l) => (
                  <div key={`${l.productId}:${l.variationId ?? ""}`} className="flex items-center gap-4 py-3 first:pt-0">
                    <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-soft">
                      <SmartImage src={l.thumbnail} alt="" fill sizes="56px" className="object-contain p-1.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="line-clamp-1 text-xs font-bold text-slate-900">{l.productName}</div>
                      <div className="text-[11px] text-slate-500">
                        {l.variationAttributes ? `${Object.values(l.variationAttributes).join(" / ")} · ` : ""}
                        Qty: {l.quantity} × {formatPriceBDT(l.unitPrice)}
                      </div>
                    </div>
                    <div className="text-xs font-black text-slate-900">{formatPriceBDT(l.lineTotal)}</div>
                  </div>
                ))}
              </div>
              {preview?.issues.length ? (
                <ul className="space-y-1 rounded-xl bg-rose-50 p-3 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-100">
                  {preview.issues.map((i) => (
                    <li key={`${i.productId}:${i.code}`}>• {i.message}</li>
                  ))}
                </ul>
              ) : null}
            </Section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-900">Order Summary</h3>

              {previewError && (
                <p className="mt-3 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{previewError}</p>
              )}

              <dl className="mt-4 space-y-3 text-sm">
                <Row label={`Subtotal (${preview?.totalQuantity ?? 0} items)`} value={formatPriceBDT(preview?.subtotal)} />
                <Row
                  label={`Shipping (${preview?.shipping?.name ?? "—"})`}
                  value={preview?.shipping?.charge === 0 ? "FREE" : formatPriceBDT(preview?.shipping?.charge)}
                  green={preview?.shipping?.charge === 0}
                />
                {(preview?.discount ?? 0) > 0 && (
                  <Row label={`Discount (${preview?.coupon?.code})`} value={`- ${formatPriceBDT(preview?.discount)}`} green />
                )}
                <div className="my-3 border-t border-slate-100" />
                <div className="flex justify-between text-base">
                  <dt className="font-black text-slate-900">Total Payable</dt>
                  <dd className="font-black text-brand-dark">{formatPriceBDT(preview?.grandTotal)}</dd>
                </div>
              </dl>

              <div className="mt-5 flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code"
                  className="h-10 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-xs outline-none focus:border-brand focus:bg-white uppercase"
                />
                {couponCode ? (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-rose-600 hover:border-rose-300"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark"
                  >
                    Apply
                  </button>
                )}
              </div>
              {couponError && <div className="mt-1 text-[11px] text-rose-600">{couponError}</div>}
              {couponCode && preview?.coupon && (
                <div className="mt-1 text-[11px] font-semibold text-emerald-700">✓ Applied {preview.coupon.code}</div>
              )}

              <button
                type="submit"
                disabled={submitting || !preview?.canPlaceOrder}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Placing Order..." : paymentMethod === "online" ? "Place Order & Pay" : "Confirm & Place Order"}
                <ArrowRightIcon className="h-4 w-4" />
              </button>

              <p className="mt-3 text-center text-[11px] text-slate-500">
                By placing this order, you agree to our{" "}
                <Link href="/terms" className="font-semibold text-brand-dark hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="font-semibold text-brand-dark hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="space-y-3 rounded-3xl bg-brand-soft p-6 ring-1 ring-slate-200">
              <Badge icon={<ShieldIcon className="h-4 w-4" />} text="100% Authentic Australian Imports" />
              <Badge icon={<TruckIcon className="h-4 w-4" />} text="Delivery to all 64 districts" />
              <Badge icon={<CheckBadgeIcon className="h-4 w-4" />} text="7-day easy returns & refunds" />
            </div>
          </aside>
        </form>
      </main>
    </CheckoutShell>
  );
}

function CheckoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHero
        title="Checkout"
        subtitle="Complete your order securely — Cash on Delivery or online payment."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      {children}
    </>
  );
}

function Loading() {
  return (
    <div className="mx-auto flex max-w-md items-center justify-center px-4 py-24 text-sm font-semibold text-slate-500">
      <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      Preparing your checkout…
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-full border bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 ${
          error ? "border-rose-300" : "border-slate-200"
        }`}
      />
      {error && <p className="mt-1 px-2 text-[11px] font-semibold text-rose-600">{error}</p>}
    </div>
  );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className={`font-semibold ${green ? "text-emerald-600" : "text-slate-900"}`}>{value}</dd>
    </div>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-xs text-slate-700">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-dark ring-1 ring-slate-200">
        {icon}
      </span>
      {text}
    </div>
  );
}

function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-8 ring-1 ring-slate-200 shadow-sm">
      <div className="mb-4 sm:mb-5 flex items-center gap-2.5 sm:gap-3">
        <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-brand text-xs font-black text-white shrink-0">
          {number}
        </span>
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-3.5 sm:space-y-4">{children}</div>
    </div>
  );
}

function PaymentCard({
  checked,
  onChange,
  label,
  sub,
  badge,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  sub: string;
  badge?: string;
}) {
  return (
    <label
      className={`relative flex cursor-pointer items-start gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border-2 p-3 sm:p-4 transition ${
        checked ? "border-brand bg-brand-soft/70 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input type="radio" checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 accent-brand shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-900">{label}</span>
          {badge && <span className="rounded-full bg-brand px-1.5 text-[9px] font-black text-white">{badge}</span>}
        </div>
        <div className="mt-0.5 text-[11px] text-slate-500 leading-tight">{sub}</div>
      </div>
    </label>
  );
}
