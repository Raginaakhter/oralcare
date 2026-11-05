import Image from "next/image";
import Link from "next/link";
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  CartIcon,
  GridIcon,
  ChevronDownIcon,
  TagIcon,
  TruckIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TiktokIcon,
  WhatsappIcon,
  SparkIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { categories, footerCols, site } from "@/lib/site-data";

export function AnnouncementBar() {
  const ticker = [
    { icon: <TruckIcon className="h-3.5 w-3.5" />, text: "Free Delivery over ৳1,500" },
    { icon: <SparkIcon className="h-3.5 w-3.5" />, text: "100% Authentic Products" },
    { icon: <SparkIcon className="h-3.5 w-3.5" />, text: "7 Days Easy Return" },
    { icon: <SparkIcon className="h-3.5 w-3.5" />, text: "Dentist Approved" },
    { icon: <SparkIcon className="h-3.5 w-3.5" />, text: "Cash on Delivery Available" },
    { icon: <SparkIcon className="h-3.5 w-3.5" />, text: "Up to 25% Off Whitening Kits" },
  ];
  const loop = [...ticker, ...ticker];
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white">
      {/* Subtle animated gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-sky-500/10 to-emerald-500/20" />
      {/* Diagonal stripes */}
      <div className="pointer-events-none absolute inset-0 animated-stripes opacity-50" />

      <div className="relative mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-2 text-[12px] sm:px-6 lg:px-8">
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

        {/* Phone pill */}
        <a
          href={site.phoneHref}
          className="group hidden shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-dark px-4 py-1.5 text-[11px] font-bold shadow-lg shadow-emerald-500/30 ring-1 ring-white/10 transition hover:scale-105 sm:inline-flex"
        >
          <WhatsappIcon className="h-3.5 w-3.5" />
          <span className="opacity-75">Need help?</span>
          <span className="font-black">{site.phone}</span>
        </a>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/85 backdrop-blur-xl">
      {/* Gradient top accent bar */}
      <div className="h-[2px] bg-gradient-to-r from-brand via-brand-blue to-brand" />

      <div className="mx-auto flex w-full max-w-7xl items-center gap-5 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo with glow backdrop */}
        <Link href="/" className="group relative flex shrink-0 items-center">
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-emerald-200/0 blur-2xl transition group-hover:bg-emerald-200/60" />
          <Image
            src="/images/logo.png"
            alt="OralcareBD - Quality Care for Every Smile"
            width={200}
            height={62}
            priority
            className="h-12 w-auto transition group-hover:scale-105"
          />
        </Link>

        {/* Deliver-to pill */}
        <Link
          href="/contact-us"
          className="hidden shrink-0 items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs transition hover:bg-slate-100 lg:inline-flex"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white">
            <PinIcon className="h-3.5 w-3.5" />
          </span>
          <div className="leading-tight">
            <div className="text-[10px] font-semibold text-slate-500">Deliver to</div>
            <div className="text-[12px] font-bold text-slate-900">Bangladesh</div>
          </div>
          <ChevronDownIcon className="h-3 w-3 text-slate-400" />
        </Link>

        {/* Premium search bar */}
        <form
          role="search"
          action="/shop"
          className="group relative hidden flex-1 md:block"
        >
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand/20 via-brand-blue/20 to-brand/20 opacity-0 blur-xl transition group-focus-within:opacity-100" />
          <div className="relative flex items-center overflow-hidden rounded-full border border-slate-200 bg-white transition group-focus-within:border-brand group-focus-within:shadow-lg group-focus-within:shadow-emerald-100">
            <span className="pointer-events-none flex h-12 w-12 shrink-0 items-center justify-center text-slate-400">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              type="search"
              name="q"
              placeholder="Search toothpaste, whitening, mouthwash..."
              className="h-12 flex-1 bg-transparent pr-3 text-sm outline-none placeholder:text-slate-400"
            />
            <kbd className="mr-2 hidden items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500 lg:inline-flex">
              <span>⌘</span>
              <span>K</span>
            </kbd>
            <button
              type="submit"
              aria-label="Search"
              className="group/btn mr-1 flex h-10 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-dark px-4 text-xs font-bold text-white shadow-md transition hover:shadow-lg hover:shadow-emerald-200"
            >
              Search
              <ArrowRightIcon className="h-3 w-3 transition group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </form>

        {/* Icon tile cluster */}
        <div className="ml-auto flex items-center gap-2">
          <IconTile
            href="/my-account"
            icon={<UserIcon className="h-5 w-5" />}
            label="Account"
            sub="Sign in"
          />
          <IconTile
            href="/wishlist"
            icon={<HeartIcon className="h-5 w-5" />}
            label="Wishlist"
            sub="0 items"
            count={0}
            accent="rose"
          />
          <IconTile
            href="/cart"
            icon={<CartIcon className="h-5 w-5" />}
            label="Cart"
            sub="৳0.00"
            count={0}
            accent="emerald"
            primary
          />
        </div>
      </div>
    </header>
  );
}

