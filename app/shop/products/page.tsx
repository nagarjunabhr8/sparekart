"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { mockProducts } from "@/lib/mockData";
import ShopProductCard from "@/components/shop/ShopProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();

  const brand = searchParams.get("brand") ?? "";
  const model = searchParams.get("model") ?? "";
  const year = searchParams.get("year") ?? "";
  const fuel = searchParams.get("fuel") ?? "";
  const category = searchParams.get("category") ?? "";

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      // brand from the finder maps to the vehicle make in the catalog data.
      if (brand && p.make !== brand) return false;
      if (model && !p.model.toLowerCase().includes(model.toLowerCase())) {
        return false;
      }
      if (year && p.year !== year) return false;
      if (category && p.category !== category) return false;
      // NOTE: fuel type is captured for display only — the catalog data has no
      // fuel field yet, so it is shown as an active filter but not applied.
      return true;
    });
  }, [brand, model, year, category]);

  const activeFilters = [
    { label: "Brand", value: brand },
    { label: "Model", value: model },
    { label: "Year", value: year },
    { label: "Fuel", value: fuel },
    { label: "Category", value: category },
  ].filter((f) => f.value);

  return (
    <div data-testid="shop-products-page" className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-app py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                Matching Parts
              </h1>
              <p
                data-testid="shop-products-count"
                className="text-neutral-600 text-sm mt-1"
              >
                {filtered.length} part{filtered.length === 1 ? "" : "s"} found
              </p>
            </div>
            <Link
              data-testid="shop-products-refine-link"
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors self-start"
            >
              <SlidersHorizontal size={16} />
              Refine Search
            </Link>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div
              data-testid="shop-products-active-filters"
              className="flex flex-wrap gap-2 mt-4"
            >
              {activeFilters.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-primary rounded-full text-xs font-medium"
                >
                  <span className="text-neutral-500">{f.label}:</span>
                  {f.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container-app py-8">
        {filtered.length === 0 ? (
          <div data-testid="shop-products-empty" className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              No matching parts found
            </h2>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              We couldn&apos;t find parts for this exact combination. Try widening
              your search — for example, removing the model or year.
            </p>
            <Link
              href="/shop"
              className="inline-block btn-primary bg-primary hover:bg-orange-700 px-6 py-2"
            >
              Back to Search
            </Link>
          </div>
        ) : (
          <div
            data-testid="shop-products-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filtered.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-neutral-500">Loading parts…</div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
