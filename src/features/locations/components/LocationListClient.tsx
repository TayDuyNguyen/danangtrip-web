"use client";

import { useMemo, useCallback, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LocationGrid from "./LocationGrid";
import LocationHeader from "./LocationHeader";
import LocationFilters from "./LocationFilters";
import { useLocations, useLocationCategories, useLocationFilterStats } from "../hooks/use-locations";
import { debounce } from "@/utils/debounce";
import { extractItems } from "@/utils";
import { Category } from "@/types";
import StandardPagination from "@/components/ui/pagination/StandardPagination";

export default function LocationListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("locations");

  // Mobile filter drawer state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Get values from URL
  const q = searchParams.get("q") || "";
  const categoriesParam = searchParams.get("categories") || searchParams.get("category");
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
  const { data: filterStats } = useLocationFilterStats();
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

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  }, [pathname, router, searchParams]);

  const handleSearch = debounce((value: string) => {
    updateFilters({ q: value || null });
  }, 500);

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    updateFilters({
      categories: null,
      districts: null,
      price_level: null,
      min_rating: null,
      q: null,
    });
    setIsMobileFiltersOpen(false);
  };

  const hasActiveFilters = !!(q || categories.length > 0 || districts.length > 0 || priceLevel || minRating);

  const filterProps = {
    activeCategories: categories,
    activeDistricts: districts,
    activePriceLevel: priceLevel,
    activeRating: minRating,
    categories: categoryList,
    filterStats,
    onCategoriesChange: (ids: number[]) => updateFilters({ categories: ids }),
    onDistrictsChange: (dists: string[]) => updateFilters({ districts: dists }),
    onPriceLevelChange: (level?: number) => updateFilters({ price_level: level ? String(level) : null }),
    onRatingChange: (rating?: number) => updateFilters({ min_rating: rating ? String(rating) : null }),
    onReset: handleReset,
  };

  return (
    <div className="w-full pb-24 pt-8">
      <LocationHeader
        count={pagination.total}
        onSearch={handleSearch}
        onOpenFilters={() => setIsMobileFiltersOpen(true)}
        hasActiveFilters={hasActiveFilters}
        isLoading={isLoading && page === 1}
        query={q}
      />

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-16 py-8">
        {/* Desktop Sidebar — always visible on md+ */}
        <aside className="hidden md:block">
          <div className="lg:sticky lg:top-32">
            <LocationFilters {...filterProps} />
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

      {/* Mobile Filter Drawer — only renders on small screens */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative ml-auto w-full max-w-sm h-full bg-[#111111] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
              <span className="text-sm font-black text-white uppercase tracking-widest">{t("filters.title")}</span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors text-xl"
                aria-label={t("filters.close")}
              >
                ✕
              </button>
            </div>

            {/* Scrollable filter content */}
            <div className="flex-1 overflow-y-auto p-6">
              <LocationFilters {...filterProps} />
            </div>

            {/* Apply button */}
            <div className="shrink-0 px-6 py-5 border-t border-white/10">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-4 bg-[#8b6a55] hover:bg-[#7a5c48] text-white font-black rounded-xl transition-colors text-sm uppercase tracking-widest"
              >
                {t("filters.show_results", { count: pagination.total ?? 0 })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
