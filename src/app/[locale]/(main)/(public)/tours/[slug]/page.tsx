import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import TourDetailClient from "@/features/tour/components/TourDetailClient";
import { serverApiGet } from "@/lib/server-api";
import type { Tour } from "@/types";

type TourDetailPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

const getTour = cache(async (slug: string) => {
  return serverApiGet<Tour>(`/tours/${encodeURIComponent(slug)}`, { revalidate: 300 });
});

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "tour" });

  try {
    const tour = await getTour(slug);

    if (!tour) {
      return { title: `${t("detail.not_found")} — ${t("detail.meta_brand")}` };
    }

    return {
      title: `${tour.name} — ${t("detail.meta_brand")}`,
      description: tour.short_desc || tour.description?.slice(0, 160) || undefined,
      openGraph: {
        images: tour.thumbnail ? [tour.thumbnail] : [],
      },
    };
  } catch {
    return { title: `${t("detail.not_found")} — ${t("detail.meta_brand")}` };
  }
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params;
  let tour;
  try {
    tour = await getTour(slug);
  } catch {
    return notFound();
  }

  if (!tour) {
    return notFound();
  }

  return <TourDetailClient tour={tour} />;
}
