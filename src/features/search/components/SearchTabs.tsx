"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils/string";
import { SearchResultType } from "../types/search.types";

interface SearchTabsProps {
  activeType: "all" | SearchResultType;
  onChange: (type: "all" | SearchResultType) => void;
  /** Khi undefined (discovery mode) thì ẩn badge số đếm */
  counts?: {
    all: number;
    tour: number;
    location: number;
  };
}

export const SearchTabs = ({ activeType, onChange, counts }: SearchTabsProps) => {
  const t = useTranslations("search");

  const tabs: Array<{ id: "all" | SearchResultType; label: string; count?: number }> = [
    { id: "all", label: t("tabs.all"), count: counts?.all },
    { id: "tour", label: t("tabs.tour"), count: counts?.tour },
    { id: "location", label: t("tabs.location"), count: counts?.location },
  ];

  return (
    <div className="flex items-center gap-2">
      {tabs.map((tab) => {
        const isActive = activeType === tab.id;
        const hasCount = tab.count !== undefined;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300",
              isActive
                ? "bg-[#8b6a55]/25 border border-[#8b6a55] text-[#f0d4be] shadow-[0_0_12px_rgba(139,106,85,0.35)]"
                : "border border-[#6b5a50]/80 text-[#c0a898] bg-[#1a1510]/60 hover:border-[#8b6a55] hover:text-[#e5e2e1] hover:bg-[#8b6a55]/10"
            )}
          >
            <span>{tab.label}</span>
            {hasCount && (
              <span
                className={cn(
                  "text-[11px] font-bold ml-0.5",
                  isActive ? "text-[#e7bea6]" : "text-[#a89080]"
                )}
              >
                ({tab.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
