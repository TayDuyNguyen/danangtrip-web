import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProfileLayoutWrapper } from "@/features/profile/components/ProfileLayoutWrapper";
import { PasswordChangeFormContainer } from "@/features/profile/components/PasswordChangeFormContainer";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });

  return {
    title: t("change_password.page_title"),
    description: t("change_password.meta_description"),
  };
}

export default async function PasswordPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProfileLayoutWrapper
      breadcrumbs={[
        { labelKey: "breadcrumb.profile", href: "/profile" },
        { labelKey: "breadcrumb.change_password" },
      ]}
    >
      <PasswordChangeFormContainer />
    </ProfileLayoutWrapper>
  );
}
