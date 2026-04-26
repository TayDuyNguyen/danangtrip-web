"use client";
import React from "react";
import { cn } from "@/utils/string";
import { useTranslations } from "next-intl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const t = useTranslations("common");
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-full border transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[#171717] text-white border-[#262626] hover:border-[#8b6a55] hover:text-[#8b6a55] focus-visible:ring-[#8b6a55]",
      secondary:
        "bg-transparent text-[#737373] border-[#262626] hover:text-white hover:border-[#404040] focus-visible:ring-[#404040]",
      danger: "bg-transparent text-red-300 border-red-500/40 hover:bg-red-500/10 focus-visible:ring-red-400",
      link: "bg-transparent text-[#737373] border-transparent px-0 py-0 rounded-none hover:text-white focus-visible:ring-[#404040]",
    };


    const sizes = {
      sm: "px-3 py-2 text-xs",
      md: "px-4 py-3 text-sm",
      lg: "px-5 py-3 text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t("loading")}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
