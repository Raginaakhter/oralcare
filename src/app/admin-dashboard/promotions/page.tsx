"use client";

import { useState } from "react";
import Link from "next/link";
import { couponsApi } from "@/lib/api";
import { formatDate, formatPriceBDT } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import { AdminHeader, StatusPill, PlusIcon, EditIcon, SearchIcon } from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { EmptyRow, Loader, Pagination, inputCls, useAdminAction } from "../AdminShell";

export default function PromotionsPage() {
  const { can } = useAuth();
  const run = useAdminAction();
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState("");
  const [active, setActive] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const list = useAsync(
    () => couponsApi.list({ search: applied || undefined, isActive: active === "" ? undefined : active === "true", page, limit: 20 }),
    [applied, active, page]
  );

  if (!can("coupons:manage")) return <p className="rounded-2xl bg-amber-50 p-5 text-sm font-semibold text-amber-800">You need the “Manage coupons” permission to view coupons.</p>;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Coupons" }]}
        title="Coupons"
        description={list.data ? `${list.data.total} coupons` : "Discount codes for checkout."}
        actions={
          <Link
            href="/admin-dashboard/promotions/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-brand-dark"
          >
            <PlusIcon /> New Coupon
          </Link>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setApplied(search.trim());
          setPage(1);
        }}
        className="mb-4 flex flex-wrap gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200/70"
      >
        <div className="relative min-w-[200px] flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search code…" className={`${inputCls} pl-10`} />
        </div>
        <select
          value={active}
          onChange={(e) => {
            setActive(e.target.value as "" | "true" | "false");
            setPage(1);
          }}
          className={`${inputCls} w-auto`}
        >
          <option value="">Any status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3">Min order</th>
                  <th className="px-6 py-3">Usage</th>
                  <th className="px-6 py-3">Valid</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(list.data?.items ?? []).map((c) => {
                  const expired = !!c.expiresAt && new Date(c.expiresAt).getTime() < new Date().getTime();
                  return (
                    <tr key={c._id} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <div className="font-mono font-black text-slate-900">{c.code}</div>
                        {c.description && <div className="line-clamp-1 text-xs text-slate-500">{c.description}</div>}
                      </td>
                      <td className="px-6 py-3 font-bold">
                        {c.discountType === "percentage" ? `${c.discountValue}%` : formatPriceBDT(c.discountValue)}
                        {c.maxDiscountAmount ? <span className="ml-1 text-xs font-normal text-slate-500">max {formatPriceBDT(c.maxDiscountAmount)}</span> : null}
                      </td>
                      <td className="px-6 py-3">{formatPriceBDT(c.minOrderAmount)}</td>
                      <td className="px-6 py-3">
                        {c.usedCount}
                        {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-600">
                        {c.startsAt ? formatDate(c.startsAt) : "Now"} → {c.expiresAt ? formatDate(c.expiresAt) : "No expiry"}
                      </td>
                      <td className="px-6 py-3">
                        <StatusPill tone={!c.isActive ? "neutral" : expired ? "danger" : "success"}>
                          {!c.isActive ? "Inactive" : expired ? "Expired" : "Active"}
                        </StatusPill>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={async () => {
                              if (await run(() => couponsApi.update(c._id, { isActive: !c.isActive }), c.isActive ? "Coupon deactivated" : "Coupon activated"))
                                void list.reload();
                            }}
                            className="rounded-lg px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100"
                          >
                            {c.isActive ? "Disable" : "Enable"}
                          </button>
                          <Link
                            href={`/admin-dashboard/promotions/${c._id}/edit`}
                            aria-label="Edit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                          >
                            <EditIcon />
                          </Link>
                          <DeleteButton
                            itemLabel={c.code}
                            onConfirm={async () => {
                              const ok = await run(() => couponsApi.remove(c._id), "Coupon deleted");
                              if (ok) void list.reload();
                              return !!ok;
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!list.data?.items.length && <EmptyRow colSpan={7}>No coupons yet.</EmptyRow>}
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
