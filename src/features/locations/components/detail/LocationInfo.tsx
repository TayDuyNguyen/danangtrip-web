'use client';

import React, { useMemo } from 'react';
import { MapPin, Phone, Globe, Clock, CheckCircle2 } from 'lucide-react';
import { Badge, RatingStars } from '@/components/ui';
import type { Location } from '@/types';
import { useTranslations } from 'next-intl';
import { normalizeOpeningHoursDisplay } from '@/features/locations/utils/opening-hours-display';

interface LocationInfoProps {
  location: Location;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ location }) => {
  const t = useTranslations('locations');
  const avgRating = Math.min(5, Math.max(0, parseFloat(location.avg_rating) || 0));

  const openingHoursDisplay = useMemo(
    () => normalizeOpeningHoursDisplay(location.opening_hours),
    [location.opening_hours]
  );

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {location.category ? (
            <Badge variant="primary" className="bg-[#00A19D] text-white uppercase tracking-wider">
              {location.category}
            </Badge>
          ) : null}
          <Badge variant="secondary" className="bg-surface-container-low text-on-surface-variant">
            {location.district}
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {location.name}
        </h1>

        <div className="flex items-center gap-4">
          <RatingStars 
            rating={avgRating} 
            count={location.review_count} 
            showText 
            size="lg" 
          />
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <MapPin className="h-4 w-4 text-[#FF5A5F]" />
            <span className="text-sm font-medium">{location.address}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="prose prose-blue max-w-none text-on-surface-variant">
        <p className="text-lg leading-relaxed">
          {location.description}
        </p>
        {location.content && (
          <div className="mt-4" dangerouslySetInnerHTML={{ __html: location.content }} />
        )}
      </div>

      {/* Amenities */}
      {location.amenities && location.amenities.length > 0 && (
        <div className="space-y-4 rounded-2xl bg-surface-container-low p-6 shadow-sm border border-border">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            {t('detail.amenities_title')}
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {location.amenities.map((amenity) => (
              <div key={String(amenity.id)} className="flex items-center gap-2 text-on-surface-variant">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00A19D]" />
                <span className="text-sm font-medium">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {location.phone && (
          <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 rounded-xl border border-border bg-surface-container-lowest p-4 transition-all hover:border-[#00A19D] hover:shadow-md">
            <div className="rounded-lg bg-[#00A19D]/10 p-2 text-[#00A19D]">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-on-surface-subtle">{t('detail.contact_phone_label')}</p>
              <p className="text-sm font-bold text-foreground">{location.phone}</p>
            </div>
          </a>
        )}
        
        {location.website && (
          <a href={location.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-border bg-surface-container-lowest p-4 transition-all hover:border-[#00A19D] hover:shadow-md">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-on-surface-subtle">{t('detail.contact_website_label')}</p>
              <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{location.website.replace(/^https?:\/\//, '')}</p>
            </div>
          </a>
        )}

        {openingHoursDisplay ? (
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-container-lowest p-4 transition-all hover:border-[#FF5A5F] hover:shadow-md">
            <div className="rounded-lg bg-[#FF5A5F]/10 p-2 text-[#FF5A5F]">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-on-surface-subtle">{t('detail.opening_hours')}</p>
              {openingHoursDisplay.kind === 'plain' ? (
                <p className="text-sm font-bold text-foreground">{openingHoursDisplay.text}</p>
              ) : (
                <ul className="mt-1 space-y-1 text-sm font-bold text-foreground">
                  {openingHoursDisplay.rows.map((row) => (
                    <li key={row.dayKey} className="flex gap-2">
                      <span className="shrink-0 text-on-surface-variant">
                        {t(`detail.opening_weekday.${row.dayKey}`)}
                      </span>
                      <span>{row.hours}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LocationInfo;
