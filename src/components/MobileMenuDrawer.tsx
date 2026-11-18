"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { categories, site } from "@/lib/site-data";
import {
  MenuIcon,
  XIcon,
  SearchIcon,
  PhoneIcon,
  WhatsappIcon,
  TagIcon,
  ArrowRightIcon,
  SparkIcon,
  GridIcon,
} from "@/components/icons";

export function MobileMenuDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile menu"
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition md:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-xs sm:max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <Link href="/" onClick={close} className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="OralcareBD"
              width={160}
              height={50}
              className="h-9 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <form
            action="/shop"
            onSubmit={close}
            className="flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 focus-within:border-brand focus-within:bg-white"
          >
            <SearchIcon className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="search"
              name="q"
              placeholder="Search products..."
              className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white hover:bg-brand-dark"
            >
              Go
            </button>
          </form>
        </div>

        {/* Scrollable menu links */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
          {/* Quick links */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Browse Menu
            </div>
            <ul className="space-y-1 text-sm font-semibold text-slate-800">
              <li>
                <Link
                  href="/shop"
                  onClick={close}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 hover:text-brand-dark"
                >
                  <span className="flex items-center gap-2.5">
                    <GridIcon className="h-4 w-4 text-brand" />
                    Shop All Products
                  </span>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=specials"
                  onClick={close}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-rose-600 hover:bg-rose-50"
                >
                  <span className="flex items-center gap-2.5">
                    <TagIcon className="h-4 w-4" />
                    Hot Offers &amp; Specials
                  </span>
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-black text-white">
                    Sale
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  onClick={close}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 hover:text-brand-dark"
                >
                  <span>Dental Blog &amp; Tips</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  onClick={close}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 hover:text-brand-dark"
                >
                  <span>About Us</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  onClick={close}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 hover:text-brand-dark"
                >
                  <span>Contact Us</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  onClick={close}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 hover:text-brand-dark"
                >
                  <span>Track Your Order</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
              <span>Categories</span>
              <Link href="/categories" onClick={close} className="text-brand-dark hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  onClick={close}
                  className={`flex items-center gap-2 rounded-xl ${c.bg} p-2 text-xs font-bold text-slate-900 ring-1 ${c.ring} hover:shadow-sm`}
                >
                  <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-white">
                    <Image
                      src={c.img}
                      alt={c.label}
                      width={28}
                      height={28}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="truncate text-[11px]">{c.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Contact bar */}
        <div className="border-t border-slate-100 bg-slate-50 p-4">
          <div className="text-[11px] font-semibold text-slate-500 mb-2">Need Help?</div>
          <div className="flex items-center justify-between gap-2">
            <a
              href={site.phoneHref}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
            >
              <WhatsappIcon className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <a
              href={`tel:${site.phone.replace(/[^0-9+]/g, "")}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-brand-dark"
            >
              <PhoneIcon className="h-3.5 w-3.5" />
              Call Now
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
