import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PaymentClient } from "@/features/payment/components/PaymentClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tour.payment" });

  return {
    title: t("title"),
    description: t("transaction_info"),
  };
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-surface-container-low">
      <Suspense fallback={null}>
        <PaymentClient />
      </Suspense>
    </main>
  );
}
