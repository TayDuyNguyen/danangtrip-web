import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FavoritesPageClient } from "@/features/favorites/components/FavoritesPageClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "favorites" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function FavoritesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <FavoritesPageClient />
    </div>
  );
}
