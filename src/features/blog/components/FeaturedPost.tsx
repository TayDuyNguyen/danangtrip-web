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
    <div className="glass-surface rounded-[32px] overflow-hidden flex flex-col md:flex-row h-auto md:h-[400px] reveal-up">
      <div className="relative w-full md:w-1/2 h-64 md:h-full">
        <Image
          src={image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-6 left-6">
          <Badge className="bg-[#8B6A55] text-white border-none px-4 py-1">
            {t("featured_badge")}
          </Badge>
        </div>
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-6">
        <div className="flex items-center gap-6 text-sm text-[#a3a3a3]">
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

        <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
          {post.title}
        </h2>

        <p className="text-[#737373] line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="pt-4">
          <Link href={`/${locale}/blog/${post.slug}`}>
            <Button size="lg" className="bg-[#8B6A55] hover:bg-[#8B6A55]/90 text-white rounded-full px-8 gap-2 group">
              {t("read_now")}
              <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
