"use client";

import { use, useState } from "react";
import Link from "next/link";
import { adminOrdersApi, customersApi } from "@/lib/api";
import { formatDate, formatPriceBDT, initials } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import { AddressBlock, OrderStatusBadge, PaymentStatusBadge } from "@/components/orders";
import { AdminHeader, StatusPill } from "../../AdminHeader";
import { EmptyRow, Loader, Pagination } from "../../AdminShell";

export function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { can } = useAuth();
  const canOrders = can("orders:read");
  const [page, setPage] = useState(1);
  const customer = useAsync(() => customersApi.get(id), [id]);
  const orders = useAsync(
    () => (canOrders ? adminOrdersApi.list({ customer: id, page, limit: 20, sort: "newest" }) : Promise.resolve(null)),
    [id, page, canOrders]
  );

  if (customer.loading) return <Loader />;
  const c = customer.data;
  if (!c) return <p className="text-sm font-semibold text-rose-700">{customer.error ?? "Customer not found"}</p>;
  const items = orders.data?.items ?? [];
  const spent = items.filter((o) => !["cancelled", "failed"].includes(o.status)).reduce((s, o) => s + o.grandTotal, 0);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Customers", href: "/admin-dashboard/customers" },
          { label: c.fullName },
        ]}
        title={c.fullName}
        description={c.email}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
        <section className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-xl font-black text-brand-dark">{initials(c.fullName)}</span>
          <div className="flex flex-wrap gap-2">
            <StatusPill tone={c.isEmailVerified ? "success" : "warning"}>{c.isEmailVerified ? "Email verified" : "Email not verified"}</StatusPill>
            <StatusPill tone="neutral">{c.roleName}</StatusPill>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[10px] font-black uppercase text-slate-400">Joined</dt>
              <dd className="font-semibold">{formatDate(c.createdAt)}</dd>
            </div>
            {canOrders && (
              <>
                <div>
                  <dt className="text-[10px] font-black uppercase text-slate-400">Orders</dt>
                  <dd className="font-black">{orders.data?.total ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-black uppercase text-slate-400">Spent (this page)</dt>
                  <dd className="font-black">{formatPriceBDT(spent)}</dd>
                </div>
              </>
            )}
          </dl>
          {items[0] && <AddressBlock title="Latest shipping address" address={items[0].shippingAddress} />}
        </section>

        {canOrders && (
          <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
            <h2 className="px-6 pt-5 text-base font-black text-slate-900">Orders</h2>
            {orders.loading ? (
              <Loader />
            ) : (
              <table className="mt-3 w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {items.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <Link href={`/admin-dashboard/orders/${o._id}`} className="font-mono font-bold text-slate-900 hover:text-brand-dark">
                          {o.orderNumber}
                        </Link>
                        <div className="text-[11px] text-slate-500">{formatDate(o.placedAt)}</div>
                      </td>
                      <td className="px-6 py-3">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-6 py-3">
                        <PaymentStatusBadge status={o.paymentStatus} />
                      </td>
                      <td className="px-6 py-3 text-right font-bold">{formatPriceBDT(o.grandTotal)}</td>
                    </tr>
                  ))}
                  {!items.length && <EmptyRow colSpan={4}>No orders yet.</EmptyRow>}
                </tbody>
              </table>
            )}
            {orders.data && orders.data.totalPages > 1 && (
              <Pagination page={orders.data.page} totalPages={orders.data.totalPages} total={orders.data.total} onChange={setPage} />
            )}
          </section>
        )}
      </div>
    </div>
  );
}
