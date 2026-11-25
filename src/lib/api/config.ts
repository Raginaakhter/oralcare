/**
 * Backend connection settings.
 *
 * NEXT_PUBLIC_API_URL is the backend origin (no trailing slash, no /api/v1),
 * e.g. http://localhost:5000. Every endpoint lives under `${API_URL}/api/v1`.
 */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

export const API_BASE = `${API_URL}/api/v1`;

/** Image shown when a product / banner has no image of its own. */
export const PLACEHOLDER_IMAGE = "/images/logo.png";

/**
 * Turns whatever the backend stores for an image into a URL the browser can load.
 * - `/uploads/...` paths are served by the backend, so they get the API origin.
 * - absolute http(s) URLs pass through.
 * - anything else (local `/images/...`) passes through.
 */
export function assetUrl(src?: string | null): string {
  if (!src) return PLACEHOLDER_IMAGE;
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
  return src;
}

/** next/image can only optimise local files and configured hosts; skip it for the rest. */
export function isRemoteImage(src: string): boolean {
  return /^https?:\/\//i.test(src) || src.startsWith("data:");
}
