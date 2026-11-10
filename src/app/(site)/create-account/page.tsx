import Link from "next/link";
import { PageHero } from "@/components/SiteShell";
import { ArrowRightIcon, MailIcon } from "@/components/icons";

export const metadata = {
  title: "Create Account - OralCareBD",
  description: "Create your OralCareBD account.",
};

export default function CreateAccountPage() {
  return (
    <>
      <PageHero
        title="Create Account"
        subtitle="Join thousands of happy customers with authentic oral care."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Create Account" },
        ]}
      />

      <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-blue-soft p-8 ring-1 ring-emerald-100 shadow-xl shadow-emerald-50">
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 animate-blob rounded-full bg-sky-200/60 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-blue-dark shadow-sm">
              <MailIcon className="h-3.5 w-3.5" />
              New Customer
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Just your name and contact to get started.
            </p>

            <form className="mt-6 space-y-4">
              <Field
                label="Your Name"
                name="name"
                placeholder="Enter your full name"
              />
              <Field
                label="Phone or Email"
                name="identifier"
                placeholder="01XXXXXXXXX or you@example.com"
              />
              <label className="flex gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-brand"
                  defaultChecked
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-brand-dark hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/return-refund-policy"
                    className="font-semibold text-brand-dark hover:underline"
                  >
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

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-brand-dark hover:underline"
              >
                Sign in
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
