"use client";
import { useTranslations } from "next-intl";
import { IoLocationOutline, IoMailOutline, IoTimeOutline, Phone } from "@/components/icons/solar";
import { ContactInfoItem } from "./ContactInfoItem";

export const ContactInfoCard = () => {
  const t = useTranslations("contact");

  return (
    <div className="glass-surface glass-inner rounded-xl p-8 lg:p-10 space-y-10 group reveal-up reveal-delay-200">
      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8 tracking-tight">
        {t("info.title")}
      </h2>

      <div className="space-y-8">
        <ContactInfoItem
          icon={IoLocationOutline}
          label={t("info.address")}
          value="99 Phố Tiếp, Thanh Khê, Đà Nẵng"
          delay="reveal-delay-300"
        />
        
        <ContactInfoItem
          icon={Phone}
          label={t("info.phone")}
          value="0123 456 789"
          delay="reveal-delay-400"
        />

        <ContactInfoItem
          icon={IoMailOutline}
          label={t("info.email")}
          value="info@danangtrip.com"
          delay="reveal-delay-500"
        />

        <ContactInfoItem
          icon={IoTimeOutline}
          label={t("info.working_hours")}
          value={t("info.working_hours_desc")}
          delay="reveal-delay-600"
        />
      </div>
    </div>
  );
};
