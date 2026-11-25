"use client";

import { useState } from "react";
import Link from "next/link";
import { adminOrdersApi } from "@/lib/api";
import { formatDate, formatPriceBDT, humanize } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { AdminHeader } from "../AdminHeader";
import { Loader, btn, inputCls } from "../AdminShell";

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function AnalyticsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const data = useAsync(() => adminOrdersApi.analytics(range), [range.from, range.to]);
  const a = data.data;

  const preset = (days: number) => {
    const end = new Date();
    const start = new Date(end.getTime() - days * 86_400_000);
    setFrom(isoDay(start));
    setTo(isoDay(end));
    setRange({ from: start.toISOString(), to: end.toISOString() });
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Analytics" }]}
        title="Analytics"
        description={a ? `${formatDate(a.range.from)} – ${formatDate(a.range.to)}` : "Order performance"}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setRange({
            from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
            to: to ? new Date(`${to}T23:59:59`).toISOString() : undefined,
          });
        }}
        className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200/70"
      >
        <label className="text-xs font-bold text-slate-600">
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`mt-1 ${inputCls}`} />
        </label>
        <label className="text-xs font-bold text-slate-600">
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={`mt-1 ${inputCls}`} />
        </label>
        <button className={btn.primary}>Apply</button>
        <button type="button" onClick={() => preset(7)} className={btn.secondary}>
          7 days
        </button>
        <button type="button" onClick={() => preset(30)} className={btn.secondary}>
          30 days
        </button>
        <button type="button" onClick={() => preset(90)} className={btn.secondary}>
          90 days
        </button>
      </form>

      {data.loading ? (
        <Loader />
      ) : data.error ? (
        <p className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{data.error}</p>
      ) : a ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
            <Stat label="Orders" value={String(a.totals.orders)} />
            <Stat label="Gross revenue" value={formatPriceBDT(a.totals.grossRevenue)} />
            <Stat label="Paid revenue" value={formatPriceBDT(a.totals.paidRevenue)} />
            <Stat label="Avg order" value={formatPriceBDT(a.totals.averageOrderValue)} />
            <Stat label="Discounts" value={formatPriceBDT(a.totals.discounts)} />
            <Stat label="Shipping" value={formatPriceBDT(a.totals.shippingCollected)} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Orders by status">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(a.byStatus).map(([s, n]) => (
                    <tr key={s}>
                      <td className="py-2">
                        <Link href={`/admin-dashboard/orders?status=${s}`} className="text-slate-700 hover:text-brand-dark">
                          {humanize(s)}
                        </Link>
                      </td>
                      <td className="py-2 text-right font-bold text-slate-900">{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>

            <Panel title="Payments">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-2">Method</th>
                    <th className="py-2 text-right">Orders</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {a.byPaymentMethod.map((m) => (
                    <tr key={m.method}>
                      <td className="py-2 text-slate-700">{m.method === "cod" ? "Cash on delivery" : "Online"}</td>
                      <td className="py-2 text-right font-semibold">{m.orders}</td>
                      <td className="py-2 text-right font-bold text-slate-900">{formatPriceBDT(m.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(a.byPaymentStatus).map(([s, n]) => (
                  <span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {humanize(s)}: {n}
                  </span>
                ))}
              </div>
            </Panel>

            <Panel title="Daily">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-2">Date</th>
                    <th className="py-2 text-right">Orders</th>
                    <th className="py-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {a.daily.map((d) => (
                    <tr key={d.date}>
                      <td className="py-2 text-slate-700">{formatDate(d.date)}</td>
                      <td className="py-2 text-right font-semibold">{d.orders}</td>
                      <td className="py-2 text-right font-bold text-slate-900">{formatPriceBDT(d.revenue)}</td>
                    </tr>
                  ))}
                  {!a.daily.length && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-500">
                        No orders in this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Panel>

            <Panel title="Top products">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-2">Product</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {a.topProducts.map((p) => (
                    <tr key={p.productId}>
                      <td className="py-2">
                        <Link href={`/admin-dashboard/products/${p.productId}`} className="text-slate-700 hover:text-brand-dark">
                          {p.productName}
                        </Link>
                      </td>
                      <td className="py-2 text-right font-semibold">{p.quantity}</td>
                      <td className="py-2 text-right font-bold text-slate-900">{formatPriceBDT(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
      <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-black text-slate-900">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
      <h2 className="mb-3 text-base font-black text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
