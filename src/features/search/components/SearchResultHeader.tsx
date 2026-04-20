"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { IoTrendingUp, IoFlashOutline } from "react-icons/io5";
import { ROUTES } from "@/config";
import { cn } from "@/utils/string";

interface SearchResultHeaderProps {
  query: string;
  count: number;
  onOpenFilters: () => void;
}

export const SearchResultHeader = ({ query, count }: SearchResultHeaderProps) => {
  const t = useTranslations("search");

  const trendingItems = [
    { id: "son_tra", isHot: true },
    { id: "asia_park", isHot: true },
    { id: "fireworks", isHot: false },
    { id: "than_tai", isHot: false },
  ];

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2 flex items-center gap-3">
            {query ? (
              <>
                <span className="text-azure">“</span>
                {query}
                <span className="text-azure">”</span>
              </>
            ) : (
              t("discovery.title")
            )}
          </h1>
          <p className="text-on-surface-subtle font-medium">
            {query 
              ? t.rich("found_results", { 
                  count, 
                  query,
                  strong: (chunks) => <strong className="text-foreground font-black">{chunks}</strong>
                }) 
              : t("discovery.subtitle")
            }
          </p>
        </div>
      </div>

      {/* Trending Section */}
      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
        <span className="text-sm font-black text-foreground uppercase tracking-widest mr-2 flex items-center gap-2">
          <IoTrendingUp className="text-azure text-xl" />
          {t("trending.title")}:
        </span>
        
        {trendingItems.map((item) => {
          const variantClasses = item.isHot 
            ? "bg-amber-50 border-amber-200 text-amber-700 shadow-amber-500/10 hover:bg-amber-100 hover:border-amber-300" 
            : "bg-surface-container-lowest border-azure/20 text-azure shadow-azure-500/5 hover:bg-azure/10 hover:border-azure/40";

          return (
            <Link
              key={item.id}
              href={`${ROUTES.SEARCH}?q=${encodeURIComponent(t(`trending.items.${item.id}`))}`}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[15px] font-black transition-all duration-300 border-2 scale-100 shadow-sm hover:scale-105",
                variantClasses
              )}
            >
              {item.isHot ? (
                <IoFlashOutline className="text-xl text-amber-500 animate-pulse" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-azure" />
              )}
              <span>{t(`trending.items.${item.id}`)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
