"use client";

import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useTranslations } from "next-intl";
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoLocationOutline,
  IoHeartOutline,
  IoHeart
} from "react-icons/io5";
import { favoriteService } from "@/services/favorite.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useLocations } from "../hooks/use-locations";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const FeaturedLocations = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);
  const { featuredLocations: locations, categories, isLoading, isFetching } = useLocations(activeCategoryId);
  const { isAuthenticated } = useAuthStore();
  const t = useTranslations();
  const { elementRef, isVisible } = useScrollReveal(0.1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  // Check scroll position to show/hide buttons
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftBtn(scrollLeft > 20);
      setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [locations]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent, locId: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(t("common.favorite.login_required"));
      return;
    }

    try {
      const res = await favoriteService.addFavorite(locId);
      if (res.success) {
        toast.success(t("common.favorite.add_success"));
      } else {
        toast.error(res.message || t("common.favorite.error"));
      }
    } catch {
      toast.error(t("common.favorite.error"));
    }
  };

  return (
    <section className="py-[120px] bg-surface font-sans overflow-hidden">
      <div className="container mx-auto px-4" ref={elementRef}>
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="max-w-2xl">
            <div className={`flex items-center gap-3 mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <span className="w-8 h-[2px] bg-azure/40" />
              <span className="text-azure font-black text-[12px] tracking-[0.4em] uppercase">
                {t("home.featured_locations.tagline")}
              </span>
            </div>
            <h2 className={`text-[36px] md:text-[48px] font-black leading-[1.1] mb-8 text-dark transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              {t("home.featured_locations.title_prefix")} <span className="text-azure underline decoration-azure/30 underline-offset-8">{t("home.featured_locations.title_highlight")}</span>
            </h2>
          </div>
        </div>

        {/* Categories / Tabs */}
        <div className={`flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <button
            onClick={() => setActiveCategoryId(undefined)}
            className={`px-8 py-3 rounded-full text-[14px] font-bold transition-all whitespace-nowrap shadow-sm hover:shadow-md ${activeCategoryId === undefined
              ? "bg-azure text-white shadow-azure/20"
              : "bg-surface-container text-slate-500 border border-outline-variant hover:bg-surface-container-high"
              }`}
          >
            {t("home.filters.all")}
          </button>

          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-8 py-3 rounded-full text-[14px] font-bold transition-all whitespace-nowrap shadow-sm hover:shadow-md ${activeCategoryId === cat.id
                ? "bg-azure text-white shadow-azure/20"
                : "bg-surface-container text-slate-500 border border-outline-variant hover:bg-surface-container-high"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Carousel Container Wrapper */}
        <div className={`relative group/nav transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Navigation Buttons */}
          <div className="absolute -inset-x-4 top-[40%] -translate-y-1/2 flex justify-between items-center pointer-events-none z-30">
            <div className="w-full flex justify-between px-2">
              <button
                onClick={() => scroll("left")}
                className={`w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-outline-variant items-center justify-center text-dark hover:bg-azure hover:text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all pointer-events-auto active:scale-95 ${showLeftBtn ? "flex opacity-100 translate-x-0" : "hidden opacity-0 -translate-x-4"}`}
                aria-label={t("common.accessibility.previous")}
              >
                <IoChevronBackOutline size={20} />
              </button>

              <button
                onClick={() => scroll("right")}
                className={`w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-outline-variant items-center justify-center text-dark hover:bg-azure hover:text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all pointer-events-auto active:scale-95 ${showRightBtn && locations.length > 0 ? "flex opacity-100 translate-x-0" : "hidden opacity-0 translate-x-4"}`}
                aria-label={t("common.accessibility.next")}
              >
                <IoChevronForwardOutline size={20} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            id="featured-locations-scroll"
            key={activeCategoryId || "all"}
            className={`flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-8 transition-all duration-500 snap-x snap-mandatory ${isFetching && locations.length > 0 ? "opacity-50" : "opacity-100"}`}
          >
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[300px] md:min-w-[380px] animate-pulse">
                  <div className="aspect-3/4 rounded-[40px] bg-surface-container-high mb-6" />
                  <div className="h-6 w-3/4 bg-surface-container-high rounded-full mb-2" />
                  <div className="h-4 w-1/2 bg-surface-container-high rounded-full" />
                </div>
              ))
            ) : locations.length > 0 ? (
              locations.map((loc, index) => (
                <div
                  key={loc.id}
                  className="min-w-[300px] md:min-w-[380px] group cursor-pointer animate-reveal-up snap-start"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`${ROUTES.LOCATIONS}/${loc.slug}`}>
                    <div className="relative aspect-3/4 rounded-[40px] overflow-hidden mb-6 shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,102,204,0.15)]">
                      <Image
                        src={loc.thumbnail || "/images/placeholder.png"}
                        alt={loc.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 768px) 300px, 380px"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleFavoriteClick(e, loc.id)}
                        className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white hover:text-red-500 transition-all z-20 group/fav active:scale-90 shadow-lg"
                      >
                        <IoHeartOutline className="text-2xl group-hover/fav:hidden" />
                        <IoHeart className="text-2xl hidden group-hover/fav:block" />
                      </button>

                      {/* Info */}
                      <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                        <div className="flex items-center gap-2 text-white/90 text-[13px] font-bold mb-3 tracking-wide">
                          <IoLocationOutline className="text-azure text-lg" />
                          {loc.address || t("home.featured_locations.default_address")}
                        </div>
                        <h3 className="text-white text-[28px] font-black leading-tight mb-2 drop-shadow-2xl">
                          {loc.name}
                        </h3>
                        <div className="h-1 w-0 bg-azure transition-all duration-500 group-hover:w-16 rounded-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400 bg-surface-container/30 rounded-[40px] border border-dashed border-outline-variant animate-reveal-up">
                <IoLocationOutline size={48} className="mb-4 opacity-20" />
                <p className="text-[16px] font-medium">{t("home.featured_locations.no_data")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(FeaturedLocations);
