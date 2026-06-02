"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  IoLocationOutline,
  IoHeartOutline,
  IoHeart
} from "@/components/icons/solar";
import { useFeaturedLocations, useLocationCategories } from "../hooks/use-locations";
import { useFavoriteToggle } from "@/hooks/useFavorite";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getHomeLocationImage } from "../utils/home-image-fallbacks";
import { useFavoriteIdsQuery } from "@/features/favorites/hooks/useFavoritesQuery";

// Dynamically import the Live Leaflet Mini Map with SSR disabled
const LeafletMiniMap = dynamic(
  () => import("./LeafletMiniMap"),
  { ssr: false }
);

const FEATURED_MAIN_INTERVAL_MS = 9200;
const FEATURED_SIDE_INTERVAL_MS = 10400;
const FEATURED_COMPACT_INTERVAL_MS = 11800;
const imageMotion = {
  initial: { opacity: 0, scale: 1.035, filter: "blur(3px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 1.02, filter: "blur(2px)" },
  transition: { duration: 1.15, ease: [0.16, 1, 0.3, 1] as const },
};

const copyMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

/**
 * Subcomponent to represent a Heart Favorite Toggle Button.
 */
const FavoriteToggleBtn = ({ id, isFavorite = false }: { id: number; isFavorite?: boolean }) => {
  const t = useTranslations();
  const { isAuthenticated } = useAuthStore();
  const toggleMutation = useFavoriteToggle({ location_id: id });

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(t("common.favorite.login_required"));
      return;
    }

    try {
      await toggleMutation.mutateAsync(isFavorite);
      if (isFavorite) {
        toast.success(t("common.favorite.remove_success"));
      } else {
        toast.success(t("common.favorite.add_success"));
      }
    } catch {
      toast.error(t("common.favorite.error"));
    }
  };

  return (
    <button
      suppressHydrationWarning
      onClick={handleFavoriteClick}
      className="z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-white/92 text-on-surface shadow-md backdrop-blur-md transition-all hover:border-primary/30 hover:text-primary active:scale-90"
    >
      {isFavorite ? (
        <IoHeart className="text-xl text-red-500" />
      ) : (
        <IoHeartOutline className="text-xl text-on-surface-subtle transition-colors hover:text-red-500" />
      )}
    </button>
  );
};

