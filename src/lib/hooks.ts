"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { errorMessage, shippingApi, type ShippingMethodsResult } from "@/lib/api";

/**
 * When false, every useAsync below it waits instead of fetching. Lets a gate (e.g. the
 * admin's sign-in check) keep a page rendered but idle until access is confirmed.
 */
export const FetchGate = createContext(true);

export interface AsyncState<T> {
  data: T | undefined;
  error: string | null;
  loading: boolean;
  reload: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
}

/**
 * Runs `fn` on mount and whenever `deps` change; exposes data/error/loading and a reload().
 * Pass `enabled: false` to wait (e.g. until auth has settled).
 */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: React.DependencyList,
  enabledProp = true
): AsyncState<T> {
  const gateOpen = useContext(FetchGate);
  const enabled = enabledProp && gateOpen;
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const fnRef = useRef(fn);
  // Keep the latest closure without re-running; declared before the run effect so it applies first.
  useEffect(() => {
    fnRef.current = fn;
  });
  const callId = useRef(0);

  const run = useCallback(async () => {
    const id = ++callId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fnRef.current();
      if (id === callId.current) setData(result);
    } catch (err) {
      if (id === callId.current) setError(errorMessage(err));
    } finally {
      if (id === callId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching: loading state is set as the request starts
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, run, ...deps]);

  return { data, error, loading: enabled ? loading : true, reload: run, setData };
}

let shippingCache: Promise<ShippingMethodsResult | null> | null = null;

/** GET /shipping/methods, fetched once per page load and shared. */
export function useShippingMethods(): ShippingMethodsResult | null {
  const [value, setValue] = useState<ShippingMethodsResult | null>(null);
  useEffect(() => {
    if (!shippingCache) {
      shippingCache = shippingApi.methods().catch(() => {
        shippingCache = null;
        return null;
      });
    }
    let alive = true;
    void shippingCache.then((v) => alive && setValue(v));
    return () => {
      alive = false;
    };
  }, []);
  return value;
}
