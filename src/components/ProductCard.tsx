import Image from "next/image";
import Link from "next/link";
import {
  CartIcon,
  HeartIcon,
  SparkIcon,
} from "@/components/icons";
import { Stars } from "@/components/Stars";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { name, price, rating, reviews, badge, badgeColor, img, href, brand } = product;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 hover:ring-brand/30">
      {badge && (
        <span
          className={`absolute left-4 top-4 z-10 rounded-full ${badgeColor} px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-md`}
        >
          {badge}
        </span>
      )}

      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
        <button
          aria-label="Add to wishlist"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-100 transition hover:bg-rose-50 hover:text-rose-500"
        >
          <HeartIcon className="h-4 w-4" />
        </button>
        <button
          aria-label="Quick view"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-100 transition hover:bg-brand-soft hover:text-brand-dark"
        >
          <SparkIcon className="h-4 w-4" />
        </button>
      </div>

      <Link
        href={href}
        className="relative block overflow-hidden rounded-xl bg-white"
      >
        <div className="relative aspect-square">
          <Image
            src={img}
            alt={name}
            fill
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-x-3 bottom-3 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-brand-dark">
            <CartIcon className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>
      </Link>

      <div className="mt-3 px-1">
        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-dark">
          {brand}
        </div>
        <Link href={href}>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-slate-900 hover:text-brand-dark">
            {name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <Stars value={rating} />
          <span className="text-[11px]">({reviews.toLocaleString()})</span>
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <div className="text-lg font-black text-slate-900">{price}</div>
          </div>
          <button
            aria-label="Add to cart"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg"
          >
            <CartIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
