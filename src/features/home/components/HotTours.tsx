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
    <section className="py-[120px] bg-surface font-sans overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-16 gap-8 reveal-up">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <IoFlame className="text-sun text-3xl animate-pulse" />
              <span className="text-sun font-black text-[12px] tracking-[0.4em] uppercase">
                {t("home.hot_tours.tagline")}
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-black text-dark leading-tight">
              {t("home.hot_tours.title")}
            </h2>
          </div>
          <Link href={ROUTES.TOURS} className="px-6 py-3 bg-white text-azure text-[14px] font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center group mb-2">
            {t("home.hot_tours.explore_more")}
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
          {tours.map((tour, index) => (
            <div
              key={tour.id}
              className="bg-surface-container-lowest rounded-[24px] shadow-[0_15px_35px_rgba(23,28,31,0.05)] transition-all duration-500 hover:shadow-2xl hover:shadow-azure/5 hover:-translate-y-2 relative overflow-hidden flex flex-col group reveal-up"
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
                <div className="absolute top-[16px] right-[16px] bg-sun text-white font-black text-[10px] tracking-wider uppercase rounded-full px-[12px] py-[6px] shadow-lg z-10">
                  HOT
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-[18px] font-bold text-dark mb-4 line-clamp-2 min-h-[54px] group-hover:text-azure transition-colors">
                  {tour.name}
                </h3>

                <div className="flex items-center gap-[16px] mb-8">
                  <div className="flex items-center gap-2 text-slate-500 text-[13px] font-medium">
                    <IoTimeOutline className="text-[16px] text-azure/60" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[13px] font-medium">
                    <IoPeopleOutline className="text-[16px] text-azure/60" />
                    <span>{tour.max_people} {t("common.tour.slots")}</span>
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-center pt-6 relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-slate-100/50" />

                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t("common.tour.price_from")}</span>
                    <span className="text-[20px] font-black text-azure">
                      {formatPriceVND(tour.price_adult)}
                    </span>
                  </div>
                  <Link
                    href={`${ROUTES.TOURS}/${tour.slug}`}
                    className="w-12 h-12 bg-surface-container text-azure rounded-full flex items-center justify-center hover:bg-azure hover:text-white transition-all duration-500 shadow-sm"
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

