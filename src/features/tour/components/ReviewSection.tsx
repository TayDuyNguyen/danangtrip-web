"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { ChatLine, ThumbsUp } from "@/components/icons/solar";
import RatingStars from "@/components/ui/RatingStars";
import { useTourRatings, useTourRatingStats, useCheckTourRating } from "@/features/tour/hooks/useTourDetail";
import { ratingService } from "@/services/rating.service";
import { useAuthStore } from "@/store/auth.store";
import type { LocationRatingListItem } from "@/types/location-rating.types";
import { getApiErrorMessage } from "@/utils";
import WriteReviewModal from "@/features/locations/components/detail/WriteReviewModal";
import { resolveMediaUrl } from "@/utils/media-url";

interface ReviewSectionProps {
  tourId: number;
  rating: number;
  count: number;
}

export default function ReviewSection({ tourId, rating, count }: ReviewSectionProps) {
  const td = useTranslations("tour.detail");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const reviewDateFormatter = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US");
  const parsedRating = parseFloat(String(rating)) || 0;
  const safeCount = Number.isFinite(count) ? count : 0;

  const { data: apiReviews, isLoading: loadingReviews } = useTourRatings(tourId, { per_page: 5 });
  const { data: stats } = useTourRatingStats(tourId);
  const { data: checkRating } = useCheckTourRating(tourId, isAuthenticated);

  const displayReviews = apiReviews ?? [];
  const totalReviews = stats ? Object.values(stats).reduce((sum, value) => sum + value, 0) : safeCount;
  const hasRated = Boolean(checkRating?.has_rated);
  const helpfulMutation = useMutation({
    mutationFn: (ratingId: number) => ratingService.markHelpful(ratingId),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(getApiErrorMessage(response, td("helpful_error")));
        return;
      }

      void queryClient.invalidateQueries({ queryKey: ["tours", "ratings", tourId] });
      toast.success(td("helpful_success"));
    },
    onError: (error) => toast.error(getApiErrorMessage(error, td("helpful_error"))),
  });

  const markHelpful = (ratingId: number) => {
    if (!isAuthenticated) {
      toast.error(td("helpful_login"));
      return;
    }

    helpfulMutation.mutate(ratingId);
  };

  const openReviewModal = () => {
    if (!isAuthenticated) {
      toast.error(td("helpful_login"));
      return;
    }

    if (checkRating?.can_rate === false) {
      toast.error(checkRating.message || "Bạn phải đặt tour này và hoàn thành chuyến đi mới có thể đánh giá.");
      return;
    }

    if (!hasRated) {
      setReviewModalOpen(true);
    }
  };

  // Calculate dynamic average rating from client-side stats to avoid SSR cache issues
  const dynamicRating = useMemo(() => {
    if (!stats) return parsedRating;
    const totalScore = Object.entries(stats).reduce(
      (sum, [star, count]) => sum + Number(star) * count,
      0
    );
    return totalReviews > 0 ? totalScore / totalReviews : parsedRating;
  }, [stats, totalReviews, parsedRating]);

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
        {!hasRated && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="hidden md:flex"
            onClick={openReviewModal}
          >
            {td("reviews_write")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-4">
        <div className="flex flex-col items-center justify-center space-y-4 rounded-[24px] border border-border bg-[#f7f7f7] p-8 text-center md:col-span-4">
          <div className="text-6xl font-black text-primary">{dynamicRating.toFixed(1)}</div>
          <RatingStars rating={dynamicRating} size="lg" />
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
          {!hasRated && (
            <Button
              type="button"
              variant="secondary"
              className="w-full md:hidden"
              onClick={openReviewModal}
            >
              {td("reviews_write")}
            </Button>
          )}

          {loadingReviews ? (
            <div className="flex justify-center p-8">
              <span className="text-sm text-on-surface-subtle">{td("reviews_loading")}</span>
            </div>
          ) : displayReviews.length > 0 ? (
            displayReviews.map((review: LocationRatingListItem) => {
              const avatar = resolveMediaUrl(review.user?.avatar_url ?? review.user?.avatar) ?? null;
              const displayName = review.user?.full_name || review.user?.username || td("user_anonymous");
              const reviewImages = review.images?.map((img) => resolveMediaUrl(img.image_url)).filter(Boolean) as string[];

              return (
                <div
                  key={review.id}
                  className="space-y-4 rounded-[24px] border border-border bg-[#f7f7f7] p-6 transition-colors hover:border-primary/20 hover:bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-[#fafafa] shadow-sm">
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
                    <RatingStars rating={parseFloat(String(review.score)) || 0} size="sm" />
                  </div>
                  <p className="text-sm leading-relaxed text-on-surface-subtle">{review.comment}</p>

                  {reviewImages && reviewImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {reviewImages.map((img, i) => (
                        <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-white">
                          <Image
                            src={img}
                            alt={`${displayName} review photo ${i + 1}`}
                            fill
                            className="object-cover transition-transform hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs text-on-surface-subtle transition-colors hover:text-primary disabled:opacity-50"
                    disabled={helpfulMutation.isPending}
                    onClick={() => markHelpful(review.id)}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {td("helpful")}
                    {review.helpful_count > 0 ? <span>({review.helpful_count})</span> : null}
                  </button>
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

      <WriteReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        tourId={tourId}
      />
    </section>
  );
}
