"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { ArrowRightIcon, MailIcon, ShieldIcon, CheckBadgeIcon } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { authApi, errorMessage } from "@/lib/api";

const RESEND_SECONDS = 60;

export default function ForgotPasswordPage() {
  return (
    <>
      <PageHero
        title="Reset Password"
        subtitle="We'll email you a 6-digit code to set a new password."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sign In", href: "/signin" },
          { label: "Reset Password" },
        ]}
      />
      <Suspense fallback={null}>
        <ResetFlow />
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

type Step = "email" | "code" | "password" | "done";

function ResetFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const { status, logout } = useAuth();
  const { showToast } = useStore();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendCode = async () => {
    setBusy(true);
    setError("");
    try {
      const env = await authApi.forgotPassword(email.trim());
      setInfo(env.message ?? "If an account exists, a code has been sent.");
      setDevOtp(env._devOtp ?? null);
      setStep("code");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(errorMessage(err, "Could not send the code"));
    } finally {
      setBusy(false);
    }
  };

  const checkCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await authApi.verifyResetOtp(email.trim(), otp);
      setStep("password");
    } catch (err) {
      setError(errorMessage(err, "Invalid code"));
    } finally {
      setBusy(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const issue = passwordProblem(password);
    if (issue) return setError(issue);
    if (password !== confirm) return setError("Passwords don't match");
    setBusy(true);
    setError("");
    try {
      await authApi.resetPassword({ email: email.trim(), otp, password });
      // Every session was revoked server-side; drop this tab's token too.
      if (status === "authenticated") await logout();
      setStep("done");
      showToast("Password updated — please sign in", "success");
    } catch (err) {
      setError(errorMessage(err, "Could not reset password"));
      // A locked or expired code means starting over.
      if (/new code|expired/i.test(errorMessage(err, ""))) setStep("code");
    } finally {
      setBusy(false);
    }
  };

  const input =
    "w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-slate-100 shadow-xl shadow-brand/10">
        <StepDots step={step} />

        {error && (
          <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">{error}</div>
        )}

        {step === "email" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendCode();
            }}
            className="mt-6 space-y-4"
          >
            <Heading icon={<MailIcon className="h-5 w-5" />} title="Forgot your password?">
              Enter the email you signed up with and we&apos;ll send you a code.
            </Heading>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={input}
            />
            <Submit busy={busy}>Send code</Submit>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={checkCode} className="mt-6 space-y-4">
            <Heading icon={<ShieldIcon className="h-5 w-5" />} title="Enter the 6-digit code">
              {info} Sent to <strong>{email}</strong>.
            </Heading>
            {devOtp && (
              <p className="rounded-xl bg-amber-50 p-2 text-center text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
                Dev mode (no mail provider): code {devOtp}
              </p>
            )}
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              aria-label="6-digit code"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 text-center text-2xl font-black tracking-[0.6em] outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
            />
            <Submit busy={busy} disabled={otp.length !== 6}>
              Verify code
            </Submit>
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <button type="button" onClick={() => setStep("email")} className="text-slate-500 hover:text-slate-800">
                ← Change email
              </button>
              <button
                type="button"
                disabled={cooldown > 0 || busy}
                onClick={() => {
                  setOtp("");
                  void sendCode();
                }}
                className="text-brand-dark hover:underline disabled:text-slate-400 disabled:no-underline"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </div>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={savePassword} className="mt-6 space-y-4">
            <Heading icon={<ShieldIcon className="h-5 w-5" />} title="Choose a new password">
              8+ characters with upper case, lower case and a number.
            </Heading>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className={input}
            />
            {password && passwordProblem(password) && (
              <p className="-mt-2 px-3 text-[11px] font-semibold text-rose-600">{passwordProblem(password)}</p>
            )}
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className={input}
            />
            <Submit busy={busy}>Update password</Submit>
            <p className="text-center text-[11px] text-slate-500">You&apos;ll be signed out on all devices.</p>
          </form>
        )}

        {step === "done" && (
          <div className="mt-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
              <CheckBadgeIcon className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-xl font-black text-slate-900">Password updated</h2>
            <p className="mt-1 text-xs text-slate-500">Sign in with your new password.</p>
            <button
              onClick={() => router.push(`/signin?email=${encodeURIComponent(email.trim())}`)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-bold text-white hover:bg-brand-dark"
            >
              Sign In <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {step !== "done" && (
          <p className="mt-6 text-center text-xs text-slate-600">
            Remembered it?{" "}
            <Link href="/signin" className="font-bold text-brand-dark hover:underline">
              Back to sign in
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}

function Heading({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand-dark">{icon}</span>
      <h2 className="mt-3 text-xl font-black text-slate-900">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">{children}</p>
    </div>
  );
}

function Submit({ busy, disabled, children }: { busy: boolean; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy || disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-50"
    >
      {busy ? "Please wait…" : children}
      {!busy && <ArrowRightIcon className="h-3.5 w-3.5" />}
    </button>
  );
}

function StepDots({ step }: { step: Step }) {
  const order: Step[] = ["email", "code", "password", "done"];
  const at = order.indexOf(step);
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      {["Email", "Code", "Password"].map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${
              i < at ? "bg-brand text-white" : i === at ? "bg-brand-soft text-brand-dark ring-2 ring-brand" : "bg-slate-100 text-slate-400"
            }`}
          >
            {i < at ? "✓" : i + 1}
          </span>
          <span className={`text-[11px] font-bold ${i <= at ? "text-slate-800" : "text-slate-400"}`}>{label}</span>
          {i < 2 && <span className="h-px w-5 bg-slate-200" />}
        </div>
      ))}
    </div>
  );
}
