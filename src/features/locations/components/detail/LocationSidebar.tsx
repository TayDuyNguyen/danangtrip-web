"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Map as MapIcon } from "@/components/icons/solar";
import type { Location } from "@/types";
import WeatherWidget from "./WeatherWidget";
import LocationNearby from "./LocationNearby";
import { formatLocationPriceRange } from "@/utils/format";
import { useCopilotStore } from "@/features/copilot/store/copilot.store";
import { Phone, Globe, Mail, Bot } from "lucide-react";

const LocationMapPreview = dynamic(() => import("./LocationMapPreview"), {
  ssr: false,
});

interface LocationSidebarProps {
  location: Location;
  locale: string;
  nearby?: Location[];
  nearbyLoading?: boolean;
}

export default function LocationSidebar({
  location,
  locale,
  nearby,
  nearbyLoading,
}: LocationSidebarProps) {
  const t = useTranslations("locations");
  const [showPlatforms, setShowPlatforms] = useState(false);

  const { displayPrice, isFreeOrUnspecified } = formatLocationPriceRange(
    location.price_min,
    location.price_max,
    t,
    locale === "vi" ? "vi-VN" : "en-US"
  );

  const hasPhone = !!(location.phone && location.phone.trim() !== "");
  const hasWebsite = !!(location.website && location.website.trim() !== "");
  const hasEmail = !!(location.email && location.email.trim() !== "");
  const hasAnyContact = hasPhone || hasWebsite || hasEmail;

  const handleContactConsultancy = () => {
    const setIsOpen = useCopilotStore.getState().setIsOpen;
    const addMessage = useCopilotStore.getState().addMessage;
    setIsOpen(true);
    addMessage({
      role: "user",
      content: locale === "vi"
        ? `Tôi cần tư vấn thông tin về địa điểm ${location.name}`
        : `I need information/consultancy about ${location.name}`,
    });
  };

  return (
    <div className="sticky top-28 space-y-5">
      <div className="reveal-up reveal-delay-100 rounded-[28px] border border-border bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
        <div className="mb-6 border-b border-border pb-5">
          <div className="text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">
            {t("detail.price_label")}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-primary">
              {displayPrice}
            </span>
            {!isFreeOrUnspecified && (
              <span className="text-xs font-medium uppercase tracking-normal text-on-surface-subtle">
                / {t("detail.price_per_person").replace("/ ", "")}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowPlatforms(prev => !prev)}
            disabled={!hasAnyContact}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(255,56,92,0.18)] transition-all duration-300 hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none disabled:blur-[0.5px]"
          >
            {showPlatforms ? t("filters.close") || "Đóng" : t("detail.book_now")}
          </button>

          {showPlatforms && (
            <div className="flex justify-center gap-4 py-2 animate-reveal-up border-b border-border pb-3">
              {hasPhone && (
                <a
                  href={`tel:${location.phone}`}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors shadow-xs"
                  title={location.phone || undefined}
                >
                  <Phone className="h-5 w-5" />
                </a>
              )}
              {hasWebsite && (
                <a
                  href={location.website || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors shadow-xs"
                  title={location.website || undefined}
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {hasEmail && (
                <a
                  href={`mailto:${location.email}`}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors shadow-xs"
                  title={location.email || undefined}
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          )}

          <button
            onClick={handleContactConsultancy}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-[#fafafa] py-3.5 text-sm font-semibold text-on-surface transition-all duration-300 hover:border-primary/25 hover:bg-white hover:text-primary"
          >
            <Bot className="h-4 w-4 text-primary shrink-0 animate-bounce" style={{ animationDuration: '3s' }} />
            {t("detail.contact_consultancy")}
          </button>
        </div>

        <p className="mt-4 text-center text-xs italic text-on-surface-subtle">
          {t("detail.price_note")}
        </p>
      </div>

      <div className="reveal-up reveal-delay-200 overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
        <div className="h-[200px] w-full overflow-hidden">
          <LocationMapPreview location={location} showMapLink={false} />
        </div>

        <div className="border-t border-border p-5">
          <p className="mb-1 text-sm font-semibold leading-tight text-on-surface">
            {location.address}
          </p>
          <p className="mb-4 text-xs text-on-surface-subtle">
            {location.district}, {t("detail.address_suffix")}
          </p>
          <Link
            href={`/map?location_id=${location.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-border bg-[#fafafa] py-3 text-sm font-semibold text-on-surface transition-all duration-300 hover:border-primary/25 hover:bg-white hover:text-primary"
          >
            <MapIcon className="h-4 w-4 text-primary" />
            {t("detail.view_on_map")}
          </Link>
        </div>
      </div>

      <div className="reveal-up reveal-delay-300">
        <WeatherWidget />
      </div>

      <div className="reveal-up reveal-delay-400">
        <LocationNearby items={nearby ?? []} isLoading={nearbyLoading} />
      </div>
    </div>
  );
}
