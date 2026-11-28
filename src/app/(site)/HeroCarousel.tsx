"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SmartImage } from "@/components/SmartImage";
import { assetUrl } from "@/lib/api/config";

export type HeroSlide = {
  img: string;
  /** Optional portrait image used below the `sm` breakpoint. */
  mobileImg?: string;
  alt: string;
  textColor?: string;
  overlayColor?: string;
  /** 0–1; when set, replaces the default gradient with a flat tint. */
  overlayOpacity?: number;
  tag: string;
  title: React.ReactNode;
  description: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  align?: "left" | "center" | "right";
  /** CSS object-position (e.g. "center top", "50% 30%"). Default: "center". */
  objectPosition?: string;
};

/** Ratio assumed until an image has loaded (the bundled/CMS hero images are 16:9). */
const DEFAULT_RATIO = 16 / 9;

/** Tallest the banner may get from tablet width up; taller images are shown whole at this height. */
const MAX_HEIGHT = 540;

/** Minimum banner height (px) the text needs to sit on top of the image at this width. */
function textNeeds(width: number) {
  if (width >= 1280) return 460;
  if (width >= 768) return 420;
  return 380;
}

/**
 * The banner always shows the whole image at its own shape — never cropped, never letterboxed.
 * When the image is tall enough, the text sits on top of it; otherwise (phones, very wide
 * images on small screens) the text moves to a panel directly below the image.
 */
