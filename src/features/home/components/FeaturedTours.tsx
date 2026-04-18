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
    <section className="py-[80px] bg-[#F8FAFC] font-sans">
      <div className="container mx-auto px-4 overflow-hidden">
        <div className="flex justify-between items-center mb-[24px] reveal-up">
          <h2 className="text-[24px] font-bold text-[#1E293B] leading-tight">
            {t("home.featured_tours.title")}
          </h2>
          <Link href={ROUTES.TOURS} className="text-[14px] text-azure font-semibold hover:underline flex items-center">
            {t("common.tour.see_all")} <span className="ml-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          {tours.map((tour, index) => (
            <div 
              key={tour.id} 
              className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden flex flex-col group reveal-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Thumbnail Area */}
              <div className="w-full h-[200px] relative">
                <Image
                  src={tour.thumbnail || "/images/placeholder.png"}
                  alt={tour.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-[12px] left-[12px] bg-[#EFF6FF] text-azure font-bold text-[11px] rounded-full px-[8px] py-[3px]">
                  ⭐ {t("home.trending")}
                </div>
              </div>
              
              {/* Body */}
              <div className="p-[16px] flex flex-col flex-1">
                <div className="self-start text-[11px] font-semibold bg-[#EFF6FF] text-azure rounded-full px-[8px] py-[2px] mb-[8px]">
                  {t("home.featured_tours.special_tour")}
                </div>
                
                <h3 className="text-[15px] font-bold text-[#1E293B] mb-2 line-clamp-2 min-h-[45px]">
                  {tour.name}
                </h3>
                
                <div className="flex items-center gap-[12px] mt-[4px]">
                  <div className="flex items-center gap-1 text-[#64748B] text-[12px]">
                    <IoTimeOutline className="text-[14px] text-[#94A3B8]" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#64748B] text-[12px]">
                    <IoPeopleOutline className="text-[14px] text-[#94A3B8]" />
                    <span>{tour.max_people} {t("common.tour.slots")}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-[12px] pt-[12px] border-t border-[#F1F5F9]">
                  <div className="text-[12px] font-bold text-[#F59E0B] flex items-center gap-1">
                    ★ 4.8 ({tour.review_count || 128})
                  </div>
                  <div className="text-[15px] font-bold text-azure">
                    {formatPriceVND(tour.price_adult)}
                  </div>
                </div>

                {/* Buttom Action */}
                <Link 
                  href={`${ROUTES.TOURS}/${tour.slug}`}
                  className="block w-full text-center bg-azure text-white rounded-[12px] py-[10px] text-[14px] font-bold mt-[12px] hover:bg-blue-700 transition-colors shadow-sm"
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
