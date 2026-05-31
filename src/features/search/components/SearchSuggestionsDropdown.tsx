"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils/string";
import { UilSearch, UilHistory, UilTrashAlt, UilTimes } from "@iconscout/react-unicons";

interface SearchSuggestionsDropdownProps {
  suggestions: string[];
  isOpen: boolean;
  isLoading: boolean;
  onSelect: (value: string) => void;
  query: string;
  history: string[];
  onRemoveHistory: (value: string) => void;
  onClearHistory: () => void;
  className?: string;
}

export function SearchSuggestionsDropdown({
  suggestions,
  isOpen,
  isLoading,
  onSelect,
  query,
  history,
  onRemoveHistory,
  onClearHistory,
  className
}: SearchSuggestionsDropdownProps) {
  const t = useTranslations("search");

  if (!isOpen) return null;

  const isQueryEmpty = !query.trim();

  const highlightMatch = (text: string, match: string) => {
    if (!match.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${match.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="font-bold text-primary">
              {part}
            </span>
          ) : (
            <span key={i} className="text-on-surface">
              {part}
            </span>
          )
        )}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-[24px] border border-border bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)] custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200",
        className
      )}
    >
      <div className="space-y-1 p-2">
        {isQueryEmpty ? (
          history.length > 0 ? (
            <div className="space-y-1">
              <div className="mb-1 flex items-center justify-between border-b border-border px-3 py-1.5">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-subtle">
                  <UilHistory size={12} className="text-primary" />
                  {t("trending.history_title")}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearHistory();
                  }}
                  className="flex cursor-pointer items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-500 transition-colors hover:text-red-400"
                >
                  <UilTrashAlt size={10} />
                  {t("filters.reset")}
                </button>
              </div>
              {history.map((item, idx) => (
                <div key={idx} className="group flex w-full items-center justify-between rounded-[16px] transition-colors hover:bg-[#fafafa]">
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="flex-grow cursor-pointer px-3 py-2 text-left text-sm font-semibold text-on-surface"
                  >
                    <span className="flex items-center gap-3">
                      <UilHistory size={14} className="shrink-0 text-on-surface-subtle" />
                      <span className="truncate">{item}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveHistory(item);
                    }}
                    className="mr-1 cursor-pointer p-2 text-on-surface-subtle transition-colors hover:text-red-500"
                    aria-label="Remove search history item"
                  >
                    <UilTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm italic text-on-surface-subtle">{t("suggestions.loading_trending")}</div>
          )
        ) : isLoading ? (
          <div className="flex items-center gap-2 px-4 py-3 text-sm italic text-on-surface-subtle">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            {t("suggestions.loading")}
          </div>
        ) : suggestions.length > 0 ? (
          <>
            <div className="mb-1 border-b border-border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-subtle">
              {t("suggestions.locations_title")}
            </div>
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelect(item)}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-[16px] px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-[#fafafa]"
              >
                <UilSearch size={16} className="shrink-0 text-on-surface-subtle transition-colors group-hover:text-primary" />
                <span className="truncate">{highlightMatch(item, query)}</span>
              </button>
            ))}
          </>
        ) : query.trim().length >= 2 ? (
          <div className="px-4 py-3 text-sm text-on-surface-subtle">{t("suggestions.no_results")}</div>
        ) : (
          <div className="px-4 py-3 text-sm text-on-surface-subtle">{t("suggestions.min_chars")}</div>
        )}
      </div>
    </div>
  );
}
