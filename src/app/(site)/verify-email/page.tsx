"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { useAuth } from "@/context/AuthContext";
import { authApi, errorMessage } from "@/lib/api";
import { MailIcon } from "@/components/icons";

export default function VerifyEmailPage() {
  return (
    <>
      <PageHero
        title="Verify Email"
        subtitle="Confirm your email address to secure your account."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Verify Email" }]}
      />
      <Suspense fallback={null}>
        <Verify />
      </Suspense>
    </>
  );
}

function Verify() {
  const params = useSearchParams();
  const token = params.get("token");
  const { user, reloadUser } = useAuth();
  const [state, setState] = useState<"idle" | "verifying" | "ok" | "error">(token ? "verifying" : "idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const started = useRef(false);

  // POST /auth/verify-email with the token from the email link.
  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    authApi
      .verifyEmail(token)
      .then((env) => {
        setState("ok");
        setMessage(env.message ?? "Email verified successfully");
        void reloadUser();
      })
      .catch((err) => {
        setState("error");
        setMessage(errorMessage(err, "This link is invalid or has expired."));
      });
  }, [token, reloadUser]);

  const resend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const env = await authApi.resendVerification(email || user?.email || "");
      setMessage(env.message ?? "If an account exists and is unverified, a new email has been sent.");
      if (env._devVerificationToken) {
        setMessage((m) => `${m} (dev token issued — check the link below)`);
        window.history.replaceState(null, "", `/verify-email?devToken=${env._devVerificationToken}`);
      }
    } catch (err) {
      setMessage(errorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const devToken = params.get("devToken");

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-slate-100 shadow-xl shadow-brand/10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
          <MailIcon className="h-7 w-7" />
        </span>

        {state === "verifying" && <p className="mt-4 text-sm font-semibold text-slate-600">Verifying your email…</p>}
        {state === "ok" && (
          <>
            <h2 className="mt-4 text-2xl font-black text-slate-900">You&apos;re verified!</h2>
            <p className="mt-2 text-sm text-slate-600">{message}</p>
            <Link href={user ? "/my-account" : "/signin"} className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-xs font-bold text-white">
              {user ? "Go to My Account" : "Sign In"}
            </Link>
          </>
        )}
        {(state === "idle" || state === "error") && (
          <>
            <h2 className="mt-4 text-xl font-black text-slate-900">
              {state === "error" ? "Verification failed" : "Resend verification email"}
            </h2>
            {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
            <form onSubmit={resend} className="mt-5 space-y-3">
              <input
                type="email"
                required={!user}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={user?.email ?? "you@example.com"}
                className="w-full rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
              <button
                disabled={sending}
                className="w-full rounded-full bg-brand px-6 py-3 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send verification link"}
              </button>
            </form>
            {devToken && (
              <Link
                href={`/verify-email?token=${encodeURIComponent(devToken)}`}
                className="mt-4 inline-block rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 ring-1 ring-amber-200"
              >
                Dev: verify with issued token
              </Link>
            )}
          </>
        )}
      </div>
    </main>
  );
}
