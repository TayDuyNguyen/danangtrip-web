"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { IoArrowForwardOutline } from "react-icons/io5";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";

const Discovery = () => {
  const t = useTranslations("home");

  const destinations = [
    {
      id: 1,
      title: "Bà Nà Hills",
      image: "/images/discovery/bana-hills.png",
      count: "15+ Tours",
    },
    {
      id: 2,
      title: "Cầu Rồng",
      image: "/images/discovery/dragon-bridge.png",
      count: "12+ Tours",
    },
    {
      id: 3,
      title: "Sơn Trà",
      image: "/images/discovery/son-tra.png",
      count: "8+ Tours",
    },
    {
      id: 4,
      title: "Phố cổ Hội An",
      image: "/images/discovery/hoi-an.png",
      count: "20+ Tours",
    },
  ];

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 underline-cyan-400">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {t("explore_danang")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("explore_danang_desc")}
            </p>
          </div>

          <Link
            href={ROUTES.DESTINATIONS}
            className="flex items-center gap-2 text-cyan-500 font-bold hover:text-cyan-600 transition-colors group h-fit"
          >
            {t("view_all")}
            <IoArrowForwardOutline className="text-xl group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={ROUTES.DESTINATIONS}
              className="relative overflow-hidden group rounded-3xl aspect-3/4 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src={dest.image}
                alt={dest.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-500">
                <h3 className="mb-2 text-2xl font-bold drop-shadow-md">{dest.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-1 bg-cyan-500 rounded-full" />
                  <p className="text-sm text-gray-300 font-medium tracking-wide items-center flex gap-1">
                    {dest.count}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(Discovery);
