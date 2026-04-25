"use client";

import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ratingService } from "@/services/rating.service";

type Props = {
  open: boolean;
  onClose: () => void;
  locationId: number;
};

export default function WriteReviewModal({ open, onClose, locationId }: Props) {
  const t = useTranslations("locations");
  const queryClient = useQueryClient();
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const reset = () => {
    setScore(5);
    setComment("");
    setFiles([]);
  };

  const submit = useMutation({
    mutationFn: () =>
      ratingService.createForLocation({
        locationId,
        score,
        comment: comment.trim() || undefined,
        files,
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(t("detail.review_submit_success"));
        void queryClient.invalidateQueries({ queryKey: ["locations", locationId, "ratings"] });
        void queryClient.invalidateQueries({ queryKey: ["locations", locationId, "rating-stats"] });
        void queryClient.invalidateQueries({ queryKey: ["locations", locationId, "rating-check"] });
        reset();
        onClose();
      } else {
        toast.error(res.message || t("detail.review_submit_error"));
      }
    },
    onError: () => {
      toast.error(t("detail.review_submit_error"));
    },
  });

  if (!open) {
    return null;
  }

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) {
      return;
    }
    const next = [...files, ...Array.from(list)].slice(0, 5);
    setFiles(next);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="write-review-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={() => {
            reset();
            onClose();
          }}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
          aria-label={t("detail.review_cancel")}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 id="write-review-title" className="pr-10 text-xl font-bold text-gray-900">
          {t("detail.review_modal_title")}
        </h2>

        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-gray-700">{t("detail.review_score_label")}</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setScore(n)}
                className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A19D]"
                aria-label={`${n} stars`}
              >
                <Star
                  className={cn(
                    "h-8 w-8",
                    n <= score ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label htmlFor="review-comment" className="text-sm font-medium text-gray-700">
            {t("detail.review_comment_label")}
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-800 outline-none ring-[#00A19D] focus:border-transparent focus:ring-2"
            placeholder={t("detail.review_comment_placeholder")}
          />
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">{t("detail.review_images_label")}</p>
          <p className="text-xs text-gray-500">{t("detail.review_images_hint")}</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={onPickFiles}
            className="text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-semibold"
          />
          {files.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2">
                  <span className="truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="shrink-0 text-red-500 hover:underline"
                  >
                    {t("detail.review_remove_file")}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="primary"
            className="bg-[#FF5A5F] shadow-[#FF5A5F]/20 hover:bg-[#FF5A5F]/90"
            isLoading={submit.isPending}
            onClick={() => submit.mutate()}
          >
            {t("detail.review_submit")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={submit.isPending}
            onClick={() => {
              reset();
              onClose();
            }}
          >
            {t("detail.review_cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
}
