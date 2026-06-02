'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { RatingStars, Button } from '@/components/ui';
import { MessageSquare, ThumbsUp } from "@/components/icons/solar";
import type { LocationReview } from '@/types';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { locationService } from '@/services/location.service';
import { ratingService } from '@/services/rating.service';
import { shouldRetryQuery } from '@/lib/react-query';
import { mapLocationRatingToReview } from '@/features/locations/utils/map-location-rating';
import { useAuthStore } from '@/store/auth.store';
import WriteReviewModal from '@/features/locations/components/detail/WriteReviewModal';
import { getApiErrorMessage } from '@/utils';

interface LocationReviewsProps {
  locationId: number;
  initialAverageRating: number;
  initialReviewCount: number;
}

const LocationReviews: React.FC<LocationReviewsProps> = ({
  locationId,
  initialAverageRating,
  initialReviewCount,
}) => {
  const t = useTranslations('locations');
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsQuery = useQuery({
    queryKey: ['locations', locationId, 'rating-stats'],
    queryFn: async () => {
      const res = await locationService.getRatingStats(locationId);
      if (!res.success || !res.data) {
        throw res;
      }
      return res.data;
    },
    enabled: mounted,
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  const ratingCheckQuery = useQuery({
    queryKey: ['locations', locationId, 'rating-check'],
    queryFn: async () => {
      const res = await ratingService.checkLocation(locationId);
      if (!res.success || !res.data) {
        throw res;
      }
      return res.data;
    },
    enabled: mounted && isAuthenticated,
    staleTime: 60 * 1000,
    retry: shouldRetryQuery,
  });

  const ratingsQuery = useInfiniteQuery({
    queryKey: ['locations', locationId, 'ratings'],
    queryFn: async ({ pageParam }) => {
      const res = await locationService.getRatings(locationId, {
        page: pageParam,
        per_page: 5,
        sort_by: 'created_at',
      });
      if (!res.success || !res.data) {
        throw res;
      }
      return res.data;
    },
    enabled: mounted,
    initialPageParam: 1,
    getNextPageParam: (last) => (last.current_page < last.last_page ? last.current_page + 1 : undefined),
    staleTime: 60 * 1000,
    retry: shouldRetryQuery,
  });

  const helpfulMutation = useMutation({
    mutationFn: (ratingId: number) => ratingService.markHelpful(ratingId),
    onSuccess: (res) => {
      if (res.success) {
        void queryClient.invalidateQueries({ queryKey: ['locations', locationId, 'ratings'] });
      } else {
        toast.error(getApiErrorMessage(res, t('detail.helpful_error')));
      }
    },
    onError: (error) => toast.error(getApiErrorMessage(error, t('detail.helpful_error'))),
  });

  const reviews: LocationReview[] = useMemo(() => {
    const pages = ratingsQuery.data?.pages;
    if (!pages?.length) return [];
    return pages.flatMap((p) => p.data.map((row) => mapLocationRatingToReview(row)));
  }, [ratingsQuery.data?.pages]);

  const firstPage = ratingsQuery.data?.pages[0];
  const totalReviews = firstPage?.total ?? initialReviewCount;
  const safeAverage = Math.min(5, Math.max(0, Number.isFinite(initialAverageRating) ? initialAverageRating : 0));
  const hasRated = Boolean(ratingCheckQuery.data?.has_rated);

  const distribution = useMemo(() => {
    const s = statsQuery.data;
    if (!s) return [];
    const total = Object.values(s).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
    if (total === 0) return [];
    return ([5, 4, 3, 2, 1] as const).map((star) => {
      const v = s[String(star)];
      const count = typeof v === 'number' ? v : 0;
      const pct = Math.round((count / total) * 100);
      return { star, count, pct };
    });
  }, [statsQuery.data]);

  const openWriteModal = () => {
    if (!isAuthenticated) {
      toast.error(t('detail.login_to_review'));
      return;
    }
    if (hasRated) return;
    setModalOpen(true);
  };

  const onHelpful = (review: LocationReview) => {
    if (!isAuthenticated) {
      toast.error(t('detail.helpful_login'));
      return;
    }
    const id = Number(review.id);
    if (!Number.isFinite(id)) return;
    helpfulMutation.mutate(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 rounded-full bg-primary" />
            <h2 className="text-2xl font-semibold tracking-tight text-on-surface">{t('detail.reviews_title')}</h2>
          </div>
          <p className="mt-2 pl-[18px] text-sm text-on-surface-subtle">
            {t('detail.reviews_count', { count: totalReviews })}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="mb-1 text-4xl font-semibold leading-none text-primary">{safeAverage.toFixed(1)}</p>
            <RatingStars rating={safeAverage} size="sm" />
          </div>
          <button
            type="button"
            className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-on-surface transition-all duration-300 hover:border-primary/25 hover:bg-[#fafafa] disabled:opacity-40"
            disabled={hasRated}
            onClick={openWriteModal}
          >
            {t('detail.write_review')}
          </button>
        </div>
      </div>

      {distribution.length > 0 && (
        <div className="rounded-[22px] border border-border bg-[#fcfcfc] p-5 space-y-2">
          {distribution.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-3 text-xs text-on-surface-subtle">
              <span className="w-4 shrink-0">{star}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eceff3]">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-5 text-right">{count}</span>
            </div>
          ))}
        </div>
      )}

      {hasRated && <p className="text-xs text-on-surface-subtle">{t('detail.already_reviewed')}</p>}

      {ratingsQuery.isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-[22px] border border-border bg-[#f3f4f6]" />
          ))}
        </div>
      ) : null}

      {ratingsQuery.isError ? (
        <p className="text-sm text-on-surface-subtle">
          {getApiErrorMessage(ratingsQuery.error, t('detail.reviews_load_error'))}
        </p>
      ) : null}

      <div className="grid gap-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="rounded-[22px] border border-border bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-primary/20">
              <div className="flex items-start gap-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                  <Image
                    src={review.userAvatar || '/images/testimonials/avatar-1.png'}
                    alt={review.userName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-on-surface">{review.userName}</h4>
                      <p className="text-[10px] text-on-surface-subtle">
                        {format(new Date(review.createdAt), "dd 'thg' M, yyyy", { locale: locale === 'vi' ? vi : enUS })}
                      </p>
                    </div>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>

                  <p className="text-sm leading-relaxed text-on-surface-subtle">{review.comment}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {review.images.map((img, i) => (
                        <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
                          <Image
                            src={img}
                            alt={t('detail.review_photo_alt', { index: i + 1 })}
                            fill
                            className="object-cover transition-transform hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs text-on-surface-subtle transition-colors hover:text-primary disabled:opacity-50"
                      disabled={helpfulMutation.isPending}
                      onClick={() => onHelpful(review)}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {t('detail.helpful')}
                      {review.helpfulCount != null && review.helpfulCount > 0 ? <span>({review.helpfulCount})</span> : null}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : !ratingsQuery.isLoading ? (
          <div className="rounded-[22px] border border-dashed border-border bg-[#fcfcfc] py-14 text-center">
            <MessageSquare className="mx-auto mb-4 h-10 w-10 text-on-surface-subtle" />
            <p className="text-sm font-semibold text-on-surface">{t('detail.no_reviews')}</p>
            <p className="mt-1 text-xs text-on-surface-subtle">{t('detail.no_reviews_subtitle')}</p>
          </div>
        ) : null}
      </div>

      {ratingsQuery.hasNextPage ? (
        <div className="flex justify-center pt-2">
          <Button type="button" variant="secondary" isLoading={ratingsQuery.isFetchingNextPage} onClick={() => ratingsQuery.fetchNextPage()}>
            {t('detail.load_more_reviews')}
          </Button>
        </div>
      ) : null}

      <WriteReviewModal open={modalOpen} onClose={() => setModalOpen(false)} locationId={locationId} />
    </div>
  );
};

export default LocationReviews;
