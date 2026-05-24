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
    <div className="relative flex items-center bg-[#111111] rounded-xl border border-[#262626] px-3.5 h-11 transition-all duration-300 hover:border-[#8b6a55]/40 focus-within:border-[#8b6a55] w-full md:w-auto">
      <SlidersHorizontal className="w-4 h-4 text-white/50 mr-2.5 shrink-0" />
      <span className="text-xs text-white/40 uppercase tracking-widest font-bold hidden md:inline mr-2">
        {t("sort.label")}:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as "newest" | "oldest" | "name_asc" | "rating_desc")}
        className="bg-transparent text-white text-xs font-bold uppercase tracking-wider outline-none cursor-pointer pr-6 py-1 w-full md:w-auto select-none appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a3a3a3' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right -4px center",
          backgroundSize: "20px 20px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#111111] text-white py-2"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
