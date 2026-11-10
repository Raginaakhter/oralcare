import Link from "next/link";
import {
  AdminHeader,
  AdminButton,
  StatusPill,
  PlusIcon,
  DownloadIcon,
  SearchIcon,
  EyeIcon,
  EditIcon,
} from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { customers, statusTone } from "./data";

export const metadata = { title: "Customers — Admin — OralCareBD" };

export default function CustomersPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Customers" }]}
        title="Customers"
        description={`${customers.length} customers · ${customers.filter(c => c.status === "vip").length} VIP members.`}
        actions={
          <>
            <AdminButton icon={<DownloadIcon />}>Export</AdminButton>
            <Link
              href="/admin-dashboard/customers/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              <PlusIcon />
              Add Customer
            </Link>
          </>
        }
      />

      {/* Metrics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Customers" value={customers.length.toString()} sub="all time" />
        <MetricCard label="VIP Customers" value={customers.filter(c => c.status === "vip").length.toString()} sub="high value" />
        <MetricCard label="New This Month" value="42" sub="+18% vs last month" />
        <MetricCard label="Avg. Lifetime Value" value="৳20,480" sub="per customer" />
      </div>

      {/* Search */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200/70">
        <div className="relative flex-1 min-w-[200px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="Search by name, email, phone..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-brand focus:bg-white"
          />
        </div>
        <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none">
          <option>All Statuses</option>
          <option>VIP</option>
          <option>Active</option>
          <option>New</option>
          <option>Inactive</option>
        </select>
        <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none">
          <option>All Cities</option>
          <option>Dhaka</option>
          <option>Chattogram</option>
          <option>Sylhet</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Orders</th>
                <th className="px-6 py-3">Lifetime Spent</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {customers.map((c) => (
                <tr key={c.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${c.color} text-sm font-black text-white shadow`}
                      >
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <div className="leading-tight">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-xs text-slate-500">Joined {c.joined}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="leading-tight">
                      <div className="text-slate-700">{c.email}</div>
                      <div className="text-xs text-slate-500">{c.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{c.location}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{c.orders}</td>
                  <td className="px-6 py-4 font-black text-brand-dark">{c.spent}</td>
                  <td className="px-6 py-4">
                    <StatusPill tone={statusTone[c.status]}>{c.status}</StatusPill>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin-dashboard/customers/${c.id}`}
                        aria-label="View"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <EyeIcon />
                      </Link>
                      <Link
                        href={`/admin-dashboard/customers/${c.id}/edit`}
                        aria-label="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <EditIcon />
                      </Link>
                      <DeleteButton itemLabel={c.name} />
                    </div>
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

function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  );
}
