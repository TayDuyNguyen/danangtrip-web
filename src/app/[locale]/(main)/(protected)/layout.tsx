"use client";

import { useEffect, useSyncExternalStore, Suspense } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/features/auth";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { getAccessToken } from "@/utils/auth.helper";

const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function AuthChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const t = useTranslations("common");
  const isMounted = useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);

  useEffect(() => {
    if (!isMounted) return;

    const hasToken = !!getAccessToken();
    if (!isLoading && !isAuthenticated && !hasToken) {
      const queryString = searchParams.toString();
      const callbackUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }, [isMounted, isAuthenticated, isLoading, router, pathname, searchParams]);

  if (!isMounted) {
    return (
      <div className="design-page layout-main-shell min-h-screen animate-pulse" aria-busy="true" aria-label={t("common.auth_checking")}>
        <div className="design-container py-10 space-y-6">
          <div className="h-9 w-56 rounded-lg bg-surface-container-high" />
          <div className="h-48 w-full max-w-2xl rounded-xl border border-border bg-surface-container-low" />
          <div className="h-32 w-full max-w-2xl rounded-xl border border-border bg-surface-container-low" />
        </div>
      </div>
    );
  }

  const hasToken = !!getAccessToken();
  const showLoading = isLoading || (!isAuthenticated && hasToken);

  if (showLoading) {
    return (
      <div className="design-page layout-main-shell min-h-screen animate-pulse" aria-busy="true" aria-label={t("common.auth_checking")}>
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
      <div className="design-page layout-main-shell min-h-screen flex items-center justify-center px-6">
        <p className="text-center text-sm text-on-surface-subtle">{t("common.redirecting_login")}</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="design-page layout-main-shell min-h-screen">
      <div className="design-container py-6">
        <Suspense fallback={null}>
          <AuthChecker>{children}</AuthChecker>
        </Suspense>
      </div>
    </div>
  );
}
