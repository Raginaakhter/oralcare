import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader, StatusPill, EditIcon } from "../../AdminHeader";
import { DeleteButton } from "../../DeleteButton";
import { customers, statusTone, getCustomerById } from "../data";

export async function generateStaticParams() {
  return customers.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/admin-dashboard/customers/[id]">) {
  const { id } = await params;
  const c = getCustomerById(id);
  return { title: c ? `${c.name} — Admin` : "Customer — Admin" };
}

export default async function CustomerDetailPage({
  params,
}: PageProps<"/admin-dashboard/customers/[id]">) {
  const { id } = await params;
  const c = getCustomerById(id);
  if (!c) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Customers", href: "/admin-dashboard/customers" },
          { label: c.name },
        ]}
        title={c.name}
        description={`${c.email} · Customer since ${c.joined}`}
        actions={
          <>
            <DeleteButton itemLabel={c.name} label="Delete" variant="button" />
            <Link
              href={`/admin-dashboard/customers/${c.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              <EditIcon />
              Edit Customer
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        {/* Left: profile card */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 text-center">
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${c.color}`} />
            <div className="relative mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-white p-1 shadow-xl">
              <span
                className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${c.color} text-xl font-black text-white`}
              >
                {c.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-black text-slate-900">{c.name}</h2>
            <div className="mt-1 text-xs text-slate-500">{c.email}</div>
            <div className="mt-3 flex justify-center">
              <StatusPill tone={statusTone[c.status]}>{c.status}</StatusPill>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-center">
              <div>
                <div className="text-xl font-black text-slate-900">{c.orders}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Orders
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-brand-dark">{c.spent}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Spent
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h3 className="text-sm font-black text-slate-900">Contact</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Email</dt>
                <dd className="mt-0.5 font-semibold text-slate-900">{c.email}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Phone</dt>
                <dd className="mt-0.5 font-semibold text-slate-900">{c.phone}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</dt>
                <dd className="mt-0.5 font-semibold text-slate-900">{c.location}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Address</dt>
                <dd className="mt-0.5 text-sm text-slate-700">{c.address}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right: activity + stats */}
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard label="Avg Order Value" value={`৳${Math.round(parseFloat(c.spent.replace(/[^\d.]/g, "")) / Math.max(c.orders, 1)).toLocaleString()}`} />
            <KpiCard label="Last Order" value={c.orders > 0 ? "3 days ago" : "—"} />
            <KpiCard label="Lifetime Rank" value={c.status === "vip" ? "#2" : "#18"} />
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">Recent Orders</h3>
              <Link href="/admin-dashboard/orders" className="text-xs font-bold text-brand-dark hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {c.orders > 0 ? (
                [
                  { id: "ORD-10284", date: "Nov 10", amount: "৳5,499", status: "paid" as const },
                  { id: "ORD-10251", date: "Oct 22", amount: "৳2,299", status: "delivered" as const },
                  { id: "ORD-10198", date: "Oct 05", amount: "৳1,149", status: "delivered" as const },
                ].slice(0, c.orders).map((o) => (
                  <Link
                    key={o.id}
                    href={`/admin-dashboard/orders/${o.id}`}
                    className="flex items-center justify-between py-3 transition hover:bg-slate-50 -mx-2 px-2 rounded-lg"
                  >
                    <div>
                      <div className="font-bold text-slate-900">#{o.id}</div>
                      <div className="text-xs text-slate-500">{o.date}, 2026</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">{o.amount}</span>
                      <StatusPill tone={o.status === "paid" ? "success" : "success"}>{o.status}</StatusPill>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-slate-500">
                  No orders yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h3 className="text-sm font-black text-slate-900">Activity Timeline</h3>
            <ol className="mt-4 space-y-4 text-sm">
              <TimelineItem icon="●" label="Placed order #ORD-10284" date="Nov 10, 10:24" tone="brand" />
              <TimelineItem icon="★" label="Reviewed White Glo Whitening Kit" date="Nov 5, 15:12" tone="amber" />
              <TimelineItem icon="♥" label="Added 3 items to wishlist" date="Nov 3, 09:48" tone="rose" />
              <TimelineItem icon="✓" label="Signed up for newsletter" date={c.joined} tone="emerald" />
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-black text-slate-900">{value}</div>
    </div>
  );
}

function TimelineItem({
  icon,
  label,
  date,
  tone,
}: {
  icon: string;
  label: string;
  date: string;
  tone: "brand" | "amber" | "rose" | "emerald";
}) {
  const bg = {
    brand: "bg-brand text-white",
    amber: "bg-amber-400 text-white",
    rose: "bg-rose-400 text-white",
    emerald: "bg-emerald-500 text-white",
  }[tone];
  return (
    <li className="flex items-start gap-3">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${bg}`}>
        {icon}
      </span>
      <div>
        <div className="font-medium text-slate-900">{label}</div>
        <div className="text-xs text-slate-500">{date}</div>
      </div>
    </li>
  );
}
