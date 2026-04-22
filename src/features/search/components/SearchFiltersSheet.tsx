"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { 
  IoCloseOutline, 
  IoStar, 
  IoCheckmarkCircle
} from "react-icons/io5";
import { SearchFilters } from "../types/search.types";
import { cn } from "@/utils/string";
import { tourService } from "@/services/tour.service";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config";
import type { ApiResponse } from "@/types";
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
          const res = await axiosInstance.get<ApiResponse<Category[]>>(
            API_ENDPOINTS.LOCATIONS.CATEGORIES
          );
          const raw = res.data;
          const list = Array.isArray(raw) ? raw : [];
          setCategories(list.map((c) => ({ id: c.id, name: c.name })));
        } else {
          const res = await tourService.getCategories();
          const raw = res.data;
          const list = Array.isArray(raw) ? raw : [];
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

  const toggleCategory = (id: number) => {
    setLocalFilters(prev => ({
      ...prev,
      category: prev.category === id ? undefined : id
    }));
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
            <h3 className="text-[13px] font-black text-on-surface-variant uppercase tracking-widest flex items-center justify-between">
              {t("filters.category")}
              {localFilters.category && (
                 <button onClick={() => setLocalFilters(p => ({...p, category: undefined}))} className="text-azure normal-case text-xs">
                   {t("filters.reset")}
                 </button>
              )}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {isLoadingCats ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-12 bg-surface-container-low rounded-2xl animate-pulse" />
                ))
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      "flex items-center justify-between px-5 py-3.5 rounded-2xl border-2 transition-all duration-300 transform active:scale-95",
                      localFilters.category === cat.id 
                        ? "border-azure bg-azure/5 text-azure" 
                        : "border-surface-container-high text-on-surface hover:border-on-surface-subtle"
                    )}
                  >
                    <span className="font-bold">{cat.name}</span>
                    {localFilters.category === cat.id && <IoCheckmarkCircle className="text-xl" />}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* District — áp dụng khi tìm địa điểm (hoặc tab Tất cả) */}
          {(searchType === "location" || searchType === "all") && (
            <div className="space-y-6">
              <h3 className="text-[13px] font-black text-on-surface-variant uppercase tracking-widest">{t("filters.district")}</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Hải Châu", "Thanh Khê", "Liên Chiểu", 
                  "Sơn Trà", "Ngũ Hành Sơn", "Cẩm Lệ", 
                  "Hòa Vang"
                ].map((d) => (
                  <button
                    key={d}
                    onClick={() => setLocalFilters(prev => ({ ...prev, district: prev.district === d ? undefined : d }))}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all duration-300",
                      localFilters.district === d 
                        ? "border-azure bg-azure/5 text-azure" 
                        : "border-surface-container-high text-on-surface hover:border-on-surface-subtle"
                    )}
                  >
                    <span className="font-bold text-sm">{d}</span>
                    {localFilters.district === d && <IoCheckmarkCircle className="text-lg" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="space-y-6">
            <h3 className="text-[13px] font-black text-on-surface-variant uppercase tracking-widest">{t("filters.rating")}</h3>
            <div className="flex flex-wrap gap-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setLocalFilters(prev => ({ ...prev, rating: prev.rating === star ? undefined : star }))}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all duration-300",
                    localFilters.rating === star 
                      ? "border-azure bg-azure text-white" 
                      : "border-surface-container-high text-on-surface-variant hover:border-on-surface-subtle"
                  )}
                >
                  <span className="font-bold">{star}</span>
                  <IoStar className={localFilters.rating === star ? "text-white" : "text-amber-500"} />
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-6">
            <h3 className="text-[13px] font-black text-on-surface-variant uppercase tracking-widest">{t("filters.price_range")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-subtle ml-2">{t("filters.from")}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={localFilters.minPrice || ""}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, minPrice: Number(e.target.value) || undefined }))}
                    placeholder="0"
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 font-bold text-foreground outline-none focus:ring-2 focus:ring-azure/20 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-subtle text-xs font-bold">đ</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-subtle ml-2">{t("filters.to")}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={localFilters.maxPrice || ""}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) || undefined }))}
                    placeholder="10,000,000+"
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 font-bold text-foreground outline-none focus:ring-2 focus:ring-azure/20 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-subtle text-xs font-bold">đ</span>
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
