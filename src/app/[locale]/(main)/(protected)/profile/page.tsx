"use client";

import { useAuthStore } from "@/features/auth";

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thông tin cá nhân</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Số điện thoại</label>
            <p className="font-medium">{user.phone || "Chưa cập nhật"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Vai trò</label>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Ngày tham gia</label>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
