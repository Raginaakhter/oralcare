"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type HeroSlide = {
  img: string;
  alt: string;
  tag: string;
  title: React.ReactNode;
  description: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  align?: "left" | "center" | "right";
  /** CSS object-position (e.g. "center top", "50% 30%"). Default: "center". */
  objectPosition?: string;
};

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6500);
    return () => clearInterval(id);
  }, [total]);

  const go = (next: number) => setIndex(((next % total) + total) % total);

  const current = slides[index];
  const align = current.align ?? "left";
  const alignCls =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <section className="relative w-full overflow-hidden">
      {/* Slide stack — responsive fixed heights, no viewport-calc surprises */}
      <div className="relative h-[460px] w-full sm:h-[500px] md:h-[540px] lg:h-[580px] xl:h-[620px]">
        {/* Image layer — all stacked, only active visible (smooth crossfade) */}
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={i}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                active ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.img}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                style={{ objectPosition: slide.objectPosition ?? "center" }}
                className={`object-cover transition-transform duration-[7000ms] ease-out ${
                  active ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          );
        })}

        {/* Gradient overlay — darker bottom-left for text; keeps top clean */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-900/80 via-slate-900/30 via-45% to-transparent" />

        {/* Content layer — only ACTIVE slide's content rendered */}
        <div
          key={index}
          className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-5 pb-20 sm:px-8 sm:pb-24 lg:px-16"
        >
          <div
            className={`flex max-w-xl animate-fade-up flex-col gap-3 sm:gap-4 md:max-w-2xl md:gap-5 ${alignCls}`}
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md ring-1 ring-white/20 sm:px-4 sm:py-1.5 sm:text-[11px] sm:tracking-[0.2em]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
              {current.tag}
            </span>

            <h1 className="text-3xl font-black leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.25rem]">
              {current.title}
            </h1>

            <p className="max-w-md text-sm text-white/90 drop-shadow sm:max-w-lg sm:text-base md:text-lg">
              {current.description}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2 sm:mt-2 sm:gap-3">
              <Link
                href={current.cta.href}
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-xs font-bold text-white shadow-xl shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark sm:px-6 sm:py-3.5 sm:text-sm"
              >
                {current.cta.label}
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition group-hover:translate-x-1 sm:h-6 sm:w-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </span>
              </Link>
              {current.secondary && (
                <Link
                  href={current.secondary.href}
                  className="rounded-full bg-white/10 px-5 py-3 text-xs font-bold text-white ring-1 ring-white/30 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20 sm:px-6 sm:py-3.5 sm:text-sm"
                >
                  {current.secondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom control bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 pb-4 sm:px-8 sm:pb-5 lg:px-16 lg:pb-6">
          {/* Slide counter */}
          <div className="pointer-events-auto hidden items-center gap-3 text-sm text-white sm:flex">
            <span className="text-xl font-black drop-shadow sm:text-2xl">
              0{index + 1}
            </span>
            <span className="h-px w-8 bg-white/60 sm:w-10" />
            <span className="text-white/70">0{total}</span>
          </div>

          {/* Dots */}
          <div className="pointer-events-auto flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-8 bg-white sm:w-10"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="pointer-events-auto flex gap-2">
            <button
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/25 sm:h-11 sm:w-11"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-brand hover:text-white sm:h-11 sm:w-11"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
