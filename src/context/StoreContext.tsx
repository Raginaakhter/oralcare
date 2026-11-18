"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { products } from "@/lib/products";

export type CartItem = {
  product: Product;
  qty: number;
};

export type Order = {
  id: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    division: string;
    postcode?: string;
    notes?: string;
  };
  deliveryArea: "inside_dhaka" | "outside_dhaka";
  shippingFee: number;
  paymentMethod: "bkash" | "nagad" | "card" | "cod";
  paymentDetails?: {
    senderPhone?: string;
    trxId?: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  courierTracking?: string;
};

export type Toast = {
  id: number;
  message: string;
  type: "success" | "info" | "error";
};

interface StoreContextType {
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, qty?: number, openDrawer?: boolean) => void;
  removeFromCart: (slug: string) => void;
  updateCartQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (slug: string) => boolean;
  removeFromWishlist: (slug: string) => void;
  clearWishlist: () => void;
  buyNow: (product: Product, qty?: number) => void;
  placeOrder: (
    orderData: Omit<Order, "id" | "date" | "status" | "courierTracking">
  ) => Order;
  getOrderById: (id: string) => Order | undefined;
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: number) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function parsePriceNumber(priceStr: string): number {
  if (!priceStr) return 0;
  const num = parseFloat(priceStr.replace(/[^\d.]/g, ""));
  return isNaN(num) ? 0 : num;
}

export function formatPriceBDT(amount: number): string {
  return `৳${Math.round(amount).toLocaleString("en-US")}`;
}

const initialCartSeed: CartItem[] = [
  { product: products[0], qty: 1 },
  { product: products[10], qty: 2 },
];

const initialWishlistSeed: Product[] = [
  products[2],
  products[8],
  products[14],
];

const initialOrdersSeed: Order[] = [
  {
    id: "ORD-10285",
    date: "Nov 18, 2026",
    customer: {
      name: "Afsana Rahman",
      phone: "01712 345678",
      email: "afsana@example.com",
      address: "House 24, Road 7, Dhanmondi",
      city: "Dhaka",
      division: "Dhaka",
      postcode: "1205",
      notes: "Please call before delivery.",
    },
    deliveryArea: "inside_dhaka",
    shippingFee: 0,
    paymentMethod: "bkash",
    paymentDetails: {
      senderPhone: "01712345678",
      trxId: "TRX7X8C9D0",
    },
    items: [
      { product: products[0], qty: 1 },
      { product: products[10], qty: 2 },
    ],
    subtotal: 10447,
    discount: 1045,
    couponCode: "SMILE10",
    total: 9402,
    status: "processing",
    courierTracking: "SA-2026-10285",
  },
  {
    id: "ORD-10251",
    date: "Oct 22, 2026",
    customer: {
      name: "Afsana Rahman",
      phone: "01712 345678",
      email: "afsana@example.com",
      address: "House 24, Road 7, Dhanmondi",
      city: "Dhaka",
      division: "Dhaka",
      postcode: "1205",
    },
    deliveryArea: "inside_dhaka",
    shippingFee: 60,
    paymentMethod: "cod",
    items: [{ product: products[2], qty: 2 }],
    subtotal: 2298,
    discount: 0,
    total: 2358,
    status: "delivered",
    courierTracking: "SA-2026-10251",
  },
  {
    id: "ORD-10198",
    date: "Oct 05, 2026",
    customer: {
      name: "Afsana Rahman",
      phone: "01712 345678",
      address: "Road 12, Banani",
      city: "Dhaka",
      division: "Dhaka",
    },
    deliveryArea: "inside_dhaka",
    shippingFee: 60,
    paymentMethod: "bkash",
    paymentDetails: {
      trxId: "BK992811A",
    },
    items: [{ product: products[13], qty: 1 }],
    subtotal: 1099,
    discount: 0,
    total: 1159,
    status: "delivered",
    courierTracking: "SA-2026-10198",
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>(initialCartSeed);
  const [wishlist, setWishlist] = useState<Product[]>(initialWishlistSeed);
  const [orders, setOrders] = useState<Order[]>(initialOrdersSeed);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("oralcare_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem("oralcare_wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      const savedOrders = localStorage.getItem("oralcare_orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch {
      // ignore
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("oralcare_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, isHydrated]);

  // Sync wishlist to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("oralcare_wishlist", JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist, isHydrated]);

  // Sync orders to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("oralcare_orders", JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders, isHydrated]);

  const showToast = useCallback(
    (message: string, type: "success" | "info" | "error" = "success") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToCart = useCallback(
    (product: Product, qty = 1, openDrawer = true) => {
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.slug === product.slug
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            qty: updated[existingIndex].qty + qty,
          };
          return updated;
        }
        return [{ product, qty }, ...prev];
      });

      showToast(`Added "${product.name}" to cart!`, "success");
      if (openDrawer) {
        setIsCartOpen(true);
      }
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (slug: string) => {
      setCart((prev) => {
        const item = prev.find((i) => i.product.slug === slug);
        if (item) {
          showToast(`Removed "${item.product.name}" from cart`, "info");
        }
        return prev.filter((i) => i.product.slug !== slug);
      });
    },
    [showToast]
  );

  const updateCartQty = useCallback((slug: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.product.slug !== slug));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.slug === slug ? { ...item, qty } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast("Cart cleared", "info");
  }, [showToast]);

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlist((prev) => {
        const exists = prev.some((p) => p.slug === product.slug);
        if (exists) {
          showToast(`Removed "${product.name}" from wishlist`, "info");
          return prev.filter((p) => p.slug !== product.slug);
        } else {
          showToast(`Added "${product.name}" to wishlist`, "success");
          return [product, ...prev];
        }
      });
    },
    [showToast]
  );

  const isInWishlist = useCallback(
    (slug: string) => wishlist.some((p) => p.slug === slug),
    [wishlist]
  );

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
    (product: Product, qty = 1) => {
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.slug === product.slug
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            qty: Math.max(updated[existingIndex].qty, qty),
          };
          return updated;
        }
        return [{ product, qty }, ...prev];
      });
      setIsCartOpen(false);
      router.push("/checkout");
    },
    [router]
  );

  const placeOrder = useCallback(
    (orderData: Omit<Order, "id" | "date" | "status" | "courierTracking">): Order => {
      const id = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const date = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const newOrder: Order = {
        ...orderData,
        id,
        date,
        status: "processing",
        courierTracking: `SA-2026-${id.split("-")[1]}`,
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);
      setIsCartOpen(false);
      showToast(`Order #${id} placed successfully!`, "success");
      return newOrder;
    },
    [showToast]
  );

  const getOrderById = useCallback(
    (id: string) => orders.find((o) => o.id.toLowerCase() === id.toLowerCase()),
    [orders]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + parsePriceNumber(item.product.price) * item.qty,
        0
      ),
    [cart]
  );

  const wishlistCount = wishlist.length;

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        buyNow,
        placeOrder,
        getOrderById,
        cartCount,
        cartSubtotal,
        wishlistCount,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
