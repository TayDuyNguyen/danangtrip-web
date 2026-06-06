"use client";

import dynamic from "next/dynamic";

const AmbientBackground = dynamic(() => import("./AmbientBackground"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 bg-white"
    />
  ),
});

export default function AmbientBackgroundLazy() {
  return <AmbientBackground />;
}
