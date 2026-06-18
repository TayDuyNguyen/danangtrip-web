'use client';

import React, { useMemo } from 'react';
import { MapPin, Phone, Globe, Clock, CheckCircle2 } from "@/components/icons/solar";
import { RatingStars } from '@/components/ui';
import type { Location } from '@/types';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/location.service';
import { normalizeOpeningHoursDisplay } from '@/features/locations/utils/opening-hours-display';

interface LocationInfoProps {
  location: Location;
}

const infoCardClass =
  "group flex items-center gap-4 rounded-[22px] border border-border bg-[#fafafa] p-5 transition-all duration-300 hover:border-primary/20 hover:bg-white";

const LocationInfo: React.FC<LocationInfoProps> = ({ location }) => {
  const t = useTranslations('locations');
  const fallbackRating = Math.min(5, Math.max(0, parseFloat(location.avg_rating) || 0));

  const statsQuery = useQuery({
    queryKey: ['locations', location.id, 'rating-stats'],
    queryFn: async () => {
      const res = await locationService.getRatingStats(location.id);
      if (!res.success || !res.data) {
        throw res;
      }
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const { avgRating, reviewCount } = useMemo(() => {
    const stats = statsQuery.data;
    if (!stats) {
      return { avgRating: fallbackRating, reviewCount: location.review_count };
    }

    const total = Object.values(stats).reduce(
      (sum, count) => sum + (typeof count === 'number' ? count : 0),
      0
    );

    if (total === 0) {
      return { avgRating: fallbackRating, reviewCount: location.review_count };
    }

    const totalScore = Object.entries(stats).reduce(
      (sum, [star, count]) => sum + Number(star) * (typeof count === 'number' ? count : 0),
      0
    );

    return {
      avgRating: Math.min(5, Math.max(0, totalScore / total)),
      reviewCount: total,
    };
  }, [statsQuery.data, fallbackRating, location.review_count]);

  const openingHoursDisplay = useMemo(
    () => normalizeOpeningHoursDisplay(location.opening_hours),
    [location.opening_hours]
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-xs font-semibold uppercase tracking-normal text-primary">
          {location.district}
          {location.category && (
            <span className="ml-4 text-on-surface-subtle">
              / {typeof location.category === 'string' ? location.category : location.category.name}
            </span>
          )}
        </div>

        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-on-surface md:text-3xl">
          {location.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-on-surface-subtle">
          <RatingStars rating={avgRating} count={reviewCount} showText size="sm" />
          {location.address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span>{location.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-none space-y-4 text-base leading-relaxed text-on-surface-subtle">
        {location.description && <p className="whitespace-pre-wrap">{location.description}</p>}
        {location.content && (
          <div
            className="prose prose-neutral max-w-none prose-p:text-on-surface-subtle prose-headings:text-on-surface prose-strong:text-on-surface prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: location.content }}
          />
        )}
      </div>

      {location.tags && location.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {location.tags.map((tag) => (
            <span
              key={String(tag.id)}
              className="cursor-pointer rounded-full border border-border bg-[#fafafa] px-3.5 py-1.5 text-xs font-semibold text-on-surface-subtle transition-all duration-300 hover:border-primary/30 hover:bg-white hover:text-primary"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {location.amenities && location.amenities.length > 0 && (
        <div className="rounded-[28px] border border-border bg-[#fcfcfc] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 rounded-full bg-primary" />
            <h3 className="text-xl font-semibold tracking-tight text-on-surface">{t('detail.amenities_title')}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {location.amenities.map((amenity) => (
              <div key={String(amenity.id)} className="flex items-center gap-2 text-sm text-on-surface-subtle">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {location.phone && (
          <a href={`tel:${location.phone.replace(/\s/g, '')}`} className={infoCardClass}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-on-surface-subtle transition-all duration-300 group-hover:border-primary/20 group-hover:text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">
                {t('detail.contact_phone_label')}
              </p>
              <p className="text-sm font-semibold text-on-surface">{location.phone}</p>
            </div>
          </a>
        )}

        {location.website && (
          <a href={location.website} target="_blank" rel="noopener noreferrer" className={infoCardClass}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-on-surface-subtle transition-all duration-300 group-hover:border-primary/20 group-hover:text-primary">
              <Globe className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="mb-1 text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">
                {t('detail.contact_website_label')}
              </p>
              <p className="max-w-[160px] truncate text-sm font-semibold text-on-surface">
                {location.website.replace(/^https?:\/\//, '')}
              </p>
            </div>
          </a>
        )}

        {openingHoursDisplay && (
          <div className={infoCardClass}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-on-surface-subtle transition-all duration-300 group-hover:border-primary/20 group-hover:text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">
                {t('detail.opening_hours')}
              </p>
              {openingHoursDisplay.kind === 'plain' ? (
                <p className="whitespace-pre-line text-sm font-semibold text-on-surface">{openingHoursDisplay.text}</p>
              ) : (
                <ul className="mt-1 space-y-1 text-sm font-semibold text-on-surface">
                  {openingHoursDisplay.rows.map((row) => (
                    <li key={row.dayKey} className="flex gap-2">
                      <span className="shrink-0 text-on-surface-subtle">
                        {t(`detail.opening_weekday.${row.dayKey}`)}
                      </span>
                      <span>{row.hours}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationInfo;
