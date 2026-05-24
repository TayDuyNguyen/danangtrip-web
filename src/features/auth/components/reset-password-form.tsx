"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { resetPasswordSchema } from "../validators/auth.schema";
import { getApiErrorMessage } from "@/utils/api-error";
import { toast } from "sonner";
import { IoMailOutline, IoLockClosedOutline, IoChevronBack, CheckCircle2 } from "@/components/icons/solar";
import { Input } from "@/components/ui";
import { useFieldFocus } from "@/hooks/use-field-focus";
import AmbientBackground from "@/components/layout/AmbientBackground";

interface ResetPasswordFormProps {
  token?: string;
  email?: string;
}

export function ResetPasswordForm({ token = "", email: initialEmail = "" }: ResetPasswordFormProps) {
  const t = useTranslations("resetPassword");
  const tError = useTranslations("common.error");

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);

  const { isFocused, getFocusProps } = useFieldFocus<"email" | "password" | "confirmPassword">();
  const emailFocus = getFocusProps("email");
  const passwordFocus = getFocusProps("password");
  const confirmPasswordFocus = getFocusProps("confirmPassword");

  // Helper to translate Zod error key to localized text
  const getLocalizedError = (errorKey: string | null) => {
    if (!errorKey) return null;
    if (errorKey.startsWith("error.")) {
      const subKey = errorKey.replace("error.", "");
      // Safe typecast since we expect keys from common.json error namespace
      return tError(subKey as Parameters<typeof tError>[0]);
    }
    return errorKey;
  };

  // Mutation for calling Laravel reset password endpoint
  const resetMutation = useMutation({
    mutationFn: (data: Parameters<typeof authService.resetPassword>[0]) => authService.resetPassword(data),
    onSuccess: (response) => {
      if (response.success) {
        setIsSuccess(true);
        toast.success(t("success.title"));
      } else {
        const errorMsg = getApiErrorMessage(response, t("failure.general_error"));
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMsg = getApiErrorMessage(error, t("failure.general_error"));
      toast.error(errorMsg);
    },
  });

  // Dynamic validation handlers
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailError) {
      const result = resetPasswordSchema.safeParse({ token, email: val, password, confirmPassword });
      if (result.success || !result.error.issues.some(i => i.path[0] === "email")) {
        setEmailError(null);
      }
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (passwordError) {
      const result = resetPasswordSchema.safeParse({ token, email, password: val, confirmPassword });
      if (result.success || !result.error.issues.some(i => i.path[0] === "password")) {
        setPasswordError(null);
      }
    }
    // Also re-validate confirmation if it was already marked as mismatching
    if (confirmPasswordError) {
      const result = resetPasswordSchema.safeParse({ token, email, password: val, confirmPassword });
      if (result.success || !result.error.issues.some(i => i.path[0] === "confirmPassword")) {
        setConfirmPasswordError(null);
      }
    }
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (confirmPasswordError) {
      const result = resetPasswordSchema.safeParse({ token, email, password, confirmPassword: val });
      if (result.success || !result.error.issues.some(i => i.path[0] === "confirmPassword")) {
        setConfirmPasswordError(null);
      }
    }
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    emailFocus.onBlur(e);
    if (email) {
      const result = resetPasswordSchema.safeParse({ token, email, password, confirmPassword });
      const issue = result.error?.issues.find(i => i.path[0] === "email");
      setEmailError(issue ? getLocalizedError(issue.message) : null);
    }
  };

  const handlePasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    passwordFocus.onBlur(e);
    if (password) {
      const result = resetPasswordSchema.safeParse({ token, email, password, confirmPassword });
      const issue = result.error?.issues.find(i => i.path[0] === "password");
      setPasswordError(issue ? getLocalizedError(issue.message) : null);
    }
  };

  const handleConfirmPasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    confirmPasswordFocus.onBlur(e);
    if (confirmPassword) {
      const result = resetPasswordSchema.safeParse({ token, email, password, confirmPassword });
      const issue = result.error?.issues.find(i => i.path[0] === "confirmPassword");
      setConfirmPasswordError(issue ? getLocalizedError(issue.message) : null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Explicit Validation of all fields before submitting
    const result = resetPasswordSchema.safeParse({
      token,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      setEmailError(null);
      setPasswordError(null);
      setConfirmPasswordError(null);

      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        const localizedMsg = getLocalizedError(issue.message);
        if (path === "email") setEmailError(localizedMsg);
        if (path === "password") setPasswordError(localizedMsg);
        if (path === "confirmPassword") setConfirmPasswordError(localizedMsg);
      });

      toast.error(t("failure.general_error"));
      return;
    }

    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // Map payload field confirmPassword to backend field password_confirmation
    resetMutation.mutate({
      token,
      email,
      password,
      password_confirmation: confirmPassword,
    });
  };

  // State A: Missing / Invalid URL Token
  if (!token) {
    return (
      <div className="design-page flex min-h-screen justify-center items-center p-4 sm:p-8 relative overflow-hidden bg-[#080808]">
        <AmbientBackground />

        <div className="relative flex w-full max-w-md h-auto shadow-[0_0_40px_rgba(139,106,85,0.12)] rounded-xl animate-reveal-up bg-[#080808] border border-[#262626] p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 animate-pulse">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              {t("invalid_token.title")}
            </h2>
            <p className="text-xs sm:text-sm text-[#a3a3a3] max-w-sm mx-auto leading-relaxed">
              {t("invalid_token.subtitle")}
            </p>
          </div>

          <div className="h-px bg-[#262626] my-6" />

          <div className="flex flex-col gap-3">
            <Link
              id="request-new-link"
              href={ROUTES.FORGOT_PASSWORD}
              className="w-full inline-flex items-center justify-center bg-[#171717] hover:border-[#8b6a55] hover:text-[#8b6a55] border border-[#262626] text-white font-semibold py-3.5 rounded-full transition-all duration-300 uppercase tracking-wider text-xs"
            >
              <span>{t("invalid_token.action_btn")}</span>
            </Link>

            <Link
              id="back-to-login-btn"
              href={ROUTES.LOGIN}
              className="flex items-center justify-center gap-1.5 text-xs text-[#737373] hover:text-white transition-all font-medium py-2"
            >
              <IoChevronBack className="w-3.5 h-3.5" />
              <span>{t("back_to_login")}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="design-page flex min-h-screen justify-center items-center p-4 sm:p-8 relative overflow-hidden bg-[#080808]">
      {/* Premium Ambient Background */}
      <AmbientBackground />

      <div className="relative flex w-full max-w-md lg:max-w-4xl lg:w-3/4 xl:w-2/3 h-auto lg:h-[550px] shadow-[0_0_40px_rgba(139,106,85,0.12)] rounded-xl glow-effect animate-reveal-up">
        
        {/* Conic-gradient Spinning Border Effect (Hidden on mobile for performance) */}
        <div className="absolute inset-[-2px] rounded-[10px] overflow-hidden pointer-events-none z-0 hidden sm:block">
          <div 
            className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite]" 
            style={{ backgroundImage: 'conic-gradient(from 0deg, transparent 0 240deg, rgba(139,106,85,0.3) 300deg, #8b6a55 360deg)' }}
          />
        </div>

        {/* Main Content Box */}
        <div className="relative z-10 flex w-full h-full rounded-xl overflow-hidden bg-[#080808] border border-[#262626]">
          
          {/* Left panel - brand image / copper background gradient */}
          <div
            className="hidden lg:flex flex-1 bg-linear-to-br from-[#5c3822] to-[#080808] flex-col pt-12 pl-8 pr-16 text-white relative"
            style={{ clipPath: "polygon(0 0, 100% 0, 60% 100%, 0% 100%)" }}
          >
            <h1 className="text-4xl mb-4 font-bold uppercase tracking-wide">
              {t("welcome_title")}
            </h1>
            <p className="text-[#d4d4d4] text-lg leading-relaxed">
              {t("welcome_subtitle")}
            </p>
          </div>

          {/* Right panel - Form or Success content */}
          <div className="flex flex-1 items-center justify-center p-5 sm:p-8 bg-[#080808]">
            <div className="w-full max-w-md flex flex-col items-center">
              
              {/* Mobile Title Header */}
              <div className="flex items-center justify-center mb-6 lg:hidden">
                <span className="font-bold text-[#8b6a55] text-xl text-center uppercase tracking-wider">
                  {t("brand_name")}
                </span>
              </div>

              {!isSuccess ? (
                // State B: Form Entry Screen
                <div className="w-full">
                  <h2 className="text-2xl sm:text-3xl font-bold uppercase text-white mb-2 text-center lg:text-left">
                    {t("title")}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#737373] mb-8 text-center lg:text-left">
                    {t("subtitle")}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5" noValidate autoComplete="off">
                    <Input
                      id="reset-email"
                      label={t("email_label")}
                      leftIcon={<IoMailOutline className="w-5 h-5" />}
                      type="email"
                      placeholder={t("email_placeholder")}
                      required
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      error={emailError ?? undefined}
                      isFocused={isFocused("email")}
                      onFocus={emailFocus.onFocus}
                      onBlur={handleEmailBlur}
                    />

                    <Input
                      id="reset-password"
                      label={t("password_label")}
                      leftIcon={<IoLockClosedOutline className="w-5 h-5" />}
                      placeholder={t("password_placeholder")}
                      required
                      isPassword
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      error={passwordError ?? undefined}
                      isFocused={isFocused("password")}
                      onFocus={passwordFocus.onFocus}
                      onBlur={handlePasswordBlur}
                    />

                    <Input
                      id="reset-confirm-password"
                      label={t("confirm_password_label")}
                      leftIcon={<IoLockClosedOutline className="w-5 h-5" />}
                      placeholder={t("confirm_password_placeholder")}
                      required
                      isPassword
                      value={confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      error={confirmPasswordError ?? undefined}
                      isFocused={isFocused("confirmPassword")}
                      onFocus={confirmPasswordFocus.onFocus}
                      onBlur={handleConfirmPasswordBlur}
                    />

                    <button
                      id="submit-reset-password"
                      type="submit"
                      disabled={!email || !password || !confirmPassword || !!emailError || !!passwordError || !!confirmPasswordError || resetMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 bg-[#171717] hover:border-[#8b6a55] border border-[#262626] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-full transition-all duration-300 uppercase tracking-wider text-xs sm:text-sm cursor-pointer"
                    >
                      {resetMutation.isPending ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {t("submitting")}
                        </>
                      ) : (
                        t("submit_btn")
                      )}
                    </button>
                  </form>

                  {/* Return to Login Link */}
                  <div className="flex justify-center mt-6">
                    <Link
                      id="back-to-login-link"
                      href={ROUTES.LOGIN}
                      className="flex items-center gap-1.5 text-xs text-[#737373] hover:text-white transition-all cursor-pointer font-medium"
                    >
                      <IoChevronBack className="w-3.5 h-3.5" />
                      <span>{t("back_to_login")}</span>
                    </Link>
                  </div>
                </div>
              ) : (
                // State C: Success Card Screen
                <div className="w-full text-center space-y-6 animate-fade-in">
                  <div className="w-16 h-16 mx-auto bg-[#8b6a55]/10 border border-[#8b6a55]/20 rounded-full flex items-center justify-center text-[#8b6a55] animate-pulse">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
                      {t("success.title")}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#a3a3a3] max-w-sm mx-auto leading-relaxed">
                      {t("success.subtitle")}
                    </p>
                  </div>

                  <div className="h-px bg-[#262626] my-6" />

                  <div className="pt-2">
                    <Link
                      id="success-login-btn"
                      href={ROUTES.LOGIN}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-[#171717] hover:border-[#8b6a55] hover:text-[#8b6a55] border border-[#262626] text-white font-semibold py-3.5 rounded-full transition-all duration-300 uppercase tracking-wider text-xs cursor-pointer"
                    >
                      <span>{t("success.login_btn")}</span>
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
