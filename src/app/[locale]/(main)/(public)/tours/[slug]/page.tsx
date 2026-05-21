import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { tourService } from "@/services/tour.service";
import TourDetailClient from "@/features/tour/components/TourDetailClient";

type TourDetailPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "tour" });

  try {
    const response = await tourService.getDetail(slug);
    const tour = response.data;

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
    const response = await tourService.getDetail(slug);
    tour = response.data;
  } catch {
    return notFound();
  }

  if (!tour) {
    return notFound();
  }

  return <TourDetailClient tour={tour} />;
}
