import { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import LocationDetailClient from '@/features/locations/components/detail/LocationDetailClient';
import { getTranslations } from 'next-intl/server';
import { serverApiGet } from '@/lib/server-api';
import type { Location } from '@/types';

type LocationDetailPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

const getLocation = cache(async (slug: string) => {
  return serverApiGet<Location>(`/locations/${encodeURIComponent(slug)}`, { revalidate: 300 });
});

export async function generateMetadata({ params }: LocationDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'locations' });
  try {
    const location = await getLocation(slug);

    if (!location) {
      return { title: `${t('detail.not_found')} — ${t('detail.meta_brand')}` };
    }

    return {
      title: `${location.name} — ${t('detail.meta_brand')}`,
      description: location.description,
      openGraph: {
        images: location.images?.[0] ? [location.images[0]] : [],
      },
    };
  } catch {
    return {
      title: `${t('detail.not_found')} — ${t('detail.meta_brand')}`,
    };
  }
}

export default async function LocationDetailPage({ params }: LocationDetailPageProps) {
  const { slug, locale } = await params;
  let location;
  try {
    location = await getLocation(slug);
  } catch {
    return notFound();
  }

  if (!location) {
    return notFound();
  }

  return <LocationDetailClient location={location} locale={locale} />;
}
