"use client";

import React, { useState } from "react";
import { productsApi, type Paginated } from "@/lib/api";
import { useAsync } from "@/lib/hooks";
import { SmartImage } from "@/components/SmartImage";
import { AdminHeader, StatusPill, PlusIcon, EditIcon } from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { Loader, Modal, Pagination, btn, inputCls, useAdminAction } from "../AdminShell";
import { ImageUploadField } from "../ImageUploadField";

/** One editable field of a content item. */
export interface FieldDef {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "image" | "datetime" | "product" | "products";
  required?: boolean;
  hint?: string;
  options?: { value: string; label: string }[];
  /** Used when creating a new item. */
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
}

type Item = { _id: string; displayOrder?: number; isActive?: boolean } & Record<string, unknown>;

interface CrudApi<T, I> {
  list: (q?: { page?: number; limit?: number }) => Promise<Paginated<T>>;
  get: (id: string) => Promise<T>;
  create: (body: I) => Promise<unknown>;
  update: (id: string, body: I) => Promise<unknown>;
  remove: (id: string) => Promise<unknown>;
  reorder?: (items: { id: string; displayOrder: number }[]) => Promise<unknown>;
}

function toLocalInput(iso: unknown) {
  if (typeof iso !== "string" || !iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

const idOf = (v: unknown): string => (v && typeof v === "object" ? String((v as { _id: string })._id) : v ? String(v) : "");

/**
 * Generic admin screen for a CMS collection: list, create/edit modal,
 * active toggle, reorder and delete. Used for deals, looks, testimonials and Instagram.
 */
export function ContentManager<T extends Item, I>({
  title,
  description,
  noun,
  api,
  fields,
  summary,
  storefrontNote,
}: {
  title: string;
  description: string;
  noun: string;
  api: CrudApi<T, I>;
  fields: FieldDef[];
  /** Row content: thumbnail, title and secondary line. */
  summary: (item: T) => { image?: string | null; title: string; subtitle?: string };
  storefrontNote?: string;
}) {
  const run = useAdminAction();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const list = useAsync(() => api.list({ page, limit: 50 }), [page]);
  const needsProducts = fields.some((f) => f.type === "product" || f.type === "products");
  const products = useAsync(
    () => (needsProducts ? productsApi.list({ limit: 100, sort: "newest" }) : Promise.resolve(null)),
    [needsProducts]
  );
  const items = [...(list.data?.items ?? [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const move = async (index: number, dir: -1 | 1) => {
    if (!api.reorder) return;
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    if (await run(() => api.reorder!(next.map((x, i) => ({ id: x._id, displayOrder: i }))), "Order saved")) void list.reload();
  };

  /** Edit from a fresh GET /:id so the form never shows stale list data. */
  const openEditor = async (item: T) => {
    const fresh = await run(() => api.get(item._id));
    if (fresh) setEditing(fresh);
  };

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.type === "checkbox") body[f.name] = fd.get(f.name) === "on";
      else if (f.type === "products") body[f.name] = fd.getAll(f.name).map(String);
      else {
        const v = String(fd.get(f.name) ?? "").trim();
        if (!v) continue; // optional fields left empty are omitted
        if (f.type === "number") body[f.name] = Number(v);
        else if (f.type === "datetime") body[f.name] = new Date(v).toISOString();
        else body[f.name] = v;
      }
    }
    setSaving(true);
    const isNew = editing === "new";
    const r = await run(
      () =>
        isNew
          ? api.create({ ...body, displayOrder: items.length } as I)
          : api.update((editing as T)._id, body as I),
      isNew ? `${noun} created` : `${noun} updated`
    );
    setSaving(false);
    if (r !== undefined) {
      setEditing(null);
      void list.reload();
    }
  };

  const current = editing && editing !== "new" ? editing : undefined;
  const productOptions = (products.data?.items ?? []).map((p) => ({ value: p._id, label: `${p.productName} (${p.sku})` }));

  return (
    <div className="mx-auto w-full max-w-6xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Content" }, { label: title }]}
        title={title}
        description={description}
        actions={
          <button onClick={() => setEditing("new")} className={btn.primary}>
            <PlusIcon /> Add {noun}
          </button>
        }
      />
      {storefrontNote && <p className="mb-4 text-xs text-slate-500">{storefrontNote}</p>}

      {list.loading ? (
        <Loader />
      ) : list.error ? (
        <p className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{list.error}</p>
      ) : !items.length ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 ring-1 ring-slate-200/70">
          Nothing yet — this section stays hidden on the storefront until you add one.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const s = summary(item);
            return (
              <div key={item._id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
                {api.reorder && (
                  <div className="flex flex-col">
                    <button disabled={i === 0} onClick={() => move(i, -1)} className="px-2 text-slate-500 disabled:opacity-30" aria-label="Move up">
                      ▲
                    </button>
                    <button disabled={i === items.length - 1} onClick={() => move(i, 1)} className="px-2 text-slate-500 disabled:opacity-30" aria-label="Move down">
                      ▼
                    </button>
                  </div>
                )}
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {s.image && <SmartImage src={s.image} alt="" fill sizes="64px" className="object-cover" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900">{s.title}</div>
                  {s.subtitle && <div className="line-clamp-1 text-xs text-slate-500">{s.subtitle}</div>}
                </div>
                <button
                  onClick={async () => {
                    if (await run(() => api.update(item._id, { isActive: !item.isActive } as I), item.isActive ? "Hidden" : "Shown")) void list.reload();
                  }}
                >
                  <StatusPill tone={item.isActive ? "success" : "neutral"}>{item.isActive ? "Active" : "Hidden"}</StatusPill>
                </button>
                <button onClick={() => openEditor(item)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Edit">
                  <EditIcon />
                </button>
                <DeleteButton
                  itemLabel={s.title}
                  onConfirm={async () => {
                    const ok = await run(() => api.remove(item._id), `${noun} deleted`);
                    if (ok !== undefined) void list.reload();
                    return ok !== undefined;
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
      {list.data && list.data.totalPages > 1 && (
        <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
          <Pagination page={list.data.page} totalPages={list.data.totalPages} total={list.data.total} onChange={setPage} />
        </div>
      )}

      {editing && (
        <Modal title={current ? `Edit ${noun.toLowerCase()}` : `New ${noun.toLowerCase()}`} onClose={() => setEditing(null)} wide>
          {needsProducts && products.loading ? (
            <Loader label="Loading products…" />
          ) : (
            <form onSubmit={save} className="space-y-4">
              {fields.map((f) => {
                const value = current ? current[f.name] : f.defaultValue;
                const label = (
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">
                    {f.label}
                    {f.required && <span className="ml-1 text-rose-500">*</span>}
                  </span>
                );
                const hint = f.hint && <span className="mt-1 block text-[11px] text-slate-500">{f.hint}</span>;
                if (f.type === "image")
                  return <ImageUploadField key={f.name} kind="content" label={f.label} name={f.name} required={f.required} hint={f.hint} defaultValue={value as string} />;
                if (f.type === "checkbox")
                  return (
                    <label key={f.name} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <input type="checkbox" name={f.name} defaultChecked={value === undefined ? true : Boolean(value)} className="h-4 w-4 accent-brand" />
                      {f.label}
                    </label>
                  );
                if (f.type === "textarea")
                  return (
                    <label key={f.name} className="block">
                      {label}
                      <textarea name={f.name} required={f.required} rows={3} defaultValue={(value as string) ?? ""} className={`${inputCls} h-auto py-2`} />
                      {hint}
                    </label>
                  );
                if (f.type === "select" || f.type === "product")
                  return (
                    <label key={f.name} className="block">
                      {label}
                      <select name={f.name} required={f.required} defaultValue={f.type === "product" ? idOf(value) : ((value as string) ?? "")} className={inputCls}>
                        {!f.required && <option value="">—</option>}
                        {f.type === "product" && f.required && <option value="">Select a product…</option>}
                        {(f.type === "product" ? productOptions : f.options ?? []).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      {hint}
                    </label>
                  );
                if (f.type === "products") {
                  const selected = new Set(((value as unknown[]) ?? []).map(idOf));
                  return (
                    <fieldset key={f.name}>
                      {label}
                      <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
                        {productOptions.map((o) => (
                          <label key={o.value} className="flex items-center gap-2 text-xs text-slate-700">
                            <input type="checkbox" name={f.name} value={o.value} defaultChecked={selected.has(o.value)} className="accent-brand" />
                            {o.label}
                          </label>
                        ))}
                      </div>
                      {hint}
                    </fieldset>
                  );
                }
                return (
                  <label key={f.name} className="block">
                    {label}
                    <input
                      type={f.type === "datetime" ? "datetime-local" : f.type === "number" ? "number" : "text"}
                      name={f.name}
                      required={f.required}
                      min={f.min}
                      max={f.max}
                      defaultValue={f.type === "datetime" ? toLocalInput(value) : ((value as string | number | undefined) ?? "")}
                      className={inputCls}
                    />
                    {hint}
                  </label>
                );
              })}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(null)} className={btn.secondary}>
                  Cancel
                </button>
                <button disabled={saving} className={btn.brand}>
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
