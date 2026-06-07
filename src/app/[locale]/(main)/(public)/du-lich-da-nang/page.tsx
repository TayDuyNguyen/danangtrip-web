import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import LandingHero from "@/features/tour/components/LandingHero";
import DestinationTourLandingClient from "@/features/tour/components/DestinationTourLandingClient";
import FAQSection from "@/features/tour/components/FAQSection";
import { serverApiGet } from "@/lib/server-api";
import { Metadata } from "next";
import type { LandingPage, PaginatedResponse, Tour, TourCategory } from "@/types";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tour" });

  return {
    title: t("landing.meta_title"),
    description: t("landing.meta_description"),
    alternates: {
      canonical: `/${locale}/du-lich-da-nang`,
    },
  };
}

async function LandingContent({ locale, searchParams }: { locale: string; searchParams: Record<string, string | string[] | undefined> }) {
  const t = await getTranslations({ locale, namespace: "tour" });

  // Fallback filters for Da Nang
  const filters = {
    search: "Đà Nẵng", // Force Da Nang context
    ...searchParams,
  };

  const [toursResponse, categoriesResponse, landingResponse] = await Promise.all([
    serverApiGet<PaginatedResponse<Tour>>("/tours", {
      locale,
      params: filters,
      revalidate: 300,
    }),
    serverApiGet<TourCategory[]>("/tour-categories", { locale, revalidate: 3600 }),
    serverApiGet<LandingPage>("/landing-pages/da-nang", { locale, revalidate: 300 }).catch(() => null),
  ]);

  const tours = toursResponse.data ?? [];
  const categories = categoriesResponse;
  const landing = landingResponse;

  // Use translations as fallback for landing content
  const content = landing?.content || t("landing.content");
  const faqs = (landing?.faqs || t.raw("landing.faqs")) as { question: string; answer: string }[];

  return (
    <div className="design-page min-h-screen pb-20">
      <LandingHero 
        title={landing?.hero_title || t("landing.hero_title")}
        subtitle={landing?.hero_subtitle || t("landing.hero_subtitle")}
        image={landing?.hero_image || "/images/hero-bg.png"}
        count={tours.length}
      />

      <div className="design-container mt-4">
        <DestinationTourLandingClient 
          initialTours={tours}
          categories={categories}
          destinationName={t("landing.destination_name")}
        />

        {/* SEO Content */}
        {content && (
          <section className="mt-20 prose prose-invert max-w-none reveal-up">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </section>
        )}

        {/* FAQ Section */}
        <FAQSection 
          title={t("landing.faq_title")}
          items={faqs}
        />
      </div>
    </div>
  );
}

export default async function DaNangLandingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sParams = await searchParams;
  
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tour" });

  return (
    <Suspense
      fallback={
        <div className="design-container py-16 text-sm font-medium text-muted-foreground">
          {t("landing.loading")}
        </div>
      }
    >
      <LandingContent locale={locale} searchParams={sParams} />
    </Suspense>
  );
}
