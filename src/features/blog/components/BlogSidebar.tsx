"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useBlogSidebar } from "../hooks/useBlog";
import { SidebarSkeleton } from "./BlogSkeleton";
import { IoNewspaperOutline, IoTrendingUp } from "@/components/icons/solar";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { formatCompactNumber } from "@/utils/format";

export const BlogSidebar = () => {
  const t = useTranslations("blog");
  const { locale } = useParams();
  const dateLocale = locale === "vi" ? vi : enUS;
  const { data, isLoading } = useBlogSidebar();

  if (isLoading) return <SidebarSkeleton />;
  if (!data) return null;

  return (
    <aside className="space-y-6 reveal-up reveal-delay-300">
      {/* Popular Posts */}
      <div className="space-y-6 rounded-[28px] border border-border bg-white p-6 shadow-[0_14px_36px_rgba(0,0,0,0.06)]">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-on-surface">
          <span className="w-1 h-6 bg-primary rounded-full" />
          {t("popular_posts")}
        </h3>
        <div className="space-y-4">
          {data.popular_posts.map((post) => {
            const isPlaceholder = (url?: string | null) => {
              if (!url) return true;
              const lower = url.toLowerCase();
              return lower.includes("placeholder") || lower.includes("destination") || lower.includes("no-image") || lower.includes("temp");
            };

            const getValidImage = () => {
              if (post.featured_image && !isPlaceholder(post.featured_image)) {
                return post.featured_image;
              }
              const fallbacks = [
                "/images/discovery/bana-hills.png",
                "/images/discovery/dragon-bridge.png",
                "/images/discovery/hoi-an.png",
                "/images/discovery/my-khe.png",
                "/images/discovery/son-tra.png"
              ];
              const idx = typeof post.id === "number" ? Math.abs(post.id) % fallbacks.length : 0;
              return fallbacks[idx];
            };

            const image = getValidImage();

            return (
              <Link 
                key={post.id} 
                href={`/${locale}/blog/${post.slug}`}
                className="flex gap-4 group"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
              <div className="flex-1 space-y-1">
                <h4 className="line-clamp-2 text-sm font-medium text-on-surface transition-colors group-hover:text-primary">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-on-surface-subtle">
                  <IoNewspaperOutline size={12} />
                  {post.published_at ? format(new Date(post.published_at), "dd MMM, yyyy", { locale: dateLocale }) : "-"}
                  <span className="inline-flex items-center gap-1">
                    <IoTrendingUp size={12} />
                    {formatCompactNumber(post.view_count, locale === "vi" ? "vi-VN" : "en-US")}
                  </span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </div>

      {data.tags.length > 0 ? (
        <div className="space-y-6 rounded-[28px] border border-border bg-white p-6 shadow-[0_14px_36px_rgba(0,0,0,0.06)]">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-on-surface">
            <span className="w-1 h-6 bg-primary rounded-full" />
            {t("tags")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="rounded-full border border-border bg-[#fafafa] px-4 py-2 text-xs text-on-surface-subtle transition-all hover:border-primary hover:text-primary"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
};
