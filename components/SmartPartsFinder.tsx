"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Search } from "lucide-react";
import { brandModels } from "@/lib/shopData";

interface SearchFilters {
  brand: string;
  model: string;
  year: string;
  fuelType: string;
  partCategory: string;
}

export default function SmartPartsFinder() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    brand: "",
    model: "",
    year: "",
    fuelType: "",
    partCategory: "",
  });

  const carBrands = Object.keys(brandModels);
  const years = Array.from({ length: 20 }, (_, i) => 2024 - i);
  const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];
  const partCategories = [
    "Engine Parts",
    "Brakes",
    "Suspension",
    "Electrical",
    "Cooling",
    "Body Parts",
    "Filters",
    "Clutch",
  ];

  // Model suggestions filtered by the selected brand and current input text.
  const modelSuggestions = filters.brand
    ? (brandModels[filters.brand] ?? []).filter((model) =>
        model.toLowerCase().includes(filters.model.toLowerCase())
      )
    : [];

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: string
  ) => {
    setFilters((prev) => {
      // Reset the model when the brand changes so stale models don't linger.
      if (key === "brand") {
        return { ...prev, brand: value, model: "" };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!filters.brand || !filters.partCategory) {
      toast.error("Please select at least Car Brand and Part Category");
      return;
    }

    const params = new URLSearchParams();
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.model) params.set("model", filters.model);
    if (filters.year) params.set("year", filters.year);
    if (filters.fuelType) params.set("fuel", filters.fuelType);
    if (filters.partCategory) params.set("category", filters.partCategory);

    router.push(`/shop/products?${params.toString()}`);
  };

  return (
    <section data-testid="b2c-parts-finder" className="bg-white py-12 md:py-16 border-b border-neutral-200">
      <Toaster position="top-center" />
      <div className="container-app">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Find Your Perfect Part
          </h2>
          <p className="text-neutral-600">
            Filter by your vehicle details for exact compatibility
          </p>
        </div>

        <form data-testid="b2c-parts-finder-form" onSubmit={handleSearch} className="card p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Car Brand
              </label>
              <select
                data-testid="b2c-finder-brand"
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Brand</option>
                {carBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Model
              </label>
              <input
                data-testid="b2c-finder-model"
                type="text"
                list="b2c-finder-model-options"
                placeholder="e.g., Swift, Creta"
                value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <datalist id="b2c-finder-model-options">
                {modelSuggestions.map((model) => (
                  <option key={model} value={model} />
                ))}
              </datalist>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Year
              </label>
              <select
                data-testid="b2c-finder-year"
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Fuel Type
              </label>
              <select
                data-testid="b2c-finder-fuel-type"
                value={filters.fuelType}
                onChange={(e) => handleFilterChange("fuelType", e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Type</option>
                {fuelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Part Category */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Part Category
              </label>
              <select
                data-testid="b2c-finder-category"
                value={filters.partCategory}
                onChange={(e) =>
                  handleFilterChange("partCategory", e.target.value)
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Category</option>
                {partCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            data-testid="b2c-finder-submit"
            type="submit"
            className="w-full btn-primary bg-primary hover:bg-orange-700 flex items-center justify-center gap-2 py-3"
          >
            <Search size={18} />
            Search Parts
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <p className="text-neutral-600">Genuine Parts in Stock</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <p className="text-neutral-600">Authenticity Verified</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24-48h</div>
            <p className="text-neutral-600">Delivery to Your City</p>
          </div>
        </div>
      </div>
    </section>
  );
}
