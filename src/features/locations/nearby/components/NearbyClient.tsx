"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";
import { locationService } from "@/services/location.service";
import { useNearbyLocations } from "../hooks/useNearbyLocations";
import LocationCardCompact from "./LocationCardCompact";
import NearbyMapSimulator from "./NearbyMapSimulator";
import type { Location } from "@/types";
import {
  IoAlertCircleOutline,
  IoLocationOutline,
  IoMapOutline,
  IoMenuOutline,
  IoRefreshOutline,
} from "@/components/icons/solar";

type NearbyCategory = {
  slug: string;
  name: string;
};

const DISTRICT_COORDS = [
  { name: "Hai Chau", nameVi: "Hai Chau", lat: 16.0611, lng: 108.2274 },
  { name: "Son Tra", nameVi: "Son Tra", lat: 16.095, lng: 108.255 },
  { name: "Ngu Hanh Son", nameVi: "Ngu Hanh Son", lat: 16.025, lng: 108.265 },
  { name: "Thanh Khe", nameVi: "Thanh Khe", lat: 16.065, lng: 108.195 },
  { name: "Lien Chieu", nameVi: "Lien Chieu", lat: 16.09, lng: 108.14 },
  { name: "Cam Le", nameVi: "Cam Le", lat: 16.015, lng: 108.185 },
  { name: "Hoa Vang", nameVi: "Hoa Vang", lat: 15.99, lng: 108.08 },
];

