"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils/string";
import { SearchResultType } from "../types/search.types";

interface SearchTabsProps {
  activeType: "all" | SearchResultType;
  onChange: (type: "all" | SearchResultType) => void;
  counts: {
    all: number;
    tour: number;
    location: number;
  };
}

export const SearchTabs = ({ activeType, onChange, counts }: SearchTabsProps) => {
  const t = useTranslations("search");

  const tabs: Array<{ id: "all" | SearchResultType; label: string; count: number }> = [
    { id: "all", label: t("tabs.all"), count: counts.all },
    { id: "tour", label: t("tabs.tour"), count: counts.tour },
    { id: "location", label: t("tabs.location"), count: counts.location },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-surface-container rounded-2xl w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
            activeType === tab.id
              ? "bg-surface-container-lowest text-azure shadow-sm scale-100"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40 scale-95"
          )}
        >
          <div className="flex items-center gap-2">
            <span>{tab.label}</span>
            <span className={cn(
              "px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors",
              activeType === tab.id ? "bg-azure/10 text-azure" : "bg-surface-container-high text-on-surface-subtle"
            )}>
              {tab.count}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
