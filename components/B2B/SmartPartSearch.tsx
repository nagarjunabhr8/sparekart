"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Mic, MapPin, TrendingUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchResult {
  type: "part" | "brand" | "vehicle" | "partNumber";
  value: string;
  label: string;
  count?: number;
}

interface VehicleFilters {
  make: string;
  model: string;
  year: string;
  partType: string;
}

const vehicleData = {
  makes: ["Maruti", "Honda", "Toyota", "Hyundai", "Tata", "Mahindra"],
  models: {
    Maruti: ["Swift", "Dzire", "Vitara Brezza", "Wagon R"],
    Honda: ["City", "Civic", "CR-V", "Jazz"],
    Toyota: ["Fortuner", "Innova", "Corolla", "Camry"],
    Hyundai: ["i10", "i20", "Creta", "Venue"],
    Tata: ["Nexon", "Harrier", "Safari", "Tiago"],
    Mahindra: ["XUV500", "Bolero", "Scorpio", "Xylo"],
  },
  years: Array.from({ length: 15 }, (_, i) => (2024 - i).toString()),
  partTypes: ["Engine Parts", "Brakes", "Electrical", "HVAC", "Cooling", "Suspension"],
};

export default function SmartPartSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [isVehicleMode, setIsVehicleMode] = useState(false);
  const [vehicleFilters, setVehicleFilters] = useState<VehicleFilters>({
    make: "",
    model: "",
    year: "",
    partType: "",
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/parts/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Search error:", error);
    }
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.trim()) {
      setIsOpen(true);
      debounceTimer.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    let searchTerm = result.value;

    // Add to recent searches
    const updated = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    setQuery(searchTerm);
    setIsOpen(false);
    setResults([]);

    // Update URL and trigger filtering
    router.push(`/catalog?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleVoiceSearch = async () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();

    setIsVoiceSearching(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSearch(transcript);
      setIsVoiceSearching(false);
    };

    recognition.onerror = () => {
      setIsVoiceSearching(false);
    };
  };

  const handleVehicleSearch = () => {
    if (!vehicleFilters.make || !vehicleFilters.year) {
      alert("Please select Make and Year");
      return;
    }

    const vehicleQuery = `${vehicleFilters.make} ${vehicleFilters.model || ""} ${vehicleFilters.year}`.trim();
    handleSelectResult({
      type: "vehicle",
      value: vehicleQuery,
      label: `Parts for ${vehicleQuery}`,
    });
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    searchInputRef.current?.focus();
    router.push("/catalog");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectResult(results[selectedIndex]);
        } else if (query.trim()) {
          handleSelectResult({
            type: "part",
            value: query,
            label: query,
          });
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div data-testid="smart-part-search" className="w-full space-y-4">
      {/* Search Mode Toggle */}
      <div className="flex gap-2">
        <button
          data-testid="smart-search-mode-parts"
          onClick={() => setIsVehicleMode(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !isVehicleMode
              ? "bg-primary text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          <Search size={18} className="inline mr-2" />
          Search Parts
        </button>
        <button
          data-testid="smart-search-mode-vehicle"
          onClick={() => setIsVehicleMode(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isVehicleMode
              ? "bg-primary text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          <MapPin size={18} className="inline mr-2" />
          By Vehicle
        </button>
      </div>

      {/* Search Input Mode */}
      {!isVehicleMode && (
        <div className="relative">
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
            <Search size={20} className="text-neutral-400 ml-3" />
            <input
              data-testid="smart-search-input"
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setIsOpen(true)}
              placeholder="Search parts by name, brand, part number, or vehicle..."
              className="flex-1 py-3 px-2 outline-none placeholder-neutral-400"
            />
            {query && (
              <button
                data-testid="smart-search-clear"
                onClick={handleClear}
                className="p-2 text-neutral-400 hover:text-neutral-600"
              >
                <X size={20} />
              </button>
            )}
            <button
              data-testid="smart-search-voice"
              onClick={handleVoiceSearch}
              disabled={isVoiceSearching}
              className={`p-2 mr-2 rounded-lg transition-colors ${
                isVoiceSearching
                  ? "bg-red-100 text-red-600"
                  : "text-neutral-400 hover:text-primary hover:bg-neutral-100"
              }`}
              title="Voice search"
            >
              <Mic size={20} />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div
              data-testid="smart-search-dropdown"
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
            >
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.value}`}
                      onClick={() => handleSelectResult(result)}
                      className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                        index === selectedIndex
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{result.label}</p>
                        <p className="text-xs text-neutral-500">
                          {result.type === "part" && "Part"}
                          {result.type === "brand" && "Brand"}
                          {result.type === "vehicle" && "Vehicle"}
                          {result.type === "partNumber" && "Part Number"}
                        </p>
                      </div>
                      {result.count && (
                        <span className="text-xs bg-neutral-100 px-2 py-1 rounded">
                          {result.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : null}

              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="border-t border-slate-200 py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-neutral-600 flex items-center gap-2">
                    <TrendingUp size={14} />
                    Recent Searches
                  </div>
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSelectResult({
                        type: "part",
                        value: search,
                        label: search,
                      })}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-sm text-neutral-700"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              )}

              {query && results.length === 0 && (
                <div className="px-4 py-6 text-center text-neutral-500 text-sm">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Vehicle Search Mode */}
      {isVehicleMode && (
        <div data-testid="smart-search-vehicle-form" className="bg-neutral-50 border border-slate-200 rounded-lg p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Make */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Vehicle Make *
              </label>
              <select
                data-testid="smart-search-vehicle-make"
                value={vehicleFilters.make}
                onChange={(e) =>
                  setVehicleFilters({
                    ...vehicleFilters,
                    make: e.target.value,
                    model: "",
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="">Select Make</option>
                {vehicleData.makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Model
              </label>
              <select
                data-testid="smart-search-vehicle-model"
                value={vehicleFilters.model}
                onChange={(e) =>
                  setVehicleFilters({
                    ...vehicleFilters,
                    model: e.target.value,
                  })
                }
                disabled={!vehicleFilters.make}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-neutral-100"
              >
                <option value="">Select Model</option>
                {vehicleFilters.make &&
                  vehicleData.models[vehicleFilters.make as keyof typeof vehicleData.models]?.map(
                    (model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    )
                  )}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Year *
              </label>
              <select
                data-testid="smart-search-vehicle-year"
                value={vehicleFilters.year}
                onChange={(e) =>
                  setVehicleFilters({
                    ...vehicleFilters,
                    year: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="">Select Year</option>
                {vehicleData.years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Part Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Part Type
              </label>
              <select
                data-testid="smart-search-vehicle-part-type"
                value={vehicleFilters.partType}
                onChange={(e) =>
                  setVehicleFilters({
                    ...vehicleFilters,
                    partType: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="">All Part Types</option>
                {vehicleData.partTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            data-testid="smart-search-vehicle-submit"
            onClick={handleVehicleSearch}
            className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Find Parts for My Vehicle
          </button>
        </div>
      )}
    </div>
  );
}
