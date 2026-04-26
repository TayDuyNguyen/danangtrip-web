import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locationService } from '@/services/location.service';
import LocationDetailClient from '@/features/locations/components/detail/LocationDetailClient';
import { getTranslations } from 'next-intl/server';

type LocationDetailPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: LocationDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'locations' });
  try {
    const response = await locationService.getDetail(slug);
    const location = response.data;

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
    const response = await locationService.getDetail(slug);
    location = response.data;
  } catch (error) {
    console.error('Error fetching location detail:', error);
    return notFound();
  }

  if (!location) {
    return notFound();
  }

  return <LocationDetailClient location={location} locale={locale} />;
}
