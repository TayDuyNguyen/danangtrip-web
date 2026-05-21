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

interface BlogSidebarProps {
  onCategorySelect: (id: number | string | undefined) => void;
  selectedCategoryId?: number | string;
}

export const BlogSidebar = ({ onCategorySelect, selectedCategoryId }: BlogSidebarProps) => {
  const t = useTranslations("blog");
  const { locale } = useParams();
  const dateLocale = locale === "vi" ? vi : enUS;
  const { data, isLoading } = useBlogSidebar();

  if (isLoading) return <SidebarSkeleton />;
  if (!data) return null;

  return (
    <aside className="space-y-12 reveal-up reveal-delay-300">
      {/* Categories */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-[#8B6A55] rounded-full" />
          {t("categories")}
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategorySelect(undefined)}
            className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all ${
              !selectedCategoryId ? "bg-[#8B6A55] text-white" : "text-[#a3a3a3] hover:bg-neutral-900"
            }`}
          >
            <span>{t("all_posts")}</span>
          </button>
          {data.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all ${
                selectedCategoryId === cat.id ? "bg-[#8B6A55] text-white" : "text-[#a3a3a3] hover:bg-neutral-900"
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategoryId === cat.id ? "bg-white/20" : "bg-neutral-800"
              }`}>
                {cat.post_count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Posts */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-[#8B6A55] rounded-full" />
          {t("popular_posts")}
        </h3>
        <div className="space-y-4">
          {data.popular_posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/${locale}/blog/${post.slug}`}
              className="flex gap-4 group"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={post.featured_image || "/images/placeholder.jpg"}
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
          ))}
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
