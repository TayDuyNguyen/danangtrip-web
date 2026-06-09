"use client";

import { memo, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ROUTES, NAV_LINKS } from "@/config";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationsHeader } from "@/features/home/hooks/use-notifications-header";
import { useClickOutside } from "@/hooks/use-click-outside";
import { formatRelativeTime } from "@/utils/format";
import type { Notification } from "@/types";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  IoChevronForward,
  IoCloseOutline,
  IoMenuOutline,
  IoPersonOutline,
  IoHouseOutline,
  IoLocationOutline,
  IoMapOutline,
  IoPlaneOutline,
  IoNewspaperOutline,
  IoMailOutline,
} from "@/components/icons/solar";
import { IoNotificationsOutline } from "react-icons/io5";

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "nav.home": IoHouseOutline,
  "nav.locations": IoLocationOutline,
  "nav.map": IoMapOutline,
  "nav.travel": IoPlaneOutline,
  "nav.blog": IoNewspaperOutline,
  "nav.contact": IoMailOutline,
};

const CartIcon = dynamic(
  () => import("@/features/cart/components/CartIcon").then((mod) => mod.CartIcon),
  {
    ssr: false,
    loading: () => (
      <span
        aria-hidden
        className="h-10 w-10 rounded-full border border-border bg-white/70"
      />
    ),
  }
);

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(notificationRef, () => setIsNotificationOpen(false));
  useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) return pathname === ROUTES.HOME;
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
    if (path === ROUTES.BLOG) return pathname === ROUTES.BLOG || pathname.startsWith(`${ROUTES.BLOG}/`);
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markAllAsRead();
    } catch {
      // ignore
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read_at) {
      try {
        await markAsRead(notif.id);
      } catch {
        // ignore
      }
    }
    setIsNotificationOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] pt-3">
      <div className="container">
        <div
          className={`mx-auto flex h-[76px] items-center justify-between rounded-[30px] border px-4 backdrop-blur-xl transition-all duration-300 sm:px-6 ${
            isScrolled
              ? "border-primary/30 bg-white shadow-[0_12px_34px_rgba(255,56,92,0.08)]"
              : "border-border/80 bg-white/92 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          }`}
        >
          <Link href={ROUTES.HOME} className="flex items-center gap-3 shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff385c] text-base font-bold text-white shadow-[0_10px_24px_rgba(255,56,92,0.28)]">
              D
            </div>
            <div className="hidden 2xl:block">
              <p className="text-[15px] font-semibold tracking-[-0.02em] text-on-surface leading-tight">
                {t("common.brand_name")}
              </p>
              <p className="text-[12px] text-on-surface-subtle">
                {t("common.brand_subtitle")}
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center rounded-full border border-border bg-white px-2 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            {NAV_LINKS.map((link) => {
              const Icon = NAV_ICONS[link.name];
              const isLinkActive = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  aria-current={isLinkActive ? "page" : undefined}
                  className={`group/nav-item relative flex items-center rounded-full px-3 py-2.5 text-[14px] transition-all duration-300 hover:scale-105 active:scale-95 group-hover/nav-item:px-5 xl:px-5 ${
                    isLinkActive
                      ? "border border-[#ebebeb] bg-white text-[#222222] font-semibold shadow-[0_6px_18px_rgba(15,23,42,0.10)]"
                      : "border border-transparent text-[#5f5f5f] font-medium hover:bg-[#f7f7f7] hover:text-[#222222]"
                  }`}
                >
                  {Icon && (
                    <Icon 
                      className={`w-[18px] h-[18px] shrink-0 transition-colors duration-200 ${
                        isLinkActive ? "text-primary" : "text-[#5f5f5f] group-hover/nav-item:text-primary"
                      }`} 
                    />
                  )}
                  <span className="text-[14px] transition-all duration-300 max-w-0 opacity-0 overflow-hidden group-hover/nav-item:max-w-[120px] group-hover/nav-item:opacity-100 group-hover/nav-item:ml-2 xl:max-w-[120px] xl:opacity-100 xl:ml-2 whitespace-nowrap">
                    {t(link.name)}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher isScrolled={true} />
            </div>

            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setIsNotificationOpen((value) => !value)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#f7f7f7] text-on-surface transition-colors hover:border-[#cfcfcf] hover:bg-white"
                  aria-label="Notifications"
                >
                  <IoNotificationsOutline className="text-[18px]" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#ff385c]" />
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-[340px] overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_20px_55px_rgba(0,0,0,0.16)]">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <span className="text-sm font-semibold text-on-surface">{tNotif("page_title")}</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          {tNotif("mark_all_read")}
                        </button>
                      )}
                    </div>

                    <div className="max-h-[320px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`flex cursor-pointer gap-3 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-[#fafafa] ${
                              !notif.read_at ? "bg-[#fff8f9]" : ""
                            }`}
                          >
                            <div
                              className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                notif.type.includes("booking")
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-rose-50 text-primary"
                              }`}
                            >
                              {notif.type.includes("booking") ? "T" : "N"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] font-semibold text-on-surface">{notif.title}</p>
                              <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-on-surface-subtle">
                                {notif.message}
                              </p>
                              <span className="mt-2 block text-[11px] text-on-surface-variant">
                                {formatRelativeTime(notif.created_at, locale === "vi" ? "vi-VN" : "en-US")}
                              </span>
                            </div>
                            {!notif.read_at && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-10 text-center text-sm text-on-surface-subtle">
                          {tNotif("empty_state_all")}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border bg-[#fafafa] px-4 py-3">
                      <Link
                        href={ROUTES.NOTIFICATIONS}
                        onClick={() => setIsNotificationOpen(false)}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {tNotif("view_detail")}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            <CartIcon />

            {isAuthenticated ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="flex items-center justify-center gap-0 2xl:gap-2 rounded-full border border-border bg-white w-10 h-10 p-0 2xl:w-auto 2xl:h-auto 2xl:p-1.5 2xl:pr-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-colors hover:shadow-[0_5px_16px_rgba(0,0,0,0.09)]"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="flex h-8 w-8 2xl:h-9 2xl:w-9 items-center justify-center overflow-hidden rounded-full bg-[#f7f7f7] text-on-surface shrink-0">
                    {user?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar} alt={user.name || "User Avatar"} className="h-full w-full object-cover" />
                    ) : (
                      <IoPersonOutline className="text-[18px]" />
                    )}
                  </div>
                  <span className="hidden 2xl:inline-block max-w-[110px] truncate text-sm font-medium text-on-surface ml-0 2xl:ml-2">
                    {user?.name || t("auth.profile")}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-[24px] border border-border bg-white py-2 shadow-[0_18px_48px_rgba(0,0,0,0.16)] animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-xs text-on-surface-subtle">{t("auth.profile")}</p>
                      <p className="truncate text-sm font-semibold text-on-surface">{user?.name || t("auth.profile")}</p>
                    </div>
                    <Link
                      href={ROUTES.PROFILE}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-on-surface hover:bg-[#f7f7f7] transition-colors"
                    >
                      {t("auth.profile")}
                    </Link>
                    <Link
                      href={ROUTES.BOOKINGS}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-on-surface hover:bg-[#f7f7f7] transition-colors"
                    >
                      {tTour("history.header_link")}
                    </Link>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); logout(); }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      {t("auth.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href={ROUTES.LOGIN}
                  className="rounded-full px-4 py-2 text-sm font-medium text-on-surface hover:bg-[#f7f7f7]"
                >
                  {t("auth.login")}
                </Link>
                <Link
                  href={ROUTES.REGISTER || "/register"}
                  className="rounded-full bg-[#ff385c] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,56,92,0.24)] transition-colors hover:bg-[#e31c5f]"
                >
                  {t("auth.register")}
                </Link>
              </div>
            )}

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-on-surface lg:hidden"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              aria-label={isMobileMenuOpen ? t("accessibility.close_menu") : t("accessibility.open_menu")}
            >
              {isMobileMenuOpen ? <IoCloseOutline className="text-[22px]" /> : <IoMenuOutline className="text-[22px]" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed right-3 top-24 z-50 w-[min(92vw,360px)] overflow-hidden rounded-[30px] border border-border bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)] lg:hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="text-base font-semibold text-on-surface">{t("common.menu")}</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7f7f7] text-on-surface"
                aria-label={t("accessibility.close_menu")}
              >
                <IoCloseOutline className="text-[20px]" />
              </button>
            </div>

            <nav className="flex max-h-[70vh] flex-col overflow-y-auto p-4">
              {NAV_LINKS.map((link) => {
                const Icon = NAV_ICONS[link.name];
                const isLinkActive = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors ${
                      isLinkActive
                        ? "bg-[#fff4f6] font-semibold text-primary"
                        : "text-on-surface hover:bg-[#f7f7f7]"
                    }`}
                  >
                    {Icon && <Icon className={`w-5 h-5 shrink-0 ${isLinkActive ? "text-primary" : "text-on-surface-subtle"}`} />}
                    <span>{t(link.name)}</span>
                    {isLinkActive && <IoChevronForward className="ml-auto text-[16px]" />}
                  </Link>
                );
              })}

              {isAuthenticated && (
                <div className="mt-3 border-t border-border pt-3">
                  <Link
                    href={ROUTES.PROFILE}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm text-on-surface hover:bg-[#f7f7f7]"
                  >
                    {t("auth.profile")}
                  </Link>
                  <Link
                    href={ROUTES.BOOKINGS}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm text-on-surface hover:bg-[#f7f7f7]"
                  >
                    {tTour("history.header_link")}
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="mt-1 w-full rounded-2xl px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50"
                  >
                    {t("auth.logout")}
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
