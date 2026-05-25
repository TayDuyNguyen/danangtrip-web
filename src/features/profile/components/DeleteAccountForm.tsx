"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, XCircle, ShieldAlert, Check } from "lucide-react";
import { cn } from "@/utils/string";
import { Link } from "@/i18n/navigation";
import { deleteAccountSchema } from "../validators/profile.validator";

interface DeleteAccountFormProps {
  /** Called with the verified password to run the mutation */
  onSubmit: (password: string) => void;
  isLoading?: boolean;
  /** Field-level errors mapped from API or validator schemas */
  apiError?: string | null;
  /** Checked to conditionally show the active bookings warning */
  activeBookingsCount: number;
}

export function DeleteAccountForm({
  onSubmit,
  isLoading = false,
  apiError,
  activeBookingsCount,
}: DeleteAccountFormProps) {
  const t = useTranslations("settings");
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate inputs locally
    const result = deleteAccountSchema.safeParse({
      confirmCheckbox,
      password,
    });

    if (!result.success) {
      const issue = result.error.issues[0];
      if (issue.path[0] === "confirmCheckbox") {
        setError(t("delete_account.confirm_checkbox_label"));
      } else {
        setError(t("error.required"));
      }
      return;
    }

    // Trigger step-2 confirmation modal
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsModalOpen(false);
    onSubmit(password);
  };

  const isFormValid = confirmCheckbox && password.length > 0 && activeBookingsCount === 0;

  return (
    <div className="bg-[#0a0a0a]/60 border border-[#262626] rounded-xl p-6 sm:p-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8 pb-6 border-b border-[#1a1a1a]">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5 text-red-500" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg tracking-tight">
            {t("delete_account.heading")}
          </h2>
          <p className="text-[#737373] text-sm mt-0.5">
            {t("delete_account.subtitle")}
          </p>
        </div>
      </div>

      {/* Consequences Warning Card */}
      <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-5 mb-6">
        <h3 className="text-red-500 font-semibold text-sm mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {t("delete_account.warning_title")}
        </h3>
        <ul className="space-y-3" aria-label="Account deletion consequences">
          {[
            t("delete_account.warning_1"),
            t("delete_account.warning_2"),
            t("delete_account.warning_3"),
            t("delete_account.warning_4"),
          ].map((warning, index) => (
            <li key={index} className="flex items-start gap-3 text-xs text-[#d4d4d4]">
              <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{warning}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Active bookings warning banner */}
      {activeBookingsCount > 0 && (
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4 mb-6 flex gap-3 animate-in fade-in duration-300">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <p className="text-amber-500 text-xs font-semibold">
              {t("delete_account.active_bookings_warning")}
            </p>
            <Link
              href="/profile/bookings"
              className="text-[#8b6a55] hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1 mt-1"
            >
              {t("delete_account.view_bookings")}
            </Link>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Checkbox confirmation */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={confirmCheckbox}
            onClick={() => setConfirmCheckbox(!confirmCheckbox)}
            disabled={isLoading || activeBookingsCount > 0}
            className={cn(
              "w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all duration-200 mt-0.5 focus:outline-none focus:ring-1 focus:ring-red-500",
              confirmCheckbox
                ? "bg-red-500 border-red-500 text-white"
                : "border-[#404040] hover:border-red-500 text-transparent"
            )}
          >
            {confirmCheckbox && <Check className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[#a3a3a3] text-xs leading-5">
            {t("delete_account.confirm_checkbox_label")}
          </span>
        </div>

        {/* Password input */}
        <div className="space-y-2">
          <Input
            id="confirm-delete-password"
            label={t("delete_account.password_label")}
            placeholder={t("delete_account.password_placeholder")}
            isPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={(apiError || error) ?? undefined}
            disabled={isLoading || activeBookingsCount > 0}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-[#1a1a1a]">
          <Link
            href="/profile"
            className="w-full sm:w-auto text-center px-5 py-2.5 rounded-lg border border-[#262626] bg-[#0a0a0a] text-[#737373] hover:text-white hover:bg-white/5 text-sm font-semibold transition-all duration-200"
          >
            {t("delete_account.cancel_button")}
          </Link>

          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto sm:ml-auto bg-red-600 hover:bg-red-500 border-red-600 hover:border-red-500 text-white"
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
          >
            {t("delete_account.submit_button")}
          </Button>
        </div>
      </form>

      {/* Confirmation Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#0f0f0f] border border-[#262626] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-4 animate-bounce">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-white font-bold text-lg leading-tight">
                {t("delete_account.modal_title")}
              </h3>
              <p className="text-[#a3a3a3] text-sm mt-3 leading-relaxed">
                {t("delete_account.modal_body_1")}
              </p>
              <p className="text-red-500 font-bold text-sm mt-2">
                {t("delete_account.modal_body_2")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#1a1a1a]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#262626] bg-[#0a0a0a] text-[#a3a3a3] hover:text-white hover:bg-white/5 text-sm font-semibold transition-all duration-200"
              >
                {t("delete_account.modal_cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all duration-200"
              >
                {t("delete_account.modal_confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
