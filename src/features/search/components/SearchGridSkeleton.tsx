"use client";

export const SearchGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div 
          key={i} 
          className="bg-surface-container-low rounded-[32px] overflow-hidden flex flex-col h-full"
        >
          {/* Image Placeholder */}
          <div className="aspect-4/3 bg-surface-container-highest animate-pulse" />
          
          <div className="p-8 space-y-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start">
               {/* Badge Placeholder */}
               <div className="h-6 w-20 bg-surface-container-highest rounded-full animate-pulse" />
               {/* Rating Placeholder */}
               <div className="h-6 w-12 bg-surface-container-highest rounded-full animate-pulse" />
            </div>

            {/* Title Placeholder */}
            <div className="space-y-2">
              <div className="h-8 w-full bg-surface-container-highest rounded-lg animate-pulse" />
              <div className="h-8 w-2/3 bg-surface-container-highest rounded-lg animate-pulse" />
            </div>

            {/* Footer Placeholder */}
            <div className="pt-4 mt-auto flex justify-between items-end">
               <div className="space-y-1">
                 <div className="h-4 w-16 bg-surface-container-highest rounded animate-pulse" />
                 <div className="h-8 w-24 bg-surface-container-highest rounded-lg animate-pulse" />
               </div>
               <div className="h-12 w-12 bg-azure/20 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
