"use client";

import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { IoArrowForwardOutline, Calendar, IoPersonOutline, IoTrendingUp } from "@/components/icons/solar";
import type { BlogPost } from "@/types";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { formatCompactNumber } from "@/utils/format";

interface PostCardProps {
  post: BlogPost;
  index?: number;
}

export const PostCard = ({ post, index = 0 }: PostCardProps) => {
  const t = useTranslations("blog");
  const { locale } = useParams();
  const dateLocale = locale === "vi" ? vi : enUS;

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
      href={`/${locale}/blog/${post.slug}`}
      className="group block overflow-hidden rounded-3xl border border-border bg-white shadow-[0_14px_36px_rgba(0,0,0,0.07)] reveal-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {post.categories?.[0] && (
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-primary text-white border-none backdrop-blur-md">
              {post.categories[0].name}
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-subtle">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {post.published_at ? format(new Date(post.published_at), "dd/MM/yyyy", { locale: dateLocale }) : "-"}
          </span>
          <span className="flex items-center gap-1">
            <IoPersonOutline size={14} />
            {post.author.full_name}
          </span>
          <span className="flex items-center gap-1">
            <IoTrendingUp size={14} />
            {formatCompactNumber(post.view_count, locale === "vi" ? "vi-VN" : "en-US")}
          </span>
        </div>

        <h3 className="line-clamp-2 text-xl font-semibold text-on-surface transition-colors group-hover:text-primary">
          {post.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-on-surface-subtle">
          {post.excerpt}
        </p>

        <div className="pt-2 flex items-center gap-2 text-primary font-medium text-sm">
          <span>{t("read_more")}</span>
          <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
