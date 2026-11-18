"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  HomeIcon,
  GridIcon,
  HeartIcon,
  CartIcon,
  UserIcon,
} from "@/components/icons";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, setIsCartOpen } = useStore();

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/shop") || pathname.startsWith("/categories");
  const isWishlist = pathname === "/wishlist";
  const isAccount =
    pathname.startsWith("/my-account") ||
    pathname.startsWith("/my-orders") ||
    pathname === "/signin" ||
    pathname === "/create-account";

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-lg md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      {/* Home */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-bold transition ${
          isHome ? "text-brand" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <HomeIcon className={`h-5 w-5 ${isHome ? "text-brand" : "text-slate-500"}`} />
        <span>Home</span>
      </Link>

      {/* Categories / Shop */}
      <Link
        href="/categories"
        className={`flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-bold transition ${
          isShop ? "text-brand" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <GridIcon className={`h-5 w-5 ${isShop ? "text-brand" : "text-slate-500"}`} />
        <span>Shop</span>
      </Link>

      {/* Cart (Opens Drawer) */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-bold text-slate-500 hover:text-brand transition"
      >
        <span className="relative">
          <CartIcon className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-black text-white shadow-sm">
              {cartCount}
            </span>
          )}
        </span>
        <span>Cart</span>
      </button>

      {/* Wishlist */}
      <Link
        href="/wishlist"
        className={`relative flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-bold transition ${
          isWishlist ? "text-rose-500" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <span className="relative">
          <HeartIcon
            className={`h-5 w-5 ${
              isWishlist ? "fill-current text-rose-500" : "text-slate-500"
            }`}
          />
          {wishlistCount > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-sm">
              {wishlistCount}
            </span>
          )}
        </span>
        <span>Wishlist</span>
      </Link>

      {/* Account */}
      <Link
        href="/my-account"
        className={`flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-bold transition ${
          isAccount ? "text-brand" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <UserIcon
          className={`h-5 w-5 ${isAccount ? "text-brand" : "text-slate-500"}`}
        />
        <span>Account</span>
      </Link>
    </nav>
  );
}
