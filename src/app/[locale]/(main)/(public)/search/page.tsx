import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { SearchResultsClient } from "@/features/search/components/SearchResultsClient";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: "search" });
  return {
    title: `${t("title")} - DaNangTrip`,
    description: t("description"),
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  return (
    <main className="design-page min-h-screen pb-20">
      <div className="design-container pt-8">
        <Suspense
          fallback={<div className="min-h-[50vh] animate-pulse rounded-lg bg-surface-container" aria-hidden />}
        >
          <div className="glass-shell reveal-up">
            <div className="glass-surface glass-inner rounded-lg p-4 sm:p-6">
              <SearchResultsClient initialQuery={query} />
            </div>
          </div>
        </Suspense>
      </div>
    </main>
  );
}
