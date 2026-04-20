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
    <main className="min-h-screen pt-24 pb-20 bg-surface">
      <div className="container px-4 mx-auto">
        <Suspense
          fallback={<div className="min-h-[50vh] animate-pulse rounded-2xl bg-surface-container" aria-hidden />}
        >
          <SearchResultsClient initialQuery={query} />
        </Suspense>
      </div>
    </main>
  );
}
