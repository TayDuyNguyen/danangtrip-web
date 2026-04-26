"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline } from "react-icons/io5";
import { useAuth } from "../hooks/use-auth";
import { Input } from "@/components/ui";
import { useFieldFocus } from "@/hooks/use-field-focus";

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

export function RegisterForm({ onSuccess, redirectUrl }: RegisterFormProps) {
  const t = useTranslations("register");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const { register, isLoading, error } = useAuth();
  const { isFocused, getFocusProps } = useFieldFocus<"name" | "email" | "password" | "confirmPassword">();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      // In a real app, I'd set a specific error for confirm password
      return;
    }

    const result = await register({
      username: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
    });

    if (result.success) {
      onSuccess?.();
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        router.push("/login");
      }
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="design-page flex min-h-screen justify-center items-center p-4 sm:p-8 mt-16 md:mt-0">
      <div className="relative flex w-full max-w-md lg:max-w-4xl lg:w-3/4 xl:w-2/3 h-auto lg:h-[700px] shadow-[0_0_40px_rgba(139,106,85,0.12)] rounded-xl glow-effect">
        
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
            <h2 className="text-3xl font-bold uppercase text-white mb-8 text-center lg:text-left tracking-tight">
              {t("title")}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate autoComplete="off">
              <Input
                label={t("name_label")}
                name="name"
                leftIcon={<IoPersonOutline className="w-5 h-5" />}
                placeholder={t("name_placeholder")}
                required
                value={formData.name}
                onChange={handleChange}
                isFocused={isFocused("name")}
                {...getFocusProps("name")}
              />

              <Input
                label={t("email_label")}
                name="email"
                leftIcon={<IoMailOutline className="w-5 h-5" />}
                type="email"
                placeholder={t("email_placeholder")}
                required
                value={formData.email}
                onChange={handleChange}
                isFocused={isFocused("email")}
                {...getFocusProps("email")}
              />

              <Input
                label={t("password_label")}
                name="password"
                leftIcon={<IoLockClosedOutline className="w-5 h-5" />}
                placeholder={t("password_placeholder")}
                required
                isPassword
                value={formData.password}
                onChange={handleChange}
                isFocused={isFocused("password")}
                {...getFocusProps("password")}
              />

              <Input
                label={t("confirm_password_label")}
                name="confirmPassword"
                leftIcon={<IoLockClosedOutline className="w-5 h-5" />}
                placeholder={t("confirm_password_placeholder")}
                required
                isPassword
                value={formData.confirmPassword}
                onChange={handleChange}
                isFocused={isFocused("confirmPassword")}
                {...getFocusProps("confirmPassword")}
              />

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
                    {t("registering")}
                  </>
                ) : (
                  t("register_button")
                )}
              </button>
            </form>

            <p className="text-center text-sm text-[#737373] mt-6">
              {t("has_account")}{" "}
              <Link
                href="/login"
                className="text-[#8b6a55] font-medium hover:text-[#c59a5f] hover:underline transition"
              >
                {t("login_now")}
              </Link>
            </p>
          </div>
        </div>
        </div> {/* End of Main Content Container */}
      </div>
    </div>
  );

}
