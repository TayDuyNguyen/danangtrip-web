"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { tourService } from "@/services/tour.service";
import { locationService } from "@/services/location.service";
import type { Tour, Location } from "@/types";
import { SearchTabs } from "./SearchTabs";
import { SearchResultHeader } from "./SearchResultHeader";
import { SearchGrid } from "./SearchGrid";
import { SearchResultType, SearchSortOption, SearchFilters, TourSearchResult, LocationSearchResult } from "../types/search.types";
import { useSearch } from "../hooks/use-search";
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
  const tHome = useTranslations("home");
  
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
  const { data: discoveryGridResults = [], isLoading: isDiscoveryGridLoading } = useQuery({
    queryKey: ["search", "discovery-grid", locale],
    queryFn: async () => {
      const [toursRes, locsRes] = await Promise.all([
        tourService.getFeatured(6),
        locationService.getFeatured(6),
      ]);
      const tours = Array.isArray(toursRes.data) ? toursRes.data : [];
      const locs = Array.isArray(locsRes.data) ? locsRes.data : [];

      const mappedTours: TourSearchResult[] = (tours as Tour[]).map((tour) => ({
        id: tour.id,
        type: "tour" as const,
        title: tour.name,
        slug: tour.slug,
        thumbnail: tour.thumbnail,
        rating: parseFloat(String(tour.avg_rating ?? 0)),
        reviewCount: tour.review_count,
        price: parseFloat(String(tour.price_adult ?? 0)),
        duration: tour.duration,
        categoryName: tHome("search_type_tour"),
        bookingCount: tour.booking_count,
        featured: tour.is_featured || tour.is_hot,
        originalData: tour,
      }));

      const mappedLocs: LocationSearchResult[] = (locs as Location[]).map((loc) => ({
        id: loc.id,
        type: "location" as const,
        title: loc.name,
        slug: loc.slug,
        thumbnail: loc.thumbnail,
        rating: parseFloat(String(loc.avg_rating ?? 0)),
        reviewCount: loc.review_count,
        categoryName: tHome("search_type_location"),
        priceLevel: loc.price_level || 1,
        address: loc.address,
        viewCount: loc.view_count,
        featured: loc.is_featured,
        originalData: loc,
      }));

      const merged = [...mappedTours, ...mappedLocs];
      merged.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const scoreA =
          a.type === "tour" ? (a as TourSearchResult).bookingCount : (a as LocationSearchResult).viewCount;
        const scoreB =
          b.type === "tour" ? (b as TourSearchResult).bookingCount : (b as LocationSearchResult).viewCount;
        return scoreB - scoreA;
      });
      return merged;
    },
    enabled: !q.trim(),
    staleTime: 1000 * 60 * 5,
  });
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
                     containerClassName="bg-surface-container-low rounded-2xl border-none p-0 px-4"
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
            <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest rounded-[32px] shadow-ambient">
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
              <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-azure">
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
