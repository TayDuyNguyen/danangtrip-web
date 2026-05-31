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
    <header className="space-y-8 mb-4 reveal-up">
      {/* Category badges — monospace with brand border */}
      <div className="flex flex-wrap gap-3">
        {post.categories.map((cat) => (
          <span
            key={cat.id}
            className="inline-block rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-mono uppercase tracking-wider text-primary"
          >
            {cat.name}
          </span>
        ))}
      </div>

      {/* Title — light weight, uppercase, tight tracking */}
      <h1 className="text-4xl font-semibold leading-tight tracking-tight text-on-surface md:text-3xl lg:text-6xl">
        {post.title}
      </h1>

      {/* Meta Info — border top/bottom, monospace, with author avatar */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-border py-4 text-sm font-mono text-on-surface-subtle">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-border">
            <Image
              src={post.author.avatar || "/images/placeholder-avatar.jpg"}
              alt={post.author.full_name}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-on-surface">{post.author.full_name}</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-on-surface-subtle" />
          <span>
            {post.published_at
              ? format(new Date(post.published_at), "dd MMMM, yyyy", { locale: dateLocale })
              : "-"}
          </span>
        </div>

        {/* Views */}
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-on-surface-subtle" />
          <span>
            {formatCompactNumber(post.view_count, locale === "vi" ? "vi-VN" : "en-US")}{" "}
            {t("views_count", { count: post.view_count }).split(" ")[1]}
          </span>
        </div>
      </div>
    </header>
  );
};
