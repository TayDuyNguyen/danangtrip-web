"use client";

import { useState, useEffect, memo, useRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  IoMenuOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoChevronForward,
} from "@/components/icons/solar";
import { IoNotificationsOutline } from "react-icons/io5";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES, NAV_LINKS } from "@/config";
import LanguageSwitcher from "./LanguageSwitcher";
import { CartIcon } from "@/features/cart/components/CartIcon";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useNotificationsHeader } from "@/features/home/hooks/use-notifications-header";
import { formatRelativeTime } from "@/utils/format";
import type { Notification } from "@/types";

const Header = () => {
  const t = useTranslations("common");
  const tTour = useTranslations("tour");
  const tNotif = useTranslations("notifications");
  const locale = useLocale();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  const { unreadCount, notifications, markAllAsRead, markAsRead } = useNotificationsHeader();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useClickOutside(notificationRef, () => {
    setIsNotificationOpen(false);
  });

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markAllAsRead();
    } catch {
      // handled
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read_at) {
      try {
        await markAsRead(notif.id);
      } catch {
        // handled
      }
    }
    setIsNotificationOpen(false);
  };

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return pathname === ROUTES.HOME;
    }

    if (path === ROUTES.LOCATIONS) {
      return pathname === ROUTES.LOCATIONS ||
        pathname.startsWith(`${ROUTES.LOCATIONS}/`) ||
        pathname.startsWith("/categories/");
    }

    if (path === ROUTES.TOURS) {
      return pathname === ROUTES.TOURS ||
        pathname.startsWith(`${ROUTES.TOURS}/`) ||
        pathname.startsWith("/tour-categories/");
    }

    if (path === ROUTES.BLOG) {
      return pathname === ROUTES.BLOG || pathname.startsWith(`${ROUTES.BLOG}/`);
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
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
              className={`text-[13px] uppercase tracking-[0.18em] font-semibold transition-all duration-300 hover:text-primary relative group truncate ${
                isActive(link.path) ? "text-primary" : "text-on-surface-subtle"
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

          {/* Bell Icon & Dropdown */}
          {isAuthenticated && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="w-10 h-10 rounded-full bg-[#171717] flex items-center justify-center border border-[#262626] transition-all hover:border-[#8b6a55] hover:text-[#8b6a55] cursor-pointer relative"
                aria-label="Notifications"
              >
                <IoNotificationsOutline className="text-xl text-[#d4d4d4]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#171717] animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-[-60px] sm:right-0 mt-2 w-[340px] sm:w-[360px] bg-[#080808]/95 backdrop-blur-md rounded-xl shadow-2xl border border-[#262626] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]">
                    <span className="text-sm font-bold text-white">
                      {tNotif("page_title")}
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-[#8b6a55] hover:underline font-bold cursor-pointer"
                      >
                        {tNotif("mark_all_read")}
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-[#1c1c1c] no-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-4 flex gap-3 cursor-pointer hover:bg-[#111111] transition-colors ${
                            !notif.read_at ? "bg-[#111111]/30 font-semibold" : ""
                          }`}
                        >
                          {/* Left Type Indicator Icon */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                            notif.type.includes("booking") ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-[#8b6a55]/10 text-[#8b6a55] border border-[#8b6a55]/20"
                          }`}>
                            {notif.type.includes("booking") ? "🎫" : "🔔"}
                          </div>

                          {/* Detail */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-white truncate">
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-[#a3a3a3] line-clamp-2 mt-1 font-medium">
                              {notif.message}
                            </p>
                            <span className="text-[9px] text-[#737373] mt-2 block">
                              {formatRelativeTime(notif.created_at, locale === "vi" ? "vi-VN" : "en-US")}
                            </span>
                          </div>

                          {/* Unread Indicator */}
                          {!notif.read_at && (
                            <div className="w-2 h-2 bg-[#8b6a55] rounded-full mt-2 shrink-0 animate-pulse" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center text-xs text-[#737373] font-medium">
                        {tNotif("empty_state_all")}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-[#262626] text-center bg-[#0d0d0d]">
                    <Link
                      href={ROUTES.NOTIFICATIONS}
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-xs text-[#8b6a55] hover:underline font-bold"
                    >
                      {tNotif("view_detail")} →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          <CartIcon />

          {/* Auth Button */}
          {isAuthenticated ? (
            <div className="relative group/user">
              <button
                className={`w-10 h-10 rounded-full bg-[#171717] overflow-hidden flex items-center justify-center border border-[#262626] transition-all hover:border-[#8b6a55] hover:text-[#8b6a55] cursor-pointer`}
              >
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name || "User Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IoPersonOutline className="text-xl" />
                )}
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 bg-[#080808] rounded-lg shadow-xl border border-[#262626] overflow-hidden py-2 translate-y-2 opacity-0 invisible group-hover/user:translate-y-0 group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 z-50">
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
                <Link
                  href={ROUTES.BOOKINGS}
                  className="block px-4 py-2 text-sm text-[#d4d4d4] hover:bg-[#171717]"
                >
                  {tTour("history.header_link")}
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

            <nav className="flex flex-col p-6 gap-2 max-h-[calc(100vh-80px)] overflow-y-auto">
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

              {/* Authenticated user links in mobile drawer */}
              {isAuthenticated && (
                <div className="mt-4 pt-4 border-t border-[#262626] flex flex-col gap-2">
                  <div className="px-4 py-2 mb-1">
                    <p className="text-xs text-[#737373]">{t("auth.profile")}</p>
                    <p className="text-sm font-semibold truncate text-white">
                      {user?.name || t("auth.profile")}
                    </p>
                  </div>
                  <Link
                    href={ROUTES.PROFILE}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl text-[#d4d4d4] hover:bg-[#171717] transition-all duration-200"
                  >
                    <span className="text-lg font-medium">{t("auth.profile")}</span>
                  </Link>
                  <Link
                    href={ROUTES.BOOKINGS}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl text-[#d4d4d4] hover:bg-[#171717] transition-all duration-200"
                  >
                    <span className="text-lg font-medium">{tTour("history.header_link")}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-4 p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 text-left w-full"
                  >
                    <span className="text-lg font-medium">{t("auth.logout")}</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default memo(Header);
