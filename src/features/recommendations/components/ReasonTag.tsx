"use client";

import { useTranslations } from "next-intl";
import { IoHeartOutline, IoLocationOutline, IoCompassOutline, IoTrendingUp } from "@/components/icons/solar";

interface ReasonTagProps {
  reason: "viewed" | "similar_favorite" | "popular" | "booked";
}

export default function ReasonTag({ reason }: ReasonTagProps) {
  const t = useTranslations("recommendations.reasons");

  const getReasonMeta = () => {
    switch (reason) {
      case "similar_favorite":
        return {
          icon: <IoHeartOutline className="text-red-500 text-xs shrink-0" />,
          label: t("similar_favorite"),
          bg: "bg-red-500/10 text-red-400 border-red-500/20",
        };
      case "booked":
        return {
          icon: <IoTrendingUp className="text-emerald-500 text-xs shrink-0" />,
          label: t("booked"),
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "viewed":
        return {
          icon: <IoCompassOutline className="text-amber-500 text-xs shrink-0" />,
          label: t("viewed"),
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      case "popular":
      default:
        return {
          icon: <IoLocationOutline className="text-blue-500 text-xs shrink-0" />,
          label: t("popular"),
          bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        };
    }
  };

  const meta = getReasonMeta();

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono font-medium tracking-wide uppercase transition-all duration-300 ${meta.bg}`}>
      {meta.icon}
      <span>{meta.label}</span>
    </div>
  );
}
