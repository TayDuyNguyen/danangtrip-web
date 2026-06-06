'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PUBLIC_ROUTES } from '@/config/routes';
import { Heart, Share2 } from "@/components/icons/solar";
import { cn } from '@/lib/utils';

interface LocationHeroProps {
  locationName: string;
  isFavorite?: boolean;
  favoriteBusy?: boolean;
  onFavoriteToggle?: () => void;
}

export default function LocationHero({
  locationName,
  isFavorite = false,
  favoriteBusy = false,
  onFavoriteToggle,
}: LocationHeroProps) {
  const t = useTranslations('locations');

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: locationName, url });
      } else if (url) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* user cancelled or clipboard blocked */
    }
  };

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-border bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => void share()}
            className="flex items-center gap-1.5 text-sm font-medium text-on-surface-subtle transition-colors hover:text-on-surface"
          >
            <Share2 className="h-4 w-4" />
            {t('detail.share')}
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onFavoriteToggle}
              disabled={favoriteBusy}
              aria-pressed={isFavorite}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors",
                isFavorite
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-border bg-white text-on-surface-subtle hover:border-primary/20 hover:text-red-500"
              )}
            >
              <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />
            </button>
            <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-primary/90">
              {t('detail.book_now')}
            </button>
          </div>
        </div>
      </div>

      <div className="design-container mb-6 hidden items-center justify-between pt-10 md:flex">
        <nav
          className="flex items-center gap-2 text-sm font-medium text-on-surface-subtle"
          aria-label={t('detail.breadcrumb_nav_label')}
        >
          <Link href={PUBLIC_ROUTES.LOCATIONS} className="transition-colors hover:text-primary">
            {t('detail.breadcrumb_locations')}
          </Link>
          <span className="text-on-surface-subtle/50">/</span>
          <span className="font-semibold text-on-surface">{locationName}</span>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void share()}
            className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-on-surface-subtle transition-colors duration-300 hover:border-primary/20 hover:text-on-surface"
          >
            <Share2 className="h-4 w-4" />
            {t('detail.share')}
          </button>
          <button
            type="button"
            onClick={onFavoriteToggle}
            disabled={favoriteBusy}
            aria-pressed={isFavorite}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300",
              isFavorite
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-border bg-white text-on-surface-subtle hover:border-primary/20 hover:text-red-500"
            )}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />
            {t('detail.save')}
          </button>
        </div>
      </div>
    </>
  );
}
