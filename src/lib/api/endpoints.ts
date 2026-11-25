/**
 * One typed function per backend endpoint (see the OralCare API reference).
 * Paths are relative to `${API_URL}/api/v1`.
 */
import { api, request, requestText, type QueryValue } from "./client";
import { API_BASE, API_URL } from "./config";
import type {
  ActiveDeal,
  AdminBlogPost,
  AdminOrderDetail,
  AdminOrderListQuery,
  Banner,
  BannerInput,
  BannerPlacement,
  BlogPost,
  BlogPostInput,
  BlogPostSummary,
  ContentReorderItem,
  Deal,
  DealInput,
  InstagramPost,
  InstagramPostInput,
  Look,
  LookInput,
  LookLayout,
  ModerateReviewInput,
  ProductReviewsPage,
  PublicLook,
  RatingSummary,
  Review,
  ReviewInput,
  ReviewStatus,
  Subscriber,
  SubscriberPage,
  SubscriberStatus,
  Testimonial,
  TestimonialInput,
  TestimonialType,
  Brand,
  BuyNowInput,
  Cart,
  Category,
  CheckoutInput,
  CheckoutPreview,
  Coupon,
  CouponInput,
  CouponValidation,
  CourierInput,
  CreateRefundInput,
  CreateReturnInput,
  FooterLink,
  FooterSection,
  FooterSettings,
  HealthResult,
  ID,
  Invoice,
  LineItemInput,
  LoginResult,
  MeUser,
  MockCheckout,
  MockGatewayPayload,
  Notification,
  NotificationPage,
  Order,
  OrderAnalytics,
  OrderNote,
  OrderReturn,
  OrderStatus,
  OrderSummary,
  OrderSummaryStats,
  Paginated,
  PaymentDetails,
  PaymentInit,
  PaymentLogo,
  PaymentOutcome,
  PaymentStatusResult,
  PaymentTransaction,
  PlaceOrderInput,
  Product,
  ProductInput,
  ProductListQuery,
  PublicFooter,
  Refund,
  RefundMethod,
  RefundStatus,
  RefreshResult,
  RegisterResult,
  ReorderItem,
  ReorderResult,
  ReturnReason,
  ShipmentResult,
  Shipment,
  ShipmentStatus,
  ShippingCalculation,
  ShippingMethodCode,
  ShippingMethodsResult,
  SocialLink,
  SocialPlatform,
  StatusHistoryEntry,
  StockAlertProduct,
  StockChangeType,
  StockHistoryEntry,
  TimelineEntry,
  TrackResult,
  UploadResult,
  Address,
  Account,
  Permission,
  PermissionDef,
  Role,
  RoleInput,
  UserRole,
} from "./types";

type Q = Record<string, QueryValue>;
const q = (o?: object) => o as Q | undefined;
const enc = encodeURIComponent;

// ─── System ────────────────────────────────────────────────

export const systemApi = {
  /** GET / — served at the API origin root, outside /api/v1. */
  welcome: async (): Promise<{ message: string; docs: string }> => {
    const res = await fetch(`${API_URL}/`, { headers: { Accept: "application/json" } });
    return res.json();
  },
  health: () => api<HealthResult>("/health", { auth: false }),
  /** OpenAPI 3.1 spec (importable into Postman). */
  openapi: () => api<Record<string, unknown>>("/docs/openapi.json", { auth: false }),
  /** Interactive Swagger UI, for linking from the admin panel. */
  docsUrl: `${API_BASE}/docs`,
};

// ─── Auth ──────────────────────────────────────────────────

