"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoNewspaperOutline } from "@/components/icons/solar";
import { useBlogPosts, useBlogSidebar } from "../hooks/useBlog";
import { PostCard } from "./PostCard";
import { FeaturedPost } from "./FeaturedPost";
import { BlogSidebar } from "./BlogSidebar";
import { BlogCategoryScrollRow } from "./BlogCategoryScrollRow";
import { PostCardSkeleton, FeaturedPostSkeleton, SidebarSkeleton, CategoryTabsSkeleton } from "./BlogSkeleton";
import type { BlogFilterParams } from "../types";
import { Button } from "@/components/ui/Button";
import { StandardPagination } from "@/components/ui/pagination";

const PER_PAGE = 20;

interface BlogContentProps {
  /** Lọc cục bộ theo tiêu đề/excerpt trên trang hiện tại (API public chưa có q= search). */
  searchQuery?: string;
}

export const BlogContent = ({ searchQuery = "" }: BlogContentProps) => {
  const t = useTranslations("blog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: BlogFilterParams = useMemo(
    () => ({
      page: Math.max(1, parseInt(searchParams.get("page") || "1", 10)),
      per_page: PER_PAGE,
      category_id: searchParams.get("category_id")
        ? parseInt(searchParams.get("category_id")!, 10)
        : undefined,
      search: searchQuery || undefined,
    }),
    [searchParams, searchQuery],
  );

  const { data, isLoading } = useBlogPosts(filters);
  const { data: sidebarData, isLoading: isSidebarLoading } = useBlogSidebar();

  const navigateQuery = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const handleCategorySelect = (categoryId: number | string | undefined) => {
    navigateQuery({
      category_id:
        categoryId === undefined || categoryId === ""
          ? undefined
          : String(categoryId),
      page: undefined,
    });
  };

  const handlePageChange = (page: number) => {
    navigateQuery({
      page: page <= 1 ? undefined : String(page),
    });
  };

  const paginator = data;
  const posts = paginator?.data ?? [];

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);
  const categories = sidebarData?.categories ?? [];
  const totalPostsCount = categories.reduce((sum, cat) => sum + (cat.post_count ?? 0), 0);

  const currentPage = paginator?.current_page ?? 1;
  const lastPage = paginator?.last_page ?? 1;
  const totalResults = paginator?.total ?? posts.length;
  const selectedCategoryName = categories.find((cat) => cat.id === Number(filters.category_id))?.name;
  const resultText =
    searchQuery.trim().length > 0
      ? t("result_count_search", { count: totalResults, query: searchQuery.trim() })
      : selectedCategoryName
        ? t("result_count_in_category", {
            count: totalResults,
            category: selectedCategoryName,
          })
        : t("result_count", { count: totalResults });

  // Detect if requested category is not found in loaded category list
  const isInvalidCategory = Boolean(
    filters.category_id &&
      !isSidebarLoading &&
      categories.length > 0 &&
      !selectedCategoryName
  );

  return (
    <div className="space-y-6">
      {/* Category Tabs Row */}
      <div className="reveal-up border-b border-border pb-4" style={{ animationDelay: "100ms" }}>
        {isSidebarLoading ? (
          <CategoryTabsSkeleton />
        ) : (
          <BlogCategoryScrollRow scrollKey={categories.length}>
            <button
              type="button"
              onClick={() => handleCategorySelect(undefined)}
              className={`px-5 py-3 cursor-pointer border-b-2 transition-all text-sm font-semibold whitespace-nowrap ${
                !filters.category_id
                  ? "border-primary text-on-surface"
                  : "border-transparent text-on-surface-subtle hover:text-on-surface"
              }`}
            >
              {t("all_posts")}{" "}
              {totalPostsCount > 0 && (
                <span className="ml-1 text-xs opacity-60">({totalPostsCount})</span>
              )}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-5 py-3 cursor-pointer border-b-2 transition-all text-sm font-semibold whitespace-nowrap ${
                  Number(filters.category_id) === cat.id
                    ? "border-primary text-on-surface"
                    : "border-transparent text-on-surface-subtle hover:text-on-surface"
                }`}
              >
                {cat.name}{" "}
                {cat.post_count !== undefined && (
                  <span className="ml-1 text-xs opacity-60">({cat.post_count})</span>
                )}
              </button>
            ))}
          </BlogCategoryScrollRow>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 space-y-6">
          {isInvalidCategory ? (
            <div className="reveal-up space-y-4 rounded-3xl border border-border bg-white p-16 text-center shadow-[0_14px_36px_rgba(0,0,0,0.06)] md:p-20" style={{ animationDelay: "200ms" }}>
              <IoNewspaperOutline className="mx-auto text-6xl text-primary/80" aria-hidden />
              <h3 className="text-xl font-semibold text-on-surface">{t("invalid_category_title")}</h3>
              <p className="mx-auto max-w-md text-on-surface-subtle">{t("invalid_category_desc")}</p>
              <Button
                type="button"
                variant="secondary"
                className="mt-4"
                onClick={() => router.push(pathname)}
              >
                {t("clear_filters")}
              </Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-6">
              <FeaturedPostSkeleton />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.from({ length: 6 }, (_, index) => index + 1).map((i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-on-surface-subtle">{resultText}</p>

              {featuredPost && <FeaturedPost post={featuredPost} />}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>

              {posts.length === 0 && (
                <div className="space-y-4 rounded-3xl border border-border bg-white p-16 text-center shadow-[0_14px_36px_rgba(0,0,0,0.06)] md:p-20">
                  <IoNewspaperOutline className="mx-auto text-6xl text-neutral-600" aria-hidden />
                  <h3 className="text-xl font-semibold text-on-surface">
                    {filters.category_id ? t("empty_category_title") : t("no_posts")}
                  </h3>
                  <p className="mx-auto max-w-md text-on-surface-subtle">
                    {filters.category_id ? t("empty_category_desc") : t("no_posts_desc")}
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-4"
                    onClick={() => router.push(pathname)}
                  >
                    {t("clear_filters")}
                  </Button>
                </div>
              )}

              {posts.length > 0 && lastPage > 1 && (
                <div className="mt-4 flex justify-center reveal-up" style={{ animationDelay: "400ms" }}>
                  <StandardPagination
                    currentPage={currentPage}
                    totalPages={lastPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          {isSidebarLoading ? (
            <SidebarSkeleton />
          ) : (
            <BlogSidebar />
          )}
        </div>
      </div>
    </div>
  );
};
