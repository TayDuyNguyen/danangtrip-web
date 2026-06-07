import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import CategoryLocationListClient from "@/features/locations/category/components/CategoryLocationListClient";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: "locations" });
  const categoryName = resolvedParams.slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: categoryName,
    description: t("discovery.subtitle", { count: 0 }).replace("{count}", ""),
  };
}

export default async function CategoryLocationsPage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <div className="design-page layout-main-shell">
      <div className="design-container pt-8">
        <Suspense fallback={
          <div className="w-full py-8 space-y-8 animate-pulse">
            <div className="h-48 rounded-2xl border border-border bg-[#f7f7f7]" />
            <div className="h-10 w-2/3 rounded-lg bg-[#ebebeb]" />
            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
              <div className="h-96 rounded-xl border border-border bg-[#f7f7f7]" />
              <div className="space-y-4">
                <div className="h-12 rounded-lg bg-[#ebebeb]" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-4/5 rounded-xl border border-border bg-[#f7f7f7]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        }>
          <CategoryLocationListClient slug={resolvedParams.slug} />
        </Suspense>
      </div>
    </div>
  );
}
