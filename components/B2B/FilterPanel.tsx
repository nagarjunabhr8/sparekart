"use client";

import { useState, useMemo } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { useFilters } from "@/lib/useFilters";
import { carMakes, models, categories, years, mockProducts } from "@/lib/mockData";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const brands = ["Bosch", "Mann", "Brembo", "NGK", "Exide", "Valeo", "Bilstein", "Monroe"];

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const { filters, updateFilter, clearFilters } = useFilters();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    make: true,
    model: true,
    year: true,
    category: true,
    brand: false,
    price: true,
    toggles: true,
  });
  const [searchBrand, setSearchBrand] = useState("");

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat] = mockProducts.filter((p) => p.category === cat).length;
    });
    return counts;
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const selectedModels = filters.make ? models[filters.make as keyof typeof models] || [] : [];

  const filteredBrands = useMemo(() => {
    return brands.filter((b) => b.toLowerCase().includes(searchBrand.toLowerCase()));
  }, [searchBrand]);

  const activeFilterCount = [
    filters.make,
    filters.model,
    filters.minYear || filters.maxYear,
    (filters.categories && filters.categories.length > 0),
    (filters.brands && filters.brands.length > 0),
    filters.minPrice || filters.maxPrice,
    filters.inStock,
    filters.genuine,
    filters.onSale,
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Filter Panel */}
      <div
        data-testid="filter-panel"
        className={`fixed md:relative z-50 md:z-auto left-0 top-0 w-80 max-w-[95vw] h-screen md:h-auto bg-white border-r border-slate-200 transform transition-transform duration-300 md:translate-x-0 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 md:p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-neutral-900">Filters</h3>
            {activeFilterCount > 0 && (
              <p data-testid="filter-active-count" className="text-xs text-neutral-600 mt-1">
                {activeFilterCount} active filter{activeFilterCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            data-testid="filter-close-button"
            onClick={onClose}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Clear All */}
          {activeFilterCount > 0 && (
            <button
              data-testid="filter-clear-all-button"
              onClick={clearFilters}
              className="w-full py-2 text-center text-primary font-semibold hover:text-blue-900 transition-colors border border-primary rounded-lg"
            >
              Clear All Filters
            </button>
          )}

          {/* Car Make */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleSection("make")}
              className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
            >
              <span className="font-semibold text-neutral-900">Car Make</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${expandedSections.make ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.make && (
              <select
                data-testid="filter-make-select"
                value={filters.make || ""}
                onChange={(e) =>
                  updateFilter({ make: e.target.value || undefined, model: undefined })
                }
                className="w-full mt-3 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Makes</option>
                {carMakes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Model */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleSection("model")}
              className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
            >
              <span className="font-semibold text-neutral-900">Model</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${expandedSections.model ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.model && (
              <select
                data-testid="filter-model-select"
                value={filters.model || ""}
                onChange={(e) => updateFilter({ model: e.target.value || undefined })}
                disabled={!filters.make}
                className="w-full mt-3 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100 disabled:text-neutral-500"
              >
                <option value="">All Models</option>
                {selectedModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Year Range */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleSection("year")}
              className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
            >
              <span className="font-semibold text-neutral-900">Year (2005-2025)</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${expandedSections.year ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.year && (
              <div className="mt-3 space-y-2">
                <select
                  data-testid="filter-min-year-select"
                  value={filters.minYear || ""}
                  onChange={(e) => updateFilter({ minYear: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="">From Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  data-testid="filter-max-year-select"
                  value={filters.maxYear || ""}
                  onChange={(e) => updateFilter({ maxYear: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="">To Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleSection("category")}
              className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
            >
              <span className="font-semibold text-neutral-900">Category</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${expandedSections.category ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.category && (
              <div className="mt-3 space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input
                      data-testid={`filter-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                      type="checkbox"
                      checked={filters.categories?.includes(cat) || false}
                      onChange={(e) => {
                        const newCategories = filters.categories || [];
                        const updated = e.target.checked
                          ? [...newCategories, cat]
                          : newCategories.filter((c) => c !== cat);
                        updateFilter({ categories: updated.length > 0 ? updated : undefined });
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-neutral-700">
                      {cat} <span className="text-xs text-neutral-500">({categoryCounts[cat] || 0})</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brand */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleSection("brand")}
              className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
            >
              <span className="font-semibold text-neutral-900">Brand</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${expandedSections.brand ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.brand && (
              <div className="mt-3 space-y-3">
                {/* Brand Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-2 top-2.5 text-neutral-400" />
                  <input
                    data-testid="filter-brand-search"
                    type="text"
                    placeholder="Search brands..."
                    value={searchBrand}
                    onChange={(e) => setSearchBrand(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                {/* Brand Checkboxes */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredBrands.length > 0 ? (
                    filteredBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer">
                        <input
                          data-testid={`filter-brand-${brand.toLowerCase()}`}
                          type="checkbox"
                          checked={filters.brands?.includes(brand) || false}
                          onChange={(e) => {
                            const newBrands = filters.brands || [];
                            const updated = e.target.checked
                              ? [...newBrands, brand]
                              : newBrands.filter((b) => b !== brand);
                            updateFilter({ brands: updated.length > 0 ? updated : undefined });
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-neutral-700">{brand}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-500">No brands found</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleSection("price")}
              className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
            >
              <span className="font-semibold text-neutral-900">Price Range (₹)</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${expandedSections.price ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.price && (
              <div className="mt-3 space-y-2">
                <input
                  data-testid="filter-min-price"
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice || ""}
                  onChange={(e) => updateFilter({ minPrice: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <input
                  data-testid="filter-max-price"
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice || ""}
                  onChange={(e) => updateFilter({ maxPrice: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            )}
          </div>

          {/* Availability & Authenticity */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleSection("toggles")}
              className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
            >
              <span className="font-semibold text-neutral-900">More Options</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${expandedSections.toggles ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.toggles && (
              <div className="mt-3 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    data-testid="filter-in-stock-only"
                    type="checkbox"
                    checked={filters.inStock || false}
                    onChange={(e) => updateFilter({ inStock: e.target.checked ? true : undefined })}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-neutral-700">In Stock Only</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    data-testid="filter-genuine-only"
                    type="checkbox"
                    checked={filters.genuine || false}
                    onChange={(e) => updateFilter({ genuine: e.target.checked ? true : undefined })}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-neutral-700">Genuine Parts Only</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    data-testid="filter-on-sale"
                    type="checkbox"
                    checked={filters.onSale || false}
                    onChange={(e) => updateFilter({ onSale: e.target.checked ? true : undefined })}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-neutral-700">On Sale</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
