"use client";

import { useTranslations } from "next-intl";
import { IoRefreshOutline } from "@/components/icons/solar";

interface NearbyRefreshButtonProps {
  onRefresh: () => void;
  isFetching?: boolean;
}

export default function NearbyRefreshButton({
  onRefresh,
  isFetching = false,
}: NearbyRefreshButtonProps) {
  const t = useTranslations("locations");

  return (
    <button
      type="button"
      onClick={onRefresh}
      className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[10px] font-bold text-on-surface-subtle transition hover:border-primary/40 hover:text-primary"
    >
      <IoRefreshOutline className={`text-sm ${isFetching ? "animate-spin" : ""}`} />
      {t("nearby.controls.refresh")}
    </button>
  );
}
