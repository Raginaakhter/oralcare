import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import { products } from "@/lib/products";
import {
  ArrowRightIcon,
  CartIcon,
  HeartIcon,
} from "@/components/icons";
import { Stars } from "@/app/page";

export const metadata = {
  title: "My Wishlist - OralCareBD",
};

const saved = [products[0], products[8], products[10], products[14]];

export default function WishlistPage() {
  return (
    <>
      <PageHero
        title="My Wishlist"
        subtitle={`${saved.length} saved item${saved.length === 1 ? "" : "s"} waiting for you.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100">
          <table className="hidden w-full md:table">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Rating</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {saved.map((p) => (
                <tr key={p.slug} className="border-t border-slate-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link href={p.href} className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-50">
                        <Image src={p.img} alt={p.name} fill sizes="64px" className="object-contain p-1" />
                      </Link>
                      <div>
                        <Link href={p.href} className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-brand-dark">
                          {p.name}
                        </Link>
                        <div className="mt-0.5 text-xs text-slate-500">{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Stars value={p.rating} />
                      <span>({p.reviews})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-extrabold text-slate-900">{p.price}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-dark">
                      In Stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark">
                        <CartIcon className="h-3.5 w-3.5" />
                        Add
                      </button>
                      <button
                        aria-label="Remove"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                      >
                        &times;
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile list */}
          <div className="divide-y divide-slate-100 md:hidden">
            {saved.map((p) => (
              <div key={p.slug} className="flex items-center gap-4 p-4">
                <Link href={p.href} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                  <Image src={p.img} alt={p.name} fill sizes="80px" className="object-contain p-2" />
                </Link>
                <div className="flex-1">
                  <Link href={p.href} className="line-clamp-2 text-sm font-semibold text-slate-900">
                    {p.name}
                  </Link>
                  <div className="mt-1 text-sm font-bold text-brand-dark">{p.price}</div>
                  <button className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white">
                    <CartIcon className="h-3.5 w-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state demo card */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-soft via-white to-sky-50 p-6 ring-1 ring-emerald-100">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand ring-1 ring-emerald-100">
              <HeartIcon className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-slate-900">Share Your Wishlist</h3>
              <p className="mt-1 text-sm text-slate-600">Send your list to friends and family.</p>
            </div>
            <button className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark">
              Share
            </button>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-blue-soft via-white to-sky-50 p-6 ring-1 ring-blue-100"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-blue-dark ring-1 ring-blue-100">
              <ArrowRightIcon className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-slate-900">Continue Shopping</h3>
              <p className="mt-1 text-sm text-slate-600">Find more products to love.</p>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
