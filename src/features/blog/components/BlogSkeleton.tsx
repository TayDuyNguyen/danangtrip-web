"use client";

export const PostCardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-3xl border border-border bg-white shadow-[0_14px_36px_rgba(0,0,0,0.07)]">
    <div className="aspect-16/10 bg-[#f3f4f6]" />
    <div className="space-y-4 p-6">
      <div className="h-4 w-1/4 rounded bg-[#eceff3]" />
      <div className="h-6 w-3/4 rounded bg-[#eceff3]" />
      <div className="h-4 w-full rounded bg-[#f3f4f6]" />
      <div className="flex justify-between pt-4">
        <div className="h-4 w-1/4 rounded bg-[#eceff3]" />
        <div className="h-4 w-1/4 rounded bg-[#eceff3]" />
      </div>
    </div>
  </div>
);

export const FeaturedPostSkeleton = () => (
  <div className="flex h-auto animate-pulse flex-col overflow-hidden rounded-[32px] border border-border bg-white shadow-[0_18px_48px_rgba(0,0,0,0.08)] md:h-[400px] md:flex-row">
    <div className="w-full bg-[#f3f4f6] md:w-1/2" />
    <div className="w-full space-y-6 p-8 md:w-1/2 md:p-12">
      <div className="h-4 w-1/4 rounded bg-[#eceff3]" />
      <div className="h-10 w-3/4 rounded bg-[#eceff3]" />
      <div className="h-4 w-full rounded bg-[#f3f4f6]" />
      <div className="h-4 w-5/6 rounded bg-[#f3f4f6]" />
      <div className="pt-6">
        <div className="h-12 w-40 rounded-full bg-[#eceff3]" />
      </div>
    </div>
  </div>
);

export const SidebarSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="space-y-4 rounded-[28px] border border-border bg-white p-6 shadow-[0_14px_36px_rgba(0,0,0,0.06)]">
      <div className="h-6 w-1/2 rounded bg-[#eceff3]" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 w-1/3 rounded bg-[#f3f4f6]" />
          <div className="h-4 w-8 rounded bg-[#f3f4f6]" />
        </div>
      ))}
    </div>
    <div className="space-y-4 rounded-[28px] border border-border bg-white p-6 shadow-[0_14px_36px_rgba(0,0,0,0.06)]">
      <div className="h-6 w-1/2 rounded bg-[#eceff3]" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="h-16 w-16 shrink-0 rounded-lg bg-[#f3f4f6]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full rounded bg-[#f3f4f6]" />
            <div className="h-4 w-2/3 rounded bg-[#f3f4f6]" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CategoryTabsSkeleton = () => (
  <div className="no-scrollbar flex items-center gap-3 overflow-x-auto pb-4 animate-pulse" aria-hidden>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-10 w-24 shrink-0 rounded-full bg-[#eceff3]" />
    ))}
  </div>
);
