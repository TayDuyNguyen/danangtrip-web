"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { BlogHero } from "@/features/blog/components/BlogHero";

const BlogContent = dynamic(
  () => import("@/features/blog/components/BlogContent").then((mod) => mod.BlogContent),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6" aria-hidden>
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 w-28 animate-pulse rounded-full bg-[#f7f7f7]" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_14px_36px_rgba(0,0,0,0.06)]">
              <div className="h-44 animate-pulse bg-[#f7f7f7] md:h-64" />
              <div className="space-y-3 p-6">
                <div className="h-4 w-28 animate-pulse rounded bg-[#ebebeb]" />
                <div className="h-7 w-3/4 animate-pulse rounded bg-[#ebebeb]" />
                <div className="h-4 w-full animate-pulse rounded bg-[#f7f7f7]" />
              </div>
            </div>
          </div>
          <div className="hidden space-y-4 rounded-[28px] border border-border bg-white p-6 lg:col-span-4 lg:block">
            <div className="h-6 w-1/2 animate-pulse rounded bg-[#ebebeb]" />
            <div className="h-4 w-full animate-pulse rounded bg-[#f7f7f7]" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-[#f7f7f7]" />
          </div>
        </div>
      </div>
    ),
  }
);

function BlogPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get("search") || "";

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    params.delete("page"); // reset page when search changes
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="design-page layout-main-shell">
      <BlogHero 
        onSearch={handleSearch} 
        initialSearch={search} 
      />
      
      <main className="design-container pb-24">
        <BlogContent searchQuery={search} />
      </main>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="design-page layout-main-shell">
        <div className="h-[280px] bg-surface-container-low" />
        <main className="design-container py-24">
          <div className="h-44 animate-pulse bg-[#f7f7f7] rounded-[28px]" />
        </main>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
}

