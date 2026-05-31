"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import type { Tour } from "@/types";
import { Badge } from "@/components/ui";
import RatingStars from "@/components/ui/RatingStars";
import { MapPin, Heart } from "@/components/icons/solar";
import { normalizeText } from "@/utils";
import { useFavoriteCheck, useFavoriteToggle } from "@/hooks/useFavorite";

// New Feature Components
import TourImageGallery from "./TourImageGallery";
import BookingSidebar from "./BookingSidebar";
import ItineraryTimeline from "./ItineraryTimeline";
import ReviewSection from "./ReviewSection";

function FavoriteButton({ tourId }: { tourId: number }) {
  const td = useTranslations("tour.detail");
  const { data: isFavorite, isLoading } = useFavoriteCheck({ tour_id: tourId });
  const { mutate: toggleFavorite, isPending } = useFavoriteToggle({ tour_id: tourId });

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(!!isFavorite)}
      disabled={isLoading || isPending}
      className={`flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white shadow-sm transition-all hover:border-red-200 hover:bg-red-50 ${
        isFavorite ? "text-red-500" : "text-on-surface-subtle hover:text-red-500"
      }`}
      aria-label={isFavorite ? td("favorite_remove") : td("favorite_add")}
    >
      <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
    </button>
  );
}

interface Props {
  tour: Tour;
}

export default function TourDetailClient({ tour }: Props) {
  const t = useTranslations("tour");
  const td = useTranslations("tour.detail");
  const safeRating = Number.isFinite(Number(tour.avg_rating)) ? Number(tour.avg_rating) : 0;
  const safeReviewCount = Number.isFinite(Number(tour.review_count)) ? Number(tour.review_count) : 0;

  const gallery = [tour.thumbnail, ...(tour.images ?? [])].filter(
    (u): u is string => Boolean(u)
  );
  const uniqueGallery = [...new Set(gallery)];

  const inclusions = normalizeText(tour.inclusions);
  const exclusions = normalizeText(tour.exclusions);
  const meetingPoint = normalizeText(tour.meeting_point);

  return (
    <div className="design-page layout-main-shell min-h-screen pb-20">
      <div className="design-container pt-28 md:pt-32">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-on-surface-subtle mb-8 reveal-up">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={ROUTES.TOURS} className="hover:text-primary transition-colors">
                {td("breadcrumb_tours")}
              </Link>
            </li>
            <li className="text-on-surface-subtle">/</li>
            <li className="text-on-surface font-medium truncate max-w-[min(280px,55vw)]">
              {tour.name}
            </li>
          </ol>
        </nav>

        {/* Gallery Section */}
        <TourImageGallery images={uniqueGallery} title={tour.name} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 mt-4">
          {/* Main Content — dark glass card */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-[32px] border border-border bg-white shadow-[0_24px_70px_rgba(15,23,42,0.1)]">
              {/* Header section — padded */}
              <div className="p-6 md:p-10">
                <article className="space-y-6">
                  <header className="reveal-up space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {tour.is_hot && (
                        <Badge variant="error" className="uppercase text-[10px] font-black tracking-widest px-3">
                          {t("card.hot_badge")}
                        </Badge>
                      )}
                      {tour.is_featured && (
                        <Badge variant="warning" className="uppercase text-[10px] font-black tracking-widest px-3">
                          {t("card.featured_badge")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <h1 className="text-4xl md:text-3xl font-black text-on-surface leading-[1.1] tracking-tight">
                        {tour.name}
                      </h1>
                      {/* Favorite Button */}
                      <FavoriteButton tourId={tour.id} />
                    </div>
                    <div className="flex flex-wrap items-center gap-6 border-y border-border py-6 text-sm text-on-surface-subtle">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                        <span className="font-bold text-on-surface">{t("card.location_short")}</span>
                      </span>
                      <span className="w-px h-4 bg-border hidden md:block" />
                      <span className="inline-flex items-center gap-2">
                        <span className="text-on-surface-subtle uppercase text-[10px] font-black tracking-widest">{td("stats_duration")}:</span>
                        <span className="font-mono text-on-surface font-bold">{tour.duration}</span>
                      </span>
                      <span className="w-px h-4 bg-border hidden md:block" />
                      <RatingStars
                        rating={safeRating}
                        count={safeReviewCount}
                        size="md"
                        showText
                      />
                    </div>
                  </header>

                  {/* Overview Section */}
                  {tour.short_desc || tour.description ? (
                    <section className="reveal-up space-y-6" style={{ animationDelay: "300ms" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h2 className="text-2xl font-black text-on-surface tracking-tight">{td("overview")}</h2>
                      </div>
                      
                      {tour.short_desc && (
                        <p className="text-xl text-on-surface-subtle leading-relaxed italic border-l-4 border-primary/20 pl-6">
                          {tour.short_desc}
                        </p>
                      )}

                      <div className="prose max-w-none">
                        {tour.description?.includes("<") ? (
                          <div
                            className="text-on-surface-subtle text-base leading-loose [&_p]:mb-6"
                            dangerouslySetInnerHTML={{ __html: tour.description }}
                          />
                        ) : (
                          <div className="text-on-surface-subtle whitespace-pre-line text-base leading-loose">
                            {tour.description}
                          </div>
                        )}
                      </div>
                    </section>
                  ) : null}

                  {/* Itinerary Section */}
                  <ItineraryTimeline itinerary={tour.itinerary || []} />

                  {/* Inclusions & Meeting Point */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal-up" style={{ animationDelay: "400ms" }}>
                    {inclusions && (
                      <div className="space-y-4 rounded-[24px] border border-border bg-[#f7f7f7] p-8">
                        <h3 className="text-lg font-black text-on-surface uppercase tracking-tight">{td("inclusions")}</h3>
                        <div className="text-on-surface-subtle whitespace-pre-line text-sm leading-relaxed">
                          {inclusions}
                        </div>
                      </div>
                    )}
                    {exclusions && (
                      <div className="space-y-4 rounded-[24px] border border-border bg-[#f7f7f7] p-8">
                        <h3 className="text-lg font-black text-on-surface uppercase tracking-tight">{td("exclusions")}</h3>
                        <div className="text-on-surface-subtle whitespace-pre-line text-sm leading-relaxed">
                          {exclusions}
                        </div>
                      </div>
                    )}
                  </div>

                  {meetingPoint && (
                    <section className="reveal-up space-y-4" style={{ animationDelay: "450ms" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h2 className="text-2xl font-black text-on-surface tracking-tight">{td("meeting_point")}</h2>
                      </div>
                      <div className="flex items-start gap-4 rounded-[24px] border border-border bg-[#f7f7f7] p-6">
                        <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <p className="text-on-surface-subtle text-base">{meetingPoint}</p>
                      </div>
                    </section>
                  )}

                  {/* Reviews Section */}
                  <ReviewSection 
                    tourId={tour.id}
                    rating={safeRating} 
                    count={safeReviewCount} 
                  />
                </article>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <aside className="lg:col-span-4">
            <BookingSidebar tour={tour} />
          </aside>
        </div>
      </div>
    </div>
  );
}
