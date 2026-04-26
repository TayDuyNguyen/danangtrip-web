"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useState, useTransition, memo } from "react";
import Image from "next/image";
import { IoChevronDownOutline } from "react-icons/io5";

const LanguageSwitcher = ({ isScrolled }: { isScrolled: boolean }) => {
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    {
      code: "vi",
      name: t("language.vi"),
      flag: "/images/lang/vi.png"
    },
    {
      code: "en",
      name: t("language.en"),
      flag: "/images/lang/en.png"
    },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  const onSelectChange = (nextLocale: string) => {
    if (nextLocale === locale) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative">
      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 border ${isScrolled
            ? "border-[#262626] bg-[#111111] text-white hover:border-[#8b6a55]/30 hover:bg-[#171717]"
            : "border-white/10 bg-white/10 text-white hover:border-white/30 hover:bg-white/20"
          } ${isPending ? "opacity-50 cursor-not-allowed" : ""} group z-50`}
      >
        <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/20 shadow-sm">
          <Image
            src={currentLanguage.flag}
            alt={currentLanguage.name}
            fill
            sizes="20px"
            className="object-cover"
          />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider">{locale}</span>
        <IoChevronDownOutline
          className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""
            } ${isScrolled ? "text-on-surface-subtle" : "text-white/60"}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-44 bg-[#111111] rounded-xl shadow-2xl border border-[#262626] overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-2.5 border-b border-[#262626] mb-1">
            <span className="text-[10px] font-bold text-on-surface-subtle uppercase tracking-widest leading-none">
              {t("language.select")}
            </span>
          </div>

          <div className="px-1 flex flex-col gap-0.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelectChange(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group/item ${locale === lang.code
                  ? "bg-[#171717] text-[#8b6a55] font-bold"
                  : "text-white hover:bg-[#171717]"
                  }`}
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden shadow-sm group-hover/item:scale-110 transition-transform">
                  <Image
                    src={lang.flag}
                    alt={lang.name}
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
                <span className="flex-1 text-left">{lang.name}</span>
                {locale === lang.code && (
                  <span className="w-1.5 h-1.5 bg-[#8b6a55] rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(LanguageSwitcher);
