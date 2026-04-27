"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface TourImageGalleryProps {
  images: string[];
  title: string;
}

export default function TourImageGallery({ images, title }: TourImageGalleryProps) {
  const td = useTranslations("tour.detail");
  // Use first 5 images for the grid
  const gallery = images.slice(0, 5);
  
  if (gallery.length === 0) return null;

  return (
    <div className="reveal-up" style={{ animationDelay: "100ms" }}>
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px]">
        {/* Main Image */}
        <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-xl border border-border group">
          <Image
            src={gallery[0] || "/images/placeholder.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Sub Images */}
        {gallery.slice(1, 5).map((src, idx) => (
          <div 
            key={`${src}-${idx}`}
            className={cn(
              "relative overflow-hidden rounded-xl border border-border group hidden md:block",
              gallery.length === 2 && "md:col-span-2 md:row-span-1",
              gallery.length === 3 && idx === 0 && "md:col-span-2 md:row-span-1",
            )}
          >
            <Image
              src={src}
              alt={td("gallery_image_alt", { title, index: idx + 2 })}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
        
        {/* Show More Overlay on the last image if more than 5 */}
        {images.length > 5 && (
          <div className="absolute bottom-4 right-4 z-10">
            <button
              type="button"
              className="glass-surface px-4 py-2 rounded-full text-xs font-bold text-white hover:bg-white/20 transition-all active:scale-95"
              aria-label={td("gallery_more_aria", { count: images.length - 5 })}
            >
              {td("gallery_more", { count: images.length - 5 })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
