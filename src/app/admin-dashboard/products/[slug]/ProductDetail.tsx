"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productsApi, type StockChangeType } from "@/lib/api";
import { brandName, categoryRef, productImage, variationLabel } from "@/lib/products";
import { formatDateTime, formatPriceBDT, humanize } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { SmartImage } from "@/components/SmartImage";
import { AdminHeader, StatusPill, EditIcon } from "../../AdminHeader";
import { DeleteButton } from "../../DeleteButton";
import { Loader, Pagination, btn, inputCls, useAdminAction } from "../../AdminShell";

const STOCK_TYPES: StockChangeType[] = ["restock", "adjustment", "damage", "audit", "return", "sale"];

export function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const run = useAdminAction();
  const product = useAsync(() => productsApi.get(slug), [slug]);
  const p = product.data;
  const [histPage, setHistPage] = useState(1);
  const history = useAsync(() => (p ? productsApi.stockHistory(p._id, { page: histPage, limit: 10 }) : Promise.resolve(null)), [p?._id, histPage]);

  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [change, setChange] = useState("");
  const [type, setType] = useState<StockChangeType>("restock");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  if (product.loading) return <Loader />;
  if (!p) return <p className="text-sm font-semibold text-rose-700">{product.error ?? "Product not found"}</p>;

  const refresh = () => {
    void product.reload();
    void history.reload();
  };

  const addImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await run(() => productsApi.addImage(p._id, { url: imgUrl.trim(), ...(imgAlt.trim() ? { alt: imgAlt.trim() } : {}) }), "Image added");
    setBusy(false);
    if (r) {
      void product.reload();
      setImgUrl("");
      setImgAlt("");
    }
  };

  const adjust = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(change);
    if (!Number.isInteger(n) || n === 0) return;
    setBusy(true);
    const r = await run(
      () => productsApi.adjustStock(p._id, { change: n, type, ...(reason.trim() ? { reason: reason.trim() } : {}) }),
      (res) => `Stock is now ${res.data.newQuantity}`
    );
    setBusy(false);
    if (r) {
      setChange("");
      setReason("");
      refresh();
    }
  };

  const category = categoryRef(p);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Products", href: "/admin-dashboard/products" },
          { label: p.productName },
        ]}
        title={p.productName}
        description={`SKU ${p.sku} · /product/${p.slug}`}
        actions={
          <>
            {p.isPublished && !p.isDeleted && (
              <Link href={`/product/${p.slug}`} target="_blank" className={btn.secondary}>
                View in store ↗
              </Link>
            )}
            {p.isDeleted ? (
              <button
                className={btn.brand}
                onClick={async () => {
                  const r = await run(() => productsApi.restore(p._id), "Product restored");
                  if (r) void product.reload();
                }}
              >
                Restore
              </button>
            ) : (
              <Link href={`/admin-dashboard/products/${p._id}/edit`} className={btn.primary}>
                <EditIcon /> Edit
              </Link>
            )}
            <DeleteButton
              variant="full"
              label={p.isDeleted ? "Delete permanently" : "Move to trash"}
              itemLabel={p.productName}
              onConfirm={async () => {
                const ok = await run(
                  () => productsApi.remove(p._id, p.isDeleted),
                  p.isDeleted ? "Product permanently deleted" : "Product moved to trash"
                );
                if (ok) router.push("/admin-dashboard/products");
                return !!ok;
              }}
            />
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={p.isPublished ? "success" : "neutral"}>{p.isPublished ? "Published" : "Draft"}</StatusPill>
              <StatusPill tone={p.isActive ? "info" : "warning"}>{p.isActive ? "Active" : "Inactive"}</StatusPill>
              {p.isFeatured && <StatusPill tone="accent">Featured</StatusPill>}
              {p.isDeleted && <StatusPill tone="danger">In trash</StatusPill>}
              <StatusPill tone={p.stockStatus === "out-of-stock" ? "danger" : p.stockStatus === "low-stock" ? "warning" : "success"}>
                {humanize(p.stockStatus)}
              </StatusPill>
            </div>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
              <Info label="Price" value={formatPriceBDT(p.effectivePrice)} />
              <Info label="Regular" value={formatPriceBDT(p.regularPrice)} />
              <Info label="Sale" value={p.salePrice != null ? formatPriceBDT(p.salePrice) : "—"} />
              <Info label="Cost" value={p.costPrice != null ? formatPriceBDT(p.costPrice) : "—"} />
              <Info label="Stock" value={`${p.stockQuantity} (alert ≤ ${p.lowStockThreshold})`} />
              <Info label="Category" value={category?.name ?? "—"} />
              <Info label="Brand" value={brandName(p) || "—"} />
              <Info label="Type" value={humanize(p.productType)} />
              <Info label="Updated" value={formatDateTime(p.updatedAt)} />
            </dl>
            <p className="mt-5 whitespace-pre-line text-sm text-slate-600">{p.description}</p>
            {p.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </section>

          {p.productType === "variable" && (
            <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
              <h2 className="mb-3 text-base font-black text-slate-900">Variations</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {p.variations.map((v) => (
                    <tr key={v._id}>
                      <td className="py-2 capitalize text-slate-700">{variationLabel(v)}</td>
                      <td className="py-2 text-slate-500">{v.sku ?? "—"}</td>
                      <td className="py-2 text-right font-semibold">{v.price != null ? formatPriceBDT(v.price) : "base price"}</td>
                      <td className="py-2 text-right font-bold">{v.stockQuantity ?? 0} in stock</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h2 className="mb-4 text-base font-black text-slate-900">Images</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {p.images.map((img) => {
                const isThumb = (p.thumbnail || productImage(p)) === img.url;
                return (
                  <div key={img._id ?? img.url} className={`overflow-hidden rounded-xl ring-2 ${isThumb ? "ring-brand" : "ring-slate-200"}`}>
                    <div className="relative aspect-square bg-slate-50">
                      <SmartImage src={img.url} alt={img.alt ?? ""} fill sizes="160px" className="object-contain p-2" />
                    </div>
                    <div className="flex items-center justify-between gap-1 p-2">
                      {isThumb ? (
                        <span className="text-[10px] font-black uppercase text-brand-dark">Thumbnail</span>
                      ) : (
                        <button
                          onClick={async () => {
                            const r = await run(() => productsApi.setThumbnail(p._id, img.url), "Thumbnail updated");
                            if (r) void product.reload();
                          }}
                          className="text-[11px] font-bold text-slate-600 hover:text-brand-dark"
                        >
                          Set thumbnail
                        </button>
                      )}
                      {img._id && (
                        <DeleteButton
                          itemLabel="this image"
                          onConfirm={async () => {
                            const r = await run(() => productsApi.removeImage(p._id, img._id!), "Image removed");
                            if (r) void product.reload();
                            return !!r;
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={addImage} className="mt-4 grid gap-2 sm:grid-cols-[2fr_1fr_auto]">
              <input type="url" required value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="https://…/image.jpg" className={inputCls} />
              <input value={imgAlt} onChange={(e) => setImgAlt(e.target.value)} placeholder="Alt text" className={inputCls} />
              <button disabled={busy} className={btn.primary}>
                Add image
              </button>
            </form>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h2 className="text-base font-black text-slate-900">Adjust stock</h2>
            <p className="mt-1 text-xs text-slate-500">Use a negative number to remove units. Every change is logged.</p>
            <form onSubmit={adjust} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step={1} required value={change} onChange={(e) => setChange(e.target.value)} placeholder="+20 or -3" className={inputCls} />
                <select value={type} onChange={(e) => setType(e.target.value as StockChangeType)} className={inputCls}>
                  {STOCK_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {humanize(t)}
                    </option>
                  ))}
                </select>
              </div>
              <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)" className={inputCls} />
              <button disabled={busy} className={`${btn.brand} w-full justify-center`}>
                Update stock
              </button>
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
            <h2 className="px-6 pt-5 text-base font-black text-slate-900">Stock history</h2>
            {history.loading ? (
              <Loader />
            ) : (
              <ul className="divide-y divide-slate-100 px-6 py-3 text-sm">
                {(history.data?.items ?? []).map((h) => (
                  <li key={h._id} className="py-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{humanize(h.type)}</span>
                      <span className={`font-black ${h.change > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {h.change > 0 ? `+${h.change}` : h.change} → {h.newQuantity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {formatDateTime(h.createdAt)}
                      {typeof h.adjustedBy === "object" && h.adjustedBy ? ` · ${h.adjustedBy.fullName}` : ""}
                      {h.reason ? ` · ${h.reason}` : ""}
                    </div>
                  </li>
                ))}
                {!history.data?.items.length && <li className="py-6 text-center text-slate-500">No stock changes yet.</li>}
              </ul>
            )}
            {history.data && history.data.totalPages > 1 && (
              <Pagination page={history.data.page} totalPages={history.data.totalPages} onChange={setHistPage} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
