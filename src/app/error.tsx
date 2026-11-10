"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with real monitoring (Sentry, LogRocket, etc.) in production.
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4 text-center">
      <div className="relative max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-10 w-10">
            <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
            <path d="M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-900">
          Something Went Wrong
        </h1>
        <p className="mt-3 text-slate-600">
          An unexpected error occurred. Our team has been notified. Please try
          again, or head back to the homepage.
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-[11px] text-slate-400">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-300/40 transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-brand hover:text-brand-dark"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
