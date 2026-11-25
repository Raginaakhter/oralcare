"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cartApi, errorMessage, type Cart, type CartSummary, type LineItemInput } from "@/lib/api";
import {
  brandName,
  productImage,
  variationPrice,
  type Product,
  type ProductVariation,
} from "@/lib/products";
import { formatPriceBDT } from "@/lib/format";

export { formatPriceBDT };

/**
 * One cart row. Shape follows the backend's priced cart line so signed-in
 * (server) and guest (local) carts render the same way.
 */
export interface CartLine {
  /** Stable key: server itemId, or productId:variationId for guests. */
  key: string;
  itemId?: string;
  productId: string;
  variationId: string | null;
  quantity: number;
  productName: string;
  slug: string;
  sku?: string;
  thumbnail?: string;
  brandName?: string;
  variationAttributes?: Record<string, string>;
  unitPrice: number;
  regularPrice: number;
  lineTotal: number;
  availableStock: number;
  /** Server-reported problem (out of stock, unavailable…). */
  issue?: string;
}

/** Item handed from "Buy Now" to the checkout page. */
export interface BuyNowItem extends LineItemInput {
  line: CartLine;
}

export type Toast = {
  id: number;
  message: string;
  type: "success" | "info" | "error";
};

interface StoreContextType {
  cart: CartLine[];
  cartSummary: CartSummary | null;
  cartLoading: boolean;
  wishlist: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (
    product: Product,
    qty?: number,
    openDrawer?: boolean,
    variation?: ProductVariation | null
  ) => Promise<void>;
  removeFromCart: (key: string) => Promise<void>;
  updateCartQty: (key: string, qty: number) => Promise<void>;
  clearCart: (silent?: boolean) => Promise<void>;
  refreshCart: () => Promise<void>;
  /** Replace the local cart state with a server cart (e.g. after reorder). */
  applyServerCart: (cart: Cart) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (slug: string) => boolean;
  removeFromWishlist: (slug: string) => void;
  clearWishlist: () => void;
  buyNow: (product: Product, qty?: number, variation?: ProductVariation | null) => void;
  getBuyNowItem: () => BuyNowItem | null;
  clearBuyNowItem: () => void;
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: number) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const GUEST_CART_KEY = "oralcare_cart_v2";
const WISHLIST_KEY = "oralcare_wishlist_v2";
const BUY_NOW_KEY = "oralcare_buy_now";

