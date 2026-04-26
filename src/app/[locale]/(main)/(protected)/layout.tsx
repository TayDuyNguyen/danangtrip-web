"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useTranslations } from "next-intl";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthStore();
  const t = useTranslations("common");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="design-page min-h-screen animate-pulse" aria-busy="true" aria-label={t("common.auth_checking")}>
        <div className="design-container py-10 space-y-6">
          <div className="h-9 w-56 rounded-lg bg-surface-container-high" />
          <div className="h-48 w-full max-w-2xl rounded-xl border border-border bg-surface-container-low" />
          <div className="h-32 w-full max-w-2xl rounded-xl border border-border bg-surface-container-low" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="design-page min-h-screen flex items-center justify-center px-6">
        <p className="text-sm text-on-surface-subtle text-center">{t("common.redirecting_login")}</p>
      </div>
    );
  }

  return (
    <div className="design-page min-h-screen">
      <div className="design-container py-6">
        {children}
      </div>
    </div>
  );
}
