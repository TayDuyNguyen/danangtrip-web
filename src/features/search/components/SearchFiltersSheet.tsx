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

const sectionTitleClass = "text-xs font-semibold uppercase tracking-normal text-on-surface-subtle";

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
    setMinPriceInput(initialFilters.minPrice !== undefined ? formatInputPrice(initialFilters.minPrice) : "");
    setMaxPriceInput(initialFilters.maxPrice !== undefined ? formatInputPrice(initialFilters.maxPrice) : "");
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
      locationCategory: undefined,
      tourCategory: undefined,
    });
    setMinPriceInput("");
    setMaxPriceInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        aria-label={t("filters.close")}
        className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
        onClick={onClose}
        type="button"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[32px] border border-border bg-white shadow-[0_28px_80px_rgba(15,23,42,0.16)] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-on-surface">{t("filters.title")}</h2>
            <p className="mt-1 text-sm text-on-surface-subtle">{t("discovery.subtitle")}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-border bg-[#fafafa] p-2 text-on-surface-subtle transition-colors hover:border-primary/25 hover:bg-white hover:text-on-surface"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="filter-sheet-scrollbar flex-1 space-y-7 overflow-y-auto p-6">
          {(searchType === "location" || searchType === "all") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={sectionTitleClass}>
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
                    className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
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
                    locationCategory:
                      searchType === "all" ? ((option as { value: number } | null)?.value) : p.locationCategory,
                  }))
                }
                isClearable
                isLoading={isLoadingCats}
                variant="minimal"
                containerClassName="rounded-[22px] border border-border bg-white px-4 py-1 shadow-sm"
                placeholder={searchType === "all" ? t("filters.location_category") : t("filters.category")}
              />
            </div>
          )}

          {searchType === "location" && (
            <div className="space-y-4">
              <h3 className={sectionTitleClass}>{t("filters.district")}</h3>
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
                variant="minimal"
                containerClassName="rounded-[22px] border border-border bg-white px-4 py-1 shadow-sm"
                placeholder={t("filters.district")}
              />
            </div>
          )}

          {(searchType === "tour" || searchType === "all") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={sectionTitleClass}>
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
                    className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
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
                    tourCategory:
                      searchType === "all" ? ((option as { value: number } | null)?.value) : p.tourCategory,
                  }))
                }
                isClearable
                isLoading={isLoadingCats}
                variant="minimal"
                containerClassName="rounded-[22px] border border-border bg-white px-4 py-1 shadow-sm"
                placeholder={searchType === "all" ? t("filters.tour_category") : t("filters.category")}
              />
            </div>
          )}

          <div className="space-y-4">
            <h3 className={sectionTitleClass}>{t("filters.rating")}</h3>
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
                      "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                      isActive
                        ? "border-primary/20 bg-[#fff1f3] text-primary shadow-sm"
                        : "border-border bg-white text-on-surface-subtle hover:border-primary/25 hover:bg-[#fafafa] hover:text-on-surface"
                    )}
                  >
                    <IoStar className={cn("text-sm", isActive ? "text-primary" : "text-amber-500")} />
                    <span>{star}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className={sectionTitleClass}>{t("filters.price_range")} (VND)</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className={sectionTitleClass}>{t("filters.from")}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={minPriceInput}
                    inputMode="numeric"
                    onChange={(e) => handlePriceChange("minPrice", e.target.value, isComposingMinRef.current)}
                    onCompositionStart={() => {
                      isComposingMinRef.current = true;
                    }}
                    onCompositionEnd={(e) => {
                      handlePriceCompositionEnd("minPrice", e.currentTarget.value);
                    }}
                    onBlur={(e) => {
                      handlePriceCompositionEnd("minPrice", e.currentTarget.value);
                    }}
                    placeholder="0"
                    className="w-full rounded-[22px] border border-border bg-white px-4 py-3 text-sm font-medium text-on-surface outline-none transition-all placeholder:text-on-surface-subtle/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-on-surface-subtle">d</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className={sectionTitleClass}>{t("filters.to")}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={maxPriceInput}
                    inputMode="numeric"
                    onChange={(e) => handlePriceChange("maxPrice", e.target.value, isComposingMaxRef.current)}
                    onCompositionStart={() => {
                      isComposingMaxRef.current = true;
                    }}
                    onCompositionEnd={(e) => {
                      handlePriceCompositionEnd("maxPrice", e.currentTarget.value);
                    }}
                    onBlur={(e) => {
                      handlePriceCompositionEnd("maxPrice", e.currentTarget.value);
                    }}
                    placeholder="10.000.000+"
                    className="w-full rounded-[22px] border border-border bg-white px-4 py-3 text-sm font-medium text-on-surface outline-none transition-all placeholder:text-on-surface-subtle/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-on-surface-subtle">d</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border bg-[#fcfcfc] p-5">
          <button
            onClick={handleReset}
            className="rounded-[20px] border border-border bg-white py-3 text-sm font-semibold text-on-surface-subtle transition-all hover:border-primary/25 hover:text-on-surface active:scale-95"
          >
            {t("filters.reset")}
          </button>
          <button
            onClick={handleApply}
            className="rounded-[20px] bg-primary py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(255,56,92,0.18)] transition-all hover:bg-primary/90 active:scale-95"
          >
            {t("filters.apply")}
          </button>
        </div>
      </div>
    </div>
  );
};
