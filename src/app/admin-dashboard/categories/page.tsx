"use client";

import Link from "next/link";
import { categoriesApi, productsApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { SmartImage } from "@/components/SmartImage";
import { AdminHeader, StatusPill, PlusIcon, EditIcon } from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { EmptyRow, Loader, useAdminAction } from "../AdminShell";

export default function CategoriesPage() {
  const run = useAdminAction();
  const list = useAsync(async () => {
    const page = await categoriesApi.list({ limit: 100 });
    // Product count per category from the paginated total.
    const counts = await Promise.all(
      page.items.map((c) => productsApi.list({ category: c._id, limit: 1 }).then((r) => r.total).catch(() => 0))
    );
    return page.items.map((c, i) => ({ ...c, productCount: counts[i] }));
  }, []);

  const parentName = (id: unknown) => {
    if (!id) return "—";
    if (typeof id === "object") return (id as { name: string }).name;
    return list.data?.find((c) => c._id === id)?.name ?? "—";
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Categories" }]}
        title="Categories"
        description={list.data ? `${list.data.length} categories` : "Organise your catalog."}
        actions={
          <Link
            href="/admin-dashboard/categories/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-brand-dark"
          >
            <PlusIcon /> Add Category
          </Link>
        }
      />
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Parent</th>
                  <th className="px-6 py-3">Products</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Updated</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(list.data ?? []).map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                          {c.image && <SmartImage src={c.image} alt="" fill sizes="40px" className="object-cover" />}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <div className="text-xs text-slate-500">/{c.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{parentName(c.parentCategory)}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin-dashboard/products`} className="font-bold text-slate-900">
                        {c.productCount}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill tone={c.isActive ? "success" : "neutral"}>{c.isActive ? "Active" : "Hidden"}</StatusPill>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{formatDate(c.updatedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin-dashboard/categories/${c.slug}/edit`}
                          aria-label="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                        >
                          <EditIcon />
                        </Link>
                        <DeleteButton
                          itemLabel={c.name}
                          onConfirm={async () => {
                            const ok = await run(() => categoriesApi.remove(c._id), "Category deleted");
                            if (ok) void list.reload();
                            return !!ok;
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {!list.data?.length && <EmptyRow colSpan={6}>No categories yet.</EmptyRow>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
