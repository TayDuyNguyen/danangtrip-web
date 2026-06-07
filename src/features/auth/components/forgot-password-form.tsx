"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { forgotPasswordSchema } from "../validators/auth.schema";
import { getApiErrorMessage } from "@/utils/api-error";
import { toast } from "sonner";
import { IoMailOutline, IoChevronBack, CheckCircle2 } from "@/components/icons/solar";
import { Input } from "@/components/ui";
import { useFieldFocus } from "@/hooks/use-field-focus";
import AmbientBackground from "@/components/layout/AmbientBackground";

interface ForgotPasswordFormProps {
  email?: string;
}

export function ForgotPasswordForm({ email: initialEmail = "" }: ForgotPasswordFormProps) {
  const t = useTranslations("forgotPassword");
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { isFocused, getFocusProps } = useFieldFocus<"email">();
  const emailFocus = getFocusProps("email");

  // Handle countdown for resend cooldown lock
  useEffect(() => {
    if (resendCooldown > 0) {
      cooldownTimerRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, [resendCooldown]);

  // Mutation for requesting password reset
  const requestMutation = useMutation({
    mutationFn: (data: { email: string }) => authService.forgotPassword(data),
    onSuccess: (response) => {
      if (response.success) {
        setIsSuccess(true);
        setResendCooldown(60);
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

  // Dynamic validation on email change
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailError) {
      const result = forgotPasswordSchema.safeParse({ email: val });
      if (result.success) {
        setEmailError(null);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    emailFocus.onBlur(e);
    if (email) {
      const result = forgotPasswordSchema.safeParse({ email });
      if (!result.success) {
        const errorMsg = result.error.issues[0]?.message;
        // Check if error message is an i18n key or simple text
        setEmailError(errorMsg ? (errorMsg.includes(".") ? t(errorMsg as Parameters<typeof t>[0]) : errorMsg) : null);
      } else {
        setEmailError(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Explicit Validation before submission
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      const errorMsg = result.error.issues[0]?.message;
      setEmailError(errorMsg ? (errorMsg.includes(".") ? t(errorMsg as Parameters<typeof t>[0]) : errorMsg) : null);
      toast.error(t("failure.general_error"));
      return;
    }

    setEmailError(null);
    requestMutation.mutate({ email });
  };

  const handleResend = () => {
    if (resendCooldown > 0 || requestMutation.isPending) return;
    requestMutation.mutate(
      { email },
      {
        onSuccess: (response) => {
          if (response.success) {
            toast.success(t("success.resend_success_toast"));
          }
        },
      }
    );
  };

  return (
    <div className="design-page flex min-h-screen justify-center items-center p-4 sm:p-8 relative overflow-hidden bg-surface-container-low">
      {/* Dynamic Background Effect */}
      <AmbientBackground />

      <div className="relative flex h-auto w-full max-w-md rounded-[28px] shadow-[0_18px_48px_rgba(0,0,0,0.08)] animate-reveal-up lg:min-h-[550px] lg:w-3/4 lg:max-w-4xl xl:w-2/3">
        
        {/* Animated Border Background (Hidden on mobile for performance) */}
        <div className="absolute inset-[-2px] rounded-[10px] overflow-hidden pointer-events-none z-0 hidden sm:block">
          <div 
            className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite]" 
            style={{ backgroundImage: 'conic-gradient(from 0deg, transparent 0 240deg, rgba(255,56,92,0.24) 300deg, #FF385C 360deg)' }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 flex w-full h-full rounded-[28px] overflow-hidden bg-white border border-border">
          
          {/* Left panel - brand image/gradient layout */}
          <div
            className="hidden lg:flex flex-1 bg-linear-to-br from-[#5c3822] to-[#080808] flex-col pt-12 pl-8 pr-16 text-white relative"
            style={{ clipPath: "polygon(0 0, 100% 0, 60% 100%, 0% 100%)" }}
          >
            <h1 className="text-4xl mb-4 font-bold uppercase tracking-wide">
              {t("welcome_title")}
            </h1>
            <p className="text-[#d4d4d4] text-lg">
              {t("welcome_subtitle")}
            </p>
          </div>

          {/* Right panel - Form & Success content */}
          <div className="flex flex-1 items-center justify-center p-5 sm:p-8 bg-white">
            <div className="w-full max-w-md flex flex-col items-center">
              
              {/* Brand Name on Mobile */}
              <div className="flex items-center justify-center mb-6 lg:hidden">
                <span className="font-bold text-primary text-xl text-center uppercase tracking-wider">
                  {t("brand_name")}
                </span>
              </div>

              {!isSuccess ? (
                // 1. STATE: Email Entry Form
                <div className="w-full">
                  <h2 className="text-2xl sm:text-3xl font-semibold uppercase text-on-surface mb-2 text-center lg:text-left">
                    {t("title")}
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-subtle mb-8 text-center lg:text-left">
                    {t("subtitle")}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6" noValidate autoComplete="off">
                    <Input
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
                      onBlur={handleBlur}
                    />

                    <button
                      type="submit"
                      disabled={!email || !!emailError || requestMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover border border-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-full transition-all duration-300 uppercase tracking-wider text-xs sm:text-sm"
                    >
                      {requestMutation.isPending ? (
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

                  {/* Back to Login Link */}
                  <div className="flex justify-center mt-6">
                    <Link
                      href={ROUTES.LOGIN}
                      className="flex items-center gap-1.5 text-xs text-on-surface-subtle hover:text-on-surface transition-all cursor-pointer font-medium"
                    >
                      <IoChevronBack className="w-3.5 h-3.5" />
                      <span>{t("back_to_login")}</span>
                    </Link>
                  </div>
                </div>
              ) : (
                // 2. STATE: Success Notification Card
                <div className="w-full text-center space-y-6 animate-fade-in">
                  <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary animate-pulse">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-on-surface uppercase tracking-wide">
                      {t("success.title")}
                    </h2>
                    <p className="text-xs sm:text-sm text-on-surface-subtle max-w-sm mx-auto leading-relaxed">
                      {t("success.subtitle")}
                    </p>
                  </div>

                  {/* Divider line */}
                  <div className="h-px bg-border my-6" />

                  {/* Resend Cooldown Handler */}
                  <div className="flex flex-col items-center justify-center gap-2 text-xs">
                    <span className="text-on-surface-subtle">{t("success.resend_prompt")}</span>
                    {resendCooldown > 0 ? (
                        <span className="text-on-surface-subtle font-medium bg-[#f7f7f7] px-3.5 py-1.5 rounded-full border border-border">
                        {t("success.resend_cooldown", { seconds: resendCooldown })}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={requestMutation.isPending}
                        className="text-primary hover:text-[#c59a5f] hover:underline font-semibold disabled:opacity-50 disabled:no-underline transition-all cursor-pointer"
                      >
                        {t("success.resend_btn")}
                      </button>
                    )}
                  </div>

                  {/* Back to Login Button */}
                  <div className="pt-4">
                    <Link
                      href={ROUTES.LOGIN}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover border border-primary text-white font-semibold py-3.5 rounded-full transition-all duration-300 uppercase tracking-wider text-xs"
                    >
                      <IoChevronBack className="w-3.5 h-3.5" />
                      <span>{t("back_to_login")}</span>
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
