"use client";

import dynamic from "next/dynamic";

const AmbientBackground = dynamic(() => import("./AmbientBackground"), {
  ssr: false,
  loading: () => (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-[#080808]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_80%_0%,rgba(139,106,85,0.45),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(92,56,34,0.42),transparent_52%),radial-gradient(circle_at_50%_50%,rgba(146,152,82,0.08),transparent_70%)]"
      />
    </>
  ),
});

export default function AmbientBackgroundLazy() {
  return <AmbientBackground />;
}
