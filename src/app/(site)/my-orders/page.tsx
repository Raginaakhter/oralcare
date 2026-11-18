"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import { useStore, formatPriceBDT, parsePriceNumber } from "@/context/StoreContext";
import { ArrowRightIcon, TruckIcon } from "@/components/icons";

type OrderStatus = "delivered" | "shipped" | "processing" | "pending" | "cancelled";

const statusStyles: Record<string, { label: string; cls: string }> = {
  delivered: { label: "Delivered", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  shipped: { label: "Shipped", cls: "bg-violet-50 text-violet-700 ring-violet-200" },
  processing: { label: "Processing", cls: "bg-sky-50 text-sky-700 ring-sky-200" },
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  cancelled: { label: "Cancelled", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
};

export default function MyOrdersPage() {
  const { orders, addToCart, showToast } = useStore();
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === activeFilter.toLowerCase());

  const handleReorder = (orderItems: typeof orders[number]["items"]) => {
    orderItems.forEach((item) => {
      addToCart(item.product, item.qty, false);
    });
    showToast("Items added to your cart for reorder!", "success");
  };

  return (
    <>
      <PageHero
        title="My Orders"
        subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"} placed with OralCareBD.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/my-account" },
          { label: "My Orders" },
        ]}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filter tabs */}
        <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 ring-1 ring-slate-200 shadow-sm">
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((f) => {
            const count =
              f === "All"
                ? orders.length
                : orders.filter((o) => o.status.toLowerCase() === f.toLowerCase()).length;
            const active = activeFilter === f;

            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f} Orders
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Order cards list */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center ring-1 ring-slate-100 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <TruckIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900">
              No orders found in &quot;{activeFilter}&quot;
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              When you make a purchase, your order history will show up here.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-dark"
            >
              Start Shopping <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((o) => {
              const currentStyle = statusStyles[o.status] || {
                label: o.status,
                cls: "bg-slate-100 text-slate-700",
              };

              return (
                <div
                  key={o.id}
                  className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transition hover:shadow-xl hover:shadow-brand/10 hover:ring-brand/30"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4">
                    <div className="flex flex-wrap items-center gap-6 text-xs">
                      <div>
                        <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                          Order ID
                        </div>
                        <div className="font-mono text-sm font-black text-slate-900">
                          #{o.id}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                          Date Placed
                        </div>
                        <div className="text-xs font-bold text-slate-800">{o.date}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                          Total Amount
                        </div>
                        <div className="text-xs font-black text-brand-dark">
                          {formatPriceBDT(o.total)}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                          Payment
                        </div>
                        <div className="text-xs font-bold text-slate-800 uppercase">
                          {o.paymentMethod}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${currentStyle.cls}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {currentStyle.label}
                    </span>
                  </div>

                  {/* Card Items preview & actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {o.items.slice(0, 4).map((item) => (
                          <span
                            key={item.product.slug}
                            className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-brand-soft ring-2 ring-white"
                          >
                            <Image
                              src={item.product.img}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-slate-600">
                        <span className="font-bold text-slate-900">
                          {o.items.length}
                        </span>{" "}
                        {o.items.length === 1 ? "item" : "items"}
                        {o.items.length === 1 && (
                          <span className="line-clamp-1 text-slate-500">
                            · {o.items[0].product.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReorder(o.items)}
                        className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark transition"
                      >
                        Reorder
                      </button>

                      <Link
                        href={`/track-order?id=${o.id}`}
                        className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark transition"
                      >
                        Track
                      </Link>

                      <Link
                        href={`/my-orders/${o.id}`}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-dark transition"
                      >
                        Details
                        <ArrowRightIcon className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Support hint */}
        <div className="mt-10 rounded-3xl bg-brand-soft p-6 text-center ring-1 ring-brand/15">
          <p className="text-xs text-slate-700">
            Have a question about your shipment?{" "}
            <Link href="/track-order" className="font-bold text-brand-dark hover:underline">
              Track in real-time
            </Link>{" "}
            or message us on{" "}
            <a
              href="https://wa.me/61451807841"
              className="font-bold text-brand-dark hover:underline"
            >
              WhatsApp (+61 451 807 841)
            </a>
            .
          </p>
        </div>
      </main>
    </>
  );
}