export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  /** Natural width/height per image URL, measured on load. */
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [section, setSection] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState(0);
  const total = slides.length;

  useEffect(() => {
    if (total < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6500);
    return () => clearInterval(id);
  }, [total]);

  useEffect(() => {
    if (!section) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(section);
    return () => ro.disconnect();
  }, [section]);

  if (!total) return null;

  const go = (next: number) => setIndex(((next % total) + total) % total);
  const ratioOf = (src: string) => ratios[src] ?? DEFAULT_RATIO;
  const measure = (src: string) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (w && h) setRatios((r) => (r[src] === w / h ? r : { ...r, [src]: w / h }));
  };

  const current = slides[index];
  const align = current.align ?? "left";
  const alignCls =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  // Before the width is known (server render / first paint) fall back to CSS: text below the
  // image on phones, on top from `md` up. Once measured, decide from the real image height.
  // From tablet up the banner is capped at MAX_HEIGHT; a taller image is then shown whole at that
  // height, beside a teal panel it fades into (no crop, no letterbox blur).
  const shownSrc = width && width < 640 && current.mobileImg ? current.mobileImg : current.img;
  const ratio = ratioOf(shownSrc);
  const naturalH = width / ratio;
  const boxH = width >= 768 ? Math.min(naturalH, MAX_HEIGHT) : naturalH;
  const mode: "auto" | "overlay" | "stacked" = !width ? "auto" : boxH >= textNeeds(width) ? "overlay" : "stacked";
  /** Where a slide's image sits inside the box when it's narrower than the banner (else null). */
  const placement = (r: number) => {
    const w = boxH * r;
    if (mode !== "overlay" || w >= width - 1) return null;
    return { left: align === "right" ? 0 : align === "center" ? (width - w) / 2 : width - w, w };
  };
  // Pin the image away from the text when it doesn't span the full width.
  const pinnedPosition = align === "right" ? "left center" : align === "center" ? "center" : "right center";

  const panelBg = "bg-gradient-to-br from-slate-900 via-teal-900 to-teal-800";
  const contentWrap =
    mode === "overlay"
      ? "absolute inset-0"
      : mode === "stacked"
      ? `relative ${panelBg}`
      : `relative ${panelBg} md:absolute md:inset-0 md:bg-none`;
  const tintVisibility = mode === "overlay" ? "" : mode === "stacked" ? "hidden" : "hidden md:block";
  const onImage = mode === "overlay";

  const deskRatio = ratioOf(current.img);
  const mobRatio = current.mobileImg ? ratioOf(current.mobileImg) : deskRatio;

  return (
    <section ref={setSection} className="relative w-full overflow-hidden bg-slate-900">
      {/* Image box — the active image's own shape (capped at MAX_HEIGHT from tablet up), so the whole picture shows */}
      <div
        className={`relative w-full ${
          mode === "overlay"
            ? ""
            : mode === "stacked"
            ? "aspect-[var(--hero-mob)] sm:aspect-[var(--hero-desk)]"
            : "aspect-[var(--hero-mob)] sm:aspect-[var(--hero-desk)] md:aspect-auto md:h-[min(calc(100vw/var(--hero-desk)),var(--hero-max))] md:bg-gradient-to-r md:from-slate-900 md:to-teal-900"
        }`}
        style={
          {
            "--hero-desk": String(deskRatio),
            "--hero-mob": String(mobRatio),
            "--hero-max": `${MAX_HEIGHT}px`,
            ...(mode === "overlay" ? { height: Math.round(boxH) } : {}),
          } as React.CSSProperties
        }
      >
        {/* All slides stacked, only the active one visible (smooth crossfade) */}
        {slides.map((slide, i) => {
          const active = i === index;
          const place = placement(ratioOf(slide.img));
          // Side panels continue the image's own colours: a thin column taken just inside the edge
          // (skipping any dark vignette band) is stretched across the panel, which also covers that
          // band, so the join with the photo is seamless. Each row keeps its own colour.
          const INSET = 0.06; // share of the image width the panel overlaps (clears edge vignettes)
          const SLICE = 0.005; // share of the image width that gets stretched
          const edge = (side: "left" | "right", left: number, w: number) => {
            const s = w / SLICE; // scaled image width so the slice spans the panel
            const sliceAt = side === "left" ? INSET : 1 - INSET - SLICE;
            return (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0"
                style={{
                  left,
                  width: w,
                  backgroundImage: `url("${assetUrl(slide.img)}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${s}px 100%`,
                  backgroundPosition: `${-sliceAt * s}px center`,
                  // Feather the edge that meets the photo so no hairline shows.
                  maskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, #000 calc(100% - 32px), transparent)`,
                }}
              />
            );
          };
          return (
            <div
              key={i}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${active ? "opacity-100" : "opacity-0"}`}
            >
              <SmartImage
                src={slide.img}
                alt={slide.alt}
                fill
                preload={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                sizes="100vw"
                style={{ objectPosition: place || mode === "auto" ? pinnedPosition : slide.objectPosition ?? "center" }}
                className={`object-contain ${slide.mobileImg ? "hidden sm:block" : ""}`}
                onLoad={measure(slide.img)}
              />
              {slide.mobileImg && (
                <SmartImage
                  src={slide.mobileImg}
                  alt={slide.alt}
                  fill
                  preload={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  className="object-contain sm:hidden"
                  onLoad={measure(slide.mobileImg)}
                />
              )}
              {/* Edge panels go on top so they can cover the image's thin outer band */}
              {place && place.left > 1 && edge("left", 0, place.left + INSET * place.w)}
              {place &&
                place.left + place.w < width - 1 &&
                edge("right", place.left + (1 - INSET) * place.w, width - place.left - (1 - INSET) * place.w)}
            </div>
          );
        })}

        {/* Tint behind the text — only when the text sits on the image */}
        <div className={`pointer-events-none absolute inset-0 ${tintVisibility}`}>
          {current.overlayOpacity ? (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: current.overlayColor || "#0f172a", opacity: current.overlayOpacity }}
            />
          ) : (
            <div
              className={`absolute inset-0 ${
                align === "center"
                  ? "bg-slate-900/25"
                  : `${align === "right" ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-slate-900/50 via-slate-900/15 via-45% to-transparent`
              }`}
            />
          )}
        </div>
      </div>

      {/* Text — on the image when it fits, otherwise in a panel right below it */}
      <div className={contentWrap}>
        <div
          key={index}
          className={`relative mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-8 lg:px-16 ${
            mode === "overlay"
              ? "h-full justify-center pt-6 pb-16"
              : mode === "stacked"
              ? "pt-6 pb-16 sm:pt-8"
              : "pt-6 pb-16 md:h-full md:justify-center"
          }`}
        >
          <div
            className={`flex max-w-xl animate-fade-up flex-col gap-2.5 sm:gap-4 md:max-w-2xl md:gap-5 ${alignCls} ${
              align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : ""
            }`}
            style={onImage && current.textColor ? { color: current.textColor } : undefined}
          >
            <span className="inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white backdrop-blur-md ring-1 ring-white/20 sm:px-4 sm:py-1.5 sm:text-[11px]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
              {current.tag}
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg break-words">
              {current.title}
            </h1>

            <p className="max-w-md text-sm sm:text-base md:text-lg text-white/90 drop-shadow">{current.description}</p>

            <div className="mt-1 flex flex-wrap items-center gap-2 sm:mt-2 sm:gap-3">
              <Link
                href={current.cta.href}
                className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-brand px-4 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                {current.cta.label}
                <span className="flex h-4 w-4 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white/20 transition group-hover:translate-x-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-2.5 w-2.5 sm:h-3 sm:w-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </span>
              </Link>
              {current.secondary && (
                <Link
                  href={current.secondary.href}
                  className="rounded-full bg-white/10 px-4 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20"
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
            <span className="text-xl font-black drop-shadow sm:text-2xl">0{index + 1}</span>
            <span className="h-px w-8 bg-white/60 sm:w-10" />
            <span className="text-white/70">0{total}</span>
          </div>

          {/* Dots */}
          <div className="pointer-events-auto flex gap-1.5 sm:gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  i === index ? "w-6 sm:w-10 bg-white" : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="pointer-events-auto flex gap-1.5 sm:gap-2">
            <button
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/25"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 sm:h-4 sm:w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-brand hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 sm:h-4 sm:w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
