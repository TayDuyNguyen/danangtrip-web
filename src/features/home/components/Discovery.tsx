"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

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
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mb-16 underline-cyan-400">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {t("explore_danang")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("explore_danang_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="relative overflow-hidden group rounded-2xl aspect-3/4 cursor-pointer"
            >
              <Image
                src={dest.image}
                alt={dest.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="mb-1 text-2xl font-bold">{dest.title}</h3>
                <p className="text-sm text-gray-300 font-medium">
                  {dest.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(Discovery);
