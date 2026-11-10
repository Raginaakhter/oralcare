import Image from "next/image";
import {
  AdminHeader,
  AdminButton,
  StatusPill,
  DownloadIcon,
} from "../AdminHeader";
import { Stars } from "@/components/Stars";
import { products } from "@/lib/products";

export const metadata = { title: "Reviews — Admin — OralCareBD" };

type ReviewStatus = "published" | "pending" | "flagged";

const reviews: {
  author: string;
  avatarColor: string;
  rating: number;
  title: string;
  body: string;
  product: (typeof products)[number];
  verified: boolean;
  helpful: number;
  status: ReviewStatus;
  date: string;
}[] = [
  { author: "Afsana Rahman", avatarColor: "from-rose-400 to-pink-500", rating: 5, title: "Game-changing whitening results!", body: "Used this for 2 weeks and the difference is visible. My dentist even complimented me. The LED accelerator is powerful and no sensitivity at all.", product: products[0], verified: true, helpful: 24, status: "published", date: "Nov 9, 2026" },
  { author: "Tanvir Islam", avatarColor: "from-sky-400 to-brand-blue", rating: 4, title: "Great freshness, lasts all day", body: "The icy mint flavor is strong but not overwhelming. Lasts about 6-8 hours of fresh breath. Would buy again.", product: products[10], verified: true, helpful: 12, status: "published", date: "Nov 8, 2026" },
  { author: "Nusrat Jahan", avatarColor: "from-emerald-400 to-brand", rating: 5, title: "Purple toothpaste is magic", body: "I was skeptical about purple toothpaste but it really does neutralise yellow tones. Instant brighter smile after one use!", product: products[2], verified: true, helpful: 18, status: "published", date: "Nov 7, 2026" },
  { author: "Anonymous User", avatarColor: "from-slate-400 to-slate-600", rating: 1, title: "Not what I expected at all!!!", body: "Completely useless product do not buy spam spam click here for free stuff visit my-sketchy-site.com for discount lmao", product: products[4], verified: false, helpful: 0, status: "flagged", date: "Nov 7, 2026" },
  { author: "Rafiq Ahmed", avatarColor: "from-amber-400 to-orange-500", rating: 4, title: "Solid everyday whitening", body: "Not dramatic results but gentle enough for daily use. My teeth feel cleaner and look a shade brighter after a month.", product: products[3], verified: true, helpful: 8, status: "pending", date: "Nov 6, 2026" },
  { author: "Sabrina Akter", avatarColor: "from-violet-400 to-fuchsia-500", rating: 5, title: "Perfect for sensitive teeth", body: "Sensodyne has been a lifesaver. No more wincing when I eat ice cream. The daily care formula is gentle and effective.", product: products[13], verified: true, helpful: 31, status: "published", date: "Nov 5, 2026" },
  { author: "Mehedi Hasan", avatarColor: "from-indigo-400 to-blue-500", rating: 3, title: "Decent but overpriced", body: "The product works as advertised but feels a bit expensive for the amount you get. Would consider cheaper alternatives.", product: products[8], verified: true, helpful: 4, status: "pending", date: "Nov 4, 2026" },
];

const statusTone: Record<ReviewStatus, "success" | "warning" | "danger"> = {
  published: "success",
  pending: "warning",
  flagged: "danger",
};

export default function ReviewsPage() {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const published = reviews.filter((r) => r.status === "published").length;
  const pending = reviews.filter((r) => r.status === "pending").length;
  const flagged = reviews.filter((r) => r.status === "flagged").length;

  // Rating distribution
  const ratingBars = [5, 4, 3, 2, 1].map((n) => ({
    stars: n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Reviews" }]}
        title="Customer Reviews"
        description={`${reviews.length} reviews · ${pending} awaiting moderation.`}
        actions={<AdminButton icon={<DownloadIcon />}>Export</AdminButton>}
      />

      {/* Summary */}
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_2fr]">
        {/* Average rating */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Overall Rating
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900">{avg.toFixed(1)}</span>
            <span className="text-sm text-slate-500">/ 5.0</span>
          </div>
          <div className="mt-2">
            <Stars value={avg} />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Based on {reviews.length} customer reviews
          </div>
          <div className="mt-5 space-y-2">
            {ratingBars.map((b) => (
              <div key={b.stars} className="flex items-center gap-3 text-xs">
                <span className="flex w-12 items-center gap-1 text-slate-600">
                  {b.stars}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-amber-400">
                    <path d="m12 2 3 7 7 .5-5.5 4.5 2 7L12 17l-6.5 4 2-7L2 9.5 9 9l3-7Z" />
                  </svg>
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${(b.count / reviews.length) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right font-bold text-slate-700">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status KPIs */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatusKpi label="Published" value={published} accent="emerald" />
          <StatusKpi label="Pending" value={pending} accent="amber" />
          <StatusKpi label="Flagged" value={flagged} accent="rose" />
          <div className="sm:col-span-3 rounded-2xl bg-gradient-to-br from-brand-soft via-white to-brand-blue-soft p-5 ring-1 ring-emerald-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-dark">
              Moderation Guideline
            </div>
            <p className="mt-2 text-sm text-slate-700">
              Review new submissions within 24 hours. Flag inappropriate content (spam, external links, personal attacks) immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 ring-1 ring-slate-200/70">
        {[
          { label: "All", count: reviews.length, active: true },
          { label: "Pending", count: pending },
          { label: "Published", count: published },
          { label: "Flagged", count: flagged },
        ].map((t) => (
          <button
            key={t.label}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              t.active
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                t.active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 transition hover:shadow-lg hover:shadow-slate-100"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${r.avatarColor} text-sm font-black text-white shadow`}
                >
                  {r.author.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">{r.author}</span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        ✓ Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Stars value={r.rating} />
                    <span>·</span>
                    <span>{r.date}</span>
                    <span>·</span>
                    <span>{r.helpful} found helpful</span>
                  </div>
                </div>
              </div>
              <StatusPill tone={statusTone[r.status]}>{r.status}</StatusPill>
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">{r.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{r.body}</p>

            {/* Product reference + actions */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image src={r.product.img} alt="" fill sizes="40px" className="object-contain p-1" />
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-semibold text-slate-500">Reviewed product</div>
                  <div className="line-clamp-1 max-w-[280px] text-xs font-bold text-slate-900">
                    {r.product.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {r.status === "pending" && (
                  <>
                    <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-600">
                      Approve
                    </button>
                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-rose-300 hover:text-rose-600">
                      Reject
                    </button>
                  </>
                )}
                {r.status === "flagged" && (
                  <>
                    <button className="rounded-lg bg-rose-500 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-rose-600">
                      Delete
                    </button>
                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-600">
                      Restore
                    </button>
                  </>
                )}
                {r.status === "published" && (
                  <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-rose-300 hover:text-rose-600">
                    Unpublish
                  </button>
                )}
                <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-brand hover:text-brand-dark">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusKpi({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "emerald" | "amber" | "rose";
}) {
  const color = {
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    rose: "text-rose-600 bg-rose-50",
  }[accent];
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-3xl font-black text-slate-900">{value}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${color}`}>
          reviews
        </span>
      </div>
    </div>
  );
}
