"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  IoLocationOutline,
} from "react-icons/io5";
import { useWeather } from "../hooks/use-weather";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { Select, type SelectOption } from "@/components/ui";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";
import { SearchSuggestionsDropdown } from "@/components/common/SearchSuggestionsDropdown";
import { SearchSuggestionItem } from "@/types/search-suggestion.types";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useRef } from "react";

const Hero = () => {
  const router = useRouter();
  const { weather } = useWeather();
  const t = useTranslations();
  const searchOptions: SelectOption[] = [
    { value: "all", label: t("home.search_type_all") },
    { value: "location", label: t("home.search_type_location") },
    { value: "tour", label: t("home.search_type_tour") },
  ];

  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SelectOption>(searchOptions[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const { suggestions, isLoading, isError, isEnabled } = useSearchSuggestions(searchQuery, searchType.value as string);

  const flatSuggestions: SearchSuggestionItem[] = [];
  if (suggestions) {
    flatSuggestions.push(...suggestions.locations);
    flatSuggestions.push(...suggestions.tours);
  }
  const totalItems = flatSuggestions.length;

  useClickOutside(searchContainerRef, () => {
    setIsDropdownOpen(false);
  });

  const handleSearch = () => {
    setIsDropdownOpen(false);
    router.push(
      `${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}&type=${searchType.value}`
    );
  };

  const handleSelectSuggestion = (item: SearchSuggestionItem) => {
    setIsDropdownOpen(false);
    const detailUrl = (item.type === "location" ? `/locations/${item.slug}` : `/tours/${item.slug}`) as Parameters<typeof router.push>[0];
    router.push(detailUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen || !isEnabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalItems ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalItems));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex === -1) {
        handleSearch();
      } else if (selectedIndex === totalItems) {
        handleSearch();
      } else {
        handleSelectSuggestion(flatSuggestions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPortalTarget(document.body);
    const raf = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center font-sans border-b border-white/10">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/hero-bg.png"
          alt={t("common.accessibility.image_alt.hero")}
          fill
          className="object-cover scale-105"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/20 to-dark/10" />
      </div>

      {/* Content */}
      <div className="container relative z-40 px-4 text-center mt-[-40px]">
        <div className="mb-10">
          <p className={`text-[14px] md:text-[16px] font-bold text-white tracking-[0.4em] mb-4 uppercase drop-shadow-lg transition-all duration-1000 ${isVisible ? "opacity-90 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {t("home.hero_tagline_premium")}
          </p>
          <h1 className={`text-[48px] md:text-[64px] font-bold text-white mb-4 leading-tight drop-shadow-xl transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {t("home.hero_title")}
          </h1>
          <p className={`text-[18px] md:text-[20px] text-white/90 font-medium max-w-2xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {t("home.hero_subtitle")}
          </p>
        </div>

        {/* Search Box - Glassmorphism */}
        <div 
          ref={searchContainerRef}
          className={`relative z-30 max-w-4xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-[32px] backdrop-blur-xl bg-white/20 border border-white/30 p-2 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}
        >
          <div className="flex-1 flex items-center px-6 py-4 border-b md:border-b-0 md:border-r border-white/20">
            <IoLocationOutline className="text-2xl text-white mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                setSelectedIndex(-1);
                if (val.trim().length >= 2) {
                  setIsDropdownOpen(true);
                } else {
                  setIsDropdownOpen(false);
                }
              }}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) {
                  setIsDropdownOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder={t("home.search_placeholder")}
              className="w-full text-lg outline-none text-white placeholder-white/70 font-medium bg-transparent"
            />
          </div>
          <div className="w-full md:w-1/4 flex items-center mt-4 border-b md:border-b-0 md:border-r border-white/20">
            <Select
              variant="glass"
              options={searchOptions}
              value={searchType}
              onChange={(opt) => {
                setSearchType(opt as SelectOption);
                setSelectedIndex(-1);
              }}
              className="w-full"
              containerClassName="border-none"
              menuPortalTarget={portalTarget}
              menuPosition="fixed"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-white hover:bg-white/90 transition-all text-azure text-lg font-bold flex items-center justify-center gap-2 rounded-[24px] mt-2 md:mt-0 shadow-lg active:scale-95"
          >
            {t("home.search_button")}
          </button>

          {/* Autocomplete Dropdown */}
          <SearchSuggestionsDropdown
            isOpen={isDropdownOpen}
            isLoading={isLoading}
            isError={isError}
            suggestions={suggestions}
            query={searchQuery}
            selectedIndex={selectedIndex}
            onSelect={handleSelectSuggestion}
            onViewAll={handleSearch}
          />
        </div>
      </div>

      {/* Weather Widget */}
      {weather && (
        <div
          className={`absolute bottom-10 right-10 z-30 flex items-center gap-3 backdrop-blur-md rounded-[20px] px-[16px] py-[10px] border border-white/30 shadow-2xl transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <div className="text-2xl text-white drop-shadow-md">{weather.icon || "☀️"}</div>
          <span className="text-white font-bold text-[14px] drop-shadow-lg tracking-wide">
            {weather.temp}°C · {t(`home.weather.${weather.condition}`)}
          </span>
        </div>
      )}
    </section>
  );
};

export default memo(Hero);
