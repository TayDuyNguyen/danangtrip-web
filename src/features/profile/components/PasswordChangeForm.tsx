"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle, Shield } from "lucide-react";
import { cn } from "@/utils/string";
import { changePasswordSchema } from "../validators/profile.validator";
import type { ChangePasswordFormInput } from "../validators/profile.validator";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormFields {
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface FormErrors {
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

interface FocusState {
  current_password: boolean;
  password: boolean;
  password_confirmation: boolean;
}

// ─── Password strength helpers ────────────────────────────────────────────────

function getStrengthScore(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  return score; // 0–5
}

function getStrengthLevel(score: number): 0 | 1 | 2 | 3 {
  if (score <= 1) return 0;
  if (score <= 2) return 1;
  if (score <= 3) return 2;
  return 3;
}

const STRENGTH_COLORS: Record<number, string> = {
  0: "bg-red-500",
  1: "bg-orange-400",
  2: "bg-primary",
  3: "bg-emerald-400",
};

const STRENGTH_LABEL_KEYS: Record<number, string> = {
  0: "change_password.strength_weak",
  1: "change_password.strength_fair",
  2: "change_password.strength_good",
  3: "change_password.strength_strong",
};

const STRENGTH_TEXT_COLORS: Record<number, string> = {
  0: "text-red-400",
  1: "text-orange-400",
  2: "text-primary",
  3: "text-emerald-500",
};

// ─── Main Component ────────────────────────────────────────────────────────────

interface PasswordChangeFormProps {
  /** Called on successful password change; use to run the mutation */
  onSubmit: (data: ChangePasswordFormInput) => void;
  isLoading?: boolean;
  /** If the API returns a wrong-current-password error, pass it here */
  apiError?: string | null;
}

export function PasswordChangeForm({
  onSubmit,
  isLoading = false,
  apiError,
}: PasswordChangeFormProps) {
  const t = useTranslations("settings");

  const [fields, setFields] = useState<FormFields>({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focus, setFocus] = useState<FocusState>({
    current_password: false,
    password: false,
    password_confirmation: false,
  });

  const handleChange = useCallback(
    (field: keyof FormFields) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFields((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear field-level error on edit
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      },
    [errors]
  );

  const handleFocus = useCallback(
    (field: keyof FocusState) => () =>
      setFocus((prev) => ({ ...prev, [field]: true })),
    []
  );

  const handleBlur = useCallback(
    (field: keyof FocusState) => () =>
      setFocus((prev) => ({ ...prev, [field]: false })),
    []
  );

  const handleReset = () => {
    setFields({ current_password: "", password: "", password_confirmation: "" });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = changePasswordSchema.safeParse(fields);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data);
  };

  // ─── Derived state ──────────────────────────────────────────────────────────
  const strengthScore = getStrengthScore(fields.password);
  const strengthLevel = getStrengthLevel(strengthScore);
  const showStrength = fields.password.length > 0;

  const checks = {
    minLength: fields.password.length >= 8,
    uppercase: /[A-Z]/.test(fields.password),
    lowercase: /[a-z]/.test(fields.password),
    number: /\d/.test(fields.password),
    special: /[@$!%*?&]/.test(fields.password),
    match:
      fields.password_confirmation.length > 0 &&
      fields.password === fields.password_confirmation,
  };

  const isFormValid =
    fields.current_password.length > 0 &&
    Object.values(checks).every(Boolean);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 rounded-[28px] border border-border bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] duration-500 sm:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start gap-4 border-b border-border pb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-on-surface">
            {t("change_password.heading")}
          </h2>
          <p className="mt-0.5 text-sm text-on-surface-subtle">
            {t("change_password.description")}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        id="password-change-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6"
      >
        {/* Current password */}
        <Input
          id="current-password"
          label={t("change_password.current_password_label")}
          placeholder={t("change_password.current_password_placeholder")}
          isPassword
          autoComplete="current-password"
          value={fields.current_password}
          onChange={handleChange("current_password")}
          onFocus={handleFocus("current_password")}
          onBlur={handleBlur("current_password")}
          isFocused={focus.current_password}
          error={apiError ?? errors.current_password}
          disabled={isLoading}
        />

        {/* Divider */}
        <div className="border-t border-border" />

        {/* New password */}
        <Input
          id="new-password"
          label={t("change_password.new_password_label")}
          placeholder={t("change_password.new_password_placeholder")}
          isPassword
          autoComplete="new-password"
          value={fields.password}
          onChange={handleChange("password")}
          onFocus={handleFocus("password")}
          onBlur={handleBlur("password")}
          isFocused={focus.password}
          error={errors.password}
          disabled={isLoading}
        />

        {/* Password strength meter */}
        {showStrength && (
          <div
            className="space-y-2 animate-in fade-in duration-300"
            aria-live="polite"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-subtle">
                {t("change_password.strength_label")}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold transition-colors duration-300",
                  STRENGTH_TEXT_COLORS[strengthLevel]
                )}
              >
                {t(STRENGTH_LABEL_KEYS[strengthLevel])}
              </span>
            </div>
            {/* 4 segments */}
            <div className="grid grid-cols-4 gap-1.5" role="meter" aria-label={t("change_password.strength_label")} aria-valuenow={strengthLevel} aria-valuemin={0} aria-valuemax={3}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-400",
                    i <= strengthLevel && showStrength
                      ? STRENGTH_COLORS[strengthLevel]
                      : "bg-[#ececec]"
                  )}
                />
              ))}
            </div>

            {/* Realtime checklist */}
            <ul className="space-y-1.5 mt-3" aria-label="Password requirements">
              {[
                { key: "minLength", label: t("change_password.checklist_min_length") },
                { key: "uppercase", label: t("change_password.checklist_uppercase") },
                { key: "lowercase", label: t("change_password.checklist_lowercase") },
                { key: "number", label: t("change_password.checklist_number") },
                { key: "special", label: t("change_password.checklist_special") },
              ].map(({ key, label }) => {
                const passed = checks[key as keyof typeof checks];
                return (
                  <li
                    key={key}
                    className={cn(
                      "flex items-center gap-2 text-xs transition-colors duration-300",
                      passed ? "text-emerald-500" : "text-on-surface-subtle"
                    )}
                  >
                    {passed ? (
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 shrink-0 text-[#c4c4c4]" aria-hidden="true" />
                    )}
                    <span>{label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Confirm password */}
        <Input
          id="confirm-password"
          label={t("change_password.confirm_password_label")}
          placeholder={t("change_password.confirm_password_placeholder")}
          isPassword
          autoComplete="new-password"
          value={fields.password_confirmation}
          onChange={handleChange("password_confirmation")}
          onFocus={handleFocus("password_confirmation")}
          onBlur={handleBlur("password_confirmation")}
          isFocused={focus.password_confirmation}
          error={errors.password_confirmation}
          disabled={isLoading}
        />

        {/* Match indicator */}
        {fields.password_confirmation.length > 0 && (
          <p
            className={cn(
              "flex items-center gap-1.5 text-xs -mt-4 animate-in fade-in duration-300",
              checks.match ? "text-emerald-500" : "text-on-surface-subtle"
            )}
            aria-live="polite"
          >
            {checks.match ? (
              <CheckCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <XCircle className="h-3.5 w-3.5 shrink-0 text-[#c4c4c4]" aria-hidden="true" />
            )}
            {t("change_password.checklist_match")}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={handleReset}
            disabled={isLoading}
          >
            {t("change_password.cancel_button")}
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto sm:ml-auto"
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
            id="password-change-submit"
          >
            {t("change_password.submit_button")}
          </Button>
        </div>
      </form>
    </div>
  );
}
