"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Permission } from "@/lib/api";
import {
  CartIcon,
  UserIcon,
  TagIcon,
  TruckIcon,
  SparkIcon,
} from "@/components/icons";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  /** Permission the matching backend routes require; hidden without it. */
  perm?: Permission;
  badge?: string;
};

const nav: { group: string; items: NavItem[] }[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/admin-dashboard", icon: <DashboardIcon /> },
      { label: "Analytics", href: "/admin-dashboard/analytics", icon: <BarIcon />, perm: "orders:read" },
    ],
  },
  {
    group: "Catalog",
    items: [
      { label: "Products", href: "/admin-dashboard/products", icon: <TagIcon className="h-4 w-4" />, perm: "catalog:manage" },
      { label: "Categories", href: "/admin-dashboard/categories", icon: <GridIcon />, perm: "catalog:manage" },
      { label: "Brands", href: "/admin-dashboard/brands", icon: <StarAltIcon />, perm: "catalog:manage" },
      { label: "Inventory", href: "/admin-dashboard/inventory", icon: <BoxIcon />, perm: "catalog:manage" },
    ],
  },
  {
    group: "Sales",
    items: [
      { label: "Orders", href: "/admin-dashboard/orders", icon: <CartIcon className="h-4 w-4" />, perm: "orders:read" },
      { label: "Returns & Refunds", href: "/admin-dashboard/returns", icon: <BoxIcon />, perm: "returns:manage" },
      { label: "Customers", href: "/admin-dashboard/customers", icon: <UserIcon className="h-4 w-4" />, perm: "customers:read" },
      { label: "Shipping", href: "/admin-dashboard/shipping", icon: <TruckIcon className="h-4 w-4" /> },
    ],
  },
  {
    group: "Marketing",
    items: [
      { label: "Coupons", href: "/admin-dashboard/promotions", icon: <SparkIcon className="h-4 w-4" />, perm: "coupons:manage" },
      { label: "Reviews", href: "/admin-dashboard/reviews", icon: <StarAltIcon />, perm: "reviews:manage" },
      { label: "Newsletter", href: "/admin-dashboard/newsletter", icon: <LayoutIcon />, perm: "content:manage" },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Banners", href: "/admin-dashboard/content/banner", icon: <ImageIcon />, perm: "content:manage" },
      { label: "Deal of the Day", href: "/admin-dashboard/content/deals", icon: <SparkIcon className="h-4 w-4" />, perm: "content:manage" },
      { label: "Shop the Look", href: "/admin-dashboard/content/looks", icon: <GridIcon />, perm: "content:manage" },
      { label: "Blog", href: "/admin-dashboard/content/blog", icon: <LayoutIcon />, perm: "content:manage" },
      { label: "Testimonials", href: "/admin-dashboard/content/testimonials", icon: <StarAltIcon />, perm: "content:manage" },
      { label: "Instagram", href: "/admin-dashboard/content/instagram", icon: <ImageIcon />, perm: "content:manage" },
      { label: "Footer", href: "/admin-dashboard/content/footer", icon: <LayoutIcon />, perm: "content:manage" },
    ],
  },
  {
    group: "Administration",
    items: [
      { label: "Staff", href: "/admin-dashboard/staff", icon: <UserIcon className="h-4 w-4" />, perm: "staff:manage" },
      { label: "Roles & Permissions", href: "/admin-dashboard/roles", icon: <BoxIcon />, perm: "staff:manage" },
    ],
  },
];

/** Reads the current path; render inside <Suspense> (path is runtime data on dynamic routes). */
export function AdminNav() {
  return <AdminNavList pathname={usePathname()} />;
}

/** Plain nav list; with an empty pathname it doubles as the Suspense fallback. */
export function AdminNavList({ pathname }: { pathname: string }) {
  const { can } = useAuth();
  const groups = nav
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.perm || can(i.perm)) }))
    .filter((g) => g.items.length > 0);

  const isActive = (href: string) => {
    if (href === "/admin-dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-5">
      {groups.map((group) => {
        const tone = GROUP_TONES[group.group] ?? GROUP_TONES.Overview;
        return (
        <div key={group.group} className="mb-5">
          <div className="mb-2 flex items-center gap-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${tone.active}`} />
            {group.group}
          </div>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      active
                        ? `bg-gradient-to-r ${tone.activeBg} font-bold text-slate-900 ring-1 ${tone.ring}`
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                        active
                          ? `bg-gradient-to-br ${tone.active} text-white shadow-md`
                          : `${tone.idle} group-hover:scale-110`
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          active
                            ? "bg-brand/15 text-brand-dark"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        );
      })}
    </nav>
  );
}

/** One colour family per nav group so the sidebar reads at a glance. */
const GROUP_TONES: Record<string, { idle: string; active: string; activeBg: string; ring: string }> = {
  Overview: { idle: "bg-teal-50 text-teal-600", active: "from-teal-400 to-cyan-600", activeBg: "from-teal-50 to-cyan-50", ring: "ring-teal-200" },
  Catalog: { idle: "bg-sky-50 text-sky-600", active: "from-sky-400 to-blue-600", activeBg: "from-sky-50 to-blue-50", ring: "ring-sky-200" },
  Sales: { idle: "bg-violet-50 text-violet-600", active: "from-violet-500 to-indigo-600", activeBg: "from-violet-50 to-indigo-50", ring: "ring-violet-200" },
  Marketing: { idle: "bg-pink-50 text-pink-600", active: "from-pink-500 to-rose-500", activeBg: "from-pink-50 to-rose-50", ring: "ring-pink-200" },
  Content: { idle: "bg-amber-50 text-amber-600", active: "from-amber-400 to-orange-500", activeBg: "from-amber-50 to-orange-50", ring: "ring-amber-200" },
  Administration: { idle: "bg-slate-100 text-slate-600", active: "from-slate-600 to-slate-800", activeBg: "from-slate-50 to-slate-100", ring: "ring-slate-200" },
};

/* Admin-specific icons */
function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <rect x="3" y="3" width="7" height="9" rx="2" />
      <rect x="14" y="3" width="7" height="5" rx="2" />
      <rect x="14" y="12" width="7" height="9" rx="2" />
      <rect x="3" y="16" width="7" height="5" rx="2" />
    </svg>
  );
}
function BarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z" strokeLinejoin="round" />
      <path d="m3 7 9 5 9-5M12 22V12" />
    </svg>
  );
}
function StarAltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <path d="m12 2 3 7 7 .5-5.5 4.5 2 7L12 17l-6.5 4 2-7L2 9.5 9 9l3-7Z" strokeLinejoin="round" />
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m21 15-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LayoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 3v18" />
    </svg>
  );
}
