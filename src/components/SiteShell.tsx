import Image from "next/image";
import Link from "next/link";
import {
  SearchIcon,
  UserIcon,
  ChevronDownIcon,
  TruckIcon,
  PinIcon,
  WhatsappIcon,
  SparkIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { HeaderNavActions } from "@/components/HeaderNavActions";
import { MobileMenuDrawer, type MenuCategory } from "@/components/MobileMenuDrawer";

/** Store contact details, from the CMS footer settings (GET /footer). */
export interface SiteContact {
  phone: string;
  whatsappHref: string;
  telHref: string;
}

export function AnnouncementBar({
  contact,
  freeShippingThreshold,
  codAvailable,
}: {
  contact: SiteContact;
  freeShippingThreshold: number | null;
  codAvailable: boolean;
}) {
  // Store promises only; delivery facts come from GET /shipping/methods.
  const ticker = [
    ...(freeShippingThreshold
      ? [{ icon: <TruckIcon className="h-3.5 w-3.5" />, text: `Free Delivery over ৳${freeShippingThreshold.toLocaleString("en-US")}` }]
      : [{ icon: <TruckIcon className="h-3.5 w-3.5" />, text: "Delivery to all 64 districts" }]),
    { icon: <SparkIcon className="h-3.5 w-3.5" />, text: "100% Authentic Products" },
    { icon: <SparkIcon className="h-3.5 w-3.5" />, text: "7 Days Easy Return" },
    { icon: <SparkIcon className="h-3.5 w-3.5" />, text: "Dentist Approved" },
    ...(codAvailable ? [{ icon: <SparkIcon className="h-3.5 w-3.5" />, text: "Cash on Delivery Available" }] : []),
  ];
  const loop = [...ticker, ...ticker];
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand/20 via-brand/10 to-brand/20" />
      <div className="pointer-events-none absolute inset-0 animated-stripes opacity-50" />

      <div className="relative mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-2 text-[12px] sm:px-6 lg:px-8">
        {/* Deliver-to (left) */}
        <div className="hidden shrink-0 items-center gap-1.5 text-[11px] text-white/80 sm:inline-flex">
          <PinIcon className="h-3.5 w-3.5 text-brand" />
          Deliver to <span className="font-semibold text-white">Bangladesh</span>
        </div>

        {/* Rotating marquee */}
        <div className="marquee-container flex-1 overflow-hidden">
          <div className="marquee-track flex items-center gap-10 pr-10">
            {loop.map((t, i) => (
              <span
                key={i}
                aria-hidden={i >= ticker.length ? "true" : undefined}
                className="inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-white/90"
              >
                <span className="text-brand">{t.icon}</span>
                {t.text}
              </span>
            ))}
          </div>
        </div>

        {/* Phone/WhatsApp (right) */}
        <a
          href={contact.whatsappHref}
          className="hidden shrink-0 items-center gap-1.5 text-[11px] font-semibold text-white/90 transition hover:text-white sm:inline-flex"
        >
          <WhatsappIcon className="h-3.5 w-3.5 text-brand" />
          {contact.phone}
        </a>
      </div>
    </div>
  );
}

export function Header({ menuCategories, contact }: { menuCategories: MenuCategory[]; contact: SiteContact }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="h-[2px] bg-gradient-to-r from-brand via-brand-blue to-brand" />

      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 sm:gap-6 px-3 py-2.5 sm:px-6 sm:py-3.5 lg:px-8">
        {/* Mobile Hamburger menu */}
        <MobileMenuDrawer categories={menuCategories} contact={contact} />

        {/* Logo */}
        <Link href="/" className="group relative flex shrink-0 items-center">
          <Image
            src="/images/logo.png"
            alt="OralcareBD - Quality Care for Every Smile"
            width={200}
            height={62}
            preload
            loading="eager"
            className="h-8 sm:h-11 w-auto transition group-hover:scale-105"
          />
        </Link>

        {/* Search bar */}
        <form
          role="search"
          action="/shop"
          className="group relative hidden flex-1 md:block"
        >
          <div className="relative flex items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50/60 transition group-focus-within:border-brand group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-brand/15">
            <span className="pointer-events-none flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              type="search"
              name="q"
              placeholder="Search for products, brands, categories..."
              className="h-11 flex-1 bg-transparent pr-3 text-sm outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Search"
              className="mr-1 flex h-9 items-center gap-1.5 rounded-full bg-brand px-5 text-xs font-bold text-white transition hover:bg-brand-dark"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action icons */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Mobile search */}
          <Link
            href="/shop"
            aria-label="Search"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 md:hidden"
          >
            <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>

          <HeaderNavActions />
        </div>
      </div>
    </header>
  );
}

function IconButton({
  href,
  label,
  icon,
  count,
  badgeTone = "brand",
  sub,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  badgeTone?: "brand" | "rose";
  sub?: string;
}) {
  const badge =
    badgeTone === "rose"
      ? "bg-rose-500 text-white"
      : "bg-brand text-white";
  return (
    <Link
      href={href}
      aria-label={label}
      className="group relative flex items-center gap-2 rounded-full px-2.5 py-2 text-slate-700 transition hover:bg-slate-100 sm:px-3"
    >
      <span className="relative">
        {icon}
        {typeof count === "number" && (
          <span
            className={`absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black shadow-sm ${badge}`}
          >
            {count}
          </span>
        )}
      </span>
      {sub && (
        <span className="hidden text-xs font-semibold text-slate-700 lg:inline">
          {sub}
        </span>
      )}
    </Link>
  );
}

function AccountMenu() {
  const items = [
    { label: "Sign In", href: "/signin" },
    { label: "Create Account", href: "/create-account" },
    { label: "My Orders", href: "/my-account" },
    { label: "My Wishlist", href: "/wishlist" },
    { label: "My Cart", href: "/cart" },
  ];
  return (
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
              <div className="text-xs font-bold text-slate-900">Hello, Guest</div>
              <div className="text-[11px] text-slate-500">Sign in for better experience</div>
            </div>
          </div>
          <ul>
            {items.map((it) => (
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
  );
}

export function FloatingWhatsapp({ contact }: { contact: SiteContact }) {
  return (
    <a
      href={contact.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="animate-glow fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-2xl shadow-brand/40 ring-4 ring-white transition hover:scale-110"
    >
      <WhatsappIcon className="h-5 w-5 sm:h-6 sm:w-6" />
    </a>
  );
}

/* Reusable page hero - small banner for subpages */
export function PageHero({
  title,
  subtitle,
  breadcrumbs,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-soft via-white to-brand-soft ring-1 ring-brand/15">
      <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 animate-blob rounded-full bg-slate-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 animate-blob rounded-full bg-slate-200/50 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/2 h-32 w-32 animate-blob rounded-full bg-rose-200/40 blur-3xl" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:py-14 sm:px-6 lg:px-8">
        {breadcrumbs && (
          <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-500">
            {breadcrumbs.map((b, i) => (
              <span key={b.label} className="inline-flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-300">/</span>}
                {b.href ? (
                  <Link href={b.href} className="hover:text-brand-dark">
                    {b.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-700">{b.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-black text-slate-900 sm:text-4xl break-words">
          {title}
        </h1>
        {subtitle && <p className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-base text-slate-600">{subtitle}</p>}
      </div>
    </section>
  );
}
