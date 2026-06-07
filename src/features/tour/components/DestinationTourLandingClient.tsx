"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTourFilters } from "../hooks/useTourFilters";
import { useTours } from "../hooks/useTours";
import FilterSidebar from "./FilterSidebar";
import TourGrid from "./TourGrid";
import { SlidersHorizontal } from "@/components/icons/solar";
import { cn } from "@/lib/utils";
import { extractItems } from "@/utils";
import type { Tour, TourCategory, PaginatedResponse } from "@/types";
import { StandardPagination } from "@/components/ui/pagination";

interface Props {
  initialTours: Tour[];
  categories: TourCategory[];
  destinationName: string;
}

export default function DestinationTourLandingClient({
  initialTours,
  categories,
  destinationName,
}: Props) {
  const t = useTranslations("tour");
  const { filters, setFilters } = useTourFilters();

  const activeFilters = {
    ...filters,
    search: filters.search || destinationName,
  };

  const { data: toursResponse, isLoading, isError, refetch } = useTours(activeFilters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toursPayload = toursResponse?.data as PaginatedResponse<Tour> | undefined;
  const tours = extractItems<Tour>(toursPayload) || initialTours;

  const total = toursPayload?.total || tours.length;
  const totalPages = toursPayload?.last_page || 1;
  const currentPage = toursPayload?.current_page || 1;

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <button
        type="button"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="flex items-center justify-center gap-2 rounded-[18px] border border-border bg-white py-3 font-semibold text-on-surface shadow-sm transition-all active:scale-95 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        {t("list.filters_toggle")}
      </button>

      <aside
        className={cn(
          "shrink-0 transition-all duration-300 lg:w-72",
          showMobileFilters
            ? "fixed inset-0 z-[100] overflow-y-auto bg-black/45 p-4 backdrop-blur-[3px] lg:relative lg:z-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
            : "hidden lg:block"
        )}
      >
        <div className="sticky top-24">
          <div className="rounded-[32px] border border-border bg-white p-4 shadow-[0_24px_64px_rgba(15,23,42,0.14)] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <div>
                <h2 className="text-lg font-semibold text-on-surface">{t("filters.title")}</h2>
                <p className="mt-1 text-sm text-on-surface-subtle">
                  {t.rich("list.results_count", {
                    count: total,
                    highlight: (chunks) => <span className="font-semibold text-on-surface">{chunks}</span>,
                  })}
                </p>
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#fafafa] text-on-surface-subtle transition-colors hover:border-primary/25 hover:bg-white hover:text-on-surface"
              >
                x
              </button>
            </div>

            <FilterSidebar
              categories={categories}
              filters={activeFilters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                if (showMobileFilters) setShowMobileFilters(false);
              }}
              onReset={() => {
                setFilters({
                  search: destinationName,
                  tour_category_id: undefined,
                  price_min: undefined,
                  price_max: undefined,
                  duration: undefined,
                  available_from: undefined,
                  available_to: undefined,
                });
                if (showMobileFilters) setShowMobileFilters(false);
              }}
            />
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <div className="mb-8 flex items-center justify-between reveal-up">
          <div className="text-sm text-on-surface-subtle">
            {t.rich("list.results_count", {
              count: total,
              highlight: (chunks) => <span className="font-bold text-on-surface">{chunks}</span>,
            })}
          </div>
        </div>

        {isError ? (
          <div className="rounded-[28px] border border-border bg-white p-8 text-center shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
            <p className="mb-4 text-on-surface">{t("list.load_error")}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-on-primary transition-transform active:scale-95"
            >
              {t("list.retry")}
            </button>
          </div>
        ) : (
          <>
            <TourGrid tours={tours} isLoading={isLoading} />

            {!isLoading && totalPages > 1 && (
              <div className="mt-4 flex justify-center reveal-up">
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
  );
}
