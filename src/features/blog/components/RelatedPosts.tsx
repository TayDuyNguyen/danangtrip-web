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
    <section className="reveal-up space-y-10 border-t border-border pt-16">
      <h3 className="text-3xl font-semibold tracking-tight text-on-surface">
        {t("related_posts")}
      </h3>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </section>
  );
};
