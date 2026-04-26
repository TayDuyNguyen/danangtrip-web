"use client";

import { useState, useEffect, memo } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  IoMenuOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoChevronForward,
} from "react-icons/io5";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES, NAV_LINKS } from "@/config";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const t = useTranslations("common");
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#030303]/95 backdrop-blur-md border-b border-[#262626] py-3"
          : "bg-[#080808]/75 backdrop-blur-md border-b border-[#262626] py-4"
      }`}
    >
      <div className="design-container flex items-center justify-between">
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-[#171717] rounded-lg border border-[#262626] flex items-center justify-center text-white group-hover:border-[#8b6a55] transition-all duration-300">
            <span className="text-xl font-semibold">D</span>
          </div>
          <span
            className={`text-xl font-semibold tracking-tight transition-colors duration-300 ${
              isScrolled ? "text-white" : "text-white"
            }`}
          >
            {t("common.brand_name").split(" ")[0]}{" "}
            <span className="text-[#8b6a55]">{t("common.brand_name").split(" ").slice(1).join(" ")}</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-[13px] uppercase tracking-[0.18em] font-semibold transition-all duration-300 hover:text-[#8b6a55] relative group truncate ${
                isActive(link.path) ? "text-[#8b6a55]" : "text-[#d4d4d4]"
              }`}
            >
              {t(link.name)}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-[#8b6a55] transition-all duration-300 ${
                  isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>


        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher isScrolled={isScrolled} />
          </div>

          {/* Auth Button */}
          {isAuthenticated ? (
            <div className="relative group/user">
              <button
                className={`w-10 h-10 rounded-full bg-[#171717] flex items-center justify-center border border-[#262626] transition-all hover:border-[#8b6a55] hover:text-[#8b6a55]`}
              >
                <IoPersonOutline className="text-xl" />
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 bg-[#080808] rounded-lg shadow-xl border border-[#262626] overflow-hidden py-2 translate-y-2 opacity-0 invisible group-hover/user:translate-y-0 group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300">
                <div className="px-4 py-2 border-b border-[#262626] mb-1">
                  <p className="text-xs text-[#737373]">{t("auth.profile")}</p>
                  <p className="text-sm font-semibold truncate text-white">
                    {user?.name || t("auth.profile")}
                  </p>
                </div>
                <Link
                  href={ROUTES.PROFILE}
                  className="block px-4 py-2 text-sm text-[#d4d4d4] hover:bg-[#171717]"
                >
                  {t("auth.profile")}
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                >
                  {t("auth.logout")}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={ROUTES.LOGIN}
                className={`px-4 py-2 rounded-full border border-[#262626] font-semibold text-sm transition-all duration-300 text-[#d4d4d4] hover:text-white hover:border-[#404040]`}
              >
                {t("auth.login")}
              </Link>
              <Link
                href={ROUTES.REGISTER || "/register"}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 bg-[#171717] border border-[#262626] text-white hover:text-[#8b6a55] hover:border-[#8b6a55]`}
              >
                {t("auth.register")}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={`p-4 -mr-4 lg:hidden text-3xl transition-colors text-white`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t("accessibility.close_menu") : t("accessibility.open_menu")}
          >
            {isMobileMenuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="lg:hidden fixed inset-y-0 right-0 w-4/5 max-w-sm bg-[#080808]/95 backdrop-blur-md z-50 shadow-2xl animate-in slide-in-from-right duration-300 border-l border-[#262626]">
            <div className="flex items-center justify-between p-6 border-b border-[#262626]">
              <span className="text-lg font-semibold text-white">{t("common.menu")}</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-[#171717] transition-colors"
                aria-label={t("accessibility.close_menu")}
              >
                <IoCloseOutline className="w-6 h-6 text-[#a3a3a3]" />
              </button>
            </div>

            <nav className="flex flex-col p-6 gap-2">
              {NAV_LINKS.map((link, index: number) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${isActive(link.path)
                      ? "bg-[#171717] text-[#8b6a55]"
                      : "text-[#d4d4d4] hover:bg-[#171717]"
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-lg font-medium">{t(link.name)}</span>
                  {isActive(link.path) && (
                    <IoChevronForward className="ml-auto text-[#8b6a55]" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default memo(Header);
