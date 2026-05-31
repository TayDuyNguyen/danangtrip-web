export default function TourDetailLoading() {
  return (
    <div className="design-page layout-main-shell min-h-screen pb-20 animate-pulse">
      <div className="design-container pt-28 md:pt-32">
        <div className="mb-8 h-4 w-64 rounded-md bg-surface-container-high" />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
          <div className="lg:col-span-8 space-y-8">
            <div className="aspect-video w-full rounded-xl bg-surface-container-high" />
            <div className="h-10 w-3/4 rounded-lg bg-surface-container-high" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-surface-container-high" />
              <div className="h-4 w-full rounded bg-surface-container-high" />
              <div className="h-4 w-5/6 rounded bg-surface-container-high" />
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-border bg-surface-container-low p-8 space-y-6">
              <div className="h-8 w-32 rounded bg-surface-container-high" />
              <div className="h-12 w-full rounded-lg bg-surface-container-high" />
              <div className="h-12 w-full rounded-full bg-surface-container-high" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
