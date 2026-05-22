"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight, Home } from "lucide-react";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileMobileNav } from "./ProfileMobileNav";

interface BreadcrumbItem {
  /** Translation key relative to 'settings.breadcrumb' namespace */
  labelKey: string;
  /** If provided, renders as a clickable link */
  href?: string;
}

interface ProfileLayoutWrapperProps {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

export function ProfileLayoutWrapper({
  children,
  breadcrumbs,
}: ProfileLayoutWrapperProps) {
  const t = useTranslations("settings");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[#525252] mb-8 reveal-up"
      >
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-[#8b6a55] transition-colors duration-200"
          aria-label={t("breadcrumb.home")}
        >
          <Home className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t("breadcrumb.home")}</span>
        </Link>

        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-[#333333]" aria-hidden="true" />
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-[#8b6a55] transition-colors duration-200"
              >
                {t(crumb.labelKey)}
              </Link>
            ) : (
              <span className="text-[#737373]" aria-current="page">
                {t(crumb.labelKey)}
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Mobile: Horizontal tab strip */}
      <div className="lg:hidden w-full overflow-x-auto pb-2 mb-6 reveal-up">
        <ProfileMobileNav />
      </div>

      {/* Desktop: Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar – visible only on lg+ */}
        <div className="hidden lg:block shrink-0 reveal-up reveal-delay-100">
          <ProfileSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 reveal-up reveal-delay-200">
          {children}
        </main>
      </div>
    </div>
  );
}
