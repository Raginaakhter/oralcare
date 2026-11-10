import Image from "next/image";
import { PageHero } from "@/components/SiteShell";
import { categories } from "@/lib/site-data";
import { products } from "@/lib/products";
import Link from "next/link";
import { ArrowRightIcon, SparkIcon } from "@/components/icons";

export const metadata = {
  title: "Shop by Category - OralCareBD",
  description: "Explore all oral care categories — toothpaste, whitening, mouthwash, toothbrushes and more.",
};

const bigCards = [
  {
    slug: "teeth-whitening",
    title: "Teeth Whitening",
    desc: "Professional whitening kits, purple pastes and charcoal formulas for a brighter smile.",
    img: "/images/products/p01.png",
    bg: "from-emerald-100 via-emerald-50 to-white",
  },
  {
    slug: "toothpaste",
    title: "Toothpaste",
    desc: "Daily sensitivity care, whitening and gum-health pastes from trusted brands.",
    img: "/images/products/p04.png",
    bg: "from-sky-100 via-blue-50 to-white",
  },
  {
    slug: "floss-mouthwash",
    title: "Floss & Mouthwash",
    desc: "Dentist-formulated rinses and flosses for all-day freshness.",
    img: "/images/products/p11.png",
    bg: "from-violet-100 via-emerald-50 to-white",
  },
  {
    slug: "toothbrushes",
    title: "Toothbrushes",
    desc: "Manual and electric brushes for every mouth and every smile.",
    img: "/images/products/p02.png",
    bg: "from-rose-100 via-amber-50 to-white",
  },
];

export default function CategoriesPage() {
  return (
    <>
      <PageHero
        title="Shop by Category"
        subtitle="Browse our full range of dentist-approved oral care categories."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories" },
        ]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Feature cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {bigCards.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                className={`group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br ${c.bg} p-6 ring-1 ring-emerald-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100`}
              >
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-dark backdrop-blur-md">
                    <SparkIcon className="h-3 w-3" />
                    {count} Products
                  </span>
                  <h3 className="mt-3 text-2xl font-extrabold text-slate-900">{c.title}</h3>
                  <p className="mt-2 max-w-xs text-sm text-slate-600">{c.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
                    Browse Collection
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="relative h-32 w-32 shrink-0 sm:h-40 sm:w-40">
                  <Image
                    src={c.img}
                    alt={c.title}
                    fill
                    sizes="160px"
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Round category strip */}
        <div className="mt-14">
          <h2 className="mb-6 text-xl font-extrabold text-slate-900">Quick Browse</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
            {categories.map((c, i) => (
              <Link
                key={c.label}
                href={c.href}
                className="group flex flex-col items-center text-center"
              >
                <span
                  className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ${c.bg} ring-2 ${c.ring} transition duration-500 group-hover:-translate-y-1 group-hover:shadow-lg`}
                >
                  <Image
                    src={c.img}
                    alt={c.label}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                </span>
                <span className="mt-3 text-sm font-semibold text-slate-800">{c.label}</span>
                <span
                  className={`mt-1 text-xs font-medium ${
                    i % 2 === 0 ? "text-brand-dark" : "text-brand-blue-dark"
                  }`}
                >
                  Shop Now
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-emerald-500 to-brand-blue p-10 text-center text-white">
          <h2 className="text-3xl font-extrabold">Not Sure What You Need?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Our customer care team can recommend the right products for your daily routine.
          </p>
          <Link
            href="/contact-us"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-slate-100"
          >
            Get Expert Advice <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </>
  );
}
