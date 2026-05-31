"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { IoChevronDownOutline } from "@/components/icons/solar";
import { cn } from "@/utils/string";
import { extractItems } from "@/utils";
import { Category, SubCategory } from "@/types";
import { PUBLIC_ROUTES } from "@/config/routes";
import {
  useLocationCategories,
  useCategoryLocations,
  useLocationFilterStats,
} from "@/features/locations/hooks/use-locations";
import LocationGrid from "@/features/locations/components/LocationGrid";
import LocationFilters from "@/features/locations/components/LocationFilters";
import StandardPagination from "@/components/ui/pagination/StandardPagination";
import { CategoryIconRenderer } from "@/utils/category-icon";

interface Props {
  slug: string;
}

export default function CategoryLocationListClient({ slug }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("locations");

  const { data: rawCategories, isLoading: isCategoriesLoading } = useLocationCategories();
  const { data: filterStats } = useLocationFilterStats();
  const categoryList = extractItems<Category>(rawCategories);

  const currentCategory = useMemo(
    () => categoryList.find((c) => c.slug === slug),
    [categoryList, slug]
  );

  const q = searchParams.get("q") || "";
  const subcategoryId = searchParams.get("subcategory_id")
    ? Number(searchParams.get("subcategory_id"))
    : undefined;

  const districtsParam = searchParams.get("districts");
  const districts = useMemo(() => (districtsParam ? districtsParam.split(",") : []), [districtsParam]);

  const priceLevel = Number(searchParams.get("price_level")) || undefined;
  const minRating = Number(searchParams.get("min_rating")) || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort_by") || "created_at";
  const order = (searchParams.get("sort_order") as "asc" | "desc") || "desc";

  const queryParams = useMemo(
    () => ({
      q,
      subcategory_id: subcategoryId,
      districts,
      priceLevel,
      minRating,
      page,
      sortBy,
      order,
      perPage: 12,
    }),
    [q, subcategoryId, districts, priceLevel, minRating, page, sortBy, order]
  );

  const { locations, pagination, isLoading: isLocationsLoading } = useCategoryLocations(slug, queryParams);

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

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: String(newPage) });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isCategoriesLoading) {
    return (
      <div className="w-full animate-pulse space-y-8 py-8">
        <div className="h-48 rounded-[32px] border border-border bg-[#f3f4f6]" />
        <div className="h-10 w-2/3 rounded-lg bg-[#eceff3]" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[320px_1fr]">
          <div className="h-96 rounded-[28px] border border-border bg-[#f3f4f6]" />
          <div className="space-y-4">
            <div className="h-12 rounded-lg bg-[#eceff3]" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-[28px] border border-border bg-[#f3f4f6]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-6 py-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-[#fff1f3]">
          <span className="text-3xl text-primary">?</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-on-surface">{t("detail.not_found")}</h2>
          <p className="max-w-md text-on-surface-subtle">{t("category.no_locations")}</p>
        </div>
        <Link
          href={PUBLIC_ROUTES.LOCATIONS}
          className="rounded-full bg-primary px-8 py-3 font-semibold text-white transition-all hover:bg-primary/90 active:scale-95"
        >
          {t("category.fallback_cta")}
        </Link>
      </div>
    );
  }

  const activeSubcategories = currentCategory.subcategories || [];

  return (
    <div className="w-full pb-24 pt-8">
      <div className="reveal-up reveal-delay-100 relative mb-10 overflow-hidden rounded-[32px] border border-border bg-white p-8 shadow-[0_24px_64px_rgba(15,23,42,0.08)] md:p-12">
        <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />

        <div className="relative z-10 space-y-6">
          <nav
            className="flex items-center text-xs font-semibold uppercase tracking-wider text-on-surface-subtle/70"
            aria-label="breadcrumb"
          >
            <Link href={PUBLIC_ROUTES.HOME} className="transition-colors hover:text-primary">
              {t("category.breadcrumb_home")}
            </Link>
            <span className="mx-2 text-on-surface-subtle/40">/</span>
            <Link href={PUBLIC_ROUTES.LOCATIONS} className="transition-colors hover:text-primary">
              {t("category.breadcrumb_locations")}
            </Link>
            <span className="mx-2 text-on-surface-subtle/40">/</span>
            <span className="text-on-surface">{currentCategory.name}</span>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-[#fafafa] text-on-surface shadow-sm">
              <CategoryIconRenderer icon={currentCategory.icon} className="text-3xl text-primary" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-on-surface md:text-4xl">
                {currentCategory.name}
              </h1>
              {currentCategory.description && (
                <p className="max-w-2xl text-sm leading-relaxed text-on-surface-subtle">
                  {currentCategory.description}
                </p>
              )}
              <div className="mt-2 inline-flex items-center rounded-full border border-border bg-[#fafafa] px-4 py-1.5 text-xs font-semibold text-on-surface-subtle shadow-sm">
                {pagination.total > 0
                  ? t("category.results_count", { count: pagination.total })
                  : t("category.no_locations")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeSubcategories.length > 0 && (
        <div className="reveal-up reveal-delay-200 mb-8 space-y-3">
          <h3 className="pl-1 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-subtle/60">
            {t("category.subcategories_title")}
          </h3>
          <div className="scrollbar-none flex max-w-full items-center gap-3 overflow-x-auto pb-4">
            <button
              onClick={() => updateFilters({ subcategory_id: null })}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-300 active:scale-95",
                subcategoryId === undefined
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-on-surface-subtle hover:border-primary hover:text-primary"
              )}
            >
              {t("filters.all")}
            </button>
            {activeSubcategories.map((sub: SubCategory) => (
              <button
                key={sub.id}
                onClick={() => updateFilters({ subcategory_id: String(sub.id) })}
                className={cn(
                  "shrink-0 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-300 active:scale-95",
                  subcategoryId === sub.id
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-on-surface-subtle hover:border-primary hover:text-primary"
                )}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="reveal-up reveal-delay-300 grid grid-cols-1 gap-8 py-2 lg:grid-cols-[320px_1fr]">
        <aside>
          <div className="lg:sticky lg:top-24">
            <LocationFilters
              activeDistricts={districts}
              activePriceLevel={priceLevel}
              activeRating={minRating}
              hideCategories
              filterStats={filterStats}
              onDistrictsChange={(dists) => updateFilters({ districts: dists })}
              onPriceLevelChange={(level) => updateFilters({ price_level: level ? String(level) : null })}
              onRatingChange={(rating) => updateFilters({ min_rating: rating ? String(rating) : null })}
              onReset={() =>
                updateFilters({
                  subcategory_id: null,
                  districts: null,
                  price_level: null,
                  min_rating: null,
                  q: null,
                })
              }
            />
          </div>
        </aside>

        <main className="flex-1 space-y-8">
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
            <div className="text-sm font-semibold text-on-surface-subtle">
              {q ? (
                t("category.results_count_search", {
                  count: pagination.total,
                  category: currentCategory?.name || "",
                })
              ) : (
                <>
                  <span className="font-semibold text-on-surface">{pagination.total}</span> {t("locations_count")}
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="sort_by" className="text-xs font-semibold uppercase tracking-wider text-on-surface-subtle/60">
                {t("sorting.label")}
              </label>
              <div className="relative">
                <select
                  id="sort_by"
                  value={`${sortBy}-${order}`}
                  onChange={(e) => {
                    const [newSort, newOrder] = e.target.value.split("-");
                    updateFilters({ sort_by: newSort, sort_order: newOrder });
                  }}
                  className="cursor-pointer appearance-none rounded-xl border border-border bg-white px-4 py-2.5 pr-10 text-xs font-semibold text-on-surface outline-none shadow-sm transition-colors hover:border-primary"
                >
                  <option value="created_at-desc">{t("sorting.latest")}</option>
                  <option value="avg_rating-desc">{t("sorting.rating_high")}</option>
                  <option value="review_count-desc">{t("sorting.most_reviews")}</option>
                  <option value="view_count-desc">{t("sorting.most_views")}</option>
                  <option value="price_min-asc">{t("sorting.price_low_high")}</option>
                  <option value="price_min-desc">{t("sorting.price_high_low")}</option>
                </select>
                <IoChevronDownOutline className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-subtle/60" />
              </div>
            </div>
          </div>

          <LocationGrid locations={locations} isLoading={isLocationsLoading} />

          {pagination.lastPage > 1 && (
            <StandardPagination currentPage={page} totalPages={pagination.lastPage} onPageChange={handlePageChange} />
          )}
        </main>
      </div>
    </div>
  );
}
