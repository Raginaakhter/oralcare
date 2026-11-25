"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import {
  adminOrdersApi,
  adminRefundsApi,
  COURIER_PROVIDERS,
  ORDER_STATUS_TRANSITIONS,
  REFUND_METHODS,
  SHIPMENT_STATUSES,
  type Address,
  type CourierProvider,
  type OrderStatus,
  type RefundMethod,
  type ShipmentStatus,
  type ShippingMethodCode,
} from "@/lib/api";
import { formatDateTime, formatPriceBDT, humanize } from "@/lib/format";
import { useAsync, useShippingMethods } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import {
  AddressBlock,
  OrderItemsList,
  OrderStatusBadge,
  OrderTotals,
  PaymentStatusBadge,
  Pill,
  REFUND_STATUS_TONE,
  RETURN_STATUS_TONE,
} from "@/components/orders";
import { AdminHeader } from "../../AdminHeader";
import { Loader, Modal, btn, inputCls, useAdminAction } from "../../AdminShell";

type Dialog = "status" | "cancel" | "billing" | "shipping" | "courier" | "tracking" | "event" | "refund" | null;

export function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const run = useAdminAction();
  const { can } = useAuth();
  const isNumber = /^[A-Z]{2,}-\d/i.test(id);
  const detail = useAsync(() => (isNumber ? adminOrdersApi.getByNumber(id) : adminOrdersApi.get(id)), [id]);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [note, setNote] = useState("");
  const [noteVis, setNoteVis] = useState<"internal" | "customer">("internal");
  const [reviewNote, setReviewNote] = useState("");

  if (detail.loading) return <Loader />;
  if (!detail.data) return <p className="text-sm font-semibold text-rose-700">{detail.error ?? "Order not found"}</p>;

  const { order: o, statusHistory, payments, shipment, returns, refunds } = detail.data;
  const reload = () => void detail.reload();
  const close = () => setDialog(null);

  /** Run an action; on success reload and close any dialog. */
  const act = async <T,>(fn: () => Promise<T>, msg: string) => {
    const r = await run(fn, msg);
    if (r !== undefined) {
      reload();
      close();
    }
    return r;
  };

  const nextStatuses = (ORDER_STATUS_TRANSITIONS[o.status] ?? []).filter((s) => s !== "cancelled" && s !== "confirmed");
  const canCancel = ORDER_STATUS_TRANSITIONS[o.status]?.includes("cancelled");
  const pendingRequest = o.cancellationRequest?.status === "pending";
  const notes = o.notes ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Orders", href: "/admin-dashboard/orders" },
          { label: o.orderNumber },
        ]}
        title={<span className="font-mono">#{o.orderNumber}</span>}
        description={`Placed ${formatDateTime(o.placedAt)} · ${o.source === "buy_now" ? "Buy now" : "Cart"} order`}
        actions={
          <div className="flex flex-wrap gap-2">
            {o.status === "pending" && (
              <button onClick={() => act(() => adminOrdersApi.confirm(o._id), "Order confirmed")} className={btn.brand}>
                Confirm order
              </button>
            )}
            {nextStatuses.length > 0 && (
              <button onClick={() => setDialog("status")} className={btn.primary}>
                Update status
              </button>
            )}
            {canCancel && (
              <button onClick={() => setDialog("cancel")} className={btn.danger}>
                Cancel order
              </button>
            )}
            {can("refunds:manage") && (
              <button onClick={() => setDialog("refund")} className={btn.secondary}>
                Create refund
              </button>
            )}
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <OrderStatusBadge status={o.status} />
        <PaymentStatusBadge status={o.paymentStatus} />
        <Pill tone="slate">{o.paymentMethod === "cod" ? "Cash on delivery" : "Online payment"}</Pill>
        {o.coupon && <Pill tone="violet">Coupon {o.coupon.code}</Pill>}
      </div>

      {pendingRequest && (
        <div className="mb-6 rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200">
          <div className="text-sm font-black text-amber-900">Customer requested cancellation</div>
          <p className="mt-1 text-sm text-amber-800">
            “{o.cancellationRequest!.reason}” · {formatDateTime(o.cancellationRequest!.requestedAt)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} placeholder="Note (optional)" className={`${inputCls} max-w-xs bg-white`} />
            <button
              onClick={() =>
                act(() => adminOrdersApi.reviewCancellation(o._id, { action: "approve", ...(reviewNote ? { note: reviewNote } : {}) }), "Cancellation approved")
              }
              className={btn.danger}
            >
              Approve & cancel
            </button>
            <button
              onClick={() =>
                act(() => adminOrdersApi.reviewCancellation(o._id, { action: "reject", ...(reviewNote ? { note: reviewNote } : {}) }), "Cancellation rejected")
              }
              className={btn.secondary}
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {o.cancellation && (
        <div className="mb-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-800 ring-1 ring-rose-200">
          Cancelled by {o.cancellation.cancelledByRole} on {formatDateTime(o.cancellation.cancelledAt)} — “{o.cancellation.reason}”
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card title="Items">
            <OrderItemsList items={o.items} linkToProduct={false} />
            <div className="mt-5 border-t border-slate-100 pt-4">
              <OrderTotals order={o} />
            </div>
          </Card>

          <Card
            title="Shipment"
            action={
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setDialog("courier")} className={btn.secondary}>
                  {shipment ? "Reassign courier" : "Assign courier"}
                </button>
                {shipment && (
                  <>
                    <button onClick={() => setDialog("tracking")} className={btn.secondary}>
                      Tracking
                    </button>
                    <button onClick={() => setDialog("event")} className={btn.secondary}>
                      Add event
                    </button>
                    <button
                      onClick={async () => {
                        const fresh = await run(() => adminOrdersApi.shipment(o._id), "Shipment refreshed");
                        if (fresh) detail.setData((d) => (d ? { ...d, shipment: fresh } : d));
                      }}
                      className={btn.secondary}
                    >
                      Refresh
                    </button>
                    {shipment.provider === "steadfast" && (
                      <button onClick={() => act(() => adminOrdersApi.syncShipment(o._id), "Synced from Steadfast")} className={btn.secondary}>
                        Sync Steadfast
                      </button>
                    )}
                  </>
                )}
              </div>
            }
          >
            {shipment ? (
              <div className="text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900">{shipment.courierName ?? humanize(shipment.provider)}</span>
                  <Pill tone="violet">{humanize(shipment.status)}</Pill>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {shipment.trackingNumber ? (
                    <>
                      Tracking <span className="font-mono font-bold text-slate-700">{shipment.trackingNumber}</span>
                    </>
                  ) : (
                    "No tracking number yet"
                  )}
                  {shipment.consignmentId && <> · Consignment {shipment.consignmentId}</>}
                  {shipment.codAmount != null && <> · COD {formatPriceBDT(shipment.codAmount)}</>}
                  {shipment.trackingUrl && (
                    <>
                      {" "}
                      ·{" "}
                      <a href={shipment.trackingUrl} target="_blank" rel="noreferrer" className="font-bold text-brand-dark">
                        open ↗
                      </a>
                    </>
                  )}
                </div>
                <ol className="mt-4 space-y-2">
                  {[...shipment.events].reverse().map((e, i) => (
                    <li key={e._id ?? i} className="rounded-xl bg-slate-50 p-3 text-xs">
                      <div className="font-bold text-slate-900">{humanize(e.status)}</div>
                      {e.description && <div className="text-slate-600">{e.description}</div>}
                      {e.location && <div className="text-slate-500">📍 {e.location}</div>}
                      <div className="text-[11px] text-slate-400">
                        {formatDateTime(e.createdAt ?? e.at)} {e.source ? `· ${e.source}` : ""}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No courier assigned. Assign one before marking the order shipped.</p>
            )}
          </Card>

          <Card title="Status history">
            <ol className="relative space-y-4 border-l-2 border-slate-100 pl-5">
              {[...statusHistory].reverse().map((h) => (
                <li key={h._id} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-brand ring-4 ring-brand-soft" />
                  <div className="text-sm font-bold text-slate-900">
                    {h.fromStatus ? `${humanize(h.fromStatus)} → ` : ""}
                    {humanize(h.toStatus)}
                  </div>
                  {h.note && <div className="text-xs text-slate-600">Internal: {h.note}</div>}
                  {h.customerNote && h.customerNote !== h.note && <div className="text-xs text-slate-600">Customer: {h.customerNote}</div>}
                  <div className="text-[11px] text-slate-400">
                    {formatDateTime(h.createdAt)} · {typeof h.changedBy === "object" && h.changedBy ? h.changedBy.fullName : h.changedByRole}
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Notes">
            <ul className="space-y-2">
              {notes.map((n) => (
                <li key={n._id} className={`rounded-xl p-3 text-sm ${n.visibility === "customer" ? "bg-brand-soft" : "bg-slate-50"}`}>
                  <div className="text-slate-800">{n.note}</div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {n.visibility === "customer" ? "Visible to customer" : "Internal"} · {n.authorRole} · {formatDateTime(n.createdAt)}
                  </div>
                </li>
              ))}
              {!notes.length && <li className="text-sm text-slate-500">No notes yet.</li>}
            </ul>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!note.trim()) return;
                const r = await act(() => adminOrdersApi.addNote(o._id, { note: note.trim(), visibility: noteVis }), "Note added");
                if (r) setNote("");
              }}
              className="mt-4 flex flex-wrap gap-2"
            >
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note…" className={`${inputCls} flex-1`} />
              <select value={noteVis} onChange={(e) => setNoteVis(e.target.value as "internal" | "customer")} className={`${inputCls} w-auto`}>
                <option value="internal">Internal</option>
                <option value="customer">Customer-visible</option>
              </select>
              <button className={btn.primary}>Add</button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Customer">
            <div className="text-sm">
              <div className="font-bold text-slate-900">{o.customerName}</div>
              <div className="text-slate-600">{o.customerEmail}</div>
              <Link
                href={`/admin-dashboard/orders?customer=${typeof o.customer === "string" ? o.customer : o.customer._id}`}
                className="mt-1 inline-block text-xs font-bold text-brand-dark hover:underline"
              >
                All orders from this customer →
              </Link>
            </div>
            {o.customerNote && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">Customer note: {o.customerNote}</p>}
          </Card>

          <Card
            title="Addresses"
            action={
              <div className="flex gap-2">
                <button onClick={() => setDialog("shipping")} className={btn.secondary}>
                  Edit shipping
                </button>
                <button onClick={() => setDialog("billing")} className={btn.secondary}>
                  Edit billing
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <AddressBlock title="Shipping" address={o.shippingAddress} />
              <div className="text-xs text-slate-600">
                Method: <strong>{o.shippingMethod.name}</strong> ({formatPriceBDT(o.shippingMethod.charge)})
              </div>
              <AddressBlock title="Billing" address={o.billingAddress} />
            </div>
          </Card>

          <Card title="Payments">
            <ul className="space-y-2 text-sm">
              {payments.map((p) => (
                <li key={p._id} className="rounded-xl bg-slate-50 p-3">
                  <div className="flex justify-between">
                    <span className="font-semibold capitalize">
                      {p.method} · {p.provider}
                    </span>
                    <span className="font-bold">{formatPriceBDT(p.amount)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {humanize(p.status)} · {p.transactionId}
                    {p.refundedAmount > 0 && ` · refunded ${formatPriceBDT(p.refundedAmount)}`}
                    {p.paidAt && ` · paid ${formatDateTime(p.paidAt)}`}
                  </div>
                </li>
              ))}
              {!payments.length && <li className="text-slate-500">No payment records.</li>}
            </ul>
          </Card>

          <Card title="Returns & refunds">
            <ul className="space-y-2 text-sm">
              {returns.map((r) => (
                <li key={r._id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <Link href={`/admin-dashboard/returns?open=${r._id}`} className="font-mono font-bold text-slate-900 hover:text-brand-dark">
                    {r.returnNumber}
                  </Link>
                  <Pill tone={RETURN_STATUS_TONE[r.status]}>{humanize(r.status)}</Pill>
                </li>
              ))}
              {refunds.map((r) => (
                <li key={r._id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span className="font-mono font-bold text-slate-900">
                    {r.refundNumber} · {formatPriceBDT(r.amount)}
                  </span>
                  <Pill tone={REFUND_STATUS_TONE[r.status]}>{humanize(r.status)}</Pill>
                </li>
              ))}
              {!returns.length && !refunds.length && <li className="text-slate-500">None.</li>}
            </ul>
          </Card>
        </div>
      </div>

      {/* ── Dialogs ── */}
      {dialog === "status" && (
        <Modal title="Update status" onClose={close}>
          <FormDialog
            onSubmit={(fd) =>
              act(
                () =>
                  adminOrdersApi.updateStatus(o._id, {
                    status: fd.get("status") as OrderStatus,
                    ...(fd.get("note") ? { note: String(fd.get("note")) } : {}),
                    ...(fd.get("customerNote") ? { customerNote: String(fd.get("customerNote")) } : {}),
                  }),
                "Status updated"
              )
            }
          >
            <select name="status" className={inputCls}>
              {nextStatuses.map((s) => (
                <option key={s} value={s}>
                  {humanize(s)}
                </option>
              ))}
            </select>
            {nextStatuses.includes("shipped") && !shipment && (
              <p className="text-xs font-semibold text-amber-700">Assign a courier before marking as shipped.</p>
            )}
            <input name="note" placeholder="Internal note (optional)" className={inputCls} />
            <input name="customerNote" placeholder="Message to customer (optional)" className={inputCls} />
          </FormDialog>
        </Modal>
      )}

      {dialog === "cancel" && (
        <Modal title="Cancel order" onClose={close}>
          <FormDialog danger onSubmit={(fd) => act(() => adminOrdersApi.cancel(o._id, String(fd.get("reason"))), "Order cancelled")}>
            <p className="text-sm text-slate-600">Stock and coupon usage are restored automatically.</p>
            <input name="reason" required minLength={3} placeholder="Reason" className={inputCls} />
          </FormDialog>
        </Modal>
      )}

      {(dialog === "billing" || dialog === "shipping") && (
        <Modal title={dialog === "billing" ? "Billing address" : "Shipping"} onClose={close} wide>
          <AddressDialog
            kind={dialog}
            address={dialog === "billing" ? o.billingAddress : o.shippingAddress}
            method={o.shippingMethod.code}
            customerNote={o.customerNote}
            onSave={(payload) =>
              act(
                () =>
                  dialog === "billing"
                    ? adminOrdersApi.updateInfo(o._id, payload as { billingAddress: Address; customerNote?: string | null })
                    : adminOrdersApi.updateShipping(o._id, payload as { shippingAddress: Address; shippingMethod: ShippingMethodCode }),
                "Order updated"
              )
            }
          />
        </Modal>
      )}

      {dialog === "courier" && (
        <Modal title="Assign courier" onClose={close}>
          <FormDialog
            onSubmit={(fd) =>
              act(
                () =>
                  adminOrdersApi.assignCourier(o._id, {
                    provider: fd.get("provider") as CourierProvider,
                    ...opts(fd, ["courierName", "trackingNumber", "trackingUrl", "consignmentId", "note"]),
                    createConsignment: fd.get("createConsignment") === "on",
                  }),
                "Courier assigned"
              )
            }
          >
            <select name="provider" defaultValue={shipment?.provider ?? "steadfast"} className={inputCls}>
              {COURIER_PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {humanize(p)}
                </option>
              ))}
            </select>
            <input name="courierName" defaultValue={shipment?.courierName} placeholder="Courier name (e.g. Steadfast Courier)" className={inputCls} />
            <input name="consignmentId" placeholder="Consignment ID" className={inputCls} />
            <input name="trackingNumber" placeholder="Tracking number" className={inputCls} />
            <input name="trackingUrl" type="url" placeholder="Tracking URL" className={inputCls} />
            <input name="note" placeholder="Note (optional)" className={inputCls} />
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" name="createConsignment" className="accent-brand" /> Create consignment via Steadfast API
            </label>
          </FormDialog>
        </Modal>
      )}

      {dialog === "tracking" && (
        <Modal title="Tracking" onClose={close}>
          <FormDialog
            onSubmit={(fd) =>
              act(
                () =>
                  adminOrdersApi.setTracking(o._id, {
                    trackingNumber: String(fd.get("trackingNumber")),
                    ...opts(fd, ["trackingUrl"]),
                  }),
                "Tracking updated"
              )
            }
          >
            <input name="trackingNumber" required defaultValue={shipment?.trackingNumber} placeholder="Tracking number" className={inputCls} />
            <input name="trackingUrl" type="url" defaultValue={shipment?.trackingUrl} placeholder="Tracking URL" className={inputCls} />
          </FormDialog>
        </Modal>
      )}

      {dialog === "event" && (
        <Modal title="Shipment event" onClose={close}>
          <FormDialog
            onSubmit={(fd) =>
              act(
                () =>
                  adminOrdersApi.addShipmentEvent(o._id, {
                    status: fd.get("status") as ShipmentStatus,
                    ...opts(fd, ["description", "location"]),
                    syncOrderStatus: fd.get("syncOrderStatus") === "on",
                  }),
                "Shipment updated"
              )
            }
          >
            <select name="status" className={inputCls} defaultValue="in_transit">
              {SHIPMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {humanize(s)}
                </option>
              ))}
            </select>
            <input name="location" placeholder="Location (e.g. Dhanmondi hub)" className={inputCls} />
            <input name="description" placeholder="Description" className={inputCls} />
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" name="syncOrderStatus" defaultChecked className="accent-brand" /> Move the order status along (e.g. delivered)
            </label>
          </FormDialog>
        </Modal>
      )}

      {dialog === "refund" && (
        <Modal title="Create refund" onClose={close}>
          <FormDialog
            onSubmit={(fd) =>
              act(
                () =>
                  adminRefundsApi.create({
                    orderId: o._id,
                    method: fd.get("method") as RefundMethod,
                    reason: String(fd.get("reason")),
                    ...(fd.get("returnId") ? { returnId: String(fd.get("returnId")) } : {}),
                    ...(fd.get("amount") ? { amount: Number(fd.get("amount")) } : {}),
                    ...opts(fd, ["transactionRef"]),
                    markCompleted: fd.get("markCompleted") === "on",
                  }),
                "Refund created"
              )
            }
          >
            <select name="returnId" className={inputCls} defaultValue="">
              <option value="">Not linked to a return</option>
              {returns.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.returnNumber} · {formatPriceBDT(r.refundAmount)}
                </option>
              ))}
            </select>
            <input name="amount" type="number" min={0} step="any" placeholder={`Amount (default: return amount / up to ${formatPriceBDT(o.grandTotal)})`} className={inputCls} />
            <select name="method" className={inputCls}>
              {REFUND_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <input name="reason" required minLength={3} placeholder="Reason" className={inputCls} />
            <input name="transactionRef" placeholder="Transaction reference (optional)" className={inputCls} />
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" name="markCompleted" className="accent-brand" /> Already paid out — mark completed
            </label>
          </FormDialog>
        </Modal>
      )}
    </div>
  );
}

function opts(fd: FormData, keys: string[]) {
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = String(fd.get(k) ?? "").trim();
    if (v) out[k] = v;
  }
  return out;
}

function FormDialog({
  children,
  onSubmit,
  danger,
}: {
  children: React.ReactNode;
  onSubmit: (fd: FormData) => Promise<unknown>;
  danger?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        await onSubmit(new FormData(e.currentTarget));
        setBusy(false);
      }}
      className="space-y-3"
    >
      {children}
      <div className="flex justify-end pt-2">
        <button disabled={busy} className={danger ? btn.danger : btn.brand}>
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

const ADDRESS_FIELDS: { key: keyof Address; label: string; required?: boolean }[] = [
  { key: "fullName", label: "Full name", required: true },
  { key: "phone", label: "Phone", required: true },
  { key: "email", label: "Email" },
  { key: "addressLine1", label: "Address line 1", required: true },
  { key: "addressLine2", label: "Address line 2" },
  { key: "area", label: "Area" },
  { key: "city", label: "City", required: true },
  { key: "district", label: "District" },
  { key: "postalCode", label: "Postal code" },
];

function AddressDialog({
  kind,
  address,
  method,
  customerNote,
  onSave,
}: {
  kind: "billing" | "shipping";
  address: Address;
  method: ShippingMethodCode;
  customerNote?: string;
  onSave: (payload: object) => Promise<unknown>;
}) {
  const shipping = useShippingMethods();
  return (
    <FormDialog
      onSubmit={(fd) => {
        const a: Address = { fullName: "", phone: "", addressLine1: "", city: "" };
        for (const f of ADDRESS_FIELDS) {
          const v = String(fd.get(f.key) ?? "").trim();
          if (v) (a as unknown as Record<string, string>)[f.key] = v;
        }
        a.country = address.country ?? "Bangladesh";
        return onSave(
          kind === "billing"
            ? { billingAddress: a, customerNote: String(fd.get("customerNote") ?? "").trim() || null }
            : { shippingAddress: a, shippingMethod: fd.get("shippingMethod") as ShippingMethodCode }
        );
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {ADDRESS_FIELDS.map((f) => (
          <label key={f.key} className="text-xs font-bold text-slate-600">
            {f.label}
            <input name={f.key} required={f.required} defaultValue={(address?.[f.key] as string) ?? ""} className={`mt-1 ${inputCls}`} />
          </label>
        ))}
      </div>
      {kind === "shipping" ? (
        <label className="block text-xs font-bold text-slate-600">
          Shipping method
          <select name="shippingMethod" defaultValue={method} className={`mt-1 ${inputCls}`}>
            {(shipping?.methods ?? []).map((m) => (
              <option key={m.code} value={m.code}>
                {m.name} — {formatPriceBDT(m.charge)}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <label className="block text-xs font-bold text-slate-600">
          Customer note
          <input name="customerNote" defaultValue={customerNote ?? ""} className={`mt-1 ${inputCls}`} />
        </label>
      )}
    </FormDialog>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-black text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
