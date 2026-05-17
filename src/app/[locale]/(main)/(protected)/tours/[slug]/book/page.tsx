import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { tourService } from "@/services/tour.service";
import { BookingForm } from "@/features/tour/components/BookingForm";
import { BookingProgressSteps } from "@/features/tour/components/BookingProgressSteps";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "@/components/icons/solar";
import { Loading } from "@/components/ui";
import type { Metadata } from "next";
import type { Tour } from "@/types";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "tour.booking" });
  
  try {
    const response = await tourService.getDetail(slug);
    const tour = response.data;

    if (!tour) return { title: "DanangTrip" };

    return {
      title: t("title", { name: tour.name }),
      description: tour.description?.slice(0, 160),
    };
  } catch (error) {
    return { title: "DanangTrip" };
  }
}

export default async function TourBookingPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "tour.booking" });
  const queryClient = new QueryClient();

  // Prefetch tour detail
  let tour: Tour | undefined;
  try {
    const response = await tourService.getDetail(slug);
    tour = response.data;

    if (!tour) notFound();

    await queryClient.prefetchQuery({
      queryKey: ["tours", "detail", slug],
      queryFn: () => Promise.resolve(tour),
    });
  } catch (error) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-20 bg-[#080808]">
      {/* Minimal Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="design-container h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="bg-primary p-2 rounded-lg">
                <img src="/icons/explore-white.svg" alt="Explore" className="w-5 h-5" />
             </div>
             <h1 className="text-sm font-black text-on-surface truncate max-w-[200px] md:max-w-md uppercase tracking-tight">
               {t("title", { name: tour!.name })}
             </h1>
          </div>
          <Link 
            href={`/tours/${slug}`}
            className="text-[11px] font-black text-primary hover:text-white transition-all flex items-center gap-1.5 uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("back")}
          </Link>
        </div>
      </header>

      {/* Progress Desktop */}
      <div className="hidden lg:block border-b border-border/30 bg-[#0a0a0a]">
        <BookingProgressSteps currentStep={1} />
      </div>

      {/* Content */}
      <div className="design-container mt-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<Loading />}>
            <BookingForm tour={tour!} />
          </Suspense>
        </HydrationBoundary>
      </div>
    </main>
  );
}
