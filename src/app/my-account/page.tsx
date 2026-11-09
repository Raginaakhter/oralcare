import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import {
  ArrowRightIcon,
  ShieldIcon,
  CheckBadgeIcon,
  HeartIcon,
  CartIcon,
  UserIcon,
  MailIcon,
} from "@/components/icons";

export const metadata = {
  title: "My Account - OralCareBD",
};

const perks = [
  {
    icon: <ShieldIcon className="h-5 w-5" />,
    title: "Secure Checkout",
    desc: "SSL-encrypted checkout with Stripe, bKash and Nagad.",
  },
  {
    icon: <CheckBadgeIcon className="h-5 w-5" />,
    title: "Order Tracking",
    desc: "Watch your delivery status in real time.",
  },
  {
    icon: <HeartIcon className="h-5 w-5" />,
    title: "Save Favourites",
    desc: "Keep a wishlist to come back to anytime.",
  },
  {
    icon: <CartIcon className="h-5 w-5" />,
    title: "Fast Reorder",
    desc: "Reorder your routine in one click.",
  },
];

export default function AccountPage() {
  return (
    <>
      <PageHero
        title="My Account"
        subtitle="Sign in to track orders, save favourites and manage your preferences."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Account" }]}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Sign In card */}
          <Link
            href="/signin"
            className="group relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100"
          >
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 animate-blob rounded-full bg-emerald-100/60 blur-3xl" />
            <div className="relative">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                <UserIcon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                Sign In
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Already have an account? Sign in with your phone or email.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-dark">
                Go to Sign In
                <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Create Account card */}
          <Link
            href="/create-account"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-blue-soft p-8 ring-1 ring-emerald-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100"
          >
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 animate-blob rounded-full bg-sky-200/60 blur-3xl" />
            <div className="relative">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-blue-dark shadow-sm">
                <MailIcon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                Create Account
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                New here? Create an account with just your name and contact.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark">
                Create Account
                <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>

        {/* Perks */}
        <section className="mt-14">
          <div className="mb-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">
              Member Benefits
            </span>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              Why Create an Account?
            </h3>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => {
              const bubble =
                i % 2 === 1
                  ? "bg-brand-blue-soft text-brand-blue-dark"
                  : "bg-brand-soft text-brand-dark";
              return (
                <div
                  key={p.title}
                  className="rounded-2xl bg-white p-6 ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100"
                >
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${bubble}`}
                  >
                    {p.icon}
                  </span>
                  <h4 className="mt-4 text-base font-bold text-slate-900">
                    {p.title}
                  </h4>
                  <p className="mt-1 text-sm text-slate-600">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
