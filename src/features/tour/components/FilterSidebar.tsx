"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, X, Check } from "lucide-react";
import { TourCategory } from "@/types";
import { cn } from "@/lib/utils";
import { TourFilterParams } from "../types";

interface FilterSidebarProps {
  categories: TourCategory[];
  filters: TourFilterParams;
  onFilterChange: (newFilters: Partial<TourFilterParams>) => void;
  onReset: () => void;
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

export default function FilterSidebar({
  categories,
  filters,
  onFilterChange,
  onReset
}: FilterSidebarProps) {
  const t = useTranslations("tour.filters");

  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    duration: true,
    departureDate: true
  });

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

  return (
    <div className="flex flex-col gap-6">
      {/* Categories */}
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
          {categories.map((cat) => (
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
                <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" />
              </div>
              <span className={cn(
                "text-sm transition-colors",
                filters.tour_category_id === cat.id ? "text-primary font-bold" : "text-on-surface-variant group-hover:text-on-surface"
              )}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-b border-border pb-4">
        <SectionHeader
          title={t("price")}
          isExpanded={expanded.price}
          onToggle={() => toggleSection("price")}
        />
        <div className={cn(
          "space-y-4 mt-4 transition-all duration-300 overflow-hidden",
          expanded.price ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Từ"
                value={filters.price_min || ""}
                onChange={(e) => onFilterChange({ price_min: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full bg-surface-container border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <span className="text-on-surface-subtle">-</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Đến"
                value={filters.price_max || ""}
                onChange={(e) => onFilterChange({ price_max: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full bg-surface-container border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
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
                <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" />
              </div>
              <span className={cn(
                "text-sm transition-colors",
                filters.duration === option.value ? "text-primary font-bold" : "text-on-surface-variant group-hover:text-on-surface"
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
              <span className="text-[10px] font-bold text-on-surface-subtle uppercase px-1">Từ ngày</span>
              <input
                type="date"
                value={filters.available_from || ""}
                onChange={(e) => onFilterChange({ available_from: e.target.value || undefined })}
                className="w-full bg-surface-container border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-on-surface-subtle uppercase px-1">Đến ngày</span>
              <input
                type="date"
                value={filters.available_to || ""}
                onChange={(e) => onFilterChange({ available_to: e.target.value || undefined })}
                className="w-full bg-surface-container border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={onReset}
        className="w-full py-3 px-4 bg-surface-container hover:bg-border text-on-surface text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <X className="w-4 h-4" />
        {t("clear_all")}
      </button>
    </div>
  );
}
