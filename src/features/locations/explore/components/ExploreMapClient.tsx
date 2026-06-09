"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { locationService } from "@/services/location.service";
import { CategoryIconRenderer } from "@/utils/category-icon";
import {
  LocationCardCompact,
  NearbyDistrictFallback,
  NearbyFilters,
  NearbyGpsBadge,
  NearbyRefreshButton,
} from "@/features/locations/nearby/components";
import { useNearbyLocations } from "@/features/locations/nearby/hooks/useNearbyLocations";
import ExploreMapToolbar from "./ExploreMapToolbar";
import { resolveExploreCategoryLabel } from "../utils/explore-category-label";
import { getLocationCategoryMeta } from "../utils/location-category";
import type { Category, Location } from "@/types";
import {
  IoMapOutline,
  IoMenuOutline,
  IoSearchOutline,
} from "@/components/icons/solar";

const LeafletExploreMap = dynamic(
  () => import("./LeafletExploreMap"),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-slate-100" /> }
);

type MapMode = "explore" | "nearby";

async function fetchAllMapLocations() {
  const all: Location[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const response = await locationService.getAll({ page, per_page: 100 });
    if (!response.success || !response.data) break;

    all.push(...response.data.data);
    lastPage = response.data.last_page ?? 1;
    page += 1;
  } while (page <= lastPage && page <= 10);

  return all.filter((location) => {
    const lat = Number(location.latitude);
    const lng = Number(location.longitude);
    return Number.isFinite(lat) && Number.isFinite(lng);
  });
}

