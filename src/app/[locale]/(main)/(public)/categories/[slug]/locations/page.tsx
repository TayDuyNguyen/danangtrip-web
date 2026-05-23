import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { locationService } from "@/services/location.service";
import { extractItems } from "@/utils";
import { Category } from "@/types";
import CategoryLocationListClient from "@/features/locations/category/components/CategoryLocationListClient";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: "locations" });
  
  let categoryName = resolvedParams.slug;
  try {
    const res = await locationService.getCategories();
    if (res.success && res.data) {
      const categoryList = extractItems<Category>(res.data);
      const cat = categoryList.find(c => c.slug === resolvedParams.slug);
      if (cat) {
        categoryName = cat.name;
      }
    }
  } catch {
    // fallback to slug capitalized if API fails
    categoryName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
  }

  return {
    title: `${categoryName} | Đà Nẵng Trip`,
    description: t("discovery.subtitle", { count: 0 }).replace("{count}", ""),
  };
}

export default async function CategoryLocationsPage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <div className="design-page layout-main-shell">
      <div className="design-container pt-8">
        <Suspense fallback={
          <div className="w-full py-16 space-y-8 animate-pulse">
            <div className="h-48 bg-neutral-900 rounded-2xl border border-neutral-800" />
            <div className="h-10 w-2/3 bg-neutral-900 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
              <div className="h-96 bg-neutral-900 rounded-xl border border-neutral-800" />
              <div className="space-y-4">
                <div className="h-12 bg-neutral-900 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-4/5 bg-neutral-900 rounded-xl border border-neutral-800" />
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
