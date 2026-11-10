import Image from "next/image";
import Link from "next/link";
import {
  AdminHeader,
  PlusIcon,
  EditIcon,
} from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { adminCategories } from "./data";
import { products } from "@/lib/products";

export const metadata = { title: "Categories — Admin — OralCareBD" };

const productCategoryMap: Record<string, string> = {
  toothbrushes: "toothbrushes",
  toothpaste: "toothpaste",
  "teeth-whitening": "teeth-whitening",
  "floss-mouthwash": "floss-mouthwash",
  "electric-brushes": "toothbrushes",
  "dental-floss": "floss-mouthwash",
  "kids-oral-care": "specials",
};

export default function CategoriesPage() {
  const enriched = adminCategories.map((c) => ({
    ...c,
    productCount: products.filter(
      (p) => p.category === productCategoryMap[c.slug]
    ).length,
  }));

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Categories" }]}
        title="Categories"
        description={`${enriched.length} categories organising your catalog.`}
        actions={
          <Link
            href="/admin-dashboard/categories/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            <PlusIcon />
            Add Category
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {enriched.map((c) => (
          <div
            key={c.slug}
            className="group relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60"
          >
            <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
              <Link
                href={`/admin-dashboard/categories/${c.slug}/edit`}
                aria-label="Edit"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <EditIcon />
              </Link>
              <DeleteButton itemLabel={c.label} />
            </div>

            <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${c.bg} ring-2 ${c.ring}`}>
              <Image src={c.img} alt={c.label} width={64} height={64} className="h-14 w-14 object-contain" />
            </div>
            <h3 className="mt-4 text-base font-black text-slate-900">{c.label}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{c.description}</p>
            <div className="mt-2 text-xs font-semibold text-slate-500">
              {c.productCount} {c.productCount === 1 ? "product" : "products"}
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
              <Link
                href={`/shop?category=${c.slug}`}
                target="_blank"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-dark"
              >
                View Products
              </Link>
              <Link
                href={`/admin-dashboard/categories/${c.slug}/edit`}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-dark"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}

        <Link
          href="/admin-dashboard/categories/new"
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-slate-500 transition hover:border-brand hover:bg-brand-soft hover:text-brand-dark"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200 group-hover:ring-brand">
            <PlusIcon />
          </span>
          <span className="text-sm font-bold">Add New Category</span>
        </Link>
      </div>
    </div>
  );
}
