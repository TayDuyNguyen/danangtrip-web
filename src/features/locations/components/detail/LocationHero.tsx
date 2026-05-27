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
      {/* Mobile sticky action bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between glass-retro px-4 py-3 md:hidden border-b border-white/10">
        <button
          type="button"
          onClick={() => void share()}
          className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors font-medium"
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
              "flex items-center gap-1.5 text-sm transition-colors font-medium",
              isFavorite ? "text-red-500" : "text-neutral-400 hover:text-red-500"
            )}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />
          </button>
          <button className="px-4 py-1.5 rounded-full text-xs bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 transition-all duration-300 font-medium">
            {t('detail.book_now')}
          </button>
        </div>
      </div>

      {/* Desktop: Breadcrumb & Action Row — Tour style */}
      <div className="design-container mb-6 hidden items-center justify-between pt-10 md:flex">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm text-neutral-400 font-medium"
          aria-label={t('detail.breadcrumb_nav_label')}
        >
          <Link href={PUBLIC_ROUTES.LOCATIONS} className="hover:text-primary transition-colors">
            {t('detail.breadcrumb_locations')}
          </Link>
          <span className="text-neutral-700">/</span>
          <span className="text-neutral-300 font-semibold">{locationName}</span>
        </nav>

        {/* Action buttons — Tour style */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => void share()}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-300 font-medium"
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
              "flex items-center gap-2 text-sm transition-colors duration-300 font-medium",
              isFavorite ? "text-red-500" : "text-neutral-400 hover:text-red-500"
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
