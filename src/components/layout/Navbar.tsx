"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui";
import { useTranslations } from "next-intl";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const t = useTranslations("common");

  return (
    <nav className="bg-white border-b px-4 py-3 flex justify-between items-center">
      <Link href="/dashboard" className="font-bold text-lg">
        {t("common.admin_panel")}
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <span className="text-gray-600">{user.name}</span>
            <Button variant="secondary" size="sm" onClick={logout}>
              {t("auth.logout")}
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="primary" size="sm">{t("auth.login")}</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