const FeaturedLocations = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);
  const t = useTranslations();
  const { isAuthenticated } = useAuthStore();
  const { elementRef, isVisible } = useScrollReveal();
  const { locations, isLoading, isFetching } = useFeaturedLocations(activeCategoryId);
  const { categories } = useLocationCategories();
  const { data: favoriteIds } = useFavoriteIdsQuery(isAuthenticated);
  const favoriteLocationIds = new Set(favoriteIds?.location_ids ?? []);
  const showSkeleton = isLoading && (!locations || locations.length === 0);
  const locationCount = locations?.length ?? 0;

  const getCategoryName = (category: unknown): string => {
    if (!category) return "";
    return typeof category === "object" && "name" in category
      ? String((category as { name?: string }).name ?? "")
      : String(category);
  };

  // State index variables to cycle through locations
  const [activeLocIdx1, setActiveLocIdx1] = useState(0);
  const [activeLocIdx2, setActiveLocIdx2] = useState(1);
  const [activeLocIdx3, setActiveLocIdx3] = useState(2);

  // Reset indices on list category filtering
  useEffect(() => {
    setActiveLocIdx1(0);
    setActiveLocIdx2(locationCount > 1 ? 1 : 0);
    setActiveLocIdx3(locationCount > 2 ? 2 : 0);
  }, [activeCategoryId, locationCount]);

  // Slideshow for Card 1
  useEffect(() => {
    if (!locations || locations.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveLocIdx1((prev) => (prev + 1) % Math.min(locations.length, 20));
    }, FEATURED_MAIN_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [locations]);

  // Slideshow for Card 2
  useEffect(() => {
    if (!locations || locations.length <= 2) return;
    const interval = window.setInterval(() => {
      setActiveLocIdx2((prev) => {
        const next = prev + 1;
        const limit = Math.min(locations.length, 20);
        return next >= limit ? 1 : next;
      });
    }, FEATURED_SIDE_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [locations]);

  // Slideshow for Card 3
  useEffect(() => {
    if (!locations || locations.length <= 3) return;
    const interval = window.setInterval(() => {
      setActiveLocIdx3((prev) => {
        const next = prev + 1;
        const limit = Math.min(locations.length, 20);
        return next >= limit ? 2 : next;
      });
    }, FEATURED_COMPACT_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [locations]);

  // Active items in Bento Grid slots
  const loc1 = locations?.[activeLocIdx1];
  const loc2 = locations?.[activeLocIdx2];
  const loc3 = locations?.[activeLocIdx3];

  return (
    <section className="overflow-hidden bg-transparent py-8 font-sans">
      <div className="container mx-auto px-4" ref={elementRef}>
        {/* Header */}
        <div className={`flex justify-between items-end mb-6 gap-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="max-w-2xl">
            <div className={`flex items-center gap-3 mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <span className="w-8 h-[2px] bg-primary/40" />
              <span className="text-xs font-semibold uppercase tracking-normal text-primary">
                {t("home.featured_locations.tagline")}
              </span>
            </div>
            <h2 className={`text-[32px] font-semibold leading-[1.1] text-on-surface transition-all duration-700 delay-200 md:text-[44px] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              {t("home.featured_locations.title_prefix")} <span className="text-primary underline decoration-primary/30 underline-offset-8">{t("home.featured_locations.title_highlight")}</span>
            </h2>
          </div>
          <Link
            href={ROUTES.LOCATIONS}
            className={`mb-2 flex items-center rounded-full border border-border bg-white px-6 py-3 text-[14px] font-semibold text-on-surface shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-[#f7f7f7] hover:text-primary ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {t("home.hot_tours.explore_more")} <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Bento Grid layout matching wireframe */}
        <div className={`relative transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Subtle premium linear progress bar for background category loading */}
          <div 
            className={`absolute -top-3 left-0 right-0 z-40 h-[2.5px] overflow-hidden bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-all duration-300 ${
              isFetching && !showSkeleton ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
          >
            <div className="w-full h-full bg-primary animate-pulse" />
          </div>

          {showSkeleton ? (
            // Skeleton Loader matching the Bento Grid structure
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Top Row Large Skeleton */}
              <div className="relative flex h-[440px] flex-col justify-between rounded-[28px] border border-border bg-[#f7f7f7] p-8 animate-pulse lg:col-span-12">
                <div className="absolute top-6 right-6 flex gap-2">
                  <div className="h-9 w-16 rounded-full bg-[#ececec]" />
                  <div className="h-9 w-24 rounded-full bg-[#ececec]" />
                  <div className="h-9 w-24 rounded-full bg-[#ececec]" />
                </div>
                <div className="max-w-xl mt-auto">
                  <div className="mb-4 h-6 w-32 rounded-full bg-[#ececec]" />
                  <div className="mb-3 h-12 w-3/4 rounded bg-[#ececec]" />
                  <div className="h-4 w-1/2 rounded bg-[#ececec]" />
                </div>
              </div>

              {/* Bottom Row Skeletons */}
              <div className="flex h-[300px] flex-col justify-end rounded-[28px] border border-border bg-[#f7f7f7] p-6 animate-pulse lg:col-span-5">
                <div className="mb-3 h-4 w-16 rounded bg-[#ececec]" />
                <div className="mb-2 h-7 w-3/4 rounded bg-[#ececec]" />
                <div className="h-4 w-1/2 rounded bg-[#ececec]" />
              </div>

              <div className="flex h-[300px] flex-col justify-between rounded-[28px] border border-border bg-[#f7f7f7] p-6 animate-pulse lg:col-span-3">
                <div className="flex justify-between">
                  <div className="h-6 w-16 rounded-full bg-[#ececec]" />
                  <div className="h-8 w-8 rounded-full bg-[#ececec]" />
                </div>
                <div className="h-[90px] w-full rounded-xl bg-[#ececec]" />
              </div>

              <div className="flex h-[300px] flex-col justify-between rounded-[28px] border border-border bg-[#f7f7f7] p-6 animate-pulse lg:col-span-4">
                <div className="mb-2 h-4 w-28 rounded bg-[#ececec]" />
                <div className="h-[120px] w-full rounded-xl bg-[#ececec]" />
                <div className="ml-auto h-9 w-24 rounded-lg bg-[#ececec]" />
              </div>
            </div>
          ) : loc1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Card 1: Top Row Large Card (Full width) */}
              <div className="lg:col-span-12 relative overflow-hidden rounded-3xl border border-border bg-[#0c0c0c] h-[420px] md:h-[480px] group shadow-2xl transition-all duration-500">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`featured-main-image-${loc1.id}`}
                    className="absolute inset-0 h-full w-full"
                    {...imageMotion}
                  >
                    <Image
                      src={getHomeLocationImage(loc1.thumbnail, loc1.images, loc1.id)}
                      alt={loc1.name}
                      fill
                      sizes="100vw"
                      className="absolute inset-0 z-0 object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                <div className={`absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/80 to-black/10 md:bg-gradient-to-r md:via-black/60 md:to-transparent ${isFetching ? "backdrop-blur-[0.5px]" : ""}`} />

                  {/* Left Side: Main location info */}
                  <motion.div
                    key={`featured-main-copy-${loc1.id}`}
                    className="absolute bottom-6 left-6 z-20 max-w-xl md:bottom-auto md:left-12 md:top-1/2 md:-translate-y-1/2"
                    {...copyMotion}
                  >
                    <span className="mb-5 inline-block rounded-full border border-primary/40 bg-primary/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-normal text-white shadow-sm">
                      ⭐ {t("home.trending")} • {getCategoryName(loc1.category) || t("home.featured_locations.hot_spot")}
                    </span>
                    
                    <Link href={ROUTES.LOCATION_DETAIL(loc1.slug)}>
                      <h3 className="text-white text-[28px] md:text-[40px] font-black leading-[1.15] mb-4 drop-shadow-2xl hover:text-primary transition-colors duration-300">
                        {loc1.name}
                      </h3>
                    </Link>
                    
                    <p className="mb-6 line-clamp-3 text-[13px] leading-relaxed text-white/82 drop-shadow md:text-[14px]">
                      {loc1.description || t("home.featured_locations.default_description")}
                    </p>

                    <div className="flex items-center gap-2 text-white/95 text-[13px] font-bold">
                      <IoLocationOutline className="text-primary text-[18px]" />
                      <span>{loc1.address || t("home.featured_locations.default_address")}</span>
                    </div>
                  </motion.div>

                  {/* Bottom Right: Review / rating spotlight overlay box */}
                  <motion.div
                    key={`featured-main-rating-${loc1.id}`}
                    className="absolute bottom-6 right-6 z-20 hidden max-w-xs items-center gap-4 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur-md md:flex"
                    {...copyMotion}
                  >
                    <div className="w-11 h-11 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-white text-[16px] font-black">
                      {parseFloat(loc1.avg_rating || "5.0").toFixed(1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="truncate text-xs font-semibold tracking-normal text-on-surface">{t("home.featured_locations.title_highlight")}</h5>
                      <p className="mt-0.5 text-xs tracking-normal text-on-surface-subtle">{loc1.review_count || 12} {t("home.featured_locations.reviews_label")}</p>
                    </div>
                    <Link
                      href={ROUTES.LOCATION_DETAIL(loc1.slug)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-[#f7f7f7] text-on-surface transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      →
                    </Link>
                  </motion.div>

                {/* Top Right: Category filtering tabs inside card */}
                <div className="absolute top-6 right-6 flex flex-wrap gap-2.5 z-30 max-w-full">
                  <button
                    onClick={() => setActiveCategoryId(undefined)}
                    className={`cursor-pointer rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-normal shadow-md transition-all duration-300 ${
                      activeCategoryId === undefined
                        ? "bg-primary text-white"
                        : "bg-surface-container border border-border text-on-surface-subtle hover:bg-surface-container-high hover:text-on-surface"
                    }`}
                  >
                    {t("home.filters.all")}
                  </button>
                  {categories.slice(0, 3).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryId(cat.id)}
                      className={`cursor-pointer rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-normal shadow-md transition-all duration-300 ${
                        activeCategoryId === cat.id
                          ? "bg-primary text-white"
                          : "bg-surface-container border border-border text-on-surface-subtle hover:bg-surface-container-high hover:text-on-surface"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 2: Bottom Row Left Card (Medium Width) */}
              {loc2 ? (
                <div className="group relative flex h-[300px] cursor-pointer flex-col justify-end overflow-hidden rounded-3xl border border-border bg-[#0c0c0c] p-6 shadow-lg transition-all duration-500 hover:border-primary/30 hover:shadow-[0_20px_40px_rgba(255,56,92,0.12)] md:p-8 lg:col-span-5">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={`featured-side-image-${loc2.id}`}
                      className="absolute inset-0"
                      {...imageMotion}
                    >
                      <Image
                        src={getHomeLocationImage(loc2.thumbnail, loc2.images, loc2.id)}
                        alt={loc2.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 450px"
                        className="z-0 object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className={`absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent ${isFetching ? "backdrop-blur-[0.5px]" : ""}`} />

                    {/* Favorite button top right inside fade container */}
                    <div className="absolute top-5 right-5 z-20">
                      <FavoriteToggleBtn id={loc2.id} isFavorite={favoriteLocationIds.has(loc2.id)} />
                    </div>

                    {/* Content overlay */}
                    <motion.div
                      key={`featured-side-copy-${loc2.id}`}
                      className="relative z-20 w-full p-6 md:p-8"
                      {...copyMotion}
                    >
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-normal text-primary">
                        {getCategoryName(loc2.category) || t("home.featured_locations.hot_spot")}
                      </span>
                      <Link href={ROUTES.LOCATION_DETAIL(loc2.slug)}>
                        <h4 className="text-white text-[20px] font-bold mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
                          {loc2.name}
                        </h4>
                      </Link>
                      <p className="mt-1 flex truncate items-center gap-1.5 text-xs font-medium text-white/78">
                        <IoLocationOutline className="text-primary/80 text-[14px]" />
                        <span>{loc2.address}</span>
                      </p>

                      {/* Navigation dot slider indicators (matching wireframe) */}
                      {locations && locations.length > 1 && (
                        <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-border/40 w-full z-20">
                          {Array.from({ length: Math.min(locations.length - 1, 5) }).map((_, idx) => {
                            const targetIdx = idx + 1;
                            return (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setActiveLocIdx2(targetIdx);
                                }}
                                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                                  activeLocIdx2 === targetIdx ? "w-6 bg-primary" : "w-1.5 bg-[#262626] hover:bg-primary/50"
                                }`}
                              />
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                </div>
              ) : (
                <div className="lg:col-span-5 h-[300px] bg-[#0c0c0c] rounded-3xl border border-dashed border-border" />
              )}

              {/* Card 3: Bottom Row Middle Card (Narrower Card) */}
              {loc3 ? (
                <div className="group relative flex h-[300px] cursor-pointer flex-col justify-between overflow-hidden rounded-[28px] border border-border bg-[#fafafa] p-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)] transition-all duration-500 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] lg:col-span-3">
                  <motion.div
                    key={`featured-compact-copy-${loc3.id}`}
                    className={`flex h-full w-full flex-col justify-between ${isFetching ? "backdrop-blur-[0.5px]" : ""}`}
                    {...copyMotion}
                  >
                    {/* Top layout parts */}
                    <div className="flex justify-between items-start w-full relative z-20">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {getCategoryName(loc3.category) || t("home.featured_locations.title_highlight")}
                      </span>
                      <FavoriteToggleBtn id={loc3.id} isFavorite={favoriteLocationIds.has(loc3.id)} />
                    </div>

                    {/* Middle Layout parts */}
                    <div className="my-3 relative z-20">
                      <Link href={ROUTES.LOCATION_DETAIL(loc3.slug)}>
                        <h4 className="text-on-surface text-[15px] font-bold group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-1">
                          {loc3.name}
                        </h4>
                      </Link>
                      <p className="mt-1 truncate text-xs text-on-surface-subtle">{loc3.address}</p>
                    </div>

                    {/* Bottom Layout parts: Small image block container at the bottom with Slideshow Support */}
                    <div className="relative w-full h-[110px] rounded-2xl overflow-hidden mt-auto border border-border group-hover:border-primary/20 transition-all duration-500">
                      <AnimatePresence initial={false}>
                        <motion.div
                          key={`featured-compact-image-${loc3.id}`}
                          className="absolute inset-0"
                          {...imageMotion}
                        >
                          <Image
                            src={getHomeLocationImage(loc3.thumbnail, loc3.images, loc3.id)}
                            alt={loc3.name}
                            fill
                            sizes="220px"
                            className="absolute inset-0 z-0 object-cover"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="lg:col-span-3 h-[300px] bg-[#0c0c0c] rounded-3xl border border-dashed border-border" />
              )}

              {/* Card 4: Bottom Row Right Card (Map View coordinate spotlight card with Live Leaflet Mini Map) */}
              <div className="group relative flex h-[300px] flex-col justify-between overflow-hidden rounded-[28px] border border-border bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)] transition-all duration-500 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] lg:col-span-4">
                {/* Card Title */}
                <div className="relative z-10">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-normal text-primary">
                    {t("home.featured_locations.tagline")}
                  </span>
                  <h4 className="text-[15px] font-semibold tracking-wide text-on-surface">
                    {t("home.featured_locations.map_title")}
                  </h4>
                </div>

                {/* Middle coordinate canvas with Live Leaflet Mini Map */}
                <div className="relative w-full h-[120px] my-3 border border-border/40 rounded-2xl overflow-hidden shadow-inner">
                  <LeafletMiniMap />
                </div>

                {/* Bottom explore map view button */}
                <div className="flex justify-end items-center mt-auto w-full relative z-10">
                  <Link
                    href={ROUTES.LOCATIONS}
                    className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-normal text-white shadow-md transition-all duration-300 hover:bg-primary-hover active:scale-95"
                  >
                    {t("home.hot_tours.explore_more")} <span className="text-[12px]">→</span>
                  </Link>
                </div>
              </div>

            </div>
          ) : (
            // Fallback empty state
            <div className="w-full py-20 flex flex-col items-center justify-center text-on-surface-subtle bg-surface-container/30 rounded-xl border border-dashed border-border">
              <p className="text-[16px] font-medium">{t("home.featured_locations.no_data")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(FeaturedLocations);
