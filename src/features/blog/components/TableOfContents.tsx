"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TocHeading } from "../types";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: TocHeading[];
}

/**
 * Molecule: TableOfContents
 * Updated to match Stitch design:
 * - Heading with border-l-4 brand accent
 * - Numbered items with brand-colored prefix
 * - Glassmorphic container (glass-retro)
 */
export const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const t = useTranslations("blog");
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="p-6 glass-retro rounded-2xl space-y-4">
      <h3 className="text-lg font-semibold text-white border-l-4 border-primary pl-3">
        {t("table_of_contents")}
      </h3>

      <ul className="space-y-3 text-sm text-neutral-400">
        {headings.map((heading, idx) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className={cn(
                "flex gap-2 transition-all duration-300 leading-relaxed hover:text-primary",
                activeId === heading.id
                  ? "text-primary font-semibold translate-x-1"
                  : ""
              )}
            >
              {heading.level === 2 && (
                <span className="text-primary shrink-0">{idx + 1}.</span>
              )}
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
