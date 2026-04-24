'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { RatingStars, Button } from '@/components/ui';
import { MessageSquare, ThumbsUp } from 'lucide-react';
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

  const statsQuery = useQuery({
    queryKey: ['locations', locationId, 'rating-stats'],
    queryFn: async () => {
      const res = await locationService.getRatingStats(locationId);
      if (!res.success || !res.data) {
        throw res;
      }
      return res.data;
    },
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
    enabled: isAuthenticated,
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
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.current_page < last.last_page ? last.current_page + 1 : undefined,
    staleTime: 60 * 1000,
    retry: shouldRetryQuery,
  });

  const helpfulMutation = useMutation({
    mutationFn: (ratingId: number) => ratingService.markHelpful(ratingId),
    onSuccess: (res) => {
      if (res.success) {
        void queryClient.invalidateQueries({ queryKey: ['locations', locationId, 'ratings'] });
      } else {
        toast.error(res.message || t('detail.helpful_error'));
      }
    },
    onError: () => toast.error(t('detail.helpful_error')),
  });

  const reviews: LocationReview[] = useMemo(() => {
    const pages = ratingsQuery.data?.pages;
    if (!pages?.length) {
      return [];
    }
    return pages.flatMap((p) => p.data.map((row) => mapLocationRatingToReview(row)));
  }, [ratingsQuery.data?.pages]);

  const firstPage = ratingsQuery.data?.pages[0];
  const totalReviews = firstPage?.total ?? initialReviewCount;
  const safeAverage = Math.min(
    5,
    Math.max(0, Number.isFinite(initialAverageRating) ? initialAverageRating : 0)
  );

  const hasRated = Boolean(ratingCheckQuery.data?.has_rated);

  const distribution = useMemo(() => {
    const s = statsQuery.data;
    if (!s) {
      return [];
    }
    const total = Object.values(s).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
    if (total === 0) {
      return [];
    }
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
    if (hasRated) {
      return;
    }
    setModalOpen(true);
  };

  const onHelpful = (review: LocationReview) => {
    if (!isAuthenticated) {
      toast.error(t('detail.helpful_login'));
      return;
    }
    const id = Number(review.id);
    if (!Number.isFinite(id)) {
      return;
    }
    helpfulMutation.mutate(id);
  };

  return (
    <div className="space-y-8 py-10">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t('detail.reviews_title')}</h2>
          <p className="mt-2 text-on-surface-variant">{t('detail.reviews_count', { count: totalReviews })}</p>
        </div>

        <div className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-surface-container-lowest p-6 shadow-sm md:w-auto md:flex-row md:items-center md:gap-6">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-[#FF5A5F]">{safeAverage.toFixed(1)}</p>
            <RatingStars rating={safeAverage} size="md" className="mt-1" />
          </div>
          {distribution.length > 0 ? (
            <div className="hidden h-12 w-px bg-border md:block" />
          ) : null}
          {distribution.length > 0 ? (
            <div className="min-w-[200px] flex-1 space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wide text-on-surface-subtle">
                {t('detail.star_distribution')}
              </p>
              {distribution.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 font-medium text-on-surface-variant">{star}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-low">
                    <div
                      className="h-full rounded-full bg-[#FF5A5F]/80 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-on-surface-subtle">{count}</span>
                </div>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col gap-2 md:items-end">
            <Button
              type="button"
              variant="primary"
              className="shadow-[#FF5A5F]/20 shadow-lg bg-[#FF5A5F] hover:bg-[#FF5A5F]/90"
              disabled={hasRated}
              onClick={openWriteModal}
            >
              {t('detail.write_review')}
            </Button>
            {hasRated ? (
              <p className="text-center text-xs text-on-surface-subtle md:text-right">{t('detail.already_reviewed')}</p>
            ) : null}
          </div>
        </div>
      </div>

      {ratingsQuery.isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-surface-container-low" />
          ))}
        </div>
      ) : null}

      {ratingsQuery.isError ? (
        <p className="text-sm text-on-surface-subtle">{t('detail.reviews_load_error')}</p>
      ) : null}

      <div className="grid gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="group relative rounded-2xl border border-transparent bg-surface-container-lowest p-6 transition-all duration-300 hover:border-border hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#00A19D]/10 ring-offset-2 ring-offset-background">
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
                      <h4 className="font-bold text-foreground">{review.userName}</h4>
                      <p className="text-xs text-on-surface-subtle">
                        {format(new Date(review.createdAt), 'dd MMMM, yyyy', {
                          locale: locale === 'vi' ? vi : enUS,
                        })}
                      </p>
                    </div>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>

                  <p className="leading-relaxed text-on-surface-variant">{review.comment}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {review.images.map((img, i) => (
                        <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg shadow-sm">
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
                      className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:text-primary disabled:opacity-50"
                      disabled={helpfulMutation.isPending}
                      onClick={() => onHelpful(review)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {t('detail.helpful')}
                      {review.helpfulCount != null && review.helpfulCount > 0 ? (
                        <span className="text-on-surface-subtle">({review.helpfulCount})</span>
                      ) : null}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : !ratingsQuery.isLoading ? (
          <div className="rounded-2xl border-2 border-dashed border-border py-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-on-surface-subtle opacity-50" />
            <p className="mt-4 text-lg font-medium text-on-surface-variant">{t('detail.no_reviews')}</p>
            <p className="text-sm text-on-surface-subtle">{t('detail.no_reviews_subtitle')}</p>
          </div>
        ) : null}
      </div>

      {ratingsQuery.hasNextPage ? (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="secondary"
            isLoading={ratingsQuery.isFetchingNextPage}
            onClick={() => ratingsQuery.fetchNextPage()}
          >
            {t('detail.load_more_reviews')}
          </Button>
        </div>
      ) : null}

      <WriteReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        locationId={locationId}
      />
    </div>
  );
};

export default LocationReviews;
