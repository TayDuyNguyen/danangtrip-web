"use client";

import { memo, type FormEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useWeather } from "@/hooks/use-weather";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";
import { useClickOutside } from "@/hooks/use-click-outside";
import { SearchSuggestionsDropdown } from "@/components/common/SearchSuggestionsDropdown";
import { Select, type SelectOption } from "@/components/ui";
import {
  IoLocationOutline,
  IoSearchOutline,
  IoFlashOutline,
} from "@/components/icons/solar";
import type { SearchSuggestionItem } from "@/types/search-suggestion.types";
import IntroScene from "./IntroScene";

const Hero = () => {
  const t = useTranslations();
  const router = useRouter();
  const { weather } = useWeather();

  const searchOptions: SelectOption[] = [
    { value: "all", label: t("home.search_type_all") },
    { value: "location", label: t("home.search_type_location") },
    { value: "tour", label: t("home.search_type_tour") },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SelectOption>(searchOptions[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeScene, setActiveScene] = useState(1);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const searchContainerRef = useRef<HTMLFormElement>(null);
  useClickOutside(searchContainerRef, () => setIsDropdownOpen(false));

  const { suggestions, isLoading, isError, isEnabled } = useSearchSuggestions(
    searchQuery,
    String(searchType.value),
  );

  const flatSuggestions: SearchSuggestionItem[] = [];
  if (suggestions) {
    flatSuggestions.push(...suggestions.locations, ...suggestions.tours);
  }
  const totalItems = flatSuggestions.length;

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const handleSearch = () => {
    const normalizedQuery = searchQuery.trim();
    setIsDropdownOpen(false);
    router.push(
      `${ROUTES.SEARCH}?q=${encodeURIComponent(normalizedQuery)}&type=${searchType.value}`,
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSelectSuggestion = (item: SearchSuggestionItem) => {
    setIsDropdownOpen(false);
    router.push(
      `${ROUTES.SEARCH}?q=${encodeURIComponent(item.title)}&type=${item.type}`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        isDropdownOpen &&
        isEnabled &&
        selectedIndex >= 0 &&
        selectedIndex < totalItems
      ) {
        handleSelectSuggestion(flatSuggestions[selectedIndex]);
        return;
      }
      handleSearch();
      return;
    }

    if (!isDropdownOpen || !isEnabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems));
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  return (
    <section className="relative overflow-hidden px-3 pb-8 pt-3 sm:px-4">
      <div className="container">
        <div className="relative min-h-[640px] overflow-hidden rounded-[32px] border border-border bg-black shadow-[0_30px_90px_rgba(0,0,0,0.18)] md:min-h-[720px]">
          <IntroScene
            images={[
              "/images/intro/my_khe_beach.png",
              "/images/intro/dragon_bridge.png",
              "/images/intro/golden_bridge.png",
              "/images/intro/lady_buddha.png",
              "/images/intro/son_tra.png",
            ]}
            onSceneChange={setActiveScene}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-black/26 to-black/62" />

          <div className="relative z-20 flex min-h-[640px] flex-col px-5 pb-16 pt-24 sm:px-8 lg:px-12 lg:pb-[72px] lg:pt-[120px] md:min-h-[720px]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/12 px-4 py-2 text-[12px] font-semibold text-white/92 backdrop-blur-md">
                <IoFlashOutline className="text-[14px]" />
                {t("home.hero_badge")}
              </div>

              <h1 className="mt-6 max-w-2xl text-[38px] font-semibold leading-[1.05] tracking-normal text-white sm:text-[52px] lg:text-[66px]">
                {t("home.hero_search_title")}
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/82 sm:text-[16px]">
                {t("home.hero_search_subtitle")}
              </p>
            </div>

            <div className="mt-8 w-full lg:mt-10">
              <form
                ref={searchContainerRef}
                onSubmit={handleSubmit}
                className="relative z-40 mx-auto w-full max-w-5xl rounded-[32px] border border-white/40 bg-white p-2 shadow-[0_18px_42px_rgba(0,0,0,0.18)] lg:rounded-full"
              >
                <div className="grid gap-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(190px,0.75fr)_auto] lg:items-center">
                  <div className="flex min-w-0 items-center rounded-[26px] px-4 py-3 transition-colors hover:bg-[#f7f7f7] sm:px-5 lg:min-h-[72px] lg:rounded-full">
                    <div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f7f7] text-on-surface">
                      <IoLocationOutline className="text-[18px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-on-surface">
                        {t("home.hero_where_label")}
                      </p>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSearchQuery(value);
                          setSelectedIndex(-1);
                          setIsDropdownOpen(value.trim().length >= 2);
                        }}
                        onFocus={() => {
                          if (searchQuery.trim().length >= 2)
                            setIsDropdownOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={t("home.search_placeholder")}
                        className="mt-1 w-full bg-transparent text-[15px] font-medium text-on-surface outline-none placeholder:text-on-surface-subtle"
                        suppressHydrationWarning
                      />
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-[#ebebeb] px-5 py-3 transition-colors hover:bg-[#f7f7f7] lg:min-h-[72px] lg:rounded-full lg:border-l lg:border-y-0 lg:border-r-0">
                    <p className="mb-1 text-[12px] font-semibold text-on-surface">
                      {t("home.hero_type_label")}
                    </p>
                    <Select
                      variant="minimal"
                      options={searchOptions}
                      value={searchType}
                      onChange={(option) => {
                        setSearchType(option as SelectOption);
                        setSelectedIndex(-1);
                      }}
                      className="w-full"
                      containerClassName="border-none"
                      menuPortalTarget={portalTarget}
                      menuPosition="fixed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex min-h-[62px] items-center justify-center gap-2 rounded-[26px] bg-[#ff385c] px-6 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(255,56,92,0.28)] transition-all hover:bg-[#e31c5f] active:scale-[0.99] lg:min-h-[72px] lg:rounded-full lg:px-8"
                    suppressHydrationWarning
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/16 lg:h-11 lg:w-11">
                      <IoSearchOutline className="text-[18px]" />
                    </span>
                    {t("home.search_button")}
                  </button>
                </div>

                <SearchSuggestionsDropdown
                  isOpen={isDropdownOpen}
                  isLoading={isLoading}
                  isError={isError}
                  suggestions={suggestions}
                  query={searchQuery}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelectSuggestion}
                  onViewAll={handleSearch}
                  floating
                  anchorRef={searchContainerRef}
                />
              </form>

              <div className="mt-5 flex flex-col items-start justify-between gap-4 text-white/86 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2 text-[13px]">
                  <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    {t("home.hero_chip_beaches")}
                  </span>
                  <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    {t("home.hero_chip_food_tours")}
                  </span>
                  <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    {t("home.hero_chip_local_guides")}
                  </span>
                </div>

                {weather && (
                  <div className="flex items-center gap-3 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[13px] backdrop-blur-md">
                    <span className="text-lg">{weather.icon || "☀️"}</span>
                    <span>
                      {weather.temp}°C ·{" "}
                      {t(`home.weather.${weather.condition}`)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1" />
          </div>

          <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5">
            {Array.from({ length: 5 }).map((_, idx) => {
              const sceneNum = idx + 1;
              return (
                <button
                  key={sceneNum}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeScene === sceneNum
                      ? "w-8 bg-white"
                      : "w-2.5 bg-white/45"
                  }`}
                  aria-label={`Slide ${sceneNum}`}
                  suppressHydrationWarning
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);
