"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import {
  IoLocationOutline,
  IoMapOutline,
  IoNewspaperOutline
} from "react-icons/io5";
import { useStatistics } from "../hooks/use-statistics";

const StatsBar = () => {
  const { stats } = useStatistics();
  const t = useTranslations();

  if (!stats) return null;

  const statItems = [
    {
      label: t("home.stats.locations"),
      value: `${stats.total_locations}+`,
      icon: <IoLocationOutline className="text-2xl text-[#3B82F6]" />
    },
    {
      label: t("home.stats.tours"),
      value: `${stats.total_tours}+`,
      icon: <IoMapOutline className="text-2xl text-[#10B981]" />
    },
    {
      label: t("home.stats.blog_posts"),
      value: `${stats.total_blog_posts}+`,
      icon: <IoNewspaperOutline className="text-2xl text-[#F59E0B]" />
    },
  ];

  return (
    <div className="container mx-auto px-4 relative z-20 reveal-up">
      <div className="flex flex-wrap justify-between items-center gap-10 p-10 bg-white/80 backdrop-blur-xl border border-outline-variant shadow-[0_20px_50px_rgba(23,28,31,0.12)] rounded-[24px] -mt-16 mb-12">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center gap-5 group flex-1 min-w-[200px]">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center group-hover:bg-surface-container-high transition-colors duration-500">
              {item.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[32px] font-black text-azure leading-none tracking-tighter mb-1">
                {item.value}
              </span>
              <span className="text-[12px] text-dark font-black tracking-[0.2em] uppercase opacity-60">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

export default memo(StatsBar);
