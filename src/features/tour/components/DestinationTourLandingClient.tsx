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
  destinationName 
}: Props) {
  const t = useTranslations("tour");
  const { filters, setFilters } = useTourFilters();
  
  // Use destination-specific search by default if no search is present
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
          showMobileFilters 
            ? "fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl p-6 overflow-y-auto lg:relative lg:bg-transparent lg:p-0 lg:z-0 lg:backdrop-blur-none" 
            : "hidden lg:block"
        )}
      >
        <div className="sticky top-24">
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h2 className="text-xl font-bold">{t("filters.title")}</h2>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="p-2 hover:bg-surface-container rounded-full"
            >
              <SlidersHorizontal className="w-5 h-5 rotate-90" />
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
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 reveal-up">
          <div className="text-sm text-on-surface-subtle">
            {t.rich("list.results_count", {
              count: total,
              highlight: (chunks) => (
                <span className="text-on-surface font-bold">{chunks}</span>
              ),
            })}
          </div>
        </div>

        {isError ? (
          <div className="rounded-xl border border-border bg-surface-container p-8 text-center">
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
              <div className="mt-12 flex justify-center reveal-up">
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
