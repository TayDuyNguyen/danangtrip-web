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
    <div className="sticky top-28 space-y-4">
      {/* Action Card — Stitch: glass-card with price heading & 2 CTA buttons */}
      <div className="reveal-up reveal-delay-100 glass-retro rounded-2xl p-6">
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-6 pb-5 border-b border-white/10">
          <span className="text-3xl font-black text-primary">
            {priceMin > 0
              ? priceMin.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')
              : t('detail.free')}
          </span>
          {priceMin > 0 && (
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
              / {t('detail.price_per_person').replace('/ ', '')}
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <button className="w-full py-3.5 rounded-full bg-neutral-900 text-white border border-neutral-700 text-sm font-medium hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-300">
            {t('detail.book_now')}
          </button>
          <button className="w-full py-3.5 rounded-full text-white border border-neutral-700 text-sm font-medium hover:bg-white/5 transition-all duration-300">
            {t('detail.contact_consultancy')}
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] font-mono italic text-neutral-600">
          {t('detail.price_note')}
        </p>
      </div>

      {/* Map Widget — Stitch: glass-card p-0 overflow-hidden */}
      <div className="reveal-up reveal-delay-200 glass-retro rounded-2xl overflow-hidden">
        {/* Map View (200px height) */}
        <div className="h-[200px] w-full overflow-hidden">
          <LocationMapPreview location={location} showMapLink={false} />
        </div>

        {/* Address footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <p className="text-sm font-semibold text-white leading-tight mb-1">
            {location.address}
          </p>
          <p className="text-[10px] font-mono text-neutral-500 mb-4">
            {location.district}, {t('detail.address_suffix')}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-sm text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300"
          >
            <MapIcon className="h-4 w-4 text-primary" />
            {t('detail.view_on_map')}
          </a>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="reveal-up reveal-delay-300">
        <WeatherWidget />
      </div>

      {/* Nearby Locations */}
      <div className="reveal-up reveal-delay-400">
        <LocationNearby items={nearby ?? []} isLoading={nearbyLoading} />
      </div>
    </div>
  );
}
