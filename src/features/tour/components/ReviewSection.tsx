"use client";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import RatingStars from "@/components/ui/RatingStars";
import { ChatLine } from "@/components/icons/solar";
import { useTourRatings, useTourRatingStats, useCheckTourRating } from "@/features/tour/hooks/useTourDetail";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui";
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
  
  // Always fetch reviews from API, no static fallback (No Invisible Mocks - PROJECT_RULES §21)
  const { data: apiReviews, isLoading: loadingReviews } = useTourRatings(tourId, { per_page: 5 });
  const displayReviews = apiReviews ?? [];

  // Fetch real stats
  const { data: stats } = useTourRatingStats(tourId);

  // Parse stats into distribution
  const totalReviews = stats ? Object.values(stats).reduce((a, b) => a + b, 0) : safeCount;
  
  const distribution = [5, 4, 3, 2, 1].map(star => {
    const starCount = stats ? (stats[String(star)] || 0) : 0;
    const percent = totalReviews > 0 ? Math.round((starCount / totalReviews) * 100) : 0;
    return { star, percent, count: starCount };
  });



  // Auth & Submit flow (stubbed UI for writing review)
  const { data: checkRating } = useCheckTourRating(tourId, isAuthenticated);
  const hasRated = !!checkRating;

  return (
    <section className="reveal-up space-y-10" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-2xl font-black text-on-surface tracking-tight">
            {td("reviews_title")}
          </h2>
        </div>
        {isAuthenticated && !hasRated && (
          <Button variant="secondary" size="sm" className="hidden md:flex">
            {td("reviews_write")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Summary Chart */}
        <div className="md:col-span-4 glass-surface p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-6xl font-black text-primary">{safeRating.toFixed(1)}</div>
          <RatingStars rating={safeRating} size="lg" />
          <p className="text-sm text-on-surface-subtle font-medium">
            {td("reviews_based_on", { count: totalReviews })}
          </p>
          
          <div className="w-full space-y-2 pt-4">
            {distribution.map((item) => (
              <div key={item.star} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-on-surface-variant w-4">{item.star}</span>
                <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden relative">
                  <div 
                    className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant w-8">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review List */}
        <div className="md:col-span-8 space-y-6">
          {isAuthenticated && !hasRated && (
            <Button variant="secondary" className="w-full md:hidden">
              {td("reviews_write")}
            </Button>
          )}
          
          {loadingReviews ? (
            <div className="flex justify-center p-8"><span className="text-sm text-on-surface-subtle">{td("reviews_loading")}</span></div>
          ) : displayReviews.length > 0 ? (
            displayReviews.map((review: LocationRatingListItem) => {
              const avatar = review.user?.avatar ?? null;
              const displayName = review.user?.full_name || review.user?.username || td("user_anonymous");
              return (
                <div key={review.id} className="glass-surface p-6 rounded-xl space-y-4 hover:border-primary/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container border border-border flex items-center justify-center overflow-hidden relative">
                        {avatar ? (
                          <Image src={avatar} alt={displayName} fill className="object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-primary">{displayName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-on-surface">{displayName}</div>
                        <div className="text-[10px] text-on-surface-subtle uppercase tracking-widest">
                          {reviewDateFormatter.format(new Date(review.created_at))}
                        </div>
                      </div>
                    </div>
                    <RatingStars rating={Number.isFinite(review.score) ? review.score : 0} size="sm" />
                  </div>
                  <p className="text-sm text-on-surface-subtle leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="glass-surface p-12 rounded-xl text-center space-y-3">
              <ChatLine className="w-12 h-12 text-on-surface-subtle mx-auto opacity-20" />
              <p className="text-on-surface-subtle text-sm">{td("no_reviews")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
