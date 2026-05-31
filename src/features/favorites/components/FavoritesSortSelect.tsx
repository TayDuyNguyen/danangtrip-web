"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

interface FavoritesSortSelectProps {
  value: "newest" | "oldest" | "name_asc" | "rating_desc";
  onChange: (value: "newest" | "oldest" | "name_asc" | "rating_desc") => void;
}

export function FavoritesSortSelect({ value, onChange }: FavoritesSortSelectProps) {
  const t = useTranslations("favorites");

  const options = [
    { value: "newest", label: t("sort.newest") },
    { value: "oldest", label: t("sort.oldest") },
    { value: "name_asc", label: t("sort.name_asc") },
    { value: "rating_desc", label: t("sort.rating_desc") },
  ];

  return (
    <div className="relative flex h-11 w-full items-center rounded-full border border-border bg-white px-3.5 shadow-sm transition-all duration-300 hover:border-primary/30 focus-within:border-primary md:w-auto">
      <SlidersHorizontal className="mr-2.5 h-4 w-4 shrink-0 text-on-surface-subtle" />
      <span className="mr-2 hidden text-xs font-bold uppercase tracking-widest text-on-surface-subtle md:inline">
        {t("sort.label")}:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as "newest" | "oldest" | "name_asc" | "rating_desc")}
        className="w-full cursor-pointer appearance-none bg-transparent py-1 pr-6 text-xs font-semibold uppercase tracking-wider text-on-surface outline-none select-none md:w-auto"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236A6A6A' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right -4px center",
          backgroundSize: "20px 20px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white py-2 text-on-surface"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
