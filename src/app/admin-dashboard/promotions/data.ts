export type PromoStatus = "active" | "scheduled" | "expired" | "paused";
export type PromoType = "Percentage" | "Fixed" | "Free Shipping";

export type Promotion = {
  code: string;
  name: string;
  discount: string;
  type: PromoType;
  usage: number;
  limit: number;
  status: PromoStatus;
  starts: string;
  ends: string;
  description?: string;
};

export const promotions: Promotion[] = [
  { code: "WHITEN25", name: "Whitening Kits 25% Off", discount: "25%", type: "Percentage", usage: 184, limit: 500, status: "active", starts: "Nov 1, 2026", ends: "Nov 30, 2026", description: "Site-wide 25% discount on all whitening category products." },
  { code: "NEWSMILE", name: "First Order Discount", discount: "৳200", type: "Fixed", usage: 92, limit: 1000, status: "active", starts: "Oct 1, 2026", ends: "Dec 31, 2026", description: "৳200 off the first order for new customers." },
  { code: "FREESHIP", name: "Free Shipping Nationwide", discount: "Free", type: "Free Shipping", usage: 482, limit: 0, status: "active", starts: "Jan 1, 2026", ends: "No expiry", description: "Free shipping on all orders, no minimum spend." },
  { code: "BLACKFRI", name: "Black Friday Mega Deal", discount: "40%", type: "Percentage", usage: 0, limit: 2000, status: "scheduled", starts: "Nov 28, 2026", ends: "Nov 30, 2026", description: "40% off store-wide for Black Friday weekend." },
  { code: "RAMADAN24", name: "Ramadan Special", discount: "15%", type: "Percentage", usage: 348, limit: 1000, status: "expired", starts: "Mar 10, 2026", ends: "Apr 10, 2026", description: "Ramadan 15% off site-wide discount." },
  { code: "WELCOME10", name: "Welcome Signup Bonus", discount: "10%", type: "Percentage", usage: 614, limit: 2000, status: "paused", starts: "Feb 1, 2026", ends: "No expiry", description: "10% off for newsletter signups." },
];

export const statusTone: Record<PromoStatus, "success" | "info" | "neutral" | "warning"> = {
  active: "success",
  scheduled: "info",
  expired: "neutral",
  paused: "warning",
};

export function getPromotionByCode(code: string) {
  return promotions.find((p) => p.code === code);
}
