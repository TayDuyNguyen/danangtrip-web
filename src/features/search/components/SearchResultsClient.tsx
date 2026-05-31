"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SearchTabs } from "./SearchTabs";
import { SearchResultHeader } from "./SearchResultHeader";
import { SearchGrid } from "./SearchGrid";
import { SearchResultType, SearchSortOption, SearchFilters } from "../types/search.types";
import { useSearch } from "../hooks/use-search";
import { useSearchDiscovery } from "../hooks/use-search-discovery";
import { useSearchDiscoveryGrid } from "../hooks/use-search-discovery-grid";
import { SearchFiltersSheet } from "./SearchFiltersSheet";
import { Loading } from "@/components/ui";
import { Select, type SelectOption } from "@/components/ui/Select";
import { cn } from "@/utils/string";
import StandardPagination from "@/components/ui/pagination/StandardPagination";
import { searchService } from "@/services/search.service";
import { getOrCreateSessionId } from "@/utils/session";

interface SearchResultsClientProps {
  initialQuery: string;
}

const safeParseNumber = (val: string | null): number | undefined => {
  if (!val) return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

export const SearchResultsClient = ({ initialQuery }: SearchResultsClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const tSearch = useTranslations("search");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterSheetNonce, setFilterSheetNonce] = useState(0);

  const q = searchParams.get("q") ?? initialQuery;
  const type = (searchParams.get("type") as "all" | SearchResultType) || "all";
  const sort = (searchParams.get("sort") as SearchSortOption) || "popular";
  const page = safeParseNumber(searchParams.get("page")) || 1;

  const filters = useMemo(
    (): SearchFilters => ({
      minPrice: safeParseNumber(searchParams.get("minPrice")),
      maxPrice: safeParseNumber(searchParams.get("maxPrice")),
      rating: safeParseNumber(searchParams.get("rating")),
      category: safeParseNumber(searchParams.get("category")),
      locationCategory: safeParseNumber(searchParams.get("locationCategory")),
      tourCategory: safeParseNumber(searchParams.get("tourCategory")),
      district: searchParams.get("district") || undefined,
    }),
    [searchParams]
  );

  const updateUrl = (updates: Record<string, string | number | undefined | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleTypeChange = (newType: "all" | SearchResultType) => {
    const nextUpdates: Record<string, string | number | undefined | null> = {
      type: newType,
      page: 1,
    };

    if (newType === "all") {
      nextUpdates.locationCategory = type === "location" ? filters.category : filters.locationCategory;
      nextUpdates.tourCategory = type === "tour" ? filters.category : filters.tourCategory;
      nextUpdates.category = undefined;
    } else if (newType === "location") {
      nextUpdates.category = type === "all" ? filters.locationCategory : filters.category;
      nextUpdates.locationCategory = undefined;
      nextUpdates.tourCategory = undefined;
    } else {
      nextUpdates.category = type === "all" ? filters.tourCategory : filters.category;
      nextUpdates.locationCategory = undefined;
      nextUpdates.tourCategory = undefined;
      nextUpdates.district = undefined;
    }

    updateUrl(nextUpdates);
  };

  const handleSearch = (newQuery: string) => updateUrl({ q: newQuery, page: 1 });

  const handleSortChange = (option: SelectOption | null) => {
    if (option) updateUrl({ sort: option.value, page: 1 });
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    updateUrl({
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      rating: newFilters.rating,
      category: newFilters.category,
      locationCategory: newFilters.locationCategory,
      tourCategory: newFilters.tourCategory,
      district: newFilters.district,
      page: 1,
    });
  };

  const handleRemoveFilter = (key: string) => updateUrl({ [key]: undefined, page: 1 });

  const clearFilters = () =>
    updateUrl({
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      category: undefined,
      locationCategory: undefined,
      tourCategory: undefined,
      district: undefined,
      page: 1,
    });

  const handlePageChange = (newPage: number) => updateUrl({ page: newPage });

  const { results, isLoading, isFetching, counts, meta } = useSearch({ q, type, sort, filters, page });
  const isRefreshing = isFetching && !isLoading;

  const totalPages = (() => {
    const fromMeta = meta?.last_page;
    if (fromMeta && fromMeta > 0) return fromMeta;
    const perPage = type === "all" ? 12 : 10;
    const total = type === "all" ? counts.all : type === "tour" ? counts.tour : counts.location;
    return total > 0 ? Math.ceil(total / perPage) : 1;
  })();

  const isSearchMode = !!q.trim() || type !== "all";

  const { data: discoveryGridResults = [], isLoading: isDiscoveryGridLoading } = useSearchDiscoveryGrid(
    !isSearchMode,
    locale
  );
  const { insights, trending, popular } = useSearchDiscovery();
  const trendKeywords = insights.length > 0 ? insights : trending.length > 0 ? trending : popular;

  const sortOptions: SelectOption[] = [
    { value: "popular", label: tSearch("sort.popularity") },
    { value: "newest", label: tSearch("sort.newest") },
    { value: "price_asc", label: tSearch("sort.price_low") },
    { value: "price_desc", label: tSearch("sort.price_high") },
    { value: "rating_desc", label: tSearch("sort.rating") },
  ];

  const currentSortOption = sortOptions.find((opt) => opt.value === sort) || sortOptions[0];

  const handleResultClick = (item: import("../types/search.types").SearchResult) => {
    void searchService.trackInteraction({
      event: "result_click",
      query: q.trim(),
      type,
      clicked_title: item.title,
      clicked_slug: item.slug,
      clicked_type: item.type,
      source: "search_results_grid",
      session_id: getOrCreateSessionId(),
      page,
    });
  };

  return (
    <div className="reveal-up space-y-8">
      <SearchResultHeader
        query={q}
        count={counts.all}
        onSearch={handleSearch}
        onOpenFilters={() => {
          setFilterSheetNonce((n) => n + 1);
          setIsFilterOpen(true);
        }}
        activeFilters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearFilters={clearFilters}
        isLoading={isFetching}
      />

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <SearchTabs
          activeType={type}
          onChange={handleTypeChange}
          counts={counts.all > 0 || counts.tour > 0 || counts.location > 0 ? counts : undefined}
        />
        {isSearchMode && (
          <div className="w-full md:w-60">
            <Select
              options={sortOptions}
              value={currentSortOption}
              onChange={handleSortChange}
              containerClassName="rounded-[22px] border border-border bg-white px-4 py-1 shadow-sm"
              className="bg-transparent"
              variant="minimal"
              placeholder={tSearch("sort.label")}
            />
          </div>
        )}
      </div>

      {isSearchMode ? (
        <div className="transition-all duration-500">
          {isLoading ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-border bg-[#fafafa] shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <Loading type="spokes" color="#FF385C" height={56} width={56} />
            </div>
          ) : results.length > 0 ? (
            <div className="relative">
              {isRefreshing && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-white/70 backdrop-blur-[2px]">
                  <Loading type="spokes" color="#FF385C" height={48} width={48} />
                </div>
              )}
              <div className={cn("transition-opacity duration-200", isRefreshing ? "opacity-60" : "opacity-100")}>
                <SearchGrid results={results} isLoading={false} onResultClick={handleResultClick} />
                <StandardPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-border bg-white px-6 py-20 text-center shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-5 h-16 w-16 rounded-full bg-[#fff1f3] shadow-sm" />
              <h2 className="mb-2 text-xl font-semibold text-on-surface">{tSearch("empty.title")}</h2>
              <p className="mx-auto max-w-md text-sm text-on-surface-subtle">{tSearch("empty.subtitle")}</p>
              {trendKeywords.length > 0 && (
                <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
                  {trendKeywords.slice(0, 5).map((item, index) => (
                    <button
                      key={`${item.query}-${index}`}
                      onClick={() => {
                        void searchService.trackInteraction({
                          event: "trending_click",
                          query: item.query,
                          type: "all",
                          clicked_title: item.query,
                          clicked_type: "keyword",
                          source: "search_empty_state",
                          session_id: getOrCreateSessionId(),
                        });
                        updateUrl({ q: item.query, page: 1 });
                      }}
                      className="rounded-full border border-border bg-[#fafafa] px-3 py-2 text-sm font-medium text-on-surface transition-all hover:border-primary/40 hover:bg-[#fff4f6] hover:text-primary"
                    >
                      {item.query}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 py-4">
          <div className="space-y-3 rounded-[28px] border border-border bg-[#fcfcfc] p-6 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
            <h1 className="text-3xl font-semibold leading-none tracking-tight text-on-surface md:text-4xl">
              {tSearch("discovery.title")}
            </h1>
            <p className="max-w-2xl text-sm font-normal leading-relaxed text-on-surface-subtle">
              {tSearch("discovery.subtitle")}
            </p>
          </div>

          <SearchGrid results={discoveryGridResults.slice(0, 6)} isLoading={isDiscoveryGridLoading} />
        </div>
      )}

      <SearchFiltersSheet
        key={filterSheetNonce}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={filters}
        onApply={handleFilterChange}
        searchType={type}
      />
    </div>
  );
};
