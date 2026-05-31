import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Category } from "@/types";
import { useLocationDistricts } from "../hooks/use-locations";
import { IoChevronDownOutline, IoCloseOutline, IoStar } from "@/components/icons/solar";
import { cn } from "@/utils/string";
import { CategoryIconRenderer } from "@/utils/category-icon";

interface LocationFiltersProps {
  activeCategories?: number[];
  activeDistricts: string[];
  activePriceLevel?: number;
  activeRating?: number;
  categories?: Category[];
  filterStats?: {
    districts: Record<string, number>;
    price_levels: Record<string, number>;
    ratings: Record<string, number>;
  };
  onCategoriesChange?: (ids: number[]) => void;
  onDistrictsChange: (districts: string[]) => void;
  onPriceLevelChange: (level?: number) => void;
  onRatingChange: (rating?: number) => void;
  onReset: () => void;
  hideCategories?: boolean;
}

interface SectionHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const SectionHeader = ({ title, isExpanded, onToggle }: SectionHeaderProps) => (
  <button
    onClick={onToggle}
    className="mb-5 flex w-full items-center justify-between pl-1 transition-colors"
  >
    <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-on-surface-subtle">
      {title}
    </h4>
    <IoChevronDownOutline
      className={cn(
        "text-[18px] text-on-surface-subtle transition-transform duration-300",
        isExpanded ? "rotate-0" : "-rotate-90"
      )}
    />
  </button>
);

const itemTextClass = (isActive: boolean) =>
  isActive ? "font-semibold text-on-surface" : "text-on-surface-subtle group-hover:text-on-surface";

