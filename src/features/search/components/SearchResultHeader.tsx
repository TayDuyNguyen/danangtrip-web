"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  IoTrendingUp,
  IoFlashOutline,
  IoOptionsOutline,
  IoCloseOutline
} from "react-icons/io5";
import { ROUTES } from "@/config";
import { cn } from "@/utils/string";
import { SearchFilters } from "../types/search.types";
import { debounce } from "@/utils/debounce";
import { useSearchDiscovery } from "../hooks/use-search-discovery";
import SearchInput from "@/components/ui/SearchInput";

interface SearchResultHeaderProps {
  query: string;
  count: number;
  onSearch: (value: string) => void;
  onOpenFilters: () => void;
  activeFilters: SearchFilters;
  onRemoveFilter: (key: string) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export const SearchResultHeader = ({
  query,
  count,
  onSearch,
  onOpenFilters,
  activeFilters,
  onRemoveFilter,
  onClearFilters,
  isLoading
}: SearchResultHeaderProps) => {
  const tSearch = useTranslations("search");
  const { trending, isLoading: isLoadingTrending } = useSearchDiscovery();

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearch(value);
      }, 500),
    [onSearch]
  );

  // Cleanup effect for debounce
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (val: string) => {
    debouncedSearch(val);
  };

  // Helper to check if any filters are active
  const hasActiveFilters = Object.values(activeFilters).some(v => v !== undefined && v !== null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-3xl">
            <SearchInput
              value={query}
              onChange={handleInputChange}
              placeholder={tSearch("suggestions.search_placeholder")}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-1">
          <p className="text-on-surface-subtle font-medium text-lg">
            {query
              ? tSearch.rich("found_results", {
                count,
                query,
                strong: (chunks: React.ReactNode) => <strong className="text-foreground font-black">{chunks}</strong>
              })
              : tSearch("discovery.subtitle")
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-2 px-6 py-3 bg-surface-container-low hover:bg-surface-container-high text-foreground font-black rounded-2xl transition-all scale-100 active:scale-95 shadow-sm"
          >
            <IoOptionsOutline className="text-xl" />
            {tSearch("filters.title")}
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-azure text-white text-[10px] flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tags & Clear All */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {activeFilters.minPrice !== undefined && (
            <Tag
              label={`${tSearch("filters.price_range")}: >${activeFilters.minPrice.toLocaleString()}đ`}
              onRemove={() => onRemoveFilter("minPrice")}
            />
          )}
          {activeFilters.maxPrice !== undefined && (
            <Tag
              label={`${tSearch("filters.price_range")}: <${activeFilters.maxPrice.toLocaleString()}đ`}
              onRemove={() => onRemoveFilter("maxPrice")}
            />
          )}
          {activeFilters.rating !== undefined && (
            <Tag
              label={`${activeFilters.rating}★ ${tSearch("filters.rating")}`}
              onRemove={() => onRemoveFilter("rating")}
            />
          )}
          {activeFilters.category !== undefined && (
            <Tag
              label={`${tSearch("filters.category")}: ${activeFilters.category}`}
              onRemove={() => onRemoveFilter("category")}
            />
          )}
          {activeFilters.district !== undefined && (
            <Tag
              label={`${tSearch("filters.district")}: ${activeFilters.district}`}
              onRemove={() => onRemoveFilter("district")}
            />
          )}

          <button
            onClick={onClearFilters}
            className="text-sm font-black text-azure border-b-2 border-transparent hover:border-azure transition-all py-1 px-2"
          >
            {tSearch("filters.reset")}
          </button>
        </div>
      )}


      {/* Trending Section - No Line rule */}
      <div className="pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-black text-on-surface-subtle uppercase tracking-widest mr-2 flex items-center gap-2">
            <IoTrendingUp className="text-azure text-xl" />
            {tSearch("trending.title")}:
          </span>

          {isLoadingTrending ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-10 w-24 bg-surface-container-low rounded-2xl animate-pulse" />
            ))
          ) : trending.map((item: string, idx: number) => {
            const isSelected = query === item;
            return (
              <Link
                key={idx}
                href={`${ROUTES.SEARCH}?q=${encodeURIComponent(item)}`}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-black transition-all duration-300 scale-100 hover:scale-105",
                  isSelected
                    ? "bg-azure shadow-azure/20"
                    : "bg-surface-container-low text-on-surface-subtle hover:bg-surface-container-high"
                )}
              >
                {idx < 2 && <IoFlashOutline className="text-amber-500" />}
                <span className={isSelected ? "text-white" : ""}>{item}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface TagProps {
  label: string;
  onRemove: () => void;
}

const Tag = ({ label, onRemove }: TagProps) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-azure/10 text-azure rounded-xl text-sm font-black border border-azure/20 shadow-sm transition-all hover:bg-azure/20">
    <span>{label}</span>
    <button onClick={onRemove} className="hover:rotate-90 transition-transform">
      <IoCloseOutline className="text-lg" />
    </button>
  </div>
);
