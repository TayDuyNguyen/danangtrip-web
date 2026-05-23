"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { 
  IoGridOutline, 
  IoLeafOutline, 
  IoUmbrellaOutline, 
  IoBusinessOutline, 
  IoFlashOutline, 
  IoCompassOutline,
  IoChevronDownOutline
} from "@/components/icons/solar";
import { cn } from "@/utils/string";
import { extractItems } from "@/utils";
import { Category, SubCategory } from "@/types";
import { PUBLIC_ROUTES } from "@/config/routes";
import { useLocationCategories, useCategoryLocations } from "@/features/locations/hooks/use-locations";
import LocationGrid from "@/features/locations/components/LocationGrid";
import LocationFilters from "@/features/locations/components/LocationFilters";
import StandardPagination from "@/components/ui/pagination/StandardPagination";

interface Props {
  slug: string;
}

const CategoryIcon = ({ icon, className }: { icon: string | null; className?: string }) => {
  switch (icon) {
    case "mountain": return <IoLeafOutline className={className} />;
    case "beach_access": return <IoUmbrellaOutline className={className} />;
    case "fort": return <IoBusinessOutline className={className} />;
    case "trending_up": return <IoFlashOutline className={className} />;
    case "adventure": return <IoCompassOutline className={className} />;
    default: return <IoGridOutline className={className} />;
  }
};

