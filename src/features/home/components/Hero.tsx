"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  IoLocationOutline,
} from "react-icons/io5";
import { useWeather } from "../hooks/use-weather";

const Hero = () => {
  const { weather } = useWeather();
  const t = useTranslations();

  return (
    <section className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden font-sans border-b border-white/10">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Da Nang Hero"
          fill
          className="object-cover scale-105"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-dark/10" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 text-center mt-[-40px] reveal-up">
        <div className="mb-10">
          <p className="text-[14px] md:text-[16px] font-bold text-white tracking-[0.4em] mb-4 uppercase drop-shadow-lg opacity-90">
            {t("home.hero_tagline_premium")}
          </p>
          <h1 className="text-[48px] md:text-[64px] font-bold text-white mb-4 leading-tight drop-shadow-xl">
            {t("home.hero_title")}
          </h1>
          <p className="text-[18px] md:text-[20px] text-white/90 font-medium max-w-2xl mx-auto">
            {t("home.hero_subtitle")}
          </p>
        </div>

        {/* Search Box - Glassmorphism */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-[32px] overflow-hidden backdrop-blur-xl bg-white/20 border border-white/30 p-2">
          <div className="flex-1 flex items-center px-6 py-4 border-b md:border-b-0 md:border-r border-white/20">
            <IoLocationOutline className="text-2xl text-white mr-3" />
            <input
              type="text"
              id="hero-search-input"
              placeholder={t("home.search_placeholder")}
              className="w-full text-lg outline-none text-white placeholder-white/70 font-medium bg-transparent"
            />
          </div>
          <div className="w-full md:w-1/4 flex items-center px-6 py-4 border-b md:border-b-0 md:border-r border-white/20">
            <select
              id="hero-search-type"
              className="w-full text-lg outline-none text-white bg-transparent font-medium cursor-pointer appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '1.2em' }}
            >
              <option value="location" className="text-gray-900">{t("home.search_type_location")}</option>
              <option value="tour" className="text-gray-900">{t("home.search_type_tour")}</option>
            </select>
          </div>
          <button
            onClick={() => {
              const q = (document.getElementById('hero-search-input') as HTMLInputElement)?.value;
              const type = (document.getElementById('hero-search-type') as HTMLSelectElement)?.value;
              window.location.href = `/search?q=${encodeURIComponent(q)}&type=${type}`;
            }}
            className="px-8 py-4 bg-white hover:bg-white/90 transition-all text-azure text-lg font-bold flex items-center justify-center gap-2 rounded-[24px] mt-2 md:mt-0 shadow-lg active:scale-95"
          >
            {t("home.search_button")}
          </button>
        </div>
      </div>

      {/* Weather Widget */}
      {weather && (
        <div
          className="absolute bottom-10 right-10 z-30 flex items-center gap-3 backdrop-blur-md rounded-[20px] px-[16px] py-[10px] border border-white/30 shadow-2xl reveal-up reveal-delay-400"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <div className="text-2xl text-white drop-shadow-md">{weather.icon || "☀️"}</div>
          <span className="text-white font-bold text-[14px] drop-shadow-lg tracking-wide">
            {weather.temp}°C · {t(`home.weather.${weather.condition}`)}
          </span>
        </div>
      )}
    </section>
  );
};

export default memo(Hero);
