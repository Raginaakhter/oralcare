/**
 * Types that mirror the OralCare backend responses (`/api/v1`).
 * Field names match the server exactly so data can be passed through untouched.
 */

export type ID = string;
export type ISODate = string;

// ─── Envelope ──────────────────────────────────────────────

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  details?: unknown;
  /** Present on POST /orders and /orders/buy-now. */
  duplicate?: boolean;
  /** Dev-only on register / resend-verification. */
  _devVerificationToken?: string;
  /** Dev-only on forgot-password when no mail provider is configured. */
  _devOtp?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ValidationDetail {
  field: string;
  message: string;
}

// ─── Auth ──────────────────────────────────────────────────

/** Role key: built-in "admin" | "manager" | "sales" | "user" (customer), or a custom role. */
export type UserRole = "user" | "manager" | "admin" | "sales" | (string & {});

/** Every permission the backend understands (GET /admin/permissions). */
export type Permission =
  | "dashboard:access"
  | "catalog:manage"
  | "orders:read"
  | "orders:manage"
  | "returns:manage"
  | "payments:read"
  | "refunds:manage"
  | "customers:read"
  | "coupons:manage"
  | "content:manage"
  | "reviews:manage"
  | "staff:manage";

export interface AuthUser {
  id: ID;
  fullName: string;
  email: string;
  role: UserRole;
  /** Effective permissions of the user's current role. */
  permissions: Permission[];
  isEmailVerified: boolean;
}

