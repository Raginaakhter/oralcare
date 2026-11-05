import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import { ProductCard } from "@/app/page";
import {
  products,
  getProductsByCategory,
  categoryLabels,
} from "@/lib/products";
import { brands } from "@/lib/site-data";
import { ArrowRightIcon, SearchIcon } from "@/components/icons";

export const metadata = {
  title: "Shop All Products - OralCareBD",
  description:
    "Browse 100% authentic oral care products - toothpaste, mouthwash, whitening kits and more.",
};

export const instant = false;

const categoryFilters = [
  { slug: "", label: "All Products" },
  ...Object.entries(categoryLabels).map(([slug, label]) => ({ slug, label })),
];

export default async function ShopPage({
  searchParams,
}: PageProps<"/shop">) {
  const params = await searchParams;
  const activeCat =
    typeof params.category === "string" ? params.category : "";
  const q = typeof params.q === "string" ? params.q.toLowerCase() : "";

  let list = getProductsByCategory(activeCat || undefined);
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  const title = activeCat
    ? categoryLabels[activeCat] ?? "Shop"
    : "All Products";

  return (
    <>
      <PageHero
        title={title}
        subtitle={`${list.length} authentic product${list.length === 1 ? "" : "s"} — fast delivery across Bangladesh.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          ...(activeCat ? [{ label: categoryLabels[activeCat] ?? activeCat }] : []),
        ]}
      />

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="space-y-6">
          {/* Search */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Search</h3>
            <form action="/shop" className="relative">
              {activeCat && (
                <input type="hidden" name="category" value={activeCat} />
              )}
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search products..."
                className="h-10 w-full rounded-full border border-slate-200 bg-white pl-4 pr-10 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-dark"
              >
                <SearchIcon className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {/* Categories */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categoryFilters.map((c) => {
                const active = (c.slug || "") === (activeCat || "");
                const href = c.slug ? `/shop?category=${c.slug}` : "/shop";
                return (
                  <li key={c.slug || "all"}>
                    <Link
                      href={href}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${
                        active
                          ? "bg-brand-soft font-semibold text-brand-dark"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {c.label}
                      <ArrowRightIcon className="h-3 w-3" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Brands */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Brands</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {brands.map((b) => (
                <li key={b.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-brand"
                    id={`brand-${b.name}`}
                  />
                  <label htmlFor={`brand-${b.name}`}>{b.name}</label>
                </li>
              ))}
            </ul>
          </div>

          {/* Price range */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Price Range</h3>
            <input type="range" min="0" max="10000" defaultValue="10000" className="w-full accent-brand" />
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>৳0</span>
              <span>৳10,000+</span>
            </div>
          </div>

          {/* Promo card */}
          <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-blue-dark p-5 text-white">
            <div className="text-xs font-bold uppercase tracking-wider opacity-90">
              Special Offer
            </div>
            <h3 className="mt-2 text-lg font-extrabold">25% off all Whitening</h3>
            <p className="mt-1 text-sm opacity-90">Limited time — this week only.</p>
            <Link
              href="/shop?category=teeth-whitening"
              className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-dark"
            >
              Shop Now <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
        </aside>

        <section>
          <div className="mb-5 flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-slate-100">
            <div className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-800">{list.length}</span> of {products.length} products
            </div>
            <select className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none">
              <option>Default sorting</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
              <option>Newest First</option>
            </select>
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-slate-100">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <SearchIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your filters or search terms.
              </p>
              <Link href="/shop" className="mt-4 inline-flex rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
