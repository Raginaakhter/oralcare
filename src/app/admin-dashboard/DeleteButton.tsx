"use client";

import { useState } from "react";

/**
 * Confirm-then-run delete. `onConfirm` performs the API call; the dialog stays
 * open (with a spinner) until it settles and closes on success.
 */
export function DeleteButton({
  label = "Delete",
  itemLabel,
  variant = "icon",
  onConfirm,
  title = "Delete this item?",
  body,
  confirmLabel = "Yes, delete",
}: {
  label?: string;
  itemLabel: string;
  variant?: "icon" | "button" | "full";
  onConfirm: () => Promise<unknown> | unknown;
  title?: string;
  body?: string;
  confirmLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const ok = await onConfirm();
      if (ok !== false) setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  const trash = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
      <path
        d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const trigger =
    variant === "icon" ? (
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
      >
        {trash}
      </button>
    ) : variant === "button" ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
      >
        {label}
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-500/30 transition hover:-translate-y-0.5 hover:bg-rose-600"
      >
        {trash}
        {label}
      </button>
    );

  return (
    <>
      {trigger}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
                  <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
                  <path d="M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-black text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {body ?? (
                    <>
                      You&apos;re about to delete <span className="font-bold text-slate-900">{itemLabel}</span>.
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={run}
                className="rounded-xl bg-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 disabled:opacity-60"
              >
                {busy ? "Working…" : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
