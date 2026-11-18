"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { ArrowRightIcon, MailIcon, ShieldIcon, CheckBadgeIcon } from "@/components/icons";
import { useStore } from "@/context/StoreContext";

export default function CreateAccountPage() {
  const router = useRouter();
  const { showToast } = useStore();

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !identifier.trim()) {
      showToast("Please enter your name and phone/email", "error");
      return;
    }
    if (!agreed) {
      showToast("Please agree to the terms and privacy policy", "error");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      showToast(`Welcome to OralCareBD, ${name}! Account created.`, "success");
      router.push("/my-account");
    }, 600);
  };

  return (
    <>
      <PageHero
        title="Create Account"
        subtitle="Join thousands of smiling customers getting authentic Australian dental care in Bangladesh."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Create Account" },
        ]}
      />

      <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-blue-soft p-8 ring-1 ring-brand/15 shadow-xl shadow-brand/15">
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 animate-blob rounded-full bg-slate-200/60 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-blue-dark shadow-sm">
              <MailIcon className="h-3.5 w-3.5" />
              New Member Registration
            </span>
            <h2 className="mt-3 text-2xl font-black text-slate-900">
              Create Your Account
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Just your name and contact details to get started.
            </p>

            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Afsana Rahman"
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Phone Number or Email <span className="text-rose-500">*</span>
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
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 chars)"
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <label className="flex items-start gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-brand"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-bold text-brand-dark hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/return-refund-policy"
                    className="font-bold text-brand-dark hover:underline"
                  >
                    Return Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-dark transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Complete Registration"}
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-bold text-brand-dark hover:underline"
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
