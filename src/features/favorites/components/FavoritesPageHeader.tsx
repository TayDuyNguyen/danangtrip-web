"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface FavoritesPageHeaderProps {
  count: number;
}

export function FavoritesPageHeader({ count }: FavoritesPageHeaderProps) {
  const t = useTranslations("favorites");

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {t("page_title")}
        </h1>
        <p className="text-on-surface-subtle text-sm mt-1.5 font-medium">
          {t("location_count", { count })}
        </p>
      </div>
    </div>
  );
}
