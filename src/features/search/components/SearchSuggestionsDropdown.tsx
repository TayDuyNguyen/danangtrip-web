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

  // Highlight matching characters in suggestions
  const highlightMatch = (text: string, match: string) => {
    if (!match.trim()) return <span>{text}</span>;
    
    // Simple case-insensitive match
    const regex = new RegExp(`(${match.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <span key={i} className="text-[#f1bb9d] font-bold">
              {part}
            </span>
          ) : (
            <span key={i} className="text-white">
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
        "absolute top-full left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl glass-retro border border-[#8b6a55]/30 shadow-2xl custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-300",
        className
      )}
    >
      <div className="p-2 space-y-1">
        {isQueryEmpty ? (
          /* Render Search History when query is empty */
          history.length > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-low/20 mb-1">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                  <UilHistory size={12} className="text-primary" />
                  {t("trending.history_title")}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearHistory();
                  }}
                  className="text-[10px] font-black text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                >
                  <UilTrashAlt size={10} />
                  {t("filters.reset")}
                </button>
              </div>
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="w-full flex items-center justify-between rounded-lg hover:bg-surface-container-high/60 transition-colors group"
                >
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="flex-grow text-left flex items-center gap-3 px-3 py-2 text-sm font-semibold text-white/90 cursor-pointer"
                  >
                    <UilHistory size={14} className="text-on-surface-variant/40 shrink-0" />
                    <span className="truncate">{item}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveHistory(item);
                    }}
                    className="p-2 text-on-surface-variant/50 hover:text-red-400 transition-colors mr-1 cursor-pointer"
                    aria-label="Remove search history item"
                  >
                    <UilTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-on-surface-variant/50 italic">
              {t("suggestions.loading_trending")}
            </div>
          )
        ) : (
          /* Autocomplete suggestions */
          isLoading ? (
            <div className="px-4 py-3 text-sm text-on-surface-variant/70 italic flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              {t("suggestions.loading")}
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="px-3 py-1.5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest border-b border-border-low/20 mb-1">
                {t("suggestions.locations_title")}
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelect(item)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-high/60 transition-colors text-sm font-semibold group cursor-pointer"
                >
                  <UilSearch size={16} className="text-on-surface-variant/50 group-hover:text-primary transition-colors shrink-0" />
                  <span className="truncate">{highlightMatch(item, query)}</span>
                </button>
              ))}
            </>
          ) : query.trim().length >= 2 ? (
            <div className="px-4 py-3 text-sm text-on-surface-variant/60">
              {t("suggestions.no_results")}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-on-surface-variant/60">
              {t("suggestions.min_chars")}
            </div>
          )
        )}
      </div>
    </div>
  );
}
