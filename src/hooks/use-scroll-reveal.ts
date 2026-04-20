"use client";

import { useEffect, useRef, useState } from "react";

export const useScrollReveal = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fallback: If for some reason the observer doesn't fire (e.g. hydration issue),
    // we reveal the element after a short delay so the user doesn't see a blank page.
    const fallbackTimeout = setTimeout(() => {
      if (!isVisible) setIsVisible(true);
    }, 1500);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(fallbackTimeout);
          // Once the animation is triggered, we can stop observing
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      clearTimeout(fallbackTimeout);
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, isVisible]);

  return { elementRef, isVisible };
};
