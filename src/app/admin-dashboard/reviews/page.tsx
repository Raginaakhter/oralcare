"use client";

import { useState } from "react";
import Link from "next/link";
import { adminReviewsApi, type Review, type ReviewStatus } from "@/lib/api";
import { formatDateTime, humanize } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { Stars } from "@/components/Stars";
import { AdminHeader, StatusPill, SearchIcon } from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { Loader, Pagination, btn, inputCls, useAdminAction } from "../AdminShell";

const TABS: { label: string; status?: ReviewStatus; featured?: boolean }[] = [
  { label: "Pending", status: "pending" },
  { label: "Approved", status: "approved" },
  { label: "Rejected", status: "rejected" },
  { label: "Featured", featured: true },
  { label: "All" },
];

export default function ReviewsAdminPage() {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState("");
  const t = TABS[tab];
  const list = useAsync(
    () => adminReviewsApi.list({ status: t.status, isFeatured: t.featured, search: applied || undefined, page, limit: 20 }),
    [tab, page, applied]
  );

  return (
    <div className="mx-auto w-full max-w-6xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Reviews" }]}
        title="Product Reviews"
        description="Verified buyers' reviews go live automatically; everyone else's wait here for approval. Featured reviews appear on the homepage."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {TABS.map((x, i) => (
          <button
            key={x.label}
            onClick={() => {
              setTab(i);
              setPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${tab === i ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
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
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search text or name…" className={`${inputCls} pl-10`} />
        </form>
      </div>

      {list.loading ? (
        <Loader />
      ) : list.error ? (
        <p className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{list.error}</p>
      ) : !list.data?.items.length ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 ring-1 ring-slate-200/70">Nothing here.</p>
      ) : (
        <div className="space-y-3">
          {list.data.items.map((r) => (
            <ReviewRow key={r._id} review={r} onChanged={() => void list.reload()} />
          ))}
        </div>
      )}
      {list.data && list.data.totalPages > 1 && (
        <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
          <Pagination page={list.data.page} totalPages={list.data.totalPages} total={list.data.total} onChange={setPage} />
        </div>
      )}
    </div>
  );
}

function ReviewRow({ review, onChanged }: { review: Review; onChanged: () => void }) {
  const [r, setR] = useState(review);
  const run = useAdminAction();
  const [reply, setReply] = useState(r.adminReply ?? "");
  const [replying, setReplying] = useState(false);
  const [busy, setBusy] = useState(false);
  const product = typeof r.product === "object" ? r.product : null;
  const user = r.user && typeof r.user === "object" ? r.user : null;

  const moderate = async (body: Parameters<typeof adminReviewsApi.moderate>[1], msg: string) => {
    setBusy(true);
    const ok = await run(() => adminReviewsApi.moderate(r._id, body), msg);
    if (ok) {
      setReplying(false);
      // Re-read this review (GET /admin/reviews/:id); reload the list only when it leaves this tab.
      const fresh = await run(() => adminReviewsApi.get(r._id));
      if (fresh) setR(fresh);
      if (body.status && body.status !== review.status) onChanged();
    }
    setBusy(false);
  };

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Stars value={r.rating} />
            {r.title && <span className="text-sm font-bold text-slate-900">{r.title}</span>}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {r.userName}
            {user ? ` (${user.email})` : ""} · {formatDateTime(r.createdAt)}
            {product && (
              <>
                {" "}
                · on{" "}
                <Link href={`/product/${product.slug}`} target="_blank" className="font-semibold text-brand-dark hover:underline">
                  {product.productName}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <StatusPill tone={r.status === "approved" ? "success" : r.status === "rejected" ? "danger" : "warning"}>{humanize(r.status)}</StatusPill>
          {r.isVerifiedPurchase && <StatusPill tone="info">Verified buyer</StatusPill>}
          {r.isFeatured && <StatusPill tone="accent">Featured</StatusPill>}
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-700">{r.comment}</p>
      {r.adminReply && !replying && <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">Your reply: {r.adminReply}</p>}

      {replying && (
        <div className="mt-3 flex flex-wrap gap-2">
          <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Public reply…" className={`${inputCls} flex-1`} />
          <button disabled={busy} onClick={() => moderate({ adminReply: reply.trim() || null }, "Reply saved")} className={btn.brand}>
            Save reply
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {r.status !== "approved" && (
          <button disabled={busy} onClick={() => moderate({ status: "approved" }, "Review approved")} className={btn.brand}>
            Approve
          </button>
        )}
        {r.status !== "rejected" && (
          <button disabled={busy} onClick={() => moderate({ status: "rejected", isFeatured: false }, "Review rejected")} className={btn.danger}>
            Reject
          </button>
        )}
        {r.status === "approved" && (
          <button disabled={busy} onClick={() => moderate({ isFeatured: !r.isFeatured }, r.isFeatured ? "Removed from homepage" : "Featured on homepage")} className={btn.secondary}>
            {r.isFeatured ? "Unfeature" : "Feature on homepage"}
          </button>
        )}
        <button onClick={() => setReplying((v) => !v)} className={btn.secondary}>
          {r.adminReply ? "Edit reply" : "Reply"}
        </button>
        <DeleteButton
          variant="button"
          itemLabel={`${r.userName}'s review`}
          onConfirm={async () => {
            const ok = await run(() => adminReviewsApi.remove(r._id), "Review deleted");
            if (ok) onChanged();
            return !!ok;
          }}
        />
      </div>
    </div>
  );
}
