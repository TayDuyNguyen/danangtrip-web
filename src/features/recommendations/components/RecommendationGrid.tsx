"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IoCompassOutline, IoAlertCircleOutline } from "@/components/icons/solar";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui";
import { useRecommendationsQuery } from "../hooks/useRecommendationsQuery";
import LocationCard from "@/features/locations/components/LocationCard";
import TourCard from "@/features/tour/components/TourCard";
import ReasonTag from "./ReasonTag";
import { ROUTES } from "@/config";

export default function RecommendationGrid() {
  const t = useTranslations("recommendations");
  const [activeTab, setActiveTab] = useState<"all" | "location" | "tour">("all");

  const { data, isLoading, isError, refetch } = useRecommendationsQuery();

  const locations = data?.locations || [];
  const tours = data?.tours || [];

  // Filter lists based on active tab
  const showLocations = activeTab === "all" || activeTab === "location";
  const showTours = activeTab === "all" || activeTab === "tour";

  const hasData = locations.length > 0 || tours.length > 0;
  const isFilteredEmpty =
    (activeTab === "location" && locations.length === 0) ||
    (activeTab === "tour" && tours.length === 0) ||
    !hasData;

  const handleTabChange = (tab: "all" | "location" | "tour") => {
    setActiveTab(tab);
  };

  // Render Skeletons
  if (isLoading) {
    return (
      <div className="space-y-6">
        <TabSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CardSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    );
  }

  // Render Error
  if (isError) {
    return (
      <div className="space-y-6">
        <TabSkeleton />
        <div className="mx-auto my-12 max-w-xl animate-in rounded-[20px] border border-border bg-white p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)] duration-700">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <IoAlertCircleOutline className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-on-surface font-bold text-lg mb-2">{t("error.title")}</h3>
          <p className="text-on-surface-subtle text-sm mb-6 max-w-sm mx-auto">{t("error.message")}</p>
          <Button
            onClick={() => refetch()}
            className="cursor-pointer rounded-full bg-primary px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[0_12px_30px_rgba(255,56,92,0.22)] transition-all duration-300 hover:bg-primary-hover"
          >
            {t("error.retry")}
          </Button>
        </div>
      </div>
    );
  }

  // Render Empty State
  if (!hasData) {
    return (
      <div className="space-y-6">
        <TabSkeleton />
        <div className="mx-auto my-12 max-w-xl animate-in rounded-[20px] border border-border bg-white p-16 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)] duration-700">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <IoCompassOutline className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-on-surface font-bold text-2xl mb-3">{t("empty.title")}</h3>
          <p className="text-on-surface-subtle text-sm mb-8 leading-relaxed max-w-sm mx-auto">
            {t("empty.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={ROUTES.LOCATIONS}
              className="rounded-full bg-primary px-6 py-3 text-center text-xs font-black uppercase tracking-widest text-white shadow-[0_12px_30px_rgba(255,56,92,0.22)] transition-all duration-300 active:scale-95 hover:bg-primary-hover"
            >
              {t("empty.cta_locations")}
            </Link>
            <Link
              href={ROUTES.TOURS}
              className="rounded-full border border-border bg-white px-6 py-3 text-center text-xs font-black uppercase tracking-widest text-on-surface transition-all duration-300 active:scale-95 hover:bg-[#f7f7f7]"
            >
              {t("empty.cta_tours")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Control Tab Bar */}
      <div className="flex border-b border-border w-full max-w-md">
        {(["all", "location", "tour"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex-1 py-4 text-center font-bold text-sm tracking-wide transition-all duration-300 relative focus:outline-none cursor-pointer ${
              activeTab === tab
                ? "text-primary"
                : "text-on-surface-subtle hover:text-primary/80"
            }`}
          >
            {t(`tabs.${tab === "all" ? "all" : tab === "location" ? "locations" : "tours"}`)}
            {activeTab === tab && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary animate-in fade-in zoom-in-95 duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* Grid Results */}
      {isFilteredEmpty ? (
        <div className="mx-auto my-12 max-w-md rounded-[20px] border border-border bg-white p-16 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <IoCompassOutline className="w-12 h-12 text-on-surface-subtle/40 mx-auto mb-4" />
          <p className="text-on-surface-subtle font-medium text-sm">{t("empty.title")}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Recommended Locations Grid Section */}
          {showLocations && locations.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-on-surface uppercase tracking-wider">
                  {t("sections.locations")}
                </h2>
                <div className="h-px bg-border flex-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {locations.map((item, index) => (
                  <div
                    key={`loc-${item.id}`}
                    className="flex flex-col gap-3 reveal-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <LocationCard location={item} />
                    <div className="pl-2">
                      <ReasonTag reason={item.recommendation_reason as "viewed" | "similar_favorite" | "popular" | "booked"} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Tours Grid Section */}
          {showTours && tours.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-on-surface uppercase tracking-wider">
                  {t("sections.tours")}
                </h2>
                <div className="h-px bg-border flex-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tours.map((item, index) => (
                  <div
                    key={`tour-${item.id}`}
                    className="flex flex-col gap-3 reveal-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TourCard tour={item} />
                    <div className="pl-2">
                      <ReasonTag reason={item.recommendation_reason as "viewed" | "similar_favorite" | "popular" | "booked"} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Sub components
function TabSkeleton() {
  return (
    <div className="flex border-b border-border w-full max-w-md animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex-1 py-4 flex justify-center">
          <div className="h-4 bg-surface-container rounded w-16" />
        </div>
      ))}
    </div>
  );
}

function CardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="p-px rounded-xl bg-linear-to-br from-primary/5 to-border/10 animate-pulse"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col h-[380px]">
        <div className="aspect-4/3 w-full bg-surface-container" />
        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-surface-container rounded w-1/3" />
            <div className="h-5 bg-surface-container rounded w-3/4" />
          </div>
          <div className="h-8 bg-surface-container rounded w-full mt-auto" />
        </div>
      </div>
    </div>
  );
}
