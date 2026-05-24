"use client";

import React, { useState } from "react";
import { X, Star, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/utils/string";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Image from "next/image";

interface EditRatingModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: { score: number; comment: string; files?: File[] }) => void;
  isPending: boolean;
  initialScore: number;
  initialComment: string;
  initialImages?: Array<{ id: number; image_url: string }>;
}

export function EditRatingModal({
  open,
  onClose,
  onConfirm,
  isPending,
  initialScore,
  initialComment,
  initialImages = [],
}: EditRatingModalProps) {
  const t = useTranslations("ratings.modal_edit");
  const tToast = useTranslations("ratings.toasts");
  const [score, setScore] = useState(initialScore);
  const [comment, setComment] = useState(initialComment);
  const [files, setFiles] = useState<File[]>([]);

  if (!open) return null;

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) return;

    const addedFiles = Array.from(list);
    const totalCount = files.length + addedFiles.length;

    if (totalCount > 5) {
      toast.error(tToast("image_limit_error"));
      return;
    }

    const largeFile = addedFiles.some((f) => f.size > 5 * 1024 * 1024);
    if (largeFile) {
      toast.error(tToast("image_size_error"));
      return;
    }

    setFiles((prev) => [...prev, ...addedFiles].slice(0, 5));
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      return;
    }
    onConfirm({ score, comment: comment.trim(), files });
  };

  const isValid = comment.trim().length >= 10 && comment.trim().length <= 500;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div className="absolute inset-0" onClick={isPending ? undefined : onClose} />

      <div className="relative w-full max-w-lg rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 z-10 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          disabled={isPending}
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#737373] hover:text-white hover:bg-white/5 transition-all"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 id="edit-modal-title" className="text-xl font-bold text-white mb-6">
          {t("title")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#d4d4d4] block">
              {t("score_label")}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={isPending}
                  onClick={() => setScore(n)}
                  className="rounded-md p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b6a55]"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      n <= score ? "fill-[#8b6a55] text-[#8b6a55]" : "text-[#404040]"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="edit-comment" className="text-sm font-medium text-[#d4d4d4]">
                {t("comment_label")}
              </label>
              <span
                className={cn(
                  "text-xs",
                  comment.trim().length < 10 || comment.trim().length > 500
                    ? "text-[#737373]"
                    : "text-[#8b6a55]"
                )}
              >
                {t("char_counter", { count: comment.trim().length })}
              </span>
            </div>
            <textarea
              id="edit-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              disabled={isPending}
              maxLength={500}
              className="w-full resize-none rounded-lg border border-[#262626] bg-[#111111]/80 p-3 text-sm text-white outline-none ring-[#8b6a55] focus:border-transparent focus:ring-2 transition-all duration-200"
              placeholder={t("comment_placeholder")}
            />
            {comment.trim().length > 0 && comment.trim().length < 10 && (
              <p className="text-xs text-red-400 font-medium">
                Vui lòng nhập tối thiểu 10 ký tự.
              </p>
            )}
          </div>

          {/* Existing Images Info */}
          {initialImages.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#525252] uppercase tracking-wider block">
                Ảnh hiện tại trên hệ thống
              </span>
              <div className="flex gap-2 flex-wrap">
                {initialImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#262626]"
                  >
                    <Image
                      src={img.image_url}
                      alt="Current preview"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload new images */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-[#d4d4d4] block">
              {t("images_label")}
            </span>
            <div className="relative">
              <label
                className={cn(
                  "flex flex-col items-center justify-center border border-dashed border-[#262626] hover:border-[#8b6a55]/60 hover:bg-[#8b6a55]/5 rounded-lg py-5 px-4 cursor-pointer text-center transition-all duration-200",
                  isPending && "pointer-events-none opacity-50"
                )}
              >
                <UploadCloud className="h-6 w-6 text-[#525252] mb-1.5" />
                <span className="text-xs font-semibold text-white mb-0.5">
                  {t("upload_placeholder")}
                </span>
                <span className="text-[10px] text-[#737373]">
                  {t("upload_hint")}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isPending}
                  onChange={onPickFiles}
                  className="hidden"
                />
              </label>
            </div>

            {/* List new files */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((file, i) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div
                      key={`${file.name}-${i}`}
                      className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#262626] group shrink-0"
                    >
                      <Image
                        src={url}
                        alt="Local file preview"
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-bold transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex gap-3">
            <Button
              type="submit"
              variant="primary"
              disabled={!isValid || isPending}
              isLoading={isPending}
              className="w-full bg-[#8b6a55] hover:bg-[#725442] text-white font-semibold py-2.5 rounded-lg border-transparent shrink-0"
            >
              {isPending ? t("updating") : t("submit")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={onClose}
              className="w-full bg-[#171717] border border-[#262626] hover:border-white/10 hover:bg-white/5 text-[#d4d4d4] font-semibold py-2.5 rounded-lg"
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
