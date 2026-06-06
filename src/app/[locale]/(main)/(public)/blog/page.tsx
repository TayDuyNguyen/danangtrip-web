"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
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

export default function BlogPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="design-page layout-main-shell">
      <BlogHero 
        onSearch={setSearch} 
        initialSearch={search} 
      />
      
      <main className="design-container pb-24">
        <BlogContent searchQuery={search} />
      </main>
    </div>
  );
}
