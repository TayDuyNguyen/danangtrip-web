"use client";

import { useTranslations } from "next-intl";
import { useTourFilters } from "@/features/tour/hooks/useTourFilters";
import { useTours, useTourCategories } from "@/features/tour/hooks/useTours";
import FilterSidebar from "@/features/tour/components/FilterSidebar";
import TourGrid from "@/features/tour/components/TourGrid";
import { SearchInput } from "@/components/ui";
import { SlidersHorizontal } from "lucide-react";
import { useState, Suspense } from "react";
import { cn } from "@/lib/utils";

function ToursContent() {
  const t = useTranslations("tour");
  const { filters, setFilters, clearFilters } = useTourFilters();
  const { data: toursResponse, isLoading } = useTours(filters);
  const { data: categoriesResponse } = useTourCategories();
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const tours = toursResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  return (
    <div className="design-page min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-surface border-b border-border pt-32 pb-12">
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
                placeholder="Tìm kiếm tour..." 
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
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center justify-center gap-2 bg-surface border border-border py-3 rounded-xl font-bold text-on-surface active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Bộ lọc
          </button>

          {/* Sidebar */}
          <aside className={cn(
            "lg:w-72 shrink-0 transition-all duration-300",
            showMobileFilters ? "block" : "hidden lg:block"
          )}>
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
            <div className="flex items-center justify-between mb-8 reveal-up" style={{ animationDelay: "200ms" }}>
              <div className="text-sm text-on-surface-subtle">
                Tìm thấy <span className="text-on-surface font-bold">{tours.length}</span> tour phù hợp
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-on-surface-subtle uppercase tracking-wider">{t("sort.label")}</span>
                <select 
                  className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
                  value={`${filters.sort_by || "created_at"}-${filters.sort_order || "desc"}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split("-");
                    setFilters({ sort_by: sortBy, sort_order: sortOrder as "asc" | "desc" });
                  }}
                >
                  <option value="created_at-desc">{t("sort.newest")}</option>
                  <option value="booking_count-desc">{t("sort.popular")}</option>
                  <option value="price_adult-asc">{t("sort.price_asc")}</option>
                  <option value="price_adult-desc">{t("sort.price_desc")}</option>
                  <option value="rating_avg-desc">{t("sort.rating")}</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <TourGrid tours={tours} isLoading={isLoading} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={
      <div className="min-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ToursContent />
    </Suspense>
  );
}
