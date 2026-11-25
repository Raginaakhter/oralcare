"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { adminOrdersApi, ORDER_STATUSES, type AdminOrderListQuery } from "@/lib/api";
import { formatDateTime, formatPriceBDT, humanize } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders";
import { AdminHeader, SearchIcon, EyeIcon } from "../AdminHeader";
import { EmptyRow, Loader, Pagination, btn, inputCls, useAdminAction } from "../AdminShell";

export function OrdersList() {
  const sp = useSearchParams();
  const run = useAdminAction();
  const [search, setSearch] = useState(sp.get("search") ?? "");
  const [q, setQ] = useState<AdminOrderListQuery>({
    page: 1,
    limit: 20,
    sort: "newest",
    search: sp.get("search") ?? undefined,
    status: sp.get("status") ?? undefined,
    hasCancellationRequest: sp.get("hasCancellationRequest") === "true" ? true : undefined,
    customer: sp.get("customer") ?? undefined,
  });
  const requestsOnly = q.hasCancellationRequest === true;

  const list = useAsync(
    () =>
      requestsOnly
        ? adminOrdersApi.cancellationRequests({ page: q.page, limit: q.limit })
        : adminOrdersApi.list(q),
    [JSON.stringify(q)]
  );
  const set = (patch: Partial<AdminOrderListQuery>) => setQ((prev) => ({ ...prev, page: 1, ...patch }));

  const expire = async () => {
    const r = await run(() => adminOrdersApi.expireUnpaid(60), (res) => res.message ?? `${res.data.expired} order(s) expired`);
    if (r) void list.reload();
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Orders" }]}
        title={requestsOnly ? "Cancellation requests" : "Orders"}
        description={list.data ? `${list.data.total} orders` : undefined}
        actions={
          <>
            <button onClick={() => set({ hasCancellationRequest: requestsOnly ? undefined : true })} className={requestsOnly ? btn.primary : btn.secondary}>
              {requestsOnly ? "Show all orders" : "Cancellation requests"}
            </button>
            <button onClick={expire} className={btn.secondary} title="Fail unpaid online orders older than 60 minutes and release their stock">
              Expire unpaid (60 min)
            </button>
          </>
        }
      />

      {!requestsOnly && (
        <>
          <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[undefined, ...ORDER_STATUSES].map((s) => (
              <button
                key={s ?? "all"}
                onClick={() => set({ status: s })}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold ${
                  q.status === s ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {s ? humanize(s) : "All"}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              set({ search: search.trim() || undefined });
            }}
            className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200/70"
          >
            <div className="relative min-w-[220px] flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Order no., customer, phone, email…"
                className={`${inputCls} pl-10`}
              />
            </div>
            <select value={q.paymentStatus ?? ""} onChange={(e) => set({ paymentStatus: e.target.value || undefined })} className={`${inputCls} w-auto`}>
              <option value="">Any payment status</option>
              {["unpaid", "pending", "paid", "failed", "partially_refunded", "refunded"].map((s) => (
                <option key={s} value={s}>
                  {humanize(s)}
                </option>
              ))}
            </select>
            <select value={q.paymentMethod ?? ""} onChange={(e) => set({ paymentMethod: e.target.value || undefined })} className={`${inputCls} w-auto`}>
              <option value="">Any method</option>
              <option value="cod">Cash on delivery</option>
              <option value="online">Online</option>
            </select>
            <input
              type="date"
              aria-label="From date"
              value={q.from?.slice(0, 10) ?? ""}
              onChange={(e) => set({ from: e.target.value ? new Date(`${e.target.value}T00:00:00`).toISOString() : undefined })}
              className={`${inputCls} w-auto`}
            />
            <input
              type="date"
              aria-label="To date"
              value={q.to?.slice(0, 10) ?? ""}
              onChange={(e) => set({ to: e.target.value ? new Date(`${e.target.value}T23:59:59`).toISOString() : undefined })}
              className={`${inputCls} w-auto`}
            />
            <select value={q.sort} onChange={(e) => set({ sort: e.target.value as AdminOrderListQuery["sort"] })} className={`${inputCls} w-auto`}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="total-desc">Total ↓</option>
              <option value="total-asc">Total ↑</option>
              <option value="status">Status</option>
            </select>
            {q.customer && (
              <button type="button" onClick={() => set({ customer: undefined })} className={btn.secondary}>
                Customer filter ✕
              </button>
            )}
          </form>
        </>
      )}

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : list.error ? (
          <p className="p-6 text-sm font-semibold text-rose-700">{list.error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(list.data?.items ?? []).map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <Link href={`/admin-dashboard/orders/${o._id}`} className="font-mono font-bold text-slate-900 hover:text-brand-dark">
                        {o.orderNumber}
                      </Link>
                      <div className="text-[11px] text-slate-500">{formatDateTime(o.placedAt)}</div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-semibold text-slate-800">{o.customerName}</div>
                      <div className="text-[11px] text-slate-500">{o.shippingAddress?.phone}</div>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td className="px-6 py-3 font-bold text-slate-900">{formatPriceBDT(o.grandTotal)}</td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <OrderStatusBadge status={o.status} />
                        {o.cancellationRequest?.status === "pending" && (
                          <span className="text-[10px] font-bold text-amber-700">Cancel requested</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <PaymentStatusBadge status={o.paymentStatus} />
                      <div className="mt-1 text-[10px] uppercase text-slate-500">{o.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/admin-dashboard/orders/${o._id}`}
                        aria-label="Open"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                      >
                        <EyeIcon />
                      </Link>
                    </td>
                  </tr>
                ))}
                {!list.data?.items.length && <EmptyRow colSpan={7}>No orders match.</EmptyRow>}
              </tbody>
            </table>
          </div>
        )}
        {list.data && list.data.totalPages > 1 && (
          <Pagination
            page={list.data.page}
            totalPages={list.data.totalPages}
            total={list.data.total}
            onChange={(page) => setQ((prev) => ({ ...prev, page }))}
          />
        )}
      </div>
    </div>
  );
}
