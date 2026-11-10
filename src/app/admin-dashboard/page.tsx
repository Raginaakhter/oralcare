import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, SparkIcon } from "@/components/icons";
import { Stars } from "@/components/Stars";
import { products } from "@/lib/products";
import {
  AdminHeader,
  AdminButton,
  PlusIcon,
  DownloadIcon,
} from "./AdminHeader";

export default function AdminOverviewPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <AdminHeader
        eyebrow="Overview · Last 30 days"
        title={
          <>
            Welcome back, <span className="text-brand-dark">Raj</span>
            <span className="ml-2 inline-block animate-wobble">👋</span>
          </>
        }
        description="Here's what's happening in your store today."
        actions={
          <>
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm">
              <CalendarIcon />
              Oct 10 – Nov 10, 2026
            </div>
            <AdminButton icon={<DownloadIcon />}>Export</AdminButton>
            <AdminButton variant="primary" icon={<PlusIcon />}>
              Add Product
            </AdminButton>
          </>
        }
      />

      <StatsRow />

      <div className="grid gap-6 xl:grid-cols-3">
        <SalesChart />
        <TopProducts />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <RecentOrders />
        <TopCustomers />
      </div>
    </div>
  );
}

/* ---------- Metric cards ---------- */

const stats = [
  {
    label: "Total Revenue",
    value: "৳4,82,650",
    change: 12.4,
    isPositive: true,
    sub: "vs last month",
    accent: "emerald" as const,
    icon: <RevenueIcon />,
    spark: [12, 18, 15, 22, 20, 28, 25, 32, 30, 38, 36, 42],
  },
  {
    label: "Orders",
    value: "1,284",
    change: 8.2,
    isPositive: true,
    sub: "128 this week",
    accent: "blue" as const,
    icon: <OrderIcon />,
    spark: [20, 22, 18, 25, 28, 24, 30, 28, 34, 32, 36, 40],
  },
  {
    label: "Customers",
    value: "892",
    change: 4.1,
    isPositive: true,
    sub: "42 new signups",
    accent: "violet" as const,
    icon: <UsersIcon />,
    spark: [15, 18, 20, 19, 22, 24, 23, 26, 28, 27, 30, 32],
  },
  {
    label: "Avg. Order Value",
    value: "৳376",
    change: -2.4,
    isPositive: false,
    sub: "vs last month",
    accent: "amber" as const,
    icon: <CartMiniIcon />,
    spark: [32, 30, 34, 31, 35, 28, 30, 27, 29, 26, 25, 24],
  },
];

function StatsRow() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  isPositive,
  sub,
  accent,
  icon,
  spark,
}: {
  label: string;
  value: string;
  change: number;
  isPositive: boolean;
  sub: string;
  accent: "emerald" | "blue" | "violet" | "amber";
  icon: React.ReactNode;
  spark: number[];
}) {
  const accentCls = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", stroke: "#10b981" },
    blue: { bg: "bg-sky-50", text: "text-sky-600", stroke: "#0ea5e9" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", stroke: "#8b5cf6" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", stroke: "#f59e0b" },
  }[accent];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60">
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentCls.bg} ${accentCls.text}`}>
          {icon}
        </span>
        <TrendPill value={change} positive={isPositive} />
      </div>
      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </div>
        <div className="mt-1.5 text-2xl font-black text-slate-900 sm:text-[1.65rem]">
          {value}
        </div>
        <div className="mt-1 text-xs text-slate-500">{sub}</div>
      </div>
      {/* Sparkline */}
      <div className="mt-4">
        <Sparkline values={spark} color={accentCls.stroke} />
      </div>
    </div>
  );
}

function TrendPill({ value, positive }: { value: number; positive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-bold ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700"
      }`}
    >
      {positive ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
          <path d="m7 14 5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
          <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {Math.abs(value)}%
    </span>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 240;
  const h = 44;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  const points = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(" ");
  const area = `M0,${h} L${points.replace(/,/g, "_").split(" ").map(p => p.replace("_", ",")).join(" L")} L${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-11 w-full">
      <defs>
        <linearGradient id={`spark-${color.slice(1)}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color.slice(1)})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- Big sales chart ---------- */

const salesMonth = [
  { d: "Oct 11", a: 12500, b: 8200 },
  { d: "Oct 14", a: 15800, b: 10100 },
  { d: "Oct 17", a: 13200, b: 9400 },
  { d: "Oct 20", a: 18600, b: 12800 },
  { d: "Oct 23", a: 16500, b: 11400 },
  { d: "Oct 26", a: 21400, b: 14500 },
  { d: "Oct 29", a: 19800, b: 13900 },
  { d: "Nov 01", a: 24600, b: 16200 },
  { d: "Nov 04", a: 22800, b: 15800 },
  { d: "Nov 07", a: 28400, b: 18600 },
  { d: "Nov 10", a: 26800, b: 17400 },
];

