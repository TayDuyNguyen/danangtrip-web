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
        <div className="h-[50vh] w-full animate-pulse rounded-[28px] border border-border bg-[#f3f4f6]" />
        <div className="flex gap-3">
          <div className="h-20 w-[120px] shrink-0 animate-pulse rounded-[18px] bg-[#f3f4f6]" />
          <div className="h-20 w-[120px] shrink-0 animate-pulse rounded-[18px] bg-[#f3f4f6]" />
          <div className="h-20 w-[120px] shrink-0 animate-pulse rounded-[18px] bg-[#f3f4f6]" />
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) return null;

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-3">
      <div className="group relative h-[50vh] w-full overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)] md:h-[60vh]">
        <Image
          src={images[activeIndex]}
          alt={`${locationName} - ${activeIndex + 1}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-border bg-white/92 p-2.5 text-on-surface shadow-sm backdrop-blur-sm transition-all hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-border bg-white/92 p-2.5 text-on-surface shadow-sm backdrop-blur-sm transition-all hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-5 right-5 rounded-full border border-border bg-white/92 px-4 py-1.5 text-xs font-semibold text-on-surface shadow-sm backdrop-blur-sm">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto py-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative h-20 w-[120px] shrink-0 overflow-hidden rounded-[18px] border-2 transition-all duration-300',
                activeIndex === index ? 'border-primary opacity-100' : 'border-border opacity-70 hover:opacity-90'
              )}
            >
              <Image src={image} alt={`${locationName} thumbnail ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationGallery;
