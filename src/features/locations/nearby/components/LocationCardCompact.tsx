"use client";

import Image from "next/image";
import { IoStar, IoLocationOutline, IoHeartOutline } from "@/components/icons/solar";
import type { Location } from "@/types";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useState, useEffect } from "react";

interface LocationCardCompactProps {
  location: Location & { distance?: number };
  isHighlighted?: boolean;
  isSelected?: boolean;
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
}

export default function LocationCardCompact({
  location,
  isHighlighted = false,
  isSelected = false,
  onHover,
  onClick,
}: LocationCardCompactProps) {
  const t = useTranslations("locations");
  const detailHref = PUBLIC_ROUTES.LOCATION_DETAIL(location.slug);
  const { isAuthenticated } = useAuthStore();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const checkFavorite = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await api.get(`/user/favorites/check`, {
          location_id: location.id
        });
        if (active && response.success) {
          setIsSaved(!!response.data);
        }
      } catch {
        // Safe fallback
      }
    };
    checkFavorite();
    return () => {
      active = false;
    };
  }, [location.id, isAuthenticated]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.warning(t("detail.helpful_login") || "Vui lòng đăng nhập để lưu địa điểm");
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        const response = await api.delete(`/user/favorites`, {
          data: { location_id: location.id },
        });
        if (response.success) {
          setIsSaved(false);
          toast.success(t("detail.review_remove_file") ? "Đã xóa khỏi yêu thích" : "Removed from favorites");
        }
      } else {
        const response = await api.post(`/user/favorites`, {
          location_id: location.id,
        });
        if (response.success) {
          setIsSaved(true);
          toast.success(t("detail.save") ? "Đã lưu địa điểm yêu thích" : "Saved to favorites");
        }
      }
    } catch {
      toast.error(t("detail.helpful_error") || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price || price === 0) return t("price.free");
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDistance = (dist?: number | string) => {
    if (dist === undefined || dist === null) return "";
    const parsedDist = typeof dist === "number" ? dist : parseFloat(dist);
    if (isNaN(parsedDist)) return "";
    if (parsedDist < 1) {
      return `${Math.round(parsedDist * 1000)}m`;
    }
    return `${parsedDist.toFixed(1)} km`;
  };

  const rating = parseFloat(location.avg_rating) || 0;
  
  const isPlaceholder = (url?: string | null) => {
    if (!url) return true;
    const lower = url.toLowerCase();
    return lower.includes("placeholder") || lower.includes("destination") || lower.includes("no-image") || lower.includes("temp");
  };

  const getValidImage = () => {
    if (location.thumbnail && !isPlaceholder(location.thumbnail)) {
      return location.thumbnail;
    }
    if (location.images && location.images[0] && !isPlaceholder(location.images[0])) {
      return location.images[0];
    }
    const fallbacks = [
      "/images/discovery/bana-hills.png",
      "/images/discovery/dragon-bridge.png",
      "/images/discovery/hoi-an.png",
      "/images/discovery/my-khe.png",
      "/images/discovery/son-tra.png"
    ];
    const index = typeof location.id === "number" ? Math.abs(location.id) % fallbacks.length : 0;
    return fallbacks[index];
  };

  const image = getValidImage();

  // Resolve category name (supporting both eager-loaded Category object and custom string fallback)
  const categoryName = typeof location.category === "object" && location.category !== null
    ? (location.category as { name: string }).name
    : location.category || t("filters.all");

  return (
    <div
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onClick={onClick}
      className={`group relative flex gap-4 rounded-2xl border p-3 cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-[#8b6a55] bg-[#8b6a55]/20 shadow-lg"
          : isHighlighted
            ? "border-[#8b6a55]/60 bg-[#8b6a55]/10 shadow-md"
            : "border-[#262626] bg-[#111111]/80 hover:border-[#8b6a55]/40 hover:bg-[#171717]/75"
      }`}
    >
      <div className="flex flex-1 gap-4 text-inherit no-underline min-w-0">
        {/* Thumbnail Image */}
        <Link
          href={detailHref}
          onClick={(e) => e.stopPropagation()}
          className="relative w-18 h-18 rounded-xl overflow-hidden flex-shrink-0 bg-[#080808] border border-[#262626] block"
        >
          <Image
            src={image}
            alt={location.name}
            fill
            sizes="72px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Content Panel */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <Link
              href={detailHref}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-black text-white hover:text-[#8b6a55] group-hover:text-[#8b6a55] transition-colors leading-snug line-clamp-1 no-underline block"
            >
              {location.name}
            </Link>

            {/* Distance & Category Badges */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {location.distance !== undefined && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#8b6a55] font-mono bg-[#8b6a55]/10 px-1.5 py-0.5 rounded border border-[#8b6a55]/30">
                  <IoLocationOutline className="text-xs" />
                  {formatDistance(location.distance)}
                </span>
              )}
              <span className="text-[11px] text-[#a3a3a3] font-semibold truncate max-w-[120px]">
                {categoryName}
              </span>
            </div>
          </div>

          {/* Ratings & Price */}
          <div className="flex items-center gap-3 mt-1 text-[11px] text-[#a3a3a3]">
            <div className="flex items-center gap-1">
              <IoStar className="text-yellow-500 text-xs flex-shrink-0" />
              <span className="font-bold text-white">{rating.toFixed(1)}</span>
              <span>({location.review_count})</span>
            </div>
            <span>·</span>
            <span className="truncate max-w-[100px]">{formatPrice(location.price_min)}</span>
          </div>
        </div>
      </div>

      {/* Favorite Button Overlay */}
      <button
        onClick={handleFavoriteClick}
        disabled={isSaving}
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
          isSaved
            ? "bg-[#8b6a55] border-[#8b6a55] text-white"
            : "bg-[#080808]/80 backdrop-blur-sm border-[#262626] text-[#737373] hover:text-[#8b6a55] hover:border-[#8b6a55]"
        }`}
        aria-label="Add to favorites"
      >
        <IoHeartOutline className={`text-base ${isSaved ? "fill-white" : ""} ${isSaving ? "animate-pulse" : ""}`} />
      </button>
    </div>
  );
}
