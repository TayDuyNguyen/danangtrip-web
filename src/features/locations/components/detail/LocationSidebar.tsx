'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Map as MapIcon } from "@/components/icons/solar";
import type { Location } from '@/types';
import WeatherWidget from './WeatherWidget';
import LocationNearby from './LocationNearby';
import { getLocationMapsUrl } from '@/features/locations/utils/map-url';

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
    <div className="sticky top-28 space-y-5">
      <div className="reveal-up reveal-delay-100 rounded-[28px] border border-border bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
        <div className="mb-6 border-b border-border pb-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-on-surface-subtle">
            {t('detail.price_label')}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-primary">
              {priceMin > 0 ? priceMin.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US') : t('detail.free')}
            </span>
            {priceMin > 0 && (
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-on-surface-subtle">
                / {t('detail.price_per_person').replace('/ ', '')}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(255,56,92,0.18)] transition-all duration-300 hover:bg-primary/90">
            {t('detail.book_now')}
          </button>
          <button className="w-full rounded-full border border-border bg-[#fafafa] py-3.5 text-sm font-semibold text-on-surface transition-all duration-300 hover:border-primary/25 hover:bg-white hover:text-primary">
            {t('detail.contact_consultancy')}
          </button>
        </div>

        <p className="mt-4 text-center text-xs italic text-on-surface-subtle">{t('detail.price_note')}</p>
      </div>

      <div className="reveal-up reveal-delay-200 overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
        <div className="h-[200px] w-full overflow-hidden">
          <LocationMapPreview location={location} showMapLink={false} />
        </div>

        <div className="border-t border-border p-5">
          <p className="mb-1 text-sm font-semibold leading-tight text-on-surface">{location.address}</p>
          <p className="mb-4 text-xs text-on-surface-subtle">
            {location.district}, {t('detail.address_suffix')}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-border bg-[#fafafa] py-3 text-sm font-semibold text-on-surface transition-all duration-300 hover:border-primary/25 hover:bg-white hover:text-primary"
          >
            <MapIcon className="h-4 w-4 text-primary" />
            {t('detail.view_on_map')}
          </a>
        </div>
      </div>

      <div className="reveal-up reveal-delay-300">
        <WeatherWidget />
      </div>

      <div className="reveal-up reveal-delay-400">
        <LocationNearby items={nearby ?? []} isLoading={nearbyLoading} />
      </div>
    </div>
  );
}
