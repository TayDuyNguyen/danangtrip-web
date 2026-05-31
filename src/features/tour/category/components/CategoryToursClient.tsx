"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SearchInput, Select, type SelectOption } from "@/components/ui";
import { StandardPagination } from "@/components/ui/pagination";
import { ChevronLeft, SlidersHorizontal } from "@/components/icons/solar";
import { cn } from "@/lib/utils";
import { extractItems } from "@/utils";
import type { Tour, TourCategory } from "@/types";
import { useTourFilters } from "@/features/tour/hooks/useTourFilters";
import { useTourCategories } from "@/features/tour/hooks/useTours";
import FilterSidebar from "@/features/tour/components/FilterSidebar";
import TourGrid from "@/features/tour/components/TourGrid";
import { useCategoryTours } from "../hooks/useCategoryTours";

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

  const value = payload as ToursListPayload;

  return {
    total: typeof value.total === "number" ? value.total : fallbackTotal,
    currentPage: typeof value.current_page === "number" ? value.current_page : 1,
    totalPages: typeof value.last_page === "number" ? value.last_page : 1,
  };
}

interface CategoryToursClientProps {
  slug: string;
}

function getCategoryEmoji(categorySlug: string) {
  const slugLower = categorySlug.toLowerCase();
  if (slugLower.includes("daily") || slugLower.includes("hang-ngay")) return "☀️";
  if (slugLower.includes("night") || slugLower.includes("dem")) return "🌙";
  if (slugLower.includes("adventure") || slugLower.includes("mao-hiem")) return "🧗";
  if (slugLower.includes("eco") || slugLower.includes("sinh-thai")) return "🌲";
  if (slugLower.includes("luxury") || slugLower.includes("nghi-duong")) return "👑";
  if (slugLower.includes("beach") || slugLower.includes("bien")) return "🏖️";
  return "✈️";
}

export default function CategoryToursClient({ slug }: CategoryToursClientProps) {
  const t = useTranslations("tour");
  const { filters, setFilters, clearFilters } = useTourFilters();
  const { data: toursResponse, isLoading, isError, refetch } = useCategoryTours(slug, filters);
  const { data: categoriesResponse } = useTourCategories();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toursPayload = toursResponse?.data;
  const tours = extractItems<Tour>(toursPayload);
  const { total: toursTotal, currentPage, totalPages } = readTourListMeta(toursPayload, tours.length);

  const categories = extractItems<TourCategory>(categoriesResponse?.data);
  const currentCategory = categories.find((category) => category.slug === slug);
  const categoryName = currentCategory?.name || (slug.charAt(0).toUpperCase() + slug.slice(1));
  const categoryDesc = currentCategory?.description || t("subtitle");

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
      <div className="reveal-up relative mb-8 overflow-hidden rounded-[32px] border border-border bg-white p-8 shadow-[0_24px_64px_rgba(15,23,42,0.08)] md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4 flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-on-surface-subtle md:justify-start">
              <Link href="/" className="transition-colors hover:text-primary">
                {t("detail.breadcrumb_home")}
              </Link>
              <span>/</span>
              <Link href="/tours" className="transition-colors hover:text-primary">
                {t("detail.breadcrumb_tours")}
              </Link>
              <span>/</span>
              <span className="font-bold text-on-surface">{categoryName}</span>
            </div>

            <div className="mt-4 flex flex-col items-center gap-6 md:flex-row">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-[#fafafa] text-3xl shadow-sm transition-all active:scale-95">
                {getCategoryEmoji(slug)}
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-on-surface md:text-4xl">{categoryName}</h1>
                <p className="mt-2 max-w-xl text-sm text-on-surface-subtle md:text-base">{categoryDesc}</p>
              </div>
            </div>
          </div>

          <div className="w-full shrink-0 self-center md:w-80 md:self-end">
            <SearchInput
              placeholder={t("list.search_placeholder")}
              value={filters.search || ""}
              onChange={(value: string) => setFilters({ search: value })}
              label="Where"
              actionText="Search"
            />
          </div>
        </div>
      </div>

      <div
        className="reveal-up mb-8 flex items-center gap-4 rounded-[24px] border border-border bg-white px-6 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
        style={{ animationDelay: "100ms" }}
      >
        <Link href="/tours" className="group flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t("category.back_to_all")}
        </Link>
        <span className="text-border">|</span>
        <span className="text-sm font-black uppercase tracking-wider text-on-surface">{categoryName}</span>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <button
          type="button"
          onClick={() => setShowMobileFilters((prev) => !prev)}
          className="flex items-center justify-center gap-2 rounded-[20px] border border-border bg-white py-3 font-bold text-on-surface shadow-sm transition-all active:scale-95 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t("list.filters_toggle")}
        </button>

        <aside
          className={cn("shrink-0 transition-all duration-300 lg:w-72", showMobileFilters ? "block" : "hidden lg:block")}
        >
          <div className="sticky top-24">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={setFilters}
              onReset={clearFilters}
              showCategoryFilter={false}
            />
          </div>
        </aside>

        <main className="flex-1">
          <div className="reveal-up mb-8 flex items-center justify-between" style={{ animationDelay: "200ms" }}>
            <div className="text-sm text-on-surface-subtle">
              {t.rich("category.results_count", {
                count: toursTotal,
                category: categoryName,
                highlight: (chunks) => <span className="font-bold text-on-surface">{chunks}</span>,
              })}
            </div>

            <div className="flex h-10 justify-center gap-4">
              <span className="flex items-center whitespace-nowrap pt-2 text-[10px] font-black uppercase tracking-widest text-on-surface-subtle leading-none">
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
                  value={{ value: sortSelectValue, label: sortSelectLabel }}
                  onChange={(option: SelectOption | null) => {
                    if (option && typeof option.value === "string") {
                      const [sortBy, sortOrder] = option.value.split("-");
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
            <div className="rounded-[28px] border border-border bg-white p-8 text-center shadow-[0_16px_40px_rgba(15,23,42,0.06)]" role="alert">
              <p className="mb-4 text-on-surface">{t("list.load_error")}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-transform active:scale-95"
              >
                {t("list.retry")}
              </button>
            </div>
          ) : !isLoading && tours.length === 0 ? (
            <div className="reveal-up rounded-[32px] border border-border bg-white p-12 text-center shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-[#fff1f3] text-2xl">
                🗺️
              </div>
              <h3 className="text-xl font-black text-on-surface">{t("category.empty_title")}</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-on-surface-subtle">{t("category.empty_desc")}</p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full border border-border bg-[#f7f7f7] px-5 py-2 text-sm font-bold text-on-surface transition-colors hover:bg-[#fff4f6] hover:text-primary active:scale-95"
                >
                  {t("filters.clear_all")}
                </button>
                <Link
                  href="/tours"
                  className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-95"
                >
                  {t("history.empty_cta")}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <TourGrid tours={tours} isLoading={isLoading} />

              {!isLoading && totalPages > 1 && (
                <div className="reveal-up mt-4 flex justify-center" style={{ animationDelay: "400ms" }}>
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