export const authApi = {
  register: (body: { fullName: string; email: string; password: string }) =>
    request<RegisterResult>("/auth/register", { method: "POST", body, auth: false }),
  resendVerification: (email: string) =>
    request<null>("/auth/resend-verification", { method: "POST", body: { email }, auth: false }),
  verifyEmail: (token: string) =>
    request<null>("/auth/verify-email", { method: "POST", body: { token }, auth: false }),
  login: (body: { email: string; password: string }) =>
    api<LoginResult>("/auth/login", { method: "POST", body, auth: false }),
  me: () => api<MeUser>("/auth/me"),
  refresh: () => api<RefreshResult>("/auth/refresh", { method: "POST", auth: false }),
  /** Emails a 6-digit reset code (same response whether or not the email exists). */
  forgotPassword: (email: string) =>
    request<null>("/auth/forgot-password", { method: "POST", body: { email }, auth: false }),
  /** Checks a code without using it up (5 wrong tries lock it). */
  verifyResetOtp: (email: string, otp: string) =>
    request<null>("/auth/verify-reset-otp", { method: "POST", body: { email, otp }, auth: false }),
  /** Sets the new password; the backend signs the user out of every device. */
  resetPassword: (body: { email: string; otp: string; password: string }) =>
    request<null>("/auth/reset-password", { method: "POST", body, auth: false }),
  logout: () => request<null>("/auth/logout", { method: "POST" }),
  logoutAll: () => request<null>("/auth/logout-all", { method: "POST" }),
};

// ─── Categories ────────────────────────────────────────────

export interface CategoryInput {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentCategory?: ID | null;
  isActive?: boolean;
}

export const categoriesApi = {
  list: (query?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
    parentCategory?: ID | "null";
  }) => api<Paginated<Category>>("/categories", { query: q(query) }),
  get: (idOrSlug: string) => api<Category>(`/categories/${enc(idOrSlug)}`),
  create: (body: CategoryInput) => request<Category>("/categories", { method: "POST", body }),
  update: (id: ID, body: Partial<CategoryInput>) =>
    request<Category>(`/categories/${id}`, { method: "PUT", body }),
  remove: (id: ID) => request<null>(`/categories/${id}`, { method: "DELETE" }),
};

// ─── Brands ────────────────────────────────────────────────

export interface BrandInput {
  name: string;
  slug?: string;
  logo?: string;
  description?: string;
  isActive?: boolean;
}

export const brandsApi = {
  list: (query?: { page?: number; limit?: number; isActive?: boolean; search?: string }) =>
    api<Paginated<Brand>>("/brands", { query: q(query) }),
  get: (idOrSlug: string) => api<Brand>(`/brands/${enc(idOrSlug)}`),
  create: (body: BrandInput) => request<Brand>("/brands", { method: "POST", body }),
  update: (id: ID, body: Partial<BrandInput>) =>
    request<Brand>(`/brands/${id}`, { method: "PUT", body }),
  remove: (id: ID) => request<null>(`/brands/${id}`, { method: "DELETE" }),
};

// ─── Products ──────────────────────────────────────────────

export const productsApi = {
  list: (query?: ProductListQuery) => api<Paginated<Product>>("/products", { query: q(query) }),
  get: (idOrSlug: string) => api<Product>(`/products/${enc(idOrSlug)}`),
  create: (body: ProductInput) => request<Product>("/products", { method: "POST", body }),
  update: (id: ID, body: Partial<ProductInput>) =>
    request<Product>(`/products/${id}`, { method: "PUT", body }),
  addImage: (id: ID, body: { url: string; alt?: string; order?: number }) =>
    request<Product>(`/products/${id}/images`, { method: "POST", body }),
  setThumbnail: (id: ID, thumbnail: string) =>
    request<Product>(`/products/${id}/thumbnail`, { method: "PATCH", body: { thumbnail } }),
  removeImage: (id: ID, imageId: ID) =>
    request<Product>(`/products/${id}/images/${imageId}`, { method: "DELETE" }),
  adjustStock: (id: ID, body: { change: number; type?: StockChangeType; reason?: string }) =>
    request<{ newQuantity: number; history: StockHistoryEntry }>(`/products/${id}/stock`, {
      method: "PATCH",
      body,
    }),
  stockHistory: (id: ID, query?: { page?: number; limit?: number }) =>
    api<Paginated<StockHistoryEntry>>(`/products/${id}/stock-history`, { query: q(query) }),
  lowStock: (query?: { page?: number; limit?: number }) =>
    api<Paginated<StockAlertProduct>>("/products/low-stock", { query: q(query) }),
  outOfStock: (query?: { page?: number; limit?: number }) =>
    api<Paginated<StockAlertProduct>>("/products/out-of-stock", { query: q(query) }),
  /** Soft delete (trash) by default; `permanent` removes it for good. */
  remove: (id: ID, permanent = false) =>
    request<null>(`/products/${id}`, {
      method: "DELETE",
      query: permanent ? { permanent: true } : undefined,
    }),
  restore: (id: ID) => request<Product>(`/products/${id}/restore`, { method: "PATCH" }),
};

