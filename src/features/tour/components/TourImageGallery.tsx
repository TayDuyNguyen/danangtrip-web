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
  const gallery = images.slice(0, 5);

  if (gallery.length === 0) return null;

  return (
    <div className="reveal-up" style={{ animationDelay: "100ms" }}>
      <div className="relative grid h-[400px] grid-cols-1 gap-4 md:h-[500px] md:grid-cols-4">
        <div className="group relative overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)] md:col-span-2 md:row-span-2">
          <Image
            src={gallery[0] || "/images/placeholder.png"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {gallery.slice(1, 5).map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className={cn(
              "group relative hidden overflow-hidden rounded-[22px] border border-border bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)] md:block",
              gallery.length === 2 && "md:col-span-2 md:row-span-1",
              gallery.length === 3 && idx === 0 && "md:col-span-2 md:row-span-1"
            )}
          >
            <Image
              src={src}
              alt={td("gallery_image_alt", { title, index: idx + 2 })}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}

        {images.length > 5 && (
          <div className="absolute bottom-4 right-4 z-10">
            <button
              type="button"
              className="rounded-full border border-border bg-white/92 px-4 py-2 text-xs font-bold text-on-surface shadow-sm backdrop-blur-sm transition-all hover:bg-white active:scale-95"
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
