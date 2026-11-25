"use client";

import { useState } from "react";
import Link from "next/link";
import { productsApi, type ProductListQuery, type StockStatus } from "@/lib/api";
import { brandName, categoryRef, productImage } from "@/lib/products";
import { formatPriceBDT } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { SmartImage } from "@/components/SmartImage";
import { AdminHeader, StatusPill, PlusIcon, EditIcon, EyeIcon, SearchIcon } from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { EmptyRow, Loader, Pagination, inputCls, useAdminAction } from "../AdminShell";
import { useCatalogOptions } from "../useCatalogOptions";

export default function ProductsPage() {
  const run = useAdminAction();
  const { categories, brands } = useCatalogOptions();
  const [search, setSearch] = useState("");
  const [q, setQ] = useState<ProductListQuery>({ page: 1, limit: 20, sort: "newest" });
  const [trash, setTrash] = useState(false);

  const list = useAsync(
    () => productsApi.list({ ...q, ...(trash ? { includeDeleted: true } : {}) }),
    [JSON.stringify(q), trash]
  );
  const items = (list.data?.items ?? []).filter((p) => (trash ? p.isDeleted : !p.isDeleted));
  const set = (patch: Partial<ProductListQuery>) => setQ((prev) => ({ ...prev, page: 1, ...patch }));

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Products" }]}
        title="Products"
        description={list.data ? `${list.data.total} products match.` : "Your catalog."}
        actions={
          <>
            <button
              onClick={() => setTrash((t) => !t)}
              className={`rounded-xl px-4 py-2 text-xs font-bold ${trash ? "bg-rose-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}
            >
              {trash ? "Showing trash" : "Trash"}
            </button>
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

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {(
          [
            { label: "All", value: undefined },
            { label: "In stock", value: "in-stock" },
            { label: "Low stock", value: "low-stock" },
            { label: "Out of stock", value: "out-of-stock" },
          ] as { label: string; value?: StockStatus }[]
        ).map((s) => (
          <button
            key={s.label}
            onClick={() => set({ stockStatus: s.value })}
            className={`rounded-2xl border p-4 text-left transition hover:border-brand ${
              q.stockStatus === s.value ? "border-brand bg-brand-soft" : "border-slate-200 bg-white"
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
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
        <div className="relative min-w-[200px] flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, SKU, description…"
            className={`${inputCls} pl-10`}
          />
        </div>
        <select value={q.category ?? ""} onChange={(e) => set({ category: e.target.value || undefined })} className={`${inputCls} w-auto`}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={q.brand ?? ""} onChange={(e) => set({ brand: e.target.value || undefined })} className={`${inputCls} w-auto`}>
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          value={q.isPublished === undefined ? "" : String(q.isPublished)}
          onChange={(e) => set({ isPublished: e.target.value === "" ? undefined : e.target.value === "true" })}
          className={`${inputCls} w-auto`}
        >
          <option value="">Any status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
        <select value={q.sort} onChange={(e) => set({ sort: e.target.value as ProductListQuery["sort"] })} className={`${inputCls} w-auto`}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="popularity">Featured first</option>
        </select>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : list.error ? (
          <p className="p-6 text-sm font-semibold text-rose-700">{list.error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items.map((p) => (
                  <tr key={p._id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <SmartImage src={productImage(p)} alt="" fill sizes="44px" className="object-contain p-1" />
                        </span>
                        <div className="leading-tight">
                          <Link
                            href={`/admin-dashboard/products/${p._id}`}
                            className="line-clamp-1 max-w-[280px] font-bold text-slate-900 hover:text-brand-dark"
                          >
                            {p.productName}
                          </Link>
                          <div className="text-xs text-slate-500">
                            {brandName(p) || "—"} · {p.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{categoryRef(p)?.name ?? "—"}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{formatPriceBDT(p.effectivePrice)}</div>
                      {p.salePrice != null && p.salePrice < p.regularPrice && (
                        <div className="text-[11px] text-slate-400 line-through">{formatPriceBDT(p.regularPrice)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          p.stockStatus === "out-of-stock" ? "text-rose-600" : p.stockStatus === "low-stock" ? "text-amber-600" : "text-slate-900"
                        }`}
                      >
                        {p.stockQuantity}
                      </span>
                      {p.productType === "variable" && <div className="text-[11px] text-slate-500">{p.variations.length} variations</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isDeleted ? (
                          <StatusPill tone="danger">Trashed</StatusPill>
                        ) : (
                          <StatusPill tone={p.isPublished ? "success" : "neutral"}>{p.isPublished ? "Published" : "Draft"}</StatusPill>
                        )}
                        {!p.isActive && <StatusPill tone="warning">Inactive</StatusPill>}
                        {p.isFeatured && <StatusPill tone="accent">Featured</StatusPill>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {trash ? (
                          <>
                            <button
                              onClick={async () => {
                                if (await run(() => productsApi.restore(p._id), "Product restored")) void list.reload();
                              }}
                              className="rounded-lg px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-brand-soft"
                            >
                              Restore
                            </button>
                            <DeleteButton
                              itemLabel={p.productName}
                              title="Delete permanently?"
                              body="This removes the product for good. It cannot be restored."
                              onConfirm={async () => {
                                const ok = await run(() => productsApi.remove(p._id, true), "Product permanently deleted");
                                if (ok) void list.reload();
                                return !!ok;
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/admin-dashboard/products/${p._id}`}
                              aria-label="View"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                              <EyeIcon />
                            </Link>
                            <Link
                              href={`/admin-dashboard/products/${p._id}/edit`}
                              aria-label="Edit"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                              <EditIcon />
                            </Link>
                            <DeleteButton
                              itemLabel={p.productName}
                              title="Move to trash?"
                              body={`"${p.productName}" will be hidden from the store. You can restore it from Trash.`}
                              confirmLabel="Move to trash"
                              onConfirm={async () => {
                                const ok = await run(() => productsApi.remove(p._id), "Product moved to trash");
                                if (ok) void list.reload();
                                return !!ok;
                              }}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && <EmptyRow colSpan={6}>{trash ? "Trash is empty." : "No products match these filters."}</EmptyRow>}
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
