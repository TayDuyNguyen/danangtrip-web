import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogService } from "@/services/blog.service";
import { BlogPost, PaginatedResponse } from "@/types";
import { TocHeading } from "@/features/blog/types";
import { ReadingProgressBar } from "@/features/blog/components/ReadingProgressBar";
import { BlogDetailHeader } from "@/features/blog/components/BlogDetailHeader";
import { BlogRichText } from "@/features/blog/components/BlogRichText";
import { AuthorCard } from "@/features/blog/components/AuthorCard";
import { RelatedPosts } from "@/features/blog/components/RelatedPosts";
import { BlogDetailSidebar } from "@/features/blog/components/BlogDetailSidebar";
import Image from "next/image";

interface BlogDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

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
    const response = await blogService.getDetail(slug);
    if (!response.success || !response.data) return { title: "Post Not Found" };

    const post = response.data;
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
  
  let post: BlogPost;
  let popularPosts: BlogPost[] = [];
  let relatedPosts: BlogPost[] = [];
  let processedContent: string = "";
  let tocHeadings: TocHeading[] = [];

  try {
    const postResponse = await blogService.getDetail(slug);
    if (!postResponse.success || !postResponse.data) {
      notFound();
    }
    post = postResponse.data;

    const [sidebarResponse, relatedResponse] = await Promise.all([
      blogService.getSidebarData(),
      post.categories[0]?.id 
        ? blogService.getLatest({ category_id: post.categories[0].id, per_page: 4 })
        : Promise.resolve({ success: true, data: { data: [] } })
    ]);

    popularPosts = sidebarResponse.data?.popular_posts.slice(0, 5) ?? [];
    const paginator = relatedResponse.data as PaginatedResponse<BlogPost>;
    relatedPosts = paginator?.data?.filter((p: BlogPost) => p.id !== post.id).slice(0, 3) ?? [];
    
    // Process content for TOC interactions
    const processed = processContent(post.content);
    processedContent = processed.content;
    tocHeadings = processed.headings;

  } catch (error) {
    throw error; 
  }

  return (
    <main className="relative min-h-screen pb-20">
      <ReadingProgressBar />

      <div className="container mx-auto px-4 pt-12 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
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
