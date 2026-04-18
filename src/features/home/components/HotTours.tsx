"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoTimeOutline, IoPeopleOutline, IoFlame } from "react-icons/io5";
import { useTours } from "../hooks/use-tours";
import { formatPriceVND } from "@/utils/format";

const HotTours = () => {
  const { hotTours: tours } = useTours();
  const t = useTranslations();

  if (tours.length === 0) return null;

  return (
    <section className="py-[80px] bg-white font-sans">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-[32px] reveal-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IoFlame className="text-sun text-2xl animate-pulse" />
              <span className="text-sun font-bold text-[14px] tracking-widest uppercase">
                {t("home.hot_tours.tagline")}
              </span>
            </div>
            <h2 className="text-[32px] md:text-[36px] font-bold text-dark leading-tight">
              {t("home.hot_tours.title")}
            </h2>
          </div>
          <Link href={ROUTES.TOURS} className="text-[14px] text-azure font-bold hover:underline flex items-center group">
            {t("home.hot_tours.explore_more")}
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
          {tours.map((tour, index) => (
            <div 
              key={tour.id} 
              className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#F1F5F9] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 relative overflow-hidden flex flex-col group reveal-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Thumbnail Area */}
              <div className="w-full h-[220px] relative">
                <Image
                  src={tour.thumbnail || "/images/placeholder.png"}
                  alt={tour.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-[16px] right-[16px] bg-sun text-white font-bold text-[12px] rounded-full px-[12px] py-[4px] shadow-lg">
                  HOT
                </div>
              </div>

              {/* Body */}
              <div className="p-[20px] flex flex-col flex-1">
                <h3 className="text-[17px] font-bold text-dark mb-3 line-clamp-2 min-h-[51px] group-hover:text-azure transition-colors">
                  {tour.name}
                </h3>

                <div className="flex items-center gap-[16px] mb-4">
                  <div className="flex items-center gap-2 text-[#64748B] text-[13px]">
                    <IoTimeOutline className="text-[16px] text-azure" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#64748B] text-[13px]">
                    <IoPeopleOutline className="text-[16px] text-azure" />
                    <span>{tour.max_people} {t("common.tour.slots")}</span>
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-center pt-[16px] border-t border-[#F1F5F9]">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-[#94A3B8] font-medium">{t("common.tour.price_from")}</span>
                    <span className="text-[18px] font-black text-azure">
                      {formatPriceVND(tour.price_adult)}
                    </span>
                  </div>
                  <Link
                    href={`${ROUTES.TOURS}/${tour.slug}`}
                    className="w-[44px] h-[44px] bg-slate-50 text-azure rounded-full flex items-center justify-center hover:bg-azure hover:text-white transition-all duration-300"
                  >
                    <span className="text-xl font-bold">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(HotTours);
