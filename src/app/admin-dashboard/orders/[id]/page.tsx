import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader, StatusPill } from "../../AdminHeader";
import { products } from "@/lib/products";

type OrderStatus = "paid" | "processing" | "shipped" | "pending" | "cancelled" | "delivered";

const orders: {
  id: string;
  customer: string;
  email: string;
  phone: string;
  product: (typeof products)[number];
  qty: number;
  amount: string;
  shipping: string;
  discount: string;
  total: string;
  status: OrderStatus;
  payment: "bKash" | "Nagad" | "Card" | "COD";
  paymentRef?: string;
  address: string;
  date: string;
  note?: string;
}[] = [
  { id: "ORD-10284", customer: "Afsana Rahman", email: "afsana@example.com", phone: "01712 345678", product: products[0], qty: 1, amount: "৳5,499", shipping: "Free", discount: "৳0", total: "৳5,499", status: "paid", payment: "bKash", paymentRef: "TRX7X8C9D0", address: "House 24, Road 7, Dhanmondi, Dhaka 1205", date: "Nov 10, 10:24", note: "Please deliver before 6 PM." },
  { id: "ORD-10283", customer: "Tanvir Islam", email: "tanvir@example.com", phone: "01813 456789", product: products[10], qty: 2, amount: "৳4,798", shipping: "Free", discount: "৳200", total: "৳4,598", status: "processing", payment: "Card", paymentRef: "VISA-****4201", address: "Flat 5B, Agrabad, Chattogram 4100", date: "Nov 10, 09:48" },
  { id: "ORD-10282", customer: "Nusrat Jahan", email: "nusrat@example.com", phone: "01914 567890", product: products[2], qty: 1, amount: "৳1,149", shipping: "৳120", discount: "৳0", total: "৳1,269", status: "shipped", payment: "COD", address: "Zindabazar, Sylhet 3100", date: "Nov 09, 18:11" },
  { id: "ORD-10281", customer: "Rafiq Ahmed", email: "rafiq@example.com", phone: "01515 678901", product: products[8], qty: 1, amount: "৳3,499", shipping: "Free", discount: "৳0", total: "৳3,499", status: "pending", payment: "Nagad", paymentRef: "NGD-4821093", address: "Boyra, Khulna 9000", date: "Nov 09, 14:02" },
  { id: "ORD-10280", customer: "Sabrina Akter", email: "sabrina@example.com", phone: "01616 789012", product: products[13], qty: 1, amount: "৳1,099", shipping: "৳120", discount: "৳0", total: "৳1,219", status: "cancelled", payment: "COD", address: "Shaheb Bazar, Rajshahi 6100", date: "Nov 09, 11:34", note: "Customer cancelled — duplicate order." },
  { id: "ORD-10279", customer: "Mehedi Hasan", email: "mehedi@example.com", phone: "01717 890123", product: products[4], qty: 1, amount: "৳749", shipping: "৳120", discount: "৳0", total: "৳869", status: "delivered", payment: "bKash", paymentRef: "TRX8K2M1N0", address: "Sector 7, Uttara, Dhaka 1230", date: "Nov 08, 21:17" },
  { id: "ORD-10278", customer: "Priya Sultana", email: "priya@example.com", phone: "01818 901234", product: products[11], qty: 1, amount: "৳2,249", shipping: "Free", discount: "৳0", total: "৳2,249", status: "delivered", payment: "Card", paymentRef: "VISA-****9823", address: "Band Road, Barishal 8200", date: "Nov 08, 15:52" },
  { id: "ORD-10277", customer: "Shahin Chowdhury", email: "shahin@example.com", phone: "01919 012345", product: products[6], qty: 1, amount: "৳699", shipping: "৳120", discount: "৳0", total: "৳819", status: "paid", payment: "bKash", paymentRef: "TRX5L3P7Q2", address: "Mirpur 10, Dhaka 1216", date: "Nov 07, 20:31" },
];

const statusTone: Record<OrderStatus, "success" | "info" | "accent" | "warning" | "danger"> = {
  paid: "success",
  processing: "info",
  shipped: "accent",
  pending: "warning",
  cancelled: "danger",
  delivered: "success",
};

export async function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: PageProps<"/admin-dashboard/orders/[id]">) {
  const { id } = await params;
  return { title: `Order #${id} — Admin — OralCareBD` };
}

