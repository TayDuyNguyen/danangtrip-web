'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui';
import type { Location } from '@/types';
import WeatherWidget from './WeatherWidget';
import LocationNearby from './LocationNearby';

interface LocationSidebarProps {
  location: Location;
  locale: string;
  nearby?: Location[];
  nearbyLoading?: boolean;
}

export default function LocationSidebar({ location, locale, nearby, nearbyLoading }: LocationSidebarProps) {
  const t = useTranslations('locations');
  const priceMin = location.price_min || 0;

  return (
    <div className="sticky top-28 space-y-6">
      {/* Action Card */}
      <div className="reveal-up reveal-delay-100 rounded-3xl border border-border bg-surface-container-lowest p-8 shadow-xl">
        <div className="mb-6 flex items-end gap-1">
          <span className="text-3xl font-bold text-[#FF5A5F]">
            {priceMin.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
          </span>
          <span className="mb-1 text-sm text-on-surface-subtle">{t('detail.price_per_person')}</span>
        </div>

        <div className="space-y-4">
          <Button variant="primary" className="w-full py-6 text-lg font-bold shadow-lg shadow-[#FF5A5F]/20 bg-[#FF5A5F] hover:bg-[#FF5A5F]/90">
            {t('detail.book_now')}
          </Button>
          <Button variant="secondary" className="w-full border-border py-6 text-lg font-bold hover:border-primary hover:text-primary transition-colors bg-surface-container-low">
            {t('detail.contact_consultancy')}
          </Button>
        </div>

        <p className="mt-6 text-center text-xs italic text-on-surface-subtle">{t('detail.price_note')}</p>
      </div>

      {/* Map Preview */}
      <div className="reveal-up reveal-delay-200 overflow-hidden rounded-3xl border border-border bg-surface-container-lowest shadow-lg">
        <div className="relative flex aspect-video w-full items-center justify-center bg-blue-50/10">
          <MapIcon className="h-12 w-12 text-blue-200/50" />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
          <Button variant="primary" className="absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 rounded-full text-xs shadow-md shadow-black/20 bg-surface-container-lowest text-foreground hover:bg-surface-container-low border-0">
            <MapIcon className="h-4 w-4 text-[#FF5A5F]" />
            {t('detail.view_on_map')}
          </Button>
        </div>
        <div className="p-5">
          <p className="text-sm font-bold text-foreground leading-tight mb-1">{location.address}</p>
          <p className="line-clamp-1 text-xs text-on-surface-subtle font-medium">
            {location.district}, {t('detail.address_suffix')}
          </p>
        </div>
      </div>

      {/* Weather Widget */}
      <WeatherWidget />

      <LocationNearby items={nearby ?? []} isLoading={nearbyLoading} />
    </div>
  );
}
