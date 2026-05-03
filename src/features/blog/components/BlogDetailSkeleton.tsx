/**
 * Organism: BlogDetailSkeleton
 * Matching the layout of the real Blog Detail page.
 */
export const BlogDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 pt-12 md:pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-12">
          {/* Header Skeleton */}
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-neutral-800 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-neutral-800 rounded-full animate-pulse" />
            </div>
            <div className="h-12 w-3/4 bg-neutral-800 rounded-xl animate-pulse" />
            <div className="flex gap-4">
              <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse" />
              <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Featured Image Skeleton */}
          <div className="aspect-video w-full bg-neutral-800 rounded-3xl animate-pulse" />

          {/* Content Skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-neutral-800 rounded animate-pulse" />
          </div>

          {/* Author Card Skeleton */}
          <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 animate-pulse flex gap-6">
             <div className="w-20 h-20 rounded-full bg-neutral-800 shrink-0" />
             <div className="flex-1 space-y-4">
                <div className="h-6 w-32 bg-neutral-800 rounded" />
                <div className="h-4 w-full bg-neutral-800 rounded" />
             </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8 hidden lg:block">
          <div className="h-64 w-full bg-neutral-800 rounded-3xl animate-pulse" />
          <div className="h-48 w-full bg-neutral-800 rounded-3xl animate-pulse" />
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-neutral-800 shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                     <div className="h-4 w-full bg-neutral-800 rounded" />
                     <div className="h-3 w-1/2 bg-neutral-800 rounded" />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
