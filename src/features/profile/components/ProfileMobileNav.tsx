"use client";

import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PROTECTED_ROUTES } from "@/config/routes";
import {
  User,
  Lock,
  BookOpen,
  Heart,
  Bell,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { cn } from "@/utils/string";

const MOBILE_TABS = [
  { key: "profile", labelKey: "sidebar.profile", href: PROTECTED_ROUTES.PROFILE, Icon: User },
  { key: "change_password", labelKey: "sidebar.change_password", href: PROTECTED_ROUTES.PASSWORD, Icon: Lock },
  { key: "ratings", labelKey: "sidebar.ratings", href: PROTECTED_ROUTES.RATINGS, Icon: Star },
  { key: "recommendations", labelKey: "sidebar.recommendations", href: PROTECTED_ROUTES.RECOMMENDATIONS, Icon: Sparkles },
  { key: "bookings", labelKey: "sidebar.bookings", href: PROTECTED_ROUTES.BOOKINGS, Icon: BookOpen },
  { key: "favorites", labelKey: "sidebar.favorites", href: PROTECTED_ROUTES.FAVORITES, Icon: Heart },
  { key: "notifications", labelKey: "sidebar.notifications", href: PROTECTED_ROUTES.NOTIFICATIONS, Icon: Bell },
  { key: "delete_account", labelKey: "sidebar.delete_account", href: PROTECTED_ROUTES.DELETE_ACCOUNT, Icon: Trash2 },
] as const;

/** Horizontal scrolling tab strip for mobile/tablet viewports */
export function ProfileMobileNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("settings");

  const basePath = pathname.replace(new RegExp(`^\\/${locale}`), "") || "/";
  const isActive = (href: string) =>
    href === PROTECTED_ROUTES.PROFILE
      ? basePath === href
      : basePath === href || basePath.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Profile settings navigation"
      className="flex gap-1 min-w-max"
    >
      {MOBILE_TABS.map(({ key, labelKey, href, Icon }) => {
        const active = isActive(href);
        const isDestructive = key === "delete_account";
        return (
          <Link
            key={key}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200",
              active
                ? isDestructive
                  ? "bg-red-500/15 text-red-500 border border-red-500/40"
                  : "border border-primary/30 bg-primary/10 font-semibold text-primary"
                : isDestructive
                ? "border border-red-500/10 bg-white text-red-400 hover:bg-red-500/5 hover:text-red-500"
                : "border border-border bg-white text-on-surface-subtle hover:bg-[#f7f7f7] hover:text-on-surface"
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", active ? (isDestructive ? "text-red-500" : "text-primary") : "text-on-surface-subtle")} />
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
