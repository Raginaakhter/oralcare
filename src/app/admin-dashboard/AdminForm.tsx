import Link from "next/link";

export function FormCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
      <div>
        <h2 className="text-base font-black text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
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
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
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
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={rows}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
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
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function FormActions({
  cancelHref,
  submitLabel = "Save Changes",
  secondaryLabel,
}: {
  cancelHref: string;
  submitLabel?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="sticky bottom-4 z-10 mt-6 flex flex-wrap items-center justify-end gap-3 rounded-2xl bg-white p-3 shadow-lg shadow-slate-200/60 ring-1 ring-slate-200/70">
      <Link
        href={cancelHref}
        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300"
      >
        Cancel
      </Link>
      {secondaryLabel && (
        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-brand hover:text-brand-dark"
        >
          {secondaryLabel}
        </button>
      )}
      <button
        type="submit"
        className="rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-brand-dark"
      >
        {submitLabel}
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
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-brand"
      />
      <div>
        <div className="text-sm font-bold text-slate-900">{label}</div>
        {description && (
          <div className="mt-0.5 text-xs text-slate-500">{description}</div>
        )}
      </div>
    </label>
  );
}