export interface MeUser {
  _id: ID;
  fullName: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  isEmailVerified: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── Staff & roles (admin) ─────────────────────────────────

export interface PermissionDef {
  key: Permission;
  group: string;
  label: string;
  /** False for admin-only permissions (staff:manage). */
  assignable: boolean;
}

export interface Role {
  key: string;
  name: string;
  description?: string;
  permissions: Permission[];
  /** Locked: the admin and customer roles can't be edited or deleted. */
  isSystem: boolean;
  /** admin / manager / sales / user — can't be deleted. */
  isBuiltIn: boolean;
  userCount: number;
}

export interface RoleInput {
  key?: string;
  name?: string;
  description?: string;
  permissions?: Permission[];
}

/** An account as returned by /admin/users and /admin/customers. */
export interface Account {
  _id: ID;
  id: ID;
  fullName: string;
  email: string;
  role: UserRole;
  roleName: string;
  isEmailVerified: boolean;
  /** Present on single-account responses. */
  permissions?: Permission[];
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
  accessTokenExpiresIn: string;
}

export interface RefreshResult {
  accessToken: string;
  accessTokenExpiresIn: string;
}

export interface RegisterResult {
  userId: ID;
  email: string;
}

// ─── Catalog ───────────────────────────────────────────────

export interface Category {
  _id: ID;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory: ID | null | { _id: ID; name: string; slug: string };
  isActive: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface Brand {
  _id: ID;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface RefLite {
  _id: ID;
  name: string;
  slug: string;
}

export interface ProductImage {
  _id?: ID;
  url: string;
  alt?: string;
  order?: number;
}

export interface ProductVariation {
  _id: ID;
  sku?: string;
  attributes: Record<string, string>;
  price?: number;
  stockQuantity?: number;
  image?: string;
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface Product {
  _id: ID;
  id: ID;
  productName: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  regularPrice: number;
  salePrice?: number | null;
  costPrice?: number;
  effectivePrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
  /** Populated on list/get, a bare id on create/update responses. */
  category: RefLite | ID;
  subCategory?: RefLite | ID | null;
  brand?: RefLite | ID | null;
  images: ProductImage[];
  thumbnail?: string;
  productType: "simple" | "variable";
  variations: ProductVariation[];
  weight?: number;
  dimensions?: { length?: number; width?: number; height?: number; unit?: string };
  tags: string[];
  features: string[];
  specifications: Record<string, string>;
  isFeatured: boolean;
  isActive: boolean;
  isPublished: boolean;
  isDeleted: boolean;
  deletedAt: ISODate | null;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  /** From approved reviews (0 when there are none). */
  averageRating?: number;
  reviewCount?: number;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface ProductListQuery {
  search?: string;
  category?: ID;
  subCategory?: ID;
  brand?: ID;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: StockStatus;
  isFeatured?: boolean;
  tag?: string;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc" | "popularity";
  page?: number;
  limit?: number;
  /** Admin only. */
  isActive?: boolean;
  isPublished?: boolean;
  includeDeleted?: boolean;
}

export interface ProductInput {
  productName: string;
  slug?: string;
  sku: string;
  description: string;
  shortDescription?: string;
  regularPrice: number;
  salePrice?: number | null;
  costPrice?: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
  category: ID;
  subCategory?: ID | null;
  brand?: ID | null;
  images?: { url: string; alt?: string; order?: number }[];
  thumbnail?: string;
  productType?: "simple" | "variable";
  variations?: {
    sku?: string;
    attributes: Record<string, string>;
    price?: number;
    stockQuantity?: number;
    image?: string;
  }[];
  weight?: number;
  tags?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  isFeatured?: boolean;
  isActive?: boolean;
  isPublished?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export type StockChangeType =
  | "restock"
  | "sale"
  | "return"
  | "adjustment"
  | "damage"
  | "audit";

export interface StockHistoryEntry {
  _id: ID;
  productId: ID;
  variationId: ID | null;
  orderId: ID | null;
  previousQuantity: number;
  change: number;
  newQuantity: number;
  type: StockChangeType;
  reason?: string;
  adjustedBy: ID | { _id: ID; fullName: string; email: string };
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface StockAlertProduct {
  _id: ID;
  id: ID;
  productName: string;
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
}

// ─── Uploads ───────────────────────────────────────────────

export interface UploadResult {
  id: ID;
  filename?: string;
  url: string;
  mimeType?: string;
  size?: number;
  category?: string;
}

// ─── Banners ───────────────────────────────────────────────

export type BannerPlacement = "hero" | "promo";

export interface Banner {
  _id: ID;
  /** "hero" = home slider (default), "promo" = cards under it. */
  placement?: BannerPlacement;
  /** Corner badge on promo cards, e.g. "UP TO 30% OFF". */
  badgeText?: string;
  /** Storefront colour theme, e.g. "emerald" | "blue". */
  accent?: string;
  title: string;
  subtitle?: string;
  description?: string;
  desktopImage?: string;
  mobileImage?: string;
  backgroundImage?: string;
  imageAlt?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  textAlignment: "left" | "center" | "right";
  textColor?: string;
  overlayColor?: string;
  overlayOpacity: number;
  bannerHeight?: string;
  displayOrder: number;
  startDate: ISODate | null;
  endDate: ISODate | null;
  isActive: boolean;
  isPublished: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type BannerInput = Partial<
  Omit<Banner, "_id" | "createdAt" | "updatedAt">
> & { title?: string };

export interface ReorderItem {
  id: ID;
  displayOrder: number;
}

// ─── Footer ────────────────────────────────────────────────

export interface FooterSettings {
  _id?: ID;
  logo?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  businessAddress?: string;
  googleMapsUrl?: string;
  copyrightText?: string;
  newsletterEnabled?: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterButtonText?: string;
  isActive?: boolean;
  createdAt?: ISODate;
  updatedAt?: ISODate;
}

export interface FooterLink {
  _id?: ID;
  title: string;
  url: string;
  target: "_self" | "_blank";
  displayOrder: number;
  isActive: boolean;
}

export interface FooterSection {
  _id: ID;
  title: string;
  links: FooterLink[];
  displayOrder: number;
  isActive: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "linkedin"
  | "whatsapp"
  | "pinterest";

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "facebook",
  "instagram",
  "youtube",
  "tiktok",
  "linkedin",
  "whatsapp",
  "pinterest",
];

export interface SocialLink {
  _id: ID;
  platform: SocialPlatform;
  url: string;
  customIcon?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface PaymentLogo {
  _id: ID;
  name: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface PublicFooter {
  settings: FooterSettings | null;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  paymentLogos: PaymentLogo[];
}

// ─── Coupons ───────────────────────────────────────────────

export interface Coupon {
  _id: ID;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number;
  startsAt: ISODate | null;
  expiresAt: ISODate | null;
  usageLimit: number | null;
  usageLimitPerUser: number | null;
  usedCount: number;
  applicableProducts: ID[];
  applicableCategories: ID[];
  isActive: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CouponInput {
  code?: string;
  description?: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  maxDiscountAmount?: number | null;
  minOrderAmount?: number;
  startsAt?: string | null;
  expiresAt?: string | null;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  applicableProducts?: ID[];
  applicableCategories?: ID[];
  isActive?: boolean;
}

export interface CouponValidation {
  code: string;
  discountAmount: number;
  subtotal: number;
  totalAfterDiscount: number;
}

// ─── Cart / checkout ───────────────────────────────────────

export interface LineItemInput {
  productId: ID;
  variationId?: ID | null;
  quantity: number;
}

export interface PricedLine {
  productId: ID;
  variationId: ID | null;
  productName: string;
  sku: string;
  slug: string;
  thumbnail?: string;
  variationAttributes?: Record<string, string>;
  unitPrice: number;
  regularPrice: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
  categoryIds: ID[];
}

export interface CartItem {
  itemId: ID;
  productId: ID;
  variationId: ID | null;
  quantity: number;
  /** Live price/stock; missing when the product can't be priced any more. */
  line?: PricedLine;
  /** Set when the line can no longer be bought as-is (out of stock, unpublished…). */
  issue?: LineIssue;
}

export interface AppliedCoupon {
  couponId: ID;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
}

export interface ShippingQuote {
  method: string;
  name: string;
  charge: number;
  baseCharge: number;
  freeShippingApplied: boolean;
  estimatedDays: { min: number; max: number };
}

export interface CartSummary {
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  discount: number;
  coupon: AppliedCoupon | null;
  shipping: ShippingQuote | null;
  grandTotal: number;
  currency: string;
}

export interface Cart {
  id: ID;
  items: CartItem[];
  summary: CartSummary;
}

export interface ShippingMethod {
  code: ShippingMethodCode;
  name: string;
  description: string;
  charge: number;
  estimatedDays: { min: number; max: number };
  codAvailable: boolean;
}

export type ShippingMethodCode = "inside_dhaka" | "outside_dhaka" | "express_dhaka";

export interface ShippingMethodsResult {
  methods: ShippingMethod[];
  freeShippingThreshold: number | null;
  currency: string;
}

export interface ShippingCalculation {
  shipping: ShippingQuote;
  subtotal: number;
  discount: number;
  grandTotal: number;
  currency: string;
  issues: LineIssue[];
}

export interface LineIssue {
  productId: ID;
  variationId: ID | null;
  code: string;
  message: string;
  availableStock?: number;
  requested?: number;
}

export interface CheckoutPreview {
  lines: PricedLine[];
  issues: LineIssue[];
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  discount: number;
  coupon: AppliedCoupon | null;
  shipping: ShippingQuote | null;
  grandTotal: number;
  currency: string;
  canPlaceOrder: boolean;
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
}

export interface CheckoutInput {
  source?: "cart" | "buy_now";
  items?: LineItemInput[];
  couponCode?: string;
  shippingMethod?: ShippingMethodCode;
}

// ─── Orders ────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded"
  | "failed";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
  "failed",
];

/** Mirrors backend ORDER_STATUS_TRANSITIONS so the UI only offers legal moves. */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled", "failed"],
  confirmed: ["processing", "cancelled"],
  processing: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["out_for_delivery", "delivered", "returned"],
  out_for_delivery: ["delivered", "returned"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
  refunded: [],
  failed: [],
};

export const CUSTOMER_CANCELLABLE: OrderStatus[] = ["pending", "confirmed"];
export const CANCEL_REQUESTABLE: OrderStatus[] = ["processing", "packed"];

export type PaymentMethod = "cod" | "online";
export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "failed"
  | "partially_refunded"
  | "refunded";

export interface Address {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  area?: string;
  city: string;
  district?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderItem {
  _id: ID;
  product: ID;
  variationId: ID | null;
  productName: string;
  sku: string;
  slug: string;
  thumbnail?: string;
  variationAttributes?: Record<string, string>;
  unitPrice: number;
  regularPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderNote {
  _id: ID;
  note: string;
  visibility: "internal" | "customer";
  author: ID;
  authorRole: UserRole;
  createdAt: ISODate;
}

export interface Order {
  _id: ID;
  orderNumber: string;
  customer: ID | { _id: ID; fullName: string; email: string };
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  currency: string;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  grandTotal: number;
  coupon: AppliedCoupon | null;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: {
    code: ShippingMethodCode;
    name: string;
    charge: number;
    estimatedDays: { min: number; max: number };
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  customerNote?: string;
  cancellation: {
    reason: string;
    cancelledBy: ID;
    cancelledByRole: UserRole;
    cancelledAt: ISODate;
  } | null;
  cancellationRequest: {
    status: "pending" | "approved" | "rejected";
    reason: string;
    requestedAt: ISODate;
    reviewedAt?: ISODate;
    note?: string;
  } | null;
  source: "cart" | "buy_now";
  notes: OrderNote[];
  trackingNumber?: string | null;
  placedAt: ISODate;
  confirmedAt?: ISODate;
  deliveredAt?: ISODate;
  cancelledAt?: ISODate;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface PlaceOrderInput {
  shippingAddress: Address;
  billingAddress?: Address;
  shippingMethod: ShippingMethodCode;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  customerNote?: string;
}

export type BuyNowInput = PlaceOrderInput & LineItemInput;

export interface OrderSummaryStats {
  totalOrders: number;
  totalSpent: number;
  currency: string;
  byStatus: Record<OrderStatus, number>;
}

export interface OrderSummary {
  id: ID;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  itemCount: number;
  totalQuantity: number;
  currency: string;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shippingCharge: number;
  grandTotal: number;
  shippingMethod: string;
  trackingNumber: string | null;
  placedAt: ISODate;
  deliveredAt: ISODate | null;
}

export interface Invoice {
  invoiceNumber: string;
  orderNumber: string;
  issuedAt: ISODate;
  status: OrderStatus;
  seller: { name: string; email?: string; phone?: string; address?: string };
  customer: { name: string; email: string };
  billingAddress: Address;
  shippingAddress: Address;
  items: { productName: string; sku: string; unitPrice: number; quantity: number; lineTotal: number }[];
  currency: string;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shippingMethod: string;
  shippingCharge: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  payments: {
    _id: ID;
    method: PaymentMethod;
    provider: string;
    amount: number;
    status: string;
    transactionId: string;
    refundedAmount: number;
  }[];
}

export interface TimelineEntry {
  status: OrderStatus;
  fromStatus: OrderStatus | null;
  note?: string;
  at: ISODate;
}

export interface ShipmentEvent {
  _id?: ID;
  status: ShipmentStatus;
  description?: string;
  location?: string;
  source?: string;
  createdBy?: unknown;
  at?: ISODate;
  createdAt?: ISODate;
}

export type ShipmentStatus =
  | "pending"
  | "booked"
  | "picked_up"
  | "in_transit"
  | "at_hub"
  | "out_for_delivery"
  | "delivered"
  | "partial_delivered"
  | "failed_attempt"
  | "on_hold"
  | "returned_to_sender"
  | "cancelled";

export const SHIPMENT_STATUSES: ShipmentStatus[] = [
  "pending",
  "booked",
  "picked_up",
  "in_transit",
  "at_hub",
  "out_for_delivery",
  "delivered",
  "partial_delivered",
  "failed_attempt",
  "on_hold",
  "returned_to_sender",
  "cancelled",
];

export type CourierProvider =
  | "steadfast"
  | "pathao"
  | "redx"
  | "paperfly"
  | "sundarban"
  | "in_house"
  | "other";

export const COURIER_PROVIDERS: CourierProvider[] = [
  "steadfast",
  "pathao",
  "redx",
  "paperfly",
  "sundarban",
  "in_house",
  "other",
];

export interface Shipment {
  _id: ID;
  order: ID;
  provider: CourierProvider;
  courierName?: string;
  consignmentId?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  codAmount?: number;
  status: ShipmentStatus;
  events: ShipmentEvent[];
  assignedAt?: ISODate;
  assignedBy?: ID;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface TrackResult {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  placedAt: ISODate;
  deliveredAt: ISODate | null;
  estimatedDelivery: ISODate | null;
  timeline: TimelineEntry[];
  shipment: {
    provider: CourierProvider;
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    status: ShipmentStatus;
    events: { status: ShipmentStatus; description?: string; location?: string; at: ISODate }[];
  } | null;
}

export interface ReorderResult {
  cart: Cart;
  added: LineItemInput[];
  skipped: { productId: ID; variationId: ID | null; reason?: string }[];
}

// ─── Payments ──────────────────────────────────────────────

export interface PaymentInit {
  paymentId: ID;
  transactionId: string;
  amount: number;
  currency: string;
  provider: string;
  redirectUrl: string;
}

export interface MockGatewayPayload {
  transactionId: string;
  status: string;
  amount: string;
  gatewayTransactionId: string;
  signature: string;
}

export interface MockCheckout {
  transactionId: string;
  amount: number;
  success: { url: string; body: MockGatewayPayload };
  failure: { url: string; body: MockGatewayPayload };
}

export interface PaymentOutcome {
  outcome: "paid" | "failed" | "cancelled" | "already_processed" | string;
  status: PaymentStatus | string;
  transactionId: string;
}

export interface PaymentRecord {
  _id: ID;
  order: ID;
  customer: ID;
  method: PaymentMethod;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  transactionId: string;
  refundedAmount: number;
  gatewaySessionId?: string;
  gatewayTransactionId?: string;
  redirectUrl?: string;
  paidAt?: ISODate;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface PaymentDetails {
  orderId: ID;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amountDue: number;
  amountPaid: number;
  amountRefunded: number;
  currency: string;
  payments: PaymentRecord[];
  refunds: Refund[];
}

export interface PaymentStatusResult {
  orderId: ID;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  latestAttempt: {
    transactionId: string;
    status: string;
    amount: number;
    updatedAt: ISODate;
  } | null;
}

export interface PaymentTransaction {
  _id: ID;
  payment: ID;
  order: ID;
  type: string;
  status: string;
  amount: number;
  provider: string;
  reference: string;
  performedBy?: ID;
  createdAt: ISODate;
}

// ─── Returns & refunds ─────────────────────────────────────

export type ReturnReason =
  | "damaged"
  | "defective"
  | "wrong_item"
  | "not_as_described"
  | "expired"
  | "changed_mind"
  | "other";

export const RETURN_REASONS: { value: ReturnReason; label: string }[] = [
  { value: "damaged", label: "Arrived damaged" },
  { value: "defective", label: "Defective / not working" },
  { value: "wrong_item", label: "Wrong item sent" },
  { value: "not_as_described", label: "Not as described" },
  { value: "expired", label: "Expired product" },
  { value: "changed_mind", label: "Changed my mind" },
  { value: "other", label: "Other" },
];

export type ReturnStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "received"
  | "completed"
  | "cancelled";

export const RETURN_STATUS_TRANSITIONS: Record<ReturnStatus, ReturnStatus[]> = {
  requested: ["approved", "rejected"],
  approved: ["received", "rejected"],
  received: ["completed"],
  rejected: [],
  completed: [],
  cancelled: [],
};

export type RefundMethod =
  | "original_payment"
  | "bkash"
  | "nagad"
  | "rocket"
  | "bank_transfer"
  | "cash"
  | "store_credit";

export const REFUND_METHODS: { value: RefundMethod; label: string }[] = [
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "rocket", label: "Rocket" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "original_payment", label: "Original payment method" },
  { value: "cash", label: "Cash" },
  { value: "store_credit", label: "Store credit" },
];

export interface ReturnItem {
  orderItemId: ID;
  product: ID;
  variationId: ID | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  refundAmount: number;
}

export interface ReturnHistoryEntry {
  status: ReturnStatus;
  note?: string;
  by: ID | { _id: ID; fullName: string };
  role: UserRole;
  at: ISODate;
}

export interface OrderReturn {
  _id: ID;
  returnNumber: string;
  order: ID | { _id: ID; orderNumber: string };
  orderNumber: string;
  customer: ID | { _id: ID; fullName: string; email: string };
  items: ReturnItem[];
  reason: ReturnReason;
  description?: string;
  images: string[];
  status: ReturnStatus;
  refundAmount: number;
  refundRequested: boolean;
  refundPreference: { method: RefundMethod; accountDetails?: string; note?: string } | null;
  restocked: boolean;
  adminNote?: string;
  history: ReturnHistoryEntry[];
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateReturnInput {
  items: { orderItemId: ID; quantity: number }[];
  reason: ReturnReason;
  description?: string;
  images?: string[];
}

export type RefundStatus = "pending" | "processing" | "completed" | "failed" | "rejected";

export const REFUND_STATUS_TRANSITIONS: Record<RefundStatus, RefundStatus[]> = {
  pending: ["processing", "completed", "failed", "rejected"],
  processing: ["completed", "failed"],
  failed: ["processing", "rejected"],
  completed: [],
  rejected: [],
};

export interface Refund {
  _id: ID;
  refundNumber: string;
  order: ID | { _id: ID; orderNumber: string; grandTotal: number; paymentStatus: PaymentStatus; status: OrderStatus };
  payment: ID | null;
  orderReturn: ID | null | { _id: ID; returnNumber: string; status: ReturnStatus; refundAmount: number };
  customer: ID | { _id: ID; fullName: string; email: string };
  amount: number;
  method: RefundMethod;
  status: RefundStatus;
  reason: string;
  transactionRef?: string;
  processedBy: ID | null;
  history: { status: RefundStatus; note?: string; by: unknown; role: UserRole; at: ISODate }[];
  completedAt?: ISODate;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateRefundInput {
  orderId: ID;
  returnId?: ID;
  amount?: number;
  method: RefundMethod;
  reason: string;
  transactionRef?: string;
  markCompleted?: boolean;
}

// ─── Notifications ─────────────────────────────────────────

export interface Notification {
  _id: ID;
  user: ID;
  type: string;
  title: string;
  message: string;
  order?: ID;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt: ISODate | null;
  createdAt: ISODate;
}

export interface NotificationPage extends Paginated<Notification> {
  unreadCount: number;
}

// ─── Admin orders ──────────────────────────────────────────

export interface AdminOrderListQuery {
  search?: string;
  orderNumber?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  /** Comma-separated list is accepted. */
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  product?: ID;
  customer?: ID;
  from?: string;
  to?: string;
  hasCancellationRequest?: boolean;
  sort?: "newest" | "oldest" | "total-desc" | "total-asc" | "status";
  page?: number;
  limit?: number;
}

export interface StatusHistoryEntry {
  _id: ID;
  order: ID;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note?: string;
  customerNote?: string;
  changedBy: ID | { _id: ID; fullName: string; email?: string } | null;
  changedByRole: UserRole | "system";
  createdAt: ISODate;
}

export interface AdminOrderDetail {
  order: Order;
  statusHistory: StatusHistoryEntry[];
  payments: PaymentRecord[];
  shipment: Shipment | null;
  returns: OrderReturn[];
  refunds: Refund[];
}

export interface OrderAnalytics {
  range: { from: ISODate; to: ISODate };
  currency: string;
  totals: {
    orders: number;
    grossRevenue: number;
    paidRevenue: number;
    averageOrderValue: number;
    discounts: number;
    shippingCollected: number;
  };
  byStatus: Record<OrderStatus, number>;
  byPaymentStatus: Partial<Record<PaymentStatus, number>>;
  byPaymentMethod: { method: PaymentMethod; orders: number; total: number }[];
  daily: { date: string; orders: number; revenue: number }[];
  topProducts: { productId: ID; productName: string; quantity: number; revenue: number }[];
  pendingCancellationRequests: number;
}

export interface CourierInput {
  provider: CourierProvider;
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  consignmentId?: string;
  createConsignment?: boolean;
  note?: string;
}

export interface ShipmentResult {
  order: Order;
  shipment: Shipment;
  orderStatusChanged?: OrderStatus;
}

// ─── System ────────────────────────────────────────────────

export interface HealthResult {
  status: string;
  timestamp: ISODate;
  database: { status: string; readyState: number };
}

// ─── Storefront content ────────────────────────────────────

export type Accent = "emerald" | "blue";

/** Compact live product used inside deals, looks and blog posts. */
export interface ProductCardData {
  _id: ID;
  productName: string;
  slug: string;
  thumbnail: string | null;
  regularPrice: number;
  salePrice: number | null;
  /** What the customer pays now. */
  price: number;
  discountPercent: number;
  inStock: boolean;
  stockQuantity: number;
  averageRating: number;
  reviewCount: number;
}

interface ContentAudit {
  displayOrder: number;
  isActive: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

/** GET /deals/active */
export interface ActiveDeal {
  _id: ID;
  title: string;
  description?: string;
  badgeText?: string;
  image: string | null;
  startsAt: ISODate;
  endsAt: ISODate;
  secondsRemaining: number;
  product: ProductCardData;
}

/** /admin/deals */
export interface Deal extends ContentAudit {
  _id: ID;
  product: ID | { _id: ID; productName: string; slug: string; regularPrice: number; salePrice?: number; stockQuantity: number };
  title: string;
  description?: string;
  badgeText?: string;
  image?: string;
  startsAt: ISODate;
  endsAt: ISODate;
}
export interface DealInput {
  product?: ID;
  title?: string;
  description?: string;
  badgeText?: string;
  image?: string;
  startsAt?: ISODate;
  endsAt?: ISODate;
  displayOrder?: number;
  isActive?: boolean;
}

export type LookLayout = "feature" | "tile";

/** GET /looks */
export interface PublicLook {
  _id: ID;
  title: string;
  tag?: string;
  description?: string;
  image: string | null;
  link: string;
  accent?: string;
  layout: LookLayout;
  /** Cheapest live product price in the look. */
  fromPrice: number | null;
  products: ProductCardData[];
}

/** /admin/looks */
export interface Look extends ContentAudit {
  _id: ID;
  title: string;
  tag?: string;
  description?: string;
  image?: string;
  products: (ID | { _id: ID; productName: string; slug: string })[];
  link?: string;
  accent?: string;
  layout: LookLayout;
}
export interface LookInput {
  title?: string;
  tag?: string;
  description?: string;
  image?: string;
  products?: ID[];
  link?: string;
  accent?: string;
  layout?: LookLayout;
  displayOrder?: number;
  isActive?: boolean;
}

export interface BlogSection {
  heading: string;
  content: string;
  tip?: string;
}

/** Item of GET /blog (no article body). */
export interface BlogPostSummary {
  _id: ID;
  slug: string;
  title: string;
  tag?: string;
  excerpt: string;
  author: string;
  authorRole?: string;
  coverImage?: string;
  accent?: string;
  isFeatured: boolean;
  readMinutes: number;
  isPublished: boolean;
  publishedAt: ISODate | null;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

/** GET /blog/:slug */
export interface BlogPost extends BlogPostSummary {
  sections: BlogSection[];
  recommendedProducts: ProductCardData[];
}

/** /admin/blog */
export interface AdminBlogPost extends BlogPostSummary {
  sections: BlogSection[];
  recommendedProducts: ID[];
}
export interface BlogPostInput {
  title?: string;
  slug?: string;
  tag?: string;
  excerpt?: string;
  author?: string;
  authorRole?: string;
  coverImage?: string;
  accent?: string;
  isFeatured?: boolean;
  sections?: BlogSection[];
  recommendedProducts?: ID[];
  isPublished?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export type TestimonialType = "expert" | "customer";
export interface Testimonial extends ContentAudit {
  _id: ID;
  type: TestimonialType;
  name: string;
  role?: string;
  quote: string;
  image?: string;
  rating: number;
  isVerified: boolean;
}
export type TestimonialInput = Partial<Omit<Testimonial, "_id" | "createdAt" | "updatedAt">>;

export interface InstagramPost extends ContentAudit {
  _id: ID;
  image: string;
  link?: string;
  caption?: string;
}
export type InstagramPostInput = Partial<Omit<InstagramPost, "_id" | "createdAt" | "updatedAt">>;

export interface ContentReorderItem {
  id: ID;
  displayOrder: number;
}

// ─── Reviews ───────────────────────────────────────────────

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  _id: ID;
  product: ID | { _id: ID; productName: string; slug: string; thumbnail?: string };
  /** Only present for admin/manager listings. */
  user?: ID | { _id: ID; fullName: string; email: string };
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  status: ReviewStatus;
  isFeatured: boolean;
  adminReply?: string;
  adminRepliedAt?: ISODate | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  /** Count per star, keys "1".."5". */
  distribution: Record<string, number>;
}

export interface ProductReviewsPage extends Paginated<Review> {
  summary: RatingSummary;
}

export interface ReviewInput {
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
}
export interface ModerateReviewInput {
  status?: ReviewStatus;
  isFeatured?: boolean;
  adminReply?: string | null;
}

// ─── Newsletter ────────────────────────────────────────────

export type SubscriberStatus = "subscribed" | "unsubscribed";
export interface Subscriber {
  _id: ID;
  email: string;
  name?: string;
  status: SubscriberStatus;
  source?: string;
  subscribedAt: ISODate;
  unsubscribedAt: ISODate | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}
export interface SubscriberPage extends Paginated<Subscriber> {
  counts: Record<SubscriberStatus, number>;
}
