"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cancelBookingSchema } from "../validators/booking.schema";
import { useCancelBooking } from "../hooks/useBookingQueries";
import { Textarea, Button } from "@/components/ui";
import { InfoCircle, X } from "@/components/icons/solar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import axios from "axios";

interface CancelBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number | string;
  onSubmitSuccess: () => void;
}

export function CancelBookingDialog({
  isOpen,
  onClose,
  bookingId,
  onSubmitSuccess,
}: CancelBookingDialogProps) {
  const t = useTranslations("tour.history");
  const { mutate: cancelBooking, isPending } = useCancelBooking();

  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = cancelBookingSchema.safeParse({ cancellation_reason: reason });
    if (!result.success) {
      const issueMessage = result.error.issues[0]?.message;
      setError(
        issueMessage === "cancel_reason_min_error"
          ? t("cancel_reason_min_error")
          : issueMessage ?? t("cancel_failed")
      );
      return;
    }

    cancelBooking(
      {
        id: bookingId,
        payload: { cancellation_reason: reason },
      },
      {
        onSuccess: () => {
          toast.success(t("cancel_success"));
          setReason("");
          onSubmitSuccess();
          onClose();
        },
        onError: (err: unknown) => {
          let errorMessage = t("cancel_failed");
          if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || errorMessage;
          }
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in">
      <div 
        className={cn(
          "relative w-full max-w-lg overflow-hidden border border-border shadow-2xl rounded-2xl bg-surface",
          "transition-all duration-300 scale-100 reveal-up"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {t("cancel_title")}
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-subtle hover:text-white transition-colors"
            disabled={isPending}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
          <p className="text-sm text-on-surface-subtle">
            {t("cancel_confirm_question")}
          </p>

          {/* Warning banner */}
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex gap-3 text-red-400 text-xs leading-relaxed">
            <InfoCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{t("cancel_warning")}</span>
          </div>

          {/* Text Area Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-subtle uppercase tracking-wider">
              {t("cancel_reason_label")}
            </label>
            <Textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t("cancel_reason_placeholder")}
              rows={4}
              disabled={isPending}
              className={cn(
                "w-full bg-surface-container border rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary/50 outline-none transition-colors placeholder:text-on-surface-subtle/50",
                error ? "border-red-500 focus:border-red-500" : "border-border"
              )}
            />
            {error && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 rounded-full border-border text-on-surface hover:bg-surface-container-high transition-colors"
            >
              {t("button_close")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 hover:border-red-700 text-white font-semibold transition-colors disabled:opacity-50"
            >
              {isPending ? t("button_submitting") : t("button_submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
