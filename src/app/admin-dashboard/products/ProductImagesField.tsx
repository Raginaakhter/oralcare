"use client";

import { useRef, useState } from "react";
import { uploadsApi } from "@/lib/api";
import { SmartImage } from "@/components/SmartImage";
import { useAdminAction } from "../AdminShell";

interface Row {
  url: string;
  alt: string;
  /** Media asset id when the file was uploaded in this session (so it can be deleted). */
  uploadId?: string;
}

const MAX_IMAGES = 20;

/**
 * Product gallery editor: upload from the device (several at once) or paste a URL.
 * Serialises to a hidden "images" field as "url | alt" lines, which ProductForm parses.
 */
export function ProductImagesField({ defaultValue }: { defaultValue?: Array<{ url: string; alt?: string }> }) {
  const run = useAdminAction();
  const [rows, setRows] = useState<Row[]>((defaultValue ?? []).map((i) => ({ url: i.url, alt: i.alt ?? "" })));
  const [busy, setBusy] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (list: FileList | null) => {
    const files = Array.from(list ?? []).slice(0, MAX_IMAGES - rows.length);
    if (!files.length) return;
    setBusy(true);
    const results = await run(
      () => Promise.all(files.map((f) => uploadsApi.product(f))),
      files.length === 1 ? "Image uploaded" : `${files.length} images uploaded`
    );
    setBusy(false);
    if (results) setRows((rs) => [...rs, ...results.map((r) => ({ url: r.url, alt: "", uploadId: r.id }))]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addUrl = () => {
    const url = urlDraft.trim();
    if (!url || rows.length >= MAX_IMAGES) return;
    setRows((rs) => [...rs, { url, alt: "" }]);
    setUrlDraft("");
  };

  const remove = async (i: number) => {
    const row = rows[i];
    // A file uploaded in this session and not saved yet: delete it from the server too.
    if (row.uploadId) await run(() => uploadsApi.remove(row.uploadId!), "Upload deleted");
    setRows((rs) => rs.filter((_, j) => j !== i));
  };

  const move = (i: number, d: -1 | 1) =>
    setRows((rs) => {
      const j = i + d;
      if (j < 0 || j >= rs.length) return rs;
      const next = [...rs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const serialised = rows.map((r) => (r.alt.trim() ? `${r.url} | ${r.alt.trim()}` : r.url)).join("\n");

  return (
    <div className="space-y-3">
      <textarea name="images" value={serialised} readOnly hidden />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy || rows.length >= MAX_IMAGES}
          onClick={() => fileRef.current?.click()}
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload from device"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          onChange={(e) => upload(e.target.files)}
        />
        <span className="text-[11px] text-slate-500">JPG, PNG, WebP or GIF · max 5 MB each · up to {MAX_IMAGES} images</span>
      </div>

      {rows.length > 0 && (
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <li key={`${r.url}-${i}`} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
                <SmartImage src={r.url} alt={r.alt} fill sizes="56px" className="object-cover" />
              </span>
              <div className="min-w-0 flex-1">
                <input
                  value={r.alt}
                  onChange={(e) => setRows((rs) => rs.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
                  placeholder={i === 0 ? "Alt text (main image)" : "Alt text"}
                  maxLength={250}
                  className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs"
                />
                <p className="mt-1 truncate text-[10px] text-slate-400">{r.url}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="h-8 w-8 rounded-lg text-xs text-slate-600 hover:bg-white disabled:opacity-30">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Move down" className="h-8 w-8 rounded-lg text-xs text-slate-600 hover:bg-white disabled:opacity-30">↓</button>
                <button type="button" onClick={() => remove(i)} className="h-8 rounded-lg px-2 text-xs font-bold text-rose-600 hover:bg-rose-50">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="…or paste an image URL"
          className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-brand focus:bg-white"
        />
        <button type="button" onClick={addUrl} className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:border-brand">
          Add URL
        </button>
      </div>
    </div>
  );
}
