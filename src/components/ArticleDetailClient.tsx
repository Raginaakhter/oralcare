"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import type { BlogPost, BlogPostSummary } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { SmartImage } from "@/components/SmartImage";
import { PageHero } from "@/components/SiteShell";
import { ArrowRightIcon, SparkIcon, WhatsappIcon } from "@/components/icons";
import { useStore } from "@/context/StoreContext";

export function ArticleDetailClient({
  post,
  recommendedProducts,
  related,
}: {
  /** GET /blog/:slug */
  post: BlogPost;
  recommendedProducts: Product[];
  /** Other published posts with the same tag. */
  related: BlogPostSummary[];
}) {
  const { showToast } = useStore();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Article link copied to clipboard!", "success");
    } catch {
      showToast("Couldn't copy the link", "error");
    }
  };

  const tagCls = post.accent === "blue" ? "bg-sky-50 text-sky-700 ring-sky-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Articles", href: "/blog" }, { label: post.tag || post.title }]}
      />

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            {post.tag && (
              <span className={`inline-flex rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider ring-1 ${tagCls}`}>
                {post.tag}
              </span>
            )}
            <span>
              Written by <strong className="text-slate-900">{post.author}</strong>{" "}
              {post.authorRole && <span className="text-slate-400">({post.authorRole})</span>}
            </span>
            {post.publishedAt && (
              <>
                <span>·</span>
                <span>{formatDate(post.publishedAt)}</span>
              </>
            )}
            <span>·</span>
            <span>{post.readMinutes} min read</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Share:</span>
            <button
              onClick={handleCopyLink}
              title="Copy link"
              className="flex h-8 px-2.5 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-brand hover:text-white transition text-xs font-bold"
            >
              🔗 Copy Link
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - Read more on OralCareBD`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition ring-1 ring-emerald-200"
            >
              <WhatsappIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {post.coverImage && (
          <div className="relative mb-10 h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft ring-1 ring-brand/15 sm:h-96 shadow-sm">
            <SmartImage src={post.coverImage} alt={post.title} fill sizes="(min-width: 768px) 800px, 100vw" className="object-contain p-10" preload loading="eager" />
          </div>
        )}

        {post.sections.length > 1 && (
          <div className="mb-10 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">Table of Contents</h3>
            <ul className="space-y-2 text-xs font-bold text-slate-700">
              {post.sections.map((sec, i) => (
                <li key={i}>
                  <a href={`#section-${i}`} className="hover:text-brand-dark transition flex items-center gap-2">
                    <span className="text-brand">→</span> {sec.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <article className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">
          {post.sections.length ? (
            post.sections.map((sec, idx) => (
              <section key={idx} id={`section-${idx}`} className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{sec.heading}</h2>
                <p className="leading-relaxed whitespace-pre-line">{sec.content}</p>
                {sec.tip && (
                  <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 text-xs sm:text-sm text-emerald-950 flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-xs">
                      💡
                    </span>
                    <div>
                      <strong className="block text-emerald-900 font-bold mb-0.5">Dentist Tip</strong>
                      {sec.tip}
                    </div>
                  </div>
                )}
              </section>
            ))
          ) : (
            <p>{post.excerpt}</p>
          )}
        </article>

        <div className="mt-12 flex flex-wrap items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft p-6 ring-1 ring-brand/15 shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-dark ring-1 ring-brand/15 shadow-sm">
            <SparkIcon className="h-6 w-6" />
          </span>
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-black text-slate-900">{post.author}</div>
            {post.authorRole && <div className="text-xs text-brand-dark font-semibold">{post.authorRole}</div>}
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-dark ring-1 ring-brand/15 hover:bg-brand-soft shadow-sm"
          >
            All Articles
            <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </div>

        {recommendedProducts.length > 0 && (
          <section className="mt-14 rounded-3xl bg-slate-50 p-6 sm:p-8 ring-1 ring-slate-200">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark">Featured In This Article</span>
                <h3 className="mt-1 text-xl font-black text-slate-900">Recommended Products for this Routine</h3>
              </div>
              <Link href="/shop" className="text-xs font-bold text-brand-dark hover:underline">
                Browse Shop →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {recommendedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-extrabold text-slate-900">Related Smile Guides</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r._id}
                  href={`/blog/${r.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/15 shadow-sm"
                >
                  <div className="relative h-36 overflow-hidden bg-gradient-to-br from-brand-soft via-white to-brand-soft">
                    {r.coverImage && (
                      <SmartImage
                        src={r.coverImage}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-5 transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    {r.tag && (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">{r.tag}</span>
                    )}
                    <h3 className="mt-2 text-xs font-bold leading-snug text-slate-900 group-hover:text-brand-dark transition">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
