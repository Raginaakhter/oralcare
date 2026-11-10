import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { ProductCard } from "@/components/ProductCard";
import { Stars } from "@/components/Stars";
import { products, getProductBySlug, categoryLabels } from "@/lib/products";
import {
  ArrowRightIcon,
  CartIcon,
  HeartIcon,
  ShieldIcon,
  TruckIcon,
  ReturnIcon,
  CheckBadgeIcon,
  SparkIcon,
} from "@/components/icons";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <PageHero
        title={product.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          {
            label: categoryLabels[product.category] ?? product.category,
            href: `/shop?category=${product.category}`,
          },
          { label: product.brand },
        ]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main detail */}
        <section className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="relative">
            <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 animate-blob rounded-full bg-emerald-200/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 animate-blob rounded-full bg-sky-200/60 blur-3xl" />
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 ring-1 ring-emerald-100">
              <Image
                src={product.img}
                alt={product.name}
                fill
                sizes="(min-width: 768px) 500px, 90vw"
                className="object-contain p-10"
                priority
              />
              {product.badge && (
                <span
                  className={`absolute left-6 top-6 rounded-full ${product.badgeColor} px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md`}
                >
                  {product.badge}
                </span>
              )}
            </div>
            {/* Thumbnail strip */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[product.img, product.img, product.img, product.img].map((img, i) => (
                <button
                  key={i}
                  className={`relative aspect-square overflow-hidden rounded-xl bg-slate-50 ring-2 transition ${
                    i === 0 ? "ring-brand" : "ring-slate-100 hover:ring-slate-200"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="100px" className="object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
              <SparkIcon className="h-3 w-3" />
              {product.brand}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <Stars value={product.rating} />
              <span className="text-sm text-slate-500">
                {product.rating} · ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-slate-900">{product.price}</span>
              <span className="text-sm text-slate-500">incl. VAT</span>
            </div>

            <p className="mt-5 text-slate-600">{product.description}</p>

            <div className="mt-6 flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 font-semibold text-brand-dark">
                <CheckBadgeIcon className="h-3.5 w-3.5" />
                In Stock
              </span>
              <span className="text-slate-500">Dispatches in 24 hours</span>
            </div>

            {/* Quantity + Add */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                <button className="h-11 w-11 rounded-l-full text-lg text-slate-500 hover:bg-slate-50">
                  -
                </button>
                <span className="w-10 text-center text-sm font-semibold">1</span>
                <button className="h-11 w-11 rounded-r-full text-lg text-slate-500 hover:bg-slate-50">
                  +
                </button>
              </div>
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark">
                <CartIcon className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                aria-label="Add to wishlist"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-dark ring-1 ring-slate-200 hover:bg-brand-soft"
              >
                <HeartIcon className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-blue-dark px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
            >
              Buy Now <ArrowRightIcon className="h-4 w-4" />
            </button>

            {/* Trust strip */}
            <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand">
                  <ShieldIcon className="h-4 w-4" />
                </span>
                <span className="font-semibold text-slate-700">Authentic</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-blue-dark">
                  <TruckIcon className="h-4 w-4" />
                </span>
                <span className="font-semibold text-slate-700">Free Ship ৳1,500+</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand">
                  <ReturnIcon className="h-4 w-4" />
                </span>
                <span className="font-semibold text-slate-700">7-day Returns</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mt-16 rounded-3xl bg-white p-8 ring-1 ring-slate-100">
          <div className="flex gap-6 border-b border-slate-100 pb-4">
            <button className="border-b-2 border-brand pb-2 text-sm font-bold text-brand-dark">
              Description
            </button>
            <button className="pb-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
              Specifications
            </button>
            <button className="pb-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
              Reviews ({product.reviews})
            </button>
          </div>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <p>{product.description}</p>
            <p>
              Each {product.brand} product is sourced directly from Australia and arrives
              sealed, authentic and with full shelf life.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
                Dentist recommended &amp; enamel-safe
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
                Suitable for daily use on sensitive teeth
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
                Ships from our Dhaka warehouse within 24 hours
              </li>
            </ul>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-bold text-slate-900">You May Also Like</h2>
              <Link
                href={`/shop?category=${product.category}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark"
              >
                View All <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
