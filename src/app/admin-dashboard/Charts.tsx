"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";

/**
 * Small dependency-free SVG charts for the admin dashboard.
 * Colours were checked with the dataviz palette validator (teal ↔ violet pass CVD + contrast);
 * text always uses slate inks, never the series colour.
 */

export const CHART = {
  teal: "#0d9488",
  violet: "#7c3aed",
  pink: "#db2777",
  blue: "#2563eb",
  grid: "#e2e8f0",
  axis: "#cbd5e1",
  ink: "#0f172a",
  muted: "#64748b",
} as const;

/** Status colours (meaning, not identity) — always shown next to a text label. */
export const STATUS_COLOR: Record<string, string> = {
  amber: "#f59e0b",
  blue: "#0ea5e9",
  violet: "#8b5cf6",
  green: "#10b981",
  red: "#f43f5e",
  slate: "#94a3b8",
};

export function compact(n: number): string {
  const a = Math.abs(n);
  if (a >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (a >= 10_000) return `${+(n / 1_000).toFixed(a >= 100_000 ? 0 : 1)}K`;
  return Math.round(n).toLocaleString("en-US");
}

function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0, 1];
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step * 0.001; v += step) ticks.push(+v.toFixed(6));
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

/** Callback ref + measured width (ResizeObserver reports the initial size on observe). */
function useWidth<T extends HTMLElement>() {
  const [el, setEl] = useState<T | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);
  return [setEl, width] as const;
}

/** Every `every`-th date gets a label; the last one too, unless it would crowd its neighbour. */
function showTick(i: number, n: number, every: number) {
  if (i % every === 0) return (n - 1 - i) >= every * 0.6 || i === n - 1;
  return i === n - 1 && i % every >= every * 0.6;
}

function tickAnchor(i: number, n: number) {
  return n > 1 && i === n - 1 ? "end" : i === 0 && n > 1 ? "start" : "middle";
}

function shortDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type Point = { date: string; value: number };

function Tooltip({ x, width, title, rows }: { x: number; width: number; title: string; rows: [string, string, string][] }) {
  const left = Math.min(Math.max(x, 70), Math.max(width - 70, 70));
  return (
    <div
      className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-2 text-[11px] text-white shadow-xl"
      style={{ left }}
    >
      <div className="font-semibold text-slate-300">{title}</div>
      {rows.map(([color, label, value]) => (
        <div key={label} className="mt-0.5 flex items-center gap-2 whitespace-nowrap">
          <span className="h-2 w-2 rounded-full" style={{ background: color }} />
          <span className="text-slate-300">{label}</span>
          <span className="ml-auto pl-2 font-bold tabular-nums">{value}</span>
        </div>
      ))}
    </div>
  );
}

const PAD = { top: 16, right: 12, bottom: 26, left: 44 };

