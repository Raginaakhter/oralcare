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

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Login */}
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-slate-100">
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 animate-blob rounded-full bg-emerald-100/60 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
                <UserIcon className="h-3.5 w-3.5" />
                Welcome Back
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-900">Sign In</h2>
              <p className="mt-2 text-sm text-slate-600">
                Continue with your email or phone number.
              </p>
              <form className="mt-6 space-y-4">
                <Field label="Email or Phone" name="identifier" placeholder="you@example.com or 01XXXXXXXXX" />
                <Field label="Password" name="password" type="password" placeholder="Your password" />
                <div className="flex items-center justify-between text-xs">
                  <label className="inline-flex items-center gap-2 text-slate-600">
                    <input type="checkbox" className="accent-brand" defaultChecked />
                    Remember me
                  </label>
                  <button type="button" className="font-semibold text-brand-dark hover:underline">
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark"
                >
                  Sign In <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>

              <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                <span>OR CONTINUE WITH</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SocialButton label="Google" color="bg-white text-slate-700 ring-slate-200" />
                <SocialButton label="Facebook" color="bg-brand-blue text-white" />
              </div>
            </div>
          </div>

          {/* Register */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-blue-soft p-8 ring-1 ring-emerald-100">
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 animate-blob rounded-full bg-sky-200/60 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-blue-dark shadow-sm">
                <MailIcon className="h-3.5 w-3.5" />
                New Customer
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-900">Create Account</h2>
              <p className="mt-2 text-sm text-slate-600">
                Join thousands of happy customers and get exclusive perks.
              </p>
              <form className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First Name" name="first" placeholder="Your first name" />
                  <Field label="Last Name" name="last" placeholder="Your last name" />
                </div>
                <Field label="Email" name="email" type="email" placeholder="you@example.com" />
                <Field label="Phone Number" name="phone" placeholder="01XXXXXXXXX" />
                <Field label="Password" name="password" type="password" placeholder="At least 8 characters" />
                <label className="flex gap-2 text-xs text-slate-600">
                  <input type="checkbox" className="mt-0.5 accent-brand" />
                  <span>
                    I agree to the{" "}
                    <Link href="/privacy-policy" className="font-semibold text-brand-dark hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/return-refund-policy" className="font-semibold text-brand-dark hover:underline">
                      Return Policy
                    </Link>
                    .
                  </span>
                </label>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-blue-dark px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-blue"
                >
                  Create Account <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
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
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${bubble}`}>
                    {p.icon}
                  </span>
                  <h4 className="mt-4 text-base font-bold text-slate-900">{p.title}</h4>
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

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}

function SocialButton({ label, color }: { label: string; color: string }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 transition hover:scale-[1.02] ${color}`}
    >
      {label}
    </button>
  );
}
