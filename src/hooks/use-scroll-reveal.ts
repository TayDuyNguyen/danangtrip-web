"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** 0–1: fraction of element that must be visible (default 0.12) */
  threshold?: number;
  /** IntersectionObserver rootMargin, e.g. "0px 0px -8% 0px" */
  rootMargin?: string;
  /** Reveal after this ms if observer never fires (hydration / layout) */
  fallbackMs?: number;
};

/**
 * Reveal content when the ref element scrolls into view (IntersectionObserver).
 * Not tied to page load — animation runs when the user reaches that section.
 */
export const useScrollReveal = (options: Options = {}) => {
  const { threshold = 0.12, rootMargin = "0px 0px -6% 0px", fallbackMs = 2800 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);

  useEffect(() => {
    const reveal = () => {
      if (!revealedRef.current) {
        revealedRef.current = true;
        setIsVisible(true);
      }
    };

    const fallbackTimeout = window.setTimeout(() => {
      reveal();
    }, fallbackMs);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          window.clearTimeout(fallbackTimeout);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    const el = elementRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      window.clearTimeout(fallbackTimeout);
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [threshold, rootMargin, fallbackMs]);

  return { elementRef, isVisible };
};
