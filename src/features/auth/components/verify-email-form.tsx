"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/utils/api-error";
import { toast } from "sonner";
import { 
  IoMailOutline, 
  IoAlertCircleOutline, 
  CheckCircle2, 
  IoChevronBack 
} from "@/components/icons/solar";
import { OtpInputGroup } from "./otp-input-group";
import AmbientBackground from "@/components/layout/AmbientBackground";

interface VerifyEmailFormProps {
  otp?: string;
  email?: string;
}

type VerificationStatus = "verifying" | "otp" | "success" | "failure" | "already_verified";

export function VerifyEmailForm({ otp: initialOtp, email }: VerifyEmailFormProps) {
  const t = useTranslations("verifyEmail");
  const router = useRouter();

  // Local state to manage verification lifecycle
  const [status, setStatus] = useState<VerificationStatus>(initialOtp ? "verifying" : "otp");
  const [queryOtp, setQueryOtp] = useState<string | undefined>(initialOtp);
  const [otpValue, setOtpValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Countdown states
  const [redirectSeconds, setRedirectSeconds] = useState(3);
  const [resendCooldown, setResendCooldown] = useState(0);

  // References for timers
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Backend verifies the authenticated user with an OTP code.
  const verifyMutation = useMutation({
    mutationFn: (data: { otp: string }) => authService.verifyEmail(data),
    onSuccess: (response) => {
      if (response.success) {
        setStatus("success");
        setErrorMessage(null);
        // Start 3-second redirect countdown
        setRedirectSeconds(3);
      } else {
        const errorMsg = getApiErrorMessage(response, t("failure.general_error"));
        handleVerificationError(errorMsg);
      }
    },
    onError: (error) => {
      const errorMsg = getApiErrorMessage(error, t("failure.general_error"));
      handleVerificationError(errorMsg);
    },
  });

  // Helper to route error states correctly based on input method
  const handleVerificationError = (msg: string) => {
    // If we failed during auto-token verification, show the failure card
    if (status === "verifying") {
      setStatus("failure");
      // Map specific backend errors to clear key strings if necessary
      if (msg.includes("expired") || msg.includes("hết hạn")) {
        setErrorMessage(t("failure.token_expired"));
      } else if (msg.includes("invalid") || msg.includes("không hợp lệ")) {
        setErrorMessage(t("failure.token_invalid"));
      } else if (msg.includes("already verified") || msg.includes("đã được xác thực")) {
        setStatus("already_verified");
      } else {
        setErrorMessage(msg);
      }
    } else {
      // If we failed during manual OTP entry, keep them on OTP form but show error
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  // Mutation for resending verification email
  const resendMutation = useMutation({
    mutationFn: () => authService.resendVerification(),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(t("resend.success_toast"));
        setResendCooldown(60);
      } else {
        toast.error(getApiErrorMessage(response, t("failure.general_error")));
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("failure.general_error")));
    },
  });

  // Trigger auto-verification if an OTP is present in the URL on mount.
  useEffect(() => {
    if (queryOtp) {
      verifyMutation.mutate({ otp: queryOtp });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryOtp]);

  // Handle countdown for redirect on success
  useEffect(() => {
    if (status === "success") {
      redirectTimerRef.current = setInterval(() => {
        setRedirectSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(redirectTimerRef.current!);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);
    };
  }, [status, router]);

  // Handle countdown for resend cooldown lock
  useEffect(() => {
    if (resendCooldown > 0) {
      cooldownTimerRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownTimerRef.current!);
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

  // Auto-submit OTP when it reaches 6 digits
  const handleOtpChange = (val: string) => {
    setOtpValue(val);
    if (errorMessage) setErrorMessage(null); // Clear errors on type

    if (val.length === 6) {
      verifyMutation.mutate({ otp: val });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length < 6 || verifyMutation.isPending) return;
    verifyMutation.mutate({ otp: otpValue });
  };

  const handleResend = () => {
    if (resendCooldown > 0 || resendMutation.isPending) return;
    resendMutation.mutate();
  };

  // Switch to OTP form (used on failure screens to fallback)
  const handleRetryWithOtp = () => {
    // Clear URL parameters
    router.replace("/verify-email");
    setQueryOtp(undefined);
    setOtpValue("");
    setErrorMessage(null);
    setStatus("otp");
  };

  return (
    <div className="design-page flex min-h-screen justify-center items-center p-4 sm:p-8 relative overflow-hidden bg-surface-container-low">
      {/* Dynamic Background Effect */}
      <AmbientBackground />

      {/* Main card box with gradient borders on desktop */}
      <div className="relative flex w-full max-w-md rounded-[28px] shadow-[0_18px_48px_rgba(0,0,0,0.08)] animate-reveal-up">
        
        {/* Animated Border Background (Hidden on mobile for performance) */}
        {status !== "success" && (
          <div className="absolute inset-[-2px] rounded-[10px] overflow-hidden pointer-events-none z-0 hidden sm:block">
            <div 
              className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite]" 
              style={{ backgroundImage: 'conic-gradient(from 0deg, transparent 0 240deg, rgba(255,56,92,0.24) 300deg, #FF385C 360deg)' }}
            />
          </div>
        )}

        {/* Inner surface */}
        <div className="relative z-10 flex w-full flex-col items-center overflow-hidden rounded-[28px] border border-border bg-white p-6 text-center sm:p-8">
          
          {/* Brand/App name at the top */}
          <div className="mb-6">
            <span className="font-bold text-primary text-lg uppercase tracking-wider">
              {t("brand_name")}
            </span>
          </div>

          {/* 1. STATE: Auto-verifying token */}
          {status === "verifying" && (
            <div className="py-8 space-y-6 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-border border-t-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-on-surface uppercase tracking-wide">
                  {t("verifying.title")}
                </h2>
                <p className="text-sm text-on-surface-subtle max-w-xs">
                  {t("verifying.subtitle")}
                </p>
              </div>
            </div>
          )}

          {/* 2. STATE: Success verification */}
          {status === "success" && (
            <div className="py-8 space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary animate-[pulse_2s_infinite]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-on-surface uppercase tracking-wide">
                  {t("success.title")}
                </h2>
                <p className="text-sm text-on-surface-subtle max-w-xs">
                  {t("success.subtitle")}
                </p>
              </div>
              <div className="pt-4 space-y-3 w-full">
                <p className="text-xs italic text-on-surface-subtle">
                  {t("success.redirect", { seconds: redirectSeconds })}
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="w-full flex items-center justify-center bg-primary hover:bg-primary-hover border border-primary text-white font-semibold py-3 rounded-full transition-all duration-300 uppercase tracking-wider text-xs"
                >
                  {t("success.home_btn")}
                </button>
              </div>
            </div>
          )}

          {/* 3. STATE: Failure state */}
          {status === "failure" && (
            <div className="py-6 space-y-6 flex flex-col items-center w-full">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500">
                <IoAlertCircleOutline className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-on-surface uppercase tracking-wide">
                  {t("failure.title")}
                </h2>
                <p className="text-sm text-red-400 max-w-xs px-2">
                  {errorMessage || t("failure.general_error")}
                </p>
              </div>
              <div className="pt-4 w-full">
                <button
                  onClick={handleRetryWithOtp}
                  className="w-full flex items-center justify-center bg-primary hover:bg-primary-hover border border-primary text-white font-semibold py-3 rounded-full transition-all duration-300 uppercase tracking-wider text-xs"
                >
                  {t("failure.retry_btn")}
                </button>
              </div>
            </div>
          )}

          {/* 4. STATE: Already Verified */}
          {status === "already_verified" && (
            <div className="py-6 space-y-6 flex flex-col items-center w-full">
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-on-surface uppercase tracking-wide">
                  {t("already_verified.title")}
                </h2>
                <p className="text-sm text-on-surface-subtle max-w-xs px-2">
                  {t("already_verified.subtitle")}
                </p>
              </div>
              <div className="pt-4 w-full">
                <button
                  onClick={() => router.push("/")}
                  className="w-full flex items-center justify-center bg-primary hover:bg-primary-hover border border-primary text-white font-semibold py-3 rounded-full transition-all duration-300 uppercase tracking-wider text-xs"
                >
                  {t("already_verified.home_btn")}
                </button>
              </div>
            </div>
          )}

          {/* 5. STATE: Manual OTP entry */}
          {status === "otp" && (
            <form onSubmit={handleManualSubmit} className="w-full space-y-6 flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary mb-2">
                <IoMailOutline className="w-6 h-6" />
              </div>

              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold text-on-surface uppercase tracking-wide">
                  {t("otp.title")}
                </h2>
                {email ? (
                  <p className="text-xs text-on-surface-subtle">
                    {t("otp.subtitle")}{" "}
                     <span className="text-on-surface font-semibold block sm:inline mt-1 sm:mt-0 font-mono">
                      {email}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-on-surface-subtle">
                    {t("otp.description")}
                  </p>
                )}
              </div>

              {/* OTP Inputs Group */}
              <div className="py-2 w-full">
                <OtpInputGroup
                  value={otpValue}
                  onChange={handleOtpChange}
                  error={!!errorMessage}
                  disabled={verifyMutation.isPending}
                />
                {errorMessage && (
                  <p className="text-xs text-red-500 mt-3 font-medium transition-all">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Submit button (Main verification trigger if manual submit) */}
              <button
                type="submit"
                disabled={otpValue.length < 6 || verifyMutation.isPending}
                 className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover border border-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-all duration-300 uppercase tracking-wider text-xs"
              >
                {verifyMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t("otp.submitting")}
                  </>
                ) : (
                  t("otp.submit_btn")
                )}
              </button>

              {/* Resend Verification Email Section */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 pt-2 text-xs">
                <span className="text-on-surface-subtle">{t("resend.prompt")}</span>
                {resendCooldown > 0 ? (
                  <span className="font-medium text-on-surface-subtle">
                    {t("resend.countdown", { seconds: resendCooldown })}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendMutation.isPending}
                    className="text-primary hover:text-[#c59a5f] hover:underline font-semibold disabled:opacity-50 disabled:no-underline transition-all cursor-pointer"
                  >
                    {resendMutation.isPending ? t("otp.submitting") : t("resend.btn")}
                  </button>
                )}
              </div>

              {/* Back to Login/Home button for guests */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                   className="flex items-center gap-1 text-xs text-on-surface-subtle hover:text-on-surface transition-all cursor-pointer"
                >
                  <IoChevronBack className="w-3.5 h-3.5" />
                  <span>{t("back_to_login")}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
