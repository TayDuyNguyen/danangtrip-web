"use client";

import type { Location } from "@/types";
import { PUBLIC_ROUTES } from "@/config/routes";
import { CategoryIconRenderer } from "@/utils/category-icon";
import type { GPSStatusType } from "@/features/locations/nearby/hooks/useNearbyLocations";
import {
  IoCompassOutline,
  IoMapPinOutline,
  IoWalkOutline,
} from "@/components/icons/solar";
import { Link } from "@/i18n/navigation";

interface CategoryChip {
  slug: string;
  name: string;
  icon: string | null;
  bg: string;
}

interface ExploreMapToolbarProps {
  locale: string;
  selectedLocation: Location | null;
  gpsStatus: GPSStatusType;
  showRoute: boolean;
  directionsUrl: string;
  categoryChips: CategoryChip[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  onRequestGps: () => void;
  onToggleRoute: () => void;
  labels: {
    myLocation: string;
    directions: string;
    gpsRequesting: string;
    gpsActive: string;
    gpsDenied: string;
    selectDestination: string;
    openGoogleMaps: string;
    detail: string;
    routeActive: string;
  };
}

function withLocalePath(path: string, locale: string) {
  return locale === "vi" ? path : `/${locale}${path}`;
}

export default function ExploreMapToolbar({
  locale,
  selectedLocation,
  gpsStatus,
  showRoute,
  directionsUrl,
  categoryChips,
  selectedCategorySlug,
  onSelectCategory,
  onRequestGps,
  onToggleRoute,
  labels,
}: ExploreMapToolbarProps) {
  const gpsLabel =
    gpsStatus === "requesting"
      ? labels.gpsRequesting
      : gpsStatus === "approved"
        ? labels.gpsActive
        : labels.gpsDenied;

  return (
    <div className="relative z-10 flex shrink-0 flex-col gap-2 border-b border-border bg-white p-3 sm:p-4">
      <div className="overflow-x-auto rounded-2xl border border-border bg-[#fafafa] p-2">
        <div className="flex min-w-max gap-2">
          {categoryChips.map((category) => {
            const active = selectedCategorySlug === category.slug;
            return (
              <button
                key={`toolbar-${category.slug}`}
                type="button"
                onClick={() => onSelectCategory(category.slug)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold transition ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "bg-[#fafafa] text-on-surface-subtle hover:bg-primary/5 hover:text-on-surface"
                }`}
              >
                {category.icon ? (
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ background: active ? "rgba(255,255,255,0.2)" : category.bg }}
                  >
                    <CategoryIconRenderer
                      icon={category.icon}
                      className={`text-xs ${active ? "text-white" : ""}`}
                    />
                  </span>
                ) : null}
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-[#fafafa] p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
              {gpsLabel}
            </p>
            <h2 className="mt-0.5 truncate text-sm font-bold text-on-surface sm:text-base">
              {selectedLocation?.name ?? labels.selectDestination}
            </h2>
            {selectedLocation?.address ? (
              <p className="mt-0.5 truncate text-xs text-on-surface-subtle">
                {selectedLocation.address}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onRequestGps}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-[#fafafa] px-3 text-[11px] font-bold text-on-surface transition hover:border-primary/40 hover:bg-primary/5"
            >
              <IoMapPinOutline className="text-base text-[#1a73e8]" />
              {labels.myLocation}
            </button>

            <button
              type="button"
              onClick={onToggleRoute}
              disabled={!selectedLocation || gpsStatus !== "approved"}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[11px] font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-45"
            >
              <IoCompassOutline className="text-base" />
              {labels.directions}
            </button>

            {selectedLocation && directionsUrl ? (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-white px-3 text-[11px] font-bold text-on-surface transition hover:bg-[#fafafa]"
              >
                <IoWalkOutline className="text-base text-[#1a73e8]" />
                {labels.openGoogleMaps}
              </a>
            ) : null}

            {selectedLocation ? (
              <Link
                href={withLocalePath(
                  PUBLIC_ROUTES.LOCATION_DETAIL(selectedLocation.slug),
                  locale
                )}
                className="inline-flex h-9 items-center rounded-xl border border-border bg-white px-3 text-[11px] font-bold text-on-surface transition hover:bg-[#fafafa]"
              >
                {labels.detail}
              </Link>
            ) : null}
          </div>
        </div>

        {showRoute && selectedLocation && gpsStatus === "approved" ? (
          <p className="mt-2 text-[11px] font-semibold text-[#1a73e8]">
            {labels.routeActive}
          </p>
        ) : null}
      </div>
    </div>
  );
}
