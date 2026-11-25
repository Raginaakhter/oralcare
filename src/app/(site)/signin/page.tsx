"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { ArrowRightIcon, UserIcon } from "@/components/icons";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { errorMessage } from "@/lib/api";

export default function SignInPage() {
  return (
    <>
      <PageHero
        title="Sign In"
        subtitle="Sign in with your email to check out, track orders and manage returns."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sign In" }]}
      />
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </>
  );
}

/** Only allow same-site relative redirects. */
function safeNext(next: string | null): string | null {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { showToast } = useStore();
  const { login, status, user } = useAuth();

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already signed in → go straight on.
  useEffect(() => {
    if (status === "authenticated" && user && !loading) {
      router.replace(next ?? (user.permissions.includes("dashboard:access") ? "/admin-dashboard" : "/my-account"));
    }
  }, [status, user, next, router, loading]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const u = await login(email, password);
      showToast(`Welcome back, ${u.fullName.split(" ")[0]}!`, "success");
      router.push(next ?? (u.permissions.includes("dashboard:access") ? "/admin-dashboard" : "/my-account"));
    } catch (err) {
      setError(errorMessage(err, "Sign in failed"));
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-slate-100 shadow-xl shadow-brand/10">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 animate-blob rounded-full bg-brand-soft/60 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
            <UserIcon className="h-3.5 w-3.5" />
            Member Access
          </span>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Welcome Back</h2>
          <p className="mt-1 text-xs text-slate-500">Enter your email and password to manage your orders.</p>

          {error && (
            <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">{error}</div>
          )}

          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <Link
                  href={email ? `/forgot-password?email=${encodeURIComponent(email)}` : "/forgot-password"}
                  className="text-[11px] font-semibold text-brand-dark hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-dark transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In to Account"}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-600">
            New to OralCareBD?{" "}
            <Link
              href={next ? `/create-account?next=${encodeURIComponent(next)}` : "/create-account"}
              className="font-bold text-brand-dark hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
