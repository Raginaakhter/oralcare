"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { SmartImage } from "@/components/SmartImage";
import { useAuth } from "@/context/AuthContext";
import { ordersApi } from "@/lib/api";
import { formatDate, formatPriceBDT } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { ErrorBox, OrderStatusBadge, PaymentStatusBadge, Spinner } from "@/components/orders";
import { ArrowRightIcon, CartIcon } from "@/components/icons";

const TABS: { label: string; status?: string }[] = [
  { label: "All" },
  { label: "Pending", status: "pending,confirmed" },
  { label: "In Progress", status: "processing,packed,shipped,out_for_delivery" },
  { label: "Delivered", status: "delivered" },
  { label: "Cancelled", status: "cancelled,failed" },
  { label: "Returned", status: "returned,refunded" },
];

export default function MyOrdersPage() {
  const router = useRouter();
  const { status } = useAuth();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const ready = status === "authenticated";

  useEffect(() => {
    if (status === "guest") router.replace("/signin?next=/my-orders");
  }, [status, router]);

  const stats = useAsync(() => ordersApi.myStats(), [], ready);
  const orders = useAsync(
    () => ordersApi.myOrders({ page, limit: 10, status: TABS[tab].status }),
    [page, tab],
    ready
  );

  return (
    <>
      <PageHero
        title="My Orders"
        subtitle="Track, manage and reorder your purchases."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/my-account" },
          { label: "My Orders" },
        ]}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {stats.data && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Total Orders" value={String(stats.data.totalOrders)} />
            <Stat label="Total Spent" value={formatPriceBDT(stats.data.totalSpent)} />
            <Stat
              label="In Progress"
              value={String(
                ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery"].reduce(
                  (s, k) => s + (stats.data!.byStatus[k as keyof typeof stats.data.byStatus] ?? 0),
                  0
                )
              )}
            />
            <Stat label="Delivered" value={String(stats.data.byStatus.delivered ?? 0)} />
          </div>
        )}

        <div className="mb-5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              onClick={() => {
                setTab(i);
                setPage(1);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                tab === i ? "bg-brand text-white shadow-sm" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!ready || orders.loading ? (
          <Spinner label="Loading your orders…" />
        ) : orders.error ? (
          <ErrorBox message={orders.error} onRetry={orders.reload} />
        ) : !orders.data?.items.length ? (
          <div className="rounded-3xl bg-white p-12 text-center ring-1 ring-slate-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
              <CartIcon className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">No orders here yet</h3>
            <p className="mt-1 text-sm text-slate-500">When you place an order it will appear here.</p>
            <Link href="/shop" className="mt-5 inline-flex rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-dark">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.data.items.map((o) => (
              <Link
                key={o._id}
                href={`/my-orders/${o._id}`}
                className="block rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:ring-brand/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-sm font-black text-slate-900">#{o.orderNumber}</div>
                    <div className="text-[11px] text-slate-500">Placed {formatDate(o.placedAt)}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <OrderStatusBadge status={o.status} />
                    <PaymentStatusBadge status={o.paymentStatus} />
                    {o.cancellationRequest?.status === "pending" && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
                        Cancellation requested
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {o.items.slice(0, 4).map((it) => (
                      <span key={it._id} className="relative h-12 w-12 overflow-hidden rounded-xl bg-brand-soft ring-2 ring-white">
                        <SmartImage src={it.thumbnail} alt="" fill sizes="48px" className="object-contain p-1" />
                      </span>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1 text-xs text-slate-600">
                    <div className="line-clamp-1 font-semibold text-slate-800">
                      {o.items.map((i) => i.productName).join(", ")}
                    </div>
                    <div>
                      {o.items.reduce((s, i) => s + i.quantity, 0)} item(s) · {o.shippingMethod.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">{formatPriceBDT(o.grandTotal)}</div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-dark">
                      Details <ArrowRightIcon className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {orders.data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2 text-xs font-bold">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-full px-4 py-2 ring-1 ring-slate-200 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-slate-500">
                  Page {orders.data.page} of {orders.data.totalPages}
                </span>
                <button
                  disabled={page >= orders.data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full px-4 py-2 ring-1 ring-slate-200 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-xl font-black text-slate-900">{value}</div>
    </div>
  );
}
