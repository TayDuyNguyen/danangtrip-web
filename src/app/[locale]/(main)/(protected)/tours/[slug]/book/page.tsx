import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { BookingForm } from "@/features/tour/components/BookingForm";
import { BookingProgressSteps } from "@/features/tour/components/BookingProgressSteps";
import { BookingHeaderThumbnail } from "@/features/tour/components/BookingHeaderThumbnail";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "@/components/icons/solar";
import { Loading } from "@/components/ui";
import type { Metadata } from "next";
import type { Tour } from "@/types";
import { serverApiGet } from "@/lib/server-api";
import { tourMapper } from "@/features/tour/utils/tour-mapper";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const getTour = cache(async (slug: string) => {
  return serverApiGet<Tour>(`/tours/${encodeURIComponent(slug)}`, { revalidate: 300 });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "tour.booking" });
  
  try {
    const tour = await getTour(slug);

    if (!tour) return { title: "DanangTrip" };

    return {
      title: t("title", { name: tour.name }),
      description: tour.description?.slice(0, 160),
    };
  } catch {
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
    tour = await getTour(slug);

    if (!tour) notFound();

    // Normalize image URLs (thumbnail may be http:// from local backend)
    tour = tourMapper.mapTour(tour);

    await queryClient.prefetchQuery({
      queryKey: ["tours", "detail", slug],
      queryFn: () => Promise.resolve(tour),
    });
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fafafa] pb-20">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-white/90 backdrop-blur-xl">
        <div className="design-container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <BookingHeaderThumbnail
               src={tour!.thumbnail}
               alt={tour!.name}
             />
             <h1 className="text-sm font-black text-on-surface truncate max-w-[200px] md:max-w-md uppercase tracking-tight">
               {t("title", { name: tour!.name })}
             </h1>
          </div>
          <Link 
            href={`/tours/${slug}`}
            className="flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-[11px] font-black uppercase tracking-widest text-primary transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("back")}
          </Link>
        </div>
      </header>

      {/* Progress Desktop */}
      <div className="hidden border-b border-border/30 bg-white lg:block">
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
