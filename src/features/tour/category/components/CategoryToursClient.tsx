"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useTourFilters } from "@/features/tour/hooks/useTourFilters";
import { useTourCategories } from "@/features/tour/hooks/useTours";
import { useCategoryTours } from "../hooks/useCategoryTours";
import FilterSidebar from "@/features/tour/components/FilterSidebar";
import TourGrid from "@/features/tour/components/TourGrid";
import { SearchInput, Select, type SelectOption } from "@/components/ui";
import { StandardPagination } from "@/components/ui/pagination";
import { SlidersHorizontal, ChevronLeft } from "@/components/icons/solar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { extractItems } from "@/utils";
import type { Tour, TourCategory } from "@/types";

type ToursListPayload = {
  total?: unknown;
  current_page?: unknown;
  last_page?: unknown;
};

function readTourListMeta(payload: unknown, fallbackTotal: number) {
  if (!payload || typeof payload !== "object") {
    return {
      total: fallbackTotal,
      currentPage: 1,
      totalPages: 1,
    };
  }
  const o = payload as ToursListPayload;
  const total = typeof o.total === "number" ? o.total : fallbackTotal;
  const currentPage = typeof o.current_page === "number" ? o.current_page : 1;
  const totalPages = typeof o.last_page === "number" ? o.last_page : 1;
  return { total, currentPage, totalPages };
}

interface CategoryToursClientProps {
  slug: string;
}

