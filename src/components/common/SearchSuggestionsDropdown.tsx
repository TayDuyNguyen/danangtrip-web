"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoStar, IoSearchOutline } from "react-icons/io5";
import { cn } from "@/utils/string";
import { SearchSuggestionsData, SearchSuggestionItem } from "@/types/search-suggestion.types";

interface SearchSuggestionsDropdownProps {
  isOpen: boolean;
  isLoading: boolean;
  isError?: boolean;
  suggestions?: SearchSuggestionsData;
  query: string;
  selectedIndex: number;
  onSelect: (item: SearchSuggestionItem) => void;
  onViewAll: () => void;
}

export const SearchSuggestionsDropdown = ({
  isOpen,
  isLoading,
  isError,
  suggestions,
  query,
  selectedIndex,
  onSelect,
  onViewAll,
}: SearchSuggestionsDropdownProps) => {
  const t = useTranslations("search");

  if (!isOpen) return null;

  const totalItems = suggestions?.total || 0;

  const renderSection = (titleKey: string, sectionItems: SearchSuggestionItem[], startIndex: number) => {
    if (sectionItems.length === 0) return null;

    return (
      <div className="py-2">
        <h3 className="px-4 py-2 text-[12px] font-black text-white/50 uppercase tracking-[0.2em]">
          {t(titleKey)}
        </h3>
        {sectionItems.map((item, idx) => {
          const globalIdx = startIndex + idx;
          const isSelected = selectedIndex === globalIdx;

          return (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => onSelect(item)}
              className={cn(
                "group flex items-center gap-4 px-4 py-3 cursor-pointer transition-all duration-300 mx-2 rounded-2xl reveal-up",
                isSelected 
                  ? "bg-[#171717] border border-[#8b6a55]/40 backdrop-blur-md shadow-lg scale-[1.02] z-10" 
                  : "hover:bg-[#171717]/80 hover:translate-x-1"
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#171717] shrink-0 border border-[#262626]">
                <Image
                  src={item.thumbnail || "/images/placeholder.png"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className="text-white font-bold truncate text-[15px]">
                    {item.title}
                  </h4>
                  {item.rating > 0 && (
                    <div className="flex items-center gap-1 text-amber-400 text-xs shrink-0 bg-[#171717] px-2 py-0.5 rounded-full">
                      <IoStar />
                      <span className="font-bold text-white">{item.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-white/60 text-sm truncate font-medium">
                  {item.type === "location" 
                    ? t("suggestions.views", { count: item.viewCount })
                    : t("suggestions.bookings", { count: item.bookingCount || 0 })
                  }
                  <span className="mx-2 opacity-30">•</span>
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-4 space-y-4 animate-pulse">
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded-full w-1/4" />
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 p-2 items-center">
                <div className="w-14 h-14 bg-white/10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/10 rounded-full w-3/4" />
                  <div className="h-4 bg-white/10 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-8 text-center text-white/70 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-[#171717] flex items-center justify-center border border-[#5c3822]/30 text-[#8b6a55]">
            <IoSearchOutline className="text-3xl" />
          </div>
          <p className="font-bold text-lg text-white">{t("suggestions.error")}</p>
        </div>
      );
    }

    if (totalItems === 0) {
      return (
        <div className="p-10 text-center text-white/70 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <IoSearchOutline className="text-3xl opacity-50" />
          </div>
          <p className="font-bold text-lg">{t("suggestions.no_results")}</p>
        </div>
      );
    }

    return (
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {renderSection("suggestions.locations_title", suggestions?.locations || [], 0)}
        {renderSection("suggestions.tours_title", suggestions?.tours || [], suggestions?.locations?.length || 0)}
      </div>
    );
  };

  const isViewAllSelected = selectedIndex === totalItems;
  const viewAllSelectedStyles = "bg-azure border-azure text-white shadow-lg shadow-azure/20";
  const viewAllDefaultStyles = "border-[#262626] text-[#ffffffb3] hover:bg-[#171717] hover:border-[#8b6a55]/40";

  return (
    <div 
      className={cn(
        "absolute left-0 right-0 top-[110%] z-50 rounded-xl overflow-hidden backdrop-blur-2xl bg-[#0f0f0f]/95 border border-[#262626] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 origin-top scale-100 opacity-100",
      )}
    >
      <div className="py-2">
        {renderContent()}
        
        {/* View All Button */}
        <div
          onClick={onViewAll}
          className={cn(
            "mt-2 mx-4 mb-4 p-4 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-300 border border-dashed",
            isViewAllSelected ? viewAllSelectedStyles : viewAllDefaultStyles
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            isViewAllSelected ? "bg-white/20" : "bg-white/10"
          )}>
            <IoSearchOutline className="text-xl" />
          </div>
          <span className="font-bold">{t("suggestions.view_all", { query })}</span>
        </div>
      </div>
    </div>
  );
};
