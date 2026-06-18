"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cancelBookingSchema } from "../validators/booking.schema";
import { useCancelBooking, useRefundPreview } from "../hooks/useBookingQueries";
import { Textarea, Button } from "@/components/ui";
import { InfoCircle, X } from "@/components/icons/solar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/utils/api-error";

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
  const { data: preview, isLoading: isPreviewLoading, isError: isPreviewError } =
    useRefundPreview(bookingId, isOpen);

  const [reason, setReason] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = cancelBookingSchema.safeParse({
      cancellation_reason: reason,
      refund_bank_code: bankCode,
      refund_account_no: accountNo,
      refund_account_name: accountName,
    });
    if (!result.success) {
      const issueMessage = result.error.issues[0]?.message;
      setError(
        issueMessage === "cancel_reason_min_error"
          ? t("cancel_reason_min_error")
          : issueMessage ?? t("cancel_failed")
      );
      return;
    }
    if (preview?.requires_bank_details && (!bankCode || !accountNo || !accountName.trim())) {
      setError(t("refund_bank_required"));
      return;
    }

    cancelBooking(
      {
        id: bookingId,
        payload: {
          cancellation_reason: reason,
          refund_bank_code: preview?.requires_bank_details ? bankCode : undefined,
          refund_account_no: preview?.requires_bank_details ? accountNo : undefined,
          refund_account_name: preview?.requires_bank_details ? accountName : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("cancel_success"));
          setReason("");
          setBankCode("");
          setAccountNo("");
          setAccountName("");
          onSubmitSuccess();
          onClose();
        },
        onError: (err: unknown) => {
          toast.error(getApiErrorMessage(err, t("cancel_failed")));
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-md transition-opacity duration-300 animate-fade-in">
      <div 
        className={cn(
          "relative w-full max-w-lg overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]",
          "transition-all duration-300 scale-100 reveal-up"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-on-surface">
            {t("cancel_title")}
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-subtle transition-colors hover:text-primary"
            disabled={isPending}
            aria-label={t("button_close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
          <p className="text-sm text-on-surface-subtle">
            {t("cancel_confirm_question")}
          </p>

          <div className="rounded-xl border border-border bg-[#f8fafc] p-4 text-sm">
            {isPreviewLoading && <p>{t("refund_preview_loading")}</p>}
            {isPreviewError && <p className="text-red-500">{t("refund_preview_error")}</p>}
            {preview && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("refund_paid_amount")}</span>
                  <strong>{Number(preview.paid_amount).toLocaleString("vi-VN")}đ</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t("refund_rate")}</span>
                  <strong>{preview.refund_percent}%</strong>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>{t("refund_amount")}</span>
                  <strong>{Number(preview.refund_amount).toLocaleString("vi-VN")}đ</strong>
                </div>
                {preview.grace_period_applied && (
                  <p className="text-xs text-emerald-700">{t("refund_grace_applied")}</p>
                )}
              </div>
            )}
          </div>

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
                "w-full rounded-xl border bg-white px-4 py-3 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-subtle/50 focus:border-primary/50",
                error ? "border-red-500 focus:border-red-500" : "border-border"
              )}
            />
            {error && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>

          {preview?.requires_bank_details && (
            <div className="space-y-3 rounded-xl border border-border p-4">
              <p className="text-sm font-bold">{t("refund_bank_title")}</p>
              <select
                value={bankCode}
                onChange={(event) => setBankCode(event.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                disabled={isPending}
              >
                <option value="">{t("refund_bank_select")}</option>
                <option value="MB">MB Bank</option>
                <option value="VCB">Vietcombank</option>
                <option value="TCB">Techcombank</option>
                <option value="TPB">TPBank</option>
                <option value="ACB">ACB</option>
                <option value="BIDV">BIDV</option>
                <option value="VTB">VietinBank</option>
              </select>
              <input
                value={accountNo}
                onChange={(event) => setAccountNo(event.target.value.replace(/\D/g, ""))}
                placeholder={t("refund_account_no")}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                disabled={isPending}
              />
              <input
                value={accountName}
                onChange={(event) => setAccountName(event.target.value.toUpperCase())}
                placeholder={t("refund_account_name")}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                disabled={isPending}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isPending || isPreviewLoading || isPreviewError}
              className="rounded-full border-border px-5 py-2.5 text-on-surface transition-colors hover:bg-[#f7f7f7]"
            >
              {t("button_close")}
            </Button>
            <Button
              type="submit"
              disabled={isPending || isPreviewLoading || isPreviewError || !preview}
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
