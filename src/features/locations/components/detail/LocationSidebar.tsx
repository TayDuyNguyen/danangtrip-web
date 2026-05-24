'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { Map as MapIcon } from "@/components/icons/solar";
import type { Location } from '@/types';
import WeatherWidget from './WeatherWidget';
import LocationNearby from './LocationNearby';
import { getLocationMapsUrl } from './LocationMapPreview';

const LocationMapPreview = dynamic(() => import('./LocationMapPreview'), {
  ssr: false,
});

interface LocationSidebarProps {
  location: Location;
  locale: string;
  nearby?: Location[];
  nearbyLoading?: boolean;
}

export default function LocationSidebar({ location, locale, nearby, nearbyLoading }: LocationSidebarProps) {
  const t = useTranslations('locations');
  const priceMin = location.price_min || 0;
  const mapsUrl = getLocationMapsUrl(location);

  return (
    <div className="sticky top-28 space-y-6">
      {/* Action Card */}
      <div className="reveal-up reveal-delay-100 rounded-xl border border-border bg-surface-container-lowest p-8 shadow-xl">
        <div className="mb-6 flex items-end gap-1">
          <span className="text-3xl font-bold text-primary">
            {priceMin.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
          </span>
          <span className="mb-1 text-sm text-on-surface-subtle">{t('detail.price_per_person')}</span>
        </div>

        <div className="space-y-4">
          <Button variant="primary" className="w-full py-6 text-lg font-bold">
            {t('detail.book_now')}
          </Button>
          <Button variant="secondary" className="w-full border-border py-6 text-lg font-bold hover:border-primary hover:text-primary transition-colors bg-surface-container-low">
            {t('detail.contact_consultancy')}
          </Button>
        </div>

        <p className="mt-6 text-center text-xs italic text-on-surface-subtle">{t('detail.price_note')}</p>
      </div>

      {/* Map Preview */}
      <div className="reveal-up reveal-delay-200 overflow-hidden rounded-xl border border-border bg-surface-container-lowest shadow-lg">
        <LocationMapPreview location={location} showMapLink={false} />
        <div className="p-5">
          <p className="text-sm font-bold text-foreground leading-tight mb-1">{location.address}</p>
          <p className="line-clamp-1 text-xs text-on-surface-subtle font-medium">
            {location.district}, {t('detail.address_suffix')}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#404040] bg-[#171717] px-4 py-3 text-sm font-bold text-white transition hover:border-primary hover:text-primary"
          >
            <MapIcon className="h-4 w-4 text-primary" />
            {t('detail.view_on_map')}
          </a>
        </div>
      </div>

      {/* Weather Widget */}
      <WeatherWidget />

      <LocationNearby items={nearby ?? []} isLoading={nearbyLoading} />
    </div>
  );
}
