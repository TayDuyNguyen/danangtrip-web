"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Lỗi</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Đã xảy ra lỗi
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          {error.message ||
            "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Thử lại
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