export default function CategoryLocationListClient({ slug }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("locations");

  // Get active categories list to locate our current category detail
  const { data: rawCategories, isLoading: isCategoriesLoading } = useLocationCategories();
  const categoryList = extractItems<Category>(rawCategories);
  
  const currentCategory = useMemo(() => 
    categoryList.find(c => c.slug === slug), 
    [categoryList, slug]
  );

  // Extract URL parameters
  const q = searchParams.get("q") || "";
  const subcategoryId = searchParams.get("subcategory_id") ? Number(searchParams.get("subcategory_id")) : undefined;
  
  const districtsParam = searchParams.get("districts");
  const districts = useMemo(() =>
    districtsParam ? districtsParam.split(",") : [],
    [districtsParam]
  );

  const priceLevel = Number(searchParams.get("price_level")) || undefined;
  const minRating = Number(searchParams.get("min_rating")) || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort_by") || "created_at";
  const order = (searchParams.get("sort_order") as "asc" | "desc") || "desc";

  // Form query parameters for API call
  const queryParams = useMemo(() => ({
    q,
    subcategory_id: subcategoryId,
    districts,
    priceLevel,
    minRating,
    page,
    sortBy,
    order,
    perPage: 12, // 12 items per page as requested in spec
  }), [q, subcategoryId, districts, priceLevel, minRating, page, sortBy, order]);

  // Fetch category-filtered locations
  const { locations, pagination, isLoading: isLocationsLoading } = useCategoryLocations(slug, queryParams);

  // Update query params in URL
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

    // Reset to page 1 on filter/subcategory changes
    if (!updates.page) {
      params.set("page", "1");
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  }, [pathname, router, searchParams]);

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: String(newPage) });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Loading States
  if (isCategoriesLoading) {
    return (
      <div className="w-full py-16 space-y-8 animate-pulse">
        <div className="h-48 bg-neutral-900 rounded-2xl border border-neutral-800" />
        <div className="h-10 w-2/3 bg-neutral-900 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
          <div className="h-96 bg-neutral-900 rounded-xl border border-neutral-800" />
          <div className="space-y-4">
            <div className="h-12 bg-neutral-900 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-4/5 bg-neutral-900 rounded-xl border border-neutral-800" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!currentCategory) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center border border-border">
          <span className="text-3xl text-on-surface-subtle">⛰️</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">{t("detail.not_found")}</h2>
          <p className="text-on-surface-variant/60 max-w-md">{t("category.no_locations")}</p>
        </div>
        <Link 
          href={PUBLIC_ROUTES.LOCATIONS}
          className="px-8 py-3 bg-[#171717] hover:bg-[#222] text-white font-black rounded-full border border-neutral-800 transition-all active:scale-95"
        >
          {t("category.fallback_cta")}
        </Link>
      </div>
    );
  }

  const activeSubcategories = currentCategory.subcategories || [];

  return (
    <div className="w-full pb-24 pt-8">
      {/* 1. Page Hero - Premium Glassmorphic design with radial backdrop blur */}
      <div className="reveal-up reveal-delay-100 relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#080808] p-8 md:p-12 mb-10 shadow-2xl">
        {/* Glow ambient effects */}
        <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-[#8B6A55]/10 blur-[80px] pointer-events-none" />
        <div className="absolute right-10 bottom-10 h-64 w-64 rounded-full bg-[#8B6A55]/5 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50" aria-label="breadcrumb">
            <Link href={PUBLIC_ROUTES.HOME} className="hover:text-[#8b6a55] transition-colors">
              {t("category.breadcrumb_home")}
            </Link>
            <span className="mx-2 text-neutral-700">/</span>
            <Link href={PUBLIC_ROUTES.LOCATIONS} className="hover:text-[#8b6a55] transition-colors">
              {t("category.breadcrumb_locations")}
            </Link>
            <span className="mx-2 text-neutral-700">/</span>
            <span className="text-white">{currentCategory.name}</span>
          </nav>

          {/* Hero Content */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shrink-0 shadow-lg">
              <CategoryIcon icon={currentCategory.icon} className="text-3xl text-[#8b6a55]" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {currentCategory.name}
              </h1>
              {currentCategory.description && (
                <p className="text-sm text-on-surface-variant/70 max-w-2xl leading-relaxed">
                  {currentCategory.description}
                </p>
              )}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#171717] border border-neutral-800 text-xs font-black text-on-surface-variant mt-2 shadow-sm">
                {pagination.total > 0 ? (
                  t("category.results_count", { count: pagination.total })
                ) : (
                  t("category.no_locations")
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subcategory selection pills */}
      {activeSubcategories.length > 0 && (
        <div className="reveal-up reveal-delay-200 mb-8 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/40 pl-1">
            {t("category.subcategories_title")}
          </h3>
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none max-w-full">
            <button
              onClick={() => updateFilters({ subcategory_id: null })}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border active:scale-95 shrink-0 shadow-md",
                subcategoryId === undefined
                  ? "bg-[#8b6a55] text-white border-[#8b6a55]"
                  : "bg-surface-container-lowest text-on-surface-variant/80 border-[#262626] hover:border-[#8b6a55] hover:text-[#8b6a55]"
              )}
            >
              {t("filters.all")}
            </button>
            {activeSubcategories.map((sub: SubCategory) => (
              <button
                key={sub.id}
                onClick={() => updateFilters({ subcategory_id: String(sub.id) })}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border active:scale-95 shrink-0 shadow-md",
                  subcategoryId === sub.id
                    ? "bg-[#8b6a55] text-white border-[#8b6a55]"
                    : "bg-surface-container-lowest text-on-surface-variant/80 border-[#262626] hover:border-[#8b6a55] hover:text-[#8b6a55]"
                )}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Main Grid layout section */}
      <div className="reveal-up reveal-delay-300 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 py-2">
        {/* Left Filters Sidebar */}
        <aside>
          <div className="lg:sticky lg:top-24">
            <LocationFilters
              activeDistricts={districts}
              activePriceLevel={priceLevel}
              activeRating={minRating}
              hideCategories={true}
              onDistrictsChange={(dists) => updateFilters({ districts: dists })}
              onPriceLevelChange={(level) => updateFilters({ price_level: level ? String(level) : null })}
              onRatingChange={(rating) => updateFilters({ min_rating: rating ? String(rating) : null })}
              onReset={() => updateFilters({
                subcategory_id: null,
                districts: null,
                price_level: null,
                min_rating: null,
                q: null
              })}
            />
          </div>
        </aside>

        {/* Right Locations Grid */}
        <main className="flex-1 space-y-8">
          {/* Result Context Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
            <div className="text-sm font-bold text-on-surface-variant/60">
              {q ? (
                t("category.results_count_search", { count: pagination.total, category: currentCategory.name })
              ) : (
                <>
                  <span className="text-white font-black">{pagination.total}</span> {t("reviews").replace("đánh giá", "địa điểm")}
                </>
              )}
            </div>

            {/* Sorting Select */}
            <div className="flex items-center gap-3">
              <label htmlFor="sort_by" className="text-xs font-black uppercase tracking-wider text-on-surface-variant/40">
                Sắp xếp
              </label>
              <div className="relative">
                <select
                  id="sort_by"
                  value={`${sortBy}-${order}`}
                  onChange={(e) => {
                    const [newSort, newOrder] = e.target.value.split("-");
                    updateFilters({ sort_by: newSort, sort_order: newOrder });
                  }}
                  className="appearance-none bg-surface-container-lowest border border-[#262626] rounded-xl px-4 py-2.5 pr-10 text-xs font-black text-white hover:border-[#8b6a55] transition-colors cursor-pointer outline-none shadow-md"
                >
                  <option value="created_at-desc">Mới nhất</option>
                  <option value="avg_rating-desc">Đánh giá cao</option>
                  <option value="review_count-desc">Nhiều đánh giá nhất</option>
                  <option value="view_count-desc">Lượt xem nhiều nhất</option>
                  <option value="price_min-asc">Giá thấp đến cao</option>
                  <option value="price_min-desc">Giá cao đến thấp</option>
                </select>
                <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid View */}
          <LocationGrid
            locations={locations}
            isLoading={isLocationsLoading}
          />

          {/* Pagination */}
          {pagination.lastPage > 1 && (
            <StandardPagination
              currentPage={page}
              totalPages={pagination.lastPage}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}
