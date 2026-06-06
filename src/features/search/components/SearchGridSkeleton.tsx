"use client";

export const SearchGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500 md:grid-cols-12">
      <div className="md:col-span-8 flex animate-pulse flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)] md:flex-row">
        <div className="aspect-video w-full bg-[#f2f4f7] md:h-auto md:w-1/2 md:aspect-auto" />
        <div className="flex w-full flex-col justify-between p-6 md:w-1/2">
          <div className="space-y-3">
            <div className="h-2.5 w-12 rounded-full bg-[#eceff3]" />
            <div className="h-6 w-4/5 rounded bg-[#eceff3]" />
            <div className="h-4 w-3/5 rounded bg-[#eceff3]" />
          </div>
          <div className="mt-6 flex items-end justify-between border-t border-border pt-6">
            <div className="space-y-1.5">
              <div className="h-2 w-10 rounded-full bg-[#eceff3]" />
              <div className="h-5 w-24 rounded bg-[#eceff3]" />
            </div>
            <div className="h-10 w-10 rounded-full bg-[#eceff3]" />
          </div>
        </div>
      </div>

      <div className="md:col-span-4 flex animate-pulse flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
        <div className="h-[200px] bg-[#f2f4f7]" />
        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="space-y-2">
            <div className="h-2.5 w-14 rounded-full bg-[#eceff3]" />
            <div className="h-5 w-3/4 rounded bg-[#eceff3]" />
            <div className="h-3.5 w-2/3 rounded bg-[#eceff3]" />
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
            <div className="space-y-1.5">
              <div className="h-2 w-10 rounded-full bg-[#eceff3]" />
              <div className="h-4 w-20 rounded bg-[#eceff3]" />
            </div>
            <div className="h-8 w-8 rounded-full bg-[#eceff3]" />
          </div>
        </div>
      </div>

      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="md:col-span-4 flex animate-pulse flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)]"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="h-[200px] bg-[#f2f4f7]" />
          <div className="flex flex-1 flex-col justify-between p-5">
            <div className="space-y-2">
              <div className="h-2.5 w-12 rounded-full bg-[#eceff3]" />
              <div className="h-5 w-4/5 rounded bg-[#eceff3]" />
              <div className="h-3.5 w-1/2 rounded bg-[#eceff3]" />
            </div>
            <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
              <div className="space-y-1.5">
                <div className="h-2 w-10 rounded-full bg-[#eceff3]" />
                <div className="h-4 w-20 rounded bg-[#eceff3]" />
              </div>
              <div className="h-8 w-8 rounded-full bg-[#eceff3]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
