"use client";

import Link from "next/link";
import { useAppStore } from "@/store/app.store";

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/dashboard/users" },
  { label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const { sidebar, toggleSidebarCollapse } = useAppStore();

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 ${
        sidebar.isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4">
        <button
          onClick={toggleSidebarCollapse}
          className="w-full text-left text-gray-400 hover:text-white"
        >
          {sidebar.isCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            {sidebar.isCollapsed ? item.label[0] : item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
