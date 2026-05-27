"use client";

import { useTranslations } from "next-intl";
import { BlogPost } from "@/types";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { formatCompactNumber } from "@/utils/format";
import Image from "next/image";
import { Calendar, Eye } from "lucide-react";

interface BlogDetailHeaderProps {
  post: BlogPost;
  locale: string;
}

/**
 * Organism: BlogDetailHeader
 * Updated to match Stitch design: font-light uppercase title,
 * monospace meta row with border separators and author avatar.
 */
export const BlogDetailHeader = ({ post, locale }: BlogDetailHeaderProps) => {
  const t = useTranslations("blog");
  const dateLocale = locale === "vi" ? vi : enUS;

  return (
    <header className="space-y-8 mb-12 reveal-up">
      {/* Category badges — monospace with brand border */}
      <div className="flex flex-wrap gap-3">
        {post.categories.map((cat) => (
          <span
            key={cat.id}
            className="inline-block px-3 py-1 text-xs font-mono text-primary border border-primary/30 rounded-full glass-retro uppercase tracking-wider"
          >
            {cat.name}
          </span>
        ))}
      </div>

      {/* Title — light weight, uppercase, tight tracking */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-light uppercase tracking-tight leading-tight text-white">
        {post.title}
      </h1>

      {/* Meta Info — border top/bottom, monospace, with author avatar */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-mono text-neutral-400 border-t border-b border-white/10 py-4">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 relative shrink-0">
            <Image
              src={post.author.avatar || "/images/placeholder-avatar.jpg"}
              alt={post.author.full_name}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-white">{post.author.full_name}</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-neutral-500" />
          <span>
            {post.published_at
              ? format(new Date(post.published_at), "dd MMMM, yyyy", { locale: dateLocale })
              : "-"}
          </span>
        </div>

        {/* Views */}
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-neutral-500" />
          <span>
            {formatCompactNumber(post.view_count, locale === "vi" ? "vi-VN" : "en-US")}{" "}
            {t("views_count", { count: post.view_count }).split(" ")[1]}
          </span>
        </div>
      </div>
    </header>
  );
};
