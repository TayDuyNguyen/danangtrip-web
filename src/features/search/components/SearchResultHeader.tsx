"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  IoCloseOutline,
  IoFlashOutline,
  IoOptionsOutline,
  IoTimeOutline,
  IoTrendingUp,
} from "@/components/icons/solar";
import { ROUTES } from "@/config";
import { cn } from "@/utils/string";
import { formatPriceVND } from "@/utils/format";
import { SearchFilters, SearchResultType } from "../types/search.types";
import { useSearchDiscovery } from "../hooks/use-search-discovery";
import { useSearchFilterCategories } from "../hooks/use-search-filter-categories";
import { SearchSuggestionsDropdown } from "@/components/common/SearchSuggestionsDropdown";
import SearchInput from "@/components/ui/SearchInput";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";
import { useSearchHistory } from "../hooks/use-search-history";
import type { SearchSuggestionItem } from "@/types/search-suggestion.types";
import { searchService } from "@/services/search.service";
import { getOrCreateSessionId } from "@/utils/session";

interface SearchResultHeaderProps {
  query: string;
  type: "all" | SearchResultType;
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
  type,
  count,
  onSearch,
  onOpenFilters,
  activeFilters,
  onRemoveFilter,
  onClearFilters,
  isLoading,
}: SearchResultHeaderProps) => {
  const router = useRouter();
  const tSearch = useTranslations("search");
  const locale = useLocale();
  const priceLocale = locale === "vi" ? "vi-VN" : "en-US";
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { history, addHistory, removeHistory, clearHistory } =
    useSearchHistory();
  const hasCategoryFilters =
    activeFilters.category !== undefined ||
    activeFilters.locationCategory !== undefined ||
    activeFilters.tourCategory !== undefined;
  const { data: categoryData } = useSearchFilterCategories(
    type,
    hasCategoryFilters,
  );
  const {
    suggestions,
    isLoading: isSuggestionsLoading,
    isError: isSuggestionsError,
  } = useSearchSuggestions(inputValue, type, activeFilters);
  const {
    insights,
    trending,
    popular,
    topLocations,
    isLoading: isDiscoveryLoading,
  } = useSearchDiscovery();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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

  const trendKeywords =
    insights.length > 0 ? insights : trending.length > 0 ? trending : popular;
  const showDiscoveryPanel = isFocused && inputValue.trim().length === 0;
  const showSuggestionsPanel = isFocused && inputValue.trim().length >= 2;
  const hasActiveFilters = Object.values(activeFilters).some(
    (value) => value !== undefined && value !== null,
  );
  const locationCategories = categoryData?.locationCategories ?? [];
  const tourCategories = categoryData?.tourCategories ?? [];
  const activeLocationCategory =
    type === "location"
      ? activeFilters.category
      : activeFilters.locationCategory;
  const activeTourCategory =
    type === "tour" ? activeFilters.category : activeFilters.tourCategory;
  const resolveCategoryName = (
    categories: Array<{ id: number; name: string }>,
    id: number | undefined,
  ) =>
    categories.find((category) => category.id === id)?.name ??
    (id !== undefined ? `#${id}` : "");

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

    router.push(
      `${ROUTES.SEARCH}?q=${encodeURIComponent(item.title)}&type=${item.type}`,
    );
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const totalItems = flatSuggestions.length;
      if (
        showSuggestionsPanel &&
        selectedIndex >= 0 &&
        selectedIndex < totalItems
      ) {
        handleSelectSuggestion(flatSuggestions[selectedIndex]);
      } else {
        commitSearch(event.currentTarget.value);
      }
      return;
    }

    if (event.key === "Escape") {
      setIsFocused(false);
      setSelectedIndex(-1);
      return;
    }

    if (!showSuggestionsPanel) {
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
  };

  const renderDiscoveryPanel = () => (
    <div className="absolute left-0 right-0 top-[calc(100%+14px)] z-50 overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-[#fafafa] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-on-surface">
              <IoTimeOutline className="text-primary" />
              <span>{tSearch("suggestions.recent_searches")}</span>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs font-semibold text-on-surface-subtle transition-colors hover:text-primary"
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
                  className="flex items-center gap-1 rounded-full border border-border bg-white pl-3 pr-2 py-2 text-sm text-on-surface shadow-sm"
                >
                  <button
                    onClick={() => commitSearch(item)}
                    className="transition-colors hover:text-primary"
                  >
                    {item}
                  </button>
                  <button
                    onClick={() => removeHistory(item)}
                    className="rounded-full p-0.5 text-on-surface-subtle transition-colors hover:text-primary"
                    aria-label={tSearch("filters.close")}
                  >
                    <IoCloseOutline className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-subtle">
              {tSearch("suggestions.loading_trending")}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-[#fafafa] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-on-surface">
            <IoTrendingUp className="text-primary" />
            <span>{tSearch("trending.title")}</span>
          </div>

          {isMounted && isDiscoveryLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-9 rounded-full bg-surface-container-low animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {trendKeywords.slice(0, 6).map((item, index) => {
                const source = "source" in item ? item.source : "keyword";
                const clickedSlug =
                  "slug" in item && typeof item.slug === "string"
                    ? item.slug
                    : undefined;
                return (
                  <button
                    key={`${item.query}-${index}`}
                    onClick={() => {
                      void searchService.trackInteraction({
                        event: "trending_click",
                        query: item.query,
                        type: "all",
                        clicked_title: item.query,
                        clicked_slug: clickedSlug,
                        clicked_type:
                          source === "tour" || source === "location"
                            ? source
                            : "keyword",
                        source: "search_discovery_panel",
                        session_id: getOrCreateSessionId(),
                      });

                      if (
                        (source === "tour" || source === "location") &&
                        clickedSlug
                      ) {
                        router.push(
                          source === "tour"
                            ? ROUTES.TOUR_DETAIL(clickedSlug)
                            : ROUTES.LOCATION_DETAIL(clickedSlug),
                        );
                      } else {
                        commitSearch(item.query);
                      }
                    }}
                    className="rounded-full border border-border bg-white px-3 py-2 text-sm font-medium text-on-surface transition-all hover:border-primary hover:bg-[#fff4f6]"
                  >
                    {item.query}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {topLocations.length > 0 && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-subtle">
            <IoFlashOutline className="text-primary" />
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
                  if (item.slug) {
                    router.push(ROUTES.LOCATION_DETAIL(item.slug));
                  } else {
                    commitSearch(item.query);
                  }
                }}
                className="rounded-xl border border-border bg-white px-3 py-2 text-left text-sm text-on-surface transition-all hover:border-primary/70 hover:bg-[#fff4f6]"
              >
                <div className="font-semibold">{item.query}</div>
                <div className="text-xs text-on-surface-subtle">
                  {item.district || tSearch("tabs.location")}
                </div>
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
              onSubmit={commitSearch}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder={tSearch("suggestions.search_placeholder")}
              isLoading={isLoading}
              className="m-0"
              label={tSearch("input_label")}
              actionText={tSearch("input_action")}
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
            className="flex items-center justify-center gap-2 rounded-[20px] border border-border bg-white px-6 py-3 font-semibold text-on-surface shadow-sm transition-all hover:bg-[#f7f7f7] hover:border-primary/25 active:scale-95"
          >
            <IoOptionsOutline className="text-xl" />
            {tSearch("filters.title")}
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
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
              label={`${tSearch("filters.price_range")}: >${formatPriceVND(activeFilters.minPrice, priceLocale)}`}
              onRemove={() => onRemoveFilter("minPrice")}
            />
          )}
          {activeFilters.maxPrice !== undefined && (
            <FilterTag
              label={`${tSearch("filters.price_range")}: <${formatPriceVND(activeFilters.maxPrice, priceLocale)}`}
              onRemove={() => onRemoveFilter("maxPrice")}
            />
          )}
          {activeFilters.rating !== undefined && (
            <FilterTag
              label={`${activeFilters.rating}★ ${tSearch("filters.rating")}`}
              onRemove={() => onRemoveFilter("rating")}
            />
          )}
          {type === "location" && activeLocationCategory !== undefined && (
            <FilterTag
              label={`${tSearch("filters.category")}: ${resolveCategoryName(locationCategories, activeLocationCategory)}`}
              onRemove={() => onRemoveFilter("category")}
            />
          )}
          {type === "tour" && activeTourCategory !== undefined && (
            <FilterTag
              label={`${tSearch("filters.category")}: ${resolveCategoryName(tourCategories, activeTourCategory)}`}
              onRemove={() => onRemoveFilter("category")}
            />
          )}
          {type === "all" && activeFilters.locationCategory !== undefined && (
            <FilterTag
              label={`${tSearch("filters.location_category")}: ${resolveCategoryName(locationCategories, activeFilters.locationCategory)}`}
              onRemove={() => onRemoveFilter("locationCategory")}
            />
          )}
          {type === "all" && activeFilters.tourCategory !== undefined && (
            <FilterTag
              label={`${tSearch("filters.tour_category")}: ${resolveCategoryName(tourCategories, activeFilters.tourCategory)}`}
              onRemove={() => onRemoveFilter("tourCategory")}
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
            className="text-sm font-black text-primary border-b-2 border-transparent hover:border-primary transition-all py-1 px-2"
          >
            {tSearch("filters.reset")}
          </button>
        </div>
      )}

      <div className="pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-black text-on-surface-subtle uppercase tracking-widest mr-2 flex items-center gap-2">
            <IoTrendingUp className="text-primary text-xl" />
            {tSearch("trending.title")}:
          </span>

          {/* Only render loading skeletons after client mount to avoid hydration mismatch */}
          {isMounted && isDiscoveryLoading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-24 bg-surface-container-low rounded-xl animate-pulse"
                  />
                ))
            : trendKeywords.slice(0, 8).map((item, index) => {
                const isSelected =
                  query.trim().toLowerCase() ===
                  item.query.trim().toLowerCase();
                const source = "source" in item ? item.source : "keyword";
                const clickedSlug =
                  "slug" in item && typeof item.slug === "string"
                    ? item.slug
                    : undefined;
                const href =
                  (source === "tour" || source === "location") && clickedSlug
                    ? source === "tour"
                      ? ROUTES.TOUR_DETAIL(clickedSlug)
                      : ROUTES.LOCATION_DETAIL(clickedSlug)
                    : `${ROUTES.SEARCH}?q=${encodeURIComponent(item.query)}`;

                return (
                  <Link
                    key={`${item.query}-${index}`}
                    href={href as string & {}}
                    onClick={() => {
                      const clickedType =
                        source === "tour" || source === "location"
                          ? source
                          : "keyword";
                      void searchService.trackInteraction({
                        event: "trending_click",
                        query: item.query,
                        type: "all",
                        clicked_title: item.query,
                        clicked_slug: clickedSlug,
                        clicked_type: clickedType,
                        source: "search_trending_chips",
                        session_id: getOrCreateSessionId(),
                      });
                    }}
                    className={cn(
                      "flex scale-100 items-center gap-2 rounded-xl border px-5 py-2 text-sm font-black transition-all duration-300 hover:scale-105",
                      isSelected
                        ? "border-primary/20 bg-[#fff1f3] text-primary shadow-[0_10px_28px_rgba(255,56,92,0.12)]"
                        : "border-border bg-[#fafafa] text-on-surface-subtle hover:border-primary/25 hover:bg-white hover:text-on-surface",
                    )}
                  >
                    {index < 2 && <IoFlashOutline className="text-amber-500" />}
                    <span>{item.query}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px]",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "bg-white text-on-surface-subtle",
                      )}
                    >
                      {item.count}
                    </span>
                  </Link>
                );
              })}
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
                    <strong className="text-on-surface font-semibold">
                      {chunks}
                    </strong>
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
  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-black border border-primary/20 shadow-sm transition-all hover:bg-primary/20">
    <span>{label}</span>
    <button onClick={onRemove} className="hover:rotate-90 transition-transform">
      <IoCloseOutline className="text-lg" />
    </button>
  </div>
);
