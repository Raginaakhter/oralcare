/**
 * Cached, server-side readers for public storefront data.
 *
 * Each function is a Cache Components `"use cache"` scope with a short lifetime,
 * so pages prerender fast and pick up catalog changes within minutes. They never
 * throw: if the backend is unreachable (e.g. during `next build`) they return an
 * empty result and the page still renders.
 */
import { cacheLife, cacheTag } from "next/cache";
import {
  bannersApi,
  brandsApi,
  categoriesApi,
  contentApi,
  footerApi,
  productsApi,
  reviewsApi,
  shippingApi,
} from "./endpoints";
import type {
  ActiveDeal,
  Banner,
  BannerPlacement,
  BlogPost,
  BlogPostSummary,
  Brand,
  Category,
  InstagramPost,
  Paginated,
  Product,
  ProductListQuery,
  PublicFooter,
  PublicLook,
  RatingSummary,
  Review,
  ShippingMethodsResult,
  Testimonial,
  TestimonialType,
} from "./types";

function emptyPage<T>(): Paginated<T> {
  return { items: [], total: 0, page: 1, pageSize: 0, totalPages: 1 };
}

export async function getProducts(query: ProductListQuery = {}): Promise<Paginated<Product>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  try {
    return await productsApi.list(query);
  } catch {
    return emptyPage<Product>();
  }
}

/** Returns null when the product doesn't exist (or isn't published). */
export async function getProduct(idOrSlug: string): Promise<Product | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products", `product:${idOrSlug}`);
  try {
    return await productsApi.get(idOrSlug);
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("categories");
  try {
    const page = await categoriesApi.list({ limit: 100, isActive: true });
    return page.items.filter((c) => c.isActive);
  } catch {
    return [];
  }
}

export async function getBrands(): Promise<Brand[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("brands");
  try {
    const page = await brandsApi.list({ limit: 100, isActive: true });
    return page.items.filter((b) => b.isActive);
  } catch {
    return [];
  }
}

export async function getActiveBanners(placement: BannerPlacement = "hero"): Promise<Banner[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("banners");
  try {
    return await bannersApi.active(placement);
  } catch {
    return [];
  }
}

// ─── Storefront content ────────────────────────────────────

/** Running deals; the countdown itself ticks on the client from `endsAt`. */
export async function getActiveDeals(): Promise<ActiveDeal[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("deals");
  try {
    return await contentApi.activeDeals(1);
  } catch {
    return [];
  }
}

export async function getLooks(): Promise<PublicLook[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("looks");
  try {
    return await contentApi.looks();
  } catch {
    return [];
  }
}

export async function getBlogPosts(
  query: { tag?: string; featured?: boolean; page?: number; limit?: number } = {}
): Promise<Paginated<BlogPostSummary>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("blog");
  try {
    return await contentApi.blog(query);
  } catch {
    return emptyPage<BlogPostSummary>();
  }
}

/** Returns null when the post doesn't exist or isn't published. */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("blog", `blog:${slug}`);
  try {
    return await contentApi.blogPost(slug);
  } catch {
    return null;
  }
}

export async function getTestimonials(type?: TestimonialType): Promise<Testimonial[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("testimonials");
  try {
    return await contentApi.testimonials(type);
  } catch {
    return [];
  }
}

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("instagram");
  try {
    return await contentApi.instagramPosts(6);
  } catch {
    return [];
  }
}

export async function getFeaturedReviews(): Promise<Review[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("reviews");
  try {
    return await reviewsApi.featured(3);
  } catch {
    return [];
  }
}

export async function getReviewSummary(): Promise<RatingSummary | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("reviews");
  try {
    return await reviewsApi.summary();
  } catch {
    return null;
  }
}

export async function getPublicFooter(): Promise<PublicFooter | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("footer");
  try {
    return await footerApi.public();
  } catch {
    return null;
  }
}

export async function getShippingMethods(): Promise<ShippingMethodsResult | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("shipping");
  try {
    return await shippingApi.methods();
  } catch {
    return null;
  }
}

/** One brand by slug (GET /brands/:idOrSlug), or null. */
export async function getBrand(slug: string): Promise<Brand | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("brands");
  try {
    return await brandsApi.get(slug);
  } catch {
    return null;
  }
}
