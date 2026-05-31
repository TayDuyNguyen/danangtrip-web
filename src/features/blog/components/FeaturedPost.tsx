"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { IoArrowForwardOutline, Calendar, IoPersonOutline, IoTrendingUp } from "@/components/icons/solar";
import type { BlogPost } from "@/types";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useParams } from "next/navigation";
import { formatCompactNumber } from "@/utils/format";

interface FeaturedPostProps {
  post: BlogPost;
}

export const FeaturedPost = ({ post }: FeaturedPostProps) => {
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
    <div className="overflow-hidden rounded-[32px] border border-border bg-white shadow-[0_18px_48px_rgba(0,0,0,0.08)] reveal-up flex h-auto flex-col md:h-[400px] md:flex-row">
      <div className="relative w-full md:w-1/2 h-64 md:h-full">
        <Image
          src={image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-6 left-6">
          <Badge className="bg-primary text-white border-none px-4 py-1">
            {t("featured_badge")}
          </Badge>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center space-y-6 p-8 md:w-1/2 md:p-12">
        <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-subtle">
          <span className="flex items-center gap-2">
            <Calendar size={16} />
            {post.published_at ? format(new Date(post.published_at), "dd MMMM, yyyy", { locale: dateLocale }) : "-"}
          </span>
          <span className="flex items-center gap-2">
            <IoPersonOutline size={16} />
            {post.author.full_name}
          </span>
          <span className="flex items-center gap-2">
            <IoTrendingUp size={16} />
            {t("views_count", { count: formatCompactNumber(post.view_count, locale === "vi" ? "vi-VN" : "en-US") })}
          </span>
        </div>

        <h2 className="text-2xl leading-tight text-on-surface md:text-4xl font-semibold">
          {post.title}
        </h2>

        <p className="line-clamp-3 leading-relaxed text-on-surface-subtle">
          {post.excerpt}
        </p>

        <div className="pt-4">
          <Link href={`/${locale}/blog/${post.slug}`}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 gap-2 group">
              {t("read_now")}
              <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
