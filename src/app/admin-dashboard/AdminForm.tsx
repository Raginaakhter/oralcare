import Link from "next/link";

/*
 * Uncontrolled form primitives. Pages read values with FormData on submit,
 * so every input needs a `name`.
 */

const control =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20";

export function FormCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Label({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-bold text-slate-700">
      {label}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  );
}

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required,
  hint,
  min,
  max,
  step,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  hint?: string;
  min?: number;
  max?: number;
  step?: number | "any";
  disabled?: boolean;
}) {
  return (
    <div>
      <Label label={label} required={required} />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        required={required}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`h-10 ${control} disabled:opacity-60`}
      />
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

export function Textarea({
  label,
  name,
  placeholder,
  defaultValue,
  rows = 4,
  hint,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string | null;
  rows?: number;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label label={label} required={required} />
      <textarea
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        rows={rows}
        required={required}
        className={`py-2.5 ${control}`}
      />
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

export function Select({
  label,
  name,
  options,
  defaultValue,
  required,
  hint,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string | null;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <Label label={label} required={required} />
      <select name={name} defaultValue={defaultValue ?? undefined} required={required} className={`h-10 ${control}`}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

export function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function FormActions({
  cancelHref,
  submitLabel = "Save Changes",
  pending,
  extra,
}: {
  cancelHref: string;
  submitLabel?: string;
  pending?: boolean;
  extra?: React.ReactNode;
}) {
  return (
    <div className="sticky bottom-4 z-10 mt-6 flex flex-wrap items-center justify-end gap-3 rounded-2xl bg-white p-3 shadow-lg shadow-slate-200/60 ring-1 ring-slate-200/70">
      <Link
        href={cancelHref}
        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300"
      >
        Cancel
      </Link>
      {extra}
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </div>
  );
}

export function Toggle({
  label,
  name,
  defaultChecked,
  description,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-slate-300">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 accent-brand" />
      <div>
        <div className="text-sm font-bold text-slate-900">{label}</div>
        {description && <div className="mt-0.5 text-xs text-slate-500">{description}</div>}
      </div>
    </label>
  );
}

// ─── FormData helpers ──────────────────────────────────────

export function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

/** Trimmed string, or undefined when empty (so optional fields are omitted). */
export function opt(fd: FormData, key: string): string | undefined {
  const v = str(fd, key);
  return v ? v : undefined;
}

export function num(fd: FormData, key: string): number | undefined {
  const v = str(fd, key);
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on";
}

/** "a, b, c" → ["a","b","c"] */
export function list(fd: FormData, key: string, sep: RegExp = /[,\n]/): string[] {
  return str(fd, key)
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);
}
