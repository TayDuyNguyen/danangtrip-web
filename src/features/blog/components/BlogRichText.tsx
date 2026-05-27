import { cn } from "@/lib/utils";

interface BlogRichTextProps {
  content: string;
  className?: string;
}

/**
 * Organism: BlogRichText
 * Renders blog content with Tailwind Typography (prose) and project-specific styling.
 * Targets Inter and SFMono as per DESIGN.md.
 */
export const BlogRichText = ({ content, className }: BlogRichTextProps) => {
  return (
    <article
      className={cn(
        "prose prose-invert prose-neutral max-w-none",
        "whitespace-pre-wrap",
        "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white",
        "prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:scroll-mt-32",
        "prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:scroll-mt-32",
        "prose-p:text-[#d4d4d4] prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 prose-p:whitespace-pre-wrap",
        "prose-strong:text-white prose-strong:font-bold",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-img:rounded-3xl prose-img:border prose-img:border-white/10",
        "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic",
        "prose-ul:list-disc prose-ul:pl-6",
        "prose-ol:list-decimal prose-ol:pl-6",
        "prose-li:text-[#d4d4d4] prose-li:mb-2",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
