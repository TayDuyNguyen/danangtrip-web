"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const t = useTranslations("common");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: "bg-[#1a1f14] text-[#929852] border-[#2f3b25]",
    error: "bg-[#2a1616] text-[#d88484] border-[#5f2f2f]",
    warning: "bg-[#2b1f14] text-[#c59a5f] border-[#5c3822]",
    info: "bg-[#171717] text-[#8b6a55] border-[#262626]",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-md ${typeStyles[type]} animate-fade-in`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{message}</span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 text-sm hover:opacity-70"
          aria-label={t("accessibility.close")}
        >
          ×
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type?: "success" | "error" | "warning" | "info";
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
