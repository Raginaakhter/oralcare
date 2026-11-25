"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import {
  REFUND_METHODS,
  reviewsApi,
  type Review,
  authApi,
  errorMessage,
  notificationsApi,
  ordersApi,
  returnsApi,
  type OrderReturn,
  type RefundMethod,
} from "@/lib/api";
import { formatDate, formatDateTime, formatPriceBDT, humanize, initials } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { ErrorBox, OrderStatusBadge, Pill, RETURN_STATUS_TONE, Spinner } from "@/components/orders";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "returns", label: "Returns" },
  { key: "reviews", label: "Reviews" },
  { key: "notifications", label: "Notifications" },
  { key: "security", label: "Security" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export default function MyAccountPage() {
  return (
    <>
      <PageHero
        title="My Account"
        subtitle="Your profile, orders, returns and notifications."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Account" }]}
      />
      <Suspense fallback={<Spinner />}>
        <Account />
      </Suspense>
    </>
  );
}

function Account() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { user, status } = useAuth();
  const tabParam = params.get("tab") as TabKey | null;
  const tab: TabKey = TABS.some((t) => t.key === tabParam) ? (tabParam as TabKey) : "overview";

  useEffect(() => {
    if (status === "guest") router.replace("/signin?next=/my-account");
  }, [status, router]);

  if (status !== "authenticated" || !user) return <Spinner label="Loading your account…" />;

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="space-y-4">
        <div className="rounded-3xl bg-white p-5 text-center ring-1 ring-slate-100">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xl font-black text-white">
            {initials(user.fullName)}
          </span>
          <div className="mt-3 font-black text-slate-900">{user.fullName}</div>
          <div className="text-xs text-slate-500">{user.email}</div>
          <div className="mt-2">
            {user.isEmailVerified ? (
              <Pill tone="green">Email verified</Pill>
            ) : (
              <Link href="/verify-email">
                <Pill tone="amber">Verify your email</Pill>
              </Link>
            )}
          </div>
          {user.permissions.includes("dashboard:access") && (
            <Link
              href="/admin-dashboard"
              className="mt-3 inline-block rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-bold text-white"
            >
              Open Admin Dashboard
            </Link>
          )}
        </div>
        <nav className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => router.replace(`${pathname}?tab=${t.key}`)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-left text-sm font-bold transition ${
                tab === t.key ? "bg-brand-soft text-brand-dark ring-1 ring-brand/20" : "bg-white text-slate-600 ring-1 ring-slate-100 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
          <Link href="/my-orders" className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-600 ring-1 ring-slate-100 hover:bg-slate-50">
            My Orders →
          </Link>
          <Link href="/wishlist" className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-600 ring-1 ring-slate-100 hover:bg-slate-50">
            Wishlist →
          </Link>
        </nav>
      </aside>

      <section className="min-w-0">
        {tab === "overview" && <Overview />}
        {tab === "returns" && <Returns />}
        {tab === "reviews" && <MyReviews />}
        {tab === "notifications" && <Notifications />}
        {tab === "security" && <Security />}
      </section>
    </main>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-black text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Overview() {
  const { user } = useAuth();
  const me = useAsync(() => authApi.me(), []);
  const stats = useAsync(() => ordersApi.myStats(), []);
  const recent = useAsync(() => ordersApi.myOrders({ limit: 5 }), []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Orders" value={stats.data ? String(stats.data.totalOrders) : "—"} />
        <Stat label="Total spent" value={stats.data ? formatPriceBDT(stats.data.totalSpent) : "—"} />
        <Stat label="Delivered" value={stats.data ? String(stats.data.byStatus.delivered ?? 0) : "—"} />
        <Stat label="Member since" value={formatDate(me.data?.createdAt ?? user?.createdAt)} />
      </div>

      <Card title="Profile">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <Info label="Full name" value={me.data?.fullName ?? user?.fullName} />
          <Info label="Email" value={me.data?.email ?? user?.email} />
          <Info label="Account type" value={humanize(me.data?.role ?? user?.role)} />
          <Info label="Last updated" value={formatDateTime(me.data?.updatedAt)} />
        </dl>
      </Card>

      <Card
        title="Recent Orders"
        action={
          <Link href="/my-orders" className="text-xs font-bold text-brand-dark hover:underline">
            View all
          </Link>
        }
      >
        {recent.loading ? (
          <Spinner />
        ) : recent.error ? (
          <ErrorBox message={recent.error} onRetry={recent.reload} />
        ) : !recent.data?.items.length ? (
          <p className="text-sm text-slate-500">
            No orders yet.{" "}
            <Link href="/shop" className="font-bold text-brand-dark">
              Start shopping
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.data.items.map((o) => (
              <li key={o._id}>
                <Link href={`/my-orders/${o._id}`} className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50">
                  <div>
                    <div className="font-mono text-sm font-bold text-slate-900">#{o.orderNumber}</div>
                    <div className="text-[11px] text-slate-500">{formatDate(o.placedAt)}</div>
                  </div>
                  <OrderStatusBadge status={o.status} />
                  <div className="text-sm font-black text-slate-900">{formatPriceBDT(o.grandTotal)}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Returns() {
  const { showToast } = useStore();
  const [page, setPage] = useState(1);
  const list = useAsync(() => returnsApi.mine({ page, limit: 10 }), [page]);
  const [refundFor, setRefundFor] = useState<OrderReturn | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  /** Re-read one return (GET /returns/:id) and swap it into the list. */
  const refreshOne = async (id: string) => {
    try {
      const fresh = await returnsApi.get(id);
      list.setData((d) => (d ? { ...d, items: d.items.map((x) => (x._id === id ? fresh : x)) } : d));
    } catch {
      void list.reload();
    }
  };

  const cancel = async (r: OrderReturn) => {
    setBusy(r._id);
    try {
      await returnsApi.cancel(r._id);
      showToast(`Return ${r.returnNumber} cancelled`, "info");
      await refreshOne(r._id);
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card title="My Returns">
      {list.loading ? (
        <Spinner />
      ) : list.error ? (
        <ErrorBox message={list.error} onRetry={list.reload} />
      ) : !list.data?.items.length ? (
        <p className="text-sm text-slate-500">
          No return requests. You can request a return from a delivered order on the{" "}
          <Link href="/my-orders" className="font-bold text-brand-dark">
            My Orders
          </Link>{" "}
          page.
        </p>
      ) : (
        <div className="space-y-3">
          {list.data.items.map((r) => (
            <div key={r._id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-mono text-sm font-black text-slate-900">{r.returnNumber}</div>
                  <div className="text-[11px] text-slate-500">
                    Order #{r.orderNumber} · {formatDate(r.createdAt)}
                  </div>
                </div>
                <Pill tone={RETURN_STATUS_TONE[r.status]}>{humanize(r.status)}</Pill>
              </div>
              <ul className="mt-2 text-xs text-slate-600">
                {r.items.map((it) => (
                  <li key={it.orderItemId}>
                    {it.quantity} × {it.productName} — {formatPriceBDT(it.refundAmount)}
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-xs text-slate-600">
                Reason: <strong>{humanize(r.reason)}</strong>
                {r.description ? ` — ${r.description}` : ""}
              </div>
              {r.adminNote && <div className="mt-1 text-xs text-slate-600">Note from us: {r.adminNote}</div>}
              <div className="mt-2 text-xs font-bold text-slate-900">Refund amount: {formatPriceBDT(r.refundAmount)}</div>
              {r.refundPreference && (
                <div className="text-[11px] text-slate-500">
                  Refund to {humanize(r.refundPreference.method)}
                  {r.refundPreference.accountDetails ? ` (${r.refundPreference.accountDetails})` : ""}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {r.status === "requested" && (
                  <button
                    onClick={() => cancel(r)}
                    disabled={busy === r._id}
                    className="rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-bold text-rose-600 disabled:opacity-50"
                  >
                    Cancel return
                  </button>
                )}
                {!r.refundRequested && ["requested", "approved", "received"].includes(r.status) && (
                  <button
                    onClick={() => setRefundFor(r)}
                    className="rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-dark"
                  >
                    Request refund
                  </button>
                )}
              </div>
              {refundFor?._id === r._id && (
                <RefundRequestForm
                  ret={r}
                  onClose={() => setRefundFor(null)}
                  onDone={() => {
                    setRefundFor(null);
                    void refreshOne(r._id);
                  }}
                />
              )}
            </div>
          ))}
          {list.data.totalPages > 1 && (
            <div className="flex justify-center gap-2 text-xs font-bold">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-full px-3 py-1.5 ring-1 ring-slate-200 disabled:opacity-40">
                Prev
              </button>
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
      )}
    </Card>
  );
}

function RefundRequestForm({ ret, onClose, onDone }: { ret: OrderReturn; onClose: () => void; onDone: () => void }) {
  const { showToast } = useStore();
  const [method, setMethod] = useState<RefundMethod>("bkash");
  const [accountDetails, setAccountDetails] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await returnsApi.requestRefund(ret._id, {
        method,
        ...(accountDetails.trim() ? { accountDetails: accountDetails.trim() } : {}),
        ...(note.trim() ? { note: note.trim() } : {}),
      });
      showToast("Refund requested", "success");
      onDone();
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 grid gap-2 rounded-xl bg-white p-3 ring-1 ring-brand/20 sm:grid-cols-2">
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value as RefundMethod)}
        className="h-10 rounded-lg border border-slate-200 px-2 text-sm"
        aria-label="Refund method"
      >
        {REFUND_METHODS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <input
        value={accountDetails}
        onChange={(e) => setAccountDetails(e.target.value)}
        placeholder="Account / wallet number"
        className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
      />
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        className="h-10 rounded-lg border border-slate-200 px-3 text-sm sm:col-span-2"
      />
      <div className="flex gap-2 sm:col-span-2">
        <button disabled={saving} className="rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white disabled:opacity-50">
          {saving ? "Sending…" : "Submit refund request"}
        </button>
        <button type="button" onClick={onClose} className="rounded-full px-4 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
          Cancel
        </button>
      </div>
    </form>
  );
}

function MyReviews() {
  const { showToast } = useStore();
  const [page, setPage] = useState(1);
  const list = useAsync(() => reviewsApi.mine({ page, limit: 10 }), [page]);
  const [editing, setEditing] = useState<Review | null>(null);

  const remove = async (r: Review) => {
    try {
      await reviewsApi.remove(r._id);
      showToast("Review deleted", "info");
      void list.reload();
    } catch (err) {
      showToast(errorMessage(err), "error");
    }
  };

  return (
    <Card title="My Reviews">
      {list.loading ? (
        <Spinner />
      ) : list.error ? (
        <ErrorBox message={list.error} onRetry={list.reload} />
      ) : !list.data?.items.length ? (
        <p className="text-sm text-slate-500">
          You haven&apos;t reviewed anything yet. Open a product you bought and use the Reviews tab.
        </p>
      ) : (
        <div className="space-y-3">
          {list.data.items.map((r) => {
            const product = typeof r.product === "object" ? r.product : null;
            return (
              <div key={r._id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    {product ? (
                      <Link href={`/product/${product.slug}`} className="text-sm font-bold text-slate-900 hover:text-brand-dark">
                        {product.productName}
                      </Link>
                    ) : (
                      <span className="text-sm font-bold text-slate-900">Product</span>
                    )}
                    <div className="text-[11px] text-slate-500">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)} · {formatDate(r.createdAt)}
                    </div>
                  </div>
                  <Pill tone={r.status === "approved" ? "green" : r.status === "rejected" ? "red" : "amber"}>
                    {r.status === "pending" ? "Awaiting moderation" : humanize(r.status)}
                  </Pill>
                </div>
                {r.title && <div className="mt-2 text-sm font-semibold text-slate-800">{r.title}</div>}
                <p className="mt-1 text-xs text-slate-600">{r.comment}</p>
                {r.adminReply && <p className="mt-2 rounded-xl bg-white p-2 text-[11px] text-slate-600">Reply: {r.adminReply}</p>}
                {editing?._id === r._id ? (
                  <EditReview
                    review={r}
                    onClose={() => setEditing(null)}
                    onSaved={() => {
                      setEditing(null);
                      void list.reload();
                    }}
                  />
                ) : (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setEditing(r)} className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                      Edit
                    </button>
                    <button onClick={() => remove(r)} className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-rose-600 ring-1 ring-rose-200">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {list.data.totalPages > 1 && (
            <div className="flex justify-center gap-2 text-xs font-bold">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-full px-3 py-1.5 ring-1 ring-slate-200 disabled:opacity-40">
                Prev
              </button>
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
      )}
    </Card>
  );
}

function EditReview({ review, onClose, onSaved }: { review: Review; onClose: () => void; onSaved: () => void }) {
  const { showToast } = useStore();
  const [rating, setRating] = useState(review.rating);
  const [title, setTitle] = useState(review.title ?? "");
  const [comment, setComment] = useState(review.comment);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const env = await reviewsApi.update(review._id, { rating, title: title.trim(), comment: comment.trim() });
      showToast(env.message ?? "Review updated", "success");
      onSaved();
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="mt-3 space-y-2 rounded-xl bg-white p-3 ring-1 ring-brand/20">
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="h-9 rounded-lg border border-slate-200 px-2 text-sm" aria-label="Rating">
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} star{n > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} placeholder="Title" className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      <textarea required minLength={5} rows={3} value={comment} onChange={(e) => setComment(e.target.value)} className="w-full rounded-lg border border-slate-200 p-2 text-sm" />
      <p className="text-[11px] text-slate-500">Edited reviews are checked again before they reappear.</p>
      <div className="flex gap-2">
        <button disabled={saving} className="rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white disabled:opacity-50">
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onClose} className="rounded-full px-4 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Notifications() {
  const { showToast } = useStore();
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const list = useAsync(() => notificationsApi.list({ page, limit: 20, unreadOnly: unreadOnly || undefined }), [page, unreadOnly]);

  const markRead = async (id: string) => {
    try {
      const n = await notificationsApi.markRead(id);
      list.setData((d) =>
        d ? { ...d, items: d.items.map((x) => (x._id === id ? n : x)), unreadCount: Math.max(0, d.unreadCount - 1) } : d
      );
    } catch (err) {
      showToast(errorMessage(err), "error");
    }
  };

  const markAll = async () => {
    try {
      const env = await notificationsApi.markAllRead();
      showToast(env.message ?? "All marked as read", "success");
      void list.reload();
    } catch (err) {
      showToast(errorMessage(err), "error");
    }
  };

  return (
    <Card
      title={`Notifications${list.data?.unreadCount ? ` (${list.data.unreadCount} unread)` : ""}`}
      action={
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => {
                setUnreadOnly(e.target.checked);
                setPage(1);
              }}
              className="accent-brand"
            />
            Unread only
          </label>
          <button onClick={markAll} className="text-xs font-bold text-brand-dark hover:underline">
            Mark all read
          </button>
        </div>
      }
    >
      {list.loading ? (
        <Spinner />
      ) : list.error ? (
        <ErrorBox message={list.error} onRetry={list.reload} />
      ) : !list.data?.items.length ? (
        <p className="text-sm text-slate-500">You&apos;re all caught up.</p>
      ) : (
        <ul className="space-y-2">
          {list.data.items.map((n) => (
            <li
              key={n._id}
              className={`rounded-2xl p-4 ring-1 ${n.isRead ? "bg-white ring-slate-100" : "bg-brand-soft ring-brand/20"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900">{n.title}</div>
                  <div className="text-xs text-slate-600">{n.message}</div>
                  <div className="mt-1 text-[11px] text-slate-400">{formatDateTime(n.createdAt)}</div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {n.order && (
                    <Link href={`/my-orders/${n.order}`} className="text-[11px] font-bold text-brand-dark hover:underline">
                      View order
                    </Link>
                  )}
                  {!n.isRead && (
                    <button onClick={() => markRead(n._id)} className="text-[11px] font-bold text-slate-500 hover:text-slate-900">
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {list.data && list.data.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2 text-xs font-bold">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-full px-3 py-1.5 ring-1 ring-slate-200 disabled:opacity-40">
            Prev
          </button>
          <button
            disabled={page >= list.data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full px-3 py-1.5 ring-1 ring-slate-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </Card>
  );
}

function Security() {
  const router = useRouter();
  const { user, logout, logoutAll } = useAuth();
  const { showToast } = useStore();
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (key: string, fn: () => Promise<void>, msg: string) => {
    setBusy(key);
    try {
      await fn();
      showToast(msg, "info");
      router.push("/");
    } catch (err) {
      showToast(errorMessage(err), "error");
      setBusy(null);
    }
  };

  const resend = async () => {
    if (!user) return;
    setBusy("verify");
    try {
      const env = await authApi.resendVerification(user.email);
      showToast(env.message ?? "Verification email sent", "success");
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card title="Security">
      <div className="space-y-4">
        {!user?.isEmailVerified && (
          <Row title="Verify your email" desc="Confirm your email address to secure your account.">
            <button onClick={resend} disabled={busy === "verify"} className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white disabled:opacity-50">
              Resend link
            </button>
          </Row>
        )}
        <Row title="Sign out" desc="Sign out of this browser.">
          <button
            onClick={() => run("logout", logout, "Signed out")}
            disabled={!!busy}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-50"
          >
            Sign out
          </button>
        </Row>
        <Row title="Sign out everywhere" desc="Ends every session on all your devices.">
          <button
            onClick={() => run("all", logoutAll, "Signed out from all devices")}
            disabled={!!busy}
            className="rounded-full border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 disabled:opacity-50"
          >
            Sign out all devices
          </button>
        </Row>
      </div>
    </Card>
  );
}

function Row({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
      <div>
        <div className="text-sm font-bold text-slate-900">{title}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-black text-slate-900">{value}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-semibold text-slate-900">{value || "—"}</dd>
    </div>
  );
}
