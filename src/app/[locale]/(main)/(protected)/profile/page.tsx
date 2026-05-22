"use client";

import { useAuthStore } from "@/features/auth";
import { useTranslations, useLocale } from "next-intl";
import { ProfileLayoutWrapper } from "@/features/profile/components/ProfileLayoutWrapper";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const t = useTranslations("common");
  const locale = useLocale();

  if (!user) return null;

  return (
    <ProfileLayoutWrapper
      breadcrumbs={[{ labelKey: "breadcrumb.profile" }]}
    >
      <div className="bg-[#0a0a0a]/60 border border-[#262626] rounded-xl p-6 sm:p-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-[#1a1a1a]">
          <div className="w-20 h-20 bg-[#171717] text-white rounded-xl border border-[#262626] flex items-center justify-center text-3xl font-bold hover:border-[#8b6a55] transition-all duration-300 shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
              {user.name}
            </h1>
            <p className="text-[#a3a3a3] font-medium text-sm">{user.email}</p>
          </div>
        </div>

        {/* Profile detail cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#111111] border border-[#1a1a1a] transition-colors hover:border-[#262626]">
            <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
              {t("common.phone")}
            </label>
            <p className="font-bold text-white text-sm">
              {user.phone || t("common.not_updated")}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#111111] border border-[#1a1a1a] transition-colors hover:border-[#262626]">
            <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
              {t("common.role")}
            </label>
            <p className="font-bold text-white text-sm capitalize">{user.role}</p>
          </div>

          <div className="p-4 rounded-lg bg-[#111111] border border-[#1a1a1a] transition-colors hover:border-[#262626]">
            <label className="text-[10px] font-bold text-[#737373] uppercase tracking-widest block mb-2">
              {t("common.joined_date")}
            </label>
            <p className="font-bold text-white text-sm">
              {new Date(user.createdAt).toLocaleDateString(
                locale === "vi" ? "vi-VN" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </p>
          </div>
        </div>
      </div>
    </ProfileLayoutWrapper>
  );
}
