"use client";

import { memo } from "react";
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

const FeaturedLocations = () => {
  const { featuredLocations: locations } = useLocations();
  const { isAuthenticated } = useAuthStore();
  const t = useTranslations();

  const categoryFilters = [
    { label: t("home.filters.all"), key: "all" },
    { label: t("home.filters.beach"), key: "beach" },
    { label: t("home.filters.culture"), key: "culture" },
    { label: t("home.filters.food"), key: "food" },
    { label: t("home.filters.entertainment"), key: "entertainment" }
  ];

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

  const scrollLeft = () => {
    const el = document.getElementById("featured-locations-scroll");
    if (el) el.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = document.getElementById("featured-locations-scroll");
    if (el) el.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (locations.length === 0) return null;

  return (
    <section className="py-[100px] bg-white text-dark font-sans overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 reveal-up">
          <div className="max-w-2xl">
            <span className="text-azure font-bold text-[14px] tracking-[0.3em] uppercase mb-4 block">
              {t("home.featured_locations.tagline")}
            </span>
            <h2 className="text-[36px] md:text-[48px] font-black leading-[1.1] mb-6">
              {t("home.featured_locations.title_prefix")} <span className="text-azure underline decoration-azure/30 underline-offset-8">{t("home.featured_locations.title_highlight")}</span>
            </h2>
          </div>
        </div>

        {/* Categories / Tabs */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar reveal-up reveal-delay-200">
          {categoryFilters.map((cat) => (
            <button
              key={cat.key}
              className={`px-8 py-3 rounded-full text-[14px] font-bold transition-all whitespace-nowrap shadow-sm hover:shadow-md ${cat.key === "all"
                  ? "bg-azure text-white shadow-azure/20"
                  : "bg-slate-50 text-slate-500 border border-slate-100 hover:bg-white"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable Container Wrapper */}
        <div className="relative group/nav reveal-up reveal-delay-400">
          {/* Navigation Buttons - Absolute Sides */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 z-30 w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 items-center justify-center text-slate-600 hover:bg-white hover:text-azure shadow-xl transition-all opacity-0 group-hover/nav:opacity-100 hidden lg:flex active:scale-90"
            aria-label="Previous"
          >
            <IoChevronBackOutline size={24} />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 z-30 w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 items-center justify-center text-slate-600 hover:bg-white hover:text-azure shadow-xl transition-all opacity-0 group-hover/nav:opacity-100 hidden lg:flex active:scale-90"
            aria-label="Next"
          >
            <IoChevronForwardOutline size={24} />
          </button>

          <div
            id="featured-locations-scroll"
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
          >
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="min-w-[300px] md:min-w-[380px] group cursor-pointer"
              >
                <Link href={`${ROUTES.LOCATIONS}/${loc.slug}`}>
                  <div className="relative aspect-3/4 rounded-[40px] overflow-hidden mb-6 shadow-xl active:scale-[0.98] transition-all">
                    <Image
                      src={loc.thumbnail || "/images/placeholder.png"}
                      alt={loc.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 300px, 380px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80" />

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleFavoriteClick(e, loc.id)}
                      className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white hover:text-red-500 transition-all z-20 group/fav active:scale-90"
                    >
                      <IoHeartOutline className="text-2xl group-hover/fav:hidden" />
                      <IoHeart className="text-2xl hidden group-hover/fav:block" />
                    </button>

                    {/* Info */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 text-white/80 text-[13px] font-medium mb-2">
                        <IoLocationOutline className="text-azure text-lg" />
                        {loc.address || "Đà Nẵng"}
                      </div>
                      <h3 className="text-white text-[24px] font-black leading-tight mb-2 drop-shadow-lg">
                        {loc.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(FeaturedLocations);
