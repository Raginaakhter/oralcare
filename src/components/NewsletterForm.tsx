"use client";

import React, { useState } from "react";
import { errorMessage, newsletterApi } from "@/lib/api";
import { CheckBadgeIcon } from "@/components/icons";

/**
 * POST /newsletter/subscribe. New subscribers get a welcome email with an
 * unsubscribe link. `source` records where they signed up (home, blog, footer…).
 */
export function NewsletterForm({ source, variant = "light" }: { source: string; variant?: "light" | "onBrand" }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const env = await newsletterApi.subscribe({ email: email.trim(), source });
      setDone(env.message ?? "Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      setError(errorMessage(err, "Could not subscribe right now"));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div
        role="status"
        className={`flex w-full max-w-md items-center justify-center gap-2 rounded-full p-3 text-xs font-bold ${
          variant === "onBrand" ? "bg-white/20 text-white backdrop-blur-md" : "bg-white text-emerald-700 ring-1 ring-emerald-200"
        }`}
      >
        <CheckBadgeIcon className="h-4 w-4" />
        {done}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={submit}
        className={`flex w-full rounded-full bg-white p-1 ${variant === "onBrand" ? "shadow-lg" : "ring-1 ring-brand/15"}`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent px-3 sm:px-5 text-xs sm:text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={busy}
          className={`shrink-0 rounded-full px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold text-white disabled:opacity-60 ${
            variant === "onBrand" ? "bg-slate-900 hover:bg-brand-dark" : "bg-brand hover:bg-brand-dark"
          }`}
        >
          {busy ? "…" : "Subscribe"}
        </button>
      </form>
      {error && (
        <p className={`mt-2 text-center text-[11px] font-semibold ${variant === "onBrand" ? "text-white" : "text-rose-600"}`}>{error}</p>
      )}
    </div>
  );
}
