import React from "react";

export function NotificationsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 rounded-[24px] border border-border bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] md:p-5"
        >
          {/* Skeleton Icon */}
          <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-[#f0f0f0]" />
          
          {/* Skeleton Content */}
          <div className="flex-grow space-y-2">
            <div className="h-4 w-1/3 rounded bg-[#f0f0f0]" />
            <div className="h-3 w-3/4 rounded bg-[#f5f5f5]" />
            <div className="h-2.5 w-1/4 rounded bg-[#f5f5f5]" />
          </div>

          {/* Skeleton Actions */}
          <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-[#f0f0f0]" />
        </div>
      ))}
    </div>
  );
}
