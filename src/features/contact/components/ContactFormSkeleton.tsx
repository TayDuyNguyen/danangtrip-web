"use client";

export const ContactFormSkeleton = () => {
  return (
    <div className="glass-surface glass-inner rounded-xl p-8 lg:p-10 animate-pulse">
      <div className="mb-10">
        <div className="h-8 w-64 bg-border rounded-md mb-3" />
        <div className="h-4 w-full bg-border/50 rounded-md" />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-border/40 rounded-md" />
            <div className="h-12 w-full bg-border/20 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-border/40 rounded-md" />
            <div className="h-12 w-full bg-border/20 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-border/40 rounded-md" />
            <div className="h-12 w-full bg-border/20 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-border/40 rounded-md" />
            <div className="h-12 w-full bg-border/20 rounded-md" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-3 w-20 bg-border/40 rounded-md" />
          <div className="h-32 w-full bg-border/20 rounded-md" />
        </div>

        <div className="pt-4">
          <div className="h-14 w-48 bg-border/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};
