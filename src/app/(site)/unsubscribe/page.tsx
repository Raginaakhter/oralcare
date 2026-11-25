"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHero } from "@/components/SiteShell";
import { errorMessage, newsletterApi } from "@/lib/api";
import { MailIcon } from "@/components/icons";

/** /unsubscribe?token=… — POST /newsletter/unsubscribe with the token from a newsletter email. */
export default function UnsubscribePage() {
  return (
    <>
      <PageHero title="Newsletter" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Unsubscribe" }]} />
      <Suspense fallback={null}>
        <Unsubscribe />
      </Suspense>
    </>
  );
}

function Unsubscribe() {
  const token = useSearchParams().get("token") ?? "";
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const confirm = async () => {
    setState("busy");
    try {
      const env = await newsletterApi.unsubscribe(token);
      setMessage(env.message ?? "You have been unsubscribed.");
      setState("done");
    } catch (err) {
      setMessage(errorMessage(err, "This link is invalid or has expired."));
      setState("error");
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-slate-100 shadow-xl shadow-brand/10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
          <MailIcon className="h-7 w-7" />
        </span>
        {!token ? (
          <p className="mt-4 text-sm text-slate-600">Open the unsubscribe link from one of our emails.</p>
        ) : state === "done" ? (
          <>
            <h2 className="mt-4 text-xl font-black text-slate-900">Unsubscribed</h2>
            <p className="mt-2 text-sm text-slate-600">{message}</p>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-black text-slate-900">Stop newsletter emails?</h2>
            <p className="mt-2 text-sm text-slate-600">You won&apos;t receive offers and tips any more. Order emails are not affected.</p>
            {state === "error" && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{message}</p>}
            <button
              onClick={confirm}
              disabled={state === "busy"}
              className="mt-6 w-full rounded-full bg-brand px-6 py-3 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {state === "busy" ? "Unsubscribing…" : "Unsubscribe"}
            </button>
          </>
        )}
        <Link href="/" className="mt-6 inline-block text-xs font-semibold text-slate-500 hover:text-brand-dark">
          Back to the store
        </Link>
      </div>
    </main>
  );
}
