"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { ApiError, errorMessage, reviewsApi } from "@/lib/api";
import { formatDate, initials } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { Stars } from "@/components/Stars";
import { StarIcon, CheckBadgeIcon } from "@/components/icons";

/** GET/POST /products/:idOrSlug/reviews — approved reviews, summary and the write form. */
export function ProductReviews({ slug }: { slug: string }) {
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const list = useAsync(() => reviewsApi.forProduct(slug, { page, limit: 5, rating }), [slug, page, rating]);
  const summary = list.data?.summary;
  const total = summary?.totalReviews ?? 0;

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
      <div>
        {summary && total > 0 ? (
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-slate-900">{summary.averageRating.toFixed(1)}</span>
              <div className="pb-1">
                <Stars value={summary.averageRating} />
                <div className="text-[11px] text-slate-500">
                  {total} review{total === 1 ? "" : "s"}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              {[5, 4, 3, 2, 1].map((s) => {
                const n = summary.distribution[String(s)] ?? 0;
                const active = rating === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setRating(active ? undefined : s);
                      setPage(1);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-1 py-0.5 text-xs ${active ? "bg-brand-soft" : "hover:bg-white"}`}
                    aria-pressed={active}
                  >
                    <span className="w-3 font-semibold text-slate-600">{s}</span>
                    <StarIcon className="h-3 w-3 text-amber-400" />
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                      <span className="block h-full rounded-full bg-amber-400" style={{ width: `${total ? (n / total) * 100 : 0}%` }} />
                    </span>
                    <span className="w-6 text-right text-slate-500">{n}</span>
                  </button>
                );
              })}
            </div>
            {rating && (
              <button onClick={() => setRating(undefined)} className="mt-3 text-[11px] font-bold text-brand-dark hover:underline">
                Show all ratings
              </button>
            )}
          </div>
        ) : (
          !list.loading && <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">No reviews yet — be the first to share your experience.</p>
        )}
        <WriteReview slug={slug} onPosted={() => void list.reload()} />
      </div>

      <div>
        {list.loading ? (
          <p className="text-sm text-slate-500">Loading reviews…</p>
        ) : list.error ? (
          <p className="text-sm text-rose-600">{list.error}</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {(list.data?.items ?? []).map((r) => (
              <div key={r._id} className="py-4 first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-[11px] font-black text-brand-dark">
                      {initials(r.userName)}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{r.userName}</span>
                    {r.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <CheckBadgeIcon className="h-3 w-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{formatDate(r.createdAt)}</span>
                </div>
                <div className="mt-1.5">
                  <Stars value={r.rating} />
                </div>
                {r.title && <div className="mt-1.5 text-sm font-bold text-slate-900">{r.title}</div>}
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">{r.comment}</p>
                {r.adminReply && (
                  <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-100">
                    <strong className="text-slate-800">OralCareBD replied:</strong> {r.adminReply}
                  </div>
                )}
              </div>
            ))}
            {!list.data?.items.length && total > 0 && <p className="text-sm text-slate-500">No reviews with this rating.</p>}
          </div>
        )}
        {list.data && list.data.totalPages > 1 && (
          <div className="mt-4 flex items-center gap-2 text-xs font-bold">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-full px-3 py-1.5 ring-1 ring-slate-200 disabled:opacity-40">
              Prev
            </button>
            <span className="text-slate-500">
              {list.data.page} / {list.data.totalPages}
            </span>
            <button
              disabled={page >= list.data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full px-3 py-1.5 ring-1 ring-slate-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function WriteReview({ slug, onPosted }: { slug: string; onPosted: () => void }) {
  const { status } = useAuth();
  const { showToast } = useStore();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (status !== "authenticated") {
    return (
      <p className="mt-4 text-xs text-slate-600">
        <Link href={`/signin?next=/product/${slug}`} className="font-bold text-brand-dark hover:underline">
          Sign in
        </Link>{" "}
        to write a review.
      </p>
    );
  }
  if (message) return <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">{message}</p>;
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-4 w-full rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-dark">
        Write a Review
      </button>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const env = await reviewsApi.create(slug, { rating, comment: comment.trim(), ...(title.trim() ? { title: title.trim() } : {}) });
      setMessage(env.message ?? "Thanks for your review!");
      onPosted();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setMessage("You've already reviewed this product — you can edit it from My Account → Reviews.");
      } else {
        showToast(errorMessage(err, "Could not post your review"), "error");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={rating === s}
            aria-label={`${s} star${s > 1 ? "s" : ""}`}
            onClick={() => setRating(s)}
            className={s <= rating ? "text-amber-400" : "text-slate-300"}
          >
            <StarIcon className="h-6 w-6" />
          </button>
        ))}
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={150}
        placeholder="Title (optional)"
        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-brand"
      />
      <textarea
        required
        minLength={5}
        maxLength={3000}
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you like or dislike?"
        className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-brand"
      />
      <div className="flex gap-2">
        <button disabled={busy} className="rounded-full bg-brand px-5 py-2 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-60">
          {busy ? "Posting…" : "Submit Review"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-full px-4 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
          Cancel
        </button>
      </div>
    </form>
  );
}
