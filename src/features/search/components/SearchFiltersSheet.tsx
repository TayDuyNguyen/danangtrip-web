"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { IoStar } from "@/components/icons/solar";
import { SearchFilters } from "../types/search.types";
import { cn } from "@/utils/string";
import { Select } from "@/components/ui/Select";
import { useSearchFilterCategories } from "../hooks/use-search-filter-categories";
import { useLocationDistricts } from "@/features/locations/hooks/use-locations";
import { formatInputPrice, parseInputPrice } from "@/utils/format";

interface SearchFiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
  searchType?: "all" | "tour" | "location";
}

export const SearchFiltersSheet = ({
  isOpen,
  onClose,
  initialFilters,
  onApply,
  searchType = "all",
}: SearchFiltersSheetProps) => {
  const t = useTranslations("search");
  const [localFilters, setLocalFilters] = useState<SearchFilters>(initialFilters);
  const [minPriceInput, setMinPriceInput] = useState(
    initialFilters.minPrice !== undefined ? formatInputPrice(initialFilters.minPrice) : ""
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    initialFilters.maxPrice !== undefined ? formatInputPrice(initialFilters.maxPrice) : ""
  );
  const isComposingMinRef = useRef(false);
  const isComposingMaxRef = useRef(false);

  const { data: categoryData, isLoading: isLoadingCats } = useSearchFilterCategories(searchType, isOpen);
  const { data: districts = [], isLoading: isLoadingDists } = useLocationDistricts();
  const locationCategories = categoryData?.locationCategories ?? [];
  const tourCategories = categoryData?.tourCategories ?? [];
  const selectedLocCat = searchType === "location" ? localFilters.category : localFilters.locationCategory;
  const selectedTourCat = searchType === "tour" ? localFilters.category : localFilters.tourCategory;

  useEffect(() => {
    setLocalFilters(initialFilters);
    setMinPriceInput(
      initialFilters.minPrice !== undefined ? formatInputPrice(initialFilters.minPrice) : ""
    );
    setMaxPriceInput(
      initialFilters.maxPrice !== undefined ? formatInputPrice(initialFilters.maxPrice) : ""
    );
  }, [initialFilters]);

  const updatePriceFilter = (key: "minPrice" | "maxPrice", rawValue: string) => {
    const numericValue = parseInputPrice(rawValue);
    setLocalFilters((prev) => ({
      ...prev,
      [key]: numericValue,
    }));
  };

  const handlePriceChange = (key: "minPrice" | "maxPrice", rawValue: string, isComposing: boolean) => {
    const digitsOnly = rawValue.replace(/\D/g, "");
    const nextInput = isComposing ? rawValue : digitsOnly ? formatInputPrice(Number(digitsOnly)) : "";

    if (key === "minPrice") {
      setMinPriceInput(nextInput);
    } else {
      setMaxPriceInput(nextInput);
    }

    updatePriceFilter(key, digitsOnly);
  };

  const handlePriceCompositionEnd = (key: "minPrice" | "maxPrice", rawValue: string) => {
    const digitsOnly = rawValue.replace(/\D/g, "");
    const formatted = digitsOnly ? formatInputPrice(Number(digitsOnly)) : "";

    if (key === "minPrice") {
      isComposingMinRef.current = false;
      setMinPriceInput(formatted);
    } else {
      isComposingMaxRef.current = false;
      setMaxPriceInput(formatted);
    }

    updatePriceFilter(key, digitsOnly);
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      category: undefined,
      district: undefined,
    });
    setMinPriceInput("");
    setMaxPriceInput("");
  };

  if (!isOpen) return null;

  return (
    /* Stitch Screen 2: fixed overlay + centered glass dialog */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      {/* Backdrop click to close */}
      <button
        aria-label={t("filters.close")}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />

      {/* Dialog panel */}
      <div
        className="gradient-shell rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 relative z-10"
        style={{
          backgroundColor: "rgba(19, 19, 19, 0.95)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#50453e]/30 flex justify-between items-center">
          <h2 className="text-lg font-light text-[#e5e2e1] tracking-wide">
            {t("filters.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-[#737373] hover:text-[#e5e2e1] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="filter-sheet-scrollbar flex-1 overflow-y-auto p-6 space-y-7">

          {/* Location categories */}
          {(searchType === "location" || searchType === "all") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[#e7bea6] text-[11px] font-semibold uppercase tracking-widest">
                  {searchType === "all" ? t("filters.location_category") : t("filters.category")}
                </h3>
                {selectedLocCat !== undefined && (
                  <button
                    onClick={() =>
                      setLocalFilters((p) => ({
                        ...p,
                        category: searchType === "location" ? undefined : p.category,
                        locationCategory: undefined,
                      }))
                    }
                    className="text-[#8b6a55] text-[11px] font-medium hover:text-[#e7bea6] transition-colors"
                  >
                    {t("filters.reset")}
                  </button>
                )}
              </div>
              <Select
                label={searchType === "all" ? t("filters.location_category") : t("filters.category")}
                options={locationCategories.map((cat) => ({ value: cat.id, label: cat.name }))}
                value={
                  selectedLocCat !== undefined
                    ? {
                        value: selectedLocCat,
                        label: locationCategories.find((c) => c.id === selectedLocCat)?.name || "",
                      }
                    : null
                }
                onChange={(option) =>
                  setLocalFilters((p) => ({
                    ...p,
                    category: searchType === "location" ? ((option as { value: number } | null)?.value) : p.category,
                    locationCategory: searchType === "all" ? ((option as { value: number } | null)?.value) : p.locationCategory,
                  }))
                }
                isClearable
                isLoading={isLoadingCats}
                placeholder={searchType === "all" ? t("filters.location_category") : t("filters.category")}
              />
            </div>
          )}

          {/* District — only for location search */}
          {searchType === "location" && (
            <div className="space-y-4">
              <h3 className="text-[#e7bea6] text-[11px] font-semibold uppercase tracking-widest">
                {t("filters.district")}
              </h3>
              {/* Custom select styled per Stitch */}
              <div className="relative group">
                <Select
                  label={t("filters.district")}
                  options={districts.map((d) => ({ value: d.id, label: d.name }))}
                  value={
                    localFilters.district
                      ? {
                          value: districts.find((d) => d.name === localFilters.district)?.id || "",
                          label: localFilters.district,
                        }
                      : null
                  }
                  onChange={(option) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      district: option ? (option as { label: string }).label : undefined,
                    }))
                  }
                  isClearable
                  isLoading={isLoadingDists}
                  placeholder={t("filters.district")}
                />
              </div>
            </div>
          )}

          {/* Tour categories */}
          {(searchType === "tour" || searchType === "all") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[#e7bea6] text-[11px] font-semibold uppercase tracking-widest">
                  {searchType === "all" ? t("filters.tour_category") : t("filters.category")}
                </h3>
                {selectedTourCat !== undefined && (
                  <button
                    onClick={() =>
                      setLocalFilters((p) => ({
                        ...p,
                        category: searchType === "tour" ? undefined : p.category,
                        tourCategory: undefined,
                      }))
                    }
                    className="text-[#8b6a55] text-[11px] font-medium hover:text-[#e7bea6] transition-colors"
                  >
                    {t("filters.reset")}
                  </button>
                )}
              </div>
              <Select
                label={searchType === "all" ? t("filters.tour_category") : t("filters.category")}
                options={tourCategories.map((cat) => ({ value: cat.id, label: cat.name }))}
                value={
                  selectedTourCat !== undefined
                    ? {
                        value: selectedTourCat,
                        label: tourCategories.find((c) => c.id === selectedTourCat)?.name || "",
                      }
                    : null
                }
                onChange={(option) =>
                  setLocalFilters((p) => ({
                    ...p,
                    category: searchType === "tour" ? ((option as { value: number } | null)?.value) : p.category,
                    tourCategory: searchType === "all" ? ((option as { value: number } | null)?.value) : p.tourCategory,
                  }))
                }
                isClearable
                isLoading={isLoadingCats}
                placeholder={searchType === "all" ? t("filters.tour_category") : t("filters.category")}
              />
            </div>
          )}

          {/* Rating */}
          <div className="space-y-4">
            <h3 className="text-[#e7bea6] text-[11px] font-semibold uppercase tracking-widest">
              {t("filters.rating")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const isActive = localFilters.rating === star;
                return (
                  <button
                    key={star}
                    onClick={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        rating: prev.rating === star ? undefined : star,
                      }))
                    }
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300",
                      isActive
                        ? "border-[#8b6a55] bg-[#8b6a55]/20 text-[#e7bea6]"
                        : "border-[#50453e]/40 text-[#737373] hover:border-[#8b6a55]/40 hover:text-[#e5e2e1]"
                    )}
                  >
                    <IoStar className={cn("text-sm", isActive ? "text-[#e7bea6]" : "text-amber-500/70")} />
                    <span>{star}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-[#e7bea6] text-[11px] font-semibold uppercase tracking-widest">
              {t("filters.price_range")} (VNĐ)
            </h3>
            {/* Gradient track indicator */}
            <div className="h-0.5 rounded-full bg-gradient-to-r from-[#50453e]/30 via-[#8b6a55]/50 to-[#e7bea6]/20 mb-5" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[#737373] text-[11px] font-semibold uppercase tracking-widest">
                  {t("filters.from")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={minPriceInput}
                    inputMode="numeric"
                    onChange={(e) =>
                      handlePriceChange("minPrice", e.target.value, isComposingMinRef.current)
                    }
                    onCompositionStart={() => {
                      isComposingMinRef.current = true;
                    }}
                    onCompositionEnd={(e) => {
                      handlePriceCompositionEnd("minPrice", e.currentTarget.value);
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(80,69,62,0.4)";
                      handlePriceCompositionEnd("minPrice", e.currentTarget.value);
                    }}
                    placeholder="0"
                    className="w-full rounded-lg px-4 py-3 text-[#e5e2e1] text-sm font-medium outline-none transition-all placeholder:text-[#737373]/50"
                    style={{
                      backgroundColor: "rgba(32,31,31,0.8)",
                      border: "1px solid rgba(80,69,62,0.4)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(139,106,85,0.7)")}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] text-xs">đ</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[#737373] text-[11px] font-semibold uppercase tracking-widest">
                  {t("filters.to")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={maxPriceInput}
                    inputMode="numeric"
                    onChange={(e) =>
                      handlePriceChange("maxPrice", e.target.value, isComposingMaxRef.current)
                    }
                    onCompositionStart={() => {
                      isComposingMaxRef.current = true;
                    }}
                    onCompositionEnd={(e) => {
                      handlePriceCompositionEnd("maxPrice", e.currentTarget.value);
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(80,69,62,0.4)";
                      handlePriceCompositionEnd("maxPrice", e.currentTarget.value);
                    }}
                    placeholder="10.000.000+"
                    className="w-full rounded-lg px-4 py-3 text-[#e5e2e1] text-sm font-medium outline-none transition-all placeholder:text-[#737373]/50"
                    style={{
                      backgroundColor: "rgba(32,31,31,0.8)",
                      border: "1px solid rgba(80,69,62,0.4)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(139,106,85,0.7)")}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] text-xs">đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="grid grid-cols-2 gap-3 p-5 border-t border-[#50453e]/30"
          style={{ backgroundColor: "rgba(13,13,13,0.8)" }}
        >
          <button
            onClick={handleReset}
            className="py-3 rounded-xl border border-[#50453e]/40 text-[#737373] text-sm font-medium hover:text-[#e5e2e1] hover:border-[#8b6a55]/40 transition-all active:scale-95"
          >
            {t("filters.reset")}
          </button>
          <button
            onClick={handleApply}
            className="py-3 rounded-xl text-sm font-medium text-[#442b19] transition-all active:scale-95 shadow-lg shadow-[#8b6a55]/20"
            style={{ backgroundColor: "#e7bea6" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d4a689")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e7bea6")}
          >
            {t("filters.apply")}
          </button>
        </div>
      </div>
    </div>
  );
};