export default function NearbyClient({ locale }: { locale: string }) {
  const t = useTranslations("locations");
  const isEn = locale === "en";
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  const [hoveredLocationId, setHoveredLocationId] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<(Location & { distance?: number }) | null>(null);
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");

  const {
    coords,
    gpsStatus,
    radius,
    sortBy,
    locations,
    isLoading,
    isFetching,
    setRadius,
    setSortBy,
    requestGPS,
    setManualCoordinates,
  } = useNearbyLocations();

  const { data: categories = [] } = useQuery<NearbyCategory[]>({
    queryKey: ["locations", "categories"],
    queryFn: async () => {
      const response = await locationService.getCategories();
      if (response.success && Array.isArray(response.data)) {
        return response.data as NearbyCategory[];
      }
      return [];
    },
    staleTime: 30 * 60 * 1000,
  });

  const filteredLocations = useMemo(() => {
    if (selectedCategorySlug === "all") return locations;
    return locations.filter((location) => {
      if (typeof location.category === "object" && location.category !== null) {
        return (location.category as { slug: string }).slug === selectedCategorySlug;
      }
      return location.category?.toLowerCase() === selectedCategorySlug.toLowerCase();
    });
  }, [locations, selectedCategorySlug]);

  const gpsBadge = useMemo(() => {
    if (gpsStatus === "requesting") {
      return {
        className: "border-amber-500/20 bg-amber-500/10 text-amber-500",
        dotClassName: "bg-amber-500 animate-pulse",
        label: t("nearby.gps_status.requesting") || "Detecting location...",
      };
    }

    if (gpsStatus === "approved") {
      return {
        className: "border-[#8b6a55]/20 bg-[#8b6a55]/10 text-[#8b6a55]",
        dotClassName: "bg-[#8b6a55]",
        label: t("nearby.gps_status.active") || "Da Nang, Viet Nam - Updated",
      };
    }

    return {
      className: "border-rose-500/20 bg-rose-500/10 text-rose-500",
      dotClassName: "bg-rose-500",
      label: t("nearby.gps_status.denied") || "Location permission is blocked",
    };
  }, [gpsStatus, t]);

  return (
    <div className="flex min-h-screen flex-col bg-transparent pt-20 text-white">
      <header className="relative overflow-hidden py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8b6a55]">GPS Nearby</p>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              {t("nearby.title") || "Nearby locations"}
            </h1>
            <p className="max-w-2xl text-sm font-medium leading-6 text-[#737373]">
              {t("nearby.subtitle") || "Find travel, food and entertainment places by your current distance."}
            </p>

            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${gpsBadge.className}`}>
              {gpsStatus === "denied" || gpsStatus === "error" ? (
                <IoAlertCircleOutline className="text-sm" />
              ) : (
                <span className={`h-2 w-2 rounded-full ${gpsBadge.dotClassName}`} />
              )}
              {gpsBadge.label}
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-end">
            <div className="space-y-2">
              <span className="block text-xs font-black uppercase tracking-wider text-[#737373]">
                {t("nearby.radius.label") || "Radius"}
              </span>
              <div className="flex rounded-full border border-[#262626] bg-[#111111] p-1">
                {[1, 3, 5, 10].map((km) => (
                  <button
                    key={km}
                    type="button"
                    onClick={() => setRadius(km)}
                    className={`rounded-full px-4 py-2 text-xs font-black transition ${
                      radius === km
                        ? "bg-[#8b6a55] text-white shadow-lg"
                        : "text-[#a3a3a3] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {t("nearby.radius.unit", { km }) || `${km} km`}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={requestGPS}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#171717] border border-[#262626] hover:bg-[#8b6a55] px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition duration-300 hover:scale-[1.02]"
            >
              <IoRefreshOutline className={`text-base ${isFetching ? "animate-spin" : ""}`} />
              {t("nearby.controls.refresh") || "Update location"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-6 py-8">
        {(gpsStatus === "denied" || gpsStatus === "error") && (
          <section className="relative overflow-hidden flex flex-col gap-5 rounded-2xl border border-[#8b6a55]/20 bg-[#121110]/50 backdrop-blur p-5 md:flex-row md:items-center md:justify-between animate-reveal-up">
            <div>
              <h2 className="text-base font-black text-white">
                {t("nearby.fallback_banner.title") || "Choose a Da Nang district"}
              </h2>
              <p className="mt-1 max-w-2xl text-xs font-medium text-[#a3a3a3]">
                {t("nearby.fallback_banner.subtitle") ||
                  "When GPS is unavailable, select a district to explore nearby locations manually."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {DISTRICT_COORDS.map((district) => (
                <button
                  key={district.name}
                  type="button"
                  onClick={() => setManualCoordinates(district.lat, district.lng)}
                  className="rounded-xl border border-[#262626] bg-[#1c1c1c] px-3.5 py-2 text-xs font-black text-white transition hover:border-[#8b6a55]/50 hover:bg-[#8b6a55]/10"
                >
                  {isEn ? district.name : district.nameVi}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 rounded-xl border border-[#262626] bg-[#121212] p-1 shadow-sm md:hidden">
          <button
            type="button"
            onClick={() => setMobileTab("map")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition ${
              mobileTab === "map" ? "bg-[#8b6a55] text-white" : "text-[#a3a3a3]"
            }`}
          >
            <IoMapOutline className="text-base" />
            {t("detail.view_on_map") || "Map"}
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("list")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition ${
              mobileTab === "list" ? "bg-[#8b6a55] text-white" : "text-[#a3a3a3]"
            }`}
          >
            <IoMenuOutline className="text-base" />
            {t("category.subcategories_title") || "List"}
          </button>
        </div>

        <div className="grid min-h-[560px] grid-cols-1 items-stretch gap-6 md:grid-cols-12">
          <section
            className={`rounded-2xl border border-[#262626] bg-[#030303]/60 backdrop-blur-xl p-5 shadow-2xl md:col-span-5 md:flex md:flex-col ${
              mobileTab === "list" ? "block" : "hidden md:flex"
            }`}
          >
            <div className="mb-4 space-y-4 border-b border-[#262626] pb-4">
              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar select-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategorySlug("all")}
                  className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-black transition ${
                    selectedCategorySlug === "all"
                      ? "border-[#8b6a55] bg-[#8b6a55]/20 text-white"
                      : "border-[#262626] bg-[#111111] text-[#a3a3a3] hover:border-[#8b6a55]/40 hover:text-white"
                  }`}
                >
                  {t("nearby.sidebar.select_category") || "All categories"}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => setSelectedCategorySlug(category.slug)}
                    className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-black transition ${
                      selectedCategorySlug === category.slug
                        ? "border-[#8b6a55] bg-[#8b6a55]/20 text-white"
                        : "border-[#262626] bg-[#111111] text-[#a3a3a3] hover:border-[#8b6a55]/40 hover:text-white"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-[#737373]">
                  {t("nearby.sidebar.results_count", { count: filteredLocations.length, radius }) ||
                    `${filteredLocations.length} places within ${radius} km`}
                </span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="rounded-xl border border-[#262626] bg-[#111111] px-3 py-2 text-xs font-black text-white/80 outline-none transition focus:border-[#8b6a55] focus:bg-[#171717]"
                >
                  <option value="distance">{t("nearby.sidebar.sort_by.closest") || "Closest"}</option>
                  <option value="avg_rating">{t("nearby.sidebar.sort_by.rating") || "Top rated"}</option>
                  <option value="review_count">{t("nearby.sidebar.sort_by.popular") || "Popular"}</option>
                </select>
              </div>
            </div>

            <div className="relative flex-1 space-y-3 overflow-y-auto pr-2 md:max-h-[500px] custom-scrollbar">
              {isFetching && !isLoading && (
                <div className="sticky top-0 z-10 mb-2 rounded-xl border border-[#8b6a55]/30 bg-[#8b6a55]/10 px-3 py-2 text-xs font-black text-white">
                  {t("nearby.gps_status.requesting") || "Updating data..."}
                </div>
              )}

              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex h-24 w-full gap-4 rounded-2xl border border-[#262626] bg-[#111111]/50 p-3 animate-pulse">
                    <div className="h-18 w-18 shrink-0 rounded-xl bg-[#1c1c1c]" />
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 w-3/4 rounded bg-[#1c1c1c]" />
                      <div className="h-3 w-1/2 rounded bg-[#1c1c1c]" />
                      <div className="h-3 w-1/3 rounded bg-[#1c1c1c]" />
                    </div>
                  </div>
                ))
              ) : filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <LocationCardCompact
                    key={location.id}
                    location={location}
                    isHighlighted={hoveredLocationId === location.id}
                    isSelected={selectedLocation?.id === location.id}
                    onHover={(hovered) => setHoveredLocationId(hovered ? location.id : null)}
                    onClick={() => setSelectedLocation(location)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#262626] bg-[#111111]/30 px-4 py-16 text-center">
                  <IoLocationOutline className="text-5xl text-white/20" />
                  <h3 className="mt-4 text-sm font-black uppercase tracking-wide text-white">
                    {t("nearby.empty.title") || "No nearby locations found"}
                  </h3>
                  <p className="mt-2 max-w-[280px] text-xs font-medium leading-5 text-[#a3a3a3]">
                    {t("nearby.empty.subtitle") || "Try a larger radius or another category."}
                  </p>
                  <div className="mt-4 flex gap-2">
                    {[5, 10, 20].map((km) => (
                      <button
                        key={km}
                        type="button"
                        onClick={() => setRadius(km)}
                        className="rounded-xl border border-[#262626] bg-[#1c1c1c] px-3 py-2 text-xs font-black text-white transition hover:border-[#8b6a55]/40 hover:bg-[#8b6a55]/10"
                      >
                        {t("nearby.radius.unit", { km }) || `${km} km`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-[#262626] pt-3 text-center">
              <Link href={PUBLIC_ROUTES.LOCATIONS} className="text-xs font-black text-[#8b6a55] hover:underline">
                {t("category.fallback_cta") || "Back to locations"}
              </Link>
            </div>
          </section>

          <section className={`md:col-span-7 ${mobileTab === "map" ? "block" : "hidden md:block"}`}>
            <NearbyMapSimulator
              userCoords={coords}
              radius={radius}
              selectedLocation={selectedLocation}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