function IconTile({
  href,
  icon,
  label,
  sub,
  count,
  accent = "slate",
  primary = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  count?: number;
  accent?: "slate" | "emerald" | "rose";
  primary?: boolean;
}) {
  const bg = primary
    ? "bg-gradient-to-br from-brand to-brand-dark text-white shadow-lg shadow-emerald-200/60"
    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50";
  const badge =
    accent === "rose"
      ? "bg-rose-500"
      : accent === "emerald"
      ? "bg-amber-400 text-blue-950"
      : "bg-blue-900 text-white";

  return (
    <Link
      href={href}
      className={`group relative hidden items-center gap-2 rounded-2xl px-3 py-2 transition hover:-translate-y-0.5 sm:inline-flex ${bg}`}
    >
      <span className="relative">
        {icon}
        {typeof count === "number" && (
          <span
            className={`absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black shadow-md ${badge}`}
          >
            {count}
          </span>
        )}
      </span>
      <div className="hidden text-left leading-tight md:block">
        <div className="text-[10px] font-semibold opacity-75">{sub}</div>
        <div className="text-xs font-bold">{label}</div>
      </div>
    </Link>
  );
}

export function MainNav() {
  return (
    <nav className="relative w-full border-b border-slate-100 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Shop All mega button */}
        <Link
          href="/shop"
          className="group inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-br from-blue-900 to-brand-blue-dark px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-800 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40"
        >
          <span className="flex h-5 w-5 flex-col items-center justify-center gap-[3px] transition group-hover:gap-[2px]">
            <span className="h-[2px] w-4 rounded-full bg-brand" />
            <span className="h-[2px] w-4 rounded-full bg-brand" />
            <span className="h-[2px] w-4 rounded-full bg-brand" />
          </span>
          Shop All
          <span className="ml-1 hidden rounded-full bg-brand/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand sm:inline">
            100+
          </span>
        </Link>

        {/* Shop by Category — single dropdown */}
        <CategoriesDropdown />

        {/* Quick nav links */}
        <ul className="hidden items-center gap-1 text-sm font-semibold text-slate-700 lg:flex">
          <li>
            <Link
              href="/blog"
              className="group relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-slate-50"
            >
              <span className="relative">
                Blog
                <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand to-brand-blue transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/about-us"
              className="group relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-slate-50"
            >
              <span className="relative">
                About
                <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand to-brand-blue transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/contact-us"
              className="group relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-slate-50"
            >
              <span className="relative">
                Contact
                <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand to-brand-blue transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </Link>
          </li>
        </ul>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* Offers pulse pill */}
          <Link
            href="/shop?category=specials"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-brand to-brand-blue px-4 py-1.5 text-xs font-black text-white shadow-md transition hover:shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <TagIcon className="h-3.5 w-3.5" />
              HOT OFFERS
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function CategoriesDropdown() {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:border-brand hover:bg-brand-soft hover:text-brand-dark group-hover:border-brand group-hover:bg-brand-soft group-hover:text-brand-dark"
      >
        <GridIcon className="h-4 w-4 text-brand" />
        Shop by Category
        <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400 transition group-hover:rotate-180 group-hover:text-brand-dark" />
      </button>

      {/* Mega menu panel */}
      <div className="invisible absolute left-0 top-full z-50 mt-2 w-[min(760px,92vw)] translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="overflow-hidden rounded-3xl bg-white p-6 shadow-2xl shadow-emerald-100/50 ring-1 ring-emerald-100">
          {/* Header */}
          <div className="mb-5 flex items-end justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark">
                Browse Catalog
              </span>
              <h3 className="mt-1 text-xl font-black text-slate-900">
                Shop by Category
              </h3>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-dark hover:underline"
            >
              View All <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className={`group/item flex items-center gap-3 rounded-2xl ${c.bg} p-3 ring-1 ${c.ring} transition hover:-translate-y-0.5 hover:shadow-md`}
              >
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/70">
                  <Image
                    src={c.img}
                    alt={c.label}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                  />
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-black text-slate-900">
                    {c.label}
                  </div>
                  <div className="text-[10px] font-semibold text-brand-dark">
                    Shop Now →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer promo strip */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-3 text-white">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand">
                <SparkIcon className="h-3.5 w-3.5" />
              </span>
              <span>
                Up to <span className="font-black text-brand">25% OFF</span> on Whitening Kits
              </span>
            </div>
            <Link
              href="/shop?category=specials"
              className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-[11px] font-black text-white hover:bg-brand-dark"
            >
              Grab the Deal <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-14 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Image
            src="/images/logo.png"
            alt="OralcareBD"
            width={200}
            height={62}
            className="h-12 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-slate-600">
            {site.description}
          </p>
          <div className="mt-5 flex gap-3">
            <SocialLink icon={<FacebookIcon />} href="https://facebook.com/" />
            <SocialLink icon={<InstagramIcon />} href="https://instagram.com/" />
            <SocialLink icon={<YoutubeIcon />} href="https://youtube.com/" />
            <SocialLink icon={<TiktokIcon />} href="https://tiktok.com/" />
            <SocialLink icon={<WhatsappIcon />} href={site.phoneHref} />
          </div>
        </div>

        {footerCols.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-bold text-slate-900">{col.title}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-brand-dark">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="mb-3 text-sm font-bold text-slate-900">Contact Us</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 hover:text-brand-dark"
              >
                <PhoneIcon className="h-4 w-4 text-brand" /> {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 hover:text-brand-dark"
              >
                <MailIcon className="h-4 w-4 text-brand" /> {site.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <PinIcon className="h-4 w-4 text-brand" /> {site.address}
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {["VISA", "MC", "bKash", "Nagad"].map((p) => (
              <span
                key={p}
                className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          {site.copyright}
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="flex h-8 w-8 items-center justify-center rounded-full text-brand-dark ring-1 ring-emerald-100 transition hover:bg-brand hover:text-white"
    >
      {icon}
    </a>
  );
}

/* Floating WhatsApp FAB - sticky bottom-right */
export function FloatingWhatsapp() {
  return (
    <a
      href={site.phoneHref}
      aria-label="Chat on WhatsApp"
      className="animate-glow fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-brand-dark text-white shadow-2xl shadow-emerald-500/40 ring-4 ring-white transition hover:scale-110"
    >
      <WhatsappIcon className="h-6 w-6" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold">
        1
      </span>
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
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 ring-1 ring-emerald-100">
      <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 animate-blob rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 animate-blob rounded-full bg-sky-200/50 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/2 h-32 w-32 animate-blob rounded-full bg-rose-200/40 blur-3xl" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {breadcrumbs && (
          <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
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
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-3 max-w-2xl text-slate-600">{subtitle}</p>}
      </div>
    </section>
  );
}
