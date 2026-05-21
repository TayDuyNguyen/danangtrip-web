import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingDetailClient } from "@/features/tour/components/BookingDetailClient";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "tour.history" });

  return {
    title: `${t("detail_title")} #${id} | DanangTrip`,
    description: t("meta_description"),
  };
}

export default async function BookingDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <BookingDetailClient id={id} />
    </div>
  );
}
