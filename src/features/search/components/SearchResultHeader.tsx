"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  IoTrendingUp,
  IoFlashOutline,
  IoOptionsOutline,
  IoCloseOutline
} from "@/components/icons/solar";
import { ROUTES } from "@/config";
import { cn } from "@/utils/string";
import { formatNumber } from "@/utils/format";
import { SearchFilters } from "../types/search.types";
import { debounce } from "@/utils/debounce";
import { useSearchDiscovery } from "../hooks/use-search-discovery";
import { useSearchSuggestions } from "../hooks/use-search-suggestions";
import { useSearchHistory } from "../hooks/use-search-history";
import { SearchSuggestionsDropdown } from "./SearchSuggestionsDropdown";
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
  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory();
  
  const [inputValue, setInputValue] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state with url query parameter changes
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Click outside suggestions dropdown handling
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions based on input value
  const { data: suggestions = [], isLoading: isSuggestionsLoading } = useSearchSuggestions(inputValue);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearch(value);
        if (value.trim()) {
          addHistory(value);
        }
      }, 500),
    [onSearch, addHistory]
  );

  // Cleanup effect for debounce
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    debouncedSearch(val);
  };

  const handleSelectSuggestion = (val: string) => {
    setInputValue(val);
    onSearch(val);
    addHistory(val);
    setIsFocused(false);
  };

  // Helper to check if any filters are active
  const hasActiveFilters = Object.values(activeFilters).some(v => v !== undefined && v !== null);

  const isDropdownOpen = isFocused && (inputValue.trim().length >= 2 || (inputValue.trim().length === 0 && history.length > 0));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Search Input Bar inside Glass Box */}
      <section className="glass-retro rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div ref={containerRef} className="relative w-full max-w-2xl flex-1">
            <div onFocus={() => setIsFocused(true)}>
              <SearchInput
                value={inputValue}
                onChange={handleInputChange}
                placeholder={tSearch("suggestions.search_placeholder")}
                isLoading={isLoading}
                debounceMs={0}
                className="m-0"
              />
            </div>
            <SearchSuggestionsDropdown
              suggestions={suggestions}
              isOpen={isDropdownOpen}
              isLoading={isSuggestionsLoading}
              onSelect={handleSelectSuggestion}
              query={inputValue}
              history={history}
              onRemoveHistory={removeHistory}
              onClearHistory={clearHistory}
            />
          </div>
          <button
            onClick={onOpenFilters}
            className="w-full md:w-auto glass-retro px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:border-[#8b6a55] transition-colors text-white font-semibold text-sm active:scale-95 shadow-sm shrink-0"
          >
            <IoOptionsOutline className="text-lg" />
            {tSearch("filters.title")}
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-[#8b6a55] text-white text-[10px] flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Filter Tags & Clear All */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {activeFilters.minPrice !== undefined && (
            <Tag
              label={`${tSearch("filters.price_range")}: >${formatNumber(activeFilters.minPrice)}đ`}
              onRemove={() => onRemoveFilter("minPrice")}
            />
          )}
          {activeFilters.maxPrice !== undefined && (
            <Tag
              label={`${tSearch("filters.price_range")}: <${formatNumber(activeFilters.maxPrice)}đ`}
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
          {activeFilters.locationCategory !== undefined && (
            <Tag
              label={`${tSearch("tabs.location")}: ${activeFilters.locationCategory}`}
              onRemove={() => onRemoveFilter("locationCategory")}
            />
          )}
          {activeFilters.tourCategory !== undefined && (
            <Tag
              label={`${tSearch("tabs.tour")}: ${activeFilters.tourCategory}`}
              onRemove={() => onRemoveFilter("tourCategory")}
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
            className="text-sm font-semibold text-[#8b6a55] border-b-2 border-transparent hover:border-[#8b6a55] transition-all py-1 px-2"
          >
            {tSearch("filters.reset")}
          </button>
        </div>
      )}

      {/* Result Count Status Row */}
      {query && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border-low/40">
          <p className="text-on-surface-subtle font-medium text-base">
            {tSearch.rich("found_results", {
              count,
              query,
              strong: (chunks: React.ReactNode) => <strong className="text-[#f1bb9d] font-semibold">{chunks}</strong>
            })}
          </p>
        </div>
      )}

      {/* Trending Section */}
      <div className="pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="mr-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/72">
            <IoTrendingUp className="text-[#8b6a55] text-base" />
            {tSearch("trending.title")}:
          </span>

          {isLoadingTrending ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-9 w-24 bg-surface-container-low/50 rounded-xl animate-pulse" />
            ))
          ) : trending.map((item: string, idx: number) => {
            const isSelected = query === item;
            return (
              <Link
                key={idx}
                href={`${ROUTES.SEARCH}?q=${encodeURIComponent(item)}`}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 scale-100 hover:scale-105",
                  isSelected
                    ? "bg-[#8b6a55] text-white shadow-black/30"
                    : "border border-border-low/40 bg-surface-container-low/70 text-white/82 hover:bg-surface-container-high/90"
                )}
              >
                {idx < 2 && <IoFlashOutline className="text-amber-500 text-sm" />}
                <span>{item}</span>
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
  <div className="flex items-center gap-2 px-4 py-2 bg-[#8b6a55]/10 text-[#8b6a55] rounded-xl text-sm font-black border border-[#8b6a55]/20 shadow-sm transition-all hover:bg-[#8b6a55]/20">
    <span>{label}</span>
    <button onClick={onRemove} className="hover:rotate-90 transition-transform">
      <IoCloseOutline className="text-lg" />
    </button>
  </div>
);
