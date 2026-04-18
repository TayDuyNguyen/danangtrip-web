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
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 py-8 px-10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] -mt-12 mb-12 border border-blue-50/50">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center gap-4 group">
            <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors duration-300">
              {item.icon}
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <span className="text-[32px] font-black text-azure leading-none tracking-tight">
                {item.value}
              </span>
              <span className="text-[12px] md:text-[13px] text-[#64748B] font-bold tracking-widest uppercase opacity-80">
                {item.label}
              </span>
            </div>
            {index < statItems.length - 1 && (
              <div className="hidden md:block w-px h-12 bg-gray-100 mx-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(StatsBar);
