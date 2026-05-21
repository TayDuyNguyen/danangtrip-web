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
 * Displays an interactive list of headings for navigation.
 * Uses DESIGN.md primary accent for active states.
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
    <nav className="p-8 glass-surface rounded-3xl border border-white/10 space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full" />
        {t("table_of_contents")}
      </h3>

      <ul className="space-y-4">
        {headings.map((heading) => (
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
                "text-sm transition-all duration-300 block leading-relaxed",
                activeId === heading.id
                  ? "text-primary font-bold translate-x-1"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
