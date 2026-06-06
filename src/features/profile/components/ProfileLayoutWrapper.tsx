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
    <div className="mx-auto w-full max-w-6xl overflow-hidden px-0 py-8 sm:px-4 sm:py-10">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-1.5 text-xs text-on-surface-subtle reveal-up"
      >
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
          aria-label={t("breadcrumb.home")}
        >
          <Home className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t("breadcrumb.home")}</span>
        </Link>

        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-[#c4c4c4]" aria-hidden="true" />
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-primary transition-colors duration-200"
              >
                {t(crumb.labelKey)}
              </Link>
            ) : (
              <span className="text-on-surface-subtle" aria-current="page">
                {t(crumb.labelKey)}
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Mobile: Horizontal tab strip */}
      <div className="lg:hidden w-full max-w-full overflow-x-auto pb-2 mb-6 reveal-up no-scrollbar">
        <ProfileMobileNav />
      </div>

      {/* Desktop: Two-column layout */}
      <div className="flex w-full max-w-full flex-col items-start gap-8 lg:flex-row">
        {/* Sidebar – visible only on lg+ */}
        <div className="hidden lg:block shrink-0 reveal-up reveal-delay-100">
          <ProfileSidebar />
        </div>

        {/* Main content */}
        <main className="w-full min-w-0 max-w-full flex-1 reveal-up reveal-delay-200">
          {children}
        </main>
      </div>
    </div>
  );
}
