"use client";

import Link from "next/link";
import { adminOrdersApi, productsApi, systemApi } from "@/lib/api";
import type { OrderStatus } from "@/lib/api";
import { formatDate, formatPriceBDT, humanize } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { ORDER_STATUS_TONE, OrderStatusBadge, PaymentStatusBadge } from "@/components/orders";
import { useAuth } from "@/context/AuthContext";
import { SeeAllLink } from "./AdminHeader";
import { Loader } from "./AdminShell";
import { AreaChart, BarList, CHART, ChartCard, ColumnChart, DonutChart, STATUS_COLOR, compact } from "./Charts";

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
  const online = health.data?.status === "ok";
  const revenueSeries = (a?.daily ?? []).map((d) => ({ date: d.date, value: d.revenue }));
  const orderSeries = (a?.daily ?? []).map((d) => ({ date: d.date, value: d.orders }));
  const statusRows = a
    ? (Object.entries(a.byStatus) as [OrderStatus, number][])
        .filter(([, n]) => n > 0)
        .map(([s, n]) => ({
          label: humanize(s),
          value: n,
          display: String(n),
          color: STATUS_COLOR[ORDER_STATUS_TONE[s] ?? "slate"],
          href: `/admin-dashboard/orders?status=${s}`,
        }))
    : [];

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Hero banner */}
      <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 via-cyan-600 to-indigo-600 p-6 text-white shadow-xl shadow-cyan-600/20 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-fuchsia-400/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Welcome back, {user?.fullName.split(" ")[0] ?? ""} 👋
            </div>
            <h1 className="mt-1 text-3xl font-black sm:text-4xl">Dashboard</h1>
            <p className="mt-1 text-sm text-white/80">
              {a ? `Last 30 days · ${formatDate(a.range.from)} – ${formatDate(a.range.to)}` : "Store overview"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-bold ring-1 ring-white/25 backdrop-blur">
              <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-300" : "bg-rose-300"}`} />
              API {health.loading ? "…" : online ? `online · DB ${health.data!.database.status}` : "unreachable"}
            </span>
            <a
              href={systemApi.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-3 py-1.5 font-bold text-indigo-700 shadow-sm transition hover:-translate-y-0.5"
            >
              {apiInfo.data?.version ? `API v${apiInfo.data.version} docs ↗` : "API docs ↗"}
            </a>
          </div>
        </div>
      </section>

      {analytics.error && (
        <p className="mb-4 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 ring-1 ring-rose-200">{analytics.error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          tone="teal"
          icon={<MoneyIcon />}
          label="Revenue (gross)"
          value={a ? formatPriceBDT(a.totals.grossRevenue) : "—"}
          sub={a ? `${formatPriceBDT(a.totals.paidRevenue)} paid` : ""}
        />
        <Kpi
          tone="violet"
          icon={<BagIcon />}
          label="Orders"
          value={a ? String(a.totals.orders) : "—"}
          sub={a ? `Avg ${formatPriceBDT(a.totals.averageOrderValue)}` : ""}
        />
        <Kpi
          tone="pink"
          icon={<PercentIcon />}
          label="Discounts given"
          value={a ? formatPriceBDT(a.totals.discounts) : "—"}
          sub={a ? `${formatPriceBDT(a.totals.shippingCollected)} shipping collected` : ""}
        />
        <Kpi
          tone="amber"
          icon={<AlertIcon />}
          label="Cancellation requests"
          value={a ? String(a.pendingCancellationRequests) : "—"}
          sub="awaiting review"
          href="/admin-dashboard/orders?hasCancellationRequest=true"
        />
      </div>

      {orders && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <ChartCard
            title="Revenue trend"
            subtitle="Daily gross revenue (৳)"
            accent="from-teal-400 via-cyan-500 to-blue-500"
            action={<SeeAllLink href="/admin-dashboard/analytics" />}
          >
            {analytics.loading ? <Loader /> : <AreaChart data={revenueSeries} label="Revenue" format={(n) => `৳${compact(n)}`} />}
          </ChartCard>

          <ChartCard title="Payment methods" subtitle="Share of orders" accent="from-violet-500 to-fuchsia-500">
            {a ? (
              <DonutChart
                centerLabel="Orders"
                centerValue={String(a.byPaymentMethod.reduce((s, m) => s + m.orders, 0))}
                parts={a.byPaymentMethod.map((m) => ({
                  label: m.method === "cod" ? "Cash on delivery" : "Online",
                  value: m.orders,
                  display: `${m.orders} · ${formatPriceBDT(m.total)}`,
                  color: m.method === "cod" ? CHART.teal : CHART.violet,
                }))}
              />
            ) : (
              <Loader />
            )}
            {a && Object.keys(a.byPaymentStatus).length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {Object.entries(a.byPaymentStatus).map(([s, n]) => (
                  <span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                    {humanize(s)} <span className="font-black text-slate-900">{n}</span>
                  </span>
                ))}
              </div>
            )}
          </ChartCard>
        </div>
      )}

      {orders && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ChartCard title="Orders per day" subtitle="Number of orders placed" accent="from-violet-500 to-indigo-500">
            {analytics.loading ? <Loader /> : <ColumnChart data={orderSeries} label="Orders" color={CHART.violet} height={220} />}
          </ChartCard>
          <ChartCard title="Orders by status" subtitle="Click a status to filter orders" accent="from-amber-400 via-rose-400 to-emerald-400">
            {analytics.loading ? <Loader /> : <BarList rows={statusRows} empty="No orders in this period." />}
          </ChartCard>
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <ChartCard title="Recent orders" accent="from-sky-400 to-indigo-500" action={<SeeAllLink href="/admin-dashboard/orders" />} flush>
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
                    <tr key={o._id} className="transition hover:bg-cyan-50/50">
                      <td className="px-6 py-3">
                        <Link href={`/admin-dashboard/orders/${o._id}`} className="font-mono font-bold text-indigo-700 hover:text-indigo-900">
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
        </ChartCard>

        <div className="space-y-6">
          {orders && (
            <ChartCard
              title="Top products"
              subtitle="By revenue"
              accent="from-pink-500 to-orange-400"
              action={<SeeAllLink href="/admin-dashboard/analytics" />}
            >
              <BarList
                empty="No sales in this period."
                rows={(a?.topProducts ?? []).slice(0, 5).map((p) => ({
                  label: p.productName,
                  value: p.revenue,
                  display: formatPriceBDT(p.revenue),
                  sub: `${p.quantity} sold`,
                  color: CHART.pink,
                  href: `/admin-dashboard/products/${p.productId}`,
                }))}
              />
            </ChartCard>
          )}

          {catalog && (
            <ChartCard
              title="Stock alerts"
              accent="from-rose-500 to-amber-400"
              action={<SeeAllLink href="/admin-dashboard/inventory" />}
            >
              <ul className="space-y-2 text-sm">
                {[...(outOfStock.data?.items ?? []), ...(lowStock.data?.items ?? [])].slice(0, 8).map((p) => (
                  <li key={p._id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 hover:bg-slate-50">
                    <Link href={`/admin-dashboard/products/${p._id}`} className="line-clamp-1 text-slate-700 hover:text-indigo-700">
                      {p.productName}
                    </Link>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${
                        p.stockQuantity === 0 ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-amber-50 text-amber-700 ring-amber-200"
                      }`}
                    >
                      {p.stockQuantity === 0 ? "Out of stock" : `${p.stockQuantity} left`}
                    </span>
                  </li>
                ))}
                {!outOfStock.loading && !lowStock.loading && !outOfStock.data?.items.length && !lowStock.data?.items.length && (
                  <li className="rounded-xl bg-emerald-50 px-3 py-2 font-semibold text-emerald-700">✓ All products are well stocked.</li>
                )}
              </ul>
            </ChartCard>
          )}
        </div>
      </div>
    </div>
  );
}

const KPI_TONES = {
  teal: { card: "from-teal-50 to-white ring-teal-100", chip: "from-teal-400 to-cyan-600 shadow-teal-500/30", bar: "bg-teal-500" },
  violet: { card: "from-violet-50 to-white ring-violet-100", chip: "from-violet-500 to-indigo-600 shadow-violet-500/30", bar: "bg-violet-500" },
  pink: { card: "from-pink-50 to-white ring-pink-100", chip: "from-pink-500 to-rose-500 shadow-pink-500/30", bar: "bg-pink-500" },
  amber: { card: "from-amber-50 to-white ring-amber-100", chip: "from-amber-400 to-orange-500 shadow-amber-500/30", bar: "bg-amber-500" },
};

function Kpi({
  label,
  value,
  sub,
  href,
  icon,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  href?: string;
  icon: React.ReactNode;
  tone: keyof typeof KPI_TONES;
}) {
  const t = KPI_TONES[tone];
  const body = (
    <div
      className={`group relative h-full overflow-hidden rounded-3xl bg-gradient-to-br ${t.card} p-5 ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
          {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${t.chip}`}>
          {icon}
        </span>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-0 ${t.bar} transition-all duration-500 group-hover:w-full`} />
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}
function PercentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path d="M19 5 5 19" strokeLinecap="round" />
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path d="M12 3 2 20h20L12 3Z" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}
