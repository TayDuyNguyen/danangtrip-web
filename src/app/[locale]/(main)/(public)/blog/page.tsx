"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { BlogHero } from "@/features/blog/components/BlogHero";

const BlogContent = dynamic(
  () => import("@/features/blog/components/BlogContent").then((mod) => mod.BlogContent),
  {
    ssr: false,
    loading: () => <div className="min-h-[320px] animate-pulse rounded-3xl bg-[#f3f3f3]" aria-hidden />,
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
