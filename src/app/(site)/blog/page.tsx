"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import {
  ArrowRightIcon,
  SparkIcon,
  SearchIcon,
  CheckBadgeIcon,
} from "@/components/icons";
import { blogPosts } from "@/lib/blog";

const tags = [
  "All",
  "Daily Habits",
  "Whitening",
  "Fresh Breath",
  "Kids",
  "Expert Picks",
  "Gum Health",
];

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesTag =
      selectedTag === "All" ||
      post.tag.toLowerCase() === selectedTag.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tag.toLowerCase().includes(query);
    return matchesTag && matchesQuery;
  });

  const featured = blogPosts.find((p) => p.featured) || blogPosts[0];
  const gridPosts = filteredPosts.filter((p) => p.slug !== featured.slug || selectedTag !== "All" || searchQuery);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <>
      <PageHero
        title="Oral Care Articles & Smile Tips"
        subtitle="Dentist-approved guides, product recommendations and expert advice for a healthier smile."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Articles & Blog" }]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filter bar + Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 ring-1 ring-slate-100 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => {
              const active = selectedTag.toLowerCase() === t.toLowerCase();
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    active
                      ? "bg-brand text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="h-10 w-full rounded-full border border-slate-200 bg-white pl-4 pr-10 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <span className="pointer-events-none absolute right-3 top-2.5 text-slate-400">
              <SearchIcon className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Featured Post (shown when on "All" and no search query) */}
        {selectedTag === "All" && !searchQuery && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-8 grid overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft ring-1 ring-brand/15 transition hover:shadow-xl hover:shadow-brand/15 md:grid-cols-2 shadow-sm"
          >
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-soft via-white to-brand-soft p-8">
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 animate-blob rounded-full bg-slate-300/50 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 animate-blob rounded-full bg-slate-300/50 blur-3xl" />
              <div className="relative h-64 w-64">
                <Image
                  src={featured.img}
                  alt={featured.title}
                  fill
                  sizes="256px"
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center p-8">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                <SparkIcon className="h-3 w-3" />
                Featured Guide
              </span>
              <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl group-hover:text-brand-dark transition">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                <span className="font-bold text-slate-800">{featured.author}</span>
                <span>·</span>
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.minutes} min read</span>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-dark">
                Read Complete Article{" "}
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        )}

        {/* Article Grid */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong>{filteredPosts.length}</strong> articles
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-brand-dark hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center ring-1 ring-slate-100 shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <SearchIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900">
                No articles found matching &quot;{searchQuery}&quot;
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Try searching for brushing, whitening, mouthwash, or kids dental habits.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(selectedTag === "All" && !searchQuery ? gridPosts : filteredPosts).map((p) => {
                const tagCls =
                  p.accent === "blue"
                    ? "bg-sky-50 text-sky-700 ring-sky-200"
                    : "bg-emerald-50 text-emerald-700 ring-emerald-200";

                return (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 hover:ring-brand/30 shadow-sm"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-soft via-white to-brand-soft">
                      <Image
                        src={p.img}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ring-1 ${tagCls}`}
                        >
                          {p.tag}
                        </span>
                        <h3 className="mt-3 text-base font-bold leading-snug text-slate-900 group-hover:text-brand-dark transition">
                          {p.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs text-slate-600 leading-relaxed">
                          {p.excerpt}
                        </p>
                      </div>

                      <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">{p.author}</span>
                        <span>{p.minutes} min read</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <section className="mt-16 rounded-3xl bg-gradient-to-r from-brand via-brand to-brand-blue-dark p-8 sm:p-12 text-center text-white shadow-xl shadow-brand/20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <SparkIcon className="h-3.5 w-3.5" />
            Weekly Dental Guide
          </span>
          <h3 className="mt-3 text-2xl font-black sm:text-3xl">
            Never Miss an Oral Health Tip
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-white/90">
            Join 12,000+ members in Bangladesh receiving dentist-verified advice, product comparisons, and exclusive discounts.
          </p>

          {subscribed ? (
            <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-full bg-white/20 p-3 text-xs font-bold text-white backdrop-blur-md">
              <CheckBadgeIcon className="h-4 w-4 text-emerald-300" />
              Thank you for subscribing! Check your inbox soon.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mx-auto mt-6 flex w-full max-w-md rounded-full bg-white p-1.5 shadow-lg">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-transparent px-5 text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-dark transition"
              >
                Subscribe
              </button>
            </form>
          )}
        </section>
      </main>
    </>
  );
}
