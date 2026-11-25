"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { useAuth } from "@/context/AuthContext";
import { useStore, formatPriceBDT } from "@/context/StoreContext";
import { errorMessage, paymentsApi, type MockCheckout } from "@/lib/api";
import { ShieldIcon } from "@/components/icons";

/**
 * Development payment gateway. The backend's mock provider returns signed
 * success/failure payloads; we hand the chosen one to POST /payments/verify,
 * exactly as a real gateway redirect would.
 */
export default function MockPaymentPage() {
  return (
    <Suspense fallback={null}>
      <MockPayment />
    </Suspense>
  );
}

function MockPayment() {
  const params = useSearchParams();
  const router = useRouter();
  const tx = params.get("tx") ?? "";
  const orderId = params.get("order") ?? "";
  const { status } = useAuth();
  const { showToast } = useStore();

  const [checkout, setCheckout] = useState<MockCheckout | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"success" | "failure" | null>(null);

  useEffect(() => {
    if (!tx) return;
    paymentsApi
      .mockCheckout(tx)
      .then(setCheckout)
      .catch((err) => setError(errorMessage(err, "Payment session not found")));
  }, [tx]);

  const complete = async (kind: "success" | "failure") => {
    if (!checkout) return;
    setBusy(kind);
    try {
      const payload = kind === "success" ? checkout.success.body : checkout.failure.body;
      const env = await paymentsApi.verify(payload as unknown as Record<string, unknown>, "mock");
      const ok = env.data.status === "paid" || env.data.outcome === "paid";
      showToast(ok ? "Payment successful!" : "Payment failed — you can retry from your order page.", ok ? "success" : "error");
      router.push(`/order-success?id=${orderId}${ok ? "" : "&payment=failed"}`);
    } catch (err) {
      showToast(errorMessage(err, "Payment verification failed"), "error");
      setBusy(null);
    }
  };

  return (
    <>
      <PageHero
        title="Secure Payment"
        subtitle="Complete your payment to confirm the order."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Payment" }]}
      />
      <main className="mx-auto w-full max-w-md px-4 py-12">
        <div className="rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-100">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
            <ShieldIcon className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-xl font-black text-slate-900">Test Payment Gateway</h2>
          <p className="mt-1 text-xs text-slate-500">
            Development mode — choose an outcome to simulate the gateway response.
          </p>

          {status === "guest" && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800">
              Please <Link href="/signin" className="underline">sign in</Link> to complete payment.
            </p>
          )}
          {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</p>}

          {checkout && (
            <>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-black text-slate-900">{formatPriceBDT(checkout.amount)}</span>
                </div>
                <div className="mt-1 flex justify-between gap-4">
                  <span className="text-slate-500">Transaction</span>
                  <span className="truncate font-mono text-xs text-slate-700">{checkout.transactionId}</span>
                </div>
              </div>
              <div className="mt-6 grid gap-2">
                <button
                  onClick={() => complete("success")}
                  disabled={!!busy || status !== "authenticated"}
                  className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-50"
                >
                  {busy === "success" ? "Processing…" : `Pay ${formatPriceBDT(checkout.amount)}`}
                </button>
                <button
                  onClick={() => complete("failure")}
                  disabled={!!busy || status !== "authenticated"}
                  className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 hover:border-rose-300 hover:text-rose-600 disabled:opacity-50"
                >
                  {busy === "failure" ? "Processing…" : "Simulate failed payment"}
                </button>
              </div>
            </>
          )}

          {orderId && (
            <Link href={`/my-orders/${orderId}`} className="mt-6 inline-block text-xs font-semibold text-slate-500 hover:text-brand-dark">
              Pay later — view order
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
