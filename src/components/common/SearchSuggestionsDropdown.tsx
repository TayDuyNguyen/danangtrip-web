"use client";

import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoSearchOutline, IoStar } from "@/components/icons/solar";
import { cn } from "@/utils/string";
import type { SearchSuggestionsData, SearchSuggestionItem } from "@/types/search-suggestion.types";

interface SearchSuggestionsDropdownProps {
  isOpen: boolean;
  isLoading: boolean;
  isError?: boolean;
  suggestions?: SearchSuggestionsData;
  query: string;
  selectedIndex: number;
  onSelect: (item: SearchSuggestionItem) => void;
  onViewAll: () => void;
  floating?: boolean;
  anchorRef?: RefObject<HTMLElement | null>;
}

export const SearchSuggestionsDropdown = ({
  isOpen,
  isLoading,
  isError,
  suggestions,
  query,
  selectedIndex,
  onSelect,
  onViewAll,
  floating = false,
  anchorRef,
}: SearchSuggestionsDropdownProps) => {
  const t = useTranslations("search");
  const [floatingRect, setFloatingRect] = useState<{ left: number; top: number; width: number } | null>(null);

  useEffect(() => {
    if (!isOpen || !floating || !anchorRef?.current) {
      setFloatingRect(null);
      return;
    }

    const updateRect = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportPadding = 16;
      const width = Math.min(rect.width, window.innerWidth - viewportPadding * 2);
      const left = Math.min(Math.max(rect.left, viewportPadding), window.innerWidth - width - viewportPadding);

      setFloatingRect({
        left,
        top: rect.bottom + 14,
        width,
      });
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [anchorRef, floating, isOpen]);

  if (!isOpen) return null;

  const totalItems = suggestions?.total || 0;

  const renderSection = (titleKey: string, sectionItems: SearchSuggestionItem[], startIndex: number) => {
    if (sectionItems.length === 0) return null;

    return (
      <div className="py-2">
        <h3 className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-subtle">
          {t(titleKey)}
        </h3>
        {sectionItems.map((item, idx) => {
          const globalIdx = startIndex + idx;
          const isSelected = selectedIndex === globalIdx;

          return (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => onSelect(item)}
              className={cn(
                "mx-2 flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200",
                isSelected
                  ? "scale-[1.01] border border-primary/20 bg-[#fff4f6] shadow-sm"
                  : "hover:bg-[#f7f7f7]"
              )}
            >
              {item.type === "keyword" ? (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-[#f7f7f7] text-primary">
                  <IoSearchOutline className="text-[18px]" />
                </div>
              ) : (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border bg-[#f7f7f7]">
                  <Image
                    src={item.thumbnail || "/images/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between gap-2">
                  <h4 className="truncate text-[15px] font-semibold text-on-surface">{item.title}</h4>
                  {item.rating > 0 && (
                    <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#f7f7f7] px-2 py-0.5 text-xs text-amber-500">
                      <IoStar />
                      <span className="font-semibold text-on-surface">{item.rating}</span>
                    </div>
                  )}
                </div>
                <p className="truncate text-sm text-on-surface-subtle">
                  {item.type === "keyword"
                    ? item.subtitle
                    : (
                      <>
                        {item.type === "location"
                          ? t("suggestions.views", { count: item.viewCount })
                          : t("suggestions.bookings", { count: item.bookingCount || 0 })}
                        <span className="mx-2 opacity-30">•</span>
                        {item.subtitle}
                      </>
                    )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 p-4 animate-pulse">
          <div className="space-y-3">
            <div className="h-4 w-1/4 rounded-full bg-[#f1f1f1]" />
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 p-2">
                <div className="h-14 w-14 rounded-xl bg-[#f1f1f1]" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 rounded-full bg-[#f1f1f1]" />
                  <div className="h-4 w-1/2 rounded-full bg-[#f1f1f1]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center gap-3 p-8 text-center text-on-surface-subtle">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-[#f7f7f7] text-primary">
            <IoSearchOutline className="text-[22px]" />
          </div>
          <p className="text-lg font-semibold text-on-surface">{t("suggestions.error")}</p>
        </div>
      );
    }

    if (totalItems === 0) {
      return (
        <div className="flex flex-col items-center gap-3 p-10 text-center text-on-surface-subtle">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-[#f7f7f7]">
            <IoSearchOutline className="text-[22px] opacity-50" />
          </div>
          <p className="text-lg font-semibold text-on-surface">{t("suggestions.no_results")}</p>
        </div>
      );
    }

    return (
      <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
        {renderSection("suggestions.keywords_title", suggestions?.keywords || [], 0)}
        {renderSection("suggestions.locations_title", suggestions?.locations || [], suggestions?.keywords?.length || 0)}
        {renderSection(
          "suggestions.tours_title",
          suggestions?.tours || [],
          (suggestions?.keywords?.length || 0) + (suggestions?.locations?.length || 0)
        )}
      </div>
    );
  };

  const isViewAllSelected = selectedIndex === totalItems;
  const viewAllSelectedStyles = "border-primary bg-[#ff385c] text-white shadow-[0_10px_24px_rgba(255,56,92,0.22)]";
  const viewAllDefaultStyles = "border-border text-on-surface hover:border-primary/30 hover:bg-[#fff4f6]";

  const dropdown = (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_24px_60px_rgba(0,0,0,0.16)]",
        floating ? "fixed z-[9999]" : "absolute left-0 right-0 top-[calc(100%+14px)] z-50"
      )}
      style={
        floating && floatingRect
          ? {
              left: floatingRect.left,
              top: floatingRect.top,
              width: floatingRect.width,
            }
          : undefined
      }
      onMouseDown={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
    >
      <div className="py-2">
        {renderContent()}

        <div
          onClick={onViewAll}
          className={cn(
            "mx-4 mb-4 mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-4 transition-all duration-200",
            isViewAllSelected ? viewAllSelectedStyles : viewAllDefaultStyles
          )}
        >
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              isViewAllSelected ? "bg-white/20" : "bg-[#f7f7f7]"
            )}
          >
            <IoSearchOutline className="text-[18px]" />
          </div>
          <span className="font-semibold">{t("suggestions.view_all", { query })}</span>
        </div>
      </div>
    </div>
  );

  if (floating && floatingRect && typeof document !== "undefined") {
    return createPortal(dropdown, document.body);
  }

  return dropdown;
};
