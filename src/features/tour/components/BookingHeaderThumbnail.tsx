"use client";

import { useState } from "react";
import Image from "next/image";

interface BookingHeaderThumbnailProps {
  src: string | null;
  alt: string;
}

/**
 * Client component used in the booking page header to render the tour
 * thumbnail with a graceful fallback if the image fails to load.
 */
export function BookingHeaderThumbnail({ src, alt }: BookingHeaderThumbnailProps) {
  const [imgSrc, setImgSrc] = useState(src || "/images/placeholder.png");

  return (
    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-border/40 bg-[#f7f7f7] shadow-sm">
      <Image
        src={imgSrc}
        alt={alt}
        width={40}
        height={40}
        className="w-full h-full object-cover"
        onError={() => setImgSrc("/images/placeholder.png")}
      />
    </div>
  );
}