// ─── Uploads (admin) ───────────────────────────────────────

function fileForm(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return fd;
}

export const uploadsApi = {
  banner: (file: File) =>
    api<UploadResult>("/admin/uploads/banner", { method: "POST", body: fileForm(file) }),
  footer: (file: File) =>
    api<UploadResult>("/admin/uploads/footer", { method: "POST", body: fileForm(file) }),
  /** Blog covers and deal / look / testimonial / Instagram images. */
  content: (file: File) =>
    api<UploadResult>("/admin/uploads/content", { method: "POST", body: fileForm(file) }),
  /** Product, variation, category and brand images. */
  product: (file: File) =>
    api<UploadResult>("/admin/uploads/product", { method: "POST", body: fileForm(file) }),
  remove: (imageId: ID) => request<null>(`/admin/uploads/${imageId}`, { method: "DELETE" }),
};

// ─── Banners ───────────────────────────────────────────────

export const bannersApi = {
  active: (placement: BannerPlacement = "hero") =>
    api<Banner[]>("/banners/active", { auth: false, query: { placement } }),
  list: (query?: { page?: number; limit?: number; isActive?: boolean; isPublished?: boolean; placement?: BannerPlacement }) =>
    api<Paginated<Banner>>("/admin/banners", { query: q(query) }),
  get: (id: ID) => api<Banner>(`/admin/banners/${id}`),
  create: (body: BannerInput) => request<Banner>("/admin/banners", { method: "POST", body }),
  update: (id: ID, body: BannerInput) =>
    request<Banner>(`/admin/banners/${id}`, { method: "PUT", body }),
  setStatus: (id: ID, body: { isActive?: boolean; isPublished?: boolean }) =>
    request<Banner>(`/admin/banners/${id}/status`, { method: "PATCH", body }),
  reorder: (items: ReorderItem[]) =>
    request<{ modifiedCount: number }>("/admin/banners/reorder", { method: "PATCH", body: { items } }),
  remove: (id: ID) => request<null>(`/admin/banners/${id}`, { method: "DELETE" }),
};

// ─── Footer ────────────────────────────────────────────────

type FooterLinkInput = Omit<FooterLink, "_id" | "target" | "displayOrder" | "isActive"> &
  Partial<Pick<FooterLink, "target" | "displayOrder" | "isActive">>;

