"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui";

interface DeleteRatingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteRatingDialog({
  open,
  onClose,
  onConfirm,
  isPending,
}: DeleteRatingDialogProps) {
  const t = useTranslations("ratings.dialog_delete");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      {/* Backdrop click closer */}
      <div className="absolute inset-0" onClick={isPending ? undefined : onClose} />

      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-border bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)] animate-in fade-in zoom-in-95 duration-300">
        <button
          type="button"
          disabled={isPending}
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-on-surface-subtle transition-all hover:bg-[#f7f7f7] hover:text-on-surface"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 animate-bounce">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <h2
            id="delete-dialog-title"
            className="mb-2 text-lg font-semibold tracking-tight text-on-surface"
          >
            {t("title")}
          </h2>

          <p className="mb-6 text-sm leading-relaxed text-on-surface-subtle">
            {t("message")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              type="button"
              variant="danger"
              className="w-full sm:order-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg border-transparent shrink-0"
              isLoading={isPending}
              onClick={onConfirm}
            >
              {isPending ? t("deleting") : t("confirm")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full rounded-lg border border-border bg-[#f7f7f7] py-2.5 font-semibold text-on-surface hover:bg-[#efefef] sm:order-1"
              disabled={isPending}
              onClick={onClose}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
