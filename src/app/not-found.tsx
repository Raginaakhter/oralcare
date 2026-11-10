import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-4 text-center">
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 animate-blob rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 animate-blob rounded-full bg-sky-200/50 blur-3xl" />

      <div className="relative">
        <div className="display-font text-[8rem] font-black leading-none text-brand/20 sm:text-[12rem]">
          404
        </div>
        <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to shopping.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-300/40 transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-brand hover:text-brand-dark"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
