import React from 'react';

export default function LocationDetailLoading() {
  return (
    <main className="min-h-screen bg-gray-50/50 pb-20 animate-pulse">
      {/* Top Actions Desktop Skeleton */}
      <div className="container mx-auto px-4 pt-8 md:pt-12">
        <div className="mb-6 hidden items-center justify-between md:flex">
          <div className="h-4 w-64 rounded-md bg-gray-200"></div>
          <div className="flex gap-3">
            <div className="h-10 w-24 rounded-full bg-gray-200"></div>
            <div className="h-10 w-24 rounded-full bg-gray-200"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column Skeleton */}
          <div className="space-y-12 lg:col-span-8">
            {/* Gallery Skeleton */}
            <div className="grid h-[400px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl md:h-[500px]">
              <div className="col-span-4 row-span-2 bg-gray-200 md:col-span-2"></div>
              <div className="hidden bg-gray-200 md:block"></div>
              <div className="hidden bg-gray-200 md:block"></div>
              <div className="hidden bg-gray-200 md:block"></div>
              <div className="hidden bg-gray-200 md:block"></div>
            </div>

            {/* Info Skeleton */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 w-20 rounded-full bg-gray-200"></div>
                  <div className="h-6 w-20 rounded-full bg-gray-200"></div>
                </div>
                <div className="h-10 w-3/4 rounded-lg bg-gray-200 md:w-1/2"></div>
                <div className="h-6 w-48 rounded-lg bg-gray-200"></div>
              </div>

              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                <div className="h-4 w-4/6 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) Skeleton */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-3xl border border-gray-50 bg-white p-8 shadow-xl">
                <div className="mb-6 h-8 w-32 rounded bg-gray-200"></div>
                <div className="space-y-4">
                  <div className="h-14 w-full rounded-lg bg-gray-200"></div>
                  <div className="h-14 w-full rounded-lg bg-gray-200"></div>
                </div>
              </div>

              <div className="h-48 w-full rounded-3xl bg-gray-200"></div>
              <div className="h-48 w-full rounded-3xl bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
