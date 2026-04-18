"use client";

import { useAuthStore } from "@/features/auth";
import { useTranslations } from "next-intl";
import { IoShieldCheckmarkOutline, IoFingerPrintOutline, IoRocketOutline } from "react-icons/io5";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const t = useTranslations("common");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">
        {t("dashboard.title")}
      </h1>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 mb-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />

        <div className="relative z-10">
          <p className="text-2xl text-gray-800 leading-relaxed font-medium">
            {t("dashboard.welcome")}, <span className="font-black text-cyan-500">{user?.name || t("auth.profile")}</span>!
          </p>
          <p className="text-lg text-gray-500 mt-2">
            {t("dashboard.personal_page_desc")}
          </p>

          <div className="mt-8 flex items-center gap-3 p-4 bg-cyan-50 rounded-2xl border border-cyan-100/50 max-w-fit">
            <IoRocketOutline className="text-xl text-cyan-500 animate-pulse" />
            <p className="text-sm font-bold text-cyan-700">
              {t("dashboard.updating_desc")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
              <IoShieldCheckmarkOutline className="text-2xl text-green-500" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {t("dashboard.account_status")}
              </h3>
              <p className="text-lg font-black text-green-500">{t("dashboard.active")}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center">
              <IoFingerPrintOutline className="text-2xl text-cyan-500" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {t("dashboard.account_type")}
              </h3>
              <p className="text-lg font-black text-gray-900 capitalize">
                {user?.role || t("dashboard.member")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
