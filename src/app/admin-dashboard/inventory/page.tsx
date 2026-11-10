import Image from "next/image";
import {
  AdminHeader,
  AdminButton,
  StatusPill,
  PlusIcon,
  DownloadIcon,
} from "../AdminHeader";
import { products } from "@/lib/products";

export const metadata = { title: "Inventory — Admin — OralCareBD" };

const stockLevels = [124, 18, 47, 0, 82, 36, 9, 51, 112, 28, 67, 41, 73, 58, 25, 95];
const reorderPoints = [50, 30, 40, 20, 50, 30, 20, 40, 60, 25, 50, 30, 50, 40, 20, 50];

export default function InventoryPage() {
  const enriched = products.map((p, i) => ({
    ...p,
    stock: stockLevels[i] ?? 50,
    reorder: reorderPoints[i] ?? 30,
    sku: `OCB-${p.slug.slice(0, 3).toUpperCase()}-${(i + 1).toString().padStart(3, "0")}`,
  }));

  const totalValue = enriched.reduce((sum, p) => {
    const price = parseFloat(p.price.replace(/[^\d.]/g, ""));
    return sum + price * p.stock;
  }, 0);

  const criticalCount = enriched.filter((p) => p.stock <= p.reorder).length;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Inventory" }]}
        title="Inventory"
        description="Track stock levels and reorder critical items."
        actions={
          <>
            <AdminButton icon={<DownloadIcon />}>Export</AdminButton>
            <AdminButton variant="primary" icon={<PlusIcon />}>Stock In</AdminButton>
          </>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          label="Total Inventory Value"
          value={`৳${totalValue.toLocaleString("en-IN")}`}
          sub="across all SKUs"
          accent="emerald"
        />
        <InfoCard
          label="Total Units in Stock"
          value={enriched.reduce((s, p) => s + p.stock, 0).toLocaleString()}
          sub={`${enriched.length} SKUs`}
          accent="blue"
        />
        <InfoCard
          label="Needs Reorder"
          value={criticalCount.toString()}
          sub="at or below reorder point"
          accent="amber"
        />
        <InfoCard
          label="Out of Stock"
          value={enriched.filter((p) => p.stock === 0).length.toString()}
          sub="items unavailable"
          accent="rose"
        />
      </div>

      {/* Alert banner */}
      {criticalCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-50 to-rose-50 p-5 ring-1 ring-amber-200">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700">
              <AlertIcon />
            </span>
            <div>
              <div className="font-bold text-slate-900">
                {criticalCount} items need restocking
              </div>
              <div className="text-xs text-slate-600">
                These SKUs are at or below their reorder point. Place a purchase order soon.
              </div>
            </div>
          </div>
          <button className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600">
            Create Purchase Order
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">In Stock</th>
                <th className="px-6 py-3">Reorder At</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {enriched.map((p) => {
                const percent = Math.min(100, (p.stock / Math.max(p.reorder * 2, 50)) * 100);
                const status =
                  p.stock === 0 ? "danger" : p.stock <= p.reorder ? "warning" : "success";
                const statusLabel =
                  p.stock === 0 ? "Out of Stock" : p.stock <= p.reorder ? "Low Stock" : "In Stock";
                const barColor =
                  p.stock === 0
                    ? "bg-rose-500"
                    : p.stock <= p.reorder
                    ? "bg-amber-500"
                    : "bg-emerald-500";
                return (
                  <tr key={p.slug} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image src={p.img} alt="" fill sizes="40px" className="object-contain p-1" />
                        </span>
                        <div className="line-clamp-1 max-w-[260px] font-bold text-slate-900">
                          {p.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.sku}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-10 font-bold text-slate-900">{p.stock}</span>
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${barColor}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{p.reorder}</td>
                    <td className="px-6 py-4">
                      <StatusPill tone={status}>{statusLabel}</StatusPill>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-brand hover:text-brand-dark">
                          Adjust
                        </button>
                        <button className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-bold text-white hover:bg-brand-dark">
                          Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "emerald" | "blue" | "amber" | "rose";
}) {
  const bg = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-sky-50 text-sky-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  }[accent];
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
          <div className="mt-1 text-xs text-slate-500">{sub}</div>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
          <BoxMiniIcon />
        </span>
      </div>
    </div>
  );
}

function BoxMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z" strokeLinejoin="round" />
      <path d="m3 7 9 5 9-5M12 22V12" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
      <path d="M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinejoin="round" />
    </svg>
  );
}
