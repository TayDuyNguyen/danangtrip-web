import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProfileLayoutWrapper } from "@/features/profile";
import { MyRatingsClient } from "@/features/profile";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ratings" });

  return {
    title: t("title"),
    description: t("meta_description"),
  };
}

export default async function RatingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProfileLayoutWrapper
      breadcrumbs={[
        { labelKey: "breadcrumb.profile", href: "/profile" },
        { labelKey: "breadcrumb.ratings" },
      ]}
    >
      <MyRatingsClient />
    </ProfileLayoutWrapper>
  );
}
