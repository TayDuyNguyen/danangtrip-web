"use client";

import { useAuthStore } from "@/features/auth";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">Dashboard</h1>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 mb-8">
        <p className="text-xl text-gray-700 leading-relaxed">
          Chào mừng, <span className="font-bold text-cyan-500">{user?.name || "Tài khoản"}</span>! Đây là trang cá nhân của bạn.
        </p>
        <p className="text-gray-500 mt-4">
          Hệ thống đang được cập nhật thêm các tính năng mới. Vui lòng quay lại sau!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Trạng thái tài khoản</h3>
          <p className="text-lg font-bold text-green-500">Đang hoạt động</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Loại tài khoản</h3>
          <p className="text-lg font-bold text-gray-900">{user?.role || "Thành viên"}</p>
        </div>
      </div>
    </div>
  );
}
