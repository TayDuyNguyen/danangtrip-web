import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import DepartureSelectClient from "@/features/tour/components/DepartureSelectClient";
import { serverApiGet } from "@/lib/server-api";
import type { Tour } from "@/types";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

const getTour = cache(async (slug: string) => {
  return serverApiGet<Tour>(`/tours/${encodeURIComponent(slug)}`, { revalidate: 300 });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "tour" });

  try {
    const tour = await getTour(slug);

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
    tour = await getTour(slug);
  } catch {
    return notFound();
  }

  if (!tour) return notFound();

  return <DepartureSelectClient tour={tour} />;
}
