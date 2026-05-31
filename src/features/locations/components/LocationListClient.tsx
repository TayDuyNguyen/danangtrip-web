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

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const q = searchParams.get("q") || "";
  const categoriesParam = searchParams.get("categories") || searchParams.get("category");
  const categories = useMemo(() => (categoriesParam ? categoriesParam.split(",").map(Number) : []), [categoriesParam]);

  const districtsParam = searchParams.get("districts");
  const districts = useMemo(() => (districtsParam ? districtsParam.split(",") : []), [districtsParam]);

  const priceLevel = Number(searchParams.get("price_level")) || undefined;
  const minRating = Number(searchParams.get("min_rating")) || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort_by") || "avg_rating";
  const order = (searchParams.get("sort_order") as "asc" | "desc") || "desc";

  const queryParams = useMemo(
    () => ({
      q,
      categories,
      districts,
      priceLevel,
      minRating,
      page,
      sortBy,
      order,
    }),
    [q, categories, districts, priceLevel, minRating, page, sortBy, order]
  );

  const { locations, pagination, isLoading } = useLocations(queryParams);
  const { data: rawCategories } = useLocationCategories();
  const { data: filterStats } = useLocationFilterStats();
  const categoryList = extractItems<Category>(rawCategories);

  const totalPages = pagination.lastPage || 1;

  const updateFilters = useCallback(
    (updates: Record<string, string | string[] | number[] | null>) => {
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

      if (!updates.page) {
        params.set("page", "1");
      }

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl);
    },
    [pathname, router, searchParams]
  );

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
    <div className="w-full pb-24 pt-2">
      <LocationHeader
        count={pagination.total}
        onSearch={handleSearch}
        onOpenFilters={() => setIsMobileFiltersOpen(true)}
        hasActiveFilters={hasActiveFilters}
        isLoading={isLoading && page === 1}
        query={q}
      />

      <div className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[320px_1fr]">
        <aside className="hidden md:block">
          <div className="lg:sticky lg:top-32">
            <LocationFilters {...filterProps} />
          </div>
        </aside>

        <main className="flex-1">
          <LocationGrid locations={locations} isLoading={isLoading} />

          <StandardPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </main>
      </div>

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[3px]" onClick={() => setIsMobileFiltersOpen(false)} />

          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col overflow-hidden rounded-l-[32px] border-l border-border bg-white shadow-[0_24px_64px_rgba(15,23,42,0.16)] animate-in slide-in-from-right duration-300">
            <div className="shrink-0 border-b border-border px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-[0.24em] text-on-surface-subtle">
                    {t("filters.title")}
                  </span>
                  <p className="mt-1 text-sm text-on-surface-subtle">{t("subtitle")}</p>
                </div>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#fafafa] text-on-surface-subtle transition-colors hover:border-primary/25 hover:bg-white hover:text-on-surface"
                  aria-label={t("filters.close")}
                >
                  x
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <LocationFilters {...filterProps} />
            </div>

            <div className="shrink-0 border-t border-border bg-[#fcfcfc] px-6 py-5">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full rounded-[20px] bg-primary py-4 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(255,56,92,0.18)] transition-all hover:bg-primary/90"
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
