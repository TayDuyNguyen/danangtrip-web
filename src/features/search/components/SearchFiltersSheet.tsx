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
  const { data: categories = [], isLoading: isLoadingCats } = useSearchFilterCategories(searchType, isOpen);
  const { data: districts = [], isLoading: isLoadingDists } = useLocationDistricts();

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
    <div className="fixed inset-0 z-100 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-[#111111] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
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
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          
          {/* Categories */}
          <div className="space-y-6">
            <h3 className="flex items-center justify-between text-[11px] font-black text-white/80 uppercase tracking-[0.3em] pl-1">
              <span>{t("filters.category")}</span>
              {localFilters.category && (
                 <button onClick={() => setLocalFilters(p => ({...p, category: undefined}))} className="text-[#8b6a55] normal-case text-xs font-black tracking-normal cursor-pointer">
                   {t("filters.reset")}
                 </button>
              )}
            </h3>
            <div className="space-y-4">
              <Select
                label={t("filters.category")}
                options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                value={localFilters.category ? { value: localFilters.category, label: categories.find(c => c.id === localFilters.category)?.name || "" } : null}
                onChange={(option) => setLocalFilters(p => ({ ...p, category: option ? (option as { value: number }).value : undefined }))}
                isClearable
                isLoading={isLoadingCats}
                placeholder={t("filters.category")}
              />
            </div>
          </div>

          {/* District — áp dụng khi tìm địa điểm (hoặc tab Tất cả) */}
          {(searchType === "location" || searchType === "all") && (
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
        <div className="p-8 border-t border-white/10 bg-[#111111] grid grid-cols-2 gap-4">
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
  );
};
