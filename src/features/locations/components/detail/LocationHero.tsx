'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PUBLIC_ROUTES } from '@/config/routes';
import { Button } from '@/components/ui';
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
      <div className="sticky top-0 z-30 flex items-center justify-between bg-background/80 px-4 py-3 shadow-sm backdrop-blur-md md:hidden">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="rounded-full bg-transparent shadow-none text-on-surface-variant border-border"
          onClick={() => void share()}
        >
          <Share2 className="h-5 w-5" />
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="rounded-full bg-transparent shadow-none text-on-surface-variant border-border"
            disabled={favoriteBusy}
            onClick={onFavoriteToggle}
            aria-pressed={isFavorite}
          >
            <Heart
              className={cn('h-5 w-5', isFavorite && 'fill-primary text-primary')}
            />
          </Button>
          <Button variant="primary" size="sm" className="rounded-full">
            {t('detail.book_now')}
          </Button>
        </div>
      </div>

      <div className="design-container mb-8 hidden items-center justify-between pt-8 md:flex md:pt-12">
        <nav className="flex text-sm text-on-surface-subtle font-medium" aria-label={t('detail.breadcrumb_nav_label')}>
          <Link href={PUBLIC_ROUTES.LOCATIONS} className="hover:text-primary transition-colors">
            {t('detail.breadcrumb_locations')}
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="font-semibold text-foreground">{locationName}</span>
        </nav>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="gap-2 rounded-full border-[#404040] bg-[#171717] text-[#f5f5f5] shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:border-primary hover:bg-[#1f1f1f] hover:text-primary transition-colors"
            onClick={() => void share()}
          >
            <Share2 className="h-4 w-4" />
            {t('detail.share')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="gap-2 rounded-full border-[#404040] bg-[#171717] text-[#f5f5f5] shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:border-primary hover:bg-[#1f1f1f] hover:text-primary transition-colors"
            disabled={favoriteBusy}
            onClick={onFavoriteToggle}
            aria-pressed={isFavorite}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-primary text-primary')} />
            {t('detail.save')}
          </Button>
        </div>
      </div>
    </>
  );
}
