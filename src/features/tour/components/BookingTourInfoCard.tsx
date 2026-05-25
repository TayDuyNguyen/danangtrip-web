"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Calendar, Clock, MapPin, Users } from "@/components/icons/solar";
import type { BookingItem } from "@/types";

interface BookingTourInfoCardProps {
  item: BookingItem;
}

export function BookingTourInfoCard({ item }: BookingTourInfoCardProps) {
  const t = useTranslations("tour.history");
  const td = useTranslations("tour.detail");
  const tTour = useTranslations("tour");
  const locale = useLocale();

  const tour = item.tour;
  const tourName = item.item_name || tour?.name || tTour("detail.breadcrumb_tours") || "Tour";
  const tourThumbnail = tour?.thumbnail || "/images/placeholder-tour.jpg";
  const duration = tour?.duration || tTour("filters.durations.one_day") || "1 day";
  const meetingPoint = tour?.meeting_point || td("location_short") || (locale === "vi" ? "Đà Nẵng, Việt Nam" : "Da Nang, Vietnam");

  const travelDateFormatter = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const travelDate = travelDateFormatter.format(new Date(item.travel_date));

  return (
    <div className="w-full rounded-2xl bg-surface border border-border p-5 md:p-6 reveal-up">
      <h3 className="text-sm font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
        <Users className="w-4.5 h-4.5 text-primary shrink-0" />
        {t("section_tour")}
      </h3>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden shrink-0 border border-border/30 bg-surface-container-low">
          <Image
            src={tourThumbnail}
            alt={tourName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 160px"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0 justify-between">
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white leading-snug hover:text-primary transition-colors">
              {tour?.slug ? (
                <Link href={`/tours/${tour.slug}`}>
                  {tourName}
                </Link>
              ) : (
                <span>{tourName}</span>
              )}
            </h4>

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-on-surface-subtle uppercase font-semibold">{t("travel_date")}</span>
                  <span className="text-white font-medium">{travelDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-on-surface-subtle uppercase font-semibold">{t("tour_duration")}</span>
                  <span className="text-white font-medium">{duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting point */}
          <div className="mt-4 pt-4 border-t border-border/50 flex gap-2 text-xs">
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[9px] text-on-surface-subtle uppercase font-semibold">{t("departure_point")}</span>
              <span className="text-on-surface font-medium leading-relaxed">{meetingPoint}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
