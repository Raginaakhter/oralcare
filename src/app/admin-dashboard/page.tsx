"use client";

import Link from "next/link";
import { adminOrdersApi, productsApi, systemApi } from "@/lib/api";
import { formatDate, formatPriceBDT, humanize } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders";
import { useAuth } from "@/context/AuthContext";
import { AdminHeader, SeeAllLink } from "./AdminHeader";
import { Loader } from "./AdminShell";

export default function AdminDashboardPage() {
  const { user, can } = useAuth();
  const catalog = can("catalog:manage");
  const orders = can("orders:read");
  const analytics = useAsync(() => (orders ? adminOrdersApi.analytics() : Promise.resolve(null)), [orders]);
  const recent = useAsync(() => (orders ? adminOrdersApi.list({ limit: 6, sort: "newest" }) : Promise.resolve(null)), [orders]);
  const lowStock = useAsync(() => (catalog ? productsApi.lowStock({ limit: 5 }) : Promise.resolve(null)), [catalog]);
  const outOfStock = useAsync(() => (catalog ? productsApi.outOfStock({ limit: 5 }) : Promise.resolve(null)), [catalog]);
  const health = useAsync(() => systemApi.health(), []);
  // API identity: GET / (welcome) and the OpenAPI spec's title/version.
  const apiInfo = useAsync(async () => {
    const [welcome, spec] = await Promise.all([systemApi.welcome(), systemApi.openapi()]);
    const info = (spec.info ?? {}) as { title?: string; version?: string };
    return { message: welcome.message, title: info.title, version: info.version };
  }, []);

  const a = analytics.data;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        eyebrow={`Welcome back, ${user?.fullName.split(" ")[0] ?? ""}`}
        title="Dashboard"
        description={a ? `Last 30 days · ${formatDate(a.range.from)} – ${formatDate(a.range.to)}` : "Store overview"}
        actions={
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold ring-1 ${
                health.data?.status === "ok"
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-rose-50 text-rose-700 ring-rose-200"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              API {health.loading ? "…" : health.data?.status === "ok" ? `online · DB ${health.data.database.status}` : "unreachable"}
            </span>
            <a
              href={systemApi.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:border-brand"
            >
              {apiInfo.data?.version ? `API v${apiInfo.data.version} docs ↗` : "API docs ↗"}
            </a>
          </div>
        }
      />

      {analytics.error && (
        <p className="mb-4 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 ring-1 ring-rose-200">{analytics.error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Revenue (gross)" value={a ? formatPriceBDT(a.totals.grossRevenue) : "—"} sub={a ? `${formatPriceBDT(a.totals.paidRevenue)} paid` : ""} />
        <Kpi label="Orders" value={a ? String(a.totals.orders) : "—"} sub={a ? `Avg ${formatPriceBDT(a.totals.averageOrderValue)}` : ""} />
        <Kpi label="Discounts given" value={a ? formatPriceBDT(a.totals.discounts) : "—"} sub={a ? `${formatPriceBDT(a.totals.shippingCollected)} shipping collected` : ""} />
        <Kpi
          label="Cancellation requests"
          value={a ? String(a.pendingCancellationRequests) : "—"}
          sub="awaiting review"
          href="/admin-dashboard/orders?hasCancellationRequest=true"
          warn={!!a?.pendingCancellationRequests}
        />
      </div>

      {a && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-11">
          {Object.entries(a.byStatus).map(([s, n]) => (
            <Link
              key={s}
              href={`/admin-dashboard/orders?status=${s}`}
              className="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200/70 hover:ring-brand"
            >
              <div className="text-lg font-black text-slate-900">{n}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{humanize(s)}</div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-base font-black text-slate-900">Recent Orders</h2>
            <SeeAllLink href="/admin-dashboard/orders" />
          </div>
          {recent.loading ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">Order</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(recent.data?.items ?? []).map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <Link href={`/admin-dashboard/orders/${o._id}`} className="font-mono font-bold text-slate-900 hover:text-brand-dark">
                          {o.orderNumber}
                        </Link>
                        <div className="text-[11px] text-slate-500">{formatDate(o.placedAt)}</div>
                      </td>
                      <td className="px-6 py-3 text-slate-700">{o.customerName}</td>
                      <td className="px-6 py-3 font-bold text-slate-900">{formatPriceBDT(o.grandTotal)}</td>
                      <td className="px-6 py-3">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-6 py-3">
                        <PaymentStatusBadge status={o.paymentStatus} />
                      </td>
                    </tr>
                  ))}
                  {!recent.data?.items.length && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900">Top Products</h2>
              <SeeAllLink href="/admin-dashboard/analytics" />
            </div>
            <ul className="space-y-2 text-sm">
              {(a?.topProducts ?? []).slice(0, 5).map((p) => (
                <li key={p.productId} className="flex items-center justify-between gap-3">
                  <span className="line-clamp-1 text-slate-700">{p.productName}</span>
                  <span className="shrink-0 text-xs font-bold text-slate-900">
                    {p.quantity} sold · {formatPriceBDT(p.revenue)}
                  </span>
                </li>
              ))}
              {a && !a.topProducts.length && <li className="text-slate-500">No sales in this period.</li>}
            </ul>
          </section>

          {catalog && (
            <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Stock Alerts</h2>
                <SeeAllLink href="/admin-dashboard/inventory" />
              </div>
              <ul className="space-y-2 text-sm">
                {[...(outOfStock.data?.items ?? []), ...(lowStock.data?.items ?? [])].slice(0, 8).map((p) => (
                  <li key={p._id} className="flex items-center justify-between gap-3">
                    <Link href={`/admin-dashboard/products/${p._id}`} className="line-clamp-1 text-slate-700 hover:text-brand-dark">
                      {p.productName}
                    </Link>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        p.stockQuantity === 0 ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.stockQuantity} left
                    </span>
                  </li>
                ))}
                {!outOfStock.loading && !lowStock.loading && !outOfStock.data?.items.length && !lowStock.data?.items.length && (
                  <li className="text-slate-500">All products are well stocked.</li>
                )}
              </ul>
            </section>
          )}

          {a && (
            <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
              <h2 className="mb-3 text-base font-black text-slate-900">Payments</h2>
              <ul className="space-y-2 text-sm">
                {a.byPaymentMethod.map((m) => (
                  <li key={m.method} className="flex justify-between">
                    <span className="text-slate-600">{m.method === "cod" ? "Cash on delivery" : "Online"}</span>
                    <span className="font-bold text-slate-900">
                      {m.orders} · {formatPriceBDT(m.total)}
                    </span>
                  </li>
                ))}
                {Object.entries(a.byPaymentStatus).map(([s, n]) => (
                  <li key={s} className="flex justify-between text-xs">
                    <span className="text-slate-500">{humanize(s)}</span>
                    <span className="font-semibold text-slate-700">{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  href,
  warn,
}: {
  label: string;
  value: string;
  sub?: string;
  href?: string;
  warn?: boolean;
}) {
  const body = (
    <div className={`rounded-2xl bg-white p-5 ring-1 ${warn ? "ring-amber-300" : "ring-slate-200/70"} ${href ? "hover:ring-brand" : ""}`}>
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-2 text-2xl font-black ${warn ? "text-amber-600" : "text-slate-900"}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
