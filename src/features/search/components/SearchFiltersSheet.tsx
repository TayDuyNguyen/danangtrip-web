"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { 
  IoCloseOutline, 
  IoStar
} from "@/components/icons/solar";
import { SearchFilters } from "../types/search.types";
import { cn } from "@/utils/string";
import { Select } from "@/components/ui/Select";
import { useSearchFilterCategories } from "../hooks/use-search-filter-categories";
import { useLocationDistricts } from "@/features/locations/hooks/use-locations";
import { formatInputPrice } from "@/utils/format";

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
  const { data: categoryData, isLoading: isLoadingCats } = useSearchFilterCategories(searchType, isOpen);
  const { data: districts = [], isLoading: isLoadingDists } = useLocationDistricts();
  const locationCategories = categoryData?.locationCategories ?? [];
  const tourCategories = categoryData?.tourCategories ?? [];

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

  // Helper to get rating styles and avoid IDE class conflicts
  const getRatingStyles = (isActive: boolean) => {
    const activeBg = "bg-[#8b6a55] shadow-xl shadow-[#8b6a55]/30";
    const inactiveBg = "bg-[#181818] hover:bg-[#222222]";
    
    const activeBorder = "border-[#8b6a55]";
    const inactiveBorder = "border-white/10 hover:border-[#8b6a55]/30";
    
    const activeText = "text-white";
    const inactiveText = "text-white/60";

    return cn(
      "group flex items-center gap-3 px-6 py-4 rounded-xl font-black transition-all duration-500 scale-100 active:scale-90 border-2",
      isActive ? activeBg : inactiveBg,
      isActive ? activeBorder : inactiveBorder,
      isActive ? activeText : inactiveText
    );
  };

  if (!isOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-100 overflow-hidden">
      <button
        aria-label={t("filters.close")}
        className="pointer-events-auto absolute inset-0 cursor-default bg-transparent"
        onClick={onClose}
        type="button"
      />

      <div className="pointer-events-auto absolute right-6 top-24 w-[min(440px,calc(100vw-2rem))] animate-in slide-in-from-right duration-300">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">{t("filters.title")}</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-white"
          >
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[min(64vh,42rem)] overflow-y-auto p-8 space-y-10">
          
          {/* Location category */}
          {(searchType === "location" || searchType === "all") && (
            <div className="space-y-6">
              <h3 className="flex items-center justify-between text-[11px] font-black text-white/80 uppercase tracking-[0.3em] pl-1">
                <span>{searchType === "all" ? t("filters.location_category") : t("filters.category")}</span>
                {(searchType === "location" ? localFilters.category : localFilters.locationCategory) && (
                  <button
                    onClick={() =>
                      setLocalFilters((p) => ({
                        ...p,
                        category: searchType === "location" ? undefined : p.category,
                        locationCategory: undefined,
                      }))
                    }
                    className="text-[#8b6a55] normal-case text-xs font-black tracking-normal cursor-pointer"
                  >
                    {t("filters.reset")}
                  </button>
                )}
              </h3>
              <div className="space-y-4">
                <Select
                  label={searchType === "all" ? t("filters.location_category") : t("filters.category")}
                  options={locationCategories.map(cat => ({ value: cat.id, label: cat.name }))}
                  value={
                    (searchType === "location" ? localFilters.category : localFilters.locationCategory)
                      ? {
                          value: searchType === "location" ? localFilters.category : localFilters.locationCategory,
                          label:
                            locationCategories.find(
                              (c) => c.id === (searchType === "location" ? localFilters.category : localFilters.locationCategory)
                            )?.name || "",
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
            </div>
          )}

          {/* District */}
          {searchType === "location" && (
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-white/80 uppercase tracking-[0.3em] pl-1">{t("filters.district")}</h3>
              <Select
                label={t("filters.district")}
                options={districts.map(d => ({ value: d.id, label: d.name }))}
                value={localFilters.district ? { value: districts.find(d => d.name === localFilters.district)?.id || "", label: localFilters.district } : null}
                onChange={(option) => setLocalFilters(prev => ({ ...prev, district: option ? (option as { label: string }).label : undefined }))}
                isClearable
                isLoading={isLoadingDists}
                placeholder={t("filters.district")}
              />
            </div>
          )}

          {/* Tour category */}
          {(searchType === "tour" || searchType === "all") && (
            <div className="space-y-6">
              <h3 className="flex items-center justify-between text-[11px] font-black text-white/80 uppercase tracking-[0.3em] pl-1">
                <span>{searchType === "all" ? t("filters.tour_category") : t("filters.category")}</span>
                {(searchType === "tour" ? localFilters.category : localFilters.tourCategory) && (
                  <button
                    onClick={() =>
                      setLocalFilters((p) => ({
                        ...p,
                        category: searchType === "tour" ? undefined : p.category,
                        tourCategory: undefined,
                      }))
                    }
                    className="text-[#8b6a55] normal-case text-xs font-black tracking-normal cursor-pointer"
                  >
                    {t("filters.reset")}
                  </button>
                )}
              </h3>
              <div className="space-y-4">
                <Select
                  label={searchType === "all" ? t("filters.tour_category") : t("filters.category")}
                  options={tourCategories.map(cat => ({ value: cat.id, label: cat.name }))}
                  value={
                    (searchType === "tour" ? localFilters.category : localFilters.tourCategory)
                      ? {
                          value: searchType === "tour" ? localFilters.category : localFilters.tourCategory,
                          label:
                            tourCategories.find(
                              (c) => c.id === (searchType === "tour" ? localFilters.category : localFilters.tourCategory)
                            )?.name || "",
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
            </div>
          )}

          {/* Rating */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-white/80 uppercase tracking-[0.3em] pl-1">
              {t("filters.rating")}
            </h3>
            <div className="flex flex-wrap gap-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setLocalFilters(prev => ({ ...prev, rating: prev.rating === star ? undefined : star }))}
                  className={getRatingStyles(localFilters.rating === star)}
                >
                  <span className="text-lg leading-none">{star}</span>
                  <IoStar className={cn(
                    "text-lg transition-transform duration-500 group-hover:scale-125",
                    localFilters.rating === star ? "text-white" : "text-amber-500"
                  )} />
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-white/80 uppercase tracking-[0.3em] pl-1">
              {t("filters.price_range")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-white/70 ml-1">
                  {t("filters.from")}
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={minPriceInput}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, "");
                      const formatted = clean ? formatInputPrice(Number(clean)) : "";
                      e.target.value = formatted;
                      setMinPriceInput(formatted);
                      setLocalFilters((prev) => ({ ...prev, minPrice: clean ? Number(clean) : undefined }));
                    }}
                    placeholder="0"
                    className="w-full bg-[#181818] border-2 border-white/10 rounded-xl py-5 px-6 font-extrabold text-white outline-none focus:border-[#8b6a55] focus:ring-4 focus:ring-[#8b6a55]/5 transition-all placeholder:text-white/30"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 font-black text-xs">đ</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-white/70 ml-1">
                  {t("filters.to")}
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={maxPriceInput}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, "");
                      const formatted = clean ? formatInputPrice(Number(clean)) : "";
                      e.target.value = formatted;
                      setMaxPriceInput(formatted);
                      setLocalFilters((prev) => ({ ...prev, maxPrice: clean ? Number(clean) : undefined }));
                    }}
                    placeholder="10.000.000+"
                    className="w-full bg-[#181818] border-2 border-white/10 rounded-xl py-5 px-6 font-extrabold text-white outline-none focus:border-[#8b6a55] focus:ring-4 focus:ring-[#8b6a55]/5 transition-all placeholder:text-white/30"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 font-black text-xs">đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 bg-[#111111] p-6">
          <button
            onClick={handleReset}
            className="py-4 rounded-xl border-2 border-white/10 text-white/80 font-black hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
          >
            {t("filters.reset")}
          </button>
          <button
            onClick={handleApply}
            className="py-4 rounded-xl bg-[#8b6a55] text-white font-black shadow-lg shadow-[#8b6a55]/20 hover:bg-[#72533e] transition-all active:scale-95 cursor-pointer"
          >
            {t("filters.apply")}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};
