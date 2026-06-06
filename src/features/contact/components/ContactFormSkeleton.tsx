"use client";

export const ContactFormSkeleton = () => {
  return (
    <div className="animate-pulse rounded-[28px] border border-border bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:p-10">
      <div className="mb-10">
        <div className="mb-3 h-8 w-64 rounded-md bg-[#eceff3]" />
        <div className="h-4 w-full rounded-md bg-[#f3f4f6]" />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="h-3 w-20 rounded-md bg-[#eceff3]" />
            <div className="h-12 w-full rounded-md bg-[#f3f4f6]" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded-md bg-[#eceff3]" />
            <div className="h-12 w-full rounded-md bg-[#f3f4f6]" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="h-3 w-20 rounded-md bg-[#eceff3]" />
            <div className="h-12 w-full rounded-md bg-[#f3f4f6]" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded-md bg-[#eceff3]" />
            <div className="h-12 w-full rounded-md bg-[#f3f4f6]" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-3 w-20 rounded-md bg-[#eceff3]" />
          <div className="h-32 w-full rounded-md bg-[#f3f4f6]" />
        </div>

        <div className="pt-4">
          <div className="h-14 w-48 rounded-full bg-[#eceff3]" />
        </div>
      </div>
    </div>
  );
};
