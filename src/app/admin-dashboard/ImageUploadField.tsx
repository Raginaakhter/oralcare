"use client";

import { useRef, useState } from "react";
import { API_URL, uploadsApi } from "@/lib/api";
import { SmartImage } from "@/components/SmartImage";
import { useAdminAction } from "./AdminShell";

/**
 * URL input + upload button. Uploads go to POST /admin/uploads/{banner|footer|content};
 * the returned /uploads/... path is made absolute because the CMS schemas
 * only accept full URLs.
 */
export function ImageUploadField({
  label,
  name,
  defaultValue,
  kind,
  required,
  hint,
  size,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  kind: "banner" | "footer" | "content" | "product";
  required?: boolean;
  hint?: string;
  /** Recommended pixel size, shown next to the label and checked against the chosen image. */
  size?: { w: number; h: number };
}) {
  const run = useAdminAction();
  const [value, setValue] = useState(defaultValue ?? "");
  const [natural, setNatural] = useState<{ src: string; w: number; h: number } | null>(null);
  const dims = natural && natural.src === value ? natural : null;
  const [uploaded, setUploaded] = useState<{ id: string; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    const r = await run(() => uploadsApi[kind](file), "Image uploaded");
    setBusy(false);
    if (r) {
      const abs = r.url.startsWith("http") ? r.url : `${API_URL}${r.url}`;
      setValue(abs);
      setUploaded({ id: r.id, url: abs });
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeUpload = async () => {
    if (!uploaded) return;
    const r = await run(() => uploadsApi.remove(uploaded.id), "Upload deleted");
    if (r) {
      if (value === uploaded.url) setValue("");
      setUploaded(null);
    }
  };

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
        {size && (
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 ring-1 ring-indigo-100">
            Recommended: {size.w} × {size.h} px
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="url"
          name={name}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://…"
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-brand focus:bg-white"
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:border-brand disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
      </div>
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
      {value && (
        <div className="mt-2 flex items-center gap-3">
          <span className="relative h-16 w-28 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
            <SmartImage
              src={value}
              alt=""
              fill
              sizes="112px"
              className="object-cover"
              onLoad={(e) => {
                const img = e.currentTarget;
                setNatural({ src: value, w: img.naturalWidth, h: img.naturalHeight });
              }}
            />
          </span>
          {dims && <SizeCheck w={dims.w} h={dims.h} size={size} />}
          {uploaded && (
            <button type="button" onClick={removeUpload} className="text-[11px] font-bold text-rose-600 hover:underline">
              Delete uploaded file
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** "This image: 1600 × 900 px" plus a warning when it's too small or a very different shape. */
function SizeCheck({ w, h, size }: { w: number; h: number; size?: { w: number; h: number } }) {
  let warning = "";
  if (size) {
    const ratio = w / h;
    const want = size.w / size.h;
    if (w < size.w * 0.75) warning = "Too small — may look blurry";
    else if (Math.abs(ratio - want) / want > 0.25) warning = ratio < want ? "Taller shape — the banner will be taller" : "Wider shape — the banner will be shorter";
  }
  return (
    <div className="text-[11px] leading-tight">
      <div className="font-semibold text-slate-700">
        This image: {w} × {h} px
      </div>
      {size &&
        (warning ? (
          <div className="mt-0.5 font-bold text-amber-600">⚠ {warning}</div>
        ) : (
          <div className="mt-0.5 font-bold text-emerald-600">✓ Good size</div>
        ))}
    </div>
  );
}
