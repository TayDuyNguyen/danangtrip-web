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
      className={`bg-[#030303] text-white transition-all duration-300 border-r border-[#262626] ${
        sidebar.isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-[#262626]">
        <button
          onClick={toggleSidebarCollapse}
          className="w-full text-left text-[#a3a3a3] hover:text-[#8b6a55] font-semibold"
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
                ? "text-[#8b6a55] bg-[#171717] border-l-2 border-[#8b6a55]"
                : "text-[#d4d4d4] hover:bg-[#171717] hover:text-[#8b6a55]"
            }`}
          >
            {sidebar.isCollapsed ? item.label[0] : item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
