"use client";

import { useState } from "react";
import { brandsApi, productsApi, type Brand } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { SmartImage } from "@/components/SmartImage";
import { AdminHeader, StatusPill, PlusIcon, EditIcon } from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { Field, Textarea, Toggle, str, opt, bool } from "../AdminForm";
import { EmptyRow, Loader, Modal, btn, useAdminAction } from "../AdminShell";

export default function BrandsPage() {
  const run = useAdminAction();
  const [editing, setEditing] = useState<Brand | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const list = useAsync(async () => {
    const page = await brandsApi.list({ limit: 100 });
    const counts = await Promise.all(
      page.items.map((b) => productsApi.list({ brand: b._id, limit: 1 }).then((r) => r.total).catch(() => 0))
    );
    return page.items.map((b, i) => ({ ...b, productCount: counts[i] }));
  }, []);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      name: str(fd, "name"),
      ...(opt(fd, "slug") ? { slug: opt(fd, "slug") } : {}),
      ...(opt(fd, "logo") ? { logo: opt(fd, "logo") } : {}),
      description: str(fd, "description"),
      isActive: bool(fd, "isActive"),
    };
    setSaving(true);
    const r = await run(
      () => (editing === "new" ? brandsApi.create(body) : brandsApi.update((editing as Brand)._id, body)),
      editing === "new" ? "Brand created" : "Brand updated"
    );
    setSaving(false);
    if (r) {
      setEditing(null);
      void list.reload();
    }
  };

  const current = editing && editing !== "new" ? editing : undefined;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Brands" }]}
        title="Brands"
        description={list.data ? `${list.data.length} brands` : "Manufacturers in your catalog."}
        actions={
          <button onClick={() => setEditing("new")} className={btn.primary}>
            <PlusIcon /> Add Brand
          </button>
        }
      />

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Brand</th>
                  <th className="px-6 py-3">Products</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Updated</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(list.data ?? []).map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                          {b.logo && <SmartImage src={b.logo} alt="" fill sizes="40px" className="object-contain p-1" />}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{b.name}</div>
                          <div className="text-xs text-slate-500">/{b.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{b.productCount}</td>
                    <td className="px-6 py-4">
                      <StatusPill tone={b.isActive ? "success" : "neutral"}>{b.isActive ? "Active" : "Hidden"}</StatusPill>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{formatDate(b.updatedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditing(b)}
                          aria-label="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                        >
                          <EditIcon />
                        </button>
                        <DeleteButton
                          itemLabel={b.name}
                          onConfirm={async () => {
                            const ok = await run(() => brandsApi.remove(b._id), "Brand deleted");
                            if (ok) void list.reload();
                            return !!ok;
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {!list.data?.length && <EmptyRow colSpan={5}>No brands yet.</EmptyRow>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Add brand" : `Edit ${current?.name}`} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Name" name="name" required defaultValue={current?.name} />
            <Field label="Slug" name="slug" defaultValue={current?.slug} placeholder="auto-generated if empty" />
            <Field label="Logo URL" name="logo" type="url" defaultValue={current?.logo} />
            <Textarea label="Description" name="description" rows={3} defaultValue={current?.description} />
            <Toggle label="Active" name="isActive" defaultChecked={current?.isActive ?? true} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className={btn.secondary}>
                Cancel
              </button>
              <button disabled={saving} className={btn.brand}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
