"use client";

import { useTranslations } from "next-intl";
import { useTourFilters } from "@/features/tour/hooks/useTourFilters";
import { useTours, useTourCategories } from "@/features/tour/hooks/useTours";
import FilterSidebar from "@/features/tour/components/FilterSidebar";
import TourGrid from "@/features/tour/components/TourGrid";
import { SearchInput, Select, type SelectOption } from "@/components/ui";
import { StandardPagination } from "@/components/ui/pagination";
import { SlidersHorizontal } from "@/components/icons/solar";
import { useState, Suspense } from "react";
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

function ToursContent() {
  const t = useTranslations("tour");
  const { filters, setFilters, clearFilters } = useTourFilters();
  const { data: toursResponse, isLoading, isError, refetch } = useTours(filters);
  const { data: categoriesResponse } = useTourCategories();

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toursPayload = toursResponse?.data;
  const tours = extractItems<Tour>(toursPayload);
  const { total: toursTotal, currentPage, totalPages } = readTourListMeta(
    toursPayload,
    tours.length
  );

  const categories = extractItems<TourCategory>(categoriesResponse?.data);

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
    <div className="design-page layout-main-shell">
      {/* Header Section */}
      <div className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#8b6a55]/10 to-transparent pointer-events-none" />
        <div className="design-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="reveal-up">
              <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-4">
                {t("title")}
              </h1>
              <p className="text-on-surface-subtle text-lg max-w-2xl">
                {t("subtitle")}
              </p>
            </div>

            <div className="w-full md:w-96 reveal-up" style={{ animationDelay: "100ms" }}>
              <SearchInput
                placeholder={t("list.search_placeholder")}
                value={filters.search || ""}
                onChange={(val: string) => setFilters({ search: val })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="design-container mt-12">
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

          {/* Sidebar */}
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
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort & Result Info */}
            <div
              className="flex items-center justify-between mb-8 reveal-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="text-sm text-on-surface-subtle">
                {t.rich("list.results_count", {
                  count: toursTotal,
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
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense
      fallback={
        <div className="min-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      }
    >
      <ToursContent />
    </Suspense>
  );
}
