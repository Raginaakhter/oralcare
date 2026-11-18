"use client";

import React from "react";
import Link from "next/link";
import { useStore, formatPriceBDT } from "@/context/StoreContext";
import {
  HeartIcon,
  CartIcon,
  UserIcon,
  ChevronDownIcon,
  ArrowRightIcon,
} from "@/components/icons";

export function HeaderNavActions() {
  const { cartCount, cartSubtotal, wishlistCount, setIsCartOpen } = useStore();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Account Dropdown */}
      <div className="group/account relative">
        <Link
          href="/my-account"
          aria-label="Account"
          className="flex items-center gap-1 rounded-full px-2.5 py-2 text-slate-700 transition hover:bg-slate-100 sm:px-3"
        >
          <UserIcon className="h-5 w-5" />
          <ChevronDownIcon className="hidden h-3 w-3 text-slate-400 transition group-hover/account:rotate-180 sm:block" />
        </Link>

        <div className="invisible absolute right-0 top-full z-50 w-60 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover/account:visible group-hover/account:translate-y-0 group-hover/account:opacity-100">
          <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-2xl shadow-slate-200 ring-1 ring-slate-100">
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-gradient-to-br from-brand-soft via-white to-brand-blue-soft p-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white">
                <UserIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs font-bold text-slate-900">Hello, Customer</div>
                <div className="text-[11px] text-slate-500">Welcome to OralCareBD</div>
              </div>
            </div>
            <ul>
              {[
                { label: "My Account", href: "/my-account" },
                { label: "My Orders", href: "/my-orders" },
                { label: "Track Order", href: "/track-order" },
                { label: "My Wishlist", href: "/wishlist" },
                { label: "My Cart", href: "/cart" },
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
