"use client";

import { useAuthStore } from "@/features/auth";
import { useTranslations, useLocale } from "next-intl";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const t = useTranslations("common");
  const locale = useLocale();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-10 tracking-tight">
        {t("auth.profile_info")}
      </h1>

      <div className="bg-[#080808] p-8 rounded-xl border border-[#262626] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-[#262626]">
          <div className="w-24 h-24 bg-[#171717] text-white rounded-xl border border-[#262626] flex items-center justify-center text-4xl font-bold hover:border-[#8b6a55] transition-all duration-300">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">{user.name}</h2>
            <p className="text-[#a3a3a3] font-medium">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-4 rounded-lg bg-[#171717] border border-[#262626] transition-colors">
            <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
              {t("common.phone")}
            </label>
            <p className="font-bold text-white">{user.phone || t("common.not_updated")}</p>
          </div>

          <div className="p-4 rounded-lg bg-[#171717] border border-[#262626] transition-colors">
            <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
              {t("common.role")}
            </label>
            <p className="font-bold text-white capitalize">{user.role}</p>
          </div>

          <div className="p-4 rounded-lg bg-[#171717] border border-[#262626] transition-colors">
            <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
              {t("common.joined_date")}
            </label>
            <p className="font-bold text-white">
              {new Date(user.createdAt).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
