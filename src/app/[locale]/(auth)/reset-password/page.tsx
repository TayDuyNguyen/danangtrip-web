import { ResetPasswordForm } from "@/features/auth";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface ResetPasswordPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resetPassword" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token, email } = await searchParams;

  return <ResetPasswordForm token={token} email={email} />;
}