/** Line + soft gradient wash, with a crosshair tooltip. One series. */
export function AreaChart({
  data,
  color = CHART.teal,
  label,
  format = compact,
  height = 240,
}: {
  data: Point[];
  color?: string;
  label: string;
  format?: (n: number) => string;
  height?: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const gid = useId().replace(/:/g, "");

  if (!data.length) return <EmptyChart height={height} />;

  const w = Math.max(width, 200);
  const iw = w - PAD.left - PAD.right;
  const ih = height - PAD.top - PAD.bottom;
  const ticks = niceTicks(Math.max(...data.map((d) => d.value)));
  const top = ticks[ticks.length - 1] || 1;
  const x = (i: number) => PAD.left + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => PAD.top + ih - (v / top) * ih;
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join("");
  const area = `${line}L${x(data.length - 1)},${PAD.top + ih}L${x(0)},${PAD.top + ih}Z`;
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(iw / 64))));
  const peak = data.reduce((m, d, i) => (d.value > data[m].value ? i : m), 0);

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    setHover(data.length === 1 ? 0 : Math.round((px / r.width) * (data.length - 1)));
  };

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={w} height={height} role="img" aria-label={`${label} over time`} className="block">
          <defs>
            <linearGradient id={`g${gid}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={w - PAD.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? CHART.axis : CHART.grid} />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={10} fill={CHART.muted} className="tabular-nums">
                {format(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) =>
            showTick(i, data.length, labelEvery) ? (
              <text key={d.date} x={x(i)} y={height - 8} textAnchor={tickAnchor(i, data.length)} fontSize={10} fill={CHART.muted}>
                {shortDate(d.date)}
              </text>
            ) : null
          )}
          <path d={area} fill={`url(#g${gid})`} />
          <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {/* Direct label on the peak only */}
          {data.length > 1 && hover === null && (
            <g>
              <circle cx={x(peak)} cy={y(data[peak].value)} r={4.5} fill={color} stroke="#fff" strokeWidth={2} />
              <text
                x={Math.min(Math.max(x(peak), PAD.left + 30), w - PAD.right - 30)}
                y={y(data[peak].value) - 10}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={CHART.ink}
              >
                {format(data[peak].value)}
              </text>
            </g>
          )}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + ih} stroke={CHART.axis} />
              <circle cx={x(hover)} cy={y(data[hover].value)} r={5} fill={color} stroke="#fff" strokeWidth={2} />
            </g>
          )}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={iw}
            height={ih}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
      )}
      {hover !== null && (
        <Tooltip x={x(hover)} width={w} title={shortDate(data[hover].date)} rows={[[color, label, format(data[hover].value)]]} />
      )}
    </div>
  );
}

/** Vertical columns with a per-column tooltip. One series. */
export function ColumnChart({
  data,
  color = CHART.violet,
  label,
  format = compact,
  height = 240,
}: {
  data: Point[];
  color?: string;
  label: string;
  format?: (n: number) => string;
  height?: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  if (!data.length) return <EmptyChart height={height} />;

  const w = Math.max(width, 200);
  const iw = w - PAD.left - PAD.right;
  const ih = height - PAD.top - PAD.bottom;
  const ticks = niceTicks(Math.max(...data.map((d) => d.value)));
  const top = ticks[ticks.length - 1] || 1;
  const band = iw / data.length;
  const bw = Math.max(2, Math.min(24, band - 2));
  const y = (v: number) => PAD.top + ih - (v / top) * ih;
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(iw / 64))));
  const r = Math.min(4, bw / 2);

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={w} height={height} role="img" aria-label={`${label} per day`} className="block">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={w - PAD.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? CHART.axis : CHART.grid} />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={10} fill={CHART.muted} className="tabular-nums">
                {format(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const cx = PAD.left + band * i + band / 2;
            const h = Math.max(0, PAD.top + ih - y(d.value));
            const x0 = cx - bw / 2;
            const y0 = PAD.top + ih - h;
            const rr = Math.min(r, h);
            // Rounded data-end, square at the baseline.
            const path =
              h > 0
                ? `M${x0},${PAD.top + ih}V${y0 + rr}Q${x0},${y0} ${x0 + rr},${y0}H${x0 + bw - rr}Q${x0 + bw},${y0} ${x0 + bw},${y0 + rr}V${PAD.top + ih}Z`
                : "";
            return (
              <g key={d.date}>
                {path && <path d={path} fill={color} opacity={hover === null || hover === i ? 1 : 0.45} />}
                {showTick(i, data.length, labelEvery) && (
                  <text x={cx} y={height - 8} textAnchor="middle" fontSize={10} fill={CHART.muted}>
                    {shortDate(d.date)}
                  </text>
                )}
                <rect
                  x={PAD.left + band * i}
                  y={PAD.top}
                  width={band}
                  height={ih}
                  fill="transparent"
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                />
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && (
        <Tooltip
          x={PAD.left + band * hover + band / 2}
          width={w}
          title={shortDate(data[hover].date)}
          rows={[[color, label, format(data[hover].value)]]}
        />
      )}
    </div>
  );
}

