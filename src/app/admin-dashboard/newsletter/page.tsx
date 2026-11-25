"use client";

import React, { useState } from "react";
import { adminNewsletterApi, type SubscriberStatus } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import { AdminHeader, StatusPill, PlusIcon, DownloadIcon, SearchIcon } from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { EmptyRow, Loader, Modal, Pagination, btn, inputCls, useAdminAction } from "../AdminShell";

export default function NewsletterAdminPage() {
  const { can } = useAuth();
  const run = useAdminAction();
  const [status, setStatus] = useState<SubscriberStatus | "">("subscribed");
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState("");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);
  const list = useAsync(
    () => adminNewsletterApi.list({ status: status || undefined, search: applied || undefined, page, limit: 25 }),
    [status, applied, page]
  );

  if (!can("content:manage")) return <p className="rounded-2xl bg-amber-50 p-5 text-sm font-semibold text-amber-800">You need the “Manage content” permission to view subscribers.</p>;

  const exportCsv = async () => {
    const csv = await run(() => adminNewsletterApi.exportCsv(status || undefined), "Export ready");
    if (!csv) return;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-${status || "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const add = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const r = await run(
      () => adminNewsletterApi.add({ email: String(fd.get("email")).trim(), source: "admin", ...(name ? { name } : {}) }),
      "Subscriber added"
    );
    if (r) {
      setAdding(false);
      void list.reload();
    }
  };

  const counts = list.data?.counts;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Newsletter" }]}
        title="Newsletter"
        description="People who signed up on the homepage, blog or footer. Every email includes an unsubscribe link."
        actions={
          <>
            <button onClick={exportCsv} className={btn.secondary}>
              <DownloadIcon /> Export CSV
            </button>
            <button onClick={() => setAdding(true)} className={btn.primary}>
              <PlusIcon /> Add subscriber
            </button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(
          [
            { v: "subscribed", label: `Subscribed${counts ? ` (${counts.subscribed})` : ""}` },
            { v: "unsubscribed", label: `Unsubscribed${counts ? ` (${counts.unsubscribed})` : ""}` },
            { v: "", label: "All" },
          ] as { v: SubscriberStatus | ""; label: string }[]
        ).map((x) => (
          <button
            key={x.v || "all"}
            onClick={() => {
              setStatus(x.v);
              setPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${status === x.v ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
          >
            {x.label}
          </button>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setApplied(search.trim());
            setPage(1);
          }}
          className="relative ml-auto min-w-[220px]"
        >
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search email or name…" className={`${inputCls} pl-10`} />
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Since</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(list.data?.items ?? []).map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-semibold text-slate-900">
                      <button onClick={() => setViewing(s._id)} className="hover:text-brand-dark hover:underline">
                        {s.email}
                      </button>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{s.name || "—"}</td>
                    <td className="px-6 py-3 text-slate-600">{s.source || "—"}</td>
                    <td className="px-6 py-3 text-xs text-slate-500">{formatDate(s.subscribedAt)}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={async () => {
                          const next: SubscriberStatus = s.status === "subscribed" ? "unsubscribed" : "subscribed";
                          if (await run(() => adminNewsletterApi.update(s._id, { status: next }), "Subscriber updated")) void list.reload();
                        }}
                        title="Click to toggle"
                      >
                        <StatusPill tone={s.status === "subscribed" ? "success" : "neutral"}>{s.status}</StatusPill>
                      </button>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <DeleteButton
                        itemLabel={s.email}
                        onConfirm={async () => {
                          const ok = await run(() => adminNewsletterApi.remove(s._id), "Subscriber deleted");
                          if (ok) void list.reload();
                          return !!ok;
                        }}
                      />
                    </td>
                  </tr>
                ))}
                {!list.data?.items.length && <EmptyRow colSpan={6}>No subscribers.</EmptyRow>}
              </tbody>
            </table>
          </div>
        )}
        {list.data && list.data.totalPages > 1 && (
          <Pagination page={list.data.page} totalPages={list.data.totalPages} total={list.data.total} onChange={setPage} />
        )}
      </div>

      {viewing && <SubscriberDetail id={viewing} onClose={() => setViewing(null)} />}
      {adding && (
        <Modal title="Add subscriber" onClose={() => setAdding(false)}>
          <form onSubmit={add} className="space-y-3">
            <input name="email" type="email" required placeholder="email@example.com" className={inputCls} />
            <input name="name" placeholder="Name (optional)" className={inputCls} />
            <p className="text-[11px] text-slate-500">No welcome email is sent for subscribers you add here.</p>
            <div className="flex justify-end">
              <button className={btn.brand}>Add</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function SubscriberDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const sub = useAsync(() => adminNewsletterApi.get(id), [id]);
  const s = sub.data;
  return (
    <Modal title={s?.email ?? "Subscriber"} onClose={onClose}>
      {sub.loading ? (
        <Loader />
      ) : !s ? (
        <p className="text-sm text-rose-700">{sub.error}</p>
      ) : (
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[10px] font-black uppercase text-slate-400">Name</dt>
            <dd>{s.name || "—"}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-black uppercase text-slate-400">Status</dt>
            <dd className="capitalize">{s.status}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-black uppercase text-slate-400">Signed up via</dt>
            <dd>{s.source || "—"}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-black uppercase text-slate-400">Subscribed</dt>
            <dd>{formatDate(s.subscribedAt)}</dd>
          </div>
          {s.unsubscribedAt && (
            <div>
              <dt className="text-[10px] font-black uppercase text-slate-400">Unsubscribed</dt>
              <dd>{formatDate(s.unsubscribedAt)}</dd>
            </div>
          )}
        </dl>
      )}
    </Modal>
  );
}
