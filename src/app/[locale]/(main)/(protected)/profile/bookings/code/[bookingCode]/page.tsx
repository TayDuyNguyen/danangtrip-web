import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingDetailClient } from "@/features/tour/components/BookingDetailClient";
import { ProfileLayoutWrapper } from "@/features/profile";

interface Props {
  params: Promise<{ locale: string; bookingCode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, bookingCode } = await params;
  const t = await getTranslations({ locale, namespace: "tour.history" });

  return {
    title: `${t("detail_title")} #${bookingCode} | DanangTrip`,
    description: t("meta_description"),
  };
}

export default async function BookingByCodePage({ params }: Props) {
  const { locale, bookingCode } = await params;
  setRequestLocale(locale);

  return (
    <ProfileLayoutWrapper
      breadcrumbs={[
        { labelKey: "breadcrumb.profile", href: "/profile" },
        { labelKey: "breadcrumb.bookings", href: "/profile/bookings" },
        { labelKey: "breadcrumb.booking_detail" },
      ]}
    >
      <BookingDetailClient bookingCode={bookingCode} />
    </ProfileLayoutWrapper>
  );
}
