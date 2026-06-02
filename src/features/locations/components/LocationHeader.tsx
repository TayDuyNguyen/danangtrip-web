"use client";

import { useTranslations } from "next-intl";
import { IoOptionsOutline } from "@/components/icons/solar";
import SearchInput from "@/components/ui/SearchInput";

interface LocationHeaderProps {
  onSearch: (query: string) => void;
  onOpenFilters: () => void;
  count: number;
  hasActiveFilters?: boolean;
  isLoading?: boolean;
  query?: string;
}

export default function LocationHeader({
  onSearch,
  onOpenFilters,
  count,
  hasActiveFilters,
  isLoading,
  query = "",
}: LocationHeaderProps) {
  const t = useTranslations("locations");

  return (
    <div className="animate-in slide-in-from-top-4 space-y-8 py-6 duration-700">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
        <span className="rounded-full border border-[#ffd8e1] bg-[#fff4f6] px-4 py-2 text-xs font-semibold uppercase tracking-normal text-primary">
          {t("discovery.badge")}
        </span>
        <h1 className="text-[34px] font-semibold leading-[1.08] tracking-normal text-on-surface md:text-[48px]">
          {t("discovery.title")}
        </h1>
        <p className="max-w-3xl text-[16px] leading-7 text-on-surface-subtle md:text-[18px]">
          {t("discovery.subtitle", { count })}
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch gap-4 md:flex-row md:items-center">
        <SearchInput
          value={query}
          onChange={onSearch}
          placeholder={t("discovery.search_placeholder")}
          isLoading={isLoading}
          debounceMs={0}
          label={t("discovery.search_label")}
          actionText={t("discovery.search_action")}
        />

        <button
          onClick={onOpenFilters}
          className="flex min-h-[84px] items-center justify-center gap-3 rounded-[28px] border border-border bg-white px-6 text-[15px] font-semibold text-on-surface shadow-[0_12px_34px_rgba(0,0,0,0.07)] transition-all duration-200 hover:bg-[#f7f7f7] hover:shadow-[0_16px_42px_rgba(0,0,0,0.1)] md:min-w-[180px]"
        >
          <IoOptionsOutline className="text-[20px] text-primary" />
          <span>{t("filters.title")}</span>
          {hasActiveFilters && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
        </button>
      </div>
    </div>
  );
}
