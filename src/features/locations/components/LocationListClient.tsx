"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import LocationGrid from "./LocationGrid";
import LocationHeader from "./LocationHeader";
import LocationFilters from "./LocationFilters";
import { useLocations, useLocationCategories } from "../hooks/use-locations";
import { debounce } from "@/utils/debounce";
import { extractItems } from "@/utils";
import { Category } from "@/types";
import StandardPagination from "@/components/ui/pagination/StandardPagination";

export default function LocationListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get values from URL
  const q = searchParams.get("q") || "";
  const categoriesParam = searchParams.get("categories");
  const categories = useMemo(() => 
    categoriesParam ? categoriesParam.split(",").map(Number) : [], 
    [categoriesParam]
  );
  
  const districtsParam = searchParams.get("districts");
  const districts = useMemo(() => 
    districtsParam ? districtsParam.split(",") : [], 
    [districtsParam]
  );

  const priceLevel = Number(searchParams.get("price_level")) || undefined;
  const minRating = Number(searchParams.get("min_rating")) || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort_by") || "avg_rating";
  const order = (searchParams.get("sort_order") as "asc" | "desc") || "desc";

  const queryParams = useMemo(() => ({
    q,
    categories,
    districts,
    priceLevel,
    minRating,
    page,
    sortBy,
    order,
  }), [q, categories, districts, priceLevel, minRating, page, sortBy, order]);

  const { locations, pagination, isLoading } = useLocations(queryParams);
  const { data: rawCategories } = useLocationCategories();
  const categoryList = extractItems<Category>(rawCategories);

  // Pagination Logic
  const totalPages = pagination.lastPage || 1;

  const updateFilters = useCallback((updates: Record<string, string | string[] | number[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else {
        params.set(key, String(value));
      }
    });

    // Reset page on filter change
    if (!updates.page) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const handleSearch = debounce((value: string) => {
    updateFilters({ q: value || null });
  }, 500);

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = !!(q || categories.length > 0 || districts.length > 0 || priceLevel || minRating);

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 pb-24 pt-32">
      <LocationHeader 
        count={pagination.total} 
        onSearch={handleSearch} 
        onOpenFilters={() => {}} 
        hasActiveFilters={hasActiveFilters}
        isLoading={isLoading && page === 1}
        query={q}
      />
      
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-32">
            <LocationFilters 
              activeCategories={categories}
              activeDistricts={districts}
              activePriceLevel={priceLevel}
              activeRating={minRating}
              categories={categoryList}
              onCategoriesChange={(ids) => updateFilters({ categories: ids })}
              onDistrictsChange={(dists) => updateFilters({ districts: dists })}
              onPriceLevelChange={(level) => updateFilters({ price_level: level ? String(level) : null })}
              onRatingChange={(rating) => updateFilters({ min_rating: rating ? String(rating) : null })}
              onReset={() => updateFilters({ 
                categories: null, 
                districts: null, 
                price_level: null, 
                min_rating: null,
                q: null 
              })}
            />
          </div>
        </aside>

        <main className="flex-1">
          <LocationGrid 
            locations={locations} 
            isLoading={isLoading} 
          />

          <StandardPagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
}
