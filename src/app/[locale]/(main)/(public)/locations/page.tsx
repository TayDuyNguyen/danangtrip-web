import { Suspense } from "react";
import LocationListClient from "@/features/locations/components/LocationListClient";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: "locations" });
  return {
    title: `${t("discovery.title")} | Đà Nẵng Trip`,
    description: t("discovery.subtitle", { count: 0 }).replace("{count}", ""),
  };
}

export default async function LocationsPage() {
  return (
    <div className="design-page min-h-screen">
      <div className="design-container pt-8">
        <Suspense fallback={<div className="min-h-screen pt-32 px-12 animate-pulse bg-surface" />}>
          <div className="reveal-up">
            <LocationListClient />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
