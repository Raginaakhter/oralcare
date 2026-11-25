import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArticleDetailClient } from "@/components/ArticleDetailClient";
import { getBlogPost, getBlogPosts, getProduct } from "@/lib/api/server";
import type { Product } from "@/lib/api/types";

/** Placeholder used only when no posts are published/reachable at build time. */
const FALLBACK_SLUG = "__no-post__";

export async function generateStaticParams() {
  // Cache Components needs at least one param; prerender the latest posts.
  const page = await getBlogPosts({ limit: 20 });
  const slugs = page.items.map((p) => ({ slug: p.slug }));
  return slugs.length ? slugs : [{ slug: FALLBACK_SLUG }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = slug === FALLBACK_SLUG ? null : await getBlogPost(slug);
  if (!post) return { title: "Article Not Found - OralCareBD" };
  return {
    title: post.metaTitle || `${post.title} - OralCareBD Dental Guide`,
    description: post.metaDescription || post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, ...(post.coverImage ? { images: [post.coverImage] } : {}) },
  };
}

/**
 * `params` is read inside <Suspense> so slugs that weren't prerendered (posts
 * published after the build) still navigate instantly with a skeleton.
 */
export default function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <BlogPost params={params} />
    </Suspense>
  );
}

function ArticleSkeleton() {
  return (
    <main className="mx-auto w-full max-w-4xl animate-pulse px-4 py-12" aria-busy="true">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="mt-4 h-9 w-3/4 rounded bg-slate-200" />
      <div className="mt-8 aspect-[16/7] w-full rounded-3xl bg-slate-100" />
      <div className="mt-8 space-y-3">
        <div className="h-4 rounded bg-slate-100" />
        <div className="h-4 rounded bg-slate-100" />
        <div className="h-4 w-2/3 rounded bg-slate-100" />
      </div>
    </main>
  );
}

async function BlogPost({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const post = slug === FALLBACK_SLUG ? null : await getBlogPost(slug);
  if (!post) notFound();

  // The post carries compact product cards; ProductCard needs the full product.
  const [full, sameTag] = await Promise.all([
    Promise.all(post.recommendedProducts.map((p) => getProduct(p.slug))),
    getBlogPosts({ tag: post.tag, limit: 4 }),
  ]);
  const recommended = full.filter((p): p is Product => p !== null);
  const related = sameTag.items.filter((p) => p._id !== post._id).slice(0, 3);

  return <ArticleDetailClient post={post} recommendedProducts={recommended} related={related} />;
}
