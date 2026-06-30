import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProfileLayoutWrapper } from "@/features/profile/components/ProfileLayoutWrapper";
import { SettingsHub } from "@/features/profile/components/SettingsHub";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProfileLayoutWrapper breadcrumbs={[{ labelKey: "breadcrumb.settings", href: "/settings" }]}>
      <SettingsHub />
    </ProfileLayoutWrapper>
  );
}
