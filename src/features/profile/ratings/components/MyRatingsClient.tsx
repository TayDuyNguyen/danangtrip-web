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
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-on-surface">
            {t("title")}
          </h1>
          <p className="text-sm font-medium text-on-surface-subtle">
            {isLoading
              ? "..."
              : t("header.count_single", { count: pagination.total })}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-border flex overflow-x-auto gap-2 min-w-max pb-px">
        {(["all", "location", "tour"] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "px-5 py-3 text-sm font-semibold relative transition-all duration-200",
                active
                  ? "text-on-surface border-b-2 border-b-primary"
                  : "text-on-surface-subtle hover:text-on-surface"
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
              className="bg-surface-container/40 border border-border/60 rounded-xl p-5 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-surface-container-highest rounded-lg" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-surface-container-highest rounded w-1/4" />
                  <div className="h-3 bg-surface-container-highest rounded w-1/3" />
                </div>
              </div>
              <div className="h-4 bg-surface-container-highest rounded w-3/4" />
              <div className="h-4 bg-surface-container-highest rounded w-1/2" />
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
        <div className="flex flex-col items-center justify-center text-center py-8 px-4 bg-surface-container/30 border border-border border-dashed rounded-xl animate-in fade-in duration-500">
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface-container-highest text-on-surface-subtle">
            <MessageSquare className="h-10 w-10" />
            <div className="absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-white bg-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-on-surface">{t("empty.title")}</h3>
          <p className="mb-6 max-w-sm text-sm leading-relaxed text-on-surface-subtle">
            {t("empty.subtitle")}
          </p>
          <Link
            href="/tours"
            className="px-6 py-3 rounded-lg bg-primary hover:bg-[#725442] text-white font-bold text-sm tracking-tight transition-all"
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
            <div className="mt-6 flex items-center justify-center gap-3 border-t border-border pt-4">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="rounded-lg border border-border bg-white p-2 text-on-surface-subtle transition-colors hover:bg-[#f7f7f7] hover:text-on-surface disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-on-surface-subtle"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-xs font-semibold text-on-surface-subtle">
                Trang {pagination.currentPage} / {pagination.lastPage}
              </span>

              <button
                type="button"
                disabled={page === pagination.lastPage}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.lastPage))
                }
                className="rounded-lg border border-border bg-white p-2 text-on-surface-subtle transition-colors hover:bg-[#f7f7f7] hover:text-on-surface disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-on-surface-subtle"
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
            className="absolute right-4 top-4 z-10 rounded-lg bg-black/40 p-2 text-white/80 transition-all hover:bg-black/55 hover:text-white"
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
