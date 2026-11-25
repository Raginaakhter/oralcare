"use client";

import { useEffect, useState } from "react";

/** Live countdown to a deal's `endsAt`. Starts from the server's value, then ticks locally. */
export function DealCountdown({ endsAt, initialSeconds }: { endsAt: string; initialSeconds: number }) {
  const [left, setLeft] = useState(Math.max(0, initialSeconds));

  useEffect(() => {
    const end = new Date(endsAt).getTime();
    const tick = () => setLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const parts = [
    { value: Math.floor(left / 86_400), label: "Days", blue: false },
    { value: Math.floor((left % 86_400) / 3600), label: "Hrs", blue: true },
    { value: Math.floor((left % 3600) / 60), label: "Min", blue: false },
    { value: left % 60, label: "Sec", blue: true },
  ];

  return (
    <div className="relative z-10 flex justify-center gap-2 sm:gap-3 md:flex-col md:items-center" aria-label="Time left on this deal">
      {parts.map((p) => (
        <div
          key={p.label}
          className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl ring-1 ${
            p.blue ? "bg-brand-blue-soft text-brand-blue-dark ring-slate-200" : "bg-brand-soft text-brand-dark ring-brand/15"
          }`}
        >
          <span className="text-lg font-extrabold leading-none tabular-nums">{String(p.value).padStart(2, "0")}</span>
          <span className="text-[9px] font-semibold uppercase tracking-wider">{p.label}</span>
        </div>
      ))}
    </div>
  );
}
