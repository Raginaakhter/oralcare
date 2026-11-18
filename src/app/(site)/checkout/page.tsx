"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import {
  useStore,
  formatPriceBDT,
  parsePriceNumber,
} from "@/context/StoreContext";
import {
  ArrowRightIcon,
  ShieldIcon,
  TruckIcon,
  CheckBadgeIcon,
  CartIcon,
} from "@/components/icons";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartCount, placeOrder, showToast } = useStore();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [division, setDivision] = useState("Dhaka");
  const [postcode, setPostcode] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"inside_dhaka" | "outside_dhaka">(
    "inside_dhaka"
  );

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "card" | "cod">(
    "bkash"
  );
  const [senderPhone, setSenderPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const freeThreshold = 1500;
  const standardShipping = deliveryArea === "inside_dhaka" ? 60 : 120;
  const isFreeShipping = cartSubtotal >= freeThreshold || appliedCoupon === "FREESHIP";
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : standardShipping;

  let discountRate = 0;
  if (appliedCoupon === "SMILE10") discountRate = 0.1;
  if (appliedCoupon === "ORALCARE20") discountRate = 0.2;

  const discountAmount = Math.round(cartSubtotal * discountRate);
  const total = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const c = couponCode.trim().toUpperCase();
    if (c === "SMILE10" || c === "ORALCARE10") {
      setAppliedCoupon("SMILE10");
      setCouponError("");
      showToast("Coupon 'SMILE10' applied (10% off)!", "success");
    } else if (c === "ORALCARE20") {
      setAppliedCoupon("ORALCARE20");
      setCouponError("");
      showToast("Coupon 'ORALCARE20' applied (20% off)!", "success");
    } else if (c === "FREESHIP") {
      setAppliedCoupon("FREESHIP");
      setCouponError("");
      showToast("Coupon 'FREESHIP' applied (Free delivery)!", "success");
    } else {
      setCouponError("Invalid coupon code");
      showToast("Invalid coupon code", "error");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Your cart is empty!", "error");
      return;
    }

    if (!name.trim()) {
      showToast("Please enter your full name", "error");
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      showToast("Please enter a valid phone number", "error");
      return;
    }
    if (!address.trim()) {
      showToast("Please enter your delivery street address", "error");
      return;
    }

    if ((paymentMethod === "bkash" || paymentMethod === "nagad") && !trxId.trim()) {
      showToast(`Please enter your ${paymentMethod.toUpperCase()} Transaction ID (TrxID)`, "error");
      return;
    }

    setIsSubmitting(true);

    const newOrder = placeOrder({
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        division,
        postcode: postcode.trim(),
        notes: notes.trim(),
      },
      deliveryArea,
      shippingFee,
      paymentMethod,
      paymentDetails: {
        senderPhone: senderPhone.trim() || phone.trim(),
        trxId: trxId.trim().toUpperCase(),
      },
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      couponCode: appliedCoupon || undefined,
      total,
    });

    setTimeout(() => {
      router.push(`/order-success?id=${newOrder.id}`);
    }, 400);
  };

  if (cart.length === 0) {
    return (
      <>
        <PageHero
          title="Checkout"
          subtitle="Complete your order securely."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <main className="mx-auto w-full max-w-md px-4 py-16 text-center">
          <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-100 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
              <CartIcon className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-900">Your Cart is Empty</h2>
            <p className="mt-2 text-xs text-slate-500">
              Please add products to your cart before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-bold text-white hover:bg-brand-dark"
            >
              Shop Now <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Checkout"
        subtitle="Complete your order securely with bKash, Nagad, Card, or Cash on Delivery."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Form Sections */}
          <div className="space-y-6">
            {/* 1. Contact Information */}
            <Section number={1} title="Contact Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Afsana Rahman"
                    className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Phone Number (Active for SMS/Call) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Email Address (For invoice & tracking updates)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </Section>

            {/* 2. Shipping Address */}
            <Section number={2} title="Delivery Address">
              {/* Delivery Area Picker */}
              <div className="grid gap-3 sm:grid-cols-2 mb-2">
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${
                    deliveryArea === "inside_dhaka"
                      ? "border-brand bg-brand-soft"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryArea"
                    value="inside_dhaka"
                    checked={deliveryArea === "inside_dhaka"}
                    onChange={() => setDeliveryArea("inside_dhaka")}
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">
                      Inside Dhaka
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ৳60 delivery · 24-48 hours
                    </div>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${
                    deliveryArea === "outside_dhaka"
                      ? "border-brand bg-brand-soft"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryArea"
                    value="outside_dhaka"
                    checked={deliveryArea === "outside_dhaka"}
                    onChange={() => setDeliveryArea("outside_dhaka")}
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">
                      Outside Dhaka (All Districts)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ৳120 delivery · 2-4 days
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Street Address (House, Road, Area) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House 24, Road 7, Block B, Dhanmondi"
                  className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    City / Thana
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dhaka, Chittagong, Sylhet"
                    className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Division
                  </label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  >
                    {[
                      "Dhaka",
                      "Chattogram",
                      "Khulna",
                      "Rajshahi",
                      "Sylhet",
                      "Barishal",
                      "Rangpur",
                      "Mymensingh",
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="1205"
                    className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Delivery Notes / Landmarks (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Beside Green Super Market, deliver after 3 PM"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </Section>

            {/* 3. Payment Method */}
            <Section number={3} title="Payment Method">
              <div className="grid gap-3 sm:grid-cols-2">
                <PaymentCard
                  checked={paymentMethod === "bkash"}
                  onChange={() => setPaymentMethod("bkash")}
                  label="bKash Payment"
                  sub="Instant verification via bKash TrxID"
                  badge="Popular"
                />
                <PaymentCard
                  checked={paymentMethod === "nagad"}
                  onChange={() => setPaymentMethod("nagad")}
                  label="Nagad Payment"
                  sub="Fast mobile wallet payment"
                />
                <PaymentCard
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  label="Cash on Delivery (COD)"
                  sub="Pay cash when receiving order"
                />
                <PaymentCard
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  label="Credit / Debit Card"
                  sub="Visa, Mastercard, Amex"
                />
              </div>

              {/* bKash instructions & input */}
              {paymentMethod === "bkash" && (
                <div className="mt-4 rounded-2xl bg-pink-50 p-5 ring-1 ring-pink-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-pink-900">
                    <span>bKash Merchant / Personal: 01712-345678</span>
                    <span className="rounded bg-pink-600 px-2 py-0.5 text-white">
                      bKash
                    </span>
                  </div>
                  <p className="text-xs text-pink-800 leading-relaxed">
                    1. Go to your bKash App or dial *247#.<br />
                    2. Choose &quot;Send Money&quot; or &quot;Payment&quot; to <strong>01712-345678</strong>.<br />
                    3. Enter total amount: <strong>{formatPriceBDT(total)}</strong>.<br />
                    4. Enter your bKash mobile number and Transaction ID (TrxID) below.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-pink-900 mb-1">
                        Your bKash Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="h-10 w-full rounded-xl border border-pink-200 bg-white px-3 text-xs outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-pink-900 mb-1">
                        bKash Transaction ID (TrxID) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="e.g. TRX98B72A1"
                        className="h-10 w-full rounded-xl border border-pink-200 bg-white px-3 text-xs uppercase outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Nagad instructions & input */}
              {paymentMethod === "nagad" && (
                <div className="mt-4 rounded-2xl bg-orange-50 p-5 ring-1 ring-orange-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-orange-900">
                    <span>Nagad Number: 01712-345678</span>
                    <span className="rounded bg-orange-600 px-2 py-0.5 text-white">
                      Nagad
                    </span>
                  </div>
                  <p className="text-xs text-orange-800 leading-relaxed">
                    Send <strong>{formatPriceBDT(total)}</strong> to our Nagad account: <strong>01712-345678</strong>. Then enter your Transaction ID below.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-orange-900 mb-1">
                        Your Nagad Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-orange-900 mb-1">
                        Nagad Transaction ID (TrxID) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="e.g. 71A82BC1"
                        className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-xs uppercase outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Card inputs */}
              {paymentMethod === "card" && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 2222 3333 4444"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-brand"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* COD note */}
              {paymentMethod === "cod" && (
                <div className="mt-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 text-xs text-emerald-800">
                  💡 <strong>Cash on Delivery selected:</strong> You can pay in cash when the delivery courier delivers your parcel. Please keep exact change ready.
                </div>
              )}
            </Section>

            {/* 4. Review Your Items */}
            <Section number={4} title={`Order Items (${cartCount})`}>
              <div className="divide-y divide-slate-100">
                {cart.map((item) => {
                  const itemPrice = parsePriceNumber(item.product.price);
                  return (
                    <div
                      key={item.product.slug}
                      className="flex items-center gap-4 py-3 first:pt-0"
                    >
                      <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-soft">
                        <Image
                          src={item.product.img}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-contain p-1.5"
                        />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="line-clamp-1 text-xs font-bold text-slate-900">
                          {item.product.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.product.brand} · Qty: {item.qty} × {item.product.price}
                        </div>
                      </div>
                      <div className="text-xs font-black text-slate-900">
                        {formatPriceBDT(itemPrice * item.qty)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>

          {/* Right Summary Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-900">Order Summary</h3>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Subtotal ({cartCount} items)</dt>
                  <dd className="font-semibold text-slate-900">
                    {formatPriceBDT(cartSubtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">
                    Shipping ({deliveryArea === "inside_dhaka" ? "Dhaka" : "Outside Dhaka"})
                  </dt>
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
                  <dt className="font-black text-slate-900">Total Payable</dt>
                  <dd className="font-black text-brand-dark">
                    {formatPriceBDT(total)}
                  </dd>
                </div>
              </dl>

              {/* Coupon input */}
              <div className="mt-5 flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="h-10 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-xs outline-none focus:border-brand focus:bg-white uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <div className="mt-1 text-[11px] text-rose-600">{couponError}</div>
              )}
              {appliedCoupon && (
                <div className="mt-1 text-[11px] font-semibold text-emerald-700">
                  ✓ Applied {appliedCoupon}
                </div>
              )}

              {/* Place Order submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Processing Order..." : "Confirm & Place Order"}
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

            {/* Trust Badges */}
            <div className="space-y-3 rounded-3xl bg-brand-soft p-6 ring-1 ring-slate-200">
              <div className="flex items-center gap-3 text-xs text-slate-700">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-dark ring-1 ring-slate-200">
                  <ShieldIcon className="h-4 w-4" />
                </span>
                100% Authentic Australian Imports
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-dark ring-1 ring-slate-200">
                  <TruckIcon className="h-4 w-4" />
                </span>
                Free delivery on orders over ৳1,500
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-dark ring-1 ring-slate-200">
                  <CheckBadgeIcon className="h-4 w-4" />
                </span>
                7-day easy returns & refunds
              </div>
            </div>
          </aside>
        </form>
      </main>
    </>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-black text-white">
          {number}
        </span>
        <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
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
      onClick={onChange}
      className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${
        checked
          ? "border-brand bg-brand-soft/70 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 accent-brand"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900">{label}</span>
          {badge && (
            <span className="rounded-full bg-brand px-1.5 py-0.2 text-[9px] font-black text-white">
              {badge}
            </span>
          )}
        </div>
        <div className="mt-0.5 text-[11px] text-slate-500">{sub}</div>
      </div>
    </label>
  );
}
