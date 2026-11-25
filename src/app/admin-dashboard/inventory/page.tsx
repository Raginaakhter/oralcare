"use client";

import { useState } from "react";
import Link from "next/link";
import { productsApi, type StockAlertProduct, type StockChangeType } from "@/lib/api";
import { humanize } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import { AdminHeader, StatusPill } from "../AdminHeader";
import { EmptyRow, Loader, Pagination, btn, inputCls, useAdminAction } from "../AdminShell";

export default function InventoryPage() {
  const { can } = useAuth();
  const [tab, setTab] = useState<"low" | "out" | "all">("low");
  const [page, setPage] = useState(1);
  const low = useAsync(() => productsApi.lowStock({ limit: 1 }), []);
  const out = useAsync(() => productsApi.outOfStock({ limit: 1 }), []);
  const list = useAsync<{ items: StockAlertProduct[]; page: number; totalPages: number; total: number }>(
    () =>
      tab === "low"
        ? productsApi.lowStock({ page, limit: 25 })
        : tab === "out"
        ? productsApi.outOfStock({ page, limit: 25 })
        : productsApi.list({ page, limit: 25, sort: "newest" }),
    [tab, page]
  );

  if (!can("catalog:manage")) {
    return <p className="rounded-2xl bg-amber-50 p-5 text-sm font-semibold text-amber-800">You need the “Manage catalog” permission to manage inventory.</p>;
  }

  const refresh = () => {
    void list.reload();
    void low.reload();
    void out.reload();
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Inventory" }]}
        title="Inventory"
        description="Watch stock levels and restock quickly. Every adjustment is recorded in the product's stock history."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {(
          [
            { key: "low", label: "Low stock", value: low.data?.total, tone: "text-amber-600" },
            { key: "out", label: "Out of stock", value: out.data?.total, tone: "text-rose-600" },
            { key: "all", label: "All products", value: undefined, tone: "text-slate-900" },
          ] as const
        ).map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setTab(s.key);
              setPage(1);
            }}
            className={`rounded-2xl border p-4 text-left transition hover:border-brand ${
              tab === s.key ? "border-brand bg-brand-soft" : "border-slate-200 bg-white"
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
            <div className={`mt-2 text-2xl font-black ${s.tone}`}>{s.value ?? "—"}</div>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Alert at</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Quick adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(list.data?.items ?? []).map((p) => (
                  <Row key={p._id} p={p} onDone={refresh} />
                ))}
                {!list.data?.items.length && <EmptyRow colSpan={5}>Nothing here — stock levels look healthy.</EmptyRow>}
              </tbody>
            </table>
          </div>
        )}
        {list.data && list.data.totalPages > 1 && (
          <Pagination page={list.data.page} totalPages={list.data.totalPages} total={list.data.total} onChange={setPage} />
        )}
      </div>
    </div>
  );
}

function Row({ p, onDone }: { p: StockAlertProduct; onDone: () => void }) {
  const run = useAdminAction();
  const [change, setChange] = useState("");
  const [type, setType] = useState<StockChangeType>("restock");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(change);
    if (!Number.isInteger(n) || n === 0) return;
    setBusy(true);
    const r = await run(() => productsApi.adjustStock(p._id, { change: n, type }), (res) => `${p.productName}: ${res.data.newQuantity} in stock`);
    setBusy(false);
    if (r) {
      setChange("");
      onDone();
    }
  };

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-3">
        <Link href={`/admin-dashboard/products/${p._id}`} className="font-bold text-slate-900 hover:text-brand-dark">
          {p.productName}
        </Link>
        <div className="text-xs text-slate-500">{p.sku}</div>
      </td>
      <td className="px-6 py-3 text-lg font-black text-slate-900">{p.stockQuantity}</td>
      <td className="px-6 py-3 text-slate-600">{p.lowStockThreshold}</td>
      <td className="px-6 py-3">
        <StatusPill tone={p.stockStatus === "out-of-stock" ? "danger" : p.stockStatus === "low-stock" ? "warning" : "success"}>
          {humanize(p.stockStatus)}
        </StatusPill>
      </td>
      <td className="px-6 py-3">
        <form onSubmit={submit} className="flex items-center gap-2">
          <input
            type="number"
            step={1}
            value={change}
            onChange={(e) => setChange(e.target.value)}
            placeholder="+10"
            aria-label={`Stock change for ${p.productName}`}
            className={`${inputCls} w-24`}
          />
          <select value={type} onChange={(e) => setType(e.target.value as StockChangeType)} className={`${inputCls} w-32`}>
            {(["restock", "adjustment", "damage", "audit"] as StockChangeType[]).map((t) => (
              <option key={t} value={t}>
                {humanize(t)}
              </option>
            ))}
          </select>
          <button disabled={busy || !change} className={btn.primary}>
            Apply
          </button>
        </form>
      </td>
    </tr>
  );
}
