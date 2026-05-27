'use client';

import React, { useMemo } from 'react';
import { MapPin, Phone, Globe, Clock, CheckCircle2 } from "@/components/icons/solar";
import { RatingStars } from '@/components/ui';
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
      {/* Title & Meta — Tour style */}
      <div className="space-y-4">
        {/* District label — monospace, uppercase, brand color */}
        <div className="text-xs font-mono text-primary uppercase tracking-widest">
          {location.district}
          {location.category && (
            <span className="ml-4 text-neutral-500">
              / {typeof location.category === 'string' ? location.category : location.category.name}
            </span>
          )}
        </div>

        {/* Location name — large, font-black */}
        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
          {location.name}
        </h1>

        {/* Rating + Address row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-400">
          <RatingStars
            rating={avgRating}
            count={location.review_count}
            showText
            size="sm"
          />
          {location.address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-neutral-500 shrink-0" />
              <span>{location.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description — Tour style: sans-serif base text */}
      <div className="space-y-4 text-base text-neutral-300 leading-relaxed max-w-none">
        {location.description && <p className="whitespace-pre-wrap">{location.description}</p>}
        {location.content && (
          <div
            className="prose prose-invert prose-sm max-w-none text-neutral-300"
            dangerouslySetInnerHTML={{ __html: location.content }}
          />
        )}
      </div>

      {/* Tags */}
      {location.tags && location.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {location.tags.map((tag) => (
            <span
              key={String(tag.id)}
              className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-xs font-semibold hover:border-primary/40 hover:text-primary transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Amenities */}
      {location.amenities && location.amenities.length > 0 && (
        <div className="glass-retro rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h3 className="text-xl font-black text-white tracking-tight">
              {t('detail.amenities_title')}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {location.amenities.map((amenity) => (
              <div key={String(amenity.id)} className="flex items-center gap-2 text-neutral-400 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info — Stitch: bento glass-card layout */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {location.phone && (
          <a
            href={`tel:${location.phone.replace(/\s/g, '')}`}
            className="group glass-retro rounded-xl p-5 flex items-center gap-4 hover:border-white/20 transition-all duration-300 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all duration-300 shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                {t('detail.contact_phone_label')}
              </p>
              <p className="text-sm font-semibold text-white">{location.phone}</p>
            </div>
          </a>
        )}

        {location.website && (
          <a
            href={location.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-retro rounded-xl p-5 flex items-center gap-4 hover:border-white/20 transition-all duration-300 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all duration-300 shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                {t('detail.contact_website_label')}
              </p>
              <p className="text-sm font-semibold text-white truncate max-w-[160px]">
                {location.website.replace(/^https?:\/\//, '')}
              </p>
            </div>
          </a>
        )}

        {openingHoursDisplay && (
          <div className="group glass-retro rounded-xl p-5 flex items-center gap-4 hover:border-white/20 transition-all duration-300">
            <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all duration-300 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                {t('detail.opening_hours')}
              </p>
              {openingHoursDisplay.kind === 'plain' ? (
                <p className="text-sm font-semibold text-white whitespace-pre-line">{openingHoursDisplay.text}</p>
              ) : (
                <ul className="mt-1 space-y-1 text-sm font-semibold text-white">
                  {openingHoursDisplay.rows.map((row) => (
                    <li key={row.dayKey} className="flex gap-2">
                      <span className="shrink-0 text-neutral-500">
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
