"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { errorMessage, ordersApi, paymentsApi, type Order } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { LAST_ORDER_KEY } from "@/lib/storage-keys";
import {
  AddressBlock,
  ErrorBox,
  OrderItemsList,
  OrderStatusBadge,
  OrderTotals,
  PaymentStatusBadge,
  Spinner,
} from "@/components/orders";
import { ArrowRightIcon, TruckIcon, MailIcon } from "@/components/icons";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { status } = useAuth();
  const { showToast } = useStore();
  const paymentFailed = params.get("payment") === "failed";

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "guest") {
      router.replace("/signin?next=/my-orders");
      return;
    }
    let id = params.get("id");
    if (!id) {
      try {
        id = sessionStorage.getItem(LAST_ORDER_KEY);
      } catch {
        id = null;
      }
    }
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- id may only exist in sessionStorage
      setError("We couldn't find that order.");
      return;
    }
    ordersApi
      .get(id)
      .then(setOrder)
      .catch((err) => setError(errorMessage(err, "Order not found")));
  }, [status, params, router]);

  // After returning from the gateway the callback may land a moment later — poll the status briefly.
  useEffect(() => {
    if (!order || order.paymentMethod !== "online" || order.paymentStatus !== "pending") return;
    let tries = 0;
    const id = setInterval(async () => {
      tries += 1;
      try {
        const s = await paymentsApi.status(order._id);
        if (s.paymentStatus !== "pending" || tries >= 10) {
          clearInterval(id);
          setOrder((o) => (o ? { ...o, paymentStatus: s.paymentStatus } : o));
        }
      } catch {
        clearInterval(id);
      }
    }, 3000);
    return () => clearInterval(id);
  }, [order]);

  const retryPayment = async () => {
    if (!order) return;
    setRetrying(true);
    try {
      const pay = await paymentsApi.initialize(order._id);
      if (pay.data.provider === "mock") {
        router.push(`/payment/mock?tx=${encodeURIComponent(pay.data.transactionId)}&order=${order._id}`);
      } else {
        window.location.href = pay.data.redirectUrl;
      }
    } catch (err) {
      showToast(errorMessage(err, "Could not start payment"), "error");
      setRetrying(false);
    }
  };

  if (error) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-16">
        <ErrorBox message={error} />
        <Link href="/my-orders" className="mt-4 inline-flex rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white">
          Go to My Orders
        </Link>
      </main>
    );
  }
  if (!order) return <Spinner label="Loading your order…" />;

  const needsPayment =
    order.paymentMethod === "online" && ["unpaid", "pending", "failed"].includes(order.paymentStatus) && order.status === "pending";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft p-8 text-center ring-1 ring-brand/20 sm:p-12 shadow-sm">
        <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 animate-blob rounded-full bg-brand/15 blur-3xl" />
        <div className="relative">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl ${
              paymentFailed ? "bg-amber-500 shadow-amber-500/40" : "bg-brand shadow-brand/40"
            }`}
          >
            {paymentFailed ? (
              <span className="text-4xl font-black">!</span>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-10 w-10">
                <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-900 sm:text-4xl">
            {paymentFailed ? "Payment Not Completed" : "Order Placed!"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
            {paymentFailed ? (
              <>Your order is saved but unpaid. You can retry the payment below.</>
            ) : (
              <>
                Thank you, <strong>{order.customerName}</strong>! We&apos;ve received your order and will confirm it shortly.
              </>
            )}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 shadow-sm ring-1 ring-slate-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Order</span>
            <span className="font-mono text-sm font-black text-slate-900">#{order.orderNumber}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {needsPayment && (
              <button
                onClick={retryPayment}
                disabled={retrying}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-amber-600 disabled:opacity-60"
              >
                {retrying ? "Starting payment…" : "Pay Now"}
              </button>
            )}
            <Link
              href={`/my-orders/${order._id}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              View Order Details
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href={`/track-order?order=${order.orderNumber}`}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark"
            >
              Track Order
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
          <h2 className="mb-4 text-base font-black text-slate-900">Items</h2>
          <OrderItemsList items={order.items} />
          <div className="mt-5 border-t border-slate-100 pt-4">
            <OrderTotals order={order} />
          </div>
        </section>

        <section className="space-y-5 rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
          <AddressBlock title="Delivering to" address={order.shippingAddress} />
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Delivery</div>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
              <TruckIcon className="h-4 w-4 text-brand" />
              {order.shippingMethod.name} · {order.shippingMethod.estimatedDays.min}-{order.shippingMethod.estimatedDays.max} days
            </div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Payment</div>
            <div className="mt-1 text-sm text-slate-700">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online payment"}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Placed</div>
            <div className="mt-1 text-sm text-slate-700">{formatDateTime(order.placedAt)}</div>
          </div>
          {order.customerEmail && (
            <div className="flex items-start gap-2 rounded-2xl bg-brand-soft p-3 text-xs text-slate-700">
              <MailIcon className="mt-0.5 h-4 w-4 text-brand-dark" />
              Updates will be sent to <strong>{order.customerEmail}</strong>.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
