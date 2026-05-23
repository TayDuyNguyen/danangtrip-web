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
] as const;

/** Horizontal scrolling tab strip for mobile/tablet viewports */
export function ProfileMobileNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("settings");

  const basePath = pathname.replace(new RegExp(`^\\/${locale}`), "") || "/";

  return (
    <nav
      aria-label="Profile settings navigation"
      className="flex gap-1 min-w-max"
    >
      {MOBILE_TABS.map(({ key, labelKey, href, Icon }) => {
        const active = basePath === href;
        return (
          <Link
            key={key}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200",
              active
                ? "bg-[#8b6a55]/15 text-white border border-[#8b6a55]/40"
                : "bg-[#111111] text-[#737373] border border-[#262626] hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className={cn("w-3.5 h-3.5", active ? "text-[#8b6a55]" : "text-[#525252]")} />
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