export const footerApi = {
  public: () => api<PublicFooter>("/footer", { auth: false }),

  getSettings: () => api<FooterSettings>("/admin/footer"),
  updateSettings: (body: FooterSettings) =>
    request<FooterSettings>("/admin/footer", { method: "PUT", body }),

  listSections: () => api<FooterSection[]>("/admin/footer/sections"),
  getSection: (id: ID) => api<FooterSection>(`/admin/footer/sections/${id}`),
  createSection: (body: { title: string; links?: FooterLinkInput[]; displayOrder?: number; isActive?: boolean }) =>
    request<FooterSection>("/admin/footer/sections", { method: "POST", body }),
  updateSection: (
    id: ID,
    body: { title?: string; links?: FooterLinkInput[]; displayOrder?: number; isActive?: boolean }
  ) => request<FooterSection>(`/admin/footer/sections/${id}`, { method: "PUT", body }),
  reorderSections: (items: ReorderItem[]) =>
    request<{ modifiedCount: number }>("/admin/footer/sections/reorder", { method: "PATCH", body: { items } }),
  removeSection: (id: ID) => request<null>(`/admin/footer/sections/${id}`, { method: "DELETE" }),

  listSocial: () => api<SocialLink[]>("/admin/footer/social-links"),
  createSocial: (body: { platform: SocialPlatform; url: string; customIcon?: string; displayOrder?: number; isActive?: boolean }) =>
    request<SocialLink>("/admin/footer/social-links", { method: "POST", body }),
  updateSocial: (
    id: ID,
    body: Partial<{ platform: SocialPlatform; url: string; customIcon: string; displayOrder: number; isActive: boolean }>
  ) => request<SocialLink>(`/admin/footer/social-links/${id}`, { method: "PUT", body }),
  reorderSocial: (items: ReorderItem[]) =>
    request<{ modifiedCount: number }>("/admin/footer/social-links/reorder", { method: "PATCH", body: { items } }),
  removeSocial: (id: ID) => request<null>(`/admin/footer/social-links/${id}`, { method: "DELETE" }),

  listPaymentLogos: () => api<PaymentLogo[]>("/admin/footer/payment-logos"),
  createPaymentLogo: (body: { name: string; imageUrl: string; altText?: string; displayOrder?: number; isActive?: boolean }) =>
    request<PaymentLogo>("/admin/footer/payment-logos", { method: "POST", body }),
  updatePaymentLogo: (
    id: ID,
    body: Partial<{ name: string; imageUrl: string; altText: string; displayOrder: number; isActive: boolean }>
  ) => request<PaymentLogo>(`/admin/footer/payment-logos/${id}`, { method: "PUT", body }),
  removePaymentLogo: (id: ID) => request<null>(`/admin/footer/payment-logos/${id}`, { method: "DELETE" }),
};

// ─── Coupons ───────────────────────────────────────────────

export const couponsApi = {
  validate: (body: { code: string; source?: "cart" | "buy_now"; items?: LineItemInput[] }) =>
    request<CouponValidation>("/coupons/validate", { method: "POST", body }),
  list: (query?: { page?: number; limit?: number; search?: string; isActive?: boolean }) =>
    api<Paginated<Coupon>>("/admin/coupons", { query: q(query) }),
  get: (id: ID) => api<Coupon>(`/admin/coupons/${id}`),
  create: (body: CouponInput) => request<Coupon>("/admin/coupons", { method: "POST", body }),
  update: (id: ID, body: CouponInput) =>
    request<Coupon>(`/admin/coupons/${id}`, { method: "PATCH", body }),
  remove: (id: ID) => request<null>(`/admin/coupons/${id}`, { method: "DELETE" }),
};

// ─── Cart ──────────────────────────────────────────────────

export const cartApi = {
  get: () => api<Cart>("/cart"),
  add: (body: LineItemInput) => request<Cart>("/cart/items", { method: "POST", body }),
  update: (itemId: ID, quantity: number) =>
    request<Cart>(`/cart/items/${itemId}`, { method: "PATCH", body: { quantity } }),
  remove: (itemId: ID) => request<Cart>(`/cart/items/${itemId}`, { method: "DELETE" }),
  clear: () => request<null>("/cart", { method: "DELETE" }),
};

// ─── Shipping ──────────────────────────────────────────────

export const shippingApi = {
  methods: () => api<ShippingMethodsResult>("/shipping/methods", { auth: false }),
  calculate: (body: {
    shippingMethod: ShippingMethodCode;
    source?: "cart" | "buy_now";
    items?: LineItemInput[];
    couponCode?: string;
  }) => api<ShippingCalculation>("/shipping/calculate", { method: "POST", body }),
};

// ─── Orders (customer) ─────────────────────────────────────

