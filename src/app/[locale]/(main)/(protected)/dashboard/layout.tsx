"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/features/auth";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations("common");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="design-page flex min-h-screen animate-pulse" aria-busy="true" aria-label={t("common.auth_checking")}>
        <div className="hidden md:block w-64 shrink-0 border-r border-border bg-surface-container-lowest p-4 space-y-4">
          <div className="h-10 rounded-lg bg-surface-container-high" />
          <div className="h-8 rounded-lg bg-surface-container-high" />
          <div className="h-8 rounded-lg bg-surface-container-high" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b border-border bg-surface-container-low" />
          <main className="flex-1 p-6 space-y-4">
            <div className="h-10 w-1/3 rounded-lg bg-surface-container-high" />
            <div className="h-64 rounded-xl border border-border bg-surface-container-low" />
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="design-page flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-on-surface-subtle text-on-surface-subtleenter">{t("common.redirecting_login")}</p>
      </div>
    );
  }

  return (
    <div className="design-page flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
