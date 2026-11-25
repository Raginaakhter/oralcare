import { Suspense } from "react";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRightIcon, SearchIcon } from "@/components/icons";
import { getBrand, getBrands, getCategories, getProducts } from "@/lib/api/server";
import type { ProductListQuery } from "@/lib/api/types";
import { ShopSortSelect } from "./ShopSortSelect";

export const metadata = {
  title: "Shop All Products - OralCareBD",
  description:
    "Browse 100% authentic oral care products - toothpaste, mouthwash, whitening kits and more.",
};

export const instant = false;

const PAGE_SIZE = 24;
const SORTS = ["newest", "oldest", "price-asc", "price-desc", "popularity"] as const;

type SP = { [key: string]: string | string[] | undefined };
const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");
const num = (v: string | string[] | undefined) => {
  const n = Number(str(v));
  return str(v) !== "" && Number.isFinite(n) && n >= 0 ? n : undefined;
};

function hrefWith(current: SP, patch: Record<string, string | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) if (typeof v === "string" && v) p.set(k, v);
  for (const [k, v] of Object.entries(patch)) {
    if (v) p.set(k, v);
    else p.delete(k);
  }
  const s = p.toString();
  return s ? `/shop?${s}` : "/shop";
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SP> }) {
  const params = await searchParams;
  const activeCat = str(params.category);
  const activeBrand = str(params.brand);
  const q = str(params.q);
  const tag = str(params.tag);
  const sortParam = str(params.sort);
  const sort = (SORTS as readonly string[]).includes(sortParam)
    ? (sortParam as ProductListQuery["sort"])
    : "newest";
  const minPrice = num(params.minPrice);
  const maxPrice = num(params.maxPrice);
  const page = Math.max(1, Math.floor(num(params.page) ?? 1));
  const featured = str(params.featured) === "true";
  const inStock = str(params.inStock) === "true";

  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);
  const category = categories.find((c) => c.slug === activeCat);
  const brand = brands.find((b) => b.slug === activeBrand);
  // Full brand record (description) for the page header — GET /brands/:slug.
  const brandDetail = brand ? await getBrand(brand.slug) : null;

  const result = await getProducts({
    search: q || undefined,
    category: category?._id,
    brand: brand?._id,
    tag: tag || undefined,
    minPrice,
    maxPrice,
    sort,
    isFeatured: featured || undefined,
    stockStatus: inStock ? "in-stock" : undefined,
    page,
    limit: PAGE_SIZE,
  });
  const list = result.items;

  const title = category?.name ?? brand?.name ?? (tag ? `#${tag}` : q ? `Search: “${q}”` : "All Products");

  return (
    <>
      <PageHero
        title={title}
        subtitle={
          brandDetail?.description ||
          `${result.total} authentic product${result.total === 1 ? "" : "s"} — fast delivery across Bangladesh.`
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          ...(category ? [{ label: category.name }] : []),
          ...(brand ? [{ label: brand.name }] : []),
        ]}
      />

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 sm:py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Search</h3>
            <form action="/shop" className="relative">
              {activeCat && <input type="hidden" name="category" value={activeCat} />}
              {activeBrand && <input type="hidden" name="brand" value={activeBrand} />}
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

          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Categories</h3>
            <ul className="space-y-2 text-sm">
              {[{ slug: "", name: "All Products" }, ...categories].map((c) => {
                const active = c.slug === activeCat;
                return (
                  <li key={c.slug || "all"}>
                    <Link
                      href={hrefWith(params, { category: c.slug || undefined, page: undefined })}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${
                        active ? "bg-brand-soft font-semibold text-brand-dark" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {c.name}
                      <ArrowRightIcon className="h-3 w-3" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {brands.length > 0 && (
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
              <h3 className="mb-3 text-sm font-bold text-slate-900">Brands</h3>
              <ul className="space-y-1.5 text-sm">
                {brands.map((b) => {
                  const active = b.slug === activeBrand;
                  return (
                    <li key={b._id}>
                      <Link
                        href={hrefWith(params, { brand: active ? undefined : b.slug, page: undefined })}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                          active ? "font-semibold text-brand-dark" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            active ? "border-brand bg-brand text-white" : "border-slate-300"
                          } text-[10px]`}
                        >
                          {active ? "✓" : ""}
                        </span>
                        {b.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Price Range (৳)</h3>
            <form action="/shop" className="space-y-3">
              {Object.entries(params).map(([k, v]) =>
                typeof v === "string" && !["minPrice", "maxPrice", "page"].includes(k) ? (
                  <input key={k} type="hidden" name={k} value={v} />
                ) : null
              )}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="minPrice"
                  min={0}
                  defaultValue={minPrice}
                  placeholder="Min"
                  className="h-9 w-full rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-brand"
                />
                <span className="text-slate-400">–</span>
                <input
                  type="number"
                  name="maxPrice"
                  min={0}
                  defaultValue={maxPrice}
                  placeholder="Max"
                  className="h-9 w-full rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-brand"
                />
              </div>
              <button className="w-full rounded-full bg-slate-900 py-2 text-xs font-bold text-white hover:bg-brand-dark">
                Apply
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 space-y-2 text-sm">
            <Link
              href={hrefWith(params, { inStock: inStock ? undefined : "true", page: undefined })}
              className={`flex items-center gap-2 ${inStock ? "font-semibold text-brand-dark" : "text-slate-600"}`}
            >
              <span className={`h-4 w-4 rounded border ${inStock ? "border-brand bg-brand" : "border-slate-300"}`} />
              In stock only
            </Link>
            <Link
              href={hrefWith(params, { featured: featured ? undefined : "true", page: undefined })}
              className={`flex items-center gap-2 ${featured ? "font-semibold text-brand-dark" : "text-slate-600"}`}
            >
              <span className={`h-4 w-4 rounded border ${featured ? "border-brand bg-brand" : "border-slate-300"}`} />
              Featured
            </Link>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar pb-1 lg:hidden">
            {[{ slug: "", name: "All Products" }, ...categories].map((c) => {
              const active = c.slug === activeCat;
              return (
                <Link
                  key={c.slug || "all"}
                  href={hrefWith(params, { category: c.slug || undefined, page: undefined })}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                    active ? "bg-brand text-white shadow-sm" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>

          <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-white p-3.5 sm:p-4 ring-1 ring-slate-100">
            <div className="text-xs sm:text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-800">{list.length}</span> of {result.total} products
            </div>
            <Suspense fallback={null}>
              <ShopSortSelect value={sort ?? "newest"} />
            </Suspense>
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-slate-100">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <SearchIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products found</h3>
              <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
              <Link
                href="/shop"
                className="mt-4 inline-flex rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {result.totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-1 text-sm" aria-label="Pagination">
              {page > 1 && (
                <Link
                  href={hrefWith(params, { page: String(page - 1) })}
                  className="rounded-full px-4 py-2 font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Prev
                </Link>
              )}
              {Array.from({ length: result.totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === result.totalPages || Math.abs(n - page) <= 2)
                .map((n) => (
                  <Link
                    key={n}
                    href={hrefWith(params, { page: n === 1 ? undefined : String(n) })}
                    className={`min-w-9 rounded-full px-3 py-2 text-center font-semibold ${
                      n === page ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {n}
                  </Link>
                ))}
              {page < result.totalPages && (
                <Link
                  href={hrefWith(params, { page: String(page + 1) })}
                  className="rounded-full px-4 py-2 font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </>
  );
}
