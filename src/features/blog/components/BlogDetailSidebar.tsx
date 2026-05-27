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
    <aside className="space-y-10 sticky top-24">
      {/* Table of Contents */}
      <TableOfContents headings={tocHeadings} />

      {/* Share Buttons */}
      <ShareButtons />

      {/* Popular Posts (Re-styled for detail sidebar) */}
      <div className="p-6 glass-retro rounded-2xl space-y-6">
        <h3 className="text-lg font-semibold text-white border-l-4 border-primary pl-3">
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
                className="flex gap-4 group"
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-white/10">
                  <Image
                    src={image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 space-y-2 py-1">
                  <h4 className="text-sm font-medium text-neutral-200 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
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
