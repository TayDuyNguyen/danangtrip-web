"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  useUserRatingsQuery,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
} from "../hooks/useUserRatings";
import { RatingCard } from "./RatingCard";
import { EditRatingModal } from "./EditRatingModal";
import { DeleteRatingDialog } from "./DeleteRatingDialog";
import type { UserRatingListItem } from "@/types";
import {
  MessageSquare,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/utils/string";
import Image from "next/image";

export function MyRatingsClient() {
  const t = useTranslations("ratings");

  // State Management
  const [activeTab, setActiveTab] = useState<"all" | "location" | "tour">("all");
  const [page, setPage] = useState(1);
  const perPage = 5; // Good size for detailed list cards

  // Modal / Dialog States
  const [editingRating, setEditingRating] = useState<UserRatingListItem | null>(null);
  const [deletingRating, setDeletingRating] = useState<UserRatingListItem | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // TanStack Query
  const ratingsQuery = useUserRatingsQuery({
    page,
    per_page: perPage,
    ...(activeTab === "all" ? {} : { type: activeTab }),
  });

  // Mutation hooks
  const updateMutation = useUpdateRatingMutation();
  const deleteMutation = useDeleteRatingMutation();

  const handleTabChange = (tab: "all" | "location" | "tour") => {
    setActiveTab(tab);
    setPage(1); // Reset page on tab swap
  };

  // Actions triggers
  const handleEditSubmit = ({
    score,
    comment,
    files,
  }: {
    score: number;
    comment: string;
    files?: File[];
  }) => {
    if (!editingRating) return;
    updateMutation.mutate(
      { ratingId: editingRating.id, score, comment, files },
      {
        onSuccess: () => {
          setEditingRating(null);
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingRating) return;
    deleteMutation.mutate(deletingRating.id, {
      onSuccess: () => {
        setDeletingRating(null);
      },
    });
  };

  // derived metadata
  const listItems = ratingsQuery.data?.data || [];
  const pagination = ratingsQuery.data
    ? {
        currentPage: ratingsQuery.data.current_page,
        lastPage: ratingsQuery.data.last_page,
        total: ratingsQuery.data.total,
      }
    : { currentPage: 1, lastPage: 1, total: 0 };

  const isLoading = ratingsQuery.isLoading;
  const isError = ratingsQuery.isError;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            {t("title")}
          </h1>
          <p className="text-sm text-[#737373] font-medium">
            {isLoading
              ? "..."
              : t("header.count_single", { count: pagination.total })}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-[#262626] flex overflow-x-auto gap-2 min-w-max pb-px">
        {(["all", "location", "tour"] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "px-5 py-3 text-sm font-semibold relative transition-all duration-200",
                active
                  ? "text-white border-b-2 border-b-[#8b6a55]"
                  : "text-[#737373] hover:text-white"
              )}
            >
              {t(`tabs.${tab}`, { count: active ? pagination.total : "..." })}
            </button>
          );
        })}
      </div>

      {/* Main List Bounds */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-[#0a0a0a]/40 border border-[#262626]/60 rounded-xl p-5 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-[#171717] rounded-lg" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-[#171717] rounded w-1/4" />
                  <div className="h-3 bg-[#171717] rounded w-1/3" />
                </div>
              </div>
              <div className="h-4 bg-[#171717] rounded w-3/4" />
              <div className="h-4 bg-[#171717] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-red-950/10 border border-red-500/10 rounded-xl text-red-400">
          <AlertCircle className="h-10 w-10 mb-3 animate-bounce" />
          <p className="text-sm font-semibold mb-4">
            {t("toasts.load_error")}
          </p>
          <button
            onClick={() => ratingsQuery.refetch()}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            {t("toasts.retry_button")}
          </button>
        </div>
      ) : listItems.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-[#0a0a0a]/30 border border-[#262626] border-dashed rounded-xl animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-[#171717] rounded-full border border-[#262626] flex items-center justify-center text-[#737373] mb-6 relative">
            <MessageSquare className="h-10 w-10" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-[#8b6a55] rounded-full border-2 border-[#080808]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t("empty.title")}</h3>
          <p className="text-sm text-[#737373] max-w-sm mb-6 leading-relaxed">
            {t("empty.subtitle")}
          </p>
          <Link
            href="/tours"
            className="px-6 py-3 rounded-lg bg-[#8b6a55] hover:bg-[#725442] text-white font-bold text-sm tracking-tight transition-all"
          >
            {t("empty.cta")}
          </Link>
        </div>
      ) : (
        // Active Rating Card List
        <div className="space-y-4">
          <div className="space-y-4">
            {listItems.map((rating) => (
              <RatingCard
                key={rating.id}
                rating={rating}
                onEdit={setEditingRating}
                onDelete={setDeletingRating}
                onImageClick={setLightboxUrl}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.lastPage > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6 pt-4 border-t border-[#1a1a1a]">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 rounded-lg border border-[#262626] bg-[#0a0a0a] text-[#737373] hover:text-white disabled:opacity-30 disabled:hover:text-[#737373] transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-xs text-[#737373] font-semibold">
                Trang {pagination.currentPage} / {pagination.lastPage}
              </span>

              <button
                type="button"
                disabled={page === pagination.lastPage}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.lastPage))
                }
                className="p-2 rounded-lg border border-[#262626] bg-[#0a0a0a] text-[#737373] hover:text-white disabled:opacity-30 disabled:hover:text-[#737373] transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit modal popup */}
      <EditRatingModal
        key={editingRating?.id ?? "none"}
        open={editingRating !== null}
        onClose={() => setEditingRating(null)}
        onConfirm={handleEditSubmit}
        isPending={updateMutation.isPending}
        initialScore={editingRating?.score ?? 5}
        initialComment={editingRating?.comment ?? ""}
        initialImages={editingRating?.images}
      />

      {/* Delete confirmation dialog */}
      <DeleteRatingDialog
        open={deletingRating !== null}
        onClose={() => setDeletingRating(null)}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />

      {/* Image Lightbox overlays */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 p-2 rounded-lg text-[#737373] hover:text-white bg-[#111111]/80 hover:bg-[#1c1c1c]/80 transition-all z-10"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative w-full max-w-4xl aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={lightboxUrl}
              alt="Lightbox review preview"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
