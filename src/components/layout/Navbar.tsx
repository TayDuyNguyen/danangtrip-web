"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white border-b px-4 py-3 flex justify-between items-center">
      <Link href="/dashboard" className="font-bold text-lg">
        Admin Panel
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <span className="text-gray-600">{user.name}</span>
            <Button variant="secondary" size="sm" onClick={logout}>
              Đăng xuất
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="primary" size="sm">Đăng nhập</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
