"use client";

import { useState, useMemo } from "react";
import { Metadata } from "next";
import { Menu, Grid3x3, List, ShoppingCart } from "lucide-react";
import { useFilters } from "@/lib/useFilters";
import { mockProducts } from "@/lib/mockData";
import FilterPanel from "@/components/B2B/FilterPanel";
import ProductCard from "@/components/B2B/ProductCard";
import SmartPartSearch from "@/components/B2B/SmartPartSearch";
import { ProductCardSkeleton, ProductListSkeleton } from "@/components/B2B/ProductSkeleton";
import BulkOrderForm from "@/components/B2B/BulkOrderForm";

const ITEMS_PER_PAGE = 12;

function filterAndSortProducts(filters: any) {
  let results = [...mockProducts];

  // Apply search query
  if (filters.q) {
    const query = filters.q.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.make.toLowerCase().includes(query) ||
        p.model.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.make) {
    results = results.filter((p) => p.make === filters.make);
  }
  if (filters.model) {
    results = results.filter((p) => p.model === filters.model);
  }
  if (filters.minYear) {
    results = results.filter((p) => parseInt(p.year) >= parseInt(filters.minYear));
  }
  if (filters.maxYear) {
    results = results.filter((p) => parseInt(p.year) <= parseInt(filters.maxYear));
  }
  if (filters.categories && filters.categories.length > 0) {
    results = results.filter((p) => filters.categories.includes(p.category));
  }
  if (filters.minPrice) {
    results = results.filter((p) => p.price >= parseInt(filters.minPrice));
  }
  if (filters.maxPrice) {
    results = results.filter((p) => p.price <= parseInt(filters.maxPrice));
  }
  if (filters.inStock) {
    results = results.filter((p) => p.inStock);
  }
  if (filters.genuine) {
    results = results.filter((p) => p.genuine);
  }

  // Sort
  switch (filters.sort) {
    case "price-low":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      results.sort((a, b) => b.price - a.price);
      break;
    case "discount":
      results.sort((a, b) => b.discount - a.discount);
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "popular":
    default:
      results.sort((a, b) => b.reviews - a.reviews);
      break;
  }

  return results;
}

export default function CatalogPage() {
  const { filters, updateFilter } = useFilters();
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [bulkOrderOpen, setBulkOrderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const allFilteredProducts = useMemo(
    () => filterAndSortProducts(filters),
    [filters]
  );

  const currentPage = parseInt(filters.page || "1");
  const totalPages = Math.ceil(allFilteredProducts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentProducts = allFilteredProducts.slice(startIdx, endIdx);

  const handleViewChange = (view: "grid" | "list") => {
    updateFilter({ view });
  };

  const handleSortChange = (sort: string) => {
    updateFilter({ sort });
  };

  const handlePageChange = (page: number) => {
    updateFilter({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-app py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Spare Parts Catalog</h1>
              <p className="text-neutral-600 text-sm mt-1">
                {allFilteredProducts.length} parts found
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setBulkOrderOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-900 transition-colors"
              >
                <ShoppingCart size={18} />
                Bulk Order
              </button>
              <button
                onClick={() => setFilterPanelOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Menu size={18} />
                Filters
              </button>
            </div>
          </div>

          {/* Smart Search Bar */}
          <SmartPartSearch />
        </div>
      </div>

      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container-app py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left: Results count */}
            <div className="text-sm text-neutral-600">
              Showing <span className="font-semibold">{startIdx + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(endIdx, allFilteredProducts.length)}</span> of{" "}
              <span className="font-semibold">{allFilteredProducts.length}</span> results
            </div>

            {/* Right: Sort and View */}
            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={filters.sort || "popular"}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Top Rated</option>
              </select>

              {/* View Toggle */}
              <div className="flex gap-1 bg-slate-200 rounded-lg p-1">
                <button
                  onClick={() => handleViewChange("grid")}
                  className={`p-2 rounded transition-colors ${
                    filters.view === "list" || !filters.view
                      ? "text-neutral-600"
                      : "bg-white text-primary shadow-sm"
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => handleViewChange("list")}
                  className={`p-2 rounded transition-colors ${
                    filters.view === "list"
                      ? "bg-white text-primary shadow-sm"
                      : "text-neutral-600"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-app py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterPanel isOpen={filterPanelOpen} onClose={() => setFilterPanelOpen(false)} />

          {/* Products Grid */}
          <div className="flex-1">
            {allFilteredProducts.length === 0 ? (
              // Empty State
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  No parts found
                </h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search criteria. We have over 50,000 genuine
                  parts available.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Products */}
                <div
                  className={`grid gap-4 ${
                    filters.view === "list"
                      ? "grid-cols-1"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {isLoading
                    ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) =>
                        filters.view === "list" ? (
                          <ProductListSkeleton key={i} />
                        ) : (
                          <ProductCardSkeleton key={i} />
                        )
                      )
                    : currentProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          view={filters.view as "grid" | "list"}
                        />
                      ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-sm text-neutral-600 mb-4 sm:mb-0">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === 1 ||
                              page === totalPages ||
                              Math.abs(page - currentPage) <= 1
                          )
                          .map((page, idx, arr) => (
                            <div key={page}>
                              {idx > 0 && arr[idx - 1] !== page - 1 && (
                                <span className="px-2 py-2 text-neutral-600">...</span>
                              )}
                              <button
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                  currentPage === page
                                    ? "bg-primary text-white"
                                    : "border border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                {page}
                              </button>
                            </div>
                          ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Order Form Modal */}
      <BulkOrderForm
        isOpen={bulkOrderOpen}
        onClose={() => setBulkOrderOpen(false)}
        userPlan="Professional"
        userEmail="user@sparekart.com"
        userGST="18AABCU1234F1Z5"
      />
    </div>
  );
}
