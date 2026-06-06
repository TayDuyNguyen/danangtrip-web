"use client";

import { memo, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { IoLocationOutline, IoMapOutline, IoNewspaperOutline } from "@/components/icons/solar";
import { useStatistics } from "../hooks/use-statistics";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const StatsBar = () => {
  const t = useTranslations();
  const { elementRef, isVisible } = useScrollReveal();
  const { stats } = useStatistics();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use isVisible only after hydration to avoid SSR/client mismatch
  const revealed = isMounted && isVisible;

  const statItems = [
    {
      label: t("home.stats.locations"),
      value: stats ? `${stats.total_locations}+` : "—",
      icon: <IoLocationOutline className="text-[22px] text-primary transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      label: t("home.stats.tours"),
      value: stats ? `${stats.total_tours}+` : "—",
      icon: <IoMapOutline className="text-[22px] text-primary transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      label: t("home.stats.blog_posts"),
      value: stats ? `${stats.total_blog_posts}+` : "—",
      icon: <IoNewspaperOutline className="text-[22px] text-primary transition-transform duration-300 group-hover:scale-110" />,
    },
  ];

  return (
    <div className="relative z-10 flex w-full justify-center" ref={elementRef}>
      <div
        className={`-mt-10 mb-2 flex w-[calc(100%-2rem)] max-w-4xl flex-wrap items-center justify-between gap-5 rounded-[28px] border border-border bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.08)] transition-all duration-700 md:p-7 ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {statItems.map((item, index) => (
          <div
            key={index}
            className="group flex min-w-[200px] flex-1 items-center gap-5 transition-all duration-700"
            style={{
              transitionDelay: `${(index + 1) * 150}ms`,
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ffd8e1] bg-[#fff1f3] transition-all duration-300 group-hover:border-primary/25 group-hover:bg-[#ffe4ea]">
              {item.icon}
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-[30px] font-semibold leading-none tracking-[-0.04em] text-on-surface transition-colors group-hover:text-primary">
                {item.value}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-subtle">
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
