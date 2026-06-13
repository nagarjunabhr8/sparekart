"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import {
  shopProducts,
  PART_CATEGORIES,
  PRICE_MIN,
  PRICE_MAX,
  type ShopProduct,
} from "@/lib/shopProducts";
import { CAR_BRANDS, FUEL_TYPES } from "@/lib/shopData";
import BrowseProductCard from "@/components/shop/BrowseProductCard";

const PER_PAGE = 10;

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
];

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Keep a live ref so debounced/async updates read the latest params.
  const spRef = useRef(searchParams);
  spRef.current = searchParams;

  const getList = (name: string) =>
    searchParams.get(name)?.split(",").filter(Boolean) ?? [];

  const brands = getList("brand");
  const categories = getList("category");
  const fuels = getList("fuel");
  const model = searchParams.get("model") ?? "";
  const year = searchParams.get("year") ?? "";
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "relevance";
  const ratingMin = Number(searchParams.get("rating") ?? "0");
  const inStockOnly = searchParams.get("inStock") === "1";
  const minPrice = Number(searchParams.get("minPrice") ?? PRICE_MIN);
  const maxPrice = Number(searchParams.get("maxPrice") ?? PRICE_MAX);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  // Update params; resets to page 1 unless the patch itself sets `page`.
  const updateParams = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(Array.from(spRef.current.entries()));
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    });
    if (!("page" in patch)) params.delete("page");
    router.replace(`/shop/products?${params.toString()}`, { scroll: false });
  };

  const toggleInList = (name: string, value: string) => {
    const current = spRef.current.get(name)?.split(",").filter(Boolean) ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParams({ [name]: next.join(",") || null });
  };

  // --- Local UI state synced from URL ---
  const [searchInput, setSearchInput] = useState(search);
  const [priceLo, setPriceLo] = useState(minPrice);
  const [priceHi, setPriceHi] = useState(maxPrice);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => setSearchInput(search), [search]);
  useEffect(() => setPriceLo(minPrice), [minPrice]);
  useEffect(() => setPriceHi(maxPrice), [maxPrice]);

  // Debounce the free-text search into the URL.
  useEffect(() => {
    if (searchInput === search) return;
    const t = setTimeout(() => updateParams({ search: searchInput || null }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // --- Filter + sort ---
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = shopProducts.filter((p) => {
      if (q) {
        const hit =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (brands.length && !brands.includes(p.make)) return false;
      if (categories.length && !categories.includes(p.category)) return false;
      if (fuels.length && !fuels.includes(p.fuel)) return false;
      if (model && !p.model.toLowerCase().includes(model.toLowerCase())) return false;
      if (year && p.year !== year) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (ratingMin && p.rating < ratingMin) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list = [...list].sort((a, b) => Number(b.id) - Number(a.id));
        break;
    }
    return list;
  }, [
    search,
    brands.join(","),
    categories.join(","),
    fuels.join(","),
    model,
    year,
    minPrice,
    maxPrice,
    ratingMin,
    inStockOnly,
    sort,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const activeCount =
    brands.length +
    categories.length +
    fuels.length +
    (ratingMin ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (search ? 1 : 0) +
    (minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX ? 1 : 0) +
    (model ? 1 : 0) +
    (year ? 1 : 0);

  const clearAll = () => {
    setSearchInput("");
    router.replace("/shop/products", { scroll: false });
  };

  const commitPrice = () => {
    const lo = Math.min(priceLo, priceHi);
    const hi = Math.max(priceLo, priceHi);
    updateParams({
      minPrice: lo === PRICE_MIN ? null : String(lo),
      maxPrice: hi === PRICE_MAX ? null : String(hi),
    });
  };

  // --- Filter UI (shared between sidebar + mobile drawer) ---
  const FilterControls = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <input
          data-testid="shop-products-search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by part name or brand..."
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      <CheckboxGroup
        title="Brand"
        name="brand"
        options={CAR_BRANDS}
        selected={brands}
        onToggle={toggleInList}
      />
      <CheckboxGroup
        title="Category"
        name="category"
        options={PART_CATEGORIES}
        selected={categories}
        onToggle={toggleInList}
      />
      <CheckboxGroup
        title="Fuel Type"
        name="fuel"
        options={FUEL_TYPES}
        selected={fuels}
        onToggle={toggleInList}
      />

      {/* Price range */}
      <div>
        <p className="text-sm font-semibold text-neutral-800 mb-3">Price Range</p>
        <div className="dual-range relative h-1.5 bg-neutral-200 rounded mb-3">
          <div
            className="absolute h-1.5 bg-primary rounded"
            style={{
              left: `${(priceLo / PRICE_MAX) * 100}%`,
              right: `${100 - (priceHi / PRICE_MAX) * 100}%`,
            }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={500}
            value={priceLo}
            onChange={(e) =>
              setPriceLo(Math.min(Number(e.target.value), priceHi))
            }
            onMouseUp={commitPrice}
            onTouchEnd={commitPrice}
            className="dual-range-input"
            aria-label="Minimum price"
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={500}
            value={priceHi}
            onChange={(e) =>
              setPriceHi(Math.max(Number(e.target.value), priceLo))
            }
            onMouseUp={commitPrice}
            onTouchEnd={commitPrice}
            className="dual-range-input"
            aria-label="Maximum price"
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-600">
          <span>₹{priceLo.toLocaleString("en-IN")}</span>
          <span>₹{priceHi.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-sm font-semibold text-neutral-800 mb-2">Rating</p>
        <div className="space-y-1">
          {[4, 3, 2].map((r) => (
            <button
              data-testid={`shop-products-rating-${r}`}
              key={r}
              onClick={() =>
                updateParams({ rating: ratingMin === r ? null : String(r) })
              }
              className={`block w-full text-left px-2 py-1 rounded text-sm ${
                ratingMin === r
                  ? "bg-orange-50 text-primary font-medium"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {"★".repeat(r)}
              <span className="text-neutral-400">{"★".repeat(5 - r)}</span> &amp; up
            </button>
          ))}
        </div>
      </div>

      {/* In stock toggle */}
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-semibold text-neutral-800">In Stock only</span>
        <span className="relative inline-flex items-center">
          <input
            data-testid="shop-products-instock"
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) =>
              updateParams({ inStock: e.target.checked ? "1" : null })
            }
            className="sr-only peer"
          />
          <span className="w-10 h-5 bg-neutral-300 rounded-full peer-checked:bg-primary transition-colors" />
          <span className="absolute left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
        </span>
      </label>

      <button
        data-testid="shop-products-clear-filters"
        onClick={clearAll}
        className="w-full py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="container-app py-8">
      <style>{`
        .dual-range-input{position:absolute;top:50%;left:0;width:100%;height:0;-webkit-appearance:none;appearance:none;background:transparent;pointer-events:none;transform:translateY(-50%);}
        .dual-range-input::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;pointer-events:auto;width:16px;height:16px;border-radius:50%;background:#FF6B35;border:2px solid #fff;box-shadow:0 0 0 1px #cbd5e1;cursor:pointer;}
        .dual-range-input::-moz-range-thumb{pointer-events:auto;width:16px;height:16px;border-radius:50%;background:#FF6B35;border:2px solid #fff;cursor:pointer;}
      `}</style>

      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
        Browse Parts
      </h1>

      <div className="flex gap-8">
        {/* SIDEBAR (desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 card p-5">
            <FilterControls />
          </div>
        </aside>

        {/* GRID */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <p data-testid="shop-products-count" className="text-sm text-neutral-600">
              Showing <span className="font-semibold">{filtered.length}</span>{" "}
              result{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-2">
              <button
                data-testid="shop-products-filters-toggle"
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-lg text-sm font-medium"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeCount > 0 && (
                  <span className="ml-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>
              <select
                data-testid="shop-products-sort"
                value={sort}
                onChange={(e) =>
                  updateParams({
                    sort: e.target.value === "relevance" ? null : e.target.value,
                  })
                }
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div
              data-testid="shop-products-empty"
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">
                No parts found
              </h2>
              <p className="text-neutral-600 mb-6">
                Try widening your filters or clearing them.
              </p>
              <button
                onClick={clearAll}
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-orange-700"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div
                data-testid="shop-products-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {pageItems.map((product: ShopProduct) => (
                  <BrowseProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div
                  data-testid="shop-products-pagination"
                  className="flex items-center justify-center gap-1 mt-10"
                >
                  <button
                    onClick={() =>
                      updateParams({ page: String(Math.max(1, currentPage - 1)) })
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-neutral-300 rounded-lg text-sm disabled:opacity-50 hover:bg-neutral-50"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      data-testid={`shop-products-page-${p}`}
                      key={p}
                      onClick={() => updateParams({ page: String(p) })}
                      className={`w-10 py-2 rounded-lg text-sm font-medium ${
                        p === currentPage
                          ? "bg-primary text-white"
                          : "border border-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      updateParams({
                        page: String(Math.min(totalPages, currentPage + 1)),
                      })
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-neutral-300 rounded-lg text-sm disabled:opacity-50 hover:bg-neutral-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            data-testid="shop-products-filter-drawer"
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <FilterControls />
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full mt-4 py-3 bg-primary text-white rounded-lg font-semibold"
            >
              Show {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckboxGroup({
  title,
  name,
  options,
  selected,
  onToggle,
}: {
  title: string;
  name: string;
  options: string[];
  selected: string[];
  onToggle: (name: string, value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-neutral-800 mb-2">{title}</p>
      <div className="space-y-1.5 max-h-48 overflow-auto pr-1">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer"
          >
            <input
              data-testid={`shop-products-${name}-${opt.toLowerCase().replace(/\s+/g, "-")}`}
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(name, opt)}
              className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function ShopProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container-app py-16 text-center text-neutral-500">
          Loading parts…
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
