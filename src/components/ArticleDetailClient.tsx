"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { blogPosts } from "@/lib/blog";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { PageHero } from "@/components/SiteShell";
import {
  ArrowRightIcon,
  SparkIcon,
  CheckBadgeIcon,
  WhatsappIcon,
  FacebookIcon,
} from "@/components/icons";
import { useStore } from "@/context/StoreContext";

export function ArticleDetailClient({ post }: { post: BlogPost }) {
  const { showToast } = useStore();

  const [helpfulVotes, setHelpfulVotes] = useState<{ yes: number; no: number; userVoted: boolean }>({
    yes: 42,
    no: 1,
    userVoted: false,
  });

  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Sadia Anjum",
      date: "2 days ago",
      text: "This explanation was so clear! I always rinsed with water right after brushing, had no idea I was washing away the fluoride.",
    },
    {
      id: 2,
      author: "Tanvir Hasan",
      date: "5 days ago",
      text: "Ordered the recommended toothpaste from here and got it in Dhaka the next day. Very helpful advice.",
    },
  ]);

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const handleVote = (vote: "yes" | "no") => {
    if (helpfulVotes.userVoted) {
      showToast("You have already voted on this article", "info");
      return;
    }
    setHelpfulVotes((prev) => ({
      ...prev,
      [vote]: prev[vote] + 1,
      userVoted: true,
    }));
    showToast("Thank you for your feedback!", "success");
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    setComments([
      {
        id: Date.now(),
        author: commentName.trim(),
        date: "Just now",
        text: commentText.trim(),
      },
      ...comments,
    ]);
    setCommentName("");
    setCommentText("");
    setCommentSubmitted(true);
    showToast("Comment posted successfully!", "success");
    setTimeout(() => setCommentSubmitted(false), 4000);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Article link copied to clipboard!", "success");
    }
  };

  // Find recommended products
  const recommendedProducts = post.recommendedProductSlugs
    ? products.filter((p) => post.recommendedProductSlugs?.includes(p.slug))
    : products.slice(0, 2);

  // Related articles
  const related = blogPosts
    .filter((p) => p.slug !== post.slug && (p.tag === post.tag || p.accent === post.accent))
    .slice(0, 3);

  const tagCls =
    post.accent === "blue"
      ? "bg-sky-50 text-sky-700 ring-sky-200"
      : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Articles", href: "/blog" },
          { label: post.tag },
        ]}
      />

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Meta Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider ring-1 ${tagCls}`}
            >
              {post.tag}
            </span>
            <span>
              Written by{" "}
              <strong className="text-slate-900">{post.author}</strong>{" "}
              {post.authorRole && (
                <span className="text-slate-400">({post.authorRole})</span>
              )}
            </span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.minutes} min read</span>
          </div>

          {/* Social share */}
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
              href={`https://wa.me/?text=${encodeURIComponent(
                `${post.title} - Read more on OralCareBD`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition ring-1 ring-emerald-200"
            >
              <WhatsappIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mb-10 h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft ring-1 ring-brand/15 sm:h-96 shadow-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 animate-blob rounded-full bg-slate-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 animate-blob rounded-full bg-slate-200/50 blur-3xl" />
          <Image
            src={post.img}
            alt={post.title}
            fill
            sizes="(min-width: 768px) 800px, 100vw"
            className="object-contain p-10"
            priority
          />
        </div>

        {/* Table of Contents */}
        {post.sections && post.sections.length > 1 && (
          <div className="mb-10 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
              Table of Contents
            </h3>
            <ul className="space-y-2 text-xs font-bold text-slate-700">
              {post.sections.map((sec, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i}`}
                    className="hover:text-brand-dark transition flex items-center gap-2"
                  >
                    <span className="text-brand">→</span> {sec.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Sections */}
        <article className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">
          {post.sections ? (
            post.sections.map((sec, idx) => (
              <section key={idx} id={`section-${idx}`} className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                  {sec.heading}
                </h2>
                <p className="leading-relaxed">{sec.content}</p>

                {sec.tip && (
                  <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 text-xs sm:text-sm text-emerald-950 flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-xs">
                      💡
                    </span>
                    <div>
                      <strong className="block text-emerald-900 font-bold mb-0.5">
                        Dentist Tip
                      </strong>
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

        {/* Author Bio Box */}
        <div className="mt-12 flex flex-wrap items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-soft p-6 ring-1 ring-brand/15 shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-dark ring-1 ring-brand/15 shadow-sm">
            <SparkIcon className="h-6 w-6" />
          </span>
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-black text-slate-900">{post.author}</div>
            <div className="text-xs text-brand-dark font-semibold">
              {post.authorRole || "Oral Health Specialist"}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Verified clinical contributor for OralCareBD. Providing safe, dentist-approved hygiene routines for families across Bangladesh.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-dark ring-1 ring-brand/15 hover:bg-brand-soft shadow-sm"
          >
            All Articles
            <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </div>

        {/* Recommended Products for this Topic with Direct Add to Cart / Buy Now! */}
        {recommendedProducts.length > 0 && (
          <section className="mt-14 rounded-3xl bg-slate-50 p-6 sm:p-8 ring-1 ring-slate-200">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark">
                  Featured In This Article
                </span>
                <h3 className="mt-1 text-xl font-black text-slate-900">
                  Recommended Products for this Routine
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-brand-dark hover:underline"
              >
                Browse Shop →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {recommendedProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Was this article helpful? */}
        <div className="mt-10 rounded-2xl bg-white p-6 ring-1 ring-slate-100 shadow-sm text-center">
          <h4 className="text-sm font-bold text-slate-800">
            Did you find this dental article helpful?
          </h4>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              onClick={() => handleVote("yes")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
            >
              👍 Yes ({helpfulVotes.yes})
            </button>
            <button
              onClick={() => handleVote("no")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 hover:border-rose-400 hover:text-rose-600"
            >
              👎 No ({helpfulVotes.no})
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mt-14 rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-slate-100 shadow-sm">
          <h3 className="text-base font-black text-slate-900">
            Discussion & Questions ({comments.length})
          </h3>

          {commentSubmitted && (
            <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
              Your comment has been posted! Our dental experts will reply if you asked a question.
            </div>
          )}

          <form onSubmit={handlePostComment} className="mt-5 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="e.g. Mahfuzur Rahman"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-brand"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Comment or Dental Question <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ask about this routine or share your dental experience..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:border-brand"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-dark transition"
            >
              Post Comment
            </button>
          </form>

          {/* Comment list */}
          <div className="mt-8 divide-y divide-slate-100">
            {comments.map((c) => (
              <div key={c.id} className="py-4 first:pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{c.author}</span>
                  <span className="text-[11px] text-slate-400">{c.date}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-extrabold text-slate-900">
              Related Smile Guides
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/15 shadow-sm"
                >
                  <div className="relative h-36 overflow-hidden bg-gradient-to-br from-brand-soft via-white to-brand-soft">
                    <Image
                      src={r.img}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain p-5 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                      {r.tag}
                    </span>
                    <h3 className="mt-2 text-xs font-bold leading-snug text-slate-900 group-hover:text-brand-dark transition">
                      {r.title}
                    </h3>
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