export type Part = { label: string; value: number; color: string; display?: string };

/** Donut for a few parts of one whole, with centre total and a legend. */
export function DonutChart({
  parts,
  centerLabel,
  centerValue,
  size = 168,
}: {
  parts: Part[];
  centerLabel: string;
  centerValue: string;
  size?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const total = parts.reduce((s, p) => s + p.value, 0);
  const stroke = 22;
  const rad = (size - stroke) / 2;
  const circ = 2 * Math.PI * rad;
  const gap = parts.filter((p) => p.value > 0).length > 1 ? 3 : 0;
  let acc = 0;
  const h = hover !== null ? parts[hover] : null;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={centerLabel} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
          {total > 0 &&
            parts.map((p, i) => {
              const len = (p.value / total) * circ;
              const dash = Math.max(0, len - gap);
              const el = (
                <circle
                  key={p.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={rad}
                  fill="none"
                  stroke={p.color}
                  strokeWidth={hover === i ? stroke + 4 : stroke}
                  strokeDasharray={`${dash} ${circ - dash}`}
                  strokeDashoffset={-acc}
                  className="cursor-pointer transition-all duration-200"
                  opacity={hover === null || hover === i ? 1 : 0.5}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                />
              );
              acc += len;
              return p.value > 0 ? el : null;
            })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{h ? h.label : centerLabel}</div>
          <div className="mt-0.5 text-xl font-black text-slate-900">{h ? h.display ?? compact(h.value) : centerValue}</div>
          {h && total > 0 && <div className="text-[11px] font-semibold text-slate-500">{Math.round((h.value / total) * 100)}%</div>}
        </div>
      </div>
      <ul className="w-full space-y-2.5 text-sm">
        {parts.map((p, i) => (
          <li
            key={p.label}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${hover === i ? "bg-slate-50" : ""}`}
          >
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: p.color }} />
            <span className="min-w-0 flex-1 truncate text-slate-600">{p.label}</span>
            <span className="whitespace-nowrap font-bold text-slate-900">{p.display ?? compact(p.value)}</span>
            <span className="w-9 shrink-0 text-right text-xs text-slate-400">{total ? Math.round((p.value / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type BarRow = { label: string; value: number; display: string; sub?: string; color: string; href?: string };

/** Horizontal bars with the value at the tip. */
export function BarList({ rows, empty = "No data in this period." }: { rows: BarRow[]; empty?: string }) {
  if (!rows.length) return <p className="py-8 text-center text-sm text-slate-500">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-3">
      {rows.map((r) => {
        const inner = (
          <>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="line-clamp-1 font-medium text-slate-700 group-hover:text-slate-900">{r.label}</span>
              <span className="shrink-0 font-bold tabular-nums text-slate-900">
                {r.display}
                {r.sub && <span className="ml-1.5 text-xs font-medium text-slate-400">{r.sub}</span>}
              </span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-700 group-hover:brightness-110"
                style={{ width: `${Math.max(2, (r.value / max) * 100)}%`, background: r.color }}
              />
            </div>
          </>
        );
        return (
          <li key={r.label}>
            {r.href ? (
              <Link href={r.href} className="group block">
                {inner}
              </Link>
            ) : (
              <div className="group">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function EmptyChart({ height }: { height: number }) {
  return (
    <div className="flex items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500" style={{ height }}>
      No orders in this period.
    </div>
  );
}

/** Coloured card wrapper used by dashboard panels. */
export function ChartCard({
  title,
  subtitle,
  accent = "from-teal-500 to-cyan-500",
  action,
  children,
  flush,
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  /** Content runs edge to edge (tables); only the header is padded. */
  flush?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/70 ${flush ? "" : "p-5 sm:p-6"}`}>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className={`mb-4 flex items-start justify-between gap-3 ${flush ? "px-5 pt-5 sm:px-6 sm:pt-6" : ""}`}>
        <div>
          <h2 className="text-base font-black text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
