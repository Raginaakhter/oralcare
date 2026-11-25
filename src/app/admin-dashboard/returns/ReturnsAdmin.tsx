"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  adminRefundsApi,
  adminReturnsApi,
  REFUND_METHODS,
  REFUND_STATUS_TRANSITIONS,
  RETURN_STATUS_TRANSITIONS,
  type RefundMethod,
  type RefundStatus,
} from "@/lib/api";
import { formatDateTime, formatPriceBDT, humanize } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import { Pill, REFUND_STATUS_TONE, RETURN_STATUS_TONE } from "@/components/orders";
import { SmartImage } from "@/components/SmartImage";
import { AdminHeader } from "../AdminHeader";
import { EmptyRow, Loader, Modal, Pagination, btn, inputCls, useAdminAction } from "../AdminShell";

const RETURN_FILTERS = ["", "requested", "approved", "received", "completed", "rejected", "cancelled"];
const REFUND_FILTERS = ["", "pending", "processing", "completed", "failed", "rejected"];

function refId(v: unknown): string | undefined {
  if (!v) return undefined;
  return typeof v === "string" ? v : (v as { _id: string })._id;
}

export function ReturnsAdmin() {
  const sp = useSearchParams();
  const { can } = useAuth();
  const isAdmin = can("refunds:manage");
  const [tab, setTab] = useState<"returns" | "refunds">(sp.get("tab") === "refunds" ? "refunds" : "returns");
  const [openReturn, setOpenReturn] = useState<string | null>(sp.get("open"));
  const [openRefund, setOpenRefund] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Returns & Refunds" }]}
        title="Returns & Refunds"
        description="Review customer return requests and pay out refunds."
      />
      <div className="mb-4 flex gap-2">
        <button onClick={() => setTab("returns")} className={tab === "returns" ? btn.primary : btn.secondary}>
          Returns
        </button>
        {isAdmin && (
          <button onClick={() => setTab("refunds")} className={tab === "refunds" ? btn.primary : btn.secondary}>
            Refunds
          </button>
        )}
      </div>

      {tab === "returns" ? <ReturnsTable onOpen={setOpenReturn} /> : <RefundsTable onOpen={setOpenRefund} />}

      {openReturn && <ReturnDialog id={openReturn} onClose={() => setOpenReturn(null)} />}
      {openRefund && <RefundDialog id={openRefund} onClose={() => setOpenRefund(null)} />}
    </div>
  );
}

function ReturnsTable({ onOpen }: { onOpen: (id: string) => void }) {
  const [status, setStatus] = useState("requested");
  const [refundRequested, setRefundRequested] = useState(false);
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState("");
  const [page, setPage] = useState(1);
  const list = useAsync(
    () =>
      adminReturnsApi.list({
        status: status || undefined,
        search: applied || undefined,
        refundRequested: refundRequested || undefined,
        page,
        limit: 20,
      }),
    [status, applied, refundRequested, page]
  );

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setApplied(search.trim());
          setPage(1);
        }}
        className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200/70"
      >
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className={`${inputCls} w-auto`}
        >
          {RETURN_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s ? humanize(s) : "All statuses"}
            </option>
          ))}
        </select>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Return or order number" className={`${inputCls} max-w-xs`} />
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <input type="checkbox" checked={refundRequested} onChange={(e) => setRefundRequested(e.target.checked)} className="accent-brand" />
          Refund requested
        </label>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Return</th>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Refund</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(list.data?.items ?? []).map((r) => (
                  <tr key={r._id} onClick={() => onOpen(r._id)} className="cursor-pointer hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <div className="font-mono font-bold text-slate-900">{r.returnNumber}</div>
                      <div className="text-[11px] text-slate-500">{formatDateTime(r.createdAt)}</div>
                    </td>
                    <td className="px-6 py-3 font-mono text-slate-700">{r.orderNumber}</td>
                    <td className="px-6 py-3 text-slate-700">
                      {typeof r.customer === "object" ? r.customer.fullName : "—"}
                    </td>
                    <td className="px-6 py-3 text-slate-700">{humanize(r.reason)}</td>
                    <td className="px-6 py-3">
                      <div className="font-bold text-slate-900">{formatPriceBDT(r.refundAmount)}</div>
                      {r.refundRequested && <div className="text-[10px] font-bold text-amber-700">Refund requested</div>}
                    </td>
                    <td className="px-6 py-3">
                      <Pill tone={RETURN_STATUS_TONE[r.status]}>{humanize(r.status)}</Pill>
                    </td>
                  </tr>
                ))}
                {!list.data?.items.length && <EmptyRow colSpan={6}>No returns match.</EmptyRow>}
              </tbody>
            </table>
          </div>
        )}
        {list.data && list.data.totalPages > 1 && (
          <Pagination page={list.data.page} totalPages={list.data.totalPages} total={list.data.total} onChange={setPage} />
        )}
      </div>
    </>
  );
}

function ReturnDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const run = useAdminAction();
  const { can } = useAuth();
  const isAdmin = can("refunds:manage");
  const ret = useAsync(() => adminReturnsApi.get(id), [id]);
  const [note, setNote] = useState("");
  const [restock, setRestock] = useState(true);
  const [busy, setBusy] = useState(false);
  const [refunding, setRefunding] = useState(false);

  const r = ret.data;
  const update = async (status: "approved" | "rejected" | "received" | "completed") => {
    if (!r) return;
    setBusy(true);
    const res = await run(
      () =>
        adminReturnsApi.updateStatus(r._id, {
          status,
          ...(note.trim() ? { note: note.trim() } : {}),
          ...(status === "received" ? { restock } : {}),
        }),
      (x) => x.message ?? "Return updated"
    );
    setBusy(false);
    if (res) {
      setNote("");
      void ret.reload();
    }
  };

  return (
    <Modal title={r ? `Return ${r.returnNumber}` : "Return"} onClose={onClose} wide>
      {ret.loading ? (
        <Loader />
      ) : !r ? (
        <p className="text-sm text-rose-700">{ret.error}</p>
      ) : (
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={RETURN_STATUS_TONE[r.status]}>{humanize(r.status)}</Pill>
            {r.restocked && <Pill tone="green">Restocked</Pill>}
            <Link href={`/admin-dashboard/orders/${refId(r.order)}`} className="text-xs font-bold text-brand-dark hover:underline">
              Order {r.orderNumber} →
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 rounded-xl bg-slate-50 px-3">
            {r.items.map((it) => (
              <li key={it.orderItemId} className="flex justify-between py-2">
                <span>
                  {it.quantity} × {it.productName}
                </span>
                <span className="font-bold">{formatPriceBDT(it.refundAmount)}</span>
              </li>
            ))}
          </ul>
          <div>
            <strong>{humanize(r.reason)}</strong>
            {r.description && <> — {r.description}</>}
          </div>
          {r.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {r.images.map((src) => (
                <a key={src} href={src.startsWith("/") ? undefined : src} className="relative h-20 w-20 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                  <SmartImage src={src} alt="Return photo" fill sizes="80px" className="object-cover" />
                </a>
              ))}
            </div>
          )}
          {r.refundPreference && (
            <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
              Customer wants refund via <strong>{humanize(r.refundPreference.method)}</strong>
              {r.refundPreference.accountDetails && <> — {r.refundPreference.accountDetails}</>}
              {r.refundPreference.note && <> · {r.refundPreference.note}</>}
            </div>
          )}
          {r.adminNote && <div className="text-xs text-slate-600">Admin note: {r.adminNote}</div>}

          <ol className="space-y-1 text-xs text-slate-500">
            {r.history.map((h, i) => (
              <li key={i}>
                {formatDateTime(h.at)} · {humanize(h.status)} by {h.role}
                {h.note ? ` — ${h.note}` : ""}
              </li>
            ))}
          </ol>

          {RETURN_STATUS_TRANSITIONS[r.status].length > 0 && (
            <div className="space-y-2 rounded-xl border border-slate-200 p-3">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className={inputCls} />
              {RETURN_STATUS_TRANSITIONS[r.status].includes("received") && (
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <input type="checkbox" checked={restock} onChange={(e) => setRestock(e.target.checked)} className="accent-brand" />
                  Put items back into sellable stock on receipt
                </label>
              )}
              <div className="flex flex-wrap gap-2">
                {RETURN_STATUS_TRANSITIONS[r.status].map((s) => (
                  <button
                    key={s}
                    disabled={busy}
                    onClick={() => update(s as "approved" | "rejected" | "received" | "completed")}
                    className={s === "rejected" ? btn.danger : btn.brand}
                  >
                    {s === "approved" ? "Approve" : s === "rejected" ? "Reject" : s === "received" ? "Mark received" : "Complete"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isAdmin && ["approved", "received", "completed"].includes(r.status) && (
            <div className="rounded-xl border border-slate-200 p-3">
              {refunding ? (
                <RefundForm
                  orderId={refId(r.order)!}
                  returnId={r._id}
                  defaultMethod={r.refundPreference?.method}
                  amount={r.refundAmount}
                  onDone={() => {
                    setRefunding(false);
                    void ret.reload();
                  }}
                />
              ) : (
                <button onClick={() => setRefunding(true)} className={btn.secondary}>
                  Create refund for this return
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function RefundForm({
  orderId,
  returnId,
  defaultMethod,
  amount,
  onDone,
}: {
  orderId: string;
  returnId: string;
  defaultMethod?: RefundMethod;
  amount: number;
  onDone: () => void;
}) {
  const run = useAdminAction();
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setBusy(true);
        const r = await run(
          () =>
            adminRefundsApi.create({
              orderId,
              returnId,
              method: fd.get("method") as RefundMethod,
              reason: String(fd.get("reason")),
              ...(fd.get("amount") ? { amount: Number(fd.get("amount")) } : {}),
              ...(String(fd.get("transactionRef") ?? "").trim() ? { transactionRef: String(fd.get("transactionRef")).trim() } : {}),
              markCompleted: fd.get("markCompleted") === "on",
            }),
          (x) => `Refund ${x.data.refundNumber} created`
        );
        setBusy(false);
        if (r) onDone();
      }}
      className="grid gap-2 sm:grid-cols-2"
    >
      <input name="amount" type="number" min={0} step="any" defaultValue={amount} className={inputCls} aria-label="Amount" />
      <select name="method" defaultValue={defaultMethod ?? "bkash"} className={inputCls}>
        {REFUND_METHODS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <input name="reason" required minLength={3} placeholder="Reason" className={`${inputCls} sm:col-span-2`} />
      <input name="transactionRef" placeholder="Transaction ref (optional)" className={inputCls} />
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
        <input type="checkbox" name="markCompleted" className="accent-brand" /> Already paid
      </label>
      <button disabled={busy} className={`${btn.brand} sm:col-span-2 justify-center`}>
        {busy ? "Creating…" : "Create refund"}
      </button>
    </form>
  );
}

function RefundsTable({ onOpen }: { onOpen: (id: string) => void }) {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const list = useAsync(() => adminRefundsApi.list({ status: status || undefined, page, limit: 20 }), [status, page]);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {REFUND_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${
              status === s ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {s ? humanize(s) : "All"}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Refund</th>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(list.data?.items ?? []).map((r) => (
                  <tr key={r._id} onClick={() => onOpen(r._id)} className="cursor-pointer hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <div className="font-mono font-bold text-slate-900">{r.refundNumber}</div>
                      <div className="text-[11px] text-slate-500">{formatDateTime(r.createdAt)}</div>
                    </td>
                    <td className="px-6 py-3 font-mono text-slate-700">
                      {typeof r.order === "object" && r.order ? r.order.orderNumber : "—"}
                    </td>
                    <td className="px-6 py-3 text-slate-700">{typeof r.customer === "object" ? r.customer.fullName : "—"}</td>
                    <td className="px-6 py-3 text-slate-700">{humanize(r.method)}</td>
                    <td className="px-6 py-3 font-bold text-slate-900">{formatPriceBDT(r.amount)}</td>
                    <td className="px-6 py-3">
                      <Pill tone={REFUND_STATUS_TONE[r.status]}>{humanize(r.status)}</Pill>
                    </td>
                  </tr>
                ))}
                {!list.data?.items.length && <EmptyRow colSpan={6}>No refunds.</EmptyRow>}
              </tbody>
            </table>
          </div>
        )}
        {list.data && list.data.totalPages > 1 && (
          <Pagination page={list.data.page} totalPages={list.data.totalPages} total={list.data.total} onChange={setPage} />
        )}
      </div>
    </>
  );
}

function RefundDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const run = useAdminAction();
  const refund = useAsync(() => adminRefundsApi.get(id), [id]);
  const [txRef, setTxRef] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const r = refund.data;

  const update = async (status: Exclude<RefundStatus, "pending">) => {
    if (!r) return;
    setBusy(true);
    const res = await run(
      () =>
        adminRefundsApi.updateStatus(r._id, {
          status,
          ...(txRef.trim() ? { transactionRef: txRef.trim() } : {}),
          ...(note.trim() ? { note: note.trim() } : {}),
        }),
      (x) => x.message ?? "Refund updated"
    );
    setBusy(false);
    if (res) void refund.reload();
  };

  return (
    <Modal title={r ? `Refund ${r.refundNumber}` : "Refund"} onClose={onClose}>
      {refund.loading ? (
        <Loader />
      ) : !r ? (
        <p className="text-sm text-rose-700">{refund.error}</p>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Pill tone={REFUND_STATUS_TONE[r.status]}>{humanize(r.status)}</Pill>
            <span className="font-black">{formatPriceBDT(r.amount)}</span>
            <span className="text-slate-500">via {humanize(r.method)}</span>
          </div>
          {typeof r.order === "object" && r.order && (
            <Link href={`/admin-dashboard/orders/${r.order._id}`} className="block text-xs font-bold text-brand-dark hover:underline">
              Order {r.order.orderNumber} · {formatPriceBDT(r.order.grandTotal)} · {humanize(r.order.paymentStatus)} →
            </Link>
          )}
          {typeof r.orderReturn === "object" && r.orderReturn && (
            <div className="text-xs text-slate-600">
              Return {r.orderReturn.returnNumber} · {humanize(r.orderReturn.status)}
            </div>
          )}
          <div className="text-slate-700">Reason: {r.reason}</div>
          {r.transactionRef && <div className="text-xs text-slate-600">Ref: {r.transactionRef}</div>}
          <ol className="space-y-1 text-xs text-slate-500">
            {r.history.map((h, i) => (
              <li key={i}>
                {formatDateTime(h.at)} · {humanize(h.status)} ({h.role}){h.note ? ` — ${h.note}` : ""}
              </li>
            ))}
          </ol>
          {REFUND_STATUS_TRANSITIONS[r.status].length > 0 && (
            <div className="space-y-2 rounded-xl border border-slate-200 p-3">
              <input value={txRef} onChange={(e) => setTxRef(e.target.value)} placeholder="Transaction reference" className={inputCls} />
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" className={inputCls} />
              <div className="flex flex-wrap gap-2">
                {REFUND_STATUS_TRANSITIONS[r.status].map((s) => (
                  <button
                    key={s}
                    disabled={busy}
                    onClick={() => update(s as Exclude<RefundStatus, "pending">)}
                    className={s === "failed" || s === "rejected" ? btn.danger : btn.brand}
                  >
                    {humanize(s)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
