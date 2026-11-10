import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import {
  ArrowRightIcon,
  SparkIcon,
  SearchIcon,
} from "@/components/icons";
import { blogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog & Smile Tips - OralCareBD",
  description: "Expert oral care tips, product guides and dentist-approved routines.",
};

const tags = ["All", "Daily Habits", "Whitening", "Fresh Breath", "Kids", "Expert Picks"];

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;
  return (
    <>
      <PageHero
        title="Smile Tips & Expert Articles"
        subtitle="Dentist-approved advice, product guides and everything you need for a healthier smile."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tag filter + search */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <button
                key={t}
                type="button"
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  i === 0
                    ? "bg-brand text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <form className="relative">
            <input
              type="search"
              placeholder="Search articles..."
              className="h-9 w-56 rounded-full border border-slate-200 bg-white pl-4 pr-10 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white"
            >
              <SearchIcon className="h-3 w-3" />
            </button>
          </form>
        </div>

        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group mt-8 grid overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 ring-1 ring-emerald-100 transition hover:shadow-xl hover:shadow-emerald-100 md:grid-cols-2"
        >
          <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-white to-sky-100 p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 animate-blob rounded-full bg-emerald-300/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 animate-blob rounded-full bg-sky-300/50 blur-3xl" />
            <div className="relative h-64 w-64">
              <Image
                src={featured.img}
                alt={featured.title}
                fill
                sizes="256px"
                className="object-contain transition-transform duration-500 group-hover:scale-110"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              <SparkIcon className="h-3 w-3" />
              Featured Article
            </span>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl group-hover:text-brand-dark">
              {featured.title}
            </h2>
            <p className="mt-3 text-slate-600">{featured.excerpt}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <span>By <span className="font-semibold text-slate-700">{featured.author}</span></span>
              <span>·</span>
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.minutes} min read</span>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
              Read Article <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        {/* Article grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => {
            const tagCls =
              p.accent === "blue"
                ? "bg-brand-blue-soft text-brand-blue-dark"
                : "bg-brand-soft text-brand-dark";
            return (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100"
              >
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50">
                  <Image
                    src={p.img}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
                <div className="p-5">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tagCls}`}>
                    {p.tag}
                  </span>
                  <h3 className="mt-3 text-base font-bold leading-snug text-slate-900 group-hover:text-brand-dark">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{p.date}</span>
                    <span>{p.minutes} min read</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Newsletter CTA */}
        <section className="mt-14 rounded-3xl bg-gradient-to-r from-brand via-emerald-500 to-brand-blue p-8 text-center text-white">
          <h3 className="text-2xl font-extrabold">Never Miss a Smile Tip</h3>
          <p className="mx-auto mt-2 max-w-md text-sm opacity-90">
            Get our weekly dental care newsletter delivered to your inbox.
          </p>
          <form className="mx-auto mt-5 flex w-full max-w-md rounded-full bg-white p-1">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent px-5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-dark px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Subscribe
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
