"use client";

import { useState } from "react";
import Link from "next/link";
import { adminOrdersApi } from "@/lib/api";
import type { OrderStatus } from "@/lib/api";
import { formatDate, formatPriceBDT, humanize } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { ORDER_STATUS_TONE } from "@/components/orders";
import { AdminHeader } from "../AdminHeader";
import { Loader, btn, inputCls } from "../AdminShell";
import { AreaChart, BarList, CHART, ChartCard, ColumnChart, DonutChart, STATUS_COLOR, compact } from "../Charts";

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

const PRESETS = [7, 30, 90];

export default function AnalyticsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const [active, setActive] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const data = useAsync(() => adminOrdersApi.analytics(range), [range.from, range.to]);
  const a = data.data;

  const preset = (days: number) => {
    const end = new Date();
    const start = new Date(end.getTime() - days * 86_400_000);
    setFrom(isoDay(start));
    setTo(isoDay(end));
    setActive(days);
    setRange({ from: start.toISOString(), to: end.toISOString() });
  };

  const revenueSeries = (a?.daily ?? []).map((d) => ({ date: d.date, value: d.revenue }));
  const orderSeries = (a?.daily ?? []).map((d) => ({ date: d.date, value: d.orders }));

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Analytics" }]}
        title={<span className="bg-gradient-to-r from-teal-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Analytics</span>}
        description={a ? `${formatDate(a.range.from)} – ${formatDate(a.range.to)}` : "Order performance"}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setActive(null);
          setRange({
            from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
            to: to ? new Date(`${to}T23:59:59`).toISOString() : undefined,
          });
        }}
        className="mb-6 flex flex-wrap items-end gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70"
      >
        <div className="flex rounded-2xl bg-slate-100 p-1">
          {PRESETS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => preset(d)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                active === d ? "bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {d} days
            </button>
          ))}
        </div>
        <label className="text-xs font-bold text-slate-600">
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`mt-1 ${inputCls}`} />
        </label>
        <label className="text-xs font-bold text-slate-600">
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={`mt-1 ${inputCls}`} />
        </label>
        <button className={btn.primary}>Apply</button>
      </form>

      {data.loading ? (
        <Loader />
      ) : data.error ? (
        <p className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{data.error}</p>
      ) : a ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
            <Stat tone="from-teal-500 to-cyan-500" label="Orders" value={String(a.totals.orders)} />
            <Stat tone="from-cyan-500 to-blue-500" label="Gross revenue" value={formatPriceBDT(a.totals.grossRevenue)} />
            <Stat tone="from-blue-500 to-indigo-500" label="Paid revenue" value={formatPriceBDT(a.totals.paidRevenue)} />
            <Stat tone="from-indigo-500 to-violet-500" label="Avg order" value={formatPriceBDT(a.totals.averageOrderValue)} />
            <Stat tone="from-violet-500 to-fuchsia-500" label="Discounts" value={formatPriceBDT(a.totals.discounts)} />
            <Stat tone="from-fuchsia-500 to-pink-500" label="Shipping" value={formatPriceBDT(a.totals.shippingCollected)} />
          </div>

          <ChartCard
            title="Revenue"
            subtitle="Daily gross revenue (৳)"
            accent="from-teal-400 via-cyan-500 to-blue-500"
            action={
              <button type="button" onClick={() => setShowTable((v) => !v)} className={btn.secondary}>
                {showTable ? "Hide table" : "Show table"}
              </button>
            }
          >
            <AreaChart data={revenueSeries} label="Revenue" format={(n) => `৳${compact(n)}`} height={280} />
            {showTable && (
              <div className="mt-5 max-h-80 overflow-y-auto border-t border-slate-100 pt-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <th className="py-2">Date</th>
                      <th className="py-2 text-right">Orders</th>
                      <th className="py-2 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 tabular-nums">
                    {a.daily.map((d) => (
                      <tr key={d.date}>
                        <td className="py-2 text-slate-700">{formatDate(d.date)}</td>
                        <td className="py-2 text-right font-semibold">{d.orders}</td>
                        <td className="py-2 text-right font-bold text-slate-900">{formatPriceBDT(d.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ChartCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Orders per day" subtitle="Number of orders placed" accent="from-violet-500 to-indigo-500">
              <ColumnChart data={orderSeries} label="Orders" color={CHART.violet} />
            </ChartCard>

            <ChartCard title="Payments" subtitle="Orders by payment method" accent="from-violet-500 to-fuchsia-500">
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
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {Object.entries(a.byPaymentStatus).map(([s, n]) => (
                  <span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                    {humanize(s)} <span className="font-black text-slate-900">{n}</span>
                  </span>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Orders by status" subtitle="Click a status to filter orders" accent="from-amber-400 via-rose-400 to-emerald-400">
              <BarList
                rows={(Object.entries(a.byStatus) as [OrderStatus, number][]).map(([s, n]) => ({
                  label: humanize(s),
                  value: n,
                  display: String(n),
                  color: STATUS_COLOR[ORDER_STATUS_TONE[s] ?? "slate"],
                  href: `/admin-dashboard/orders?status=${s}`,
                }))}
              />
            </ChartCard>

            <ChartCard title="Top products" subtitle="By revenue" accent="from-pink-500 to-orange-400">
              <BarList
                empty="No sales in this period."
                rows={a.topProducts.map((p) => ({
                  label: p.productName,
                  value: p.revenue,
                  display: formatPriceBDT(p.revenue),
                  sub: `${p.quantity} sold`,
                  color: CHART.pink,
                  href: `/admin-dashboard/products/${p.productId}`,
                }))}
              />
              {a.topProducts.length > 0 && (
                <Link href="/admin-dashboard/products" className="mt-4 inline-block text-xs font-bold text-indigo-700 hover:underline">
                  All products →
                </Link>
              )}
            </ChartCard>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${tone}`} />
      <div className={`pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br ${tone} opacity-15 blur-xl`} />
      <div className="pl-2 text-[10px] font-black uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 pl-2 text-xl font-black text-slate-900">{value}</div>
    </div>
  );
}
