"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export interface FilterState {
  make?: string;
  model?: string;
  minYear?: string;
  maxYear?: string;
  categories?: string[];
  brands?: string[];
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  genuine?: boolean;
  onSale?: boolean;
  sort?: string;
  page?: string;
  view?: "grid" | "list";
  q?: string;
}

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: FilterState = {
    make: searchParams.get("make") || undefined,
    model: searchParams.get("model") || undefined,
    minYear: searchParams.get("minYear") || undefined,
    maxYear: searchParams.get("maxYear") || undefined,
    categories: searchParams.get("categories")?.split(",").filter(Boolean),
    brands: searchParams.get("brands")?.split(",").filter(Boolean),
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    inStock: searchParams.get("inStock") === "true",
    genuine: searchParams.get("genuine") === "true",
    onSale: searchParams.get("onSale") === "true",
    sort: searchParams.get("sort") || "popular",
    page: searchParams.get("page") || "1",
    view: (searchParams.get("view") as "grid" | "list") || "grid",
    q: searchParams.get("q") || undefined,
  };

  const updateFilter = useCallback(
    (newFilters: Partial<FilterState>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (typeof value === "boolean") {
          params.set(key, value ? "true" : "false");
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, String(value));
        }
      });

      // Reset to page 1 when filters change (except for page changes)
      if (!Object.keys(newFilters).includes("page")) {
        params.set("page", "1");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const clearFilters = useCallback(() => {
    router.push("?sort=popular&page=1&view=grid", { scroll: false });
  }, [router]);

  return { filters, updateFilter, clearFilters };
}
