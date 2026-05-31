import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import LandingHero from "@/features/tour/components/LandingHero";
import DestinationTourLandingClient from "@/features/tour/components/DestinationTourLandingClient";
import FAQSection from "@/features/tour/components/FAQSection";
import { tourService } from "@/services/tour.service";
import { extractItems } from "@/utils";
import { Metadata } from "next";
import type { Tour, TourCategory } from "@/types";

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
    tourService.getAll(filters),
    tourService.getCategories(),
    tourService.getLandingPage("da-nang").catch(() => ({ data: null })),
  ]);

  const tours = extractItems<Tour>(toursResponse?.data);
  const categories = extractItems<TourCategory>(categoriesResponse?.data);
  const landing = landingResponse?.data;

  // Use translations as fallback for landing content
  const content = landing?.content || t("landing.content");
  const faqs = (landing?.faqs || t.raw("landing.faqs")) as { question: string; answer: string }[];

  return (
    <div className="design-page min-h-screen pb-20">
      <LandingHero 
        title={landing?.hero_title || t("landing.hero_title")}
        subtitle={landing?.hero_subtitle || t("landing.hero_subtitle")}
        image={landing?.hero_image || "/images/destinations/da-nang-hero.jpg"}
        count={tours.length}
      />

      <div className="design-container mt-4">
        <DestinationTourLandingClient 
          initialTours={tours}
          categories={categories}
          destinationName="Đà Nẵng"
        />

        {/* SEO Content */}
        {content && (
          <section className="mt-20 prose prose-invert max-w-none reveal-up">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </section>
        )}

        {/* FAQ Section */}
        <FAQSection 
          title="Câu hỏi thường gặp"
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingContent locale={locale} searchParams={sParams} />
    </Suspense>
  );
}