function SalesChart() {
  const totalThis = salesMonth.reduce((s, x) => s + x.a, 0);
  const totalPrev = salesMonth.reduce((s, x) => s + x.b, 0);
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 xl:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Sales Trend
          </div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-2xl font-black text-slate-900">
              ৳{totalThis.toLocaleString("en-IN")}
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
              +18.4%
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            vs last period: ৳{totalPrev.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button className="rounded-lg px-3 py-1.5 font-bold text-slate-500 hover:bg-slate-100">
            7d
          </button>
          <button className="rounded-lg bg-slate-900 px-3 py-1.5 font-bold text-white">
            30d
          </button>
          <button className="rounded-lg px-3 py-1.5 font-bold text-slate-500 hover:bg-slate-100">
            90d
          </button>
          <button className="rounded-lg px-3 py-1.5 font-bold text-slate-500 hover:bg-slate-100">
            1y
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5 text-xs">
        <span className="inline-flex items-center gap-2 text-slate-700">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          This period
        </span>
        <span className="inline-flex items-center gap-2 text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          Previous
        </span>
      </div>

      <AreaChart data={salesMonth} />
    </div>
  );
}

function AreaChart({
  data,
}: {
  data: { d: string; a: number; b: number }[];
}) {
  const w = 720;
  const h = 240;
  const padX = 20;
  const padY = 16;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  const max = Math.max(...data.flatMap((d) => [d.a, d.b])) * 1.1;
  const step = innerW / (data.length - 1);
  const yOf = (v: number) => padY + innerH - (v / max) * innerH;
  const xOf = (i: number) => padX + i * step;

  const buildPath = (key: "a" | "b") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(i)},${yOf(d[key])}`).join(" ");
  const buildArea = (key: "a" | "b") =>
    `${buildPath(key)} L${xOf(data.length - 1)},${padY + innerH} L${padX},${padY + innerH} Z`;

  const ySteps = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="mt-5 overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-64 w-full">
        <defs>
          <linearGradient id="area-brand" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="1" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {ySteps.map((t) => (
          <line
            key={t}
            x1={padX}
            x2={w - padX}
            y1={padY + innerH * t}
            y2={padY + innerH * t}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
        ))}

        {/* Previous area (gray outline only) */}
        <path d={buildPath("b")} fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 4" />

        {/* This period area */}
        <path d={buildArea("a")} fill="url(#area-brand)" />
        <path d={buildPath("a")} fill="none" stroke="#10b981" strokeWidth="2.5" />

        {/* Dots on this period */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={xOf(i)} cy={yOf(d.a)} r="4" fill="#fff" stroke="#10b981" strokeWidth="2" />
          </g>
        ))}

        {/* X labels */}
        {data.map((d, i) =>
          i % 2 === 0 ? (
            <text
              key={d.d}
              x={xOf(i)}
              y={h - 2}
              fontSize="10"
              fill="#94a3b8"
              textAnchor="middle"
            >
              {d.d}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}

/* ---------- Top products donut ---------- */

const topProducts = [
  { name: "Whitening Kits", value: 42, color: "#10b981" },
  { name: "Toothpaste", value: 28, color: "#0ea5e9" },
  { name: "Mouthwash", value: 18, color: "#8b5cf6" },
  { name: "Toothbrushes", value: 12, color: "#f59e0b" },
];

function TopProducts() {
  const total = topProducts.reduce((s, p) => s + p.value, 0);
  const radius = 70;
  const circ = 2 * Math.PI * radius;

  // Precompute arc length + cumulative offset for each slice
  const segments = topProducts.reduce<
    { name: string; color: string; len: number; offset: number }[]
  >((acc, p) => {
    const prevOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].len : 0;
    const len = (p.value / total) * circ;
    acc.push({ name: p.name, color: p.color, len, offset: prevOffset });
    return acc;
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Top Categories
          </div>
          <div className="mt-1 text-lg font-black text-slate-900">
            By revenue share
          </div>
        </div>
        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
          <MoreIcon />
        </button>
      </div>

      {/* Donut */}
      <div className="relative mt-5 flex items-center justify-center">
        <svg viewBox="0 0 180 180" className="h-44 w-44 -rotate-90">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="18" />
          {segments.map((s) => (
            <circle
              key={s.name}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth="18"
              strokeDasharray={`${s.len} ${circ - s.len}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-slate-500">Total</div>
          <div className="text-xl font-black text-slate-900">৳4.8L</div>
        </div>
      </div>

      {/* Legend */}
      <ul className="mt-5 space-y-3">
        {topProducts.map((p) => (
          <li key={p.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: p.color }}
              />
              <span className="font-medium text-slate-700">{p.name}</span>
            </span>
            <span className="font-bold text-slate-900">{p.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Recent orders table ---------- */

type OrderStatus = "paid" | "processing" | "shipped" | "pending" | "cancelled";

const orders: {
  id: string;
  customer: string;
  product: string;
  img: string;
  amount: string;
  status: OrderStatus;
  date: string;
}[] = [
  {
    id: "#ORD-10284",
    customer: "Afsana Rahman",
    product: products[0].name,
    img: products[0].img,
    amount: "৳5,499",
    status: "paid",
    date: "Nov 10, 10:24",
  },
  {
    id: "#ORD-10283",
    customer: "Tanvir Islam",
    product: products[10].name,
    img: products[10].img,
    amount: "৳2,399",
    status: "processing",
    date: "Nov 10, 09:48",
  },
  {
    id: "#ORD-10282",
    customer: "Nusrat Jahan",
    product: products[2].name,
    img: products[2].img,
    amount: "৳1,149",
    status: "shipped",
    date: "Nov 09, 18:11",
  },
  {
    id: "#ORD-10281",
    customer: "Rafiq Ahmed",
    product: products[8].name,
    img: products[8].img,
    amount: "৳3,499",
    status: "pending",
    date: "Nov 09, 14:02",
  },
  {
    id: "#ORD-10280",
    customer: "Sabrina Akter",
    product: products[13].name,
    img: products[13].img,
    amount: "৳1,099",
    status: "cancelled",
    date: "Nov 09, 11:34",
  },
  {
    id: "#ORD-10279",
    customer: "Mehedi Hasan",
    product: products[4].name,
    img: products[4].img,
    amount: "৳749",
    status: "paid",
    date: "Nov 08, 21:17",
  },
];

const statusStyles: Record<OrderStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  processing: "bg-sky-50 text-sky-700 ring-sky-100",
  shipped: "bg-violet-50 text-violet-700 ring-violet-100",
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-100",
};

function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Recent Orders
          </div>
          <div className="mt-1 text-lg font-black text-slate-900">
            Latest customer orders
          </div>
        </div>
        <Link
          href="/admin-dashboard"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-dark hover:underline"
        >
          View All <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {orders.map((o) => (
              <tr key={o.id} className="transition hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={o.img}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-contain p-1"
                      />
                    </span>
                    <div className="leading-tight">
                      <div className="font-bold text-slate-900">{o.id}</div>
                      <div className="line-clamp-1 max-w-[220px] text-xs text-slate-500">
                        {o.product}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">
                  {o.customer}
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">
                  {o.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ${statusStyles[o.status]}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Top customers ---------- */

const topCustomers = [
  { name: "Afsana Rahman", email: "afsana@example.com", orders: 24, spent: "৳48,200", color: "from-rose-400 to-pink-500" },
  { name: "Tanvir Islam", email: "tanvir@example.com", orders: 19, spent: "৳36,900", color: "from-sky-400 to-brand-blue" },
  { name: "Nusrat Jahan", email: "nusrat@example.com", orders: 17, spent: "৳32,100", color: "from-emerald-400 to-brand" },
  { name: "Rafiq Ahmed", email: "rafiq@example.com", orders: 14, spent: "৳28,700", color: "from-amber-400 to-orange-500" },
  { name: "Sabrina Akter", email: "sabrina@example.com", orders: 12, spent: "৳24,400", color: "from-violet-400 to-fuchsia-500" },
];

function TopCustomers() {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Top Customers
          </div>
          <div className="mt-1 text-lg font-black text-slate-900">
            This month
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
          <SparkIcon className="h-3 w-3" />
          Active
        </span>
      </div>

      <ul className="mt-5 space-y-3">
        {topCustomers.map((c, i) => (
          <li
            key={c.email}
            className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
          >
            <div className="relative">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${c.color} text-sm font-black text-white shadow`}
              >
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              {i === 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px]">
                  👑
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-slate-900">
                {c.name}
              </div>
              <div className="truncate text-xs text-slate-500">
                {c.orders} orders
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-brand-dark">{c.spent}</div>
              <div className="text-[10px] text-slate-500">lifetime</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">
            Customer rating
          </div>
          <Stars value={5} />
        </div>
        <Link
          href="/admin-dashboard"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-dark hover:underline"
        >
          All customers <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

/* ---------- Icons used in this page ---------- */

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}
function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}
function RevenueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M12 3v18M17 7H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function OrderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M6 4h14l-1.5 10H7L5 2H2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.6" />
      <circle cx="17" cy="20" r="1.6" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" strokeLinecap="round" />
      <path d="M16 11a3 3 0 1 0 0-6M22 20c0-3-2-4.5-5-5" strokeLinecap="round" />
    </svg>
  );
}
function CartMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M3 5h2l2.4 11a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </svg>
  );
}
