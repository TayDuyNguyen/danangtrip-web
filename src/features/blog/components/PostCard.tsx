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

  return (
    <Link 
      href={`/${locale}/blog/${post.slug}`}
      className="group block glass-surface rounded-3xl overflow-hidden reveal-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={post.featured_image || "/images/placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {post.categories?.[0] && (
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-[#8B6A55] text-white border-none backdrop-blur-md">
              {post.categories[0].name}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4 text-xs text-[#a3a3a3]">
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

        <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-[#8B6A55] transition-colors">
          {post.title}
        </h3>

        <p className="text-[#737373] text-sm line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="pt-2 flex items-center gap-2 text-[#8B6A55] font-medium text-sm">
          <span>{t("read_more")}</span>
          <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
