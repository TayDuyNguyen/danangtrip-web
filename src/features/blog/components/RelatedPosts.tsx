import { useTranslations } from "next-intl";
import { BlogPost } from "@/types";
import { PostCard } from "./PostCard";

interface RelatedPostsProps {
  posts: BlogPost[];
}

/**
 * Organism: RelatedPosts
 * Displays a list of related blog posts in a grid.
 */
export const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  const t = useTranslations("blog");

  if (posts.length === 0) return null;

  return (
    <section className="space-y-10 pt-16 border-t border-white/5 reveal-up">
      <h3 className="text-3xl font-bold text-white tracking-tight">
        {t("related_posts")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </section>
  );
};
