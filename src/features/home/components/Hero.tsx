"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoLocationOutline, IoCalendarOutline, IoSearchOutline } from "react-icons/io5";

const Hero = () => {
  const t = useTranslations("home");

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Da Nang Hero"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
          {t("hero_title")}
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/90 drop-shadow-md">
          {t("hero_subtitle")}
        </p>

        {/* Search Bar (Glassmorphism) */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl flex flex-col md:flex-row gap-4 items-center transition-all duration-300 hover:bg-white/15">
          {/* Location */}
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl border border-white/10 group transition-all duration-300 focus-within:bg-white/20">
            <IoLocationOutline className="w-5 h-5 text-cyan-400" />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              className="bg-transparent border-none outline-none w-full text-white placeholder:text-white/60 text-sm"
            />
          </div>

          {/* Date */}
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl border border-white/10 group transition-all duration-300 focus-within:bg-white/20">
            <IoCalendarOutline className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-white/60 cursor-pointer">
              {t("select_date")}
            </span>
          </div>

          {/* Search Button */}
          <button className="w-full md:w-auto px-10 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/40 active:scale-95 group">
            <IoSearchOutline className="text-xl" />
            {t("book_now")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);
