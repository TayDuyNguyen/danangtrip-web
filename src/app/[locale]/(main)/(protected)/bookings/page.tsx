import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingsHistoryClient } from "@/features/tour/components/BookingsHistoryClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tour.history" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function BookingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tour.history" });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-10 tracking-tight reveal-up">
        {t("page_title")}
      </h1>
      <BookingsHistoryClient />
    </div>
  );
}
