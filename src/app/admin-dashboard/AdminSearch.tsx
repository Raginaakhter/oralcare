"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./AdminHeader";

/** Order numbers (OC-…) jump to that order; anything else searches orders. */
export function AdminSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = q.trim();
        if (!v) return;
        router.push(`/admin-dashboard/orders?search=${encodeURIComponent(v)}`);
      }}
      className="relative hidden max-w-md flex-1 md:block"
    >
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <SearchIcon />
      </span>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search orders by number, customer, phone…"
        className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
      />
    </form>
  );
}
