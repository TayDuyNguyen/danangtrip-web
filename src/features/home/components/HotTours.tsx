"use client";

import { memo, useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
  IoTimeOutline,
  IoPeopleOutline,
  IoFlame,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "@/components/icons/solar";
import { useHotTours } from "../hooks/use-tours";
import { formatPriceVND } from "@/utils/format";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getHomeTourImage } from "../utils/home-image-fallbacks";
import { useActivePromotions } from "@/features/tour/hooks/usePromotions";

const HotTours = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { elementRef, isVisible } = useScrollReveal();
  const { tours } = useHotTours();
  const { data: promotions } = useActivePromotions();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [tours]);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -360, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 360, behavior: "smooth" });
  };

  return (
    <section className="py-10 bg-surface/12 backdrop-blur-[1px] font-sans overflow-hidden">
      <div className="design-container" ref={elementRef}>
        <div className={`flex justify-between items-end mb-6 gap-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className={`transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="flex items-center gap-3 mb-4">
              <IoFlame className="text-sun text-3xl animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-normal text-primary">
                {t("home.hot_tours.tagline")}
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-black text-on-surface leading-tight">
              {t("home.hot_tours.title")}
            </h2>
          </div>
          <Link href={String(ROUTES.TOURS)} className={`mb-2 flex items-center rounded-full border border-border bg-white px-6 py-3 text-[14px] font-semibold text-on-surface shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-[#f7f7f7] hover:text-primary ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {t("home.hot_tours.explore_more")}
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Slider Wrapper */}
        <div className={`relative group/nav transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className={`absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full bg-surface border border-border text-on-surface hover:bg-primary hover:border-primary hover:text-white flex items-center justify-center shadow-md transition-all hidden lg:flex active:scale-90 hover:scale-110 ${
              canScrollLeft
                ? "lg:opacity-70 group-hover/nav:opacity-100 cursor-pointer"
                : "lg:opacity-10 pointer-events-none cursor-default"
            }`}
            aria-label={t("common.accessibility.previous")}
          >
            <IoChevronBackOutline size={18} />
          </button>

          <button
            onClick={scrollRight}
            className={`absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 z-30 w-10 h-10 rounded-full bg-surface border border-border text-on-surface hover:bg-primary hover:border-primary hover:text-white flex items-center justify-center shadow-md transition-all hidden lg:flex active:scale-90 hover:scale-110 ${
              canScrollRight
                ? "lg:opacity-70 group-hover/nav:opacity-100 cursor-pointer"
                : "lg:opacity-10 pointer-events-none cursor-default"
            }`}
            aria-label={t("common.accessibility.next")}
          >
            <IoChevronForwardOutline size={18} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-[24px] overflow-x-auto no-scrollbar scroll-smooth py-4 snap-x snap-mandatory px-4"
          >
            {tours.map((tour, index) => {
              const discountPercent = tour.discount_percent || 0;
              const originalPrice = parseFloat(tour.price_adult);
              const discountedPrice = originalPrice * (1 - discountPercent / 100);

              const applicablePromotions = promotions?.filter((promo) => {
                const minOrder = promo.min_order_amount ? parseFloat(promo.min_order_amount.toString()) : 0;
                return discountedPrice >= minOrder && promo.status === "active";
              }) || [];

              return (
                <div
                  key={tour.id}
                  className={`group relative flex min-w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)] transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] md:min-w-[340px]`}
                  style={{ transitionDelay: `${(index + 3) * 150}ms`, opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)" }}
                >
                  {/* Thumbnail Area */}
                <Link href={ROUTES.TOUR_DETAIL(tour.slug)} className="w-full h-[240px] relative overflow-hidden block cursor-pointer z-10">
                  <Image
                    src={getHomeTourImage(tour.thumbnail, tour.id)}
                    alt={tour.name}
                    fill
                    sizes="(max-width: 768px) 280px, 340px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute right-[16px] top-[16px] z-10 rounded-full bg-primary px-[12px] py-[6px] text-xs font-semibold uppercase tracking-normal text-white shadow-lg">
                    {t("search.badges.hot")}
                  </div>
                </Link>

                {/* Body */}
                <div className="p-6 flex flex-col grow">
                  <Link href={ROUTES.TOUR_DETAIL(tour.slug)} className="z-10">
                    <h3 className="text-[18px] font-bold text-on-surface mb-4 line-clamp-2 min-h-[54px] group-hover:text-primary transition-colors">
                      {tour.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-[16px] mb-8">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-on-surface-subtle">
                      <IoTimeOutline className="text-[16px] text-primary/60" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-medium text-on-surface-subtle">
                      <IoPeopleOutline className="text-[16px] text-primary/60" />
                      <span>{tour.max_people} {t("common.tour.slots")}</span>
                    </div>
                  </div>

                  {applicablePromotions.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {applicablePromotions.slice(0, 2).map((promo) => (
                        <div
                          key={promo.id}
                          className="inline-flex items-center gap-1 rounded-md bg-primary/5 px-2 py-0.5 text-[10px] md:text-[11px] font-semibold text-primary border border-primary/10"
                          title={promo.description || promo.name}
                        >
                          <span>🎫 {promo.code}</span>
                          <span className="text-on-surface-subtle font-normal">
                            ({promo.discount_type === "percent" ? `-${promo.discount_value}%` : `-${formatPriceVND(parseFloat(promo.discount_value.toString()), locale === 'vi' ? 'vi-VN' : 'en-US')}`})
                          </span>
                        </div>
                      ))}
                      {applicablePromotions.length > 2 && (
                        <span className="text-[10px] md:text-[11px] text-on-surface-subtle self-center font-medium">
                          +{applicablePromotions.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto flex justify-between items-center pt-6 relative">
                    <div className="absolute top-0 left-0 right-0 h-px bg-border/60" />

                    <div className="flex flex-col">
                      <span className="mb-1 text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">{t("common.tour.price_from")}</span>
                      <div className="flex flex-col items-start">
                        {discountPercent > 0 && (
                          <span className="text-[11px] text-on-surface-subtle line-through">
                            {formatPriceVND(originalPrice, locale === 'vi' ? 'vi-VN' : 'en-US')}
                          </span>
                        )}
                        <span className="text-[20px] font-black text-primary">
                          {formatPriceVND(discountedPrice, locale === 'vi' ? 'vi-VN' : 'en-US')}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={ROUTES.TOUR_DETAIL(tour.slug)}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[#f7f7f7] text-primary shadow-sm transition-all duration-500 hover:border-primary hover:bg-primary hover:text-white"
                    >
                      <span className="text-xl font-bold">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(HotTours);
