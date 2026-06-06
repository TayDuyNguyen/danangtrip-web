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
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => {
        const isActive = activeType === tab.id;
        const hasCount = tab.count !== undefined;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300",
              isActive
                ? "border-primary/20 bg-[#fff1f3] text-primary shadow-[0_10px_28px_rgba(255,56,92,0.12)]"
                : "border-border bg-white text-on-surface-subtle hover:border-primary/25 hover:bg-[#fafafa] hover:text-on-surface"
            )}
          >
            <span>{tab.label}</span>
            {hasCount && (
              <span
                className={cn(
                  "text-[11px] font-bold ml-0.5",
                  isActive ? "text-primary/80" : "text-on-surface-subtle"
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
