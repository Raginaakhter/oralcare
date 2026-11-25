"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SmartImage } from "@/components/SmartImage";
import { ArrowRightIcon, SparkIcon, SearchIcon } from "@/components/icons";
import { formatDate } from "@/lib/format";
import type { BlogPostSummary } from "@/lib/api/types";

/** Filters the published posts (from GET /blog) by tag and text. */
export function BlogBrowser({ posts }: { posts: BlogPostSummary[] }) {
  const [tag, setTag] = useState("All");
  const [query, setQuery] = useState("");

  const tags = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.tag).filter(Boolean) as string[]))], [posts]);
  const q = query.trim().toLowerCase();
  const filtered = posts.filter(
    (p) =>
      (tag === "All" || p.tag === tag) &&
      (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || (p.tag ?? "").toLowerCase().includes(q))
  );
  const browsing = tag === "All" && !q;
  const featured = posts.find((p) => p.isFeatured) ?? posts[0];
  const grid = browsing && featured ? filtered.filter((p) => p._id !== featured._id) : filtered;

  if (!posts.length) {
    return (
      <div className="mt-8 rounded-3xl bg-white p-12 text-center text-sm text-slate-500 ring-1 ring-slate-100">
        No articles yet — check back soon.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 ring-1 ring-slate-100 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                tag === t ? "bg-brand text-white shadow-sm" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="h-10 w-full rounded-full border border-slate-200 bg-white pl-4 pr-10 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <span className="pointer-events-none absolute right-3 top-2.5 text-slate-400">
            <SearchIcon className="h-4 w-4" />
          </span>
        </div>
      </div>

      {browsing && featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mt-8 grid overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft ring-1 ring-brand/15 transition hover:shadow-xl hover:shadow-brand/15 md:grid-cols-2 shadow-sm"
        >
          <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden p-8">
            {featured.coverImage && (
              <div className="relative h-64 w-64">
                <SmartImage
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  sizes="256px"
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
              <SparkIcon className="h-3 w-3" />
              Featured Guide
            </span>
            <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl group-hover:text-brand-dark transition">
              {featured.title}
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{featured.excerpt}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="font-bold text-slate-800">{featured.author}</span>
              {featured.publishedAt && (
                <>
                  <span>·</span>
                  <span>{formatDate(featured.publishedAt)}</span>
                </>
              )}
              <span>·</span>
              <span>{featured.readMinutes} min read</span>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-dark">
              Read Complete Article <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      )}

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{filtered.length}</strong> articles
          </span>
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-brand-dark hover:underline">
              Clear Search
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center ring-1 ring-slate-100 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <SearchIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900">No articles found{query ? ` matching "${query}"` : ""}</h3>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((p) => (
              <Link
                key={p._id}
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 hover:ring-brand/30 shadow-sm"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-soft via-white to-brand-soft">
                  {p.coverImage && (
                    <SmartImage
                      src={p.coverImage}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {p.tag && (
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ring-1 ${
                          p.accent === "blue" ? "bg-sky-50 text-sky-700 ring-sky-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        }`}
                      >
                        {p.tag}
                      </span>
                    )}
                    <h3 className="mt-3 text-base font-bold leading-snug text-slate-900 group-hover:text-brand-dark transition">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600 leading-relaxed">{p.excerpt}</p>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">{p.author}</span>
                    <span>{p.readMinutes} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
