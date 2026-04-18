"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoTimeOutline, IoPeopleOutline } from "react-icons/io5";
import { useTours } from "../hooks/use-tours";
import { formatPriceVND } from "@/utils/format";

const FeaturedTours = () => {
  const { featuredTours: tours } = useTours();
  const t = useTranslations();

  if (tours.length === 0) return null;

  return (
    <section className="py-[120px] bg-surface font-sans overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-[48px] reveal-up">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-azure/40" />
              <span className="text-azure font-black text-[12px] tracking-[0.3em] uppercase">{t("home.featured_tours.badge") || "Khám phá"}</span>
            </div>
            <h2 className="text-[32px] md:text-[40px] font-black text-dark leading-tight">
              {t("home.featured_tours.title")}
            </h2>
          </div>
          <Link href={ROUTES.TOURS} className="px-6 py-3 bg-white text-azure text-[14px] font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center group">
            {t("common.tour.see_all")} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
          {tours.map((tour, index) => (
            <div
              key={tour.id}
              className="bg-surface-container-lowest rounded-[24px] shadow-[0_15px_35px_rgba(23,28,31,0.05)] transition-all duration-500 relative overflow-hidden flex flex-col group reveal-up hover:-translate-y-2 hover:shadow-2xl hover:shadow-azure/5"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
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
                <div className="absolute top-[16px] left-[16px] bg-white/90 backdrop-blur-md text-azure font-black text-[10px] tracking-wider uppercase rounded-full px-[12px] py-[6px] shadow-sm z-10">
                  ⭐ {t("home.trending")}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="self-start text-[10px] font-black bg-azure/10 text-azure rounded-full px-[10px] py-[4px] mb-4 tracking-wider uppercase">
                  {t("home.featured_tours.special_tour")}
                </div>

                <h3 className="text-[18px] font-bold text-dark mb-3 line-clamp-2 min-h-[54px] group-hover:text-azure transition-colors">
                  {tour.name}
                </h3>

                <div className="flex items-center gap-[16px] mb-6">
                  <div className="flex items-center gap-2 text-slate-500 text-[13px] font-medium">
                    <IoTimeOutline className="text-[16px] text-azure/60" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[13px] font-medium">
                    <IoPeopleOutline className="text-[16px] text-azure/60" />
                    <span>{tour.max_people} {t("common.tour.slots")}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 flex justify-between items-center relative">
                  {/* Tonal Divider Fallback */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-slate-100/50" />


                  <div className="text-[13px] font-bold text-sun flex items-center gap-1">
                    ★ 4.8
                  </div>
                  <div className="text-[18px] font-black text-azure">
                    {formatPriceVND(tour.price_adult)}
                  </div>
                </div>

                {/* Button Action */}
                <Link
                  href={`${ROUTES.TOURS}/${tour.slug}`}
                  className="block w-full text-center bg-azure text-white rounded-xl py-4 text-[14px] font-bold mt-6 hover:bg-blue-700 transition-all shadow-[0_10px_20px_rgba(0,102,204,0.1)] hover:shadow-[0_15px_30px_rgba(0,102,204,0.2)] active:scale-[0.98]"
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
