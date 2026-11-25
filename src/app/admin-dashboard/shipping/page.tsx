"use client";

import { useState } from "react";
import { shippingApi, type ShippingMethodCode } from "@/lib/api";
import { formatPriceBDT } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { AdminHeader } from "../AdminHeader";
import { Loader } from "../AdminShell";

export default function ShippingPage() {
  const methods = useAsync(() => shippingApi.methods(), []);
  const [selected, setSelected] = useState<ShippingMethodCode | null>(null);
  const m = methods.data;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Shipping" }]}
        title="Shipping"
        description="Delivery methods offered at checkout (GET /shipping/methods)."
      />
      {methods.loading ? (
        <Loader />
      ) : methods.error ? (
        <p className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{methods.error}</p>
      ) : m ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {m.methods.map((x) => (
              <button
                key={x.code}
                onClick={() => setSelected(x.code)}
                className={`rounded-2xl bg-white p-5 text-left ring-1 transition ${selected === x.code ? "ring-brand" : "ring-slate-200/70"}`}
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{x.code}</div>
                <div className="mt-1 text-lg font-black text-slate-900">{x.name}</div>
                <div className="mt-1 text-2xl font-black text-brand-dark">{formatPriceBDT(x.charge)}</div>
                <div className="mt-2 text-xs text-slate-600">{x.description}</div>
                <div className="mt-2 text-xs text-slate-500">
                  {x.estimatedDays.min}–{x.estimatedDays.max} days · COD {x.codAvailable ? "available" : "not available"}
                </div>
              </button>
            ))}
          </div>
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-700 ring-1 ring-slate-200/70">
            <div>
              Free-shipping threshold:{" "}
              <strong>{m.freeShippingThreshold ? formatPriceBDT(m.freeShippingThreshold) : "disabled"}</strong> · Currency{" "}
              <strong>{m.currency}</strong>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Charges and the free-shipping threshold are configured on the backend (SHIPPING_INSIDE_DHAKA_CHARGE,
              SHIPPING_OUTSIDE_DHAKA_CHARGE, SHIPPING_EXPRESS_CHARGE, FREE_SHIPPING_THRESHOLD). The API does not expose an
              endpoint for editing them, so changes are made in the server environment.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
