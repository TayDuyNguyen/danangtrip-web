import NearbyClient from "@/features/locations/nearby/components/NearbyClient";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "locations" });

  return {
    title: t("nearby.meta_title"),
    description: t("nearby.meta_description"),
  };
}

export default async function NearbyPage({ params }: PageProps) {
  const { locale } = await params;
  
  return <NearbyClient locale={locale} />;
}
