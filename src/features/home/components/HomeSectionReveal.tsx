"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface HomeSectionRevealProps {
  children: ReactNode;
  delay?: number;
}

export default function HomeSectionReveal({ children, delay = 0 }: HomeSectionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 56, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.16, margin: "0px 0px -80px 0px" }}
      transition={{
        duration: 0.82,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
