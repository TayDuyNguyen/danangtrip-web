"use client";

import { type ReactNode } from "react";

interface HomeSectionRevealProps {
  children: ReactNode;
  delay?: number;
}

export default function HomeSectionReveal({ children, delay = 0 }: HomeSectionRevealProps) {
  return (
    <div
      className="home-section-reveal"
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
