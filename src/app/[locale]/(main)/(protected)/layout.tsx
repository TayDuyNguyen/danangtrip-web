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

function ProtectedLoading({ label }: { label: string }) {
  return (
    <div className="design-page layout-main-shell flex min-h-screen items-center justify-center px-6" aria-busy="true" aria-label={label}>
      <div className="flex flex-col items-center gap-4 rounded-[20px] border border-border bg-white px-8 py-7 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f3] text-primary">
          <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </span>
        <p className="text-center text-sm font-medium text-on-surface-subtle">{label}</p>
      </div>
    </div>
  );
}

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
    return <ProtectedLoading label={t("common.auth_checking")} />;
  }

  const hasToken = !!getAccessToken();
  const showLoading = isLoading || (!isAuthenticated && hasToken);

  if (showLoading) {
    return <ProtectedLoading label={t("common.auth_checking")} />;
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
