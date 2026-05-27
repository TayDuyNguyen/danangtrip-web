import { getTranslations } from "next-intl/server";
import { CartContainer } from "@/features/cart/components/CartContainer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });

  return {
    title: `${t("title")} | DaNangTrip`,
    description: t("subtitle"),
  };
}

export default function CartPage() {
  return (
    <main className="layout-main-shell min-h-screen">
      <CartContainer />
    </main>
  );
}
