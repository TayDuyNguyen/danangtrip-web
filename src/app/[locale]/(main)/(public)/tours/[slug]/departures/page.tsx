import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { tourService } from "@/services/tour.service";
import DepartureSelectClient from "@/features/tour/components/DepartureSelectClient";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "tour" });

  try {
    const response = await tourService.getDetail(slug);
    const tour = response.data;

    if (!tour) return { title: `${t("detail.not_found")} — ${t("detail.meta_brand")}` };

    return {
      title: `${t("departures.title")} - ${tour.name} — ${t("detail.meta_brand")}`,
    };
  } catch {
    return { title: `${t("detail.not_found")} — ${t("detail.meta_brand")}` };
  }
}

export default async function TourDeparturesPage({ params }: Props) {
  const { slug } = await params;
  let tour;
  
  try {
    const response = await tourService.getDetail(slug);
    tour = response.data;
  } catch {
    return notFound();
  }

  if (!tour) return notFound();

  return <DepartureSelectClient tour={tour} />;
}
