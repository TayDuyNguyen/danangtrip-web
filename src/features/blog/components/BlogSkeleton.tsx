"use client";

export const PostCardSkeleton = () => (
  <div className="glass-surface rounded-3xl overflow-hidden animate-pulse">
    <div className="aspect-16/10 bg-neutral-800" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-neutral-800 rounded w-1/4" />
      <div className="h-6 bg-neutral-800 rounded w-3/4" />
      <div className="h-4 bg-neutral-800 rounded w-full" />
      <div className="pt-4 flex justify-between">
        <div className="h-4 bg-neutral-800 rounded w-1/4" />
        <div className="h-4 bg-neutral-800 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export const FeaturedPostSkeleton = () => (
  <div className="glass-surface rounded-[32px] overflow-hidden animate-pulse flex flex-col md:flex-row h-auto md:h-[400px]">
    <div className="w-full md:w-1/2 bg-neutral-800" />
    <div className="w-full md:w-1/2 p-8 md:p-12 space-y-6">
      <div className="h-4 bg-neutral-800 rounded w-1/4" />
      <div className="h-10 bg-neutral-800 rounded w-3/4" />
      <div className="h-4 bg-neutral-800 rounded w-full" />
      <div className="h-4 bg-neutral-800 rounded w-5/6" />
      <div className="pt-6">
        <div className="h-12 bg-neutral-800 rounded-full w-40" />
      </div>
    </div>
  </div>
);

export const SidebarSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="space-y-4">
      <div className="h-6 bg-neutral-800 rounded w-1/2" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 bg-neutral-800 rounded w-1/3" />
          <div className="h-4 bg-neutral-800 rounded w-8" />
        </div>
      ))}
    </div>
    <div className="space-y-4">
      <div className="h-6 bg-neutral-800 rounded w-1/2" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="w-16 h-16 bg-neutral-800 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-800 rounded w-full" />
            <div className="h-4 bg-neutral-800 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
