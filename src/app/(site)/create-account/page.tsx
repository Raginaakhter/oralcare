"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { ArrowRightIcon, MailIcon, CheckBadgeIcon } from "@/components/icons";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { ApiError, authApi, errorMessage } from "@/lib/api";

export default function CreateAccountPage() {
  return (
    <>
      <PageHero
        title="Create Account"
        subtitle="Join thousands of smiling customers getting authentic Australian dental care in Bangladesh."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Create Account" }]}
      />
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </>
  );
}

/** Mirrors the backend rule: 8+ chars with upper, lower and a digit. */
function passwordProblem(p: string): string | null {
  if (p.length < 8) return "At least 8 characters";
  if (!/[a-z]/.test(p) || !/[A-Z]/.test(p) || !/\d/.test(p)) return "Include upper case, lower case and a number";
  return null;
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const { showToast } = useStore();
  const { register, login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ message: string; devToken?: string } | null>(null);
  const [resending, setResending] = useState(false);

  const pwIssue = password ? passwordProblem(password) : null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    if (!agreed) {
      setError("Please agree to the privacy and return policies.");
      return;
    }
    if (pwIssue) {
      setFieldErrors({ password: pwIssue });
      return;
    }
    setLoading(true);
    try {
      const env = await register({ fullName, email, password });
      setDone({ message: env.message ?? "Account created.", devToken: env._devVerificationToken });
      // Sign straight in so the cart and checkout work immediately.
      try {
        await login(email, password);
        showToast(`Welcome to OralCareBD, ${fullName.split(" ")[0]}!`, "success");
      } catch {
        // login may be blocked by policy; the user can sign in after verifying
      }
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.length) {
        setFieldErrors(Object.fromEntries(err.fieldErrors.map((f) => [f.field, f.message])));
      }
      setError(errorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      const env = await authApi.resendVerification(email);
      setDone((d) => ({ message: env.message ?? "Verification email sent.", devToken: env._devVerificationToken ?? d?.devToken }));
      showToast("Verification email sent", "success");
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setResending(false);
    }
  };

  if (done) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-brand/15 shadow-xl shadow-brand/15">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
            <CheckBadgeIcon className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-2xl font-black text-slate-900">Account created</h2>
          <p className="mt-2 text-sm text-slate-600">{done.message}</p>
          <p className="mt-1 text-xs text-slate-500">
            We sent a verification link to <strong>{email}</strong>.
          </p>
          {done.devToken && (
            <Link
              href={`/verify-email?token=${encodeURIComponent(done.devToken)}`}
              className="mt-4 inline-block rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 ring-1 ring-amber-200"
            >
              Dev: verify now
            </Link>
          )}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => router.push(next && next.startsWith("/") ? next : "/my-account")}
              className="rounded-full bg-brand px-6 py-3 text-xs font-bold text-white hover:bg-brand-dark"
            >
              Continue
            </button>
            <button
              onClick={resend}
              disabled={resending}
              className="rounded-full border border-slate-200 px-6 py-3 text-xs font-bold text-slate-700 hover:border-brand disabled:opacity-60"
            >
              {resending ? "Sending…" : "Resend verification email"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft via-white to-brand-blue-soft p-8 ring-1 ring-brand/15 shadow-xl shadow-brand/15">
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 animate-blob rounded-full bg-slate-200/60 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-blue-dark shadow-sm">
            <MailIcon className="h-3.5 w-3.5" />
            New Member Registration
          </span>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Create Your Account</h2>
          <p className="mt-1 text-xs text-slate-600">Just your name, email and a password to get started.</p>

          {error && (
            <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">{error}</div>
          )}

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <Field label="Full Name" error={fieldErrors.fullName}>
              <input
                type="text"
                required
                minLength={2}
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Afsana Rahman"
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </Field>
            <Field label="Email" error={fieldErrors.email}>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </Field>
            <Field label="Password" error={fieldErrors.password ?? pwIssue ?? undefined}>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8+ chars, upper & lower case, a number"
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </Field>

            <label className="flex items-start gap-2 text-xs text-slate-600">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-brand" />
              <span>
                I agree to the{" "}
                <Link href="/privacy-policy" className="font-bold text-brand-dark hover:underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/return-refund-policy" className="font-bold text-brand-dark hover:underline">
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
            <Link href={next ? `/signin?next=${encodeURIComponent(next)}` : "/signin"} className="font-bold text-brand-dark hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-slate-700">
        {label} <span className="text-rose-500">*</span>
      </label>
      {children}
      {error && <p className="mt-1 px-3 text-[11px] font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
