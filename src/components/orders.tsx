import Link from "next/link";
import { SmartImage } from "@/components/SmartImage";
import { formatPriceBDT, humanize } from "@/lib/format";
import type {
  Address,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  RefundStatus,
  ReturnStatus,
} from "@/lib/api/types";

type Tone = "green" | "blue" | "amber" | "red" | "slate" | "violet";

const toneCls: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
};

export const ORDER_STATUS_TONE: Record<OrderStatus, Tone> = {
  pending: "amber",
  confirmed: "blue",
  processing: "blue",
  packed: "violet",
  shipped: "violet",
  out_for_delivery: "violet",
  delivered: "green",
  cancelled: "red",
  returned: "slate",
  refunded: "slate",
  failed: "red",
};

export const PAYMENT_STATUS_TONE: Record<PaymentStatus, Tone> = {
  unpaid: "amber",
  pending: "amber",
  paid: "green",
  failed: "red",
  partially_refunded: "violet",
  refunded: "slate",
};

export const RETURN_STATUS_TONE: Record<ReturnStatus, Tone> = {
  requested: "amber",
  approved: "blue",
  rejected: "red",
  received: "violet",
  completed: "green",
  cancelled: "slate",
};

export const REFUND_STATUS_TONE: Record<RefundStatus, Tone> = {
  pending: "amber",
  processing: "blue",
  completed: "green",
  failed: "red",
  rejected: "red",
};

export function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${toneCls[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Pill tone={ORDER_STATUS_TONE[status] ?? "slate"}>{humanize(status)}</Pill>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Pill tone={PAYMENT_STATUS_TONE[status] ?? "slate"}>{humanize(status)}</Pill>;
}

export function formatAddress(a?: Address | null): string {
  if (!a) return "—";
  return [a.addressLine1, a.addressLine2, a.area, a.city, a.district, a.postalCode, a.country]
    .filter(Boolean)
    .join(", ");
}

export function AddressBlock({ title, address }: { title: string; address?: Address | null }) {
  return (
    <div>
      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">{title}</div>
      {address ? (
        <div className="mt-1 text-sm text-slate-700">
          <div className="font-bold text-slate-900">{address.fullName}</div>
          <div>{address.phone}</div>
          {address.email && <div>{address.email}</div>}
          <div className="mt-1 text-slate-600">{formatAddress(address)}</div>
        </div>
      ) : (
        <div className="mt-1 text-sm text-slate-500">—</div>
      )}
    </div>
  );
}

export function OrderItemsList({ items, linkToProduct = true }: { items: OrderItem[]; linkToProduct?: boolean }) {
  return (
    <div className="divide-y divide-slate-100">
      {items.map((it) => {
        const img = (
          <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-soft">
            <SmartImage src={it.thumbnail} alt="" fill sizes="56px" className="object-contain p-1.5" />
          </span>
        );
        return (
          <div key={it._id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
            {linkToProduct && it.slug ? <Link href={`/product/${it.slug}`}>{img}</Link> : img}
            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-sm font-bold text-slate-900">{it.productName}</div>
              <div className="text-[11px] text-slate-500">
                {it.variationAttributes ? `${Object.values(it.variationAttributes).join(" / ")} · ` : ""}
                SKU {it.sku} · {it.quantity} × {formatPriceBDT(it.unitPrice)}
              </div>
            </div>
            <div className="text-sm font-black text-slate-900">{formatPriceBDT(it.lineTotal)}</div>
          </div>
        );
      })}
    </div>
  );
}

export function OrderTotals({ order }: { order: Order }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-slate-500">Subtotal</dt>
        <dd className="font-semibold text-slate-900">{formatPriceBDT(order.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-500">Shipping ({order.shippingMethod?.name})</dt>
        <dd className="font-semibold text-slate-900">
          {order.shippingCharge === 0 ? "FREE" : formatPriceBDT(order.shippingCharge)}
        </dd>
      </div>
      {order.discount > 0 && (
        <div className="flex justify-between">
          <dt className="text-slate-500">Discount {order.coupon ? `(${order.coupon.code})` : ""}</dt>
          <dd className="font-semibold text-emerald-600">- {formatPriceBDT(order.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between border-t border-slate-100 pt-2 text-base">
        <dt className="font-black text-slate-900">Total</dt>
        <dd className="font-black text-brand-dark">{formatPriceBDT(order.grandTotal)}</dd>
      </div>
    </dl>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm font-semibold text-slate-500">
      <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      {label}
    </div>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl bg-rose-50 p-5 text-sm text-rose-800 ring-1 ring-rose-200">
      <div className="font-bold">Something went wrong</div>
      <div className="mt-1">{message}</div>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
          Try again
        </button>
      )}
    </div>
  );
}
