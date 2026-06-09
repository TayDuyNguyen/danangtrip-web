"use client";

import { useTranslations } from "next-intl";

interface NearbySortSelectProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export default function NearbySortSelect({ sortBy, onSortChange }: NearbySortSelectProps) {
  const t = useTranslations("locations");

  return (
    <select
      value={sortBy}
      onChange={(event) => onSortChange(event.target.value)}
      className="w-full rounded-xl border border-border bg-[#fafafa] px-3 py-2 text-xs font-semibold text-on-surface outline-none transition focus:border-primary focus:bg-white"
    >
      <option value="distance">{t("nearby.sidebar.sort_by.closest")}</option>
      <option value="avg_rating">{t("nearby.sidebar.sort_by.rating")}</option>
      <option value="review_count">{t("nearby.sidebar.sort_by.popular")}</option>
    </select>
  );
}
