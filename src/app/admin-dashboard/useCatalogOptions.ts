"use client";

import { brandsApi, categoriesApi, type Brand, type Category } from "@/lib/api";
import { useAsync } from "@/lib/hooks";

/** Every category and brand (incl. inactive) for admin selects and filters. */
export function useCatalogOptions() {
  const cats = useAsync(() => categoriesApi.list({ limit: 100 }), []);
  const brands = useAsync(() => brandsApi.list({ limit: 100 }), []);
  return {
    categories: (cats.data?.items ?? []) as Category[],
    brands: (brands.data?.items ?? []) as Brand[],
    loading: cats.loading || brands.loading,
    reload: () => {
      void cats.reload();
      void brands.reload();
    },
  };
}
