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
      <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">
        {t("auth.profile_info")}
      </h1>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-gray-50">
          <div className="w-24 h-24 bg-cyan-500 text-white rounded-4xl flex items-center justify-center text-4xl font-black shadow-lg shadow-cyan-500/20 rotate-3 hover:rotate-0 transition-transform duration-300">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">{user.name}</h2>
            <p className="text-gray-500 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-4 rounded-3xl bg-gray-50/50 border border-transparent hover:border-cyan-500/10 transition-colors">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              {t("common.phone")}
            </label>
            <p className="font-bold text-gray-900">{user.phone || t("common.not_updated")}</p>
          </div>

          <div className="p-4 rounded-3xl bg-gray-50/50 border border-transparent hover:border-cyan-500/10 transition-colors">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              {t("common.role")}
            </label>
            <p className="font-bold text-gray-900 capitalize">{user.role}</p>
          </div>

          <div className="p-4 rounded-3xl bg-gray-50/50 border border-transparent hover:border-cyan-500/10 transition-colors">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              {t("common.joined_date")}
            </label>
            <p className="font-bold text-gray-900">
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
