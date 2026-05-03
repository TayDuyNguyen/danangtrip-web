import { useTranslations } from "next-intl";
import Badge from "@/components/ui/Badge";
import { BlogPost } from "@/types";
import { Calendar, IoTrendingUp, IoPersonOutline } from "@/components/icons/solar";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { formatCompactNumber } from "@/utils/format";

interface BlogDetailHeaderProps {
  post: BlogPost;
  locale: string;
}

/**
 * Organism: BlogDetailHeader
 * Displays the main metadata and title of the blog post.
 */
export const BlogDetailHeader = ({ post, locale }: BlogDetailHeaderProps) => {
  const t = useTranslations("blog");
  const dateLocale = locale === "vi" ? vi : enUS;

  return (
    <header className="space-y-8 mb-12 reveal-up">
      {/* Categories */}
      <div className="flex flex-wrap gap-3">
        {post.categories.map((cat) => (
          <Badge
            key={cat.id}
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-xs font-bold tracking-wider"
          >
            {cat.name.toUpperCase()}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
        {post.title}
      </h1>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-neutral-400 text-sm">
        <div className="flex items-center gap-2">
          <IoPersonOutline className="text-primary" size={18} />
          <span className="text-white font-medium">{post.author.full_name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={18} />
          <span>
            {post.published_at
              ? format(new Date(post.published_at), "dd MMMM, yyyy", { locale: dateLocale })
              : "-"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <IoTrendingUp size={18} />
          <span>
            {formatCompactNumber(post.view_count, locale === "vi" ? "vi-VN" : "en-US")}{" "}
            {t("views_count", { count: post.view_count }).split(" ")[1]}
          </span>
        </div>
      </div>
    </header>
  );
};
