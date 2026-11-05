import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog";
import { ArrowRightIcon, SparkIcon } from "@/components/icons";

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Article not found - OralCareBD" };
  return {
    title: `${post.title} - OralCareBD Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.tag === post.tag)
    .slice(0, 3);

  const tagCls =
    post.accent === "blue"
      ? "bg-brand-blue-soft text-brand-blue-dark"
      : "bg-brand-soft text-brand-dark";

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.tag },
        ]}
      />

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Meta row */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${tagCls}`}>
            {post.tag}
          </span>
          <span>By <span className="font-semibold text-slate-700">{post.author}</span></span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.minutes} min read</span>
        </div>

        {/* Hero image */}
        <div className="relative mb-10 h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 ring-1 ring-emerald-100 sm:h-96">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 animate-blob rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 animate-blob rounded-full bg-sky-200/50 blur-3xl" />
          <Image
            src={post.img}
            alt={post.title}
            fill
            sizes="(min-width: 768px) 800px, 100vw"
            className="object-contain p-10"
            priority
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        {/* Body */}
        <article className="space-y-5 text-base leading-relaxed text-slate-700">
          {post.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        {/* Author card */}
        <div className="mt-12 flex flex-wrap items-center gap-4 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 ring-1 ring-emerald-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-dark ring-1 ring-emerald-100">
            <SparkIcon className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <div className="text-sm font-bold text-slate-900">{post.author}</div>
            <div className="text-xs text-slate-500">
              Published {post.date} · {post.minutes} min read
            </div>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-dark ring-1 ring-emerald-100 hover:bg-brand-soft"
          >
            <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
            All Articles
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-extrabold text-slate-900">
              More in <span className="text-brand-dark">{post.tag}</span>
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => {
                const rTagCls =
                  r.accent === "blue"
                    ? "bg-brand-blue-soft text-brand-blue-dark"
                    : "bg-brand-soft text-brand-dark";
                return (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100"
                  >
                    <div className="relative h-36 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50">
                      <Image
                        src={r.img}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-5 transition-transform duration-500 group-hover:scale-110"
                        style={{ mixBlendMode: "multiply" }}
                      />
                    </div>
                    <div className="p-5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${rTagCls}`}>
                        {r.tag}
                      </span>
                      <h3 className="mt-3 text-sm font-bold leading-snug text-slate-900 group-hover:text-brand-dark">
                        {r.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
