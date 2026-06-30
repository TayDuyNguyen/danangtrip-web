"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/features/auth";
import { PROTECTED_ROUTES } from "@/config/routes";
import { useAppStore } from "@/store/app.store";
import { PROFILE_NAV_ITEMS } from "@/features/profile/profileNavItems";
import { cn } from "@/utils/string";
import { resolveMediaUrl } from "@/utils/media-url";

export function ProfileSidebar() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("settings");
  const { setLoading } = useAppStore();

  /**
   * Strip locale prefix to get the base path for matching
   * e.g. "/vi/profile/password" -> "/profile/password"
   */
  const basePath = pathname.replace(new RegExp(`^\\/${locale}`), "") || "/";

  const isActive = (href: string) =>
    href === PROTECTED_ROUTES.PROFILE
      ? basePath === href
      : basePath === href || basePath.startsWith(`${href}/`);

  const displayName = user?.name || user?.email?.split("@")[0] || "?";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarUrl = resolveMediaUrl(user?.avatar);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);

  return (
    <aside
      aria-label="Profile navigation"
      className="w-full lg:w-64 shrink-0"
    >
      {/* User Avatar & Info */}
      <div className="mb-4 flex flex-col items-center gap-3 rounded-[20px] border border-border bg-white p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div
          className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-[#fff1f3] text-[20px] font-semibold text-primary transition-all duration-300 hover:border-primary"
          aria-hidden="true"
        >
          {avatarUrl && failedAvatarUrl !== avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={() => setFailedAvatarUrl(avatarUrl)}
            />
          ) : (
            avatarInitial
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-on-surface">{displayName}</p>
          <p className="mt-0.5 truncate text-xs text-on-surface-subtle">{user?.email}</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav
        aria-label="Profile settings navigation"
        className="overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
      >
        {PROFILE_NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isDestructive = item.key === "delete_account";
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => {
                if (!active) {
                  setLoading(true);
                }
              }}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all duration-200 relative group",
                "border-l-2",
                active
                  ? isDestructive
                    ? "border-l-red-500 bg-red-50 text-red-500"
                    : "border-l-primary bg-[#fff4f6] font-semibold text-primary"
                  : isDestructive
                  ? "border-l-transparent text-on-surface-subtle hover:text-red-500 hover:bg-red-50"
                  : "border-l-transparent text-on-surface-subtle hover:text-on-surface hover:bg-[#fafafa]",
                index !== 0 && "border-t border-t-border"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors duration-200",
                  active
                    ? isDestructive
                      ? "text-red-500"
                      : "text-primary"
                    : isDestructive
                    ? "text-[#525252] group-hover:text-red-500"
                    : "text-[#525252] group-hover:text-primary"
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
