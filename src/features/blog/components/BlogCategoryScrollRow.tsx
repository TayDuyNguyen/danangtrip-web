"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "@/components/icons/solar";

type ScrollState = {
  overflowing: boolean;
  canLeft: boolean;
  canRight: boolean;
};

const initialScrollState: ScrollState = {
  overflowing: false,
  canLeft: false,
  canRight: false,
};

interface BlogCategoryScrollRowProps {
  children: ReactNode;
  /** Đổi khi danh sách danh mục thay đổi để đo lại overflow (ResizeObserver không thấy scrollWidth). */
  scrollKey?: string | number;
}

export function BlogCategoryScrollRow({ children, scrollKey = 0 }: BlogCategoryScrollRowProps) {
  const t = useTranslations("blog");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<ScrollState>(initialScrollState);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const overflowing = scrollWidth > clientWidth + 2;
    setScrollState({
      overflowing,
      canLeft: overflowing && scrollLeft > 2,
      canRight: overflowing && scrollLeft < scrollWidth - clientWidth - 2,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const measure = () => {
      requestAnimationFrame(() => updateScrollState());
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState, scrollKey]);

  const scrollByDirection = (direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(280, Math.floor(el.clientWidth * 0.75));
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const navBtnClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-on-surface-subtle shadow-sm transition-colors hover:border-primary/30 hover:text-on-surface hover:bg-[#fafafa] disabled:pointer-events-none disabled:opacity-25";

  return (
    <div className="flex items-center gap-2">
      {scrollState.overflowing && (
        <button
          type="button"
          className={navBtnClass}
          aria-label={t("scroll_categories_prev")}
          disabled={!scrollState.canLeft}
          onClick={() => scrollByDirection(-1)}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto scroll-smooth pb-2 no-scrollbar"
      >
        {children}
      </div>

      {scrollState.overflowing && (
        <button
          type="button"
          className={navBtnClass}
          aria-label={t("scroll_categories_next")}
          disabled={!scrollState.canRight}
          onClick={() => scrollByDirection(1)}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      )}
    </div>
  );
}