export default function ExploreMapClient({
  locale,
  initialMode = "explore",
}: {
  locale: string;
  initialMode?: MapMode;
}) {
  const t = useTranslations("locations");
  const tExploreCategories = useTranslations("locations.explore.categories");
  const [search, setSearch] = useState("");
  const [mapMode, setMapMode] = useState<MapMode>(initialMode);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapFocusNonce, setMapFocusNonce] = useState(0);
  const [hoveredLocationId, setHoveredLocationId] = useState<number | null>(null);
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");
  const [showRoute, setShowRoute] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    coords: userCoords,
    gpsStatus,
    radius,
    sortBy,
    locations: nearbyLocations,
    isLoading: isNearbyLoading,
    isFetching: isNearbyFetching,
    setRadius,
    setSortBy,
    requestGPS,
    setManualCoordinates,
  } = useNearbyLocations({ autoRequestGPS: false });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && mapMode === "nearby" && gpsStatus === "idle") {
      requestGPS();
    }
  }, [gpsStatus, isHydrated, mapMode, requestGPS]);

  const { data: exploreLocations = [], isLoading: isExploreLoading } = useQuery({
    queryKey: ["explore-map", "locations"],
    queryFn: fetchAllMapLocations,
    staleTime: 10 * 60 * 1000,
    enabled: isHydrated && mapMode === "explore",
  });

  const { data: apiCategories = [] } = useQuery({
    queryKey: ["locations", "categories"],
    queryFn: async () => {
      const response = await locationService.getCategories();
      return response.success && Array.isArray(response.data)
        ? (response.data as Category[])
        : [];
    },
    staleTime: 30 * 60 * 1000,
    enabled: isHydrated,
  });

  const baseLocations = mapMode === "nearby" ? nearbyLocations : exploreLocations;
  const showListLoading =
    !isHydrated ||
    (mapMode === "explore" ? isExploreLoading : isNearbyLoading || gpsStatus === "requesting");

  const categoryChips = useMemo(() => {
    const chipMap = new Map<
      string,
      { slug: string; name: string; icon: string | null; bg: string; sortOrder: number }
    >();

    apiCategories
      .filter((category) => category.status === "active")
      .forEach((category) => {
        chipMap.set(category.slug, {
          slug: category.slug,
          name: resolveExploreCategoryLabel(category.slug, category.name, tExploreCategories),
          icon: category.icon,
          bg: category.icon_background ?? "#FFF4E8",
          sortOrder: category.sort_order ?? 999,
        });
      });

    baseLocations.forEach((location) => {
      const meta = getLocationCategoryMeta(location);
      if (!meta.slug || chipMap.has(meta.slug)) return;

      const category =
        typeof location.category === "object" && location.category !== null
          ? location.category
          : null;

      chipMap.set(meta.slug, {
        slug: meta.slug,
        name: resolveExploreCategoryLabel(meta.slug, meta.name, tExploreCategories),
        icon: category?.icon ?? meta.iconKey,
        bg: meta.iconBackground,
        sortOrder: category?.sort_order ?? 999,
      });
    });

    const chips = Array.from(chipMap.values()).sort(
      (left, right) => left.sortOrder - right.sortOrder
    );

    return [
      {
        slug: "all",
        name: t("explore.all_categories"),
        icon: null,
        bg: "#f8fafc",
        sortOrder: -1,
      },
      ...chips,
    ];
  }, [apiCategories, baseLocations, t, tExploreCategories]);

  const filteredLocations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return baseLocations.filter((location) => {
      const categorySlug =
        typeof location.category === "object" && location.category !== null
          ? location.category.slug
          : "";

      const matchesCategory =
        selectedCategorySlug === "all" || categorySlug === selectedCategorySlug;

      const matchesSearch =
        !keyword ||
        location.name.toLowerCase().includes(keyword) ||
        location.address?.toLowerCase().includes(keyword) ||
        location.district?.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [baseLocations, search, selectedCategorySlug]);

  useEffect(() => {
    if (
      selectedLocation &&
      !filteredLocations.some((location) => location.id === selectedLocation.id)
    ) {
      setSelectedLocation(null);
    }
  }, [filteredLocations, selectedLocation]);

  const popupLabels = useMemo(
    () => ({
      detail: t("explore.popup_detail"),
      maps: t("explore.popup_maps"),
    }),
    [t]
  );

  const sovereigntyLabels = useMemo(
    () => ({
      hoangSa: {
        title: t("explore.sovereignty.hoang_sa_title"),
        claim: t("explore.sovereignty.hoang_sa_claim"),
      },
      truongSa: {
        title: t("explore.sovereignty.truong_sa_title"),
        claim: t("explore.sovereignty.truong_sa_claim"),
      },
    }),
    [t]
  );

  const toolbarLabels = useMemo(
    () => ({
      myLocation: t("explore.my_location"),
      directions: t("explore.directions"),
      gpsRequesting: t("explore.gps_requesting"),
      gpsActive: t("explore.gps_active"),
      gpsDenied: t("explore.gps_denied"),
      selectDestination: t("explore.select_destination"),
      openGoogleMaps: t("explore.open_google_maps"),
      detail: t("explore.popup_detail"),
      routeActive: t("explore.route_active"),
    }),
    [t]
  );

  const directionsUrl = useMemo(() => {
    if (!selectedLocation) return "";
    const lat = Number(selectedLocation.latitude);
    const lng = Number(selectedLocation.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "";
    if (userCoords) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${lat},${lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }, [selectedLocation, userCoords]);

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setShowRoute(false);
    setMobileTab("map");
    setMapFocusNonce((current) => current + 1);
  };

  const handleToggleRoute = () => {
    if (!selectedLocation) return;
    if (gpsStatus !== "approved") {
      requestGPS();
      return;
    }
    setShowRoute((current) => !current);
  };

  const resultsLabel = showListLoading
    ? t("explore.loading")
    : mapMode === "nearby"
      ? t("nearby.sidebar.results_count", { count: filteredLocations.length, radius })
      : t("explore.results_count", { count: filteredLocations.length });

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col bg-[#f7f7f7]">
      <header className="border-b border-border bg-white px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">
              {t("explore.badge")}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-on-surface md:text-3xl">
              {t("explore.title")}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-on-surface-subtle">
              {t("explore.subtitle")}
            </p>
            <div className="mt-3">
              <NearbyGpsBadge
                status={gpsStatus}
                coords={userCoords}
                locale={locale}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 md:max-w-md">
            <div className="relative">
              <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-subtle" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("explore.search_placeholder")}
                className="w-full rounded-2xl border border-border bg-[#fafafa] py-3 pl-10 pr-4 text-sm font-medium text-on-surface outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div className="flex rounded-2xl border border-border bg-[#fafafa] p-1">
              <button
                type="button"
                onClick={() => setMapMode("explore")}
                className={`flex-1 rounded-xl py-2 text-xs font-black transition ${
                  mapMode === "explore"
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-subtle hover:bg-white/80 hover:text-on-surface"
                }`}
              >
                {t("explore.mode_explore")}
              </button>
              <button
                type="button"
                onClick={() => setMapMode("nearby")}
                className={`flex-1 rounded-xl py-2 text-xs font-black transition ${
                  mapMode === "nearby"
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-subtle hover:bg-white/80 hover:text-on-surface"
                }`}
              >
                {t("explore.mode_nearby")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mapMode === "nearby" && (gpsStatus === "denied" || gpsStatus === "error") && (
        <NearbyDistrictFallback
          locale={locale}
          onSelectDistrict={setManualCoordinates}
        />
      )}

      <div className="grid grid-cols-2 border-b border-border bg-white px-4 py-2 md:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("map")}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black ${
            mobileTab === "map" ? "bg-primary text-white" : "text-on-surface-subtle"
          }`}
        >
          <IoMapOutline className="text-base" />
          {t("explore.tab_map")}
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("list")}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black ${
            mobileTab === "list" ? "bg-primary text-white" : "text-on-surface-subtle"
          }`}
        >
          <IoMenuOutline className="text-base" />
          {t("explore.tab_list")}
        </button>
      </div>

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 gap-0 px-0 md:gap-4 md:p-4">
        <section
          className={`flex w-full flex-col border-border bg-white md:w-[380px] md:shrink-0 md:rounded-[24px] md:border md:shadow-sm ${
            mobileTab === "list" ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-on-surface-subtle">{resultsLabel}</p>
              {mapMode === "nearby" && (
                <NearbyRefreshButton
                  onRefresh={requestGPS}
                  isFetching={isNearbyFetching}
                />
              )}
            </div>

            {mapMode === "nearby" && (
              <div className="mt-3">
                <NearbyFilters
                  radius={radius}
                  sortBy={sortBy}
                  onRadiusChange={setRadius}
                  onSortChange={setSortBy}
                />
              </div>
            )}

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {categoryChips.map((category) => {
                const active = selectedCategorySlug === category.slug;
                return (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => setSelectedCategorySlug(category.slug)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${
                      active
                        ? "border-primary bg-primary/10 text-on-surface"
                        : "border-border bg-[#fafafa] text-on-surface-subtle hover:border-primary/30"
                    }`}
                  >
                    {category.icon ? (
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full"
                        style={{ background: category.bg }}
                      >
                        <CategoryIconRenderer icon={category.icon} className="text-xs" />
                      </span>
                    ) : null}
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 md:max-h-[calc(100vh-320px)]">
            {showListLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-2xl border border-border bg-[#fafafa]"
                  />
                ))
              : filteredLocations.length > 0
                ? filteredLocations.map((location) => (
                    <LocationCardCompact
                      key={location.id}
                      location={location}
                      isHighlighted={hoveredLocationId === location.id}
                      isSelected={selectedLocation?.id === location.id}
                      onHover={(hovered) =>
                        setHoveredLocationId(hovered ? location.id : null)
                      }
                      onClick={() => handleSelectLocation(location)}
                    />
                  ))
                : (
                    <div className="rounded-2xl border border-dashed border-border bg-[#fafafa] px-4 py-10 text-center text-sm text-on-surface-subtle">
                      {mapMode === "nearby"
                        ? t("nearby.empty.subtitle")
                        : t("explore.empty")}
                    </div>
                  )}
          </div>
        </section>

        <section
          className={`isolate z-0 flex min-h-[520px] flex-1 flex-col overflow-hidden bg-white md:min-h-[640px] md:rounded-[24px] md:border md:border-border md:shadow-sm ${
            mobileTab === "map" ? "flex" : "hidden md:flex"
          }`}
        >
          <ExploreMapToolbar
            locale={locale}
            selectedLocation={selectedLocation}
            gpsStatus={gpsStatus}
            showRoute={showRoute}
            directionsUrl={directionsUrl}
            categoryChips={categoryChips}
            selectedCategorySlug={selectedCategorySlug}
            onSelectCategory={setSelectedCategorySlug}
            onRequestGps={requestGPS}
            onToggleRoute={handleToggleRoute}
            labels={toolbarLabels}
          />

          <div className="relative z-0 min-h-[360px] flex-1 isolate">
            <LeafletExploreMap
              locale={locale}
              locations={filteredLocations}
              selectedLocationId={selectedLocation?.id ?? null}
              mapFocusNonce={mapFocusNonce}
              hoveredLocationId={hoveredLocationId}
              userCoords={userCoords}
              showRoute={showRoute}
              onSelectLocation={handleSelectLocation}
              popupLabels={popupLabels}
              sovereigntyLabels={sovereigntyLabels}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
