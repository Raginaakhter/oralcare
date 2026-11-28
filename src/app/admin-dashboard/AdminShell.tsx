"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { errorMessage } from "@/lib/api";
import { initials } from "@/lib/format";
import { FetchGate } from "@/lib/hooks";

// ─── Toasts ────────────────────────────────────────────────

type ToastType = "success" | "error" | "info";
interface AdminToast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastCtx = createContext<(message: string, type?: ToastType) => void>(() => undefined);

export function useAdminToast() {
  return useContext(ToastCtx);
}

/** Wraps an admin action: runs it, toasts success or the backend's error message. */
export function useAdminAction() {
  const toast = useAdminToast();
  return useCallback(
    async <T,>(fn: () => Promise<T>, success?: string | ((r: T) => string)): Promise<T | undefined> => {
      try {
        const r = await fn();
        if (success) toast(typeof success === "function" ? success(r) : success, "success");
        return r;
      } catch (err) {
        toast(errorMessage(err), "error");
        return undefined;
      }
    },
    [toast]
  );
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto rounded-2xl px-4 py-3 text-xs font-semibold text-white shadow-2xl ${
              t.type === "error" ? "bg-rose-700" : t.type === "info" ? "bg-slate-900" : "bg-emerald-700"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// ─── Gate ──────────────────────────────────────────────────

/** Admin pages need an admin or manager token; shows a sign-in form otherwise. */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const { status, isStaff } = useAuth();
  const allowed = status === "authenticated" && isStaff;

  // The page is always rendered (so Next.js can validate its route segment), but it stays
  // hidden and its useAsync calls wait until the session is known to have dashboard access.
  return (
    <ToastProvider>
      {!allowed && <GateScreen />}
      <FetchGate.Provider value={allowed}>
        <div hidden={!allowed}>{children}</div>
      </FetchGate.Provider>
    </ToastProvider>
  );
}

function GateScreen() {
  const { status, user } = useAuth();
  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-slate-500">
        <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        Checking your session…
      </div>
    );
  }
  if (status === "guest") return <AdminSignIn />;
  // Signed in, but the role has no dashboard:access.
  return (
    <div className="mx-auto mt-20 max-w-md rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200">
      <h1 className="text-xl font-black text-slate-900">No admin access</h1>
      <p className="mt-2 text-sm text-slate-600">
        You&apos;re signed in as <strong>{user?.email}</strong>, which is a customer account. Ask an administrator for
        access.
      </p>
      <Link href="/" className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white">
        Back to store
      </Link>
    </div>
  );
}

function AdminSignIn() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const u = await login(email, password);
      if (!u.permissions.includes("dashboard:access")) setError("This account doesn't have admin access.");
    } catch (err) {
      setError(errorMessage(err, "Sign in failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-sm rounded-3xl bg-white p-8 ring-1 ring-slate-200 shadow-xl">
      <h1 className="text-2xl font-black text-slate-900">Admin sign in</h1>
      <p className="mt-1 text-xs text-slate-500">Use an admin or manager account.</p>
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</p>}
      <form onSubmit={submit} className="mt-5 space-y-3">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-brand focus:bg-white"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-brand focus:bg-white"
        />
        <Link href="/forgot-password" className="block text-right text-[11px] font-semibold text-brand-dark hover:underline">
          Forgot password?
        </Link>
        <button
          disabled={loading}
          className="h-11 w-full rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

// ─── Header user menu ──────────────────────────────────────

export function AdminUserMenu() {
  const { user, logout, status } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (status !== "authenticated" || !user) return null;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 transition hover:border-slate-300"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-sm font-black text-white">
          {initials(user.fullName)}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-xs font-bold text-slate-900">{user.fullName}</span>
          <span className="block text-[10px] capitalize text-slate-500">{user.role}</span>
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
          <Link href="/my-account" className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            My account
          </Link>
          <button
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Small shared pieces ───────────────────────────────────

export function Pagination({
  page,
  totalPages,
  total,
  onChange,
}: {
  page: number;
  totalPages: number;
  total?: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs">
      <span className="text-slate-500">
        Page <span className="font-bold text-slate-900">{page}</span> of {totalPages}
        {typeof total === "number" && <> · {total} total</>}
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-lg px-3 py-1.5 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        >
          Prev
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-lg px-3 py-1.5 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function Loader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm font-semibold text-slate-500">
      <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      {label}
    </div>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center text-sm text-slate-500">
        {children}
      </td>
    </tr>
  );
}

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ${wide ? "max-w-2xl" : "max-w-md"}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-xl text-slate-400 hover:text-slate-700">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const inputCls =
  "h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20";

export const btn = {
  primary:
    "inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand to-brand-blue px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand-blue/25 transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50",
  secondary:
    "inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-brand hover:text-brand-dark disabled:opacity-50",
  danger:
    "inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50",
  brand:
    "inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:opacity-50",
};
