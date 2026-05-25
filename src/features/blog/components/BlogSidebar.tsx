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
    <aside className="space-y-12 reveal-up reveal-delay-300">
      {/* Popular Posts */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-[#8B6A55] rounded-full" />
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
                <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[#8B6A55] transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-[#737373]">
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
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-[#8B6A55] rounded-full" />
            {t("tags")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-[#a3a3a3] hover:border-[#8B6A55] hover:text-[#8B6A55] transition-all"
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
