"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { IoTrendingUp } from "@/components/icons/solar";
import { formatCompactNumber } from "@/utils/format";
import { BlogPost } from "@/types";
import { TocHeading } from "../types";
import { TableOfContents } from "./TableOfContents";
import { ShareButtons } from "./ShareButtons";

interface BlogDetailSidebarProps {
  popularPosts: BlogPost[];
  tocHeadings: TocHeading[];
}

/**
 * Organism: BlogDetailSidebar
 * Specialized sidebar for the blog detail page.
 * Composes TOC, Share buttons, and Popular posts.
 */
export const BlogDetailSidebar = ({ popularPosts, tocHeadings }: BlogDetailSidebarProps) => {
  const t = useTranslations("blog");
  const { locale } = useParams();
  const dateLocale = locale === "vi" ? vi : enUS;

  return (
    <aside className="sticky top-24 space-y-8">
      <TableOfContents headings={tocHeadings} />
      <ShareButtons />
      <div className="space-y-6 rounded-[28px] border border-border bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
        <h3 className="border-l-4 border-primary pl-3 text-lg font-semibold text-on-surface">
          {t("popular_posts")}
        </h3>
        
        <div className="space-y-6">
          {popularPosts.map((post) => {
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
                className="group flex gap-4 rounded-2xl p-2 transition-colors hover:bg-[#fafafa]"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border">
                  <Image
                    src={image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 space-y-2 py-1">
                  <h4 className="line-clamp-2 text-sm font-medium leading-snug text-on-surface transition-colors group-hover:text-primary">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-on-surface-subtle">
                    <span>
                      {post.published_at ? format(new Date(post.published_at), "dd 'thg' M, yyyy", { locale: dateLocale }) : "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      <IoTrendingUp size={12} className="text-primary" />
                      {formatCompactNumber(post.view_count, locale === "vi" ? "vi-VN" : "en-US")}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
