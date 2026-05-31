"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import { ChatLine } from "@/components/icons/solar";
import RatingStars from "@/components/ui/RatingStars";
import { useTourRatings, useTourRatingStats, useCheckTourRating } from "@/features/tour/hooks/useTourDetail";
import { useAuthStore } from "@/store/auth.store";
import type { LocationRatingListItem } from "@/types/location-rating.types";

interface ReviewSectionProps {
  tourId: number;
  rating: number;
  count: number;
}

export default function ReviewSection({ tourId, rating, count }: ReviewSectionProps) {
  const td = useTranslations("tour.detail");
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();
  const reviewDateFormatter = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US");
  const safeRating = Number.isFinite(rating) ? rating : 0;
  const safeCount = Number.isFinite(count) ? count : 0;

  const { data: apiReviews, isLoading: loadingReviews } = useTourRatings(tourId, { per_page: 5 });
  const { data: stats } = useTourRatingStats(tourId);
  const { data: checkRating } = useCheckTourRating(tourId, isAuthenticated);

  const displayReviews = apiReviews ?? [];
  const totalReviews = stats ? Object.values(stats).reduce((sum, value) => sum + value, 0) : safeCount;
  const hasRated = !!checkRating;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const starCount = stats ? (stats[String(star)] || 0) : 0;
    const percent = totalReviews > 0 ? Math.round((starCount / totalReviews) * 100) : 0;
    return { star, percent };
  });

  return (
    <section className="reveal-up space-y-10" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 rounded-full bg-primary" />
          <h2 className="text-2xl font-black tracking-tight text-on-surface">{td("reviews_title")}</h2>
        </div>
        {isAuthenticated && !hasRated && (
          <Button variant="secondary" size="sm" className="hidden md:flex">
            {td("reviews_write")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-4">
        <div className="flex flex-col items-center justify-center space-y-4 rounded-[24px] border border-border bg-[#f7f7f7] p-8 text-center md:col-span-4">
          <div className="text-6xl font-black text-primary">{safeRating.toFixed(1)}</div>
          <RatingStars rating={safeRating} size="lg" />
          <p className="text-sm font-medium text-on-surface-subtle">{td("reviews_based_on", { count: totalReviews })}</p>

          <div className="w-full space-y-2 pt-4">
            {distribution.map((item) => (
              <div key={item.star} className="flex items-center gap-3">
                <span className="w-4 text-[10px] font-bold text-on-surface-subtle">{item.star}</span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#eceff3]">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-1000"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="w-8 font-mono text-[10px] text-on-surface-subtle">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 md:col-span-8">
          {isAuthenticated && !hasRated && (
            <Button variant="secondary" className="w-full md:hidden">
              {td("reviews_write")}
            </Button>
          )}

          {loadingReviews ? (
            <div className="flex justify-center p-8">
              <span className="text-sm text-on-surface-subtle">{td("reviews_loading")}</span>
            </div>
          ) : displayReviews.length > 0 ? (
            displayReviews.map((review: LocationRatingListItem) => {
              const avatar = review.user?.avatar ?? null;
              const displayName = review.user?.full_name || review.user?.username || td("user_anonymous");

              return (
                <div
                  key={review.id}
                  className="space-y-4 rounded-[24px] border border-border bg-[#f7f7f7] p-6 transition-colors hover:border-primary/20 hover:bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-white shadow-sm">
                        {avatar ? (
                          <Image src={avatar} alt={displayName} fill className="object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-primary">{displayName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-on-surface">{displayName}</div>
                        <div className="text-[10px] uppercase tracking-widest text-on-surface-subtle">
                          {reviewDateFormatter.format(new Date(review.created_at))}
                        </div>
                      </div>
                    </div>
                    <RatingStars rating={Number.isFinite(review.score) ? review.score : 0} size="sm" />
                  </div>
                  <p className="text-sm leading-relaxed text-on-surface-subtle">{review.comment}</p>
                </div>
              );
            })
          ) : (
            <div className="space-y-3 rounded-[24px] border border-border bg-[#f7f7f7] p-12 text-center">
              <ChatLine className="mx-auto h-12 w-12 text-on-surface-subtle opacity-20" />
              <p className="text-sm text-on-surface-subtle">{td("no_reviews")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
