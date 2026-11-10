import Link from "next/link";
import Image from "next/image";
import {
  SearchIcon,
  ChevronDownIcon,
} from "@/components/icons";
import { AdminNav } from "./AdminNav";

export const metadata = {
  title: "Admin Dashboard — OralCareBD",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar — white theme */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white text-slate-700 lg:flex">
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
          <Link href="/admin-dashboard" className="flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="OralCareBD"
              width={200}
              height={62}
              priority
              className="h-10 w-auto"
            />
            <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-dark">
              Admin
            </span>
          </Link>
        </div>

        <AdminNav />
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:gap-4 sm:px-6 lg:px-8">
          {/* Mobile logo */}
          <Link href="/admin-dashboard" className="flex items-center gap-2 lg:hidden">
            <Image
              src="/images/logo.png"
              alt="OralCareBD"
              width={200}
              height={62}
              priority
              className="h-9 w-auto"
            />
            <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand-dark">
              Admin
            </span>
          </Link>

          {/* Search */}
          <div className="relative hidden flex-1 max-w-md md:block">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search orders, products, customers…"
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
              ⌘K
            </kbd>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-brand hover:text-brand-dark sm:inline-flex"
            >
              <EyeIcon />
              View Store
            </Link>

            <button
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
            >
              <BellIcon />
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
            </button>

            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 transition hover:border-slate-300">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand to-brand-dark text-sm font-black text-white">
                AR
              </span>
              <div className="hidden text-left leading-tight sm:block">
                <div className="text-xs font-bold text-slate-900">Admin Raj</div>
                <div className="text-[10px] text-slate-500">Super Admin</div>
              </div>
              <ChevronDownIcon className="hidden h-3 w-3 text-slate-400 sm:block" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 21a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