export const ordersApi = {
  checkout: (body: CheckoutInput) =>
    api<CheckoutPreview>("/orders/checkout", { method: "POST", body }),
  place: (body: PlaceOrderInput, idempotencyKey?: string) =>
    request<Order>("/orders", {
      method: "POST",
      body,
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    }),
  buyNow: (body: BuyNowInput, idempotencyKey?: string) =>
    request<Order>("/orders/buy-now", {
      method: "POST",
      body,
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    }),
  myOrders: (query?: { page?: number; limit?: number; status?: string }) =>
    api<Paginated<Order>>("/orders/my-orders", { query: q(query) }),
  myStats: () => api<OrderSummaryStats>("/orders/my-orders/summary"),
  get: (id: ID) => api<Order>(`/orders/${id}`),
  getByNumber: (orderNumber: string) => api<Order>(`/orders/number/${enc(orderNumber)}`),
  summary: (id: ID) => api<OrderSummary>(`/orders/${id}/summary`),
  invoice: (id: ID) => api<Invoice>(`/orders/${id}/invoice`),
  invoiceHtml: (id: ID) => requestText(`/orders/${id}/invoice`, { format: "html" }),
  statusHistory: (id: ID) => api<TimelineEntry[]>(`/orders/${id}/status-history`),
  /** Owner / staff send their token; guests must pass the shipping phone. */
  track: (orderNumber: string, phone?: string) =>
    api<TrackResult>(`/orders/track/${enc(orderNumber)}`, { query: { phone } }),
  cancel: (id: ID, reason: string) =>
    request<Order>(`/orders/${id}/cancel`, { method: "PATCH", body: { reason } }),
  requestCancel: (id: ID, reason: string) =>
    request<Order>(`/orders/${id}/cancel-request`, { method: "POST", body: { reason } }),
  reorder: (id: ID) => request<ReorderResult>(`/orders/${id}/reorder`, { method: "POST" }),
  createReturn: (id: ID, body: CreateReturnInput) =>
    request<OrderReturn>(`/orders/${id}/return`, { method: "POST", body }),
};

// ─── Payments ──────────────────────────────────────────────

export const paymentsApi = {
  initialize: (orderId: ID) =>
    request<PaymentInit>("/payments/initialize", { method: "POST", body: { orderId } }),
  /** Dev-only mock gateway: returns signed success/failure payloads. */
  mockCheckout: (transactionId: string) =>
    api<MockCheckout>(`/payments/mock/checkout/${enc(transactionId)}`, { auth: false }),
  /** Gateway → server callback. The browser normally never calls this; kept for completeness. */
  callback: (provider: string, kind: "success" | "failure" | "cancel" | "ipn", body: MockGatewayPayload) =>
    api<PaymentOutcome>(`/payments/callback/${enc(provider)}/${kind}`, { method: "POST", body, auth: false }),
  verify: (payload: Record<string, unknown>, provider = "mock") =>
    request<PaymentOutcome>("/payments/verify", { method: "POST", body: { provider, payload } }),
  details: (orderId: ID) => api<PaymentDetails>(`/payments/${orderId}`),
  status: (orderId: ID) => api<PaymentStatusResult>(`/payments/${orderId}/status`),
  transactions: (orderId: ID) => api<PaymentTransaction[]>(`/payments/${orderId}/transactions`),
};

// ─── Returns (customer) ────────────────────────────────────

export const returnsApi = {
  uploadImage: (file: File) =>
    api<UploadResult>("/returns/images", { method: "POST", body: fileForm(file) }),
  mine: (query?: { page?: number; limit?: number; status?: string }) =>
    api<Paginated<OrderReturn>>("/returns/my-returns", { query: q(query) }),
  get: (id: ID) => api<OrderReturn>(`/returns/${id}`),
  cancel: (id: ID) => request<OrderReturn>(`/returns/${id}/cancel`, { method: "PATCH" }),
  requestRefund: (id: ID, body: { method: RefundMethod; accountDetails?: string; note?: string }) =>
    request<OrderReturn>(`/returns/${id}/refund-request`, { method: "POST", body }),
};

// ─── Notifications ─────────────────────────────────────────

