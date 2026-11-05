import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import { products } from "@/lib/products";
import {
  ArrowRightIcon,
  CartIcon,
  TruckIcon,
  ShieldIcon,
  CheckBadgeIcon,
} from "@/components/icons";

export const metadata = {
  title: "Shopping Cart - OralCareBD",
};

// Sample items for a non-empty cart look
const sampleCart = [
  { ...products[0], qty: 1 },
  { ...products[10], qty: 2 },
  { ...products[2], qty: 1 },
];

function parsePrice(p: string) {
  return parseFloat(p.replace(/[^\d.]/g, ""));
}

export default function CartPage() {
  const subtotal = sampleCart.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0);
  const shipping = subtotal > 1500 ? 0 : 120;
  const discount = Math.round(subtotal * 0.1);
  const total = subtotal + shipping - discount;

  const fmt = (n: number) => `৳${n.toLocaleString("en-US")}`;

  return (
    <>
      <PageHero
        title="Your Shopping Cart"
        subtitle={`${sampleCart.length} item${sampleCart.length === 1 ? "" : "s"} ready for checkout.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Line items */}
          <div className="space-y-4">
            {sampleCart.map((item) => (
              <div
                key={item.slug}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 sm:gap-6"
              >
                <Link
                  href={item.href}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50 sm:h-28 sm:w-28"
                >
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-contain p-2"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    href={item.href}
                    className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-brand-dark sm:text-base"
                  >
                    {item.name}
                  </Link>
                  <div className="mt-1 text-xs text-slate-500">
                    Brand: <span className="font-semibold text-slate-700">{item.brand}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="inline-flex items-center rounded-full border border-slate-200">
                      <button className="h-8 w-8 rounded-l-full text-slate-500 hover:bg-slate-50">
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button className="h-8 w-8 rounded-r-full text-slate-500 hover:bg-slate-50">
                        +
                      </button>
                    </div>
                    <button className="text-xs font-medium text-slate-500 hover:text-rose-600">
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900">
                    {fmt(parsePrice(item.price) * item.qty)}
                  </div>
                  <div className="text-xs text-slate-500">{item.price} each</div>
                </div>
              </div>
            ))}

            {/* Coupon */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-sky-50 p-4 ring-1 ring-emerald-100">
              <span className="text-sm font-semibold text-slate-700">Have a coupon?</span>
              <form className="flex flex-1 gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <button
                  type="submit"
                  className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  Apply
                </button>
              </form>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark hover:underline"
            >
              <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900">Order Summary</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Subtotal</dt>
                  <dd className="font-semibold text-slate-900">{fmt(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Shipping</dt>
                  <dd className={`font-semibold ${shipping === 0 ? "text-brand-dark" : "text-slate-900"}`}>
                    {shipping === 0 ? "FREE" : fmt(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Member Discount (10%)</dt>
                  <dd className="font-semibold text-brand-dark">- {fmt(discount)}</dd>
                </div>
                <div className="my-3 border-t border-slate-100" />
                <div className="flex justify-between text-base">
                  <dt className="font-extrabold text-slate-900">Total</dt>
                  <dd className="font-extrabold text-brand-dark">{fmt(total)}</dd>
                </div>
              </dl>

              <button
                type="button"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark"
              >
                Proceed to Checkout
                <ArrowRightIcon className="h-4 w-4" />
              </button>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["VISA", "MC", "bKash", "Nagad", "COD"].map((p) => (
                  <span
                    key={p}
                    className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 ring-1 ring-emerald-100">
              <div className="flex items-center gap-3 text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand ring-1 ring-emerald-100">
                  <TruckIcon className="h-4 w-4" />
                </span>
                Free delivery on orders over ৳1,500
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-blue-dark ring-1 ring-blue-100">
                  <ShieldIcon className="h-4 w-4" />
                </span>
                100% authentic products
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand ring-1 ring-emerald-100">
                  <CheckBadgeIcon className="h-4 w-4" />
                </span>
                7-day easy return
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export function EmptyCart() {
  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-12 text-center ring-1 ring-slate-100">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
        <CartIcon className="h-10 w-10" />
      </div>
      <h3 className="mt-5 text-xl font-extrabold text-slate-900">Your cart is empty</h3>
      <p className="mt-2 text-sm text-slate-600">
        Start shopping to fill it with authentic oral care.
      </p>
      <Link
        href="/shop"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Shop Now <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
