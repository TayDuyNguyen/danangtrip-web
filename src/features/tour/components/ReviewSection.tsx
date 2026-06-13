"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  const [showNudge, setShowNudge] = useState(false);
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
      setShowNudge((prev) => !prev);
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
          <div className="relative hidden md:block">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={openReviewModal}
            >
              {td("reviews_write")}
            </Button>

            {showNudge && (
              <div className="absolute right-0 top-full mt-3 z-50 w-[300px] rounded-2xl border border-border bg-white p-4 shadow-[0_12px_36px_rgba(0,0,0,0.15)] animate-reveal-up text-xs text-slate-800 normal-case font-normal text-left">
                <div className="absolute top-[-6px] right-8 h-3 w-3 rotate-45 border-l border-t border-border bg-white" />
                <div className="relative space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9m16 0H4" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-900 text-[13px] leading-snug">
                        {locale === 'vi' ? 'Đăng ký nhận ưu đãi & tích điểm' : 'Register for offers & points'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNudge(false)}
                      className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {locale === 'vi'
                      ? 'Viết đánh giá hữu ích, tích lũy điểm thưởng và đổi lấy các voucher giảm giá tour hấp dẫn!'
                      : 'Write helpful reviews, earn reward points, and redeem them for exciting tour vouchers!'}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <Link
                      href="/register"
                      className="inline-flex rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
                    >
                      {locale === 'vi' ? 'Đăng ký ngay' : 'Sign up'}
                    </Link>
                    <Link
                      href="/login"
                      className="text-[11px] font-bold text-slate-600 hover:text-primary transition-colors"
                    >
                      {locale === 'vi' ? 'Đăng nhập' : 'Log in'}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
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
            <div className="relative w-full md:hidden">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={openReviewModal}
              >
                {td("reviews_write")}
              </Button>

              {showNudge && (
                <div className="absolute right-0 left-0 top-full mt-3 z-50 rounded-2xl border border-border bg-white p-4 shadow-[0_12px_36px_rgba(0,0,0,0.15)] animate-reveal-up text-xs text-slate-800 normal-case font-normal text-left">
                  <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-l border-t border-border bg-white" />
                  <div className="relative space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9m16 0H4" />
                          </svg>
                        </div>
                        <span className="font-bold text-slate-900 text-[13px] leading-snug">
                          {locale === 'vi' ? 'Đăng ký nhận ưu đãi & tích điểm' : 'Register for offers & points'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNudge(false)}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[11px] leading-relaxed text-slate-600">
                      {locale === 'vi'
                        ? 'Viết đánh giá hữu ích, tích lũy điểm thưởng và đổi lấy các voucher giảm giá tour hấp dẫn!'
                        : 'Write helpful reviews, earn reward points, and redeem them for exciting tour vouchers!'}
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <Link
                        href="/register"
                        className="inline-flex rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
                      >
                        {locale === 'vi' ? 'Đăng ký ngay' : 'Sign up'}
                      </Link>
                      <Link
                        href="/login"
                        className="text-[11px] font-bold text-slate-600 hover:text-primary transition-colors"
                      >
                        {locale === 'vi' ? 'Đăng nhập' : 'Log in'}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
