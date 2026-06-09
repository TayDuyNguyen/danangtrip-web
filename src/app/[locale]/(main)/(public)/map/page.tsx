import ExploreMapClient from "@/features/locations/explore/components/ExploreMapClient";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "locations" });

  return {
    title: t("explore.meta_title"),
    description: t("explore.meta_description"),
  };
}

export default async function ExploreMapPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { mode } = await searchParams;
  return (
    <ExploreMapClient
      locale={locale}
      initialMode={mode === "nearby" ? "nearby" : "explore"}
    />
  );
}