export default async function OrderDetailPage({
  params,
}: PageProps<"/admin-dashboard/orders/[id]">) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);
  if (!order) notFound();

  const timeline = [
    { label: "Order placed", date: order.date, done: true },
    { label: "Payment confirmed", date: order.date, done: order.status !== "pending" && order.status !== "cancelled" },
    { label: "Processing", date: "Pending", done: ["shipped", "delivered"].includes(order.status) },
    { label: "Shipped", date: "Pending", done: ["shipped", "delivered"].includes(order.status) },
    { label: "Delivered", date: "Pending", done: order.status === "delivered" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Orders", href: "/admin-dashboard/orders" },
          { label: `#${order.id}` },
        ]}
        title={`Order #${order.id}`}
        description={`Placed by ${order.customer} · ${order.date}`}
        actions={
          <>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-brand hover:text-brand-dark">
              Print Invoice
            </button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-brand-dark">
              Update Status
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Left: items + timeline */}
        <div className="space-y-6">
          {/* Status card */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
            <div className="flex items-center gap-3">
              <StatusPill tone={statusTone[order.status]}>{order.status}</StatusPill>
              <span className="text-xs text-slate-500">Last updated · {order.date}</span>
            </div>
            <div className="flex gap-2">
              {order.status !== "cancelled" && order.status !== "delivered" && (
                <>
                  <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-rose-300 hover:text-rose-600">
                    Cancel Order
                  </button>
                  <button className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-bold text-white hover:bg-brand-dark">
                    Mark as Shipped
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-black text-slate-900">Order Items</h3>
              <span className="text-xs text-slate-500">1 item</span>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              <div className="flex items-center gap-4 py-4">
                <span className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                  <Image src={order.product.img} alt="" fill sizes="64px" className="object-contain p-2" />
                </span>
                <div className="flex-1">
                  <div className="font-bold text-slate-900">{order.product.name}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {order.product.brand} · Qty: {order.qty} × {order.product.price}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">{order.amount}</div>
                </div>
              </div>
            </div>

            {/* Totals */}
            <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="font-semibold text-slate-900">{order.amount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Shipping</dt>
                <dd className="font-semibold text-slate-900">{order.shipping}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Discount</dt>
                <dd className="font-semibold text-emerald-600">- {order.discount}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
                <dt className="font-black text-slate-900">Total</dt>
                <dd className="font-black text-brand-dark">{order.total}</dd>
              </div>
            </dl>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h3 className="text-sm font-black text-slate-900">Order Timeline</h3>
            <ol className="mt-5 space-y-5">
              {timeline.map((t, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="relative flex flex-col items-center">
                    <span
                      className={`z-10 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-white ${
                        t.done ? "bg-brand text-white" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {t.done ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3 w-3">
                          <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    {i < timeline.length - 1 && (
                      <span className={`absolute top-7 h-6 w-px ${t.done ? "bg-brand" : "bg-slate-200"}`} />
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${t.done ? "text-slate-900" : "text-slate-500"}`}>
                      {t.label}
                    </div>
                    <div className="text-xs text-slate-500">{t.date}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {order.note && (
            <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
              <div className="text-xs font-bold text-amber-800">Order Note</div>
              <p className="mt-1 text-sm text-amber-900">{order.note}</p>
            </div>
          )}
        </div>

        {/* Right: customer + shipping + payment */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h3 className="text-sm font-black text-slate-900">Customer</h3>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-sm font-black text-white">
                {order.customer.split(" ").map((n) => n[0]).join("")}
              </span>
              <div className="min-w-0">
                <div className="truncate font-bold text-slate-900">{order.customer}</div>
                <div className="truncate text-xs text-slate-500">{order.email}</div>
              </div>
            </div>
            <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Phone</dt>
                <dd className="font-semibold text-slate-900">{order.phone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Email</dt>
                <dd className="truncate font-semibold text-slate-900">{order.email}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h3 className="text-sm font-black text-slate-900">Shipping Address</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{order.address}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h3 className="text-sm font-black text-slate-900">Payment</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Method</dt>
                <dd>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                    {order.payment}
                  </span>
                </dd>
              </div>
              {order.paymentRef && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Reference</dt>
                  <dd className="font-mono text-xs font-bold text-slate-900">
                    {order.paymentRef}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-slate-500">Status</dt>
                <dd><StatusPill tone={statusTone[order.status]}>{order.status}</StatusPill></dd>
              </div>
            </dl>
          </div>

          <Link
            href="/admin-dashboard/orders"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark"
          >
            ← Back to All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
