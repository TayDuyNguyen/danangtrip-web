import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import RecommendationGrid from "@/features/recommendations/components/RecommendationGrid";
import { ProfileLayoutWrapper } from "@/features/profile";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recommendations" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function RecommendationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProfileLayoutWrapper
      breadcrumbs={[
        { labelKey: "breadcrumb.profile", href: "/profile" },
        { labelKey: "breadcrumb.recommendations" },
      ]}
    >
      <RecommendationGrid />
    </ProfileLayoutWrapper>
  );
}
