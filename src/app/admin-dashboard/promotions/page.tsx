import Link from "next/link";
import {
  AdminHeader,
  StatusPill,
  PlusIcon,
  EditIcon,
} from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { promotions, statusTone } from "./data";

export const metadata = { title: "Promotions — Admin — OralCareBD" };

export default function PromotionsPage() {
  const active = promotions.filter((p) => p.status === "active").length;
  const totalUsage = promotions.reduce((s, p) => s + p.usage, 0);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Promotions" }]}
        title="Promotions & Coupons"
        description={`${active} active campaigns · ${totalUsage.toLocaleString()} total redemptions.`}
        actions={
          <Link
            href="/admin-dashboard/promotions/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            <PlusIcon />
            Create Promotion
          </Link>
        }
      />

      {/* Metrics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active Campaigns" value={active} accent="emerald" />
        <KpiCard label="Scheduled" value={promotions.filter((p) => p.status === "scheduled").length} accent="blue" />
        <KpiCard label="Total Redemptions" value={totalUsage.toLocaleString()} accent="violet" />
        <KpiCard label="Revenue Impact" value="৳1,24,800" accent="amber" />
      </div>

      {/* Featured promo */}
      <div className="mb-6 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-brand-blue/30 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              Top Performer
            </span>
            <h2 className="mt-3 text-3xl font-black">
              <span className="font-mono text-brand">FREESHIP</span>
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-300">
              Your highest-converting promotion. 482 customers redeemed this month, generating an estimated ৳52k in incremental revenue.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Used</div>
              <div className="mt-1 text-2xl font-black">482</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Impact</div>
              <div className="mt-1 text-2xl font-black text-brand">৳52k</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Conv.</div>
              <div className="mt-1 text-2xl font-black">8.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="text-sm font-black text-slate-900">All Promotions</div>
          <div className="text-xs text-slate-500">{promotions.length} total</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Discount</th>
                <th className="px-6 py-3">Usage</th>
                <th className="px-6 py-3">Period</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {promotions.map((p) => {
                const percent = p.limit > 0 ? Math.min(100, (p.usage / p.limit) * 100) : 100;
                return (
                  <tr key={p.code} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-900">
                        {p.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="leading-tight">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-brand-dark">{p.discount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {p.usage}
                          {p.limit > 0 && <span className="text-slate-400">/{p.limit}</span>}
                        </span>
                        {p.limit > 0 && (
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-brand to-brand-blue"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 leading-tight">
                      <div>{p.starts}</div>
                      <div className="text-slate-400">to {p.ends}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill tone={statusTone[p.status]}>{p.status}</StatusPill>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin-dashboard/promotions/${p.code}/edit`}
                          aria-label="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <EditIcon />
                        </Link>
                        <DeleteButton itemLabel={`${p.name} (${p.code})`} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: "emerald" | "blue" | "violet" | "amber";
}) {
  const bg = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-sky-50 text-sky-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  }[accent];
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
          <TagMiniIcon />
        </span>
      </div>
    </div>
  );
}

function TagMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M20 12.5 12.5 20a2 2 0 0 1-2.8 0L3 13.2V4h9.2L20 11.7a2 2 0 0 1 0 .8Z" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  );
}
