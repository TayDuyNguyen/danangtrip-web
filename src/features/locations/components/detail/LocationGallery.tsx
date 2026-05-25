'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from "@/components/icons/solar";
import { cn } from '@/lib/utils';

interface LocationGalleryProps {
  images: string[];
  locationName: string;
  isLoading?: boolean;
}

const LocationGallery: React.FC<LocationGalleryProps> = ({ images, locationName, isLoading }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-[50vh] w-full animate-pulse rounded-xl bg-white/5 border border-white/10" />
        <div className="flex gap-3">
          <div className="h-20 w-[120px] shrink-0 animate-pulse rounded-lg bg-white/5" />
          <div className="h-20 w-[120px] shrink-0 animate-pulse rounded-lg bg-white/5" />
          <div className="h-20 w-[120px] shrink-0 animate-pulse rounded-lg bg-white/5" />
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Image — Stitch style: full-width hero with rounded border */}
      <div className="group relative h-[50vh] md:h-[60vh] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <Image
          src={images[activeIndex]}
          alt={`${locationName} - ${activeIndex + 1}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2.5 text-white backdrop-blur-md transition-all hover:bg-black/50 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2.5 text-white backdrop-blur-md transition-all hover:bg-black/50 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter — Stitch glass-panel pill bottom-right */}
        <div className="absolute bottom-5 right-5 glass-retro px-4 py-1.5 rounded-full text-xs font-mono text-neutral-300">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails strip — Stitch style: 120x80 fixed size */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative h-20 w-[120px] shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300',
                activeIndex === index
                  ? 'border-primary opacity-100'
                  : 'border-white/10 opacity-60 hover:opacity-90'
              )}
            >
              <Image
                src={image}
                alt={`${locationName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationGallery;
