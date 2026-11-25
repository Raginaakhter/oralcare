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
      {groups.map((group) => (
        <div key={group.group} className="mb-5">
          <div className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
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
                        ? "bg-brand-soft text-brand-dark ring-1 ring-brand/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                        active
                          ? "bg-brand text-white shadow-sm shadow-brand/30"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900"
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
      ))}
    </nav>
  );
}

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
