"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoFlashOutline, IoStar, IoTimeOutline, IoLocationOutline } from "react-icons/io5";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";

const HotTours = () => {
  const t = useTranslations("home");

  const tours = [
    {
      id: 1,
      title: "Bà Nà Hills - Cầu Vàng (1 Ngày)",
      image: "/images/tours/bana-hills.png",
      price: "1.250.000đ",
      rating: 4.9,
      reviews: 120,
      duration: "1 ngày",
      location: "Đà Nẵng",
      tag: "Best Seller"
    },
    {
      id: 2,
      title: "Phố Cổ Hội An - Ngũ Hành Sơn",
      image: "/images/tours/hoian.png",
      price: "850.000đ",
      rating: 4.8,
      reviews: 95,
      duration: "Chiều - Đêm",
      location: "Quảng Nam",
      tag: "Hot 🔥"
    },
    {
      id: 3,
      title: "Bán Đảo Sơn Trà - Chùa Linh Ứng",
      image: "/images/tours/sontra.png",
      price: "550.000đ",
      rating: 4.7,
      reviews: 80,
      duration: "4 tiếng",
      location: "Sơn Trà",
      tag: "Giá tốt"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-500/10 to-transparent" />

      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl flex items-center gap-4">
              {t("hot_tours.title")}
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              {t("hot_tours.subtitle")}
            </p>
          </div>

          <Link
            href={ROUTES.TOURS}
            className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-cyan-500 transition-all duration-300 group shadow-xl hover:shadow-cyan-500/40 active:scale-95"
          >
            <IoFlashOutline className="text-xl text-cyan-400 group-hover:text-white group-hover:animate-pulse" />
            {t("hot_tours.cta")}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <Link
              key={tour.id}
              href={`${ROUTES.TOURS}`}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              {/* Image Section */}
              <div className="relative aspect-16/10 overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold rounded-full shadow-lg">
                    {tour.tag}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-cyan-500 text-sm font-bold">
                    <IoStar className="text-yellow-400" />
                    {tour.rating}
                    <span className="text-gray-400 font-normal ml-1">({tour.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                    <IoLocationOutline className="text-sm" />
                    {tour.location}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-cyan-500 transition-colors line-clamp-1">
                  {tour.title}
                </h3>

                <div className="flex items-center gap-4 text-gray-500 text-sm mb-8">
                  <div className="flex items-center gap-2">
                    <IoTimeOutline className="text-lg text-cyan-500" />
                    {tour.duration}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Price from</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-cyan-500 transition-colors">
                      {tour.price}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                    <IoArrowForwardOutline className="text-xl" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

import { IoArrowForwardOutline } from "react-icons/io5";

export default memo(HotTours);
