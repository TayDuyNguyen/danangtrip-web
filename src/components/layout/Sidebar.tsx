"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/store/app.store";

export function Sidebar() {
  const { sidebar, toggleSidebarCollapse } = useAppStore();
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const tDashboardAdmin = useTranslations("dashboardAdmin");

  const menuItems = [
    { label: tCommon("dashboard.title"), href: "/dashboard" },
    { label: tDashboardAdmin("users.title"), href: "/dashboard/users" },
    { label: tDashboardAdmin("settings.title"), href: "/dashboard/settings" },
  ];

  return (
    <aside
      className={`bg-surface-container-lowest text-on-surface transition-all duration-300 border-r border-border ${
        sidebar.isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-border">
        <button
          onClick={toggleSidebarCollapse}
          className="w-full text-left text-on-surface-subtle hover:text-primary font-semibold cursor-pointer"
        >
          {sidebar.isCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              pathname === item.href
                ? "text-primary bg-surface-container border-l-2 border-primary"
                : "text-on-surface-subtle hover:bg-surface-container hover:text-primary"
            }`}
          >
            {sidebar.isCollapsed ? item.label[0] : item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
