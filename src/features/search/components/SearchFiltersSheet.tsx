"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { 
  IoCloseOutline, 
  IoStar
} from "react-icons/io5";
import { SearchFilters } from "../types/search.types";
import { cn } from "@/utils/string";
import { tourService } from "@/services/tour.service";
import { locationService } from "@/services/location.service";
import { DANANG_DISTRICTS } from "@/utils/constants";
import { extractItems } from "@/utils";
import { Select } from "@/components/ui/Select";
import type { Category } from "@/types";

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
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(false);

  // Fetch categories based on type
  useEffect(() => {
    const fetchCats = async () => {
      setIsLoadingCats(true);
      try {
        if (searchType === "location") {
          const res = await locationService.getCategories();
          const list = extractItems<Category>(res.data);
          setCategories(list.map((c) => ({ id: c.id, name: c.name })));
        } else {
          const res = await tourService.getCategories();
          const list = extractItems<Category>(res.data);
          setCategories(list.map((c) => ({ id: c.id, name: c.name })));
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setIsLoadingCats(false);
      }
    };
    if (isOpen) fetchCats();
  }, [isOpen, searchType]);

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
  };

  // Helper to get rating styles and avoid IDE class conflicts
  const getRatingStyles = (isActive: boolean) => {
    const activeBg = "bg-linear-to-r from-azure to-azure-dark shadow-xl shadow-azure/30";
    const inactiveBg = "bg-surface-container-low/40 backdrop-blur-sm hover:bg-surface-container-low";
    
    const activeBorder = "border-azure";
    const inactiveBorder = "border-outline-variant/10 hover:border-outline-variant/30";
    
    const activeText = "text-white";
    const inactiveText = "text-on-surface-variant";

    return cn(
      "group flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all duration-500 scale-100 active:scale-90 border-2",
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
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-surface-container-lowest shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-surface-container-high">
          <h2 className="text-2xl font-bold text-foreground">{t("filters.title")}</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
          >
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          
          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-[0.3em] pl-1">
              {t("filters.category")}
              {localFilters.category && (
                 <button onClick={() => setLocalFilters(p => ({...p, category: undefined}))} className="text-azure normal-case text-xs ml-auto">
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
              <h3 className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-[0.3em] pl-1">{t("filters.district")}</h3>
              <Select
                label={t("filters.district")}
                options={DANANG_DISTRICTS.map(d => ({ value: d.id, label: d.name }))}
                value={localFilters.district ? { value: DANANG_DISTRICTS.find(d => d.name === localFilters.district)?.id || "", label: localFilters.district } : null}
                onChange={(option) => setLocalFilters(prev => ({ ...prev, district: option ? (option as { label: string }).label : undefined }))}
                isClearable
                placeholder={t("filters.district")}
              />
            </div>
          )}

          {/* Rating */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-[0.3em] pl-1">
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
            <h3 className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-[0.3em] pl-1">
              {t("filters.price_range")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">
                  {t("filters.from")}
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={localFilters.minPrice || ""}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, minPrice: Number(e.target.value) || undefined }))}
                    placeholder="0"
                    className="w-full bg-surface-container-low/40 backdrop-blur-sm border-2 border-outline-variant/10 rounded-2xl py-5 px-6 font-bold text-foreground outline-none focus:border-azure/50 focus:ring-4 focus:ring-azure/5 transition-all placeholder:text-on-surface-variant/30"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-subtle font-black text-xs">đ</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">
                  {t("filters.to")}
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={localFilters.maxPrice || ""}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) || undefined }))}
                    placeholder="10M+"
                    className="w-full bg-surface-container-low/40 backdrop-blur-sm border-2 border-outline-variant/10 rounded-2xl py-5 px-6 font-bold text-foreground outline-none focus:border-azure/50 focus:ring-4 focus:ring-azure/5 transition-all placeholder:text-on-surface-variant/30"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-subtle font-black text-xs">đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-surface-container-high bg-surface-container-lowest grid grid-cols-2 gap-4">
          <button
            onClick={handleReset}
            className="py-4 rounded-2xl border-2 border-surface-container-high text-on-surface font-black hover:bg-surface-container-low transition-all active:scale-95"
          >
            {t("filters.reset")}
          </button>
          <button
            onClick={handleApply}
            className="py-4 rounded-2xl bg-azure text-white font-black shadow-lg shadow-azure/20 hover:bg-azure-dark transition-all active:scale-95"
          >
            {t("filters.apply")}
          </button>
        </div>
      </div>
    </div>
  );
};
