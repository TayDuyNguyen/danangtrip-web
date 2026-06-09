"use client";

import { useTranslations } from "next-intl";
import { NEARBY_RADIUS_OPTIONS } from "../constants/district-coords";

interface NearbyRadiusFilterProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
}

export default function NearbyRadiusFilter({
  radius,
  onRadiusChange,
}: NearbyRadiusFilterProps) {
  const t = useTranslations("locations");

  return (
    <div>
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-on-surface-subtle">
        {t("nearby.radius.label")}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {NEARBY_RADIUS_OPTIONS.map((km) => (
          <button
            key={km}
            type="button"
            onClick={() => onRadiusChange(km)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
              radius === km
                ? "bg-primary text-white"
                : "border border-border bg-[#fafafa] text-on-surface-subtle hover:border-primary/30"
            }`}
          >
            {t("nearby.radius.unit", { km })}
          </button>
        ))}
      </div>
    </div>
  );
}
