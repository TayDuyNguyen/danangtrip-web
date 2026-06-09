"use client";

import { motion, MotionConfig } from "framer-motion";

const WAVE_DELAYS = [0, 0.15, 0.3] as const;

export function CopilotThinkingDots() {
  return (
    <MotionConfig reducedMotion="never">
      <div
        className="mt-1.5 flex h-5 items-end gap-1.5 overflow-visible"
        aria-hidden="true"
      >
        {WAVE_DELAYS.map((delay) => (
          <motion.div
            key={delay}
            className="h-2 w-2 shrink-0 rounded-full bg-slate-400"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.55,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          />
        ))}
      </div>
    </MotionConfig>
  );
}
