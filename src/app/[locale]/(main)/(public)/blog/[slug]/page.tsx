import { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { BlogPost, PaginatedResponse } from "@/types";
import { TocHeading } from "@/features/blog/types";
import { ReadingProgressBar } from "@/features/blog/components/ReadingProgressBar";
import { BlogDetailHeader } from "@/features/blog/components/BlogDetailHeader";
import { BlogRichText } from "@/features/blog/components/BlogRichText";
import { AuthorCard } from "@/features/blog/components/AuthorCard";
import { RelatedPosts } from "@/features/blog/components/RelatedPosts";
import { BlogDetailSidebar } from "@/features/blog/components/BlogDetailSidebar";
import Image from "next/image";
import { serverApiGet } from "@/lib/server-api";

interface BlogDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

const getBlogPost = cache(async (slug: string) => {
  return serverApiGet<BlogPost>(`/blog/${encodeURIComponent(slug)}`, { revalidate: 300 });
});

/**
 * Utility to process content: 
 * 1. Inject IDs into headings if missing
 * 2. Extract headings for TOC
 */
function processContent(html: string): { content: string; headings: TocHeading[] } {
  const headings: TocHeading[] = [];
  let headingCount = 0;

  // Regex to find H2 and H3 tags
  const processedContent = html.replace(/<h([2-3])([^>]*)>(.*?)<\/h[2-3]>/g, (match, level, attrs, text) => {
    headingCount++;
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    
    // Extract existing ID or generate one
    const idMatch = attrs.match(/id="([^"]+)"/);
    const id = idMatch ? idMatch[1] : `heading-${headingCount}-${cleanText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;

    headings.push({
      level: parseInt(level, 10),
      id,
      text: cleanText,
    });

    // Return the heading with an ID injected if it was missing
    if (!idMatch) {
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
    return match;
  });

  return { content: processedContent, headings };
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post = await getBlogPost(slug);
    if (!post) return { title: "Post Not Found" };
    return {
      title: post.title,
      description: post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        images: post.featured_image ? [post.featured_image] : [],
        type: "article",
        publishedTime: post.published_at || post.created_at,
        authors: [post.author.full_name],
      },
    };
  } catch {
    return { title: "Blog Detail" };
  }
}

/**
 * Page: BlogDetail (Server Component)
 * Interaction handling: Content processing for TOC sync.
 */
export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;

  const post = await getBlogPost(slug);
  if (!post) {
    notFound();
  }

  const [popularResult, relatedResult] = await Promise.allSettled([
    serverApiGet<PaginatedResponse<BlogPost>>("/blog", {
      locale,
      params: { page: 1, per_page: 5, sort: "popular" },
      revalidate: 300,
    }),
    post.categories[0]?.id
      ? serverApiGet<PaginatedResponse<BlogPost>>("/blog", {
          locale,
          params: { category_id: post.categories[0].id, per_page: 4 },
          revalidate: 300,
        })
      : Promise.resolve({ data: [] } as Pick<PaginatedResponse<BlogPost>, "data">),
  ]);

  const popularPosts =
    popularResult.status === "fulfilled"
      ? popularResult.value.data?.slice(0, 5) ?? []
      : [];
  const relatedPosts =
    relatedResult.status === "fulfilled"
      ? relatedResult.value.data
          ?.filter((relatedPost: BlogPost) => relatedPost.id !== post.id)
          .slice(0, 3) ?? []
      : [];

  if (popularResult.status === "rejected") {
    console.warn("Popular blog posts could not be loaded", {
      slug,
      error: popularResult.reason,
    });
  }

  if (relatedResult.status === "rejected") {
    console.warn("Related blog posts could not be loaded", {
      slug,
      error: relatedResult.reason,
    });
  }

  const processed = processContent(post.content);
  const processedContent = processed.content;
  const tocHeadings = processed.headings;

  return (
    <main className="relative min-h-screen pb-20">
      <ReadingProgressBar />

      <div className="container mx-auto px-4 pt-12 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 space-y-10">
            <BlogDetailHeader post={post} locale={locale} />

            {/* Featured Image — glass-retro panel */}
            {post.featured_image && (
              <div className="reveal-up reveal-delay-100 rounded-2xl overflow-hidden glass-retro">
                <div className="relative aspect-video w-full">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                  />
                  {/* Gradient overlay at bottom of image */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </div>
            )}

            {/* Rich text content */}
            <div className="reveal-up reveal-delay-200 p-6 md:p-10 glass-retro rounded-2xl">
              <BlogRichText content={processedContent} />
            </div>

            {/* Author card */}
            <div className="reveal-up reveal-delay-300">
              <AuthorCard author={post.author} />
            </div>

            {relatedPosts.length > 0 && (
              <RelatedPosts posts={relatedPosts} />
            )}
          </div>


          <div className="lg:col-span-4 hidden lg:block reveal-up reveal-delay-300">
             <BlogDetailSidebar 
               popularPosts={popularPosts} 
               tocHeadings={tocHeadings} 
             />
          </div>
        </div>
      </div>
    </main>
  );
}
