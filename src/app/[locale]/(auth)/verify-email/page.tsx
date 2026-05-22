import { VerifyEmailForm } from "@/features/auth";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface VerifyEmailPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    otp?: string;
    token?: string;
    email?: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "verifyEmail" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { otp, token, email } = await searchParams;

  return <VerifyEmailForm otp={otp ?? token} email={email} />;
}
