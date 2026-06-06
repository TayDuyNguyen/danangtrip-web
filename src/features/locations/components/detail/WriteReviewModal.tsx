"use client";

import React, { useState } from "react";
import { Star, X } from "@/components/icons/solar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ratingService } from "@/services/rating.service";
import { getApiErrorMessage } from "@/utils";

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
        toast.error(getApiErrorMessage(res, t("detail.review_submit_error")));
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("detail.review_submit_error")));
    },
  });

  if (!open) return null;

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) return;
    const next = [...files, ...Array.from(list)].slice(0, 5);
    setFiles(next);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="write-review-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-border bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.16)]">
        <button
          type="button"
          onClick={() => {
            reset();
            onClose();
          }}
          className="absolute right-4 top-4 rounded-full border border-border bg-[#fafafa] p-2 text-on-surface-subtle transition-colors hover:border-primary/25 hover:bg-white hover:text-on-surface"
          aria-label={t("detail.review_cancel")}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 id="write-review-title" className="pr-10 text-xl font-semibold text-on-surface">
          {t("detail.review_modal_title")}
        </h2>

        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-on-surface">{t("detail.review_score_label")}</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setScore(n)}
                className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`${n} stars`}
              >
                <Star className={cn("h-8 w-8", n <= score ? "fill-primary text-primary" : "text-border")} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label htmlFor="review-comment" className="text-sm font-medium text-on-surface">
            {t("detail.review_comment_label")}
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-[18px] border border-border bg-white p-3 text-sm text-on-surface outline-none ring-primary focus:border-primary/20 focus:ring-2 focus:ring-primary/15"
            placeholder={t("detail.review_comment_placeholder")}
          />
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-on-surface">{t("detail.review_images_label")}</p>
          <p className="text-xs text-on-surface-subtle">{t("detail.review_images_hint")}</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={onPickFiles}
            className="text-sm text-on-surface-subtle file:mr-3 file:rounded-[14px] file:border file:border-border file:bg-[#fafafa] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-on-surface"
          />
          {files.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-on-surface-subtle">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 rounded-[14px] bg-[#fafafa] px-3 py-2">
                  <span className="truncate">{f.name}</span>
                  <button type="button" onClick={() => removeFile(i)} className="shrink-0 text-red-500 hover:underline">
                    {t("detail.review_remove_file")}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="primary" className="border border-transparent" isLoading={submit.isPending} onClick={() => submit.mutate()}>
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
