import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProfileLayoutWrapper } from "@/features/profile/components/ProfileLayoutWrapper";
import { DeleteAccountFormContainer } from "@/features/profile/components/DeleteAccountFormContainer";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });

  return {
    title: t("delete_account.page_title"),
    description: t("delete_account.meta_description"),
  };
}

export default async function DeleteAccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProfileLayoutWrapper
      breadcrumbs={[
        { labelKey: "breadcrumb.profile", href: "/profile" },
        { labelKey: "breadcrumb.delete_account" },
      ]}
    >
      <DeleteAccountFormContainer />
    </ProfileLayoutWrapper>
  );
}
