"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore, formatPriceBDT, parsePriceNumber } from "@/context/StoreContext";
import { PageHero } from "@/components/SiteShell";
import { ArrowRightIcon, TruckIcon, ShieldIcon, CheckBadgeIcon } from "@/components/icons";

export function OrderDetailClient({ id }: { id: string }) {
  const { orders, getOrderById } = useStore();
  const order = getOrderById(id) || orders.find((o) => o.id.toLowerCase() === id.toLowerCase());

  if (!order) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order #{id} not found</h2>
        <p className="mt-2 text-xs text-slate-500">
          The requested order does not exist or has been removed.
        </p>
        <Link
          href="/my-orders"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white"
        >
          View All Orders
        </Link>
      </main>
    );
  }

  const isDelivered = order.status === "delivered";
  const isShipped = order.status === "shipped" || isDelivered;
  const isProcessing = order.status === "processing" || isShipped;

  return (
    <>
      <PageHero
        title={`Order #${order.id}`}
        subtitle={`Placed on ${order.date} · Status: ${order.status}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Orders", href: "/my-orders" },
          { label: `#${order.id}` },
        ]}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Left: Items & Timeline */}
          <div className="space-y-6">
            {/* Status alert bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-soft p-5 ring-1 ring-brand/20">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
                  <TruckIcon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-bold text-slate-900 capitalize">
                    {order.status === "delivered"
                      ? "Order Delivered Successfully"
                      : order.status === "shipped"
                      ? "Out with Courier"
                      : "Processing Your Order"}
                  </div>
                  <div className="text-xs text-slate-600">
                    {order.courierTracking
                      ? `Tracking: ${order.courierTracking}`
                      : "Fulfillment in progress"}
                  </div>
                </div>
              </div>

              <Link
                href={`/track-order?id=${order.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-dark ring-1 ring-brand/20 hover:bg-brand-soft/60 shadow-sm"
              >
                Track Live
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            {/* Line Items */}
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <h3 className="text-base font-black text-slate-900">
                Order Items ({order.items.length})
              </h3>

              <div className="mt-4 divide-y divide-slate-100">
                {order.items.map((item) => {
                  const unitPrice = parsePriceNumber(item.product.price);
                  return (
                    <div key={item.product.slug} className="flex items-center gap-4 py-4">
                      <Link
                        href={item.product.href}
                        className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-soft"
                      >
                        <Image
                          src={item.product.img}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-contain p-1.5"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={item.product.href}
                          className="line-clamp-1 text-sm font-bold text-slate-900 hover:text-brand-dark"
                        >
                          {item.product.name}
                        </Link>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {item.product.brand} · Qty: {item.qty} × {item.product.price}
                        </div>
                      </div>
                      <div className="text-sm font-black text-slate-900">
                        {formatPriceBDT(unitPrice * item.qty)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price breakdown */}
              <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
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
                <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
                  <dt className="font-black text-slate-900">Total</dt>
                  <dd className="font-black text-brand-dark">
                    {formatPriceBDT(order.total)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Timeline */}
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <h3 className="text-base font-black text-slate-900">Delivery Timeline</h3>
              <ol className="mt-5 space-y-5">
                <TimelineStep
                  label="Order Placed"
                  date={`${order.date}`}
                  done={true}
                />
                <TimelineStep
                  label="Payment Confirmed"
                  date={order.paymentMethod === "cod" ? "COD on Arrival" : "Verified"}
                  done={true}
                />
                <TimelineStep
                  label="Packaging & Quality Check"
                  date={isProcessing ? "Done" : "Pending"}
                  done={isProcessing}
                  active={order.status === "processing"}
                />
                <TimelineStep
                  label="Dispatched to Courier"
                  date={isShipped ? "Handed over to courier" : "Pending"}
                  done={isShipped}
                  active={order.status === "shipped"}
                />
                <TimelineStep
                  label="Delivered"
                  date={isDelivered ? "Delivered to Customer" : "Estimated 1-3 days"}
                  done={isDelivered}
                  last
                />
              </ol>
            </div>
          </div>

          {/* Right: Customer & Payment summary */}
          <aside className="space-y-5">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Delivery Address
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-700">
                <strong className="text-slate-900 text-sm">{order.customer.name}</strong><br />
                {order.customer.address}<br />
                {order.customer.city}, {order.customer.division} {order.customer.postcode}<br />
                Phone: {order.customer.phone}
              </p>
              {order.customer.notes && (
                <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600">
                  <strong>Notes:</strong> {order.customer.notes}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Payment Info
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Method</dt>
                  <dd>
                    <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-800 uppercase">
                      {order.paymentMethod}
                    </span>
                  </dd>
                </div>
                {order.paymentDetails?.trxId && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Transaction ID</dt>
                    <dd className="font-mono text-xs font-bold text-slate-900">
                      {order.paymentDetails.trxId}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-slate-500">Total Payable</dt>
                  <dd className="font-black text-brand-dark">
                    {formatPriceBDT(order.total)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark shadow-sm"
              >
                Download / Print Invoice
              </button>
              <Link
                href="/contact-us"
                className="block w-full rounded-full bg-brand px-5 py-3 text-center text-xs font-bold text-white shadow-md hover:bg-brand-dark"
              >
                Need Help with this Order?
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

function TimelineStep({
  label,
  date,
  done,
  active,
  last,
}: {
  label: string;
  date: string;
  done?: boolean;
  active?: boolean;
  last?: boolean;
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="relative flex flex-col items-center">
        <span
          className={`z-10 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-white ${
            done
              ? "bg-brand text-white"
              : active
              ? "bg-white text-brand ring-brand/30"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {done ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3 w-3">
              <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : active ? (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          )}
        </span>
        {!last && (
          <span
            className={`absolute top-7 h-6 w-px ${done ? "bg-brand" : "bg-slate-200"}`}
          />
        )}
      </div>
      <div>
        <div className={`text-xs font-bold ${done || active ? "text-slate-900" : "text-slate-500"}`}>
          {label}
        </div>
        <div className="text-[11px] text-slate-400">{date}</div>
      </div>
    </li>
  );
}
