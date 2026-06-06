import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProfileLayoutWrapper } from "@/features/profile/components/ProfileLayoutWrapper";
import { ProfileEditFormContainer } from "@/features/profile/components/ProfileEditFormContainer";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });

  return {
    title: t("profile_edit.page_title"),
    description: t("profile_edit.description"),
  };
}

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProfileLayoutWrapper
      breadcrumbs={[{ labelKey: "breadcrumb.profile" }]}
    >
      <ProfileEditFormContainer />
    </ProfileLayoutWrapper>
  );
}
