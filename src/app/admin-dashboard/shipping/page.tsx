import {
  AdminHeader,
  AdminButton,
  StatusPill,
  PlusIcon,
  DownloadIcon,
} from "../AdminHeader";

export const metadata = { title: "Shipping — Admin — OralCareBD" };

type ShipStatus = "in-transit" | "delivered" | "preparing" | "returned";

const shipments: {
  tracking: string;
  orderId: string;
  customer: string;
  destination: string;
  carrier: string;
  status: ShipStatus;
  estArrival: string;
  updated: string;
}[] = [
  { tracking: "SA-2026-10284", orderId: "#ORD-10284", customer: "Afsana Rahman", destination: "Dhanmondi, Dhaka", carrier: "Steadfast", status: "in-transit", estArrival: "Nov 11", updated: "2h ago" },
  { tracking: "PAT-2026-10283", orderId: "#ORD-10283", customer: "Tanvir Islam", destination: "Agrabad, Chattogram", carrier: "Pathao", status: "preparing", estArrival: "Nov 12", updated: "1h ago" },
  { tracking: "SA-2026-10282", orderId: "#ORD-10282", customer: "Nusrat Jahan", destination: "Zindabazar, Sylhet", carrier: "Steadfast", status: "in-transit", estArrival: "Nov 12", updated: "30m ago" },
  { tracking: "RD-2026-10281", orderId: "#ORD-10281", customer: "Rafiq Ahmed", destination: "Boyra, Khulna", carrier: "RedX", status: "preparing", estArrival: "Nov 13", updated: "4h ago" },
  { tracking: "PAT-2026-10280", orderId: "#ORD-10280", customer: "Sabrina Akter", destination: "Shaheb Bazar, Rajshahi", carrier: "Pathao", status: "returned", estArrival: "—", updated: "1d ago" },
  { tracking: "SA-2026-10279", orderId: "#ORD-10279", customer: "Mehedi Hasan", destination: "Uttara, Dhaka", carrier: "Steadfast", status: "delivered", estArrival: "Delivered Nov 10", updated: "6h ago" },
  { tracking: "SA-2026-10278", orderId: "#ORD-10278", customer: "Priya Sultana", destination: "Band Road, Barishal", carrier: "Steadfast", status: "delivered", estArrival: "Delivered Nov 9", updated: "1d ago" },
];

const statusTone: Record<ShipStatus, "info" | "success" | "warning" | "danger"> = {
  "in-transit": "info",
  delivered: "success",
  preparing: "warning",
  returned: "danger",
};

export default function ShippingPage() {
  const inTransit = shipments.filter((s) => s.status === "in-transit").length;
  const preparing = shipments.filter((s) => s.status === "preparing").length;
  const delivered = shipments.filter((s) => s.status === "delivered").length;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Shipping" }]}
        title="Shipping"
        description="Track shipments and manage delivery partners."
        actions={
          <>
            <AdminButton icon={<DownloadIcon />}>Export</AdminButton>
            <AdminButton variant="primary" icon={<PlusIcon />}>Create Shipment</AdminButton>
          </>
        }
      />

      {/* Status cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Preparing" value={preparing} sub="to be picked up" accent="amber" />
        <StatCard label="In Transit" value={inTransit} sub="on the road" accent="blue" />
        <StatCard label="Delivered" value={delivered} sub="this month" accent="emerald" />
        <StatCard label="Returned" value={shipments.filter((s) => s.status === "returned").length} sub="needs review" accent="rose" />
      </div>

      {/* Carriers */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <CarrierCard name="Steadfast" code="SA" shipments={4} successRate={98.2} color="emerald" />
        <CarrierCard name="Pathao" code="PAT" shipments={2} successRate={96.5} color="blue" />
        <CarrierCard name="RedX" code="RD" shipments={1} successRate={94.8} color="rose" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="text-sm font-black text-slate-900">All Shipments</div>
          <div className="text-xs text-slate-500">{shipments.length} total</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">Tracking #</th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Destination</th>
                <th className="px-6 py-3">Carrier</th>
                <th className="px-6 py-3">ETA</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {shipments.map((s) => (
                <tr key={s.tracking} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">{s.tracking}</td>
                  <td className="px-6 py-4 text-slate-700">{s.orderId}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{s.customer}</td>
                  <td className="px-6 py-4 text-slate-700">{s.destination}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      {s.carrier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="leading-tight">
                      <div className="text-slate-900">{s.estArrival}</div>
                      <div className="text-xs text-slate-500">updated {s.updated}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill tone={statusTone[s.status]}>{s.status.replace("-", " ")}</StatusPill>
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

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  accent: "emerald" | "blue" | "amber" | "rose";
}) {
  const colorMap = {
    emerald: "text-emerald-600 bg-emerald-50",
    blue: "text-sky-600 bg-sky-50",
    amber: "text-amber-600 bg-amber-50",
    rose: "text-rose-600 bg-rose-50",
  };
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
          <div className="mt-1 text-xs text-slate-500">{sub}</div>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[accent]}`}>
          <TruckMiniIcon />
        </span>
      </div>
    </div>
  );
}

function CarrierCard({
  name,
  code,
  shipments,
  successRate,
  color,
}: {
  name: string;
  code: string;
  shipments: number;
  successRate: number;
  color: "emerald" | "blue" | "rose";
}) {
  const colorMap = {
    emerald: "from-emerald-400 to-emerald-600",
    blue: "from-sky-400 to-brand-blue",
    rose: "from-rose-400 to-pink-500",
  };
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colorMap[color]} text-sm font-black text-white shadow-lg`}
        >
          {code}
        </span>
        <div>
          <div className="font-bold text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">{shipments} active shipments</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-500">Success rate</span>
        <span className="font-black text-emerald-600">{successRate}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-brand"
          style={{ width: `${successRate}%` }}
        />
      </div>
    </div>
  );
}

function TruckMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M3 16V6a1 1 0 0 1 1-1h11v11" strokeLinejoin="round" />
      <path d="M15 16h5v-5l-3-3h-2" strokeLinejoin="round" />
      <circle cx="7.5" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </svg>
  );
}
