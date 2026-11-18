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
import { HeaderNavActions } from "@/components/HeaderNavActions";
import { MobileMenuDrawer } from "@/components/MobileMenuDrawer";

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
          href={site.phoneHref}
          className="hidden shrink-0 items-center gap-1.5 text-[11px] font-semibold text-white/90 transition hover:text-white sm:inline-flex"
        >
          <WhatsappIcon className="h-3.5 w-3.5 text-brand" />
          {site.phone}
        </a>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="h-[2px] bg-gradient-to-r from-brand via-brand-blue to-brand" />

      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 sm:gap-6 px-3 py-2.5 sm:px-6 sm:py-3.5 lg:px-8">
        {/* Mobile Hamburger menu */}
        <MobileMenuDrawer />

        {/* Logo */}
        <Link href="/" className="group relative flex shrink-0 items-center">
          <Image
            src="/images/logo.png"
            alt="OralcareBD - Quality Care for Every Smile"
            width={200}
            height={62}
            priority
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

export function MainNav() {
  return (
    <nav className="relative w-full border-b border-slate-100 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar px-3 py-2 sm:px-6 lg:px-8 sm:py-3">
        {/* Shop All mega button */}
        <Link
          href="/shop"
          className="group inline-flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-900 to-brand-blue-dark px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-md sm:shadow-lg shadow-slate-900/30 ring-1 ring-slate-800 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/40"
        >
          <span className="flex h-4 w-4 sm:h-5 sm:w-5 flex-col items-center justify-center gap-[2.5px] sm:gap-[3px] transition group-hover:gap-[2px]">
            <span className="h-[2px] w-3.5 sm:w-4 rounded-full bg-brand" />
            <span className="h-[2px] w-3.5 sm:w-4 rounded-full bg-brand" />
            <span className="h-[2px] w-3.5 sm:w-4 rounded-full bg-brand" />
          </span>
          Shop All
          <span className="ml-1 hidden rounded-full bg-brand/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand sm:inline">
            100+
          </span>
        </Link>

        {/* Shop by Category — dropdown */}
        <CategoriesDropdown />

        {/* Quick nav links */}
        <ul className="hidden items-center gap-1 text-sm font-semibold text-slate-700 lg:flex shrink-0">
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

        <div className="ml-auto flex shrink-0 items-center gap-2 pl-2">
          {/* Offers pulse pill */}
          <Link
            href="/shop?category=specials"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-brand to-brand-blue px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-black text-white shadow-md transition hover:shadow-lg shrink-0 whitespace-nowrap"
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
    <div className="group relative shrink-0">
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-900 transition hover:border-brand hover:bg-brand-soft hover:text-brand-dark group-hover:border-brand group-hover:bg-brand-soft group-hover:text-brand-dark whitespace-nowrap"
      >
        <GridIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" />
        <span className="hidden xs:inline">Shop by </span>Category
        <ChevronDownIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400 transition group-hover:rotate-180 group-hover:text-brand-dark" />
      </button>

      {/* Mega menu panel */}
      <div className="invisible absolute left-0 top-full z-50 mt-2 w-[min(760px,calc(100vw-24px))] translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-2xl shadow-brand/10 ring-1 ring-brand/15">
          {/* Header */}
          <div className="mb-4 sm:mb-5 flex items-end justify-between border-b border-slate-100 pb-3 sm:pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark">
                Browse Catalog
              </span>
              <h3 className="mt-1 text-lg sm:text-xl font-black text-slate-900">
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
          <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4 max-h-[60vh] overflow-y-auto">
            {categories.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className={`group/item flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl ${c.bg} p-2 sm:p-3 ring-1 ${c.ring} transition hover:-translate-y-0.5 hover:shadow-md`}
              >
                <span className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/70">
                  <Image
                    src={c.img}
                    alt={c.label}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                  />
                </span>
                <div className="leading-tight min-w-0">
                  <div className="text-[11px] sm:text-xs font-black text-slate-900 truncate">
                    {c.label}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-semibold text-brand-dark">
                    Shop Now →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer promo strip */}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-between gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-2.5 sm:px-5 sm:py-3 text-white">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-brand">
                <SparkIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>
              <span className="text-[11px] sm:text-xs">
                Up to <span className="font-black text-brand">25% OFF</span> on Whitening Kits
              </span>
            </div>
            <Link
              href="/shop?category=specials"
              className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[10px] sm:text-[11px] font-black text-white hover:bg-brand-dark shrink-0"
            >
              Grab Deal <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
//           </Link>
//         </div>
//       </div>
//     </div>
//   </div>
// );


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
      className="flex h-8 w-8 items-center justify-center rounded-full text-brand-dark ring-1 ring-brand/15 transition hover:bg-brand hover:text-white"
    >
      {icon}
    </a>
  );
}

/* Floating WhatsApp FAB - sticky bottom-right (above mobile bottom nav) */
export function FloatingWhatsapp() {
  return (
    <a
      href={site.phoneHref}
      aria-label="Chat on WhatsApp"
      className="animate-glow fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-2xl shadow-brand/40 ring-4 ring-white transition hover:scale-110"
    >
      <WhatsappIcon className="h-5 w-5 sm:h-6 sm:w-6" />
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
