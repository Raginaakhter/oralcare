"use client";

import Link from "next/link";
import { useState } from "react";
import { bannersApi, type Banner, type BannerPlacement } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { SmartImage } from "@/components/SmartImage";
import { AdminHeader, StatusPill, PlusIcon, EditIcon } from "../../AdminHeader";
import { DeleteButton } from "../../DeleteButton";
import { Loader, useAdminAction } from "../../AdminShell";

export default function BannersPage() {
  const run = useAdminAction();
  const list = useAsync(() => bannersApi.list({ limit: 100 }), []);
  const [placement, setPlacement] = useState<BannerPlacement>("hero");
  const banners = [...(list.data?.items ?? [])]
    .filter((b) => (b.placement ?? "hero") === placement)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const move = async (index: number, dir: -1 | 1) => {
    const next = [...banners];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    const r = await run(() => bannersApi.reorder(next.map((b, i) => ({ id: b._id, displayOrder: i }))), "Order saved");
    if (r) void list.reload();
  };

  const toggle = async (b: Banner, field: "isActive" | "isPublished") => {
    const r = await run(() => bannersApi.setStatus(b._id, { [field]: !b[field] }), "Banner updated");
    if (r) void list.reload();
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Content" }, { label: "Banners" }]}
        title="Homepage banners"
        description="Published, active banners within their date window appear in the homepage hero."
        actions={
          <Link
            href="/admin-dashboard/content/banner/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-brand-dark"
          >
            <PlusIcon /> Add Banner
          </Link>
        }
      />
      <div className="mb-4 flex gap-2">
        {(["hero", "promo"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPlacement(p)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold ${placement === p ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
          >
            {p === "hero" ? "Hero slider" : "Promo cards"}
          </button>
        ))}
      </div>
      {list.loading ? (
        <Loader />
      ) : !banners.length ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 ring-1 ring-slate-200/70">
          No banners yet — the storefront shows its built-in slides until you add one.
        </p>
      ) : (
        <div className="space-y-3">
          {banners.map((b, i) => (
            <div key={b._id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
              <div className="flex flex-col gap-1">
                <button disabled={i === 0} onClick={() => move(i, -1)} className="rounded px-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move up">
                  ▲
                </button>
                <button
                  disabled={i === banners.length - 1}
                  onClick={() => move(i, 1)}
                  className="rounded px-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>
              <span className="relative h-20 w-36 overflow-hidden rounded-xl bg-slate-100">
                {(b.desktopImage || b.backgroundImage || b.mobileImage) && (
                  <SmartImage src={b.desktopImage || b.backgroundImage || b.mobileImage} alt="" fill sizes="144px" className="object-cover" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900">{b.title}</div>
                <div className="text-xs text-slate-500">{b.subtitle}</div>
                <div className="mt-1 text-[11px] text-slate-400">
                  {b.startDate || b.endDate ? `${b.startDate ? formatDate(b.startDate) : "Now"} → ${b.endDate ? formatDate(b.endDate) : "No end"}` : "Always on"}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => toggle(b, "isPublished")}>
                  <StatusPill tone={b.isPublished ? "success" : "neutral"}>{b.isPublished ? "Published" : "Draft"}</StatusPill>
                </button>
                <button onClick={() => toggle(b, "isActive")}>
                  <StatusPill tone={b.isActive ? "info" : "warning"}>{b.isActive ? "Active" : "Inactive"}</StatusPill>
                </button>
                <Link
                  href={`/admin-dashboard/content/banner/${b._id}/edit`}
                  aria-label="Edit"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <EditIcon />
                </Link>
                <DeleteButton
                  itemLabel={b.title}
                  onConfirm={async () => {
                    const ok = await run(() => bannersApi.remove(b._id), "Banner deleted");
                    if (ok) void list.reload();
                    return !!ok;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
