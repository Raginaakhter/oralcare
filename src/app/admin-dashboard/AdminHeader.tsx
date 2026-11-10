import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

type Crumb = { label: string; href?: string };

export function AdminHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {breadcrumbs && (
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
            {breadcrumbs.map((c, i) => (
              <span key={c.label} className="inline-flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-300">/</span>}
                {c.href ? (
                  <Link href={c.href} className="hover:text-brand-dark">
                    {c.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-700">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "secondary",
  icon,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  icon?: React.ReactNode;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition";
  const styles = {
    primary: `${base} bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 hover:bg-brand-dark`,
    secondary: `${base} border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-brand hover:text-brand-dark`,
    ghost: `${base} text-slate-600 hover:bg-slate-100`,
  };
  return (
    <button type="button" className={styles[variant]}>
      {icon}
      {children}
    </button>
  );
}

export function SeeAllLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs font-bold text-brand-dark hover:underline"
    >
      View All <ArrowRightIcon className="h-3 w-3" />
    </Link>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "success" | "info" | "warning" | "danger" | "neutral" | "accent";
  children: React.ReactNode;
}) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    info: "bg-sky-50 text-sky-700 ring-sky-100",
    warning: "bg-amber-50 text-amber-700 ring-amber-100",
    danger: "bg-rose-50 text-rose-700 ring-rose-100",
    neutral: "bg-slate-100 text-slate-700 ring-slate-200",
    accent: "bg-violet-50 text-violet-700 ring-violet-100",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ${styles[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
export function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
      <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
      <path d="M3 5h18M6 12h12M10 19h4" strokeLinecap="round" />
    </svg>
  );
}
export function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  );
}
