"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { IoTimeOutline, IoPeopleOutline } from "react-icons/io5";
import { useTours } from "../hooks/use-tours";
import { formatPriceVND } from "@/utils/format";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const FeaturedTours = () => {
  const { featuredTours: tours } = useTours();
  const t = useTranslations();
  const locale = useLocale();
  const { elementRef, isVisible } = useScrollReveal(0.1);

  // Keep layout stable even if tours still loading
  // if (tours.length === 0) return null;

  return (
    <section className="py-[120px] bg-surface font-sans overflow-hidden">
      <div className="design-container" ref={elementRef}>
        <div className={`flex justify-between items-end mb-[48px] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className={`transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#8b6a55]/40" />
              <span className="text-[#8b6a55] font-black text-[12px] tracking-[0.3em] uppercase">{t("home.featured_tours.badge")}</span>
            </div>
            <h2 className="text-[32px] md:text-[40px] font-black text-white leading-tight">
              {t("home.featured_tours.title")}
            </h2>
          </div>
          <Link href={String(ROUTES.TOURS)} className={`px-6 py-3 bg-[#171717] border border-[#262626] text-[#8b6a55] text-[14px] font-bold rounded-xl shadow-sm hover:border-[#8b6a55] hover:text-white flex items-center group transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {t("common.tour.see_all")} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
          {tours.map((tour, index) => (
            <div
              key={tour.id}
              className={`bg-surface-container-lowest rounded-xl border border-[#262626] shadow-[0_15px_35px_rgba(0,0,0,0.25)] relative overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8b6a55]/10 transition-all duration-700`}
              style={{ transitionDelay: `${(index + 3) * 150}ms`, opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)" }}
            >
              {/* Thumbnail Area */}
              <div className="w-full h-[240px] relative overflow-hidden">
                <Image
                  src={tour.thumbnail || "/images/placeholder.png"}
                  alt={tour.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-[16px] left-[16px] bg-[#171717]/90 backdrop-blur-md text-[#8b6a55] font-black text-[10px] tracking-wider uppercase rounded-full px-[12px] py-[6px] shadow-sm z-10 border border-[#262626]">
                  ⭐ {t("home.trending")}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="self-start text-[10px] font-black bg-[#171717] text-[#8b6a55] rounded-full px-[10px] py-[4px] mb-4 tracking-wider uppercase border border-[#262626]">
                  {t("home.featured_tours.special_tour")}
                </div>

                <h3 className="text-[18px] font-bold text-white mb-3 line-clamp-2 min-h-[54px] group-hover:text-[#8b6a55] transition-colors">
                  {tour.name}
                </h3>

                <div className="flex items-center gap-[16px] mb-6">
                  <div className="flex items-center gap-2 text-[#a3a3a3] text-[13px] font-medium">
                    <IoTimeOutline className="text-[16px] text-[#8b6a55]/60" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#a3a3a3] text-[13px] font-medium">
                    <IoPeopleOutline className="text-[16px] text-[#8b6a55]/60" />
                    <span>{tour.max_people} {t("common.tour.slots")}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 flex justify-between items-center relative">
                  {/* Tonal Divider Fallback */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-[#262626]" />

                  {parseFloat(tour.avg_rating) > 0 && tour.review_count > 0 ? (
                    <div className="text-[13px] font-bold text-[#929852] flex items-center gap-1">
                      ★ {parseFloat(tour.avg_rating).toFixed(1)}
                    </div>
                  ) : (
                    <div />
                  )}
                  <div className="text-[18px] font-black text-[#8b6a55]">
                    {formatPriceVND(tour.price_adult, locale === 'vi' ? 'vi-VN' : 'en-US')}
                  </div>
                </div>

                {/* Button Action */}
                <Link
                  href={`${ROUTES.TOURS}?q=${encodeURIComponent(tour.name)}` as string & {}}
                  className="block w-full text-center bg-[#171717] border border-[#262626] text-white rounded-xl py-4 text-[14px] font-bold mt-6 hover:border-[#8b6a55] hover:text-[#8b6a55] transition-all shadow-[0_10px_20px_rgba(0,0,0,0.25)] active:scale-[0.98]"
                >
                  {t("common.tour.book_now")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
};

export default memo(FeaturedTours);
