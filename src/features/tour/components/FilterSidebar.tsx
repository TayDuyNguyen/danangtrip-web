"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronDown, X, Check } from "@/components/icons/solar";
import { TourCategory } from "@/types";
import { cn } from "@/lib/utils";
import { TourFilterParams } from "../types";
import { formatInputPrice } from "@/utils/format";

interface FilterSidebarProps {
  categories: TourCategory[];
  filters: TourFilterParams;
  onFilterChange: (newFilters: Partial<TourFilterParams>) => void;
  onReset: () => void;
  showCategoryFilter?: boolean;
}

const SectionHeader = ({ title, isExpanded, onToggle }: { title: string, isExpanded: boolean, onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between group py-3 transition-colors"
  >
    <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
      {title}
    </h4>
    <ChevronDown className={cn(
      "w-4 h-4 text-on-surface-subtle transition-transform duration-300",
      isExpanded ? "rotate-0" : "-rotate-90"
    )} />
  </button>
);

const getDateInputClassName = (hasValue: boolean) => cn(
  "w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200",
  "bg-white text-on-surface [color-scheme:light]",
  "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25",
  "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
  "[&::-webkit-calendar-picker-indicator]:rounded-md",
  "[&::-webkit-calendar-picker-indicator]:p-1",
  "[&::-webkit-calendar-picker-indicator]:transition-all",
  "[&::-webkit-calendar-picker-indicator]:duration-200",
  hasValue
    ? "border-primary shadow-[0_0_0_1px_rgba(20,184,166,0.35)] [&::-webkit-calendar-picker-indicator]:bg-primary [&::-webkit-calendar-picker-indicator]:opacity-100"
    : "border-border [&::-webkit-calendar-picker-indicator]:bg-primary/20 [&::-webkit-calendar-picker-indicator]:opacity-80 hover:[&::-webkit-calendar-picker-indicator]:bg-primary/30"
);

export default function FilterSidebar({
  categories,
  filters,
  onFilterChange,
  onReset,
  showCategoryFilter = true
}: FilterSidebarProps) {
  const t = useTranslations("tour.filters");
  const locale = useLocale();
  const isVietnamese = locale === "vi";

  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    duration: true,
    departureDate: true
  });
  const [showAllCategories, setShowAllCategories] = useState(false);

  const priceOptions = useMemo(() => [
    { label: locale === "vi" ? "Dưới 500k" : "Under 500k", min: undefined, max: 500000 },
    { label: locale === "vi" ? "500k - 1Tr" : "500k - 1M", min: 500000, max: 1000000 },
    { label: locale === "vi" ? "1Tr - 2Tr" : "1M - 2M", min: 1000000, max: 2000000 },
    { label: locale === "vi" ? "Trên 2Tr" : "Over 2M", min: 2000000, max: undefined },
  ], [locale]);

  // --- Local Price States for Debouncing ---
  const [localMin, setLocalMin] = useState(filters.price_min !== undefined ? formatInputPrice(filters.price_min) : "");
  const [localMax, setLocalMax] = useState(filters.price_max !== undefined ? formatInputPrice(filters.price_max) : "");

  // Sync prop changes (e.g. quick options click or reset button click)
  useEffect(() => {
    setLocalMin(filters.price_min !== undefined ? formatInputPrice(filters.price_min) : "");
  }, [filters.price_min]);

  useEffect(() => {
    setLocalMax(filters.price_max !== undefined ? formatInputPrice(filters.price_max) : "");
  }, [filters.price_max]);

  // Debounce price min update (600ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const rawMin = localMin.replace(/\D/g, "");
      const parsedMin = rawMin ? Number(rawMin) : undefined;
      if (parsedMin !== filters.price_min) {
        onFilterChange({ price_min: parsedMin });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [localMin, onFilterChange, filters.price_min]);

  // Debounce price max update (600ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const rawMax = localMax.replace(/\D/g, "");
      const parsedMax = rawMax ? Number(rawMax) : undefined;
      if (parsedMax !== filters.price_max) {
        onFilterChange({ price_max: parsedMax });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [localMax, onFilterChange, filters.price_max]);

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (id: number) => {
    const isSelected = filters.tour_category_id === id;
    onFilterChange({ tour_category_id: isSelected ? undefined : id });
  };

  const handleDurationToggle = (val: string) => {
    const isSelected = filters.duration === val;
    onFilterChange({ duration: isSelected ? undefined : val });
  };

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 7);

  return (
    <div className="flex flex-col gap-6 rounded-[28px] border border-border bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.08)]">
      {/* Categories */}
      {showCategoryFilter && (
        <div className="border-b border-border pb-4">
          <SectionHeader
            title={t("category")}
            isExpanded={expanded.categories}
            onToggle={() => toggleSection("categories")}
          />
          <div className={cn(
            "space-y-2 mt-2 transition-all duration-300 overflow-hidden",
            expanded.categories ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}>
            <label
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={filters.tour_category_id === undefined}
                  onChange={() => onFilterChange({ tour_category_id: undefined })}
                  className="peer appearance-none w-5 h-5 rounded border border-border checked:bg-primary checked:border-primary transition-all"
                />
                <Check className="absolute w-3 h-3 text-on-primary opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" />
              </div>
              <span className={cn(
                "text-sm transition-colors",
                filters.tour_category_id === undefined ? "text-primary font-bold" : "text-on-surface-subtle group-hover:text-on-surface"
              )}>
                {t("all_categories")}
              </span>
            </label>

            {visibleCategories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.tour_category_id === cat.id}
                    onChange={() => handleCategoryToggle(cat.id)}
                    className="peer appearance-none w-5 h-5 rounded border border-border checked:bg-primary checked:border-primary transition-all"
                  />
                  <Check className="absolute w-3 h-3 text-on-primary opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" />
                </div>
                <span className={cn(
                  "text-sm transition-colors",
                  filters.tour_category_id === cat.id ? "text-primary font-bold" : "text-on-surface-subtle group-hover:text-on-surface"
                )}>
                  {cat.name}
                </span>
              </label>
            ))}
            {categories.length > 7 && (
              <button
                type="button"
                onClick={() => setShowAllCategories((prev) => !prev)}
                className="pt-2 text-left text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                {showAllCategories
                  ? (isVietnamese ? "Thu gọn" : "Show less")
                  : (isVietnamese ? `Xem thêm ${categories.length - 7} danh mục` : `Show ${categories.length - 7} more`)}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="border-b border-border pb-4">
        <SectionHeader
          title={t("price")}
          isExpanded={expanded.price}
          onToggle={() => toggleSection("price")}
        />
        <div className={cn(
          "space-y-4 mt-4 transition-all duration-300 overflow-hidden",
          expanded.price ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}>
          {/* Quick options grid */}
          <div className="grid grid-cols-2 gap-2">
            {priceOptions.map((opt) => {
              const isSelected = filters.price_min === opt.min && filters.price_max === opt.max;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      onFilterChange({ price_min: undefined, price_max: undefined });
                    } else {
                      onFilterChange({ price_min: opt.min, price_max: opt.max });
                    }
                  }}
                  className={cn(
                    "py-2 px-3 text-xs font-bold rounded-lg border transition-all text-center cursor-pointer select-none",
                    isSelected
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-border text-on-surface-subtle hover:border-primary hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t("price_min_placeholder")}
                value={localMin}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, "");
                  const formatted = clean ? formatInputPrice(Number(clean)) : "";
                  e.target.value = formatted;
                  setLocalMin(formatted);
                }}
                className="w-full rounded-lg border border-border bg-white py-2 pl-3 pr-7 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-on-surface-subtle select-none">đ</span>
            </div>
            <span className="text-on-surface-subtle">-</span>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t("price_max_placeholder")}
                value={localMax}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, "");
                  const formatted = clean ? formatInputPrice(Number(clean)) : "";
                  e.target.value = formatted;
                  setLocalMax(formatted);
                }}
                className="w-full rounded-lg border border-border bg-white py-2 pl-3 pr-7 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-on-surface-subtle select-none">đ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className="border-b border-border pb-4">
        <SectionHeader
          title={t("duration")}
          isExpanded={expanded.duration}
          onToggle={() => toggleSection("duration")}
        />
        <div className={cn(
          "space-y-2 mt-2 transition-all duration-300 overflow-hidden",
          expanded.duration ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}>
          {[
            { value: "1 ngày", label: t("durations.one_day") },
            { value: "2 ngày 1 đêm", label: t("durations.two_days_one_night") },
            { value: "3 ngày 2 đêm", label: t("durations.three_days_two_nights") },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={filters.duration === option.value}
                  onChange={() => handleDurationToggle(option.value)}
                  className="peer appearance-none w-5 h-5 rounded border border-border checked:bg-primary checked:border-primary transition-all"
                />
                <Check className="absolute w-3 h-3 text-on-primary opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" />
              </div>
              <span className={cn(
                "text-sm transition-colors",
                filters.duration === option.value ? "text-primary font-bold" : "text-on-surface-subtle group-hover:text-on-surface"
              )}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Date */}
      <div className="border-b border-border pb-4">
        <SectionHeader
          title={t("departure_date")}
          isExpanded={expanded.departureDate}
          onToggle={() => toggleSection("departureDate")}
        />
        <div className={cn(
          "space-y-4 mt-4 transition-all duration-300 overflow-hidden",
          expanded.departureDate ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-on-surface-subtle uppercase px-1">{t("available_from_label")}</span>
              <input
                type="date"
                value={filters.available_from || ""}
                onChange={(e) => onFilterChange({ available_from: e.target.value || undefined })}
                aria-label={t("available_from_label")}
                className={getDateInputClassName(Boolean(filters.available_from))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-on-surface-subtle uppercase px-1">{t("available_to_label")}</span>
              <input
                type="date"
                value={filters.available_to || ""}
                onChange={(e) => onFilterChange({ available_to: e.target.value || undefined })}
                aria-label={t("available_to_label")}
                className={getDateInputClassName(Boolean(filters.available_to))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={onReset}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-[#f7f7f7] px-4 py-3 text-sm font-bold text-on-surface transition-all hover:border-primary/30 hover:bg-white hover:text-primary"
      >
        <X className="w-4 h-4" />
        {t("clear_all")}
      </button>
    </div>
  );
}
