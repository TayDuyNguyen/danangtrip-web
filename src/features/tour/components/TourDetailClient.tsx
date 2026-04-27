"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import type { Tour } from "@/types";
import { Badge } from "@/components/ui";
import RatingStars from "@/components/ui/RatingStars";
import { cn } from "@/lib/utils";
import { Clock, MapPin, Users } from "@/components/icons/solar";
import { normalizeText } from "@/utils";
import { formatNumber } from "@/utils/format";

type Props = {
  tour: Tour;
};

function formatPriceLine(value: string, suffix: string) {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return "—";
  return `${formatNumber(n)}đ${suffix}`;
}

export default function TourDetailClient({ tour }: Props) {
  const t = useTranslations("tour");
  const td = useTranslations("tour.detail");
  const discountPercent = tour.discount_percent;
  const adult = parseFloat(tour.price_adult);
  const adultDiscounted = adult * (1 - discountPercent / 100);
  const suffix = td("per_person");

  const gallery = [tour.thumbnail, ...(tour.images ?? [])].filter(
    (u): u is string => Boolean(u)
  );
  const uniqueGallery = [...new Set(gallery)];

  const inclusions = normalizeText(tour.inclusions);
  const exclusions = normalizeText(tour.exclusions);
  const meetingPoint = normalizeText(tour.meeting_point);

  return (
    <div className="design-page min-h-screen pb-20 bg-surface">
      <div className="design-container pt-28 md:pt-32">
        <nav aria-label="Breadcrumb" className="text-sm text-on-surface-subtle mb-8 reveal-up">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={ROUTES.HOME} className="hover:text-primary transition-colors">
                {td("breadcrumb_home")}
              </Link>
            </li>
            <li className="text-on-surface-variant">/</li>
            <li>
              <Link href={ROUTES.TOURS} className="hover:text-primary transition-colors">
                {td("breadcrumb_tours")}
              </Link>
            </li>
            <li className="text-on-surface-variant">/</li>
            <li className="text-on-surface font-medium truncate max-w-[min(280px,55vw)]">
              {tour.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <article className="lg:col-span-8 space-y-10">
            <div
              className={cn(
                "p-px rounded-xl bg-linear-to-br from-[rgba(92,56,34,0.4)] to-[rgba(46,58,47,0.1)] reveal-up"
              )}
              style={{ animationDelay: "100ms" }}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-surface-container-low">
                <Image
                  src={tour.thumbnail || "/images/placeholder.jpg"}
                  alt={tour.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {tour.is_hot && (
                    <Badge variant="error" className="uppercase text-[10px] font-bold">
                      {t("card.hot_badge")}
                    </Badge>
                  )}
                  {tour.is_featured && (
                    <Badge variant="warning" className="uppercase text-[10px] font-bold">
                      {t("card.featured_badge")}
                    </Badge>
                  )}
                </div>
                {discountPercent > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="warning" className="text-[10px] font-bold px-2 py-0.5">
                      {t("card.discount_percent", { percent: discountPercent })}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <header className="reveal-up space-y-4" style={{ animationDelay: "200ms" }}>
              <h1 className="text-3xl md:text-4xl font-black text-on-surface leading-tight">
                {tour.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  {t("card.location_short")}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[12px]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span className="text-on-surface-subtle">{td("stats_duration")}:</span>{" "}
                  {tour.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[12px]">
                  <Users className="w-4 h-4 shrink-0" />
                  <span className="text-on-surface-subtle">{td("stats_group")}:</span>{" "}
                  {t("card.participants", { count: tour.max_people })}
                </span>
              </div>
              <RatingStars
                rating={parseFloat(tour.avg_rating)}
                count={tour.review_count}
                size="md"
                showText
              />
            </header>

            {tour.short_desc ? (
              <p className="text-lg text-on-surface-subtle reveal-up" style={{ animationDelay: "250ms" }}>
                {tour.short_desc}
              </p>
            ) : null}

            {tour.description ? (
              <section className="reveal-up space-y-3" style={{ animationDelay: "300ms" }}>
                <h2 className="text-lg font-bold text-on-surface">{td("overview")}</h2>
                {tour.description.includes("<") ? (
                  <div
                    className="max-w-none text-on-surface-subtle text-sm leading-relaxed [&_a]:text-primary [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: tour.description }}
                  />
                ) : (
                  <div className="text-on-surface-subtle whitespace-pre-line text-sm leading-relaxed">
                    {tour.description}
                  </div>
                )}
              </section>
            ) : null}

            {tour.itinerary && tour.itinerary.length > 0 ? (
              <section className="reveal-up space-y-4" style={{ animationDelay: "350ms" }}>
                <h2 className="text-lg font-bold text-on-surface">{td("itinerary")}</h2>
                <ul className="space-y-3 border border-border rounded-lg bg-surface-container-low p-4 md:p-6">
                  {tour.itinerary.map((row, i) => (
                    <li
                      key={`${row.time}-${i}`}
                      className="flex gap-4 text-sm border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <span className="font-mono text-xs text-primary shrink-0 w-20">{row.time}</span>
                      <span className="text-on-surface-subtle">{row.activity}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {inclusions ? (
              <section className="reveal-up space-y-3" style={{ animationDelay: "400ms" }}>
                <h2 className="text-lg font-bold text-on-surface">{td("inclusions")}</h2>
                <div className="text-on-surface-subtle whitespace-pre-line text-sm leading-relaxed">
                  {inclusions}
                </div>
              </section>
            ) : null}

            {exclusions ? (
              <section className="reveal-up space-y-3" style={{ animationDelay: "450ms" }}>
                <h2 className="text-lg font-bold text-on-surface">{td("exclusions")}</h2>
                <div className="text-on-surface-subtle whitespace-pre-line text-sm leading-relaxed">
                  {exclusions}
                </div>
              </section>
            ) : null}

            {meetingPoint ? (
              <section className="reveal-up space-y-3" style={{ animationDelay: "500ms" }}>
                <h2 className="text-lg font-bold text-on-surface">{td("meeting_point")}</h2>
                <p className="text-on-surface-subtle text-sm">{meetingPoint}</p>
              </section>
            ) : null}

            {uniqueGallery.length > 1 ? (
              <section className="reveal-up space-y-4" style={{ animationDelay: "550ms" }}>
                <h2 className="text-lg font-bold text-on-surface">{td("gallery")}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {uniqueGallery.slice(1).map((src, idx) => (
                    <div
                      key={src}
                      className="relative aspect-4/3 overflow-hidden rounded-lg border border-border"
                    >
                      <Image
                        src={src}
                        alt={`${tour.name} — ${td("gallery")} ${idx + 2}`}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="lg:col-span-4">
            <div
              id="booking-cta"
              className="sticky top-28 space-y-6 rounded-xl border border-border bg-surface-container-low p-6 md:p-8 reveal-up"
              style={{ animationDelay: "150ms" }}
            >
              <div>
                <p className="text-xs font-bold text-on-surface-subtle uppercase tracking-wider mb-2">
                  {t("card.starting_from")}
                </p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl font-black text-primary">
                    {formatNumber(adultDiscounted)}đ
                  </span>
                  {discountPercent > 0 ? (
                    <span className="text-sm text-on-surface-subtle line-through">
                      {formatNumber(adult)}đ
                    </span>
                  ) : null}
                </div>
                <span className="text-xs text-on-surface-variant">{suffix}</span>
              </div>

              <div className="space-y-2 text-sm border-t border-border pt-6">
                <p className="text-xs font-bold text-on-surface-subtle uppercase tracking-wider mb-2">
                  {td("pricing")}
                </p>
                <div className="flex justify-between gap-4 text-on-surface-subtle">
                  <span>{td("price_child")}</span>
                  <span className="text-on-surface font-medium tabular-nums">
                    {formatPriceLine(tour.price_child, suffix)}
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-on-surface-subtle">
                  <span>{td("price_infant")}</span>
                  <span className="text-on-surface font-medium tabular-nums">
                    {formatPriceLine(tour.price_infant, suffix)}
                  </span>
                </div>
              </div>

              <Link
                href={`${ROUTES.CONTACT}?tour=${encodeURIComponent(tour.slug)}`}
                className={cn(
                  "flex w-full items-center justify-center rounded-full border border-[#262626] bg-[#171717] px-5 py-3",
                  "text-sm font-semibold text-white transition-all duration-300",
                  "hover:border-[#8b6a55] hover:text-[#8b6a55] active:scale-[0.98]"
                )}
              >
                {t("card.book_now")}
              </Link>
              <p className="text-xs text-on-surface-variant leading-relaxed">{td("book_cta_hint")}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
