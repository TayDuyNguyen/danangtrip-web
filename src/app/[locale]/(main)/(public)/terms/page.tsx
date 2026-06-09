import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ | Đà Nẵng Trip",
  description:
    "Đọc kỹ điều khoản dịch vụ của Đà Nẵng Trip trước khi sử dụng nền tảng đặt tour và khám phá du lịch.",
};

export default function TermsPage() {
  const t = useTranslations("terms");

  const sections = [
    "s1", "s2", "s3", "s4", "s5", "s6",
    "s7", "s8", "s9", "s10", "s11",
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
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(255,56,92,0.08) 0%, transparent 70%)",
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
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
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
              className="bg-white rounded-2xl border border-[#DDDDDD] overflow-hidden shadow-sm group scroll-mt-28"
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
            href={ROUTES.PRIVACY}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#FF385C] hover:text-[#E31C5F] transition-colors"
          >
            Chính sách bảo mật
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
