"use client";

export const SearchGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* Featured card skeleton — col-span-8 */}
      <div
        className="md:col-span-8 gradient-shell rounded-[7px] overflow-hidden flex flex-col md:flex-row animate-pulse"
        style={{ backgroundColor: "rgba(8, 8, 8, 0.7)" }}
      >
        <div className="w-full md:w-1/2 aspect-video md:aspect-auto bg-[#1a1a1a]" />
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-2.5 w-12 bg-[#252525] rounded-full" />
            <div className="h-6 w-4/5 bg-[#252525] rounded" />
            <div className="h-4 w-3/5 bg-[#252525] rounded" />
          </div>
          <div className="flex justify-between items-end pt-6 border-t border-[#262626]/40 mt-6">
            <div className="space-y-1.5">
              <div className="h-2 w-10 bg-[#252525] rounded-full" />
              <div className="h-5 w-24 bg-[#252525] rounded" />
            </div>
            <div className="w-10 h-10 bg-[#252525] rounded-full" />
          </div>
        </div>
      </div>

      {/* Small card skeleton — col-span-4 */}
      <div
        className="md:col-span-4 gradient-shell rounded-[7px] overflow-hidden flex flex-col animate-pulse"
        style={{ backgroundColor: "rgba(8, 8, 8, 0.7)" }}
      >
        <div className="h-[200px] bg-[#1a1a1a]" />
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-2.5 w-14 bg-[#252525] rounded-full" />
            <div className="h-5 w-3/4 bg-[#252525] rounded" />
            <div className="h-3.5 w-2/3 bg-[#252525] rounded" />
          </div>
          <div className="flex justify-between items-end pt-4 border-t border-[#262626]/40 mt-5">
            <div className="space-y-1.5">
              <div className="h-2 w-10 bg-[#252525] rounded-full" />
              <div className="h-4 w-20 bg-[#252525] rounded" />
            </div>
            <div className="w-8 h-8 bg-[#252525] rounded-full" />
          </div>
        </div>
      </div>

      {/* 4 small cards — col-span-4 each */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="md:col-span-4 gradient-shell rounded-[7px] overflow-hidden flex flex-col animate-pulse"
          style={{ backgroundColor: "rgba(8, 8, 8, 0.7)", animationDelay: `${i * 60}ms` }}
        >
          <div className="h-[200px] bg-[#1a1a1a]" />
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-2.5 w-12 bg-[#252525] rounded-full" />
              <div className="h-5 w-4/5 bg-[#252525] rounded" />
              <div className="h-3.5 w-1/2 bg-[#252525] rounded" />
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-[#262626]/40 mt-5">
              <div className="space-y-1.5">
                <div className="h-2 w-10 bg-[#252525] rounded-full" />
                <div className="h-4 w-20 bg-[#252525] rounded" />
              </div>
              <div className="w-8 h-8 bg-[#252525] rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
