import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NotificationsPageClient } from "@/features/notifications/components/NotificationsPageClient";

import { ProfileLayoutWrapper } from "@/features/profile/components/ProfileLayoutWrapper";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "notifications" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function NotificationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProfileLayoutWrapper
      breadcrumbs={[
        { labelKey: "breadcrumb.profile", href: "/profile" },
        { labelKey: "breadcrumb.notifications" },
      ]}
    >
      <NotificationsPageClient />
    </ProfileLayoutWrapper>
  );
}
