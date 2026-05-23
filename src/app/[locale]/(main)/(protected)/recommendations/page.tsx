import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import RecommendationGrid from "@/features/recommendations/components/RecommendationGrid";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recommendations" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function RecommendationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "recommendations" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 min-h-screen pb-24">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-on-surface-subtle font-medium animate-in fade-in slide-in-from-top-2 duration-700" aria-label="breadcrumb">
        <Link href={ROUTES.HOME} className="hover:text-primary transition-colors">
          {t("breadcrumb_home")}
        </Link>
        <span className="mx-2 text-border">/</span>
        <span className="font-semibold text-foreground">{t("title")}</span>
      </nav>

      {/* Page Hero */}
      <div className="flex flex-col gap-4 text-left animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1.1]">
          {t("title")}
        </h1>
        <p className="text-lg text-on-surface-subtle max-w-2xl font-medium leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Recommendation Results Grid */}
      <RecommendationGrid />
    </div>
  );
}