export default function CategoryToursClient({ slug }: CategoryToursClientProps) {
  const t = useTranslations("tour");
  const { filters, setFilters, clearFilters } = useTourFilters();
  const { data: toursResponse, isLoading, isError, refetch } = useCategoryTours(slug, filters);
  const { data: categoriesResponse } = useTourCategories();

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toursPayload = toursResponse?.data;
  const tours = extractItems<Tour>(toursPayload);
  const { total: toursTotal, currentPage, totalPages } = readTourListMeta(
    toursPayload,
    tours.length
  );

  const categories = extractItems<TourCategory>(categoriesResponse?.data);
  const currentCategory = categories.find((cat) => cat.slug === slug);

  // Dynamic values for hero
  const categoryName = currentCategory?.name || (slug.charAt(0).toUpperCase() + slug.slice(1));
  const categoryDesc = currentCategory?.description || t("subtitle");
  
  // Icon fallback selector based on category name or slug
  const getCategoryEmoji = (categorySlug: string) => {
    const slugLower = categorySlug.toLowerCase();
    if (slugLower.includes("daily") || slugLower.includes("hang-ngay")) return "☀️";
    if (slugLower.includes("night") || slugLower.includes("dem")) return "🌙";
    if (slugLower.includes("adventure") || slugLower.includes("mao-hiem")) return "🧗";
    if (slugLower.includes("eco") || slugLower.includes("sinh-thai")) return "🌲";
    if (slugLower.includes("luxury") || slugLower.includes("nghi-duong")) return "👑";
    if (slugLower.includes("beach") || slugLower.includes("bien")) return "🏖️";
    return "✈️";
  };

  const sortSelectValue = `${filters.sort_by || "created_at"}-${filters.sort_order || "desc"}`;
  const sortSelectLabel =
    filters.sort_by === "booking_count"
      ? t("sort.popular")
      : filters.sort_by === "price_adult"
        ? filters.sort_order === "asc"
          ? t("sort.price_asc")
          : t("sort.price_desc")
        : filters.sort_by === "rating_avg"
          ? t("sort.rating")
          : t("sort.newest");

  return (
    <div className="w-full">
      {/* Dynamic Glassmorphic Hero Panel */}
      <div className="relative rounded-2xl border border-border bg-surface-container overflow-hidden p-8 md:p-12 mb-8 reveal-up">
        {/* Background Gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5c3822]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 justify-between">
          <div className="flex-1 text-center md:text-left">
            {/* Breadcrumb path */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-on-surface-subtle uppercase tracking-wider mb-4">
              <Link href="/" className="hover:text-primary transition-colors">
                {t("detail.breadcrumb_home")}
              </Link>
              <span>/</span>
              <Link href="/tours" className="hover:text-primary transition-colors">
                {t("detail.breadcrumb_tours")}
              </Link>
              <span>/</span>
              <span className="text-on-surface font-bold">{categoryName}</span>
            </div>

            {/* Dynamic visual token wrapper */}
            <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-3xl shadow-inner select-none active:scale-95 transition-all">
                {getCategoryEmoji(slug)}
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-on-surface tracking-tight">
                  {categoryName}
                </h1>
                <p className="text-on-surface-subtle text-sm md:text-base mt-2 max-w-xl">
                  {categoryDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Quick search bound box */}
          <div className="w-full md:w-80 shrink-0 self-center md:self-end">
            <SearchInput
              placeholder={t("list.search_placeholder")}
              value={filters.search || ""}
              onChange={(val: string) => setFilters({ search: val })}
            />
          </div>
        </div>
      </div>

      {/* Internal Navigation & Category tabs replacement */}
      <div className="flex items-center gap-4 py-4 px-6 border-b border-border bg-surface-container/50 rounded-xl mb-8 reveal-up" style={{ animationDelay: "100ms" }}>
        <Link 
          href="/tours" 
          className="flex items-center gap-2 text-sm font-bold text-primary hover:underline group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t("category.back_to_all")}
        </Link>
        <span className="text-border">|</span>
        <span className="text-sm font-black text-on-surface uppercase tracking-wider">
          {categoryName}
        </span>
      </div>

      {/* Main Listing Layout */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Mobile Filter Toggle */}
        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center justify-center gap-2 bg-surface border border-border py-3 rounded-xl font-bold text-on-surface active:scale-95 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t("list.filters_toggle")}
        </button>

        {/* Sidebar Panel */}
        <aside
          className={cn(
            "lg:w-72 shrink-0 transition-all duration-300",
            showMobileFilters ? "block" : "hidden lg:block"
          )}
        >
          <div className="sticky top-24">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={setFilters}
              onReset={clearFilters}
              showCategoryFilter={false} // Hidden as we are already on this category!
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Results Info & Sort Toolbar */}
          <div
            className="flex items-center justify-between mb-8 reveal-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="text-sm text-on-surface-subtle">
              {t.rich("category.results_count", {
                count: toursTotal,
                category: categoryName,
                highlight: (chunks) => (
                  <span className="text-on-surface font-bold">{chunks}</span>
                ),
              })}
            </div>

            <div className="flex justify-center gap-4 h-10">
              <span className="flex items-center pt-2 text-[10px] font-black text-on-surface-subtle uppercase tracking-widest whitespace-nowrap leading-none">
                {t("sort.label")}
              </span>
              <div className="w-48">
                <Select
                  variant="minimal"
                  menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                  options={[
                    { value: "created_at-desc", label: t("sort.newest") },
                    { value: "booking_count-desc", label: t("sort.popular") },
                    { value: "price_adult-asc", label: t("sort.price_asc") },
                    { value: "price_adult-desc", label: t("sort.price_desc") },
                    { value: "rating_avg-desc", label: t("sort.rating") },
                  ]}
                  value={{
                    value: sortSelectValue,
                    label: sortSelectLabel,
                  }}
                  onChange={(opt: SelectOption | null) => {
                    if (opt && typeof opt.value === "string") {
                      const [sortBy, sortOrder] = opt.value.split("-");
                      setFilters({
                        sort_by: sortBy,
                        sort_order: sortOrder as "asc" | "desc",
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Listing Grid */}
          {isError ? (
            <div
              className="rounded-xl border border-border bg-surface-container p-8 text-center"
              role="alert"
            >
              <p className="text-on-surface mb-4">{t("list.load_error")}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-on-primary active:scale-95 transition-transform"
              >
                {t("list.retry")}
              </button>
            </div>
          ) : !isLoading && tours.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface-container p-12 text-center reveal-up">
              <div className="w-16 h-16 rounded-full bg-surface-container border border-border flex items-center justify-center text-2xl mx-auto mb-6">
                📭
              </div>
              <h3 className="text-xl font-black text-on-surface">
                {t("category.empty_title")}
              </h3>
              <p className="text-on-surface-subtle text-sm mt-2 max-w-sm mx-auto">
                {t("category.empty_desc")}
              </p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-5 py-2 rounded-full border border-border bg-surface text-sm font-bold text-on-surface hover:bg-border transition-colors active:scale-95"
                >
                  {t("filters.clear_all")}
                </button>
                <Link
                  href="/tours"
                  className="px-5 py-2 rounded-full bg-primary text-sm font-bold text-on-primary hover:bg-opacity-95 transition-all active:scale-95"
                >
                  {t("history.empty_cta")}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <TourGrid tours={tours} isLoading={isLoading} />

              {!isLoading && totalPages > 1 && (
                <div
                  className="mt-12 flex justify-center reveal-up"
                  style={{ animationDelay: "400ms" }}
                >
                  <StandardPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setFilters({ page })}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
