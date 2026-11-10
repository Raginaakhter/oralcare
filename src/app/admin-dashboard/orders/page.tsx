import Image from "next/image";
import Link from "next/link";
import {
  AdminHeader,
  AdminButton,
  StatusPill,
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  EyeIcon,
} from "../AdminHeader";
import { products } from "@/lib/products";

export const metadata = { title: "Orders — Admin — OralCareBD" };

type OrderStatus = "paid" | "processing" | "shipped" | "pending" | "cancelled" | "delivered";

const orders: {
  id: string;
  customer: string;
  email: string;
  product: (typeof products)[number];
  amount: string;
  status: OrderStatus;
  payment: "bKash" | "Nagad" | "Card" | "COD";
  date: string;
}[] = [
  { id: "#ORD-10284", customer: "Afsana Rahman", email: "afsana@example.com", product: products[0], amount: "৳5,499", status: "paid", payment: "bKash", date: "Nov 10, 10:24" },
  { id: "#ORD-10283", customer: "Tanvir Islam", email: "tanvir@example.com", product: products[10], amount: "৳2,399", status: "processing", payment: "Card", date: "Nov 10, 09:48" },
  { id: "#ORD-10282", customer: "Nusrat Jahan", email: "nusrat@example.com", product: products[2], amount: "৳1,149", status: "shipped", payment: "COD", date: "Nov 09, 18:11" },
  { id: "#ORD-10281", customer: "Rafiq Ahmed", email: "rafiq@example.com", product: products[8], amount: "৳3,499", status: "pending", payment: "Nagad", date: "Nov 09, 14:02" },
  { id: "#ORD-10280", customer: "Sabrina Akter", email: "sabrina@example.com", product: products[13], amount: "৳1,099", status: "cancelled", payment: "COD", date: "Nov 09, 11:34" },
  { id: "#ORD-10279", customer: "Mehedi Hasan", email: "mehedi@example.com", product: products[4], amount: "৳749", status: "delivered", payment: "bKash", date: "Nov 08, 21:17" },
  { id: "#ORD-10278", customer: "Priya Sultana", email: "priya@example.com", product: products[11], amount: "৳2,249", status: "delivered", payment: "Card", date: "Nov 08, 15:52" },
  { id: "#ORD-10277", customer: "Shahin Chowdhury", email: "shahin@example.com", product: products[6], amount: "৳699", status: "paid", payment: "bKash", date: "Nov 07, 20:31" },
];

const statusTone: Record<OrderStatus, "success" | "info" | "accent" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  processing: "info",
  shipped: "accent",
  pending: "warning",
  cancelled: "danger",
  delivered: "success",
};

const tabs: { key: OrderStatus | "all"; label: string; count: number }[] = [
  { key: "all", label: "All Orders", count: orders.length },
  { key: "pending", label: "Pending", count: orders.filter((o) => o.status === "pending").length },
  { key: "processing", label: "Processing", count: orders.filter((o) => o.status === "processing").length },
  { key: "shipped", label: "Shipped", count: orders.filter((o) => o.status === "shipped").length },
  { key: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "delivered").length },
  { key: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length },
];

export default function OrdersPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Orders" }]}
        title="Orders"
        description={`${orders.length} total orders · 12 awaiting action.`}
        actions={<AdminButton icon={<DownloadIcon />}>Export CSV</AdminButton>}
      />

      {/* Status tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 ring-1 ring-slate-200/70">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              i === 0
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                i === 0 ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200/70">
        <div className="relative flex-1 min-w-[200px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="Search by order ID, customer, email..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-brand focus:bg-white"
          />
        </div>
        <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Today</option>
          <option>Custom range</option>
        </select>
        <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none">
          <option>All payment methods</option>
          <option>bKash</option>
          <option>Nagad</option>
          <option>Card</option>
          <option>COD</option>
        </select>
        <button className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark">
          <FilterIcon />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="w-10 px-6 py-3"><input type="checkbox" className="accent-brand" /></th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {orders.map((o) => (
                <tr key={o.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="accent-brand" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image src={o.product.img} alt="" fill sizes="40px" className="object-contain p-1" />
                      </span>
                      <div className="leading-tight">
                        <div className="font-bold text-slate-900">{o.id}</div>
                        <div className="line-clamp-1 max-w-[220px] text-xs text-slate-500">
                          {o.product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="leading-tight">
                      <div className="font-bold text-slate-900">{o.customer}</div>
                      <div className="text-xs text-slate-500">{o.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{o.amount}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      {o.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill tone={statusTone[o.status]}>{o.status}</StatusPill>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{o.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin-dashboard/orders/${o.id.replace("#", "")}`}
                      aria-label="View"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <EyeIcon />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
