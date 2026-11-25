"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { SmartImage } from "@/components/SmartImage";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import {
  CANCEL_REQUESTABLE,
  CUSTOMER_CANCELLABLE,
  RETURN_REASONS,
  errorMessage,
  ordersApi,
  paymentsApi,
  returnsApi,
  type Order,
  type ReturnReason,
} from "@/lib/api";
import { formatDateTime, formatPriceBDT, humanize } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import {
  AddressBlock,
  ErrorBox,
  OrderItemsList,
  OrderStatusBadge,
  OrderTotals,
  PaymentStatusBadge,
  Pill,
  RETURN_STATUS_TONE,
  Spinner,
} from "@/components/orders";

export function OrderDetailFromParams({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return /^[A-Z]{2,}-\d/i.test(id) ? <OrderByNumber orderNumber={id} /> : <OrderDetailClient id={id} />;
}

/** /my-orders/OC-261124-0001 → look the order up by its number, then show it. */
function OrderByNumber({ orderNumber }: { orderNumber: string }) {
  const { status } = useAuth();
  const found = useAsync(() => ordersApi.getByNumber(orderNumber.toUpperCase()), [orderNumber], status === "authenticated");
  if (status === "guest") return <OrderDetailClient id={orderNumber} />;
  if (found.loading) return <Spinner label="Finding your order…" />;
  if (!found.data)
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <ErrorBox message={found.error ?? "Order not found"} />
      </main>
    );
  return <OrderDetailClient id={found.data._id} />;
}

