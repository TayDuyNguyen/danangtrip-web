"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { 
  IoShieldCheckmarkOutline, 
  IoFlashOutline, 
  IoHeadsetOutline, 
  IoWalletOutline 
} from "react-icons/io5";


const Discovery = () => {
  const t = useTranslations();

  const features = [
    {
      id: 1,
      key: "cost_optimization",
      icon: <IoWalletOutline className="text-3xl text-sun" />,
    },
    {
      id: 2,
      key: "easy_booking",
      icon: <IoFlashOutline className="text-3xl text-[#8b6a55]" />,
    },
    {
      id: 3,
      key: "support_247",
      icon: <IoHeadsetOutline className="text-3xl text-[#929852]" />,
    },
    {
      id: 4,
      key: "trusted_service",
      icon: <IoShieldCheckmarkOutline className="text-3xl text-[#5c3822]" />,
    },
  ];

  return (
    <section className="py-[120px] bg-surface reveal-up">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 px-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[2px] bg-[#8b6a55]/30" />
            <span className="text-[#8b6a55] font-black text-[12px] tracking-[0.4em] uppercase">{t("home.discovery.tagline")}</span>
            <span className="w-12 h-[2px] bg-[#8b6a55]/30" />
          </div>
          <h2 className="text-[32px] md:text-[48px] font-black text-foreground leading-tight mb-8">
            {t("home.discovery.title")}
          </h2>
          <p className="text-[16px] md:text-lg text-on-surface-subtle font-medium leading-relaxed">
            {t("home.discovery.subtitle")}
          </p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group p-10 bg-surface-container-lowest rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:shadow-2xl hover:shadow-[#8b6a55]/10 transition-all duration-700 hover:-translate-y-3 flex flex-col items-center text-center relative overflow-hidden border border-[#262626]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#8b6a55]/5 rounded-bl-full -mr-10 -mt-10 group-hover:bg-[#8b6a55]/10 transition-colors duration-700" />
              
              <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center mb-10 transform transition-all duration-700 group-hover:rotate-15 group-hover:scale-110 shadow-sm relative z-10">
                {feature.icon}
              </div>
              <h3 className="text-[20px] font-bold text-foreground mb-5 group-hover:text-[#8b6a55] transition-colors uppercase tracking-tight relative z-10">
                {t(`home.discovery.features.${feature.key}.title`)}
              </h3>
              <p className="text-[14px] md:text-[15px] text-on-surface-subtle leading-relaxed font-medium relative z-10">
                {t(`home.discovery.features.${feature.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
};

export default memo(Discovery);
