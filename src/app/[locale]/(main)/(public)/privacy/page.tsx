import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Đà Nẵng Trip",
  description:
    "Tìm hiểu cách Đà Nẵng Trip thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
};

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  const sections = [
    "s1", "s2", "s3", "s4", "s5", "s6",
    "s7", "s8", "s9", "s10", "s11", "s12",
  ] as const;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-white border-b border-[#DDDDDD]">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(255,56,92,0.07) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-20 text-center">
          {/* Icon badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#fff0f3] border border-[#ffd0da] mb-6 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-[#FF385C]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#222222] tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-[#6A6A6A] text-lg max-w-xl mx-auto leading-relaxed mb-6">
            {t("subtitle")}
          </p>
          <span className="inline-block text-sm text-[#a3a3a3] bg-[#f7f7f7] border border-[#DDDDDD] rounded-full px-4 py-1.5">
            {t("last_updated")}: {t("last_updated_date")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-14">
        {/* Privacy commitment highlight */}
        <div className="mb-10 p-6 rounded-2xl bg-[#fff0f3] border border-[#ffd0da] flex gap-4 items-start">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-[#ffd0da] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[#FF385C]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#FF385C] mb-1">
              Cam kết của chúng tôi
            </p>
            <p className="text-sm text-[#444444] leading-relaxed">
              Đà Nẵng Trip không bán, cho thuê hay trao đổi dữ liệu cá nhân của
              bạn. Mọi thông tin chỉ được sử dụng để cải thiện trải nghiệm của
              bạn trên nền tảng.
            </p>
          </div>
        </div>

        {/* Table of contents quick-nav */}
        <div className="mb-10 p-6 rounded-2xl bg-white border border-[#DDDDDD] shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#FF385C] mb-4">
            Mục lục
          </p>
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
            {sections.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className="text-[#6A6A6A] hover:text-[#FF385C] transition-colors flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#DDDDDD] group-hover:bg-[#FF385C] transition-colors shrink-0" />
                {t(`sections.${key}.title`)}
              </a>
            ))}
          </nav>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((key, idx) => (
            <section
              key={key}
              id={key}
              className="bg-white rounded-2xl border border-[#DDDDDD] overflow-hidden shadow-sm scroll-mt-28"
            >
              {/* Section header */}
              <div className="flex items-center gap-4 px-7 py-5 border-b border-[#f0f0f0]">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#fff0f3] border border-[#ffd0da] flex items-center justify-center text-xs font-bold text-[#FF385C]">
                  {idx + 1}
                </span>
                <h2 className="text-base font-semibold text-[#222222] leading-snug">
                  {t(`sections.${key}.title`)}
                </h2>
              </div>
              {/* Section body */}
              <div className="px-7 py-6">
                <p className="text-[#444444] leading-relaxed text-[15px]">
                  {t(`sections.${key}.body`)}
                </p>
              </div>
            </section>
          ))}
        </div>

        {/* Your rights summary chips */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-[#DDDDDD] shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#FF385C] mb-5">
            Quyền của bạn — Tóm tắt nhanh
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              "Quyền truy cập",
              "Quyền chỉnh sửa",
              "Quyền xóa dữ liệu",
              "Quyền phản đối",
              "Quyền hạn chế xử lý",
              "Quyền di chuyển dữ liệu",
            ].map((right) => (
              <span
                key={right}
                className="px-4 py-1.5 rounded-full bg-[#f7f7f7] border border-[#DDDDDD] text-sm text-[#444444] font-medium"
              >
                {right}
              </span>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#DDDDDD]">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6A6A6A] hover:text-[#FF385C] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            {t("back_home")}
          </Link>
          <Link
            href={ROUTES.TERMS}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#FF385C] hover:text-[#E31C5F] transition-colors"
          >
            Điều khoản dịch vụ
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
