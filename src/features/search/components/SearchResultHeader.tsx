"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  IoCloseOutline,
  IoFlashOutline,
  IoOptionsOutline,
  IoTimeOutline,
  IoTrendingUp,
} from "@/components/icons/solar";
import { ROUTES } from "@/config";
import { cn } from "@/utils/string";
import { formatNumber } from "@/utils/format";
import { SearchFilters } from "../types/search.types";
import { useSearchDiscovery } from "../hooks/use-search-discovery";
import { SearchSuggestionsDropdown } from "@/components/common/SearchSuggestionsDropdown";
import SearchInput from "@/components/ui/SearchInput";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";
import { useSearchHistory } from "../hooks/use-search-history";
import type { SearchSuggestionItem } from "@/types/search-suggestion.types";
import { searchService } from "@/services/search.service";
import { getOrCreateSessionId } from "@/utils/session";

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
  isLoading,
}: SearchResultHeaderProps) => {
  const tSearch = useTranslations("search");
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory();
  const { suggestions, isLoading: isSuggestionsLoading, isError: isSuggestionsError } =
    useSearchSuggestions(inputValue, "all");
  const { insights, trending, popular, topLocations, isLoading: isDiscoveryLoading } = useSearchDiscovery();

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const flatSuggestions = useMemo(() => {
    const keywordItems = suggestions?.keywords ?? [];
    const locationItems = suggestions?.locations ?? [];
    const tourItems = suggestions?.tours ?? [];
    return [...keywordItems, ...locationItems, ...tourItems];
  }, [suggestions]);

  const trendKeywords = insights.length > 0 ? insights : trending.length > 0 ? trending : popular;
  const showDiscoveryPanel = isFocused && inputValue.trim().length === 0;
  const showSuggestionsPanel = isFocused && inputValue.trim().length >= 2;
  const hasActiveFilters = Object.values(activeFilters).some((value) => value !== undefined && value !== null);

  const commitSearch = (rawValue: string) => {
    const normalizedValue = rawValue.trim();
    setInputValue(normalizedValue);
    setSelectedIndex(-1);
    setIsFocused(false);
    onSearch(normalizedValue);

    if (normalizedValue) {
      addHistory(normalizedValue);
    }
  };

  const handleSelectSuggestion = (item: SearchSuggestionItem) => {
    void searchService.trackInteraction({
      event: "suggestion_click",
      query: inputValue.trim(),
      type: "all",
      clicked_title: item.title,
      clicked_slug: item.slug,
      clicked_type: item.type,
      source: "search_dropdown",
      session_id: getOrCreateSessionId(),
    });
    commitSearch(item.title);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (!showSuggestionsPanel) {
      if (event.key === "Escape") {
        setIsFocused(false);
      }
      return;
    }

    const totalItems = flatSuggestions.length;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems ? prev + 1 : 0));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (selectedIndex >= 0 && selectedIndex < totalItems) {
        handleSelectSuggestion(flatSuggestions[selectedIndex]);
        return;
      }

      commitSearch(inputValue);
      return;
    }

    if (event.key === "Escape") {
      setIsFocused(false);
      setSelectedIndex(-1);
    }
  };

  const renderDiscoveryPanel = () => (
    <div className="absolute left-0 right-0 top-[110%] z-50 overflow-hidden rounded-2xl border border-[#262626] bg-[#0f0f0f]/95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#262626] bg-[#121212]/90 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <IoTimeOutline className="text-[#8b6a55]" />
              <span>{tSearch("suggestions.recent_searches")}</span>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs font-semibold text-[#a89080] transition-colors hover:text-[#e7bea6]"
              >
                {tSearch("suggestions.clear_history")}
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {history.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1 rounded-full border border-[#3a2e28] bg-[#171717] pl-3 pr-2 py-2 text-sm text-[#e5e2e1]"
                >
                  <button onClick={() => commitSearch(item)} className="transition-colors hover:text-white">
                    {item}
                  </button>
                  <button
                    onClick={() => removeHistory(item)}
                    className="rounded-full p-0.5 text-[#737373] transition-colors hover:text-[#e7bea6]"
                    aria-label={tSearch("filters.close")}
                  >
                    <IoCloseOutline className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-subtle">{tSearch("suggestions.loading_trending")}</p>
          )}
        </div>

        <div className="rounded-2xl border border-[#262626] bg-[#121212]/90 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <IoTrendingUp className="text-[#8b6a55]" />
            <span>{tSearch("trending.title")}</span>
          </div>

          {isDiscoveryLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-9 rounded-full bg-surface-container-low animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {trendKeywords.slice(0, 6).map((item, index) => (
                <button
                  key={`${item.query}-${index}`}
                  onClick={() => {
                    void searchService.trackInteraction({
                      event: "trending_click",
                      query: item.query,
                      type: "all",
                      clicked_title: item.query,
                      clicked_type: "keyword",
                      source: "search_discovery_panel",
                      session_id: getOrCreateSessionId(),
                    });
                    commitSearch(item.query);
                  }}
                  className="rounded-full border border-[#6b5a50]/70 px-3 py-2 text-sm font-medium text-[#e5e2e1] transition-all hover:border-[#8b6a55] hover:bg-[#8b6a55]/10"
                >
                  {item.query}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {topLocations.length > 0 && (
        <div className="border-t border-[#262626] px-4 pb-4 pt-3">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#a89080]">
            <IoFlashOutline className="text-[#8b6a55]" />
            <span>{tSearch("discovery.title")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topLocations.slice(0, 4).map((item, index) => (
              <button
                key={`${item.query}-${index}`}
                onClick={() => {
                  void searchService.trackInteraction({
                    event: "trending_click",
                    query: item.query,
                    type: "location",
                    clicked_title: item.query,
                    clicked_slug: item.slug,
                    clicked_type: "location",
                    source: "search_top_locations",
                    session_id: getOrCreateSessionId(),
                  });
                  commitSearch(item.query);
                }}
                className="rounded-xl border border-[#262626] bg-[#171717]/80 px-3 py-2 text-left text-sm text-[#e5e2e1] transition-all hover:border-[#8b6a55]/70 hover:bg-[#1b1b1b]"
              >
                <div className="font-semibold">{item.query}</div>
                <div className="text-xs text-[#a89080]">{item.district || tSearch("tabs.location")}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div ref={containerRef} className="relative flex-1 max-w-3xl">
            <SearchInput
              value={inputValue}
              onChange={setInputValue}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder={tSearch("suggestions.search_placeholder")}
              isLoading={isLoading}
              className="m-0"
            />

            {showSuggestionsPanel ? (
              <SearchSuggestionsDropdown
                isOpen={showSuggestionsPanel}
                isLoading={isSuggestionsLoading}
                isError={isSuggestionsError}
                suggestions={suggestions}
                query={inputValue}
                selectedIndex={selectedIndex}
                onSelect={handleSelectSuggestion}
                onViewAll={() => commitSearch(inputValue)}
              />
            ) : showDiscoveryPanel ? (
              renderDiscoveryPanel()
            ) : null}
          </div>

          <button
            onClick={onOpenFilters}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-low hover:bg-surface-container-high text-foreground font-black rounded-xl transition-all scale-100 active:scale-95 shadow-sm"
          >
            <IoOptionsOutline className="text-xl" />
            {tSearch("filters.title")}
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-[#8b6a55] text-white text-[10px] flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {activeFilters.minPrice !== undefined && (
            <FilterTag
              label={`${tSearch("filters.price_range")}: >${formatNumber(activeFilters.minPrice)}đ`}
              onRemove={() => onRemoveFilter("minPrice")}
            />
          )}
          {activeFilters.maxPrice !== undefined && (
            <FilterTag
              label={`${tSearch("filters.price_range")}: <${formatNumber(activeFilters.maxPrice)}đ`}
              onRemove={() => onRemoveFilter("maxPrice")}
            />
          )}
          {activeFilters.rating !== undefined && (
            <FilterTag
              label={`${activeFilters.rating}★ ${tSearch("filters.rating")}`}
              onRemove={() => onRemoveFilter("rating")}
            />
          )}
          {activeFilters.category !== undefined && (
            <FilterTag
              label={`${tSearch("filters.category")}: ${activeFilters.category}`}
              onRemove={() => onRemoveFilter("category")}
            />
          )}
          {activeFilters.district !== undefined && (
            <FilterTag
              label={`${tSearch("filters.district")}: ${activeFilters.district}`}
              onRemove={() => onRemoveFilter("district")}
            />
          )}
          <button
            onClick={onClearFilters}
            className="text-sm font-black text-[#8b6a55] border-b-2 border-transparent hover:border-[#8b6a55] transition-all py-1 px-2"
          >
            {tSearch("filters.reset")}
          </button>
        </div>
      )}

      <div className="pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-black text-on-surface-subtle uppercase tracking-widest mr-2 flex items-center gap-2">
            <IoTrendingUp className="text-[#8b6a55] text-xl" />
            {tSearch("trending.title")}:
          </span>

          {isDiscoveryLoading ? (
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="h-10 w-24 bg-surface-container-low rounded-xl animate-pulse" />
              ))
          ) : (
            trendKeywords.slice(0, 8).map((item, index) => {
              const isSelected = query.trim().toLowerCase() === item.query.trim().toLowerCase();

              return (
                <Link
                  key={`${item.query}-${index}`}
                  href={`${ROUTES.SEARCH}?q=${encodeURIComponent(item.query)}`}
                  onClick={() => {
                    void searchService.trackInteraction({
                      event: "trending_click",
                      query: item.query,
                      type: "all",
                      clicked_title: item.query,
                      clicked_type: "keyword",
                      source: "search_trending_chips",
                      session_id: getOrCreateSessionId(),
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black transition-all duration-300 scale-100 hover:scale-105",
                    isSelected
                      ? "bg-[#8b6a55] shadow-black/30 text-white"
                      : "bg-surface-container-low text-on-surface-subtle hover:bg-surface-container-high"
                  )}
                >
                  {index < 2 && <IoFlashOutline className="text-amber-500" />}
                  <span>{item.query}</span>
                  <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px]">{item.count}</span>
                </Link>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-1">
          <p className="text-on-surface-subtle font-medium text-lg">
            {query
              ? tSearch.rich("found_results", {
                  count,
                  query,
                  strong: (chunks: React.ReactNode) => (
                    <strong className="text-foreground font-black">{chunks}</strong>
                  ),
                })
              : tSearch("discovery.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
};

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag = ({ label, onRemove }: FilterTagProps) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-[#8b6a55]/10 text-[#8b6a55] rounded-xl text-sm font-black border border-[#8b6a55]/20 shadow-sm transition-all hover:bg-[#8b6a55]/20">
    <span>{label}</span>
    <button onClick={onRemove} className="hover:rotate-90 transition-transform">
      <IoCloseOutline className="text-lg" />
    </button>
  </div>
);
