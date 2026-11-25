import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { AdminNav, AdminNavList } from "./AdminNav";
import { AdminGate, AdminUserMenu } from "./AdminShell";
import { AdminSearch } from "./AdminSearch";

export const metadata = {
  title: "Admin Dashboard — OralCareBD",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white text-slate-700 lg:flex">
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
          <Link href="/admin-dashboard" className="flex items-center gap-2.5">
            <Image src="/images/logo.png" alt="OralCareBD" width={200} height={62} preload loading="eager" className="h-10 w-auto" />
            <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-dark">
              Admin
            </span>
          </Link>
        </div>
        <Suspense fallback={<AdminNavList pathname="" />}>
          <AdminNav />
        </Suspense>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:gap-4 sm:px-6 lg:px-8">
          <Link href="/admin-dashboard" className="flex items-center gap-2 lg:hidden">
            <Image src="/images/logo.png" alt="OralCareBD" width={200} height={62} preload loading="eager" className="h-9 w-auto" />
          </Link>

          <AdminSearch />

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-brand hover:text-brand-dark sm:inline-flex"
            >
              View Store
            </Link>
            <AdminUserMenu />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <AdminGate>{children}</AdminGate>
        </main>
      </div>
    </div>
  );
}
