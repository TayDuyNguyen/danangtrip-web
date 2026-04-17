import React, {
  type ReactNode,
  type InputHTMLAttributes,
  type HTMLInputTypeAttribute,
  useState,
} from "react";
import { cn } from "@/utils/string";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  isPassword?: boolean;
  isFocused?: boolean;
  type?: HTMLInputTypeAttribute;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      isPassword = false,
      isFocused = false,
      type = "text",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={cn("w-full group", className)}>
        {/* Floating label - hiện khi focus hoặc có error */}
        {label && (
          <label
            className={cn(
              "block text-xs font-semibold mb-1 uppercase tracking-wider transition-all duration-300 transform",
              isFocused
                ? "text-cyan-400 translate-y-0 opacity-100"
                : "text-transparent -translate-y-1 opacity-0",
              error && "text-red-500 opacity-100 translate-y-0"
            )}
          >
            {label}
          </label>
        )}

        {/* Input container */}
        <div
          className={cn(
            "flex items-center border-b px-3 gap-3 transition-all duration-500 ease-out",
            error
              ? "border-red-500"
              : isFocused
              ? "border-cyan-400"
              : "border-gray-700",
            isFocused ? "bg-gray-800/20" : "bg-transparent"
          )}
        >
          {/* Left Icon */}
          {leftIcon && (
            <span
              className={cn(
                "text-xl transition-colors duration-300",
                isFocused ? "text-cyan-400" : "text-gray-500"
              )}
            >
              {leftIcon}
            </span>
          )}

          {/* Input field */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full py-3 bg-transparent outline-none placeholder-gray-600",
              "transition-all duration-300 focus:placeholder-transparent",
              "text-sm sm:text-base text-white",
              leftIcon ? "pl-1" : "",
              isPassword ? "pr-8" : ""
            )}
            {...props}
          />

          {/* Password toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="p-2 -mr-2 text-gray-500 hover:text-cyan-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-full"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Error message */}
        <div className="h-5 overflow-hidden">
          {error && (
            <p className="mt-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1 duration-300">
              {error}
            </p>
          )}
        </div>

        {/* Helper text */}
        {helperText && !error && (
          <p className="text-gray-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