export default function LocationFilters({
  activeCategories = [],
  activeDistricts,
  activePriceLevel,
  activeRating,
  categories = [],
  filterStats,
  onCategoriesChange,
  onDistrictsChange,
  onPriceLevelChange,
  onRatingChange,
  onReset,
  hideCategories = false,
}: LocationFiltersProps) {
  const t = useTranslations("locations");
  const locale = useLocale();
  const { data: districtsList = [] } = useLocationDistricts();
  const isVietnamese = locale === "vi";

  const totalLocationsCount = useMemo(
    () => categories.reduce((sum, category) => sum + (category.locations_count ?? 0), 0),
    [categories]
  );

  const [expanded, setExpanded] = useState({
    categories: true,
    districts: true,
    price: true,
    rating: true,
  });
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllDistricts, setShowAllDistricts] = useState(false);

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (id: number) => {
    if (!onCategoriesChange) return;

    const nextIds = activeCategories.includes(id)
      ? activeCategories.filter((item) => item !== id)
      : [...activeCategories, id];

    onCategoriesChange(nextIds);
  };

  const toggleDistrict = (name: string) => {
    const nextDistricts = activeDistricts.includes(name)
      ? activeDistricts.filter((district) => district !== name)
      : [...activeDistricts, name];

    onDistrictsChange(nextDistricts);
  };

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 8);
  const visibleDistricts = showAllDistricts ? districtsList : districtsList.slice(0, 8);

  return (
    <div className="space-y-8 rounded-[28px] border border-border bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
      {!hideCategories && categories.length > 0 && (
        <div>
          <SectionHeader
            title={t("filters.categories")}
            isExpanded={expanded.categories}
            onToggle={() => toggleSection("categories")}
          />
          <div
            className={cn(
              "space-y-2 overflow-hidden transition-all duration-300",
              expanded.categories ? "max-h-[1200px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
            )}
          >
            <label className="group flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition-colors hover:bg-[#f7f7f7]">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={activeCategories.length === 0}
                    onChange={() => onCategoriesChange && onCategoriesChange([])}
                    className="peer h-6 w-6 appearance-none rounded-lg border-2 border-[#e6e6e6] bg-white transition-all checked:border-primary checked:bg-primary"
                  />
                  <svg
                    className="pointer-events-none absolute left-1 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={cn("text-[15px] transition-colors", itemTextClass(activeCategories.length === 0))}>
                  {t("filters.all")}
                </span>
              </div>
              <span className="text-sm text-on-surface-subtle">({totalLocationsCount})</span>
            </label>

            {visibleCategories.map((category) => {
              const isActive = activeCategories.includes(category.id);

              return (
                <label
                  key={category.id}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition-colors hover:bg-[#f7f7f7]"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggleCategory(category.id)}
                        className="peer h-6 w-6 appearance-none rounded-lg border-2 border-[#e6e6e6] bg-white transition-all checked:border-primary checked:bg-primary"
                      />
                      <svg
                        className="pointer-events-none absolute left-1 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                        isActive ? "bg-[#fff1f3] text-primary" : "bg-[#f7f7f7] text-on-surface-subtle"
                      )}
                    >
                      <CategoryIconRenderer icon={category.icon} className="text-xl" />
                    </div>

                    <span className={cn("text-[15px] transition-colors", itemTextClass(isActive))}>
                      {category.name}
                    </span>
                  </div>

                  <span className="text-sm text-on-surface-subtle">({category.locations_count ?? 0})</span>
                </label>
              );
            })}

            {categories.length > 8 && (
              <button
                type="button"
                onClick={() => setShowAllCategories((prev) => !prev)}
                className="px-3 pt-2 text-left text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                {showAllCategories
                  ? (isVietnamese ? "Thu gọn" : "Show less")
                  : (isVietnamese ? `Xem thêm ${categories.length - 8} danh mục` : `Show ${categories.length - 8} more`)}
              </button>
            )}
          </div>
        </div>
      )}

      {districtsList.length > 0 && (
        <div>
          <SectionHeader
            title={t("filters.districts")}
            isExpanded={expanded.districts}
            onToggle={() => toggleSection("districts")}
          />
          <div
            className={cn(
              "space-y-2 overflow-hidden transition-all duration-300",
              expanded.districts ? "max-h-[640px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
            )}
          >
            <label className="group flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition-colors hover:bg-[#f7f7f7]">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={activeDistricts.length === 0}
                    onChange={() => onDistrictsChange([])}
                    className="peer h-6 w-6 appearance-none rounded-lg border-2 border-[#e6e6e6] bg-white transition-all checked:border-primary checked:bg-primary"
                  />
                  <svg
                    className="pointer-events-none absolute left-1 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={cn("text-[15px] transition-colors", itemTextClass(activeDistricts.length === 0))}>
                  {t("filters.all")}
                </span>
              </div>
              <span className="text-sm text-on-surface-subtle">({totalLocationsCount})</span>
            </label>

            {visibleDistricts.map((district) => {
              const isActive = activeDistricts.includes(district.name);

              return (
                <label
                  key={district.id}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition-colors hover:bg-[#f7f7f7]"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggleDistrict(district.name)}
                        className="peer h-6 w-6 appearance-none rounded-lg border-2 border-[#e6e6e6] bg-white transition-all checked:border-primary checked:bg-primary"
                      />
                      <svg
                        className="pointer-events-none absolute left-1 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <span className={cn("text-[15px] transition-colors", itemTextClass(isActive))}>
                      {district.name}
                    </span>
                  </div>

                  <span className="text-sm text-on-surface-subtle">
                    ({filterStats?.districts[district.name] ?? 0})
                  </span>
                </label>
              );
            })}

            {districtsList.length > 8 && (
              <button
                type="button"
                onClick={() => setShowAllDistricts((prev) => !prev)}
                className="px-3 pt-2 text-left text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                {showAllDistricts
                  ? (isVietnamese ? "Thu gọn" : "Show less")
                  : (
                      isVietnamese
                        ? `Xem thêm ${districtsList.length - 8} quận/huyện`
                        : `Show ${districtsList.length - 8} more`
                    )}
              </button>
            )}
          </div>
        </div>
      )}

      <div>
        <SectionHeader
          title={t("filters.price_level")}
          isExpanded={expanded.price}
          onToggle={() => toggleSection("price")}
        />
        <div
          className={cn(
            "space-y-2 overflow-hidden transition-all duration-300",
            expanded.price ? "max-h-[320px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
          )}
        >
          {[
            { value: undefined, label: t("filters.all") },
            { value: 1, label: t("price.free") },
            { value: 2, label: t("price.budget") },
            { value: 3, label: t("price.mid_range") },
            { value: 4, label: t("price.high_end") },
          ].map((option) => {
            const isActive = activePriceLevel === option.value;

            return (
              <label
                key={String(option.value)}
                className="group flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition-colors hover:bg-[#f7f7f7]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="price_level"
                      checked={isActive}
                      onChange={() => onPriceLevelChange(option.value)}
                      className="peer h-6 w-6 appearance-none rounded-full border-2 border-[#e6e6e6] bg-white transition-all checked:border-primary"
                    />
                    <div className="absolute left-1.5 h-3 w-3 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100" />
                  </div>

                  <span className={cn("text-[15px] transition-colors", itemTextClass(isActive))}>
                    {option.label}
                  </span>
                </div>

                <span className="text-sm text-on-surface-subtle">
                  ({option.value === undefined ? totalLocationsCount : (filterStats?.price_levels[option.value] ?? 0)})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <SectionHeader
          title={t("filters.rating")}
          isExpanded={expanded.rating}
          onToggle={() => toggleSection("rating")}
        />
        <div
          className={cn(
            "space-y-2 overflow-hidden transition-all duration-300",
            expanded.rating ? "max-h-[320px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
          )}
        >
          {[
            { value: undefined, label: t("filters.all") },
            { value: 4, label: t("filters.rating_4_plus") },
            { value: 3, label: t("filters.rating_3_plus") },
          ].map((option) => {
            const isActive = activeRating === option.value;

            return (
              <label
                key={String(option.value)}
                className="group flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition-colors hover:bg-[#f7f7f7]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={isActive}
                      onChange={() => onRatingChange(option.value)}
                      className="peer h-6 w-6 appearance-none rounded-full border-2 border-[#e6e6e6] bg-white transition-all checked:border-primary"
                    />
                    <div className="absolute left-1.5 h-3 w-3 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={cn("text-[15px] transition-colors", itemTextClass(isActive))}>
                      {option.label}
                    </span>
                    {option.value && (
                      <div className="flex gap-0.5 text-amber-500">
                        {[1, 2, 3, 4].map((star) => (
                          <IoStar key={star} className="text-xs" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-sm text-on-surface-subtle">
                  ({option.value === undefined ? totalLocationsCount : (filterStats?.ratings[option.value] ?? 0)})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <button
        onClick={onReset}
        className="group mt-2 flex w-full items-center justify-center gap-3 rounded-[22px] border border-border bg-[#f7f7f7] px-6 py-4 font-semibold text-on-surface transition-all hover:border-primary/25 hover:bg-[#fff4f6] hover:text-primary active:scale-[0.99]"
      >
        <IoCloseOutline className="text-[18px] transition-transform duration-300 group-hover:rotate-180" />
        {t("filters.reset")}
      </button>
    </div>
  );
}
