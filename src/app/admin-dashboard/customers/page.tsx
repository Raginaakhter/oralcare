"use client";

import { useState } from "react";
import Link from "next/link";
import { customersApi } from "@/lib/api";
import { formatDate, initials } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import { AdminHeader, StatusPill, SearchIcon } from "../AdminHeader";
import { EmptyRow, Loader, Pagination, inputCls } from "../AdminShell";

export default function CustomersPage() {
  const { can } = useAuth();
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState("");
  const [page, setPage] = useState(1);
  const list = useAsync(() => customersApi.list({ search: applied || undefined, page, limit: 25 }), [applied, page]);

  if (!can("customers:read")) return <p className="rounded-2xl bg-amber-50 p-5 text-sm font-semibold text-amber-800">You need the “View customer accounts” permission.</p>;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Customers" }]}
        title="Customers"
        description={list.data ? `${list.data.total} registered customer accounts.` : "Registered customer accounts."}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setApplied(search.trim());
          setPage(1);
        }}
        className="mb-4 rounded-2xl bg-white p-3 ring-1 ring-slate-200/70"
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" className={`${inputCls} pl-10`} />
        </div>
      </form>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : list.error ? (
          <p className="p-6 text-sm font-semibold text-rose-700">{list.error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Email status</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(list.data?.items ?? []).map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <Link href={`/admin-dashboard/customers/${c._id}`} className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-xs font-black text-brand-dark">{initials(c.fullName)}</span>
                        <span>
                          <span className="block font-bold text-slate-900">{c.fullName}</span>
                          <span className="block text-xs text-slate-500">{c.email}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      <StatusPill tone={c.isEmailVerified ? "success" : "warning"}>{c.isEmailVerified ? "Verified" : "Unverified"}</StatusPill>
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-500">{formatDate(c.createdAt)}</td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/admin-dashboard/customers/${c._id}`} className="text-xs font-bold text-brand-dark hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {!list.data?.items.length && <EmptyRow colSpan={4}>No customers found.</EmptyRow>}
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
