'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
      <div className="space-y-4">
        <div className="aspect-video w-full animate-pulse rounded-2xl bg-surface-container-low" />
        <div className="flex gap-3">
          <div className="h-20 w-32 shrink-0 animate-pulse rounded-xl bg-surface-container-low" />
          <div className="h-20 w-32 shrink-0 animate-pulse rounded-xl bg-surface-container-low" />
          <div className="h-20 w-32 shrink-0 animate-pulse rounded-xl bg-surface-container-low" />
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
    <div className="space-y-4">
      {/* Main Image */}
      <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-surface-container-low shadow-lg">
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
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-black/40 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-black/40 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300',
                activeIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent opacity-60 hover:opacity-100'
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
