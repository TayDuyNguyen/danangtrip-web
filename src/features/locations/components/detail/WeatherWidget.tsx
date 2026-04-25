'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Cloud } from 'lucide-react';
import { useWeather } from '@/hooks/use-weather';

function translateCondition(conditionKey: string, t: (key: string) => string): string {
  if (conditionKey === 'sunny') {
    return t('home.weather.sunny');
  }
  if (conditionKey === 'cloudy') {
    return t('home.weather.cloudy');
  }
  if (conditionKey === 'rainy') {
    return t('home.weather.rainy');
  }
  return conditionKey;
}

export default function WeatherWidget() {
  const tLoc = useTranslations('locations');
  const t = useTranslations();
  const { weather, isLoading, error } = useWeather();

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border bg-surface-container-low p-6 shadow-sm reveal-up reveal-delay-300">
        <div className="mb-4 flex animate-pulse items-center justify-between">
          <div className="h-6 w-36 rounded bg-surface-container-high" />
          <div className="h-6 w-20 rounded-full bg-surface-container-high" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 animate-pulse rounded-2xl bg-surface-container-high" />
          <div className="flex-1 space-y-2">
            <div className="h-10 w-24 animate-pulse rounded bg-surface-container-high" />
            <div className="h-4 w-full max-w-[200px] animate-pulse rounded bg-surface-container-high" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="rounded-3xl border border-border bg-surface-container-low p-6 text-sm text-on-surface-variant shadow-sm reveal-up reveal-delay-300">
        <p className="font-semibold text-foreground">{tLoc('detail.weather_title')}</p>
        <p className="mt-2 text-on-surface-subtle">{tLoc('detail.weather_unavailable')}</p>
      </div>
    );
  }

  const conditionLabel = translateCondition(weather.condition, t);

  return (
    <div className="rounded-3xl border border-border bg-surface-container-low p-6 shadow-sm reveal-up reveal-delay-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">{tLoc('detail.weather_title')}</h3>
        <span className="rounded-full bg-surface-container-lowest px-2 py-1 text-xs font-medium text-[#00A19D] shadow-sm">
          {tLoc('detail.weather_city')}
        </span>
      </div>

      <div className="mb-2 flex items-center gap-4">
        <div className="rounded-2xl bg-surface-container-lowest p-3 text-3xl shadow-sm" aria-hidden>
          {weather.icon ? <span>{weather.icon}</span> : <Cloud className="h-10 w-10 text-yellow-500" />}
        </div>
        <div>
          <div className="text-4xl font-black text-foreground">{weather.temp}°C</div>
          <div className="text-sm font-medium text-on-surface-variant">{conditionLabel}</div>
        </div>
      </div>
    </div>
  );
}
