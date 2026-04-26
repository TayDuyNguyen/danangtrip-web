"use client";

import { useTranslations } from "next-intl";
import { IoOptionsOutline } from "react-icons/io5";
import SearchInput from "@/components/ui/SearchInput";

interface LocationHeaderProps {
  onSearch: (query: string) => void;
  onOpenFilters: () => void;
  count: number;
  hasActiveFilters?: boolean;
  isLoading?: boolean;
  query?: string;
}

export default function LocationHeader({ onSearch, onOpenFilters, count, hasActiveFilters, isLoading, query = "" }: LocationHeaderProps) {
  const t = useTranslations("locations");

  return (
    <div className="space-y-10 py-12 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="flex flex-col gap-6 text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.1]">
          {t("discovery.title")}
        </h1>
        <p className="text-xl text-on-surface-subtle max-w-2xl font-medium leading-relaxed">
          {t("discovery.subtitle", { count })}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <SearchInput 
          value={query}
          onChange={onSearch}
          placeholder={t("discovery.search_placeholder")}
          isLoading={isLoading}
        />

        <button
          onClick={onOpenFilters}
          className="flex items-center gap-4 px-10 py-7 bg-surface-container-low/40 backdrop-blur-md border-2 border-outline-variant/10 hover:border-[#8b6a55]/30 hover:bg-surface-container-low text-foreground font-black rounded-xl transition-all duration-500 scale-100 active:scale-90 shadow-sm group"
        >
          <IoOptionsOutline className="text-2xl group-hover:rotate-180 transition-transform duration-700 text-[#8b6a55]" />
          <span className="text-lg">{t("filters.title")}</span>
          {hasActiveFilters && (
            <span className="w-3 h-3 rounded-full bg-[#8b6a55] shadow-lg shadow-black/30 animate-pulse ml-1" />
          )}
        </button>
      </div>
    </div>
  );
}
