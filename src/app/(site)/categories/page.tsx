import { PageHero } from "@/components/SiteShell";
import { SmartImage } from "@/components/SmartImage";
import { categories as fallbackArt } from "@/lib/site-data";
import { getCategories, getProducts } from "@/lib/api/server";
import Link from "next/link";
import { ArrowRightIcon, SparkIcon } from "@/components/icons";

export const metadata = {
  title: "Shop by Category - OralCareBD",
  description: "Explore all oral care categories — toothpaste, whitening, mouthwash, toothbrushes and more.",
};

const cardStyles = [
  { img: "/images/products/p01.png", bg: "from-brand-soft via-brand-soft to-white" },
  { img: "/images/products/p04.png", bg: "from-brand-soft via-blue-50 to-white" },
  { img: "/images/products/p11.png", bg: "from-brand-soft via-white to-brand-soft" },
  { img: "/images/products/p02.png", bg: "from-brand-soft via-white to-brand-soft" },
];

export default async function CategoriesPage() {
  const list = await getCategories();
  // Product count per category = the paginated `total` from GET /products?category=…
  const counts = await Promise.all(list.map((c) => getProducts({ category: c._id, limit: 1 })));
  const bigCards = list.map((c, i) => ({
    slug: c.slug,
    title: c.name,
    desc: c.description || "Authentic, dentist-approved products.",
    img: c.image || cardStyles[i % cardStyles.length].img,
    bg: cardStyles[i % cardStyles.length].bg,
    count: counts[i].total,
  }));
  const round = list.map((c, i) => {
    const art = fallbackArt[i % fallbackArt.length];
    return { label: c.name, img: c.image || art.img, bg: art.bg, ring: art.ring, href: `/shop?category=${c.slug}` };
  });

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
        {bigCards.length === 0 && (
          <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 ring-1 ring-slate-100">
            Categories will appear here soon.
          </p>
        )}
        {/* Feature cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {bigCards.map((c) => {
            const count = c.count;
            return (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                className={`group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br ${c.bg} p-6 ring-1 ring-brand/15 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/15`}
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
                  <SmartImage
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
            {round.map((c, i) => (
              <Link
                key={c.label}
                href={c.href}
                className="group flex flex-col items-center text-center"
              >
                <span
                  className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ${c.bg} ring-2 ${c.ring} transition duration-500 group-hover:-translate-y-1 group-hover:shadow-lg`}
                >
                  <SmartImage
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
        <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-brand to-brand-blue p-10 text-center text-white">
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
