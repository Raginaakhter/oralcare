"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Slide = {
  tag: string;
  title: React.ReactNode;
  description: string;
  cta: string;
  secondary: string;
  products: React.ReactNode;
  bg: string;
};

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6500);
    return () => clearInterval(id);
  }, [total]);

  const current = slides[index];
  const go = (next: number) => setIndex(((next % total) + total) % total);

  return (
    <section
      className={`grain-overlay relative mt-2 overflow-hidden rounded-[2rem] ring-1 ring-emerald-100 ${current.bg}`}
    >
      {/* Background giant decorative text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-12 select-none text-center text-[16rem] font-black tracking-tighter text-white/40 mix-blend-overlay sm:-top-20 sm:text-[22rem]"
      >
        SMILE
      </div>

      {/* Animated stripes behind */}
      <div className="pointer-events-none absolute inset-0 animated-stripes opacity-60" />

      <div
        key={index}
        className="hero-slide-enter relative grid gap-8 px-6 pt-6 pb-20 sm:px-10 md:grid-cols-[1.1fr_1fr] md:items-center md:pt-10 md:pb-24 lg:px-16"
      >
        <div className="relative z-10 flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-brand-dark shadow-sm ring-1 ring-emerald-100 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            {current.tag}
          </span>

          <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            {current.title}
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
            {current.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-emerald-300/50"
            >
              {current.cta}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition group-hover:translate-x-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/categories"
              className="rounded-full bg-white/70 px-7 py-4 text-sm font-bold text-slate-800 ring-1 ring-slate-200 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
            >
              {current.secondary}
            </Link>
          </div>

          {/* Trust bar below CTAs */}
          <div className="mt-10 flex items-center gap-6">
            <div className="flex -space-x-2">
              {["#fca5a5", "#fcd34d", "#86efac", "#93c5fd"].map((c, i) => (
                <span
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-white shadow"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="m12 2 3 7 7 .5-5.5 4.5 2 7L12 17l-6.5 4 2-7L2 9.5 9 9l3-7Z" />
                  </svg>
                ))}
              </div>
              <div className="text-xs font-semibold text-slate-700">
                Trusted by <span className="text-brand-dark">10,000+ smiles</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-end justify-center md:justify-end">
          {current.products}
        </div>
      </div>

      {/* Bottom control row */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-6 pb-6 sm:px-10 lg:px-16">
        {/* Slide counter */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-2xl font-black text-slate-900">
            0{index + 1}
          </span>
          <span className="h-px w-10 bg-slate-400" />
          <span className="text-slate-500">0{total}</span>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-10 bg-brand"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-2">
          <button
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:text-brand-dark"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
