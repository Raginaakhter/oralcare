import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader, StatusPill, EditIcon } from "../../AdminHeader";
import { DeleteButton } from "../../DeleteButton";
import { Stars } from "@/components/Stars";
import { products, getProductBySlug } from "@/lib/products";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/admin-dashboard/products/[slug]">) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  return { title: p ? `${p.name} — Admin` : "Product — Admin" };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/admin-dashboard/products/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Products", href: "/admin-dashboard/products" },
          { label: product.name },
        ]}
        title={product.name}
        description={`${product.brand} · ${product.slug}`}
        actions={
          <>
            <Link
              href={`/product/${product.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-brand hover:text-brand-dark"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View on Store
            </Link>
            <DeleteButton itemLabel={product.name} label="Delete" variant="button" />
            <Link
              href={`/admin-dashboard/products/${product.slug}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              <EditIcon />
              Edit Product
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        {/* Image + meta */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/70">
              <Image
                src={product.img}
                alt={product.name}
                fill
                sizes="(min-width:1280px) 400px, 90vw"
                className="object-contain p-8"
                priority
              />
              {product.badge && (
                <span
                  className={`absolute left-4 top-4 rounded-full ${product.badgeColor} px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-md`}
                >
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h3 className="text-sm font-black text-slate-900">Customer Rating</h3>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">{product.rating}</span>
              <span className="text-xs text-slate-500">/ 5.0</span>
            </div>
            <div className="mt-2">
              <Stars value={product.rating} />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Based on {product.reviews.toLocaleString()} customer reviews
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Price
                </div>
                <div className="mt-1 text-3xl font-black text-slate-900">
                  {product.price}
                </div>
              </div>
              <StatusPill tone="success">In Stock</StatusPill>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCell label="Brand" value={product.brand} />
            <InfoCell
              label="Category"
              value={product.category.replace("-", " ")}
              capitalize
            />
            <InfoCell label="SKU" value={`OCB-${product.slug.slice(0, 3).toUpperCase()}-001`} mono />
            <InfoCell label="Slug" value={product.slug} mono />
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h3 className="text-sm font-black text-slate-900">Sales Overview</h3>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-slate-900">184</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Units Sold
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-brand-dark">৳1,01,316</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Revenue
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">4.8%</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Conversion
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCell({
  label,
  value,
  mono,
  capitalize,
}: {
  label: string;
  value: string;
  mono?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div
        className={`mt-1 text-sm font-bold text-slate-900 ${mono ? "font-mono text-xs" : ""} ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
