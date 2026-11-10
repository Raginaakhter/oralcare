import { AdminHeader, AdminButton, DownloadIcon } from "../AdminHeader";

export const metadata = { title: "Analytics — Admin — OralCareBD" };

export default function AnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Analytics" }]}
        title="Analytics"
        description="Deep insights into your store's performance."
        actions={
          <AdminButton icon={<DownloadIcon />}>Export Report</AdminButton>
        }
      />

      {/* Metrics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Conversion Rate" value="3.84%" change="+0.42%" tone="emerald" />
        <MetricCard label="Bounce Rate" value="42.1%" change="-2.3%" tone="emerald" />
        <MetricCard label="Avg. Session" value="4m 38s" change="+12s" tone="emerald" />
        <MetricCard label="Returning Users" value="68.4%" change="+5.2%" tone="emerald" />
      </div>

      {/* Traffic + Devices */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 xl:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Traffic Overview
              </div>
              <div className="mt-1 text-lg font-black text-slate-900">
                48,284 visitors · last 30 days
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
              ↑ 18.2%
            </span>
          </div>
          {/* Bar chart */}
          <BarChart />
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Devices
          </div>
          <div className="mt-1 text-lg font-black text-slate-900">Visitor devices</div>
          <ul className="mt-5 space-y-4">
            {[
              { label: "Mobile", value: 68, color: "bg-brand" },
              { label: "Desktop", value: 24, color: "bg-brand-blue" },
              { label: "Tablet", value: 8, color: "bg-violet-500" },
            ].map((d) => (
              <li key={d.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{d.label}</span>
                  <span className="font-bold text-slate-900">{d.value}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Traffic sources + Top pages */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TrafficSources />
        <TopPages />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  tone,
}: {
  label: string;
  value: string;
  change: string;
  tone: "emerald" | "rose";
}) {
  const toneCls = tone === "emerald" ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50";
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-black text-slate-900">{value}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${toneCls}`}>{change}</span>
      </div>
    </div>
  );
}

function BarChart() {
  const data = [820, 1240, 980, 1480, 1120, 1680, 1420, 1860, 1620, 2180, 1980, 2340];
  const max = Math.max(...data);
  const labels = ["Oct 10", "", "Oct 16", "", "Oct 22", "", "Oct 28", "", "Nov 3", "", "Nov 7", ""];
  return (
    <div className="mt-6">
      <div className="flex h-56 items-end gap-2 sm:gap-3">
        {data.map((v, i) => (
          <div key={i} className="group relative flex-1">
            <div
              className="rounded-t-lg bg-gradient-to-t from-brand/80 to-brand transition hover:from-brand-dark hover:to-brand-dark"
              style={{ height: `${(v / max) * 100}%` }}
            />
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
              {v.toLocaleString()} visits
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3">
        {labels.map((l, i) => (
          <div key={i} className="flex-1 text-center text-[10px] font-semibold text-slate-400">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrafficSources() {
  const sources = [
    { name: "Direct", value: 38, visits: "18,348", color: "bg-brand" },
    { name: "Google Search", value: 28, visits: "13,520", color: "bg-brand-blue" },
    { name: "Facebook", value: 18, visits: "8,691", color: "bg-violet-500" },
    { name: "Instagram", value: 10, visits: "4,828", color: "bg-rose-500" },
    { name: "Other", value: 6, visits: "2,897", color: "bg-amber-500" },
  ];
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Traffic Sources
      </div>
      <div className="mt-1 text-lg font-black text-slate-900">Where visitors come from</div>
      <ul className="mt-5 space-y-4">
        {sources.map((s) => (
          <li key={s.name}>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                <span className="font-medium text-slate-700">{s.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{s.visits}</span>
                <span className="w-8 text-right font-bold text-slate-900">{s.value}%</span>
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopPages() {
  const pages = [
    { path: "/", views: "12,482", bounce: "34%" },
    { path: "/shop", views: "8,124", bounce: "42%" },
    { path: "/product/white-glo-whitening-kit", views: "4,891", bounce: "28%" },
    { path: "/shop?category=teeth-whitening", views: "3,642", bounce: "38%" },
    { path: "/blog/brushing-right", views: "2,814", bounce: "45%" },
  ];
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Top Pages
      </div>
      <div className="mt-1 text-lg font-black text-slate-900">Most visited</div>
      <ul className="mt-5 divide-y divide-slate-100">
        {pages.map((p) => (
          <li key={p.path} className="flex items-center justify-between py-3">
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-xs text-slate-700">{p.path}</div>
              <div className="mt-0.5 text-[10px] text-slate-500">Bounce: {p.bounce}</div>
            </div>
            <div className="ml-4 text-sm font-bold text-slate-900">{p.views}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
