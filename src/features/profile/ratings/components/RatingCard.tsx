"use client";

import React, { useState } from "react";
import type { UserRatingListItem } from "@/types";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Star,
  MapPin,
  Compass,
  Edit,
  Trash2,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/utils/string";
import Image from "next/image";

interface RatingCardProps {
  rating: UserRatingListItem;
  onEdit: (rating: UserRatingListItem) => void;
  onDelete: (rating: UserRatingListItem) => void;
  onImageClick: (imageUrl: string) => void;
}

export function RatingCard({
  rating,
  onEdit,
  onDelete,
  onImageClick,
}: RatingCardProps) {
  const t = useTranslations("ratings");
  const [isExpanded, setIsExpanded] = useState(false);

  const isLocation = !!rating.location;

  const targetName = rating.location?.name || rating.tour?.name || t("card.unnamed_item");
  const targetSlug = rating.location?.slug || rating.tour?.slug || "";
  const targetLink = isLocation ? `/locations/${targetSlug}` : `/tours/${targetSlug}`;
  const targetThumb = rating.location?.thumbnail || rating.tour?.thumbnail || null;

  const formattedDate = new Date(rating.created_at).toLocaleDateString(
    undefined,
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 rounded-[28px] border border-border bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_20px_56px_rgba(15,23,42,0.1)]">
      {/* Header section */}
      <div className="mb-4 flex flex-col items-start justify-between gap-4 border-b border-border pb-4 sm:flex-row">
        {/* Left header */}
        <div className="flex gap-3 min-w-0">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-[#fafafa]">
            {targetThumb ? (
              <Image
                src={targetThumb}
                alt={targetName}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-subtle">
                {isLocation ? (
                  <MapPin className="h-5 w-5" />
                ) : (
                  <Compass className="h-5 w-5" />
                )}
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Badge */}
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                  isLocation
                    ? "bg-[#6366f1]/15 text-[#818cf8]"
                    : "bg-[#0284c7]/15 text-[#38bdf8]"
                )}
              >
                {isLocation ? (
                  <>
                    <MapPin className="h-3 w-3" />
                    {t("card.type_location")}
                  </>
                ) : (
                  <>
                    <Compass className="h-3 w-3" />
                    {t("card.type_tour")}
                  </>
                )}
              </span>

              {/* Title links */}
              {targetSlug ? (
                <Link
                  href={targetLink}
                  className="max-w-[200px] truncate text-sm font-semibold text-on-surface transition-colors hover:text-primary sm:max-w-[300px]"
                >
                  {targetName}
                </Link>
              ) : (
                <span className="truncate text-sm font-semibold text-on-surface">
                  {targetName}
                </span>
              )}
            </div>

            {/* Stars row */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cn(
                      "h-3.5 w-3.5",
                      n <= rating.score
                        ? "fill-[#f59e0b] text-[#f59e0b]"
                        : "text-[#262626]"
                    )}
                  />
                ))}
              </div>
              <span className="text-[11px] text-on-surface-subtle">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Right header with Status Badges and Actions */}
        <div className="flex sm:flex-col items-end gap-2 shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
          {/* Status Badge */}
          <span
            className={cn(
              "text-[10px] font-extrabold px-2.5 py-0.75 rounded-full tracking-wider",
              rating.status === "approved" && "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
              rating.status === "pending" && "border border-amber-500/20 bg-amber-500/10 text-amber-600",
              rating.status === "rejected" && "border border-red-500/20 bg-red-500/10 text-red-500"
            )}
          >
            {t(`card.status_${rating.status}`)}
          </span>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(rating)}
              className="rounded-lg border border-border bg-[#fafafa] p-1.5 text-on-surface-subtle transition-all hover:border-[#f59e0b]/40 hover:text-[#f59e0b]"
              title={t("card.edit_tooltip")}
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(rating)}
              className="rounded-lg border border-border bg-[#fafafa] p-1.5 text-on-surface-subtle transition-all hover:border-red-500/40 hover:text-red-400"
              title={t("card.delete_tooltip")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Body section */}
      <div className="space-y-3">
        {/* Comment block */}
        {rating.comment && (
          <div>
            <p
              className={cn(
                "whitespace-pre-line text-sm leading-relaxed text-on-surface-subtle",
                !isExpanded && "line-clamp-3"
              )}
            >
              {rating.comment}
            </p>
            {rating.comment.length > 200 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold text-primary hover:text-[#725442] transition-colors mt-1 focus:outline-none"
              >
                {isExpanded ? t("card.read_less") : t("card.read_more")}
              </button>
            )}
          </div>
        )}

        {/* Attached Images */}
        {rating.images && rating.images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {rating.images.map((img) => (
              <div
                key={img.id}
                onClick={() => onImageClick(img.image_url)}
                className="relative w-16 h-16 rounded-lg overflow-hidden border border-border cursor-pointer hover:border-primary/60 hover:scale-105 transition-all duration-200 shrink-0"
              >
                <Image
                  src={img.image_url}
                  alt="Review upload preview"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Rejection Warning Banner */}
        {rating.status === "rejected" && rating.rejected_reason && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-50 p-3 text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-normal">
              {t("card.rejected_reason", { reason: rating.rejected_reason })}
            </p>
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="mt-4 flex items-center gap-3 border-t border-border pt-3 text-xs text-on-surface-subtle">
        <span className="flex items-center gap-1.5">
          <ThumbsUp className="h-3.5 w-3.5 text-on-surface-subtle" />
          {t("card.helpful_count", { count: rating.helpful_count })}
        </span>
      </div>
    </article>
  );
}
