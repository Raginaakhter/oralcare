import { API_BASE } from "./config";
import type { ApiEnvelope, RefreshResult, ValidationDetail } from "./types";

/** Error thrown for any non-2xx response; carries the backend's message and details. */
export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }

  /** Field-level messages from a 400 "Validation failed" response. */
  get fieldErrors(): ValidationDetail[] {
    return Array.isArray(this.details)
      ? (this.details as ValidationDetail[]).filter((d) => d && typeof d.field === "string")
      : [];
  }
}

/** Human-readable message for a caught error, including validation details. */
export function errorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof ApiError) {
    const fields = err.fieldErrors;
    if (fields.length) {
      return `${err.message}: ${fields.map((f) => `${f.field} — ${f.message}`).join("; ")}`;
    }
    return err.message || fallback;
  }
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

// ─── Access token storage ──────────────────────────────────

const TOKEN_KEY = "oc_access_token";
let accessToken: string | null = null;
let tokenLoaded = false;
const listeners = new Set<(token: string | null) => void>();

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  if (!tokenLoaded) {
    accessToken = readStoredToken();
    tokenLoaded = true;
  }
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  tokenLoaded = true;
  if (typeof window !== "undefined") {
    try {
      if (token) window.localStorage.setItem(TOKEN_KEY, token);
      else window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // storage blocked — the in-memory token still works for this tab
    }
  }
  listeners.forEach((l) => l(token));
}

/** Notified when the token changes (login, refresh, logout, forced sign-out). */
export function onAccessTokenChange(listener: (token: string | null) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ─── Refresh (single flight) ───────────────────────────────

let refreshing: Promise<string | null> | null = null;

/** Uses the httpOnly refresh_token cookie to mint a new access token. */
export function refreshAccessToken(): Promise<string | null> {
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          setAccessToken(null);
          return null;
        }
        const body = (await res.json()) as ApiEnvelope<RefreshResult>;
        const token = body.data?.accessToken ?? null;
        setAccessToken(token);
        return token;
      } catch {
        return null;
      } finally {
        // let the next 401 trigger a fresh attempt
        setTimeout(() => {
          refreshing = null;
        }, 0);
      }
    })();
  }
  return refreshing;
}

// ─── Request ───────────────────────────────────────────────

export type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Send the bearer token (default true). Public calls still work without one. */
  auth?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Passed to fetch; lets server components opt into Next.js caching. */
  cache?: RequestCache;
}

export function buildQuery(query?: Record<string, QueryValue>): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Low-level request. Resolves to the full `{ success, message, data, … }` envelope.
 * Throws ApiError on any non-2xx status.
 */
export async function request<T>(
  path: string,
  opts: RequestOptions = {},
  retried = false
): Promise<ApiEnvelope<T>> {
  const { method = "GET", body, query, auth = true, headers = {}, signal, cache } = opts;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const h: Record<string, string> = { Accept: "application/json", ...headers };
  if (body !== undefined && !isForm) h["Content-Type"] = "application/json";
  const token = auth ? getAccessToken() : null;
  if (token) h.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}${buildQuery(query)}`, {
      method,
      headers: h,
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
      credentials: "include",
      signal,
      cache,
    });
  } catch (err) {
    if ((err as Error)?.name === "AbortError") throw err;
    throw new ApiError(
      "Cannot reach the server. Check your connection and try again.",
      0
    );
  }

  // Expired / invalid access token → refresh once and retry.
  if (res.status === 401 && auth && token && !retried && !path.startsWith("/auth/refresh")) {
    const fresh = await refreshAccessToken();
    if (fresh) return request<T>(path, opts, true);
  }

  const parsed = (await parseBody(res)) as Partial<ApiEnvelope<T>> | string | null;

  if (!res.ok) {
    const env = typeof parsed === "object" && parsed ? parsed : null;
    throw new ApiError(
      env?.message || (typeof parsed === "string" && parsed) || `Request failed (${res.status})`,
      res.status,
      env?.details
    );
  }

  if (parsed && typeof parsed === "object" && "success" in parsed) {
    return parsed as ApiEnvelope<T>;
  }
  // Endpoints that don't use the envelope (e.g. GET /) — wrap them.
  return { success: true, data: parsed as T };
}

/** Convenience: resolves straight to `data`. */
export async function api<T>(path: string, opts?: RequestOptions): Promise<T> {
  const env = await request<T>(path, opts);
  return env.data;
}

/** Fetch an HTML (or other text) resource with the bearer token, e.g. invoice?format=html. */
export async function requestText(path: string, query?: Record<string, QueryValue>): Promise<string> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}${path}${buildQuery(query)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });
  const text = await res.text();
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      message = (JSON.parse(text) as { message?: string }).message ?? message;
    } catch {
      // not JSON
    }
    throw new ApiError(message, res.status);
  }
  return text;
}
