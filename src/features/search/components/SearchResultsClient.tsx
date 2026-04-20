"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SearchTabs } from "./SearchTabs";
import { SearchResultHeader } from "./SearchResultHeader";
import { SearchGrid } from "./SearchGrid";
import { SearchResultType } from "../types/search.types";
import { useSearch } from "../hooks/use-search";
import { cn } from "@/utils/string";
import { IoStar } from "react-icons/io5";

interface SearchResultsClientProps {
  initialQuery: string;
  initialType: "all" | SearchResultType;
}

function parseTypeParam(value: string | null): "all" | SearchResultType {
  if (value === "tour" || value === "location") return value;
  return "all";
}

export const SearchResultsClient = ({ initialQuery }: Omit<SearchResultsClientProps, "initialType">) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? initialQuery;
  const typeFromUrl = searchParams.get("type");
  const t = useTranslations("search");
  
  const activeType = useMemo(() => parseTypeParam(typeFromUrl), [typeFromUrl]);

  const handleTypeChange = (newType: "all" | SearchResultType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", newType);
    router.replace(`?${params.toString()}`);
  };

  const { results, isLoading, counts } = useSearch(query);

  const filteredResults = useMemo(() => {
    if (activeType === "all") return results;
    return results.filter(item => item.type === activeType);
  }, [results, activeType]);

  const handleOpenFilters = () => {
    // Phase 5: Filter Modal logic
    console.log("Open filters");
  };

  return (
    <div className="reveal-up">
      <SearchResultHeader 
        query={query} 
        count={filteredResults.length} 
        onOpenFilters={handleOpenFilters} 
      />

      <div className={cn("transition-all duration-500", query ? "opacity-100" : "opacity-0 h-0 overflow-hidden")}>
        {/* Hide results UI if count is 0 but query exists - will show Empty State instead */}
        {filteredResults.length > 0 && (
          <>
            <div className="mb-10">
              <SearchTabs 
                activeType={activeType} 
                onChange={handleTypeChange} 
                counts={counts}
              />
            </div>

            <SearchGrid 
              results={filteredResults} 
              isLoading={isLoading} 
            />
          </>
        )}
      </div>

      {/* Discovery Section (Shown when query is empty) */}
      {!query && !isLoading && (
        <div className="space-y-12 py-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-azure/10 flex items-center justify-center text-azure">
                <IoStar className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{t("discovery.title")}</h2>
                <p className="text-on-surface-subtle">{t("discovery.subtitle")}</p>
              </div>
            </div>
          </div>

          <SearchGrid 
            results={results.filter(item => item.featured).slice(0, 3)} 
            isLoading={isLoading} 
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredResults.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest rounded-[32px] border border-dashed border-border shadow-sm">
          <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl text-on-surface-subtle">🔍</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("empty.title")}</h2>
          <p className="text-on-surface-subtle max-w-md mx-auto">{t("empty.subtitle")}</p>
        </div>
      )}
    </div>
  );
};
