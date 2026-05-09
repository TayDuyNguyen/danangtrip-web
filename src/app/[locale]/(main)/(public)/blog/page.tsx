"use client";

import { Suspense, useState } from "react";
import { BlogHero } from "@/features/blog/components/BlogHero";
import { BlogContent } from "@/features/blog/components/BlogContent";

export default function BlogPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="design-page layout-main-shell">
      <BlogHero 
        onSearch={setSearch} 
        initialSearch={search} 
      />
      
      <main className="design-container pb-24">
        <Suspense fallback={<div className="min-h-[320px] animate-pulse rounded-3xl bg-neutral-900/40" aria-hidden />}>
          <BlogContent searchQuery={search} />
        </Suspense>
      </main>
    </div>
  );
}