function readJSON<T>(storage: "local" | "session", key: string, fallback: T): T {
  try {
    const s = storage === "local" ? window.localStorage : window.sessionStorage;
    const raw = s.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(storage: "local" | "session", key: string, value: unknown) {
  try {
    const s = storage === "local" ? window.localStorage : window.sessionStorage;
    if (value === null) s.removeItem(key);
    else s.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — state still lives in memory
  }
}

function guestKey(productId: string, variationId: string | null) {
  return `${productId}:${variationId ?? ""}`;
}

function lineFromProduct(
  product: Product,
  quantity: number,
  variation?: ProductVariation | null
): CartLine {
  const unitPrice = variationPrice(product, variation);
  return {
    key: guestKey(product._id, variation?._id ?? null),
    productId: product._id,
    variationId: variation?._id ?? null,
    quantity,
    productName: product.productName,
    slug: product.slug,
    sku: variation?.sku ?? product.sku,
    thumbnail: variation?.image || productImage(product),
    brandName: brandName(product) || undefined,
    variationAttributes: variation?.attributes,
    unitPrice,
    regularPrice: typeof variation?.price === "number" ? variation.price : product.regularPrice,
    lineTotal: unitPrice * quantity,
    availableStock: variation ? variation.stockQuantity ?? 0 : product.stockQuantity,
  };
}

function linesFromServer(cart: Cart): CartLine[] {
  return cart.items.map((it) => {
    const l = it.line;
    return {
      key: it.itemId,
      itemId: it.itemId,
      productId: it.productId,
      variationId: it.variationId,
      quantity: it.quantity,
      productName: l?.productName ?? "Unavailable product",
      slug: l?.slug ?? "",
      sku: l?.sku,
      thumbnail: l?.thumbnail,
      variationAttributes: l?.variationAttributes,
      unitPrice: l?.unitPrice ?? 0,
      regularPrice: l?.regularPrice ?? 0,
      lineTotal: l?.lineTotal ?? 0,
      availableStock: l?.availableStock ?? 0,
      issue: it.issue?.message,
    };
  });
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();
  const isServer = status === "authenticated";

  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const mergedRef = useRef(false);

  const showToast = useCallback(
    (message: string, type: "success" | "info" | "error" = "success") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const applyServerCart = useCallback((c: Cart) => {
    setCart(linesFromServer(c));
    setCartSummary(c.summary);
  }, []);

  // Wishlist (local only — the backend has no wishlist endpoint).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount (avoids SSR mismatch)
    setWishlist(readJSON<Product[]>("local", WISHLIST_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON("local", WISHLIST_KEY, wishlist);
  }, [wishlist, hydrated]);

  const refreshCart = useCallback(async () => {
    if (status !== "authenticated") return;
    setCartLoading(true);
    try {
      applyServerCart(await cartApi.get());
    } catch (err) {
      showToast(errorMessage(err, "Could not load your cart"), "error");
    } finally {
      setCartLoading(false);
    }
  }, [status, applyServerCart, showToast]);

  // Load the right cart whenever auth state settles; on sign-in, push the guest cart up first.
  useEffect(() => {
    if (status === "loading") return;

    if (status === "guest") {
      mergedRef.current = false;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- guest cart lives in localStorage
      setCart(readJSON<CartLine[]>("local", GUEST_CART_KEY, []));
      setCartSummary(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setCartLoading(true);
      try {
        const guestLines = readJSON<CartLine[]>("local", GUEST_CART_KEY, []);
        if (!mergedRef.current && guestLines.length) {
          mergedRef.current = true;
          for (const l of guestLines) {
            try {
              await cartApi.add({
                productId: l.productId,
                variationId: l.variationId,
                quantity: l.quantity,
              });
            } catch {
              // skip items that can no longer be added (out of stock etc.)
            }
          }
          writeJSON("local", GUEST_CART_KEY, null);
        }
        mergedRef.current = true;
        const c = await cartApi.get();
        if (!cancelled) applyServerCart(c);
      } catch (err) {
        if (!cancelled) showToast(errorMessage(err, "Could not load your cart"), "error");
      } finally {
        if (!cancelled) setCartLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, applyServerCart, showToast]);

  const saveGuest = useCallback((next: CartLine[]) => {
    setCart(next);
    writeJSON("local", GUEST_CART_KEY, next);
  }, []);

  const addToCart = useCallback(
    async (product: Product, qty = 1, openDrawer = true, variation?: ProductVariation | null) => {
      if (product.productType === "variable" && !variation) {
        showToast(`Choose an option for "${product.productName}" first`, "info");
        router.push(`/product/${product.slug}`);
        return;
      }
      try {
        if (isServer) {
          const env = await cartApi.add({
            productId: product._id,
            variationId: variation?._id ?? null,
            quantity: qty,
          });
          applyServerCart(env.data);
        } else {
          const key = guestKey(product._id, variation?._id ?? null);
          const existing = cart.find((l) => l.key === key);
          const next = existing
            ? cart.map((l) =>
                l.key === key
                  ? { ...l, quantity: l.quantity + qty, lineTotal: l.unitPrice * (l.quantity + qty) }
                  : l
              )
            : [lineFromProduct(product, qty, variation), ...cart];
          saveGuest(next);
        }
        showToast(`Added "${product.productName}" to cart!`, "success");
        if (openDrawer) setIsCartOpen(true);
      } catch (err) {
        showToast(errorMessage(err, "Could not add to cart"), "error");
      }
    },
    [isServer, cart, applyServerCart, saveGuest, showToast, router]
  );

  const removeFromCart = useCallback(
    async (key: string) => {
      const line = cart.find((l) => l.key === key);
      try {
        if (isServer && line?.itemId) {
          const env = await cartApi.remove(line.itemId);
          applyServerCart(env.data);
        } else {
          saveGuest(cart.filter((l) => l.key !== key));
        }
        if (line) showToast(`Removed "${line.productName}" from cart`, "info");
      } catch (err) {
        showToast(errorMessage(err, "Could not remove item"), "error");
      }
    },
    [isServer, cart, applyServerCart, saveGuest, showToast]
  );

  const updateCartQty = useCallback(
    async (key: string, qty: number) => {
      if (qty <= 0) return removeFromCart(key);
      const line = cart.find((l) => l.key === key);
      if (!line) return;
      try {
        if (isServer && line.itemId) {
          const env = await cartApi.update(line.itemId, qty);
          applyServerCart(env.data);
        } else {
          saveGuest(
            cart.map((l) => (l.key === key ? { ...l, quantity: qty, lineTotal: l.unitPrice * qty } : l))
          );
        }
      } catch (err) {
        showToast(errorMessage(err, "Could not update quantity"), "error");
      }
    },
    [isServer, cart, applyServerCart, saveGuest, showToast, removeFromCart]
  );

  const clearCart = useCallback(
    async (silent = false) => {
      try {
        if (isServer) await cartApi.clear();
        saveGuest([]);
        setCartSummary(null);
        if (!silent) showToast("Cart cleared", "info");
      } catch (err) {
        showToast(errorMessage(err, "Could not clear cart"), "error");
      }
    },
    [isServer, saveGuest, showToast]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlist((prev) => {
        if (prev.some((p) => p.slug === product.slug)) {
          showToast(`Removed "${product.productName}" from wishlist`, "info");
          return prev.filter((p) => p.slug !== product.slug);
        }
        showToast(`Added "${product.productName}" to wishlist`, "success");
        return [product, ...prev];
      });
    },
    [showToast]
  );

  const isInWishlist = useCallback((slug: string) => wishlist.some((p) => p.slug === slug), [wishlist]);

  const removeFromWishlist = useCallback(
    (slug: string) => {
      setWishlist((prev) => prev.filter((p) => p.slug !== slug));
      showToast("Removed from wishlist", "info");
    },
    [showToast]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    showToast("Wishlist cleared", "info");
  }, [showToast]);

  const buyNow = useCallback(
    (product: Product, qty = 1, variation?: ProductVariation | null) => {
      if (product.productType === "variable" && !variation) {
        showToast(`Choose an option for "${product.productName}" first`, "info");
        router.push(`/product/${product.slug}`);
        return;
      }
      const item: BuyNowItem = {
        productId: product._id,
        variationId: variation?._id ?? null,
        quantity: qty,
        line: lineFromProduct(product, qty, variation),
      };
      writeJSON("session", BUY_NOW_KEY, item);
      setIsCartOpen(false);
      router.push("/checkout?mode=buy-now");
    },
    [router, showToast]
  );

  const getBuyNowItem = useCallback(() => readJSON<BuyNowItem | null>("session", BUY_NOW_KEY, null), []);
  const clearBuyNowItem = useCallback(() => writeJSON("session", BUY_NOW_KEY, null), []);

  const cartCount = useMemo(
    () => cartSummary?.totalQuantity ?? cart.reduce((s, l) => s + l.quantity, 0),
    [cart, cartSummary]
  );
  const cartSubtotal = useMemo(
    () => cartSummary?.subtotal ?? cart.reduce((s, l) => s + l.lineTotal, 0),
    [cart, cartSummary]
  );

  const value: StoreContextType = {
    cart,
    cartSummary,
    cartLoading,
    wishlist,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    refreshCart,
    applyServerCart,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    clearWishlist,
    buyNow,
    getBuyNowItem,
    clearBuyNowItem,
    cartCount,
    cartSubtotal,
    wishlistCount: wishlist.length,
    toasts,
    showToast,
    removeToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}
