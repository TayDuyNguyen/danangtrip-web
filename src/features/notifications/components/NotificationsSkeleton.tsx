import React from "react";

export function NotificationsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-[#080808]/40 border border-[#262626] rounded-2xl p-4 md:p-5 flex gap-4 items-start backdrop-blur-md"
        >
          {/* Skeleton Icon */}
          <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0" />
          
          {/* Skeleton Content */}
          <div className="flex-grow space-y-2">
            <div className="h-4 bg-white/10 rounded w-1/3" />
            <div className="h-3 bg-white/5 rounded w-3/4" />
            <div className="h-2.5 bg-white/5 rounded w-1/4" />
          </div>

          {/* Skeleton Actions */}
          <div className="w-8 h-8 rounded-lg bg-white/5 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
