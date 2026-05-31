/**
 * Organism: BlogDetailSkeleton
 * Matching the layout of the real Blog Detail page.
 */
export const BlogDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 pt-12 md:pt-20">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-[#eceff3]" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-[#eceff3]" />
            </div>
            <div className="h-12 w-3/4 animate-pulse rounded-xl bg-[#eceff3]" />
            <div className="flex gap-4">
              <div className="h-4 w-32 animate-pulse rounded bg-[#f3f4f6]" />
              <div className="h-4 w-32 animate-pulse rounded bg-[#f3f4f6]" />
            </div>
          </div>

          <div className="aspect-video w-full animate-pulse rounded-3xl bg-[#f3f4f6]" />

          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-[#f3f4f6]" />
            <div className="h-4 w-full animate-pulse rounded bg-[#f3f4f6]" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-[#f3f4f6]" />
            <div className="h-4 w-full animate-pulse rounded bg-[#f3f4f6]" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-[#f3f4f6]" />
          </div>

          <div className="flex gap-6 rounded-3xl border border-border bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
             <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-[#eceff3]" />
             <div className="flex-1 space-y-4">
                <div className="h-6 w-32 animate-pulse rounded bg-[#eceff3]" />
                <div className="h-4 w-full animate-pulse rounded bg-[#f3f4f6]" />
             </div>
          </div>
        </div>

        <div className="hidden space-y-8 lg:col-span-4 lg:block">
          <div className="h-64 w-full animate-pulse rounded-3xl bg-[#f3f4f6]" />
          <div className="h-48 w-full animate-pulse rounded-3xl bg-[#f3f4f6]" />
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex gap-4 rounded-2xl border border-border bg-white p-3 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
                  <div className="h-20 w-20 shrink-0 animate-pulse rounded-xl bg-[#eceff3]" />
                  <div className="flex-1 space-y-2 py-1">
                     <div className="h-4 w-full animate-pulse rounded bg-[#eceff3]" />
                     <div className="h-3 w-1/2 animate-pulse rounded bg-[#f3f4f6]" />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