export function OrderDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { status } = useAuth();
  const { showToast, applyServerCart, setIsCartOpen } = useStore();
  const ready = status === "authenticated";

  useEffect(() => {
    if (status === "guest") router.replace(`/signin?next=/my-orders/${id}`);
  }, [status, router, id]);

  const order = useAsync(() => ordersApi.get(id), [id], ready);
  const history = useAsync(() => ordersApi.statusHistory(id), [id], ready);
  const payment = useAsync(() => paymentsApi.details(id), [id], ready);
  const summary = useAsync(() => ordersApi.summary(id), [id], ready);
  const returns = useAsync(() => returnsApi.mine({ limit: 50 }), [], ready);

  const [busy, setBusy] = useState<string | null>(null);
  const [cancelMode, setCancelMode] = useState<"cancel" | "request" | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showReturn, setShowReturn] = useState(false);
  const [showTx, setShowTx] = useState(false);
  const tx = useAsync(() => paymentsApi.transactions(id), [id], ready && showTx);
  const invoice = useAsync(() => ordersApi.invoice(id), [id], ready);

  const refreshAll = () => {
    void order.reload();
    void history.reload();
    void payment.reload();
    void summary.reload();
    void returns.reload();
  };

  const act = async (key: string, fn: () => Promise<unknown>, success: string) => {
    setBusy(key);
    try {
      await fn();
      showToast(success, "success");
      refreshAll();
      return true;
    } catch (err) {
      showToast(errorMessage(err), "error");
      return false;
    } finally {
      setBusy(null);
    }
  };

  const submitCancel = async () => {
    if (cancelReason.trim().length < 3) {
      showToast("Please give a short reason (at least 3 characters)", "error");
      return;
    }
    const ok =
      cancelMode === "cancel"
        ? await act("cancel", () => ordersApi.cancel(id, cancelReason.trim()), "Order cancelled")
        : await act("cancel", () => ordersApi.requestCancel(id, cancelReason.trim()), "Cancellation request sent");
    if (ok) {
      setCancelMode(null);
      setCancelReason("");
    }
  };

  const reorder = async () => {
    setBusy("reorder");
    try {
      const env = await ordersApi.reorder(id);
      applyServerCart(env.data.cart);
      const skipped = env.data.skipped.length;
      showToast(
        skipped ? `Added to cart — ${skipped} item(s) are no longer available` : "Items added to your cart",
        skipped ? "info" : "success"
      );
      setIsCartOpen(true);
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setBusy(null);
    }
  };

  const openInvoice = async () => {
    setBusy("invoice");
    const win = window.open("", "_blank");
    try {
      const html = await ordersApi.invoiceHtml(id);
      if (win) {
        win.document.open();
        win.document.write(html);
        win.document.close();
      }
    } catch (err) {
      win?.close();
      showToast(errorMessage(err, "Could not load invoice"), "error");
    } finally {
      setBusy(null);
    }
  };

  const payNow = async () => {
    setBusy("pay");
    try {
      const pay = await paymentsApi.initialize(id);
      if (pay.data.provider === "mock") {
        router.push(`/payment/mock?tx=${encodeURIComponent(pay.data.transactionId)}&order=${id}`);
      } else {
        window.location.href = pay.data.redirectUrl;
      }
    } catch (err) {
      showToast(errorMessage(err), "error");
      setBusy(null);
    }
  };

  const o = order.data;
  const hero = (
    <PageHero
      title={o ? `Order #${o.orderNumber}` : "Order Details"}
      subtitle={o ? `Placed ${formatDateTime(o.placedAt)}` : undefined}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Orders", href: "/my-orders" },
        { label: o ? `#${o.orderNumber}` : "Order" },
      ]}
    />
  );

  if (!ready || order.loading) {
    return (
      <>
        {hero}
        <Spinner label="Loading order…" />
      </>
    );
  }
  if (order.error || !o) {
    return (
      <>
        {hero}
        <main className="mx-auto max-w-3xl px-4 py-12">
          <ErrorBox message={order.error ?? "Order not found"} onRetry={order.reload} />
        </main>
      </>
    );
  }

  const canCancel = CUSTOMER_CANCELLABLE.includes(o.status);
  const canRequestCancel = CANCEL_REQUESTABLE.includes(o.status) && o.cancellationRequest?.status !== "pending";
  const canReturn = o.status === "delivered";
  const needsPayment =
    o.paymentMethod === "online" && ["unpaid", "pending", "failed"].includes(o.paymentStatus) && o.status === "pending";
  const orderReturns = (returns.data?.items ?? []).filter((r) => r.orderNumber === o.orderNumber);
  const customerNotes = (o.notes ?? []).filter((n) => n.visibility === "customer");

  return (
    <>
      {hero}
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge status={o.status} />
            <PaymentStatusBadge status={o.paymentStatus} />
            {o.cancellationRequest && (
              <Pill tone={o.cancellationRequest.status === "pending" ? "amber" : o.cancellationRequest.status === "approved" ? "green" : "red"}>
                Cancellation {o.cancellationRequest.status}
              </Pill>
            )}
            {summary.data?.trackingNumber && (
              <span className="text-xs text-slate-500">
                Tracking: <span className="font-mono font-bold text-slate-800">{summary.data.trackingNumber}</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {needsPayment && (
              <Btn primary onClick={payNow} disabled={busy === "pay"}>
                {busy === "pay" ? "Starting…" : "Pay Now"}
              </Btn>
            )}
            <Link
              href={`/track-order?order=${o.orderNumber}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark"
            >
              Track
            </Link>
            <Btn onClick={openInvoice} disabled={busy === "invoice"}>
              {invoice.data ? `Invoice ${invoice.data.invoiceNumber}` : "Invoice"}
            </Btn>
            <Btn onClick={reorder} disabled={busy === "reorder"}>
              {busy === "reorder" ? "Adding…" : "Reorder"}
            </Btn>
            {canCancel && <Btn danger onClick={() => setCancelMode("cancel")}>Cancel Order</Btn>}
            {canRequestCancel && <Btn danger onClick={() => setCancelMode("request")}>Request Cancellation</Btn>}
            {canReturn && <Btn onClick={() => setShowReturn((v) => !v)}>Return Items</Btn>}
          </div>
        </div>

        {cancelMode && (
          <div className="mb-6 rounded-2xl bg-rose-50 p-5 ring-1 ring-rose-200">
            <h3 className="text-sm font-black text-rose-900">
              {cancelMode === "cancel" ? "Cancel this order?" : "Request cancellation"}
            </h3>
            <p className="mt-1 text-xs text-rose-800">
              {cancelMode === "cancel"
                ? "Your order hasn't been prepared yet, so it will be cancelled right away."
                : "Your order is already being prepared. Our team will review your request."}
            </p>
            <textarea
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason (e.g. ordered the wrong item)"
              className="mt-3 w-full rounded-xl border border-rose-200 bg-white p-3 text-sm outline-none focus:border-rose-400"
            />
            <div className="mt-3 flex gap-2">
              <Btn danger onClick={submitCancel} disabled={busy === "cancel"}>
                {busy === "cancel" ? "Submitting…" : "Confirm"}
              </Btn>
              <Btn onClick={() => setCancelMode(null)}>Keep Order</Btn>
            </div>
          </div>
        )}

        {showReturn && (
          <ReturnForm
            order={o}
            onDone={() => {
              setShowReturn(false);
              refreshAll();
            }}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <Card title="Items">
              <OrderItemsList items={o.items} />
              <div className="mt-5 border-t border-slate-100 pt-4">
                <OrderTotals order={o} />
              </div>
            </Card>

            <Card title="Order Timeline">
              {history.loading ? (
                <Spinner />
              ) : (
                <ol className="relative space-y-4 border-l-2 border-slate-100 pl-5">
                  {(history.data ?? []).map((h, i) => (
                    <li key={`${h.status}-${i}`} className="relative">
                      <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-brand ring-4 ring-brand-soft" />
                      <div className="text-sm font-bold text-slate-900">{humanize(h.status)}</div>
                      {h.note && <div className="text-xs text-slate-600">{h.note}</div>}
                      <div className="text-[11px] text-slate-400">{formatDateTime(h.at)}</div>
                    </li>
                  ))}
                </ol>
              )}
            </Card>

            {customerNotes.length > 0 && (
              <Card title="Messages from OralCareBD">
                <ul className="space-y-3">
                  {customerNotes.map((n) => (
                    <li key={n._id} className="rounded-xl bg-brand-soft p-3 text-sm text-slate-700">
                      {n.note}
                      <div className="mt-1 text-[11px] text-slate-400">{formatDateTime(n.createdAt)}</div>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {orderReturns.length > 0 && (
              <Card title="Returns">
                <ul className="space-y-3">
                  {orderReturns.map((r) => (
                    <li key={r._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 text-sm">
                      <div>
                        <div className="font-mono font-bold text-slate-900">{r.returnNumber}</div>
                        <div className="text-xs text-slate-500">
                          {humanize(r.reason)} · Refund {formatPriceBDT(r.refundAmount)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill tone={RETURN_STATUS_TONE[r.status]}>{humanize(r.status)}</Pill>
                        <Link href={`/my-account?tab=returns`} className="text-xs font-bold text-brand-dark hover:underline">
                          Manage
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card title="Delivery">
              <div className="space-y-4">
                <AddressBlock title="Shipping address" address={o.shippingAddress} />
                <div className="text-sm text-slate-700">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Method</div>
                  {o.shippingMethod.name} · {o.shippingMethod.estimatedDays.min}-{o.shippingMethod.estimatedDays.max} days
                </div>
                {o.customerNote && (
                  <div className="text-sm text-slate-700">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Your note</div>
                    {o.customerNote}
                  </div>
                )}
              </div>
            </Card>

            <Card title="Payment">
              {payment.loading ? (
                <Spinner />
              ) : payment.data ? (
                <div className="space-y-3 text-sm">
                  <Row label="Method" value={o.paymentMethod === "cod" ? "Cash on Delivery" : "Online"} />
                  <Row label="Amount due" value={formatPriceBDT(payment.data.amountDue)} />
                  <Row label="Paid" value={formatPriceBDT(payment.data.amountPaid)} />
                  {payment.data.amountRefunded > 0 && <Row label="Refunded" value={formatPriceBDT(payment.data.amountRefunded)} />}
                  {payment.data.refunds.length > 0 && (
                    <div className="rounded-xl bg-slate-50 p-3 text-xs">
                      {payment.data.refunds.map((r) => (
                        <div key={r._id} className="flex justify-between">
                          <span className="font-mono">{r.refundNumber}</span>
                          <span>
                            {formatPriceBDT(r.amount)} · {humanize(r.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setShowTx((v) => !v)} className="text-xs font-bold text-brand-dark hover:underline">
                    {showTx ? "Hide" : "Show"} payment history
                  </button>
                  {showTx && (
                    <ul className="space-y-1 text-xs text-slate-600">
                      {tx.loading ? (
                        <li>Loading…</li>
                      ) : (
                        (tx.data ?? []).map((t) => (
                          <li key={t._id} className="flex justify-between gap-2">
                            <span>
                              {humanize(t.type)} · {humanize(t.status)}
                            </span>
                            <span className="text-slate-400">{formatDateTime(t.createdAt)}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="text-sm text-slate-500">{payment.error ?? "No payment information."}</div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

function ReturnForm({ order, onDone }: { order: Order; onDone: () => void }) {
  const { showToast } = useStore();
  const [qty, setQty] = useState<Record<string, number>>({});
  const [reason, setReason] = useState<ReturnReason>("damaged");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const f of Array.from(files).slice(0, 5 - images.length)) {
        const res = await returnsApi.uploadImage(f);
        setImages((prev) => [...prev, res.url]);
      }
    } catch (err) {
      showToast(errorMessage(err, "Upload failed"), "error");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    const items = Object.entries(qty)
      .filter(([, q]) => q > 0)
      .map(([orderItemId, quantity]) => ({ orderItemId, quantity }));
    if (!items.length) {
      showToast("Select at least one item to return", "error");
      return;
    }
    setSubmitting(true);
    try {
      const env = await ordersApi.createReturn(order._id, {
        items,
        reason,
        ...(description.trim() ? { description: description.trim() } : {}),
        images,
      });
      showToast(`Return ${env.data.returnNumber} submitted`, "success");
      onDone();
    } catch (err) {
      showToast(errorMessage(err, "Could not submit return"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl bg-white p-5 ring-1 ring-brand/20">
      <h3 className="text-sm font-black text-slate-900">Request a return</h3>
      <div className="mt-4 space-y-2">
        {order.items.map((it) => (
          <div key={it._id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
            <div className="min-w-0 text-sm">
              <div className="line-clamp-1 font-semibold text-slate-900">{it.productName}</div>
              <div className="text-[11px] text-slate-500">Bought {it.quantity}</div>
            </div>
            <select
              value={qty[it._id] ?? 0}
              onChange={(e) => setQty((q) => ({ ...q, [it._id]: Number(e.target.value) }))}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm"
              aria-label={`Quantity of ${it.productName} to return`}
            >
              {Array.from({ length: it.quantity + 1 }, (_, n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-bold text-slate-700">
          Reason
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as ReturnReason)}
            className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal"
          >
            {RETURN_REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-700">
          Photos (up to 5)
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading || images.length >= 5}
            onChange={(e) => upload(e.target.files)}
            className="mt-1 block w-full text-xs font-normal"
          />
        </label>
      </div>
      {images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {images.map((src) => (
            <span key={src} className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
              <SmartImage src={src} alt="" fill sizes="64px" className="object-cover" />
            </span>
          ))}
        </div>
      )}
      <textarea
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the problem (optional)"
        className="mt-3 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand"
      />
      <div className="mt-3 flex gap-2">
        <Btn primary onClick={submit} disabled={submitting || uploading}>
          {submitting ? "Submitting…" : "Submit Return"}
        </Btn>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
      <h2 className="mb-4 text-base font-black text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function Btn({
  children,
  onClick,
  disabled,
  primary,
  danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  danger?: boolean;
}) {
  const cls = primary
    ? "bg-brand text-white hover:bg-brand-dark"
    : danger
    ? "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
    : "border border-slate-200 bg-white text-slate-700 hover:border-brand hover:text-brand-dark";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-2 text-xs font-bold transition disabled:opacity-50 ${cls}`}
    >
      {children}
    </button>
  );
}
