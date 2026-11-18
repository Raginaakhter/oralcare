"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { useStore, formatPriceBDT } from "@/context/StoreContext";
import {
  ArrowRightIcon,
  TruckIcon,
  PhoneIcon,
  MailIcon,
  CheckBadgeIcon,
  SearchIcon,
} from "@/components/icons";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const { orders, getOrderById } = useStore();

  const [searchOrderId, setSearchOrderId] = useState(initialId || "ORD-10285");
  const [contactQuery, setContactQuery] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<typeof orders[number] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchOrderId) {
      const match = getOrderById(searchOrderId);
      if (match) {
        setTrackedOrder(match);
      } else if (orders.length > 0) {
        setTrackedOrder(orders[0]);
      }
    }
  }, [searchOrderId, getOrderById, orders]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const q = searchOrderId.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === q ||
        o.id.toUpperCase().includes(q) ||
        (contactQuery && o.customer.phone.includes(contactQuery))
    );
    setTrackedOrder(found || null);
  };

  return (
    <>
      <PageHero
        title="Track Your Order"
        subtitle="Enter your order ID and phone number to monitor live shipment status."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Track Order" }]}
      />

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tracking search form */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-slate-200 shadow-xl shadow-brand/5 sm:p-10">
          <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 animate-blob rounded-full bg-brand/15 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark">
                <TruckIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-900">Where&apos;s My Order?</h2>
                <p className="text-xs text-slate-500">
                  Tracking code was sent via SMS and Email upon order confirmation.
                </p>
              </div>
            </div>

            <form onSubmit={handleTrack} className="mt-6 grid gap-4 sm:grid-cols-[1.5fr_1fr_auto]">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Order ID
                </label>
                <input
                  type="text"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  placeholder="e.g. ORD-10285"
                  className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 uppercase"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={contactQuery}
                  onChange={(e) => setContactQuery(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-xs font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark sm:w-auto"
                >
                  <SearchIcon className="h-3.5 w-3.5" />
                  Track Order
                </button>
              </div>
            </form>

            <p className="mt-4 text-xs text-slate-500">
              Need your full order history?{" "}
              <Link href="/my-orders" className="font-bold text-brand-dark hover:underline">
                View all orders
              </Link>
            </p>
          </div>
        </div>

        {/* Tracking Results */}
        {trackedOrder ? (
          <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Live Courier Tracking
                </div>
                <div className="mt-1 font-mono text-base font-black text-slate-900">
                  #{trackedOrder.id}
                </div>
                <div className="text-xs text-slate-500">
                  Recipient: {trackedOrder.customer.name} · {trackedOrder.customer.city}
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 capitalize">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {trackedOrder.status}
              </span>
            </div>

            <ol className="mt-6 space-y-6">
              <TimelineStep
                title="Order Received"
                date={trackedOrder.date}
                desc="Order details recorded in our system."
                done={true}
              />
              <TimelineStep
                title="Payment Verified"
                date={trackedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Confirmed"}
                desc={`Method: ${trackedOrder.paymentMethod.toUpperCase()}`}
                done={true}
              />
              <TimelineStep
                title="Packed at Dhaka Fulfillment Centre"
                date="Passed Quality Check"
                desc="Tamper-evident hygiene seal applied."
                done={trackedOrder.status !== "cancelled"}
                active={trackedOrder.status === "processing"}
              />
              <TimelineStep
                title="Dispatched with Courier"
                date="Steadfast / Pathao Express"
                desc={`Tracking code: ${trackedOrder.courierTracking || "SA-2026-DH"}`}
                done={trackedOrder.status === "shipped" || trackedOrder.status === "delivered"}
                active={trackedOrder.status === "shipped"}
              />
              <TimelineStep
                title="Out for Delivery"
                date="Expected within 24-48 hours"
                desc="Courier rider assigned for doorstep handover."
                done={trackedOrder.status === "delivered"}
              />
              <TimelineStep
                title="Delivered"
                date={trackedOrder.status === "delivered" ? "Delivered & Signed" : "Pending Handover"}
                desc="Thank you for shopping authentic Australian dental care with us."
                done={trackedOrder.status === "delivered"}
              />
            </ol>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-soft p-4 ring-1 ring-brand/15">
              <div className="flex items-center gap-3 text-xs">
                <TruckIcon className="h-5 w-5 text-brand-dark" />
                <span className="font-bold text-slate-900">
                  Courier: Steadfast Express ·
                </span>
                <span className="font-mono text-slate-700">
                  {trackedOrder.courierTracking || "SA-2026-DH"}
                </span>
              </div>
              <a
                href="https://wa.me/61451807841"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-slate-50 shadow-sm"
              >
                Inquire on WhatsApp
                <ArrowRightIcon className="h-3 w-3" />
              </a>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="mt-8 rounded-3xl bg-white p-8 text-center ring-1 ring-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">
              No tracking information found for &quot;{searchOrderId}&quot;
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Please double check your Order ID or contact support.
            </p>
          </div>
        ) : null}

        {/* Help block */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/contact-us"
            className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/10"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
              <PhoneIcon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs font-bold text-slate-900">Call / WhatsApp Support</div>
              <div className="text-xs text-slate-500">+61 451 807 841</div>
            </div>
          </Link>
          <a
            href="mailto:smile@oralcarebd.com"
            className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/10"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
              <MailIcon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs font-bold text-slate-900">Email Customer Care</div>
              <div className="text-xs text-slate-500">smile@oralcarebd.com</div>
            </div>
          </a>
        </div>
      </main>
    </>
  );
}

function TimelineStep({
  title,
  date,
  desc,
  done,
  active,
}: {
  title: string;
  date: string;
  desc: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="relative flex flex-col items-center">
        <span
          className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${
            done
              ? "bg-brand text-white"
              : active
              ? "bg-white text-brand ring-brand/30"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {done ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-4 w-4">
              <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : active ? (
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          )}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className={`text-xs font-bold ${done || active ? "text-slate-900" : "text-slate-500"}`}>
            {title}
          </span>
          <span className="text-[11px] text-slate-400">{date}</span>
        </div>
        <div className="mt-0.5 text-xs text-slate-600">{desc}</div>
      </div>
    </li>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-xs font-bold text-slate-500">
          Loading order tracking...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
