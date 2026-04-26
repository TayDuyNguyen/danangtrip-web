"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import { useAuth } from "../hooks/use-auth";
import { Input } from "@/components/ui";

import { useFieldFocus } from "@/hooks/use-field-focus";

interface LoginFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export function LoginForm({ onSuccess, redirectUrl }: LoginFormProps) {
  const t = useTranslations("login");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error } = useAuth();

  const { isFocused, getFocusProps } = useFieldFocus<"email" | "password">();

  const emailFocus = getFocusProps("email");
  const passwordFocus = getFocusProps("password");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (result.success) {
      onSuccess?.();
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="design-page flex min-h-screen justify-center items-center p-4 sm:p-8">
      <div className="relative flex w-full max-w-md lg:max-w-4xl lg:w-3/4 xl:w-2/3 h-auto lg:h-[550px] shadow-[0_0_40px_rgba(139,106,85,0.12)] rounded-xl glow-effect">
        
        {/* Animated Border Background */}
        <div className="absolute inset-[-2px] rounded-[10px] overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite]" 
            style={{ backgroundImage: 'conic-gradient(from 0deg, transparent 0 240deg, rgba(139,106,85,0.3) 300deg, #8b6a55 360deg)' }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 flex w-full h-full rounded-xl overflow-hidden bg-[#080808] border border-[#262626]">
          {/* Left panel - gradient background */}
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

        {/* Right panel - form */}
        <div className="flex flex-1 items-center justify-center p-5 sm:p-8 bg-[#080808]">
          <div className="w-full max-w-md">
            {/* Mobile title */}
            <div className="flex items-center justify-center mb-6 sm:mb-8 lg:hidden">
              <span className="font-bold text-[#8b6a55] text-xl text-center uppercase">
                {t("title")}
              </span>
            </div>

            <h2 className="hidden lg:block text-3xl font-bold uppercase text-white mb-8 text-center lg:text-left">
              {t("title")}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate autoComplete="off">
              <Input
                label={t("email_label")}
                leftIcon={<IoMailOutline className="w-5 h-5" />}
                type="email"
                placeholder={t("email_placeholder")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isFocused={isFocused("email")}
                onFocus={emailFocus.onFocus}
                onBlur={emailFocus.onBlur}
              />

              <Input
                label={t("password_label")}
                leftIcon={<IoLockClosedOutline className="w-5 h-5" />}
                placeholder={t("password_placeholder")}
                required
                isPassword
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isFocused={isFocused("password")}
                onFocus={passwordFocus.onFocus}
                onBlur={passwordFocus.onBlur}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[#a3a3a3] cursor-pointer hover:text-white transition">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#8b6a55] w-4 h-4 rounded border-[#404040]"
                  />
                  {t("remember_me")}
                </label>
                <Link
                  href={ROUTES.CONTACT}
                  className="text-sm text-[#8b6a55] hover:text-[#c59a5f] hover:underline transition"
                >
                  {t("forgot_password")}
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#171717] hover:border-[#8b6a55] border border-[#262626] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-all duration-300 uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t("logging_in")}
                  </>
                ) : (
                  t("login_button")
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#262626]" />
              <span className="text-sm text-[#737373]">{t("or_login_with")}</span>
              <div className="flex-1 h-px bg-[#262626]" />
            </div>

            {/* Social login */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 border border-[#262626] rounded-lg py-2.5 hover:bg-[#171717] transition text-sm font-medium text-[#d4d4d4] hover:text-white">
                <GoogleIcon />
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-[#262626] rounded-lg py-2.5 hover:bg-[#171717] transition text-sm font-medium text-[#d4d4d4] hover:text-white">
                <FacebookIcon />
                Facebook
              </button>
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-[#737373] mt-6">
              {t("no_account")}{" "}
              <Link
                href="/register"
                className="text-[#8b6a55] font-medium hover:text-[#c59a5f] hover:underline transition"
              >
                {t("register_now")}
              </Link>
            </p>
          </div>
        </div>
        </div> {/* End of Main Content Container */}
      </div>
    </div>
  );
}
