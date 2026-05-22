"use client";

import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { useTranslations } from "next-intl";

interface FavoritesViewToggleProps {
  view: "grid" | "list";
  onChange: (view: "grid" | "list") => void;
}

export function FavoritesViewToggle({ view, onChange }: FavoritesViewToggleProps) {
  const t = useTranslations("favorites");

  return (
    <div className="flex items-center bg-[#111111] p-1 rounded-xl border border-[#262626] h-11">
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
          view === "grid"
            ? "bg-[#8b6a55] text-white shadow-lg"
            : "text-white/60 hover:text-white hover:bg-white/5"
        }`}
        aria-label={t("grid_view")}
        title={t("grid_view")}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">{t("grid_view")}</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("list")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
          view === "list"
            ? "bg-[#8b6a55] text-white shadow-lg"
            : "text-white/60 hover:text-white hover:bg-white/5"
        }`}
        aria-label={t("list_view")}
        title={t("list_view")}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">{t("list_view")}</span>
      </button>
    </div>
  );
}
