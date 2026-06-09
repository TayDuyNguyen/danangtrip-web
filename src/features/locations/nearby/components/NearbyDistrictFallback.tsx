"use client";

import { useTranslations } from "next-intl";
import { DA_NANG_DISTRICT_COORDS } from "../constants/district-coords";

interface NearbyDistrictFallbackProps {
  locale: string;
  onSelectDistrict: (lat: number, lng: number) => void;
}

export default function NearbyDistrictFallback({
  locale,
  onSelectDistrict,
}: NearbyDistrictFallbackProps) {
  const t = useTranslations("locations");
  const isEn = locale === "en";

  return (
    <section className="border-b border-primary/15 bg-white px-4 py-4 md:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-on-surface">
            {t("nearby.fallback_banner.title")}
          </h2>
          <p className="mt-1 text-xs text-on-surface-subtle">
            {t("nearby.fallback_banner.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {DA_NANG_DISTRICT_COORDS.map((district) => (
            <button
              key={district.name}
              type="button"
              onClick={() => onSelectDistrict(district.lat, district.lng)}
              className="rounded-xl border border-border bg-[#fafafa] px-3 py-2 text-xs font-semibold text-on-surface transition hover:border-primary/40 hover:bg-primary/5"
            >
              {isEn ? district.name : district.nameVi}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
