"use client";

import { useAuthStore } from "@/features/auth";
import { useTranslations } from "next-intl";
import { IoShieldCheckmarkOutline, IoFingerPrintOutline, IoRocketOutline } from "react-icons/io5";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const t = useTranslations("common");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">
        {t("dashboard.title")}
      </h1>

      <div className="bg-[#080808] p-10 rounded-xl border border-[#262626] mb-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b6a55]/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />

        <div className="relative z-10">
          <p className="text-2xl text-[#d4d4d4] leading-relaxed font-medium">
            {t("dashboard.welcome")}, <span className="font-bold text-[#8b6a55]">{user?.name || t("auth.profile")}</span>!
          </p>
          <p className="text-lg text-[#a3a3a3] mt-2">
            {t("dashboard.personal_page_desc")}
          </p>

          <div className="mt-8 flex items-center gap-3 p-4 bg-[#171717] rounded-lg border border-[#262626] max-w-fit">
            <IoRocketOutline className="text-xl text-[#8b6a55] animate-pulse" />
            <p className="text-sm font-semibold text-[#d4d4d4]">
              {t("dashboard.updating_desc")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-[#080808] p-8 rounded-xl border border-[#262626] transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#1a1f14] rounded-lg flex items-center justify-center">
              <IoShieldCheckmarkOutline className="text-2xl text-[#929852]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#737373] uppercase tracking-widest">
                {t("dashboard.account_status")}
              </h3>
              <p className="text-lg font-bold text-[#929852]">{t("dashboard.active")}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#080808] p-8 rounded-xl border border-[#262626] transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#171717] rounded-lg flex items-center justify-center">
              <IoFingerPrintOutline className="text-2xl text-[#8b6a55]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#737373] uppercase tracking-widest">
                {t("dashboard.account_type")}
              </h3>
              <p className="text-lg font-bold text-white capitalize">
                {user?.role || t("dashboard.member")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