export const notificationsApi = {
  list: (query?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    api<NotificationPage>("/notifications", { query: q(query) }),
  markRead: (id: ID) => api<Notification>(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => request<null>("/notifications/read-all", { method: "PATCH" }),
};

// ─── Orders (admin / manager) ──────────────────────────────

export const adminOrdersApi = {
  list: (query?: AdminOrderListQuery) =>
    api<Paginated<Order>>("/admin/orders", { query: q(query) }),
  analytics: (query?: { from?: string; to?: string }) =>
    api<OrderAnalytics>("/admin/orders/analytics", { query: q(query) }),
  cancellationRequests: (query?: { page?: number; limit?: number }) =>
    api<Paginated<Order>>("/admin/orders/cancellation-requests", { query: q(query) }),
  expireUnpaid: (olderThanMinutes?: number) =>
    request<{ expired: number }>("/admin/orders/expire-unpaid", {
      method: "POST",
      query: { olderThanMinutes },
    }),
  getByNumber: (orderNumber: string) =>
    api<AdminOrderDetail>(`/admin/orders/number/${enc(orderNumber)}`),
  get: (id: ID) => api<AdminOrderDetail>(`/admin/orders/${id}`),
  updateInfo: (id: ID, body: { billingAddress?: Address; customerNote?: string | null }) =>
    request<Order>(`/admin/orders/${id}`, { method: "PATCH", body }),
  confirm: (id: ID, note?: string) =>
    request<Order>(`/admin/orders/${id}/confirm`, { method: "PATCH", body: { note } }),
  updateStatus: (id: ID, body: { status: OrderStatus; note?: string; customerNote?: string }) =>
    request<Order>(`/admin/orders/${id}/status`, { method: "PATCH", body }),
  updateShipping: (id: ID, body: { shippingAddress?: Address; shippingMethod?: ShippingMethodCode }) =>
    request<Order>(`/admin/orders/${id}/shipping`, { method: "PATCH", body }),
  assignCourier: (id: ID, body: CourierInput) =>
    request<{ order: Order; shipment: Shipment }>(`/admin/orders/${id}/courier`, { method: "POST", body }),
  setTracking: (id: ID, body: { trackingNumber: string; trackingUrl?: string }) =>
    request<{ order: Order; shipment: Shipment }>(`/admin/orders/${id}/tracking`, { method: "PATCH", body }),
  shipment: (id: ID) => api<Shipment | null>(`/admin/orders/${id}/shipment`),
  addShipmentEvent: (
    id: ID,
    body: { status: ShipmentStatus; description?: string; location?: string; syncOrderStatus?: boolean }
  ) => request<ShipmentResult>(`/admin/orders/${id}/shipment/events`, { method: "POST", body }),
  syncShipment: (id: ID) =>
    request<ShipmentResult>(`/admin/orders/${id}/shipment/sync`, { method: "POST" }),
  cancel: (id: ID, reason: string) =>
    request<Order>(`/admin/orders/${id}/cancel`, { method: "PATCH", body: { reason } }),
  reviewCancellation: (id: ID, body: { action: "approve" | "reject"; note?: string }) =>
    request<Order>(`/admin/orders/${id}/cancellation-request`, { method: "PATCH", body }),
  addNote: (id: ID, body: { note: string; visibility?: "internal" | "customer" }) =>
    request<OrderNote>(`/admin/orders/${id}/notes`, { method: "POST", body }),
};

/** Re-exported for pages that show the admin status log. */
export type { StatusHistoryEntry };

// ─── Returns & refunds (admin) ─────────────────────────────

export const adminReturnsApi = {
  list: (query?: {
    status?: string;
    search?: string;
    refundRequested?: boolean;
    page?: number;
    limit?: number;
  }) => api<Paginated<OrderReturn>>("/admin/returns", { query: q(query) }),
  get: (id: ID) => api<OrderReturn>(`/admin/returns/${id}`),
  updateStatus: (
    id: ID,
    body: { status: "approved" | "rejected" | "received" | "completed"; note?: string; restock?: boolean }
  ) => request<OrderReturn>(`/admin/returns/${id}/status`, { method: "PATCH", body }),
};

export const adminRefundsApi = {
  create: (body: CreateRefundInput) => request<Refund>("/admin/refunds", { method: "POST", body }),
  list: (query?: { status?: string; orderId?: ID; search?: string; page?: number; limit?: number }) =>
    api<Paginated<Refund>>("/admin/refunds", { query: q(query) }),
  get: (id: ID) => api<Refund>(`/admin/refunds/${id}`),
  updateStatus: (
    id: ID,
    body: { status: Exclude<RefundStatus, "pending">; transactionRef?: string; note?: string }
  ) => request<Refund>(`/admin/refunds/${id}/status`, { method: "PATCH", body }),
};

export type { ReturnReason };

// ─── Storefront content (public) ───────────────────────────

export const contentApi = {
  activeDeals: (limit?: number) => api<ActiveDeal[]>("/deals/active", { auth: false, query: { limit } }),
  looks: (layout?: LookLayout) => api<PublicLook[]>("/looks", { auth: false, query: { layout } }),
  blog: (query?: { tag?: string; featured?: boolean; search?: string; page?: number; limit?: number }) =>
    api<Paginated<BlogPostSummary>>("/blog", { auth: false, query: q(query) }),
  blogPost: (slug: string) => api<BlogPost>(`/blog/${enc(slug)}`, { auth: false }),
  testimonials: (type?: TestimonialType) =>
    api<Testimonial[]>("/testimonials", { auth: false, query: { type } }),
  instagramPosts: (limit?: number) => api<InstagramPost[]>("/instagram-posts", { auth: false, query: { limit } }),
};

// ─── Reviews ───────────────────────────────────────────────

export const reviewsApi = {
  forProduct: (
    idOrSlug: string,
    query?: { rating?: number; sort?: "newest" | "highest" | "lowest"; page?: number; limit?: number }
  ) => api<ProductReviewsPage>(`/products/${enc(idOrSlug)}/reviews`, { auth: false, query: q(query) }),
  create: (idOrSlug: string, body: ReviewInput) =>
    request<Review>(`/products/${enc(idOrSlug)}/reviews`, { method: "POST", body }),
  mine: (query?: { page?: number; limit?: number }) => api<Paginated<Review>>("/reviews/my-reviews", { query: q(query) }),
  update: (id: ID, body: Partial<ReviewInput>) => request<Review>(`/reviews/${id}`, { method: "PATCH", body }),
  remove: (id: ID) => request<null>(`/reviews/${id}`, { method: "DELETE" }),
  featured: (limit?: number) => api<Review[]>("/reviews/featured", { auth: false, query: { limit } }),
  summary: () => api<RatingSummary>("/reviews/summary", { auth: false }),
};

// ─── Newsletter ────────────────────────────────────────────

export const newsletterApi = {
  subscribe: (body: { email: string; name?: string; source?: string }) =>
    request<null>("/newsletter/subscribe", { method: "POST", body, auth: false }),
  unsubscribe: (token: string) =>
    request<null>("/newsletter/unsubscribe", { method: "POST", body: { token }, auth: false }),
};

// ─── Content (admin) ───────────────────────────────────────

type AdminListQuery = { search?: string; isActive?: boolean; page?: number; limit?: number };

/** GET list · POST · GET/PATCH/DELETE /:id for one admin content collection. */
function contentAdmin<T, I>(base: string) {
  return {
    list: (query?: AdminListQuery & Record<string, QueryValue>) => api<Paginated<T>>(base, { query: q(query) }),
    get: (id: ID) => api<T>(`${base}/${id}`),
    create: (body: I) => request<T>(base, { method: "POST", body }),
    update: (id: ID, body: I) => request<T>(`${base}/${id}`, { method: "PATCH", body }),
    remove: (id: ID) => request<null>(`${base}/${id}`, { method: "DELETE" }),
  };
}

/** Collections that also support PATCH /reorder (the blog doesn't). */
function orderedContentAdmin<T, I>(base: string) {
  return {
    ...contentAdmin<T, I>(base),
    reorder: (items: ContentReorderItem[]) =>
      request<{ modifiedCount: number }>(`${base}/reorder`, { method: "PATCH", body: { items } }),
  };
}

export const adminDealsApi = orderedContentAdmin<Deal, DealInput>("/admin/deals");
export const adminLooksApi = orderedContentAdmin<Look, LookInput>("/admin/looks");
export const adminBlogApi = contentAdmin<AdminBlogPost, BlogPostInput>("/admin/blog");
export const adminTestimonialsApi = orderedContentAdmin<Testimonial, TestimonialInput>("/admin/testimonials");
export const adminInstagramApi = orderedContentAdmin<InstagramPost, InstagramPostInput>("/admin/instagram-posts");

export const adminReviewsApi = {
  list: (query?: {
    status?: ReviewStatus | string;
    product?: ID;
    rating?: number;
    isFeatured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => api<Paginated<Review>>("/admin/reviews", { query: q(query) }),
  get: (id: ID) => api<Review>(`/admin/reviews/${id}`),
  moderate: (id: ID, body: ModerateReviewInput) =>
    request<Review>(`/admin/reviews/${id}`, { method: "PATCH", body }),
  remove: (id: ID) => request<null>(`/admin/reviews/${id}`, { method: "DELETE" }),
};

export const adminNewsletterApi = {
  list: (query?: { status?: SubscriberStatus; search?: string; page?: number; limit?: number }) =>
    api<SubscriberPage>("/admin/newsletter", { query: q(query) }),
  /** CSV text of subscribers (optionally one status). */
  exportCsv: (status?: SubscriberStatus) => requestText("/admin/newsletter/export", { status }),
  add: (body: { email: string; name?: string; source?: string }) =>
    request<Subscriber>("/admin/newsletter", { method: "POST", body }),
  get: (id: ID) => api<Subscriber>(`/admin/newsletter/${id}`),
  update: (id: ID, body: { name?: string; status?: SubscriberStatus }) =>
    request<Subscriber>(`/admin/newsletter/${id}`, { method: "PATCH", body }),
  remove: (id: ID) => request<null>(`/admin/newsletter/${id}`, { method: "DELETE" }),
};

// ─── Staff, roles & customers (admin) ──────────────────────

/** GET /admin/permissions and /admin/roles — requires staff:manage (admins). */
export const rolesApi = {
  permissions: () => api<PermissionDef[]>("/admin/permissions"),
  list: () => api<Role[]>("/admin/roles"),
  get: (key: string) => api<Role>(`/admin/roles/${enc(key)}`),
  /** key is derived from name when omitted ("Content Editor" → "content-editor"). */
  create: (body: RoleInput & { name: string }) => request<Role>("/admin/roles", { method: "POST", body }),
  update: (key: string, body: RoleInput) => request<Role>(`/admin/roles/${enc(key)}`, { method: "PATCH", body }),
  remove: (key: string) => request<null>(`/admin/roles/${enc(key)}`, { method: "DELETE" }),
};

/** Accounts (staff and customers) — requires staff:manage. */
export const staffApi = {
  list: (query?: { type?: "staff" | "customer"; role?: string; search?: string; page?: number; limit?: number }) =>
    api<Paginated<Account>>("/admin/users", { query: q(query) }),
  get: (id: ID) => api<Account>(`/admin/users/${id}`),
  create: (body: { fullName: string; email: string; password: string; role: UserRole }) =>
    request<Account>("/admin/users", { method: "POST", body }),
  /** Change role (role "user" removes dashboard access) or name. */
  update: (id: ID, body: { fullName?: string; role?: UserRole }) =>
    request<Account>(`/admin/users/${id}`, { method: "PATCH", body }),
};

/** Read-only customer accounts — requires customers:read. */
export const customersApi = {
  list: (query?: { search?: string; page?: number; limit?: number }) =>
    api<Paginated<Account>>("/admin/customers", { query: q(query) }),
  get: (id: ID) => api<Account>(`/admin/customers/${id}`),
};

export type { Permission };
