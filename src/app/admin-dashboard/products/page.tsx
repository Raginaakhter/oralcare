import Image from "next/image";
import Link from "next/link";
import {
  AdminHeader,
  AdminButton,
  StatusPill,
  PlusIcon,
  FilterIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  SearchIcon,
} from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { products } from "@/lib/products";

export const metadata = { title: "Products — Admin — OralCareBD" };

export default function ProductsPage() {
  // Add synthetic stock + status for demo
  const enriched = products.map((p, i) => ({
    ...p,
    stock: [124, 18, 47, 0, 82, 36, 9, 51, 112, 28, 67, 41, 73, 58, 25, 95][i] ?? 50,
  }));
  const inStock = enriched.filter((p) => p.stock > 10).length;
  const lowStock = enriched.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outStock = enriched.filter((p) => p.stock === 0).length;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Products" }]}
        title="Products"
        description={`${enriched.length} products in your catalog.`}
        actions={
          <>
            <AdminButton icon={<DownloadIcon />}>Export</AdminButton>
            <Link
              href="/admin-dashboard/products/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              <PlusIcon />
              Add Product
            </Link>
          </>
        }
      />

      {/* Status cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="All Products" value={enriched.length} tone="slate" active />
        <StatCard label="In Stock" value={inStock} tone="emerald" />
        <StatCard label="Low Stock" value={lowStock} tone="amber" />
        <StatCard label="Out of Stock" value={outStock} tone="rose" />
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200/70">
        <div className="relative flex-1 min-w-[200px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="Search products..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-brand focus:bg-white"
          />
        </div>
        <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none">
          <option>All Categories</option>
          <option>Toothpaste</option>
          <option>Teeth Whitening</option>
          <option>Mouthwash</option>
        </select>
        <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none">
          <option>All Brands</option>
          <option>White Glo</option>
          <option>Sensodyne</option>
          <option>TheraBreath</option>
        </select>
        <button className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark">
          <FilterIcon />
          More Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="w-10 px-6 py-3">
                  <input type="checkbox" className="accent-brand" />
                </th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {enriched.map((p) => {
                const status =
                  p.stock === 0 ? "danger" : p.stock <= 10 ? "warning" : "success";
                const statusLabel =
                  p.stock === 0 ? "Out of Stock" : p.stock <= 10 ? "Low Stock" : "Active";
                return (
                  <tr key={p.slug} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="accent-brand" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image src={p.img} alt="" fill sizes="44px" className="object-contain p-1" />
                        </span>
                        <div className="leading-tight">
                          <div className="line-clamp-1 max-w-[280px] font-bold text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-500">
                            {p.brand} · {p.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 capitalize">
                      {p.category.replace("-", " ")}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{p.price}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          p.stock === 0
                            ? "text-rose-600"
                            : p.stock <= 10
                            ? "text-amber-600"
                            : "text-slate-900"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill tone={status}>{statusLabel}</StatusPill>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin-dashboard/products/${p.slug}`}
                          aria-label="View"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <EyeIcon />
                        </Link>
                        <Link
                          href={`/admin-dashboard/products/${p.slug}/edit`}
                          aria-label="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <EditIcon />
                        </Link>
                        <DeleteButton itemLabel={p.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs">
          <span className="text-slate-500">
            Showing <span className="font-bold text-slate-900">1–{enriched.length}</span> of {enriched.length}
          </span>
          <div className="flex items-center gap-1">
            <button className="rounded-lg px-3 py-1.5 font-bold text-slate-400 hover:bg-slate-100">Prev</button>
            <button className="rounded-lg bg-slate-900 px-3 py-1.5 font-bold text-white">1</button>
            <button className="rounded-lg px-3 py-1.5 font-bold text-slate-500 hover:bg-slate-100">2</button>
            <button className="rounded-lg px-3 py-1.5 font-bold text-slate-500 hover:bg-slate-100">3</button>
            <button className="rounded-lg px-3 py-1.5 font-bold text-slate-500 hover:bg-slate-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  active,
}: {
  label: string;
  value: number;
  tone: "slate" | "emerald" | "amber" | "rose";
  active?: boolean;
}) {
  const borderCls = active ? "border-brand bg-brand-soft" : "border-slate-200 bg-white";
  const accent = {
    slate: "text-slate-900",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
  }[tone];
  return (
    <button
      className={`rounded-2xl border p-4 text-left ring-0 transition hover:border-brand ${borderCls}`}
    >
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-2 text-2xl font-black ${accent}`}>{value}</div>
    </button>
  );
}

