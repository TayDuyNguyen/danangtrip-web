"use client";

import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/features/auth";
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

interface SidebarItem {
  key: string;
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    key: "profile",
    labelKey: "sidebar.profile",
    href: PROTECTED_ROUTES.PROFILE,
    icon: User,
  },
  {
    key: "change_password",
    labelKey: "sidebar.change_password",
    href: PROTECTED_ROUTES.PASSWORD,
    icon: Lock,
  },
  {
    key: "ratings",
    labelKey: "sidebar.ratings",
    href: PROTECTED_ROUTES.RATINGS,
    icon: Star,
  },
  {
    key: "recommendations",
    labelKey: "sidebar.recommendations",
    href: PROTECTED_ROUTES.RECOMMENDATIONS,
    icon: Sparkles,
  },
  {
    key: "bookings",
    labelKey: "sidebar.bookings",
    href: PROTECTED_ROUTES.BOOKINGS,
    icon: BookOpen,
  },
  {
    key: "favorites",
    labelKey: "sidebar.favorites",
    href: PROTECTED_ROUTES.FAVORITES,
    icon: Heart,
  },
  {
    key: "notifications",
    labelKey: "sidebar.notifications",
    href: PROTECTED_ROUTES.NOTIFICATIONS,
    icon: Bell,
  },
];

export function ProfileSidebar() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("settings");

  /**
   * Strip locale prefix to get the base path for matching
   * e.g. "/vi/profile/password" -> "/profile/password"
   */
  const basePath = pathname.replace(new RegExp(`^\\/${locale}`), "") || "/";

  const isActive = (href: string) => basePath === href;

  const avatarInitial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <aside
      aria-label="Profile navigation"
      className="w-full lg:w-64 shrink-0"
    >
      {/* User Avatar & Info */}
      <div className="bg-[#0a0a0a]/60 border border-[#262626] rounded-xl p-6 mb-4 backdrop-blur-md flex flex-col items-center gap-3 text-center">
        <div
          className="w-16 h-16 bg-[#171717] text-white rounded-xl border border-[#262626] flex items-center justify-center text-2xl font-bold
            hover:border-[#8b6a55] transition-all duration-300"
          aria-hidden="true"
        >
          {avatarInitial}
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
          <p className="text-[#737373] text-xs truncate mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav
        aria-label="Profile settings navigation"
        className="bg-[#0a0a0a]/60 border border-[#262626] rounded-xl overflow-hidden backdrop-blur-md"
      >
        {SIDEBAR_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all duration-200 relative group",
                "border-l-2",
                active
                  ? "border-l-[#8b6a55] bg-[#8b6a55]/8 text-white"
                  : "border-l-transparent text-[#737373] hover:text-white hover:bg-white/5",
                index !== 0 && "border-t border-t-[#1a1a1a]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors duration-200",
                  active ? "text-[#8b6a55]" : "text-[#525252] group-hover:text-[#8b6a55]"
                )}
              />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
