"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore, formatPriceBDT, parsePriceNumber, Order } from "@/context/StoreContext";
import {
  ArrowRightIcon,
  CheckBadgeIcon,
  TruckIcon,
  MailIcon,
  PhoneIcon,
} from "@/components/icons";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("id");
  const { orders, getOrderById } = useStore();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderIdParam) {
      const found = getOrderById(orderIdParam);
      if (found) {
        setOrder(found);
        return;
      }
    }
    // Fallback to most recent order
    if (orders.length > 0) {
      setOrder(orders[0]);
    }
  }, [orderIdParam, orders, getOrderById]);

  if (!order) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Order not found</h1>
        <Link
          href="/shop"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white"
        >
          Return to Shop
        </Link>
      </main>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Confirmation Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft p-8 text-center ring-1 ring-brand/20 sm:p-12 shadow-sm">
        <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 animate-blob rounded-full bg-brand/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 animate-blob rounded-full bg-brand/10 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand text-white shadow-xl shadow-brand/40">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              className="h-10 w-10"
            >
              <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-900 sm:text-4xl">
            Order Confirmed!
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
            Thank you, <strong>{order.customer.name}</strong>! We&apos;ve received your order and our Dhaka fulfillment team is preparing it for dispatch.
          </p>

          {/* Order ID Pill */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 shadow-sm ring-1 ring-slate-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Order ID
            </span>
            <span className="font-mono text-sm font-black text-slate-900">
              #{order.id}
            </span>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/my-orders/${order.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              View Order Details
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark"
            >
              Print / Save Invoice
            </button>
            <Link
              href="/shop"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        {/* Left: Purchased items & Breakdown */}
        <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-900">
              Purchased Items ({order.items.length})
            </h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 capitalize">
              Status: {order.status}
            </span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {order.items.map((item) => {
              const unitPrice = parsePriceNumber(item.product.price);
              return (
                <div key={item.product.slug} className="flex items-center gap-4 py-3">
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
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {item.product.brand} · Qty: {item.qty} × {item.product.price}
                    </div>
                  </div>
                  <div className="text-xs font-black text-slate-900">
                    {formatPriceBDT(unitPrice * item.qty)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing totals */}
          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="font-semibold text-slate-900">
                {formatPriceBDT(order.subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Shipping</dt>
              <dd
                className={`font-semibold ${
                  order.shippingFee === 0 ? "text-emerald-600" : "text-slate-900"
                }`}
              >
                {order.shippingFee === 0 ? "FREE" : formatPriceBDT(order.shippingFee)}
              </dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Discount</dt>
                <dd className="font-semibold text-emerald-600">
                  - {formatPriceBDT(order.discount)}
                </dd>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-100 pt-3 text-sm">
              <dt className="font-black text-slate-900">Total Paid / Payable</dt>
              <dd className="font-black text-brand-dark">
                {formatPriceBDT(order.total)}
              </dd>
            </div>
          </dl>

          {/* Customer Delivery info */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Delivery Details
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>{order.customer.name}</strong><br />
              {order.customer.address}, {order.customer.city}, {order.customer.division} {order.customer.postcode}<br />
              Phone: {order.customer.phone}<br />
              {order.customer.email && `Email: ${order.customer.email}`}
            </p>
          </div>
        </div>

        {/* Right: Payment details & What's Next */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Payment Summary
            </h3>
            <div className="rounded-2xl bg-slate-50 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Method</span>
                <span className="font-bold text-slate-900 uppercase">
                  {order.paymentMethod}
                </span>
              </div>
              {order.paymentDetails?.trxId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">TrxID</span>
                  <span className="font-mono font-bold text-brand-dark">
                    {order.paymentDetails.trxId}
                  </span>
                </div>
              )}
              {order.courierTracking && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Courier Tracking</span>
                  <span className="font-mono font-bold text-slate-900">
                    {order.courierTracking}
                  </span>
                </div>
              )}
            </div>

            <h3 className="mt-5 text-sm font-black text-slate-900">What&apos;s Next?</h3>
            <ol className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-white text-xs">
                  <MailIcon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Confirmation Sent</div>
                  <div className="text-[11px] text-slate-500">
                    An SMS confirmation has been triggered for your phone.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs">
                  <CheckBadgeIcon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Packing & Verification</div>
                  <div className="text-[11px] text-slate-500">
                    Our team inspects batch codes & shelf-life before dispatch.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs">
                  <TruckIcon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Fast Courier Delivery</div>
                  <div className="text-[11px] text-slate-500">
                    Dhaka: 24-48 hrs · Other Divisions: 2-4 days.
                  </div>
                </div>
              </li>
            </ol>
          </div>

          {/* Help box */}
          <div className="rounded-3xl bg-brand-soft p-6 ring-1 ring-brand/20">
            <h3 className="text-xs font-black text-slate-900">Need Immediate Help?</h3>
            <p className="mt-1 text-[11px] text-slate-600">
              Our dental care advisors are available 9 AM - 9 PM daily.
            </p>
            <div className="mt-3 space-y-1.5 text-xs">
              <a
                href="https://wa.me/61451807841"
                className="inline-flex items-center gap-1.5 font-bold text-brand-dark hover:underline"
              >
                <PhoneIcon className="h-3.5 w-3.5" />
                +61 451 807 841
              </a>
              <br />
              <a
                href="mailto:smile@oralcarebd.com"
                className="inline-flex items-center gap-1.5 font-bold text-brand-dark hover:underline"
              >
                <MailIcon className="h-3.5 w-3.5" />
                smile@oralcarebd.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-xs font-bold text-slate-500">
          Loading order confirmation...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
