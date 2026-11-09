import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import { ArrowRightIcon, UserIcon } from "@/components/icons";

export const metadata = {
  title: "Sign In - OralCareBD",
  description: "Sign in to your OralCareBD account.",
};

export default function SignInPage() {
  return (
    <>
      <PageHero
        title="Sign In"
        subtitle="Enter your phone number or email to continue."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sign In" },
        ]}
      />

      <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-slate-100 shadow-xl shadow-emerald-50">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 animate-blob rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
              <UserIcon className="h-3.5 w-3.5" />
              Welcome Back
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
              Sign In
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter your phone number or email to continue.
            </p>

            <form className="mt-6 space-y-4">
              <Field
                label="Phone or Email"
                name="identifier"
                placeholder="01XXXXXXXXX or you@example.com"
              />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark"
              >
                Continue <ArrowRightIcon className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              New to OralCareBD?{" "}
              <Link
                href="/create-account"
                className="font-semibold text-brand-dark hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

function Field({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">
        {label}
      </label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}
