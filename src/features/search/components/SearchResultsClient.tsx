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
import { useSearchDiscoveryGrid } from "../hooks/use-search-discovery-grid";
import { SearchFiltersSheet } from "./SearchFiltersSheet";
import { Select, type SelectOption } from "@/components/ui/Select";
import { cn } from "@/utils/string";
import { IoStar } from "react-icons/io5";
import StandardPagination from "@/components/ui/pagination/StandardPagination";

interface SearchResultsClientProps {
  initialQuery: string;
}

// Helper to safely parse numbers from URL
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
  
  // Drawer State — nonce để remount sheet, tránh setState trong effect khi mở lại
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterSheetNonce, setFilterSheetNonce] = useState(0);

  // --- URL State Management ---
  const q = searchParams.get("q") ?? initialQuery;
  const type = (searchParams.get("type") as "all" | SearchResultType) || "all";
  const sort = (searchParams.get("sort") as SearchSortOption) || "popular";
  const page = safeParseNumber(searchParams.get("page")) || 1;
  
  const filters = useMemo((): SearchFilters => ({
    minPrice: safeParseNumber(searchParams.get("minPrice")),
    maxPrice: safeParseNumber(searchParams.get("maxPrice")),
    rating: safeParseNumber(searchParams.get("rating")),
    category: safeParseNumber(searchParams.get("category")),
    district: searchParams.get("district") || undefined,
  }), [searchParams]);

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
    updateUrl({ type: newType, page: 1, category: undefined, district: undefined });
  };

  const handleSearch = (newQuery: string) => {
    updateUrl({ q: newQuery, page: 1 });
  };

  const handleSortChange = (option: SelectOption | null) => {
    if (option) {
      updateUrl({ sort: option.value, page: 1 });
    }
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    updateUrl({
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      rating: newFilters.rating,
      category: newFilters.category,
      district: newFilters.district,
      page: 1,
    });
  };

  const handleRemoveFilter = (key: string) => {
    updateUrl({ [key]: undefined, page: 1 });
  };

  const clearFilters = () => {
    updateUrl({
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      category: undefined,
      district: undefined,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
  };

  // --- Data Fetching ---
  const { results, isLoading, counts, meta } = useSearch({ q, type, sort, filters, page });

  const totalPages = meta?.last_page || 1;

  /** Khi không có q, /search không chạy — lấy featured để lấp grid Khám phá (tránh grid rỗng). */
  const { data: discoveryGridResults = [], isLoading: isDiscoveryGridLoading } = useSearchDiscoveryGrid(
    !q.trim(),
    locale
  );
  const sortOptions: SelectOption[] = [
    { value: "popular", label: tSearch("sort.popularity") },
    { value: "newest", label: tSearch("sort.newest") },
    { value: "price_asc", label: tSearch("sort.price_low") },
    { value: "price_desc", label: tSearch("sort.price_high") },
    { value: "rating_desc", label: tSearch("sort.rating") },
  ];

  const currentSortOption = sortOptions.find(opt => opt.value === sort) || sortOptions[0];

  return (
    <div className="reveal-up space-y-8">
      {/* Search Header with Inline Input */}
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
        isLoading={isLoading}
      />

      {/* Main Results Container */}
      {q.trim() ? (
        <div className={cn("transition-all duration-500", q ? "opacity-100" : "opacity-0 h-0 overflow-hidden")}>
          {results.length > 0 ? (
            <>
              <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <SearchTabs 
                  activeType={type} 
                  onChange={handleTypeChange} 
                  counts={counts}
                />
                
                <div className="w-full md:w-64">
                   <Select 
                     options={sortOptions}
                     value={currentSortOption}
                     onChange={handleSortChange}
                     containerClassName="bg-surface-container-low rounded-xl border border-[#262626] p-0 px-4"
                     className="bg-transparent"
                     placeholder={tSearch("sort.label")}
                   />
                </div>
              </div>

              <SearchGrid 
                results={results} 
                isLoading={isLoading} 
              />

              <StandardPagination 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : !isLoading && (
            /* Empty State (Only if Query exists but no results) */
            <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest rounded-xl shadow-ambient border border-[#262626]">
              <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6 text-4xl">
                🔍
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{tSearch("empty.title")}</h2>
              <p className="text-on-surface-subtle max-w-md mx-auto">{tSearch("empty.subtitle")}</p>
            </div>
          )}
        </div>
      ) : (
        /* Discovery Section (Shown when query is empty) */
        <div className="space-y-12 py-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-[#8b6a55]">
                <IoStar className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{tSearch("discovery.title")}</h2>
                <p className="text-on-surface-subtle">{tSearch("discovery.subtitle")}</p>
              </div>
            </div>
          </div>

          <SearchGrid 
            results={discoveryGridResults.slice(0, 6)} 
            isLoading={isDiscoveryGridLoading} 
          />
        </div>
      )}

      {/* Filter Drawer / Sheet */}
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
