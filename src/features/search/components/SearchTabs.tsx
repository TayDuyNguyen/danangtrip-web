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
    <div className="flex items-center gap-1 rounded-2xl border border-[#262626] bg-[#141414] p-1 shadow-sm w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
            activeType === tab.id
              ? "bg-[#050505] text-[#d4a689] shadow-sm scale-100"
              : "text-white/75 hover:text-white hover:bg-white/5 scale-100"
          )}
        >
          <div className="flex items-center gap-2">
            <span>{tab.label}</span>
            <span className={cn(
              "px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors",
              activeType === tab.id ? "bg-[#8b6a55]/15 text-[#d4a689]" : "bg-white/5 text-white/65"
            )}>
              {tab.count}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
