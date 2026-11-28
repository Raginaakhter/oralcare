"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, ChevronDownIcon, GridIcon, SparkIcon } from "@/components/icons";
import { SmartImage } from "@/components/SmartImage";

export type CategoryMenuItem = { label: string; href: string; img: string; description?: string };

/** One colour family per card, cycled (static strings so Tailwind keeps them). */
const TONES = [
  { bubble: "bg-teal-100 ring-teal-200", hover: "hover:bg-teal-50 hover:ring-teal-200", cta: "text-teal-700" },
  { bubble: "bg-sky-100 ring-sky-200", hover: "hover:bg-sky-50 hover:ring-sky-200", cta: "text-sky-700" },
  { bubble: "bg-violet-100 ring-violet-200", hover: "hover:bg-violet-50 hover:ring-violet-200", cta: "text-violet-700" },
  { bubble: "bg-pink-100 ring-pink-200", hover: "hover:bg-pink-50 hover:ring-pink-200", cta: "text-pink-700" },
  { bubble: "bg-amber-100 ring-amber-200", hover: "hover:bg-amber-50 hover:ring-amber-200", cta: "text-amber-700" },
  { bubble: "bg-emerald-100 ring-emerald-200", hover: "hover:bg-emerald-50 hover:ring-emerald-200", cta: "text-emerald-700" },
  { bubble: "bg-indigo-100 ring-indigo-200", hover: "hover:bg-indigo-50 hover:ring-indigo-200", cta: "text-indigo-700" },
];

/**
 * "Category" button + desktop mega menu. Opens on hover or keyboard focus, and closes on
 * mouse leave, Escape, focus leaving, or as soon as any link inside is clicked.
 * On touch/small screens the button simply opens /categories.
 */
export function CategoryMenu({ categories }: { categories: CategoryMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const show = () => {
    cancelClose();
    setOpen(true);
  };
  const hideSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  const hideNow = () => {
    cancelClose();
    setOpen(false);
    // Drop focus so :focus styles / focus-reopen don't keep it visible after navigating.
    (document.activeElement as HTMLElement | null)?.blur();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setOpen(false);
      (document.activeElement as HTMLElement | null)?.blur();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => cancelClose, []);

  return (
    <div
      ref={root}
      className="relative shrink-0"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onFocus={show}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) hideSoon();
      }}
    >
      <Link
        href="/categories"
        onClick={hideNow}
        aria-haspopup="true"
        aria-expanded={open}
        className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-bold transition sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-sm ${
          open
            ? "border-brand bg-brand-soft text-brand-dark"
            : "border-slate-200 bg-white text-slate-900 hover:border-brand hover:bg-brand-soft hover:text-brand-dark"
        }`}
      >
        <GridIcon className="h-3.5 w-3.5 text-brand sm:h-4 sm:w-4" />
        Category
        <ChevronDownIcon
          className={`hidden h-3.5 w-3.5 transition lg:block ${open ? "rotate-180 text-brand-dark" : "text-slate-400"}`}
        />
      </Link>

      {/* Mega menu — desktop only. pt-3 (not a margin) keeps the hover alive across the gap. */}
      <div
        className={`absolute left-0 top-full z-50 hidden w-[min(820px,calc(100vw-48px))] pt-3 transition duration-200 lg:block ${
          open ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/15 ring-1 ring-slate-200 grid-cols-[1fr_230px]">
          {/* Category grid */}
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">Browse catalog</div>
                <h3 className="mt-0.5 text-lg font-black text-slate-900">Shop by category</h3>
              </div>
              <Link
                href="/categories"
                onClick={hideNow}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-900 hover:text-white"
              >
                View all <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            <ul className="grid max-h-[60vh] grid-cols-2 gap-1.5 overflow-y-auto">
              {categories.map((c, i) => {
                const t = TONES[i % TONES.length];
                return (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      onClick={hideNow}
                      className={`group/item flex h-full items-center gap-3 rounded-2xl p-2.5 ring-1 ring-transparent transition ${t.hover}`}
                    >
                      <span
                        className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-1 ${t.bubble}`}
                      >
                        <SmartImage
                          src={c.img}
                          alt=""
                          width={56}
                          height={56}
                          className="h-11 w-11 object-contain transition-transform duration-300 group-hover/item:scale-110"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold leading-snug text-slate-900">{c.label}</span>
                        {c.description ? (
                          <span className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">{c.description}</span>
                        ) : null}
                        <span className={`mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold ${t.cta}`}>
                          Shop now
                          <ArrowRightIcon className="h-2.5 w-2.5 transition group-hover/item:translate-x-0.5" />
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Promo side panel */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-500 via-cyan-600 to-indigo-600 p-5 text-white">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-fuchsia-400/40 blur-2xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                <SparkIcon className="h-3 w-3" /> Hot deal
              </span>
              <div className="mt-3 text-3xl font-black leading-none">
                25% <span className="text-lg">OFF</span>
              </div>
              <p className="mt-1.5 text-sm text-white/85">on whitening kits &amp; value packs</p>
            </div>
            <Link
              href="/shop?category=specials"
              onClick={hideNow}
              className="relative mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-indigo-700 shadow-lg transition hover:-translate-y-0.5"
            >
              Grab deal <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
