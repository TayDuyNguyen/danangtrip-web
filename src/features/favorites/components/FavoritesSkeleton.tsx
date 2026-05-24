"use client";

import React from "react";

interface FavoritesSkeletonProps {
  view: "grid" | "list";
}

export function FavoritesSkeleton({ view }: FavoritesSkeletonProps) {
  if (view === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-[#080808]/40 border border-[#262626] rounded-2xl overflow-hidden aspect-4/5 flex flex-col justify-end p-6 relative animate-pulse"
          >
            {/* Background image skeleton */}
            <div className="absolute inset-0 bg-[#171717]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="relative z-10 space-y-3">
              {/* Category/District Badge */}
              <div className="w-20 h-5 bg-[#262626] rounded-full" />
              {/* Title */}
              <div className="w-3/4 h-6 bg-[#262626] rounded-md" />
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-5 bg-[#262626] rounded" />
                <div className="w-20 h-4 bg-[#262626] rounded" />
              </div>
              {/* Price & CTA */}
              <div className="flex items-center justify-between border-t border-[#262626] pt-4 mt-2">
                <div className="space-y-1">
                  <div className="w-12 h-3 bg-[#262626] rounded" />
                  <div className="w-24 h-5 bg-[#262626] rounded" />
                </div>
                <div className="w-24 h-8 bg-[#262626] rounded-lg" />
              </div>
            </div>

            {/* Top-Right Heart button skeleton */}
            <div className="absolute top-6 right-6 w-12 h-12 bg-[#171717] rounded-full border border-[#262626]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-[#080808]/40 border border-[#262626] rounded-2xl p-5 flex flex-col md:flex-row gap-5 animate-pulse relative"
        >
          {/* Thumbnail Skeleton */}
          <div className="w-full md:w-48 h-36 bg-[#171717] rounded-xl shrink-0" />

          {/* Details Skeleton */}
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-16 h-4 bg-[#262626] rounded" />
                <div className="w-24 h-4 bg-[#262626] rounded" />
              </div>
              <div className="w-1/2 h-7 bg-[#262626] rounded-lg" />
              <div className="w-3/4 h-4 bg-[#262626] rounded" />
            </div>

            <div className="flex items-center justify-between border-t border-[#262626] pt-4 mt-4 md:mt-0">
              <div className="space-y-1">
                <div className="w-12 h-3 bg-[#262626] rounded" />
                <div className="w-24 h-5 bg-[#262626] rounded" />
              </div>
              <div className="w-28 h-9 bg-[#262626] rounded-xl" />
            </div>
          </div>

          {/* Delete Heart Button Skeleton */}
          <div className="absolute top-5 right-5 w-10 h-10 bg-[#171717] rounded-full border border-[#262626]" />
        </div>
      ))}
    </div>
  );
}
