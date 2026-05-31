"use client";

import { useTranslations } from "next-intl";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  const t = useTranslations("common");
  const displayTitle = title || t("common.no_data");
  const displayDescription = description || t("common.no_data_desc");

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      {icon ? (
        <div className="mb-4 text-on-surface-subtle">{icon}</div>
      ) : (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-[#f7f7f7]">
          <svg
            className="h-8 w-8 text-on-surface-subtle"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H4"
            />
          </svg>
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-on-surface">{displayTitle}</h3>
      <p className="mb-6 max-w-sm text-sm text-on-surface-subtle">{displayDescription}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
