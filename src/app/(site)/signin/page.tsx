"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { ArrowRightIcon, UserIcon, ShieldIcon, CheckBadgeIcon } from "@/components/icons";
import { useStore } from "@/context/StoreContext";

export default function SignInPage() {
  const router = useRouter();
  const { showToast } = useStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      showToast("Please enter your phone number or email", "error");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      showToast("Welcome back! Signed in successfully.", "success");
      router.push("/my-account");
    }, 600);
  };

  const handleDemoLogin = () => {
    setIdentifier("01712 345678");
    setPassword("password123");
    setLoading(true);
    setTimeout(() => {
      showToast("Signed in as Demo User (Afsana Rahman)!", "success");
      router.push("/my-account");
    }, 500);
  };

  return (
    <>
      <PageHero
        title="Sign In"
        subtitle="Sign in with your phone or email to track orders and save your wishlist."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sign In" },
        ]}
      />

      <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-slate-100 shadow-xl shadow-brand/10">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 animate-blob rounded-full bg-brand-soft/60 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
              <UserIcon className="h-3.5 w-3.5" />
              Member Access
            </span>
            <h2 className="mt-3 text-2xl font-black text-slate-900">
              Welcome Back
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Enter your mobile number or email to manage your orders.
            </p>

            <form onSubmit={handleSignIn} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Phone Number or Email
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="01XXXXXXXXX or you@example.com"
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast("Password reset link sent to your phone/email", "info");
                    }}
                    className="text-[11px] font-semibold text-brand-dark hover:underline"
                  >
                    Forgot?
                  </a>
                </div>
                <input
                  type="password"
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

              {/* Demo Login Button */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Quick Demo Sign In (Afsana Rahman)
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-600">
              New to OralCareBD?{" "}
              <Link
                href="/create-account"
                className="font-bold text-brand-dark hover:underline"
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
