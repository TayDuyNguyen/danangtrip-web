import { ForgotPasswordForm } from "@/features/auth";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface ForgotPasswordPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    email?: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "forgotPassword" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const { email } = await searchParams;

  return <ForgotPasswordForm email={email} />;
}
