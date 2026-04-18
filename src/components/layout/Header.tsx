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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <span className="text-xl font-bold">D</span>
          </div>
          <span
            className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isScrolled
                ? "text-gray-900"
                : "text-white md:text-gray-900 lg:text-white"
              }`}
          >
            Đà Nẵng <span className="text-cyan-500">Trip</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-[14px] font-medium transition-all duration-300 hover:text-cyan-500 relative group truncate ${isActive(link.path)
                  ? "text-cyan-500"
                  : isScrolled
                    ? "text-gray-700"
                    : "text-white"
                }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-500 transition-all duration-300 ${isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
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
                className={`w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border transition-all ${isScrolled ? "border-cyan-500/20" : "border-white/20"
                  } hover:bg-cyan-500 hover:text-white`}
              >
                <IoPersonOutline className="text-xl" />
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 translate-y-2 opacity-0 invisible group-hover/user:translate-y-0 group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs text-gray-500">{t("auth.profile")}</p>
                  <p className="text-sm font-bold truncate text-gray-900">
                    {user?.name || "User"}
                  </p>
                </div>
                <Link
                  href={ROUTES.PROFILE}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t("auth.profile")}
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  {t("auth.logout")}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={ROUTES.LOGIN}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${isScrolled
                    ? "text-gray-900 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                  }`}
              >
                {t("auth.login")}
              </Link>
              <Link
                href={ROUTES.REGISTER || "/register"}
                className={`px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${isScrolled
                    ? "bg-cyan-500 text-white shadow-lg hover:shadow-cyan-500/40"
                    : "bg-white text-cyan-500 hover:bg-gray-50"
                  }`}
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={`p-4 -mr-4 lg:hidden text-3xl transition-colors ${isScrolled ? "text-gray-900" : "text-white"
              }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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

          <div className="lg:hidden fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white/95 backdrop-blur-md z-50 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span className="text-lg font-bold text-gray-900">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoCloseOutline className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <nav className="flex flex-col p-6 gap-2">
              {NAV_LINKS.map((link, index: number) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${isActive(link.path)
                      ? "bg-cyan-500/10 text-cyan-500"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-lg font-medium">{link.name}</span>
                  {isActive(link.path) && (
                    <IoChevronForward className="ml-auto text-cyan-500" />
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
