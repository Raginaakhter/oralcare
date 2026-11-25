"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, formatPriceBDT } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { notificationsApi } from "@/lib/api";
import { initials } from "@/lib/format";
import {
  HeartIcon,
  CartIcon,
  UserIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  ShieldIcon,
} from "@/components/icons";

export function HeaderNavActions() {
  const router = useRouter();
  const { cartCount, cartSubtotal, wishlistCount, setIsCartOpen, showToast } = useStore();
  const { user, status, isStaff, isAdmin, logout } = useAuth();
  const [unreadCount, setUnread] = useState(0);

  // Unread notification badge (GET /notifications returns unreadCount).
  useEffect(() => {
    if (status !== "authenticated") return;
    let alive = true;
    notificationsApi
      .list({ limit: 1 })
      .then((n) => alive && setUnread(n.unreadCount))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [status]);

  const unread = status === "authenticated" ? unreadCount : 0;

  const signOut = async () => {
    await logout();
    showToast("Signed out", "info");
    router.push("/");
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Admin shortcut — only for accounts with the admin role */}
      {isAdmin && (
        <Link
          href="/admin-dashboard"
          aria-label="Admin dashboard"
          title="Admin dashboard"
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-brand-dark sm:px-3.5"
        >
          <ShieldIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      )}

      {/* Account Dropdown */}
      <div className="group/account relative">
        <Link
          href="/my-account"
          aria-label="Account"
          className="flex items-center gap-1 rounded-full px-2.5 py-2 text-slate-700 transition hover:bg-slate-100 sm:px-3"
        >
          <span className="relative">
            {user ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[10px] font-black text-white">
                {initials(user.fullName)}
              </span>
            ) : (
              <UserIcon className="h-5 w-5" />
            )}
            {unread > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </span>
          <ChevronDownIcon className="hidden h-3 w-3 text-slate-400 transition group-hover/account:rotate-180 sm:block" />
        </Link>

        <div className="invisible absolute right-0 top-full z-50 w-60 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover/account:visible group-hover/account:translate-y-0 group-hover/account:opacity-100">
          <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-2xl shadow-slate-200 ring-1 ring-slate-100">
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-gradient-to-br from-brand-soft via-white to-brand-blue-soft p-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white">
                <UserIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Hello, {user ? user.fullName.split(" ")[0] : "Guest"}
                </div>
                <div className="max-w-[150px] truncate text-[11px] text-slate-500">
                  {user ? user.email : "Welcome to OralCareBD"}
                </div>
              </div>
            </div>
            <ul>
              {[
                { label: "My Account", href: "/my-account" },
                { label: "My Orders", href: "/my-orders" },
                {
                  label: unread ? `Notifications (${unread})` : "Notifications",
                  href: "/my-account?tab=notifications",
                },
                { label: "Track Order", href: "/track-order" },
                { label: "My Wishlist", href: "/wishlist" },
                { label: "My Cart", href: "/cart" },
                ...(isStaff ? [{ label: "Admin Dashboard", href: "/admin-dashboard" }] : []),
              ].map((it) => (
                <li key={it.label}>
                  <Link
                    href={it.href}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-brand-dark"
                  >
                    {it.label}
                    <ArrowRightIcon className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
            {user ? (
              <div className="mt-2 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={signOut}
                  className="w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2">
              <Link
                href="/signin"
                className="flex items-center justify-center gap-1 rounded-xl bg-brand px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-dark"
              >
                Sign In
              </Link>
              <Link
                href="/create-account"
                className="flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-blue-dark"
              >
                Register
              </Link>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Wishlist Icon */}
      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="group relative flex items-center gap-2 rounded-full px-2.5 py-2 text-slate-700 transition hover:bg-slate-100 sm:px-3"
      >
        <span className="relative">
          <HeartIcon className="h-5 w-5 transition group-hover:text-rose-500" />
          {wishlistCount > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-sm">
              {wishlistCount}
            </span>
          )}
        </span>
      </Link>

      {/* Cart Button (triggers Drawer or goes to /cart) */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        aria-label="Cart"
        className="group relative flex items-center gap-2 rounded-full px-2.5 py-2 text-slate-700 transition hover:bg-slate-100 sm:px-3"
      >
        <span className="relative">
          <CartIcon className="h-5 w-5 transition group-hover:text-brand" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-black text-white shadow-sm">
              {cartCount}
            </span>
          )}
        </span>
        <span className="hidden text-xs font-semibold text-slate-700 lg:inline">
          {formatPriceBDT(cartSubtotal)}
        </span>
      </button>
    </div>
  );
}
