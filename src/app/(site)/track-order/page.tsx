"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { useAuth } from "@/context/AuthContext";
import { errorMessage, ordersApi, type TrackResult } from "@/lib/api";
import { formatDate, formatDateTime, humanize } from "@/lib/format";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders";
import { SearchIcon, TruckIcon } from "@/components/icons";

const STEPS = ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered"] as const;

export default function TrackOrderPage() {
  return (
    <>
      <PageHero
        title="Track Your Order"
        subtitle="Enter your order number to see live delivery status."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Track Order" }]}
      />
      <Suspense fallback={null}>
        <Tracker />
      </Suspense>
    </>
  );
}

function Tracker() {
  const params = useSearchParams();
  const { status } = useAuth();
  const [orderNumber, setOrderNumber] = useState(params.get("order") ?? "");
  const [phone, setPhone] = useState(params.get("phone") ?? "");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(
    async (num: string, ph: string) => {
      if (!num.trim()) return;
      setLoading(true);
      setError("");
      try {
        setResult(await ordersApi.track(num.trim().toUpperCase(), ph.trim() || undefined));
      } catch (err) {
        setResult(null);
        setError(
          errorMessage(err, "Order not found") +
            (status !== "authenticated" && !ph.trim() ? " — guests must enter the phone number used for delivery." : "")
        );
      } finally {
        setLoading(false);
      }
    },
    [status]
  );

  // Auto-lookup when arriving from an order page (?order=OC-…).
  useEffect(() => {
    const num = params.get("order");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- auto-lookup when arriving with ?order=
    if (num && status !== "loading") void lookup(num, params.get("phone") ?? "");
  }, [params, status, lookup]);

  const reached = result ? STEPS.indexOf(result.status as (typeof STEPS)[number]) : -1;
  const offTrack = result && reached === -1;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void lookup(orderNumber, phone);
        }}
        className="grid gap-3 rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm sm:grid-cols-[1fr_1fr_auto]"
      >
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order number, e.g. OC-261124-0001"
          required
          className="h-11 rounded-full border border-slate-200 px-4 text-sm uppercase outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          placeholder={status === "authenticated" ? "Phone (optional)" : "Delivery phone number"}
          required={status !== "authenticated"}
          className="h-11 rounded-full border border-slate-200 px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <button
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          <SearchIcon className="h-4 w-4" />
          {loading ? "Searching…" : "Track"}
        </button>
      </form>

      {error && <p className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 ring-1 ring-rose-200">{error}</p>}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-mono text-lg font-black text-slate-900">#{result.orderNumber}</div>
                <div className="text-xs text-slate-500">Placed {formatDate(result.placedAt)}</div>
              </div>
              <div className="flex gap-2">
                <OrderStatusBadge status={result.status} />
                <PaymentStatusBadge status={result.paymentStatus} />
              </div>
            </div>

            {!offTrack && (
              <div className="mt-6 grid grid-cols-7 gap-1">
                {STEPS.map((s, i) => (
                  <div key={s} className="text-center">
                    <div className={`mx-auto h-2 rounded-full ${i <= reached ? "bg-brand" : "bg-slate-200"}`} />
                    <div className={`mt-2 text-[9px] sm:text-[11px] font-bold ${i <= reached ? "text-brand-dark" : "text-slate-400"}`}>
                      {humanize(s)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result.deliveredAt && (
              <p className="mt-4 text-sm font-semibold text-emerald-700">Delivered on {formatDateTime(result.deliveredAt)}</p>
            )}
            {result.estimatedDelivery && !result.deliveredAt && (
              <p className="mt-4 text-sm text-slate-600">Estimated delivery: {formatDate(result.estimatedDelivery)}</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
              <h2 className="mb-4 text-base font-black text-slate-900">Order Updates</h2>
              <ol className="relative space-y-4 border-l-2 border-slate-100 pl-5">
                {[...result.timeline].reverse().map((t, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-brand ring-4 ring-brand-soft" />
                    <div className="text-sm font-bold text-slate-900">{humanize(t.status)}</div>
                    {t.note && <div className="text-xs text-slate-600">{t.note}</div>}
                    <div className="text-[11px] text-slate-400">{formatDateTime(t.at)}</div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-base font-black text-slate-900">
                <TruckIcon className="h-4 w-4 text-brand" /> Courier
              </h2>
              {result.shipment ? (
                <>
                  <div className="text-sm text-slate-700">
                    <div className="font-bold">{result.shipment.courierName ?? humanize(result.shipment.provider)}</div>
                    {result.shipment.trackingNumber && (
                      <div>
                        Tracking: <span className="font-mono font-bold">{result.shipment.trackingNumber}</span>
                      </div>
                    )}
                    {result.shipment.trackingUrl && (
                      <a
                        href={result.shipment.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-brand-dark hover:underline"
                      >
                        Open courier tracking ↗
                      </a>
                    )}
                  </div>
                  <ol className="mt-4 space-y-3">
                    {[...result.shipment.events].reverse().map((e, i) => (
                      <li key={i} className="rounded-xl bg-slate-50 p-3 text-xs">
                        <div className="font-bold text-slate-900">{humanize(e.status)}</div>
                        {e.description && <div className="text-slate-600">{e.description}</div>}
                        {e.location && <div className="text-slate-500">📍 {e.location}</div>}
                        <div className="text-[11px] text-slate-400">{formatDateTime(e.at)}</div>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <p className="text-sm text-slate-500">A courier hasn&apos;t been assigned yet. We&apos;ll update this once your parcel ships.</p>
              )}
            </section>
          </div>

          {status === "authenticated" && (
            <div className="text-center">
              <Link href="/my-orders" className="text-sm font-bold text-brand-dark hover:underline">
                View all my orders →
              </Link>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
