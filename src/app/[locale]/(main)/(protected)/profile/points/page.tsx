import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PointWalletClient } from "@/features/profile/components/PointWalletClient";
import { ProfileLayoutWrapper } from "@/features/profile";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });

  return {
    title: t("points.page_title"),
    description: t("points.meta_description"),
  };
}

export default async function PointsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProfileLayoutWrapper
      breadcrumbs={[
        { labelKey: "breadcrumb.profile", href: "/profile" },
        { labelKey: "breadcrumb.points" },
      ]}
    >
      <PointWalletClient />
    </ProfileLayoutWrapper>
  );
}
